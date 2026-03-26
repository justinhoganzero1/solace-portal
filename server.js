import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const MARKET = {
  enabled: true,
  refreshMs: 2500,
  cgPerPage: 250,
  cgPages: 2,
  dexEnabled: true,
  dexChains: ['solana', 'ethereum', 'base'],
  dexQuery: 'usd',
  dexMaxPairs: 60,
  dexBirthMaxAgeMs: 15 * 60 * 1000,
};

const marketState = {
  startedAt: Date.now(),
  lastUpdateAt: 0,
  assets: new Map(),
  seenDexPairs: new Set(),
  source: {
    coingecko: { ok: false, lastUpdateAt: 0, lastError: null },
    binance: { ok: false, lastUpdateAt: 0, lastError: null },
    dex: { ok: false, lastUpdateAt: 0, lastError: null },
  },
};

const marketEvents = [];
const MARKET_EVENTS_MAX = 120;

const cgChartCache = new Map();
const CG_CHART_TTL_MS = 60 * 1000;

const sseClients = new Set();

// Stripe webhooks need the raw body; we attach JSON parsing after the webhook route.

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceIdWeekly = process.env.STRIPE_PRICE_ID_WEEKLY;
const successUrl = process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/?stripe=success';
const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/?stripe=cancel';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' }) : null;

const billingDbPath = path.join(__dirname, 'billing-db.json');
const auditDbPath = path.join(__dirname, 'audit-db.json');

function readBillingDb() {
  try {
    const raw = fs.readFileSync(billingDbPath, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeBillingDb(db) {
  fs.writeFileSync(billingDbPath, JSON.stringify(db, null, 2));
}

function readAuditDb() {
  try {
    const raw = fs.readFileSync(auditDbPath, 'utf8');
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAuditDb(arr) {
  fs.writeFileSync(auditDbPath, JSON.stringify(arr, null, 2));
}

function createBillingRow() {
  return { subscribed: false, upfrontPaid: false, upfrontForTotal: 0, feesTotal: 0 };
}

function appendAudit(evt) {
  const e = {
    id: `E-${String(Date.now())}-${Math.floor(Math.random() * 1e6)}`,
    ts: Date.now(),
    ...evt,
  };
  const db = readAuditDb();
  db.unshift(e);
  if (db.length > 5000) db.length = 5000;
  writeAuditDb(db);
  return e;
}

const auditClients = new Set();
function broadcastAudit(e) {
  const msg = `data: ${safeJson({ type: 'audit_event', event: e })}\n\n`;
  for (const res of auditClients) {
    try {
      res.write(msg);
    } catch {
      // ignore
    }
  }
}

function getEmailFromReq(req) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  return email;
}

function isValidEmail(email) {
  return /.+@.+\..+/.test(email);
}

function withQuery(url, params) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) {
    u.searchParams.set(k, v);
  }
  return u.toString();
}

function requireStripe(res) {
  if (!stripe) {
    res.status(500).json({
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.',
    });
    return false;
  }
  return true;
}

function safeJson(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return JSON.stringify({ error: 'Failed to serialize' });
  }
}

function toNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

function upsertAsset(key, patch) {
  const prev = marketState.assets.get(key) || { key };
  marketState.assets.set(key, { ...prev, ...patch, key });
}

function pushMarketEvent(evt) {
  marketEvents.unshift({ ...evt, ts: Date.now() });
  if (marketEvents.length > MARKET_EVENTS_MAX) marketEvents.length = MARKET_EVENTS_MAX;
}

async function ingestCoinGecko() {
  const t0 = Date.now();
  try {
    const out = [];
    for (let page = 1; page <= MARKET.cgPages; page++) {
      const url = withQuery('https://api.coingecko.com/api/v3/coins/markets', {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: String(MARKET.cgPerPage),
        page: String(page),
        sparkline: 'false',
        price_change_percentage: '24h',
      });
      const res = await fetch(url, {
        headers: {
          accept: 'application/json',
        },
      });
      if (!res.ok) throw new Error(`CoinGecko (${res.status})`);
      const data = await res.json();
      if (Array.isArray(data)) out.push(...data);
    }

    for (const row of out) {
      const symbol = String(row?.symbol || '').toUpperCase();
      const name = String(row?.name || symbol || row?.id || '');
      const price = toNum(row?.current_price);
      const chg24 = toNum(row?.price_change_percentage_24h);
      if (!symbol || price == null || chg24 == null) continue;
      upsertAsset(`cg:${String(row?.id || symbol).toLowerCase()}`, {
        id: String(row?.id || ''),
        symbol,
        name,
        priceUsd: price,
        chg24Pct: chg24,
        marketCapUsd: toNum(row?.market_cap),
        vol24Usd: toNum(row?.total_volume),
        source: 'coingecko',
        updatedAt: Date.now(),
      });
    }

    marketState.source.coingecko.ok = true;
    marketState.source.coingecko.lastError = null;
    marketState.source.coingecko.lastUpdateAt = Date.now();
  } catch (e) {
    marketState.source.coingecko.ok = false;
    marketState.source.coingecko.lastError = String(e?.message || e);
  } finally {
    void t0;
  }
}

async function ingestBinance() {
  const t0 = Date.now();
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Binance (${res.status})`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Binance payload');

    for (const row of data) {
      const sym = String(row?.symbol || '');
      if (!sym.endsWith('USDT')) continue;
      const base = sym.slice(0, -4);
      const price = toNum(row?.lastPrice);
      const chg24 = toNum(row?.priceChangePercent);
      if (!base || price == null || chg24 == null) continue;
      upsertAsset(`bn:${sym.toLowerCase()}`, {
        id: sym,
        symbol: base,
        name: base,
        priceUsd: price,
        chg24Pct: chg24,
        vol24Usd: toNum(row?.quoteVolume),
        source: 'binance',
        updatedAt: Date.now(),
      });
    }

    marketState.source.binance.ok = true;
    marketState.source.binance.lastError = null;
    marketState.source.binance.lastUpdateAt = Date.now();
  } catch (e) {
    marketState.source.binance.ok = false;
    marketState.source.binance.lastError = String(e?.message || e);
  } finally {
    void t0;
  }
}

async function ingestDexScreener() {
  if (!MARKET.dexEnabled) return;
  const t0 = Date.now();
  try {
    const now = Date.now();

    for (const chain of MARKET.dexChains) {
      const url = withQuery('https://api.dexscreener.com/latest/dex/search', { q: MARKET.dexQuery });
      const res = await fetch(url, {
        headers: { accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`DexScreener (${res.status})`);
      const payload = await res.json();
      const pairs = Array.isArray(payload?.pairs) ? payload.pairs : [];

      let used = 0;
      for (const p of pairs) {
        if (used >= MARKET.dexMaxPairs) break;
        const chainId = String(p?.chainId || '').toLowerCase();
        if (!chainId || chainId !== chain) continue;

        const pairAddress = String(p?.pairAddress || '');
        if (!pairAddress) continue;
        const key = `dx:${chainId}:${pairAddress.toLowerCase()}`;

        const baseSymbol = String(p?.baseToken?.symbol || '').toUpperCase();
        const quoteSymbol = String(p?.quoteToken?.symbol || '').toUpperCase();
        const baseTokenAddress = String(p?.baseToken?.address || '').trim();
        const quoteTokenAddress = String(p?.quoteToken?.address || '').trim();
        const name = baseSymbol ? `${baseSymbol}/${quoteSymbol || 'USD'}` : String(p?.baseToken?.name || '');
        const priceUsd = toNum(p?.priceUsd);
        const chg24 = toNum(p?.priceChange?.h24);
        const vol24 = toNum(p?.volume?.h24);
        const liqUsd = toNum(p?.liquidity?.usd);

        if (!baseSymbol || priceUsd == null) continue;

        upsertAsset(key, {
          id: pairAddress,
          symbol: baseSymbol,
          name,
          priceUsd,
          chg24Pct: chg24,
          vol24Usd: vol24,
          marketCapUsd: null,
          source: 'dexscreener',
          updatedAt: Date.now(),
          dex: {
            chainId,
            pairAddress,
            quote: quoteSymbol,
            baseTokenAddress: baseTokenAddress || null,
            quoteTokenAddress: quoteTokenAddress || null,
            liquidityUsd: liqUsd,
            url: String(p?.url || ''),
            pairCreatedAt: toNum(p?.pairCreatedAt),
          },
        });

        const createdAt = toNum(p?.pairCreatedAt);
        if (createdAt != null && now - createdAt <= MARKET.dexBirthMaxAgeMs && !marketState.seenDexPairs.has(key)) {
          marketState.seenDexPairs.add(key);
          pushMarketEvent({
            type: 'DEX_BIRTH',
            key,
            chainId,
            symbol: baseSymbol,
            name,
            priceUsd,
            liquidityUsd: liqUsd,
            url: String(p?.url || ''),
          });
        }

        used += 1;
      }
    }

    marketState.source.dex.ok = true;
    marketState.source.dex.lastError = null;
    marketState.source.dex.lastUpdateAt = Date.now();
  } catch (e) {
    marketState.source.dex.ok = false;
    marketState.source.dex.lastError = String(e?.message || e);
  } finally {
    void t0;
  }
}

function snapshotMarket(limit = 1200) {
  const all = Array.from(marketState.assets.values());
  all.sort((a, b) => {
    const av = Math.abs(Number(a?.vol24Usd || 0));
    const bv = Math.abs(Number(b?.vol24Usd || 0));
    return bv - av;
  });
  const items = all.slice(0, limit).map((a) => ({
    key: a.key,
    id: a.id,
    symbol: a.symbol,
    name: a.name,
    priceUsd: a.priceUsd,
    chg24Pct: a.chg24Pct,
    vol24Usd: a.vol24Usd,
    marketCapUsd: a.marketCapUsd,
    source: a.source,
    updatedAt: a.updatedAt,
    dex: a.dex || null,
  }));

  return {
    type: 'market_snapshot',
    serverTs: Date.now(),
    startedAt: marketState.startedAt,
    lastUpdateAt: marketState.lastUpdateAt,
    source: marketState.source,
    events: marketEvents.slice(0, 40),
    items,
  };
}

function broadcastSse(payload) {
  const msg = `data: ${safeJson(payload)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(msg);
    } catch {
      // ignore
    }
  }
}

async function marketLoopTick() {
  if (!MARKET.enabled) return;
  const t = Date.now();
  try {
    await Promise.allSettled([ingestCoinGecko(), ingestBinance(), ingestDexScreener()]);
  } finally {
    marketState.lastUpdateAt = Date.now();
    if (sseClients.size > 0 && t - marketState.lastUpdateAt < MARKET.refreshMs * 2) {
      broadcastSse(snapshotMarket());
    }
  }
}

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    if (!requireStripe(res)) return;
    if (!webhookSecret) {
      res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
      return;
    }

    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const db = readBillingDb();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = String(session.customer_email || session.client_reference_id || '').trim().toLowerCase();
      if (isValidEmail(email)) {
        db[email] = db[email] || createBillingRow();

        if (session.mode === 'subscription') {
          db[email].subscribed = true;
        }

        if (session.mode === 'payment') {
          const feeKind = String(session.metadata?.feeKind || '').trim().toLowerCase();
          const totalAmount = Number(session.metadata?.totalAmount);
          const tradeNotional = Number(session.metadata?.tradeNotional);
          const feeUsd = Number(session.metadata?.feeUsd);

          if (feeKind === 'upfront' && Number.isFinite(totalAmount) && totalAmount > 0) {
            db[email].upfrontPaid = true;
            db[email].upfrontForTotal = totalAmount;
          }

          if (feeKind === 'trade' && Number.isFinite(tradeNotional) && tradeNotional > 0) {
            db[email].upfrontPaid = false;
            db[email].upfrontForTotal = 0;
          }

          if (Number.isFinite(feeUsd) && feeUsd > 0) {
            db[email].feesTotal = Number(db[email].feesTotal || 0) + feeUsd;
          }
        }

        writeBillingDb(db);
      }
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).send(e?.message || String(e));
  }
});

function get0xBaseUrl(chainId) {
  const id = Number(chainId);
  if (id === 8453) return 'https://base.api.0x.org';
  if (id === 1) return 'https://api.0x.org';
  return null;
}

app.get('/api/0x/approve/allowance', async (req, res) => {
  try {
    const chainId = Number(req.query?.chainId || 8453);
    const sellToken = String(req.query?.sellToken || '').trim();
    const owner = String(req.query?.owner || '').trim();
    const base = get0xBaseUrl(chainId);
    if (!base) return res.status(400).json({ error: 'Unsupported chainId' });
    if (!sellToken || !owner) return res.status(400).json({ error: 'Missing sellToken/owner' });

    const url = withQuery(`${base}/swap/v1/approve/allowance`, { sellToken, owner });
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    const txt = await r.text();
    if (!r.ok) return res.status(502).json({ error: `0x allowance (${r.status})`, details: txt.slice(0, 800) });
    res.type('application/json').send(txt);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.get('/api/0x/approve/transaction', async (req, res) => {
  try {
    const chainId = Number(req.query?.chainId || 8453);
    const sellToken = String(req.query?.sellToken || '').trim();
    const amount = String(req.query?.amount || '').trim();
    const base = get0xBaseUrl(chainId);
    if (!base) return res.status(400).json({ error: 'Unsupported chainId' });
    if (!sellToken) return res.status(400).json({ error: 'Missing sellToken' });

    const q = { sellToken };
    if (amount) q.amount = amount;
    const url = withQuery(`${base}/swap/v1/approve/transaction`, q);
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    const txt = await r.text();
    if (!r.ok) return res.status(502).json({ error: `0x approve tx (${r.status})`, details: txt.slice(0, 800) });
    res.type('application/json').send(txt);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.get('/api/0x/quote', async (req, res) => {
  try {
    const chainId = Number(req.query?.chainId || 8453);
    const buyToken = String(req.query?.buyToken || '').trim();
    const sellToken = String(req.query?.sellToken || '').trim();
    const sellAmount = String(req.query?.sellAmount || '').trim();
    const takerAddress = String(req.query?.takerAddress || '').trim();
    const slippageBps = Number(req.query?.slippageBps || 75);
    const base = get0xBaseUrl(chainId);
    if (!base) return res.status(400).json({ error: 'Unsupported chainId' });
    if (!buyToken || !sellToken || !sellAmount) return res.status(400).json({ error: 'Missing buyToken/sellToken/sellAmount' });

    const q = {
      buyToken,
      sellToken,
      sellAmount,
      slippagePercentage: String(Math.max(0.001, Math.min(0.5, slippageBps / 10_000))),
    };
    if (takerAddress) q.takerAddress = takerAddress;
    const url = withQuery(`${base}/swap/v1/quote`, q);
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    const txt = await r.text();
    if (!r.ok) return res.status(502).json({ error: `0x quote (${r.status})`, details: txt.slice(0, 1200) });
    res.type('application/json').send(txt);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.get('/api/binance/klines', async (req, res) => {
  try {
    const symbol = String(req.query?.symbol || '').trim().toUpperCase();
    const interval = String(req.query?.interval || '1m').trim();
    const limit = Math.min(1000, Math.max(10, Number(req.query?.limit || 500)));

    if (!symbol || !/^[A-Z0-9]{5,20}$/.test(symbol)) {
      res.status(400).json({ error: 'Invalid symbol' });
      return;
    }

    const allowed = new Set(['1m']);
    if (!allowed.has(interval)) {
      res.status(400).json({ error: 'Invalid interval' });
      return;
    }

    const url = withQuery('https://api.binance.com/api/v3/klines', {
      symbol,
      interval,
      limit: String(limit),
    });
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      res.status(502).json({ error: `Binance klines (${r.status})`, details: txt.slice(0, 500) });
      return;
    }
    const data = await r.json();
    if (!Array.isArray(data)) {
      res.status(502).json({ error: 'Binance klines payload' });
      return;
    }
    res.json({ symbol, interval, items: data });
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.use(express.json());

app.post('/api/audit/emit', (req, res) => {
  try {
    const body = req.body || {};
    const type = String(body?.type || '').trim();
    if (!type) {
      res.status(400).json({ error: 'Missing type' });
      return;
    }
    const email = String(body?.email || '').trim().toLowerCase();
    const evt = appendAudit({
      type,
      email: isValidEmail(email) ? email : '',
      level: String(body?.level || 'INFO'),
      source: String(body?.source || 'client'),
      data: body?.data ?? null,
    });
    broadcastAudit(evt);
    res.json({ ok: true, event: evt });
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.get('/api/audit/list', (req, res) => {
  const since = Number(req.query?.since || 0);
  const limit = Math.min(500, Math.max(1, Number(req.query?.limit || 200)));
  const db = readAuditDb();
  const out = Number.isFinite(since) && since > 0 ? db.filter((e) => Number(e?.ts || 0) >= since) : db;
  res.json({ items: out.slice(0, limit) });
});

app.get('/api/audit/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('\n');
  auditClients.add(res);
  const seed = readAuditDb().slice(0, 60);
  res.write(`data: ${safeJson({ type: 'audit_seed', items: seed })}\n\n`);
  req.on('close', () => {
    auditClients.delete(res);
  });
});

app.get('/api/market/snapshot', (_req, res) => {
  if (!MARKET.enabled) {
    res.status(503).json({ error: 'Market disabled' });
    return;
  }
  res.json(snapshotMarket(1200));
});

app.get('/api/coingecko/market_chart', async (req, res) => {
  try {
    const coinId = String(req.query?.coinId || '').trim();
    const days = String(req.query?.days || '30').trim();
    if (!coinId) {
      res.status(400).json({ error: 'Missing coinId' });
      return;
    }

    const cacheKey = `${coinId}|${days}`;
    const cached = cgChartCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CG_CHART_TTL_MS) {
      res.json(cached.data);
      return;
    }

    const url = withQuery(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coinId)}/market_chart`, {
      vs_currency: 'usd',
      days,
      interval: 'hourly',
    });
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    if (!r.ok) {
      if (cached && cached.data) {
        res.json(cached.data);
        return;
      }
      const txt = await r.text().catch(() => '');
      res.status(502).json({ error: `CoinGecko (${r.status})`, details: txt.slice(0, 500) });
      return;
    }
    const data = await r.json();

    cgChartCache.set(cacheKey, { ts: Date.now(), data });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.get('/api/market/stream', (req, res) => {
  if (!MARKET.enabled) {
    res.status(503).json({ error: 'Market stream disabled' });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('\n');

  sseClients.add(res);
  res.write(`data: ${safeJson(snapshotMarket(800))}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

app.get('/api/billing/status', (req, res) => {
  const email = String(req.query?.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }
  const db = readBillingDb();
  const row = db[email] || createBillingRow();
  res.json(row);
});

app.post('/api/stripe/subscribe', async (_req, res) => {
  try {
    if (!requireStripe(res)) return;
    const email = getEmailFromReq(_req);
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Invalid email.' });
      return;
    }
    if (!stripePriceIdWeekly) {
      res.status(500).json({
        error: 'Missing STRIPE_PRICE_ID_WEEKLY. Create a recurring weekly Price in Stripe and set it in env.',
      });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: stripePriceIdWeekly, quantity: 1 }],
      customer_email: email,
      client_reference_id: email,
      success_url: withQuery(successUrl, { flow: 'subscribe' }),
      cancel_url: withQuery(cancelUrl, { flow: 'subscribe' }),
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.post('/api/stripe/upfront-fee', async (req, res) => {
  try {
    if (!requireStripe(res)) return;

    const email = getEmailFromReq(req);
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Invalid email.' });
      return;
    }

    const totalAmount = Number(req.body?.totalAmount);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      res.status(400).json({ error: 'Invalid totalAmount.' });
      return;
    }

    const feeUsd = totalAmount * 0.01;
    const unitAmount = Math.round(feeUsd * 100);
    if (unitAmount < 1) {
      res.status(400).json({ error: 'Fee too small to charge.' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Upfront service fee (1%)',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        feeKind: 'upfront',
        totalAmount: String(totalAmount),
        feeUsd: String(feeUsd),
      },
      customer_email: email,
      client_reference_id: email,
      success_url: withQuery(successUrl, { flow: 'upfront' }),
      cancel_url: withQuery(cancelUrl, { flow: 'upfront' }),
    });

    res.json({ url: session.url, feeUsd });
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.post('/api/stripe/trade-fee', async (req, res) => {
  try {
    if (!requireStripe(res)) return;

    const email = getEmailFromReq(req);
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Invalid email.' });
      return;
    }

    const tradeNotional = Number(req.body?.tradeNotional);
    if (!Number.isFinite(tradeNotional) || tradeNotional <= 0) {
      res.status(400).json({ error: 'Invalid tradeNotional.' });
      return;
    }

    const feeUsd = tradeNotional * 0.01;
    const unitAmount = Math.round(feeUsd * 100);
    if (unitAmount < 1) {
      res.status(400).json({ error: 'Fee too small to charge.' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Per-trade service fee (1%)',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        feeKind: 'trade',
        tradeNotional: String(tradeNotional),
        feeUsd: String(feeUsd),
      },
      customer_email: email,
      client_reference_id: email,
      success_url: withQuery(successUrl, { flow: 'trade' }),
      cancel_url: withQuery(cancelUrl, { flow: 'trade' }),
    });

    res.json({ url: session.url, feeUsd });
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.static(__dirname));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = Number(process.env.PORT || 5173);
app.listen(port, () => {
  console.log(`Juzzy running on http://localhost:${port}`);
});

if (MARKET.enabled) {
  setTimeout(() => {
    void marketLoopTick();
    setInterval(() => {
      void marketLoopTick();
    }, MARKET.refreshMs);
  }, 350);
}
