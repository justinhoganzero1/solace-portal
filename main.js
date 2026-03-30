(() => {
  document.title = '3 Amigos Academy: Crypto Education Platform';
  console.log('[BOOT] 3 Amigos Academy IIFE entered');
  const HEARTBEAT_MS = 444;
  const COINGECKO_IDS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'cardano', 'dogecoin', 'polygon', 'chainlink', 'uniswap', 'litecoin'];

  const FEATURES = {
    charts: true,
    simpleMode: true,
  };
  const COMMUNITY_MEMBER_TARGET = 5824;
  const localAuthAccountsKey = 'juzzy_auth_accounts';
  let deferredInstallPrompt = null;

  function defaultCommunityAvatar() {
    return {
      name: state.profile.name || '3 Amigos Explorer',
      mood: 'curious',
      palette: 'cyan',
    };
  }

  function loadCommunityAvatar() {
    try {
      const raw = JSON.parse(localStorage.getItem(communityAvatarKey) || 'null');
      return raw && typeof raw === 'object' ? { ...defaultCommunityAvatar(), ...raw } : defaultCommunityAvatar();
    } catch {
      return defaultCommunityAvatar();
    }
  }

  function saveCommunityAvatar(avatar) {
    try {
      localStorage.setItem(communityAvatarKey, JSON.stringify(avatar));
    } catch {
      // ignore
    }
  }

  function avatarGradient(palette) {
    const map = {
      cyan: 'linear-gradient(135deg, #00e5ff, #1488cc)',
      violet: 'linear-gradient(135deg, #7a5cff, #b14dff)',
      gold: 'linear-gradient(135deg, #ffcc4d, #ff8c42)',
      emerald: 'linear-gradient(135deg, #21d19f, #11998e)',
    };
    return map[palette] || map.cyan;
  }

  function makeAvatarMarkup(name, mood, palette, large = false) {
    const initials = String(name || 'JC').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'JC';
    return `<div class="community-avatar ${large ? 'large' : ''}" style="background:${avatarGradient(palette)}"><span>${initials}</span><div class="community-avatar-ring mood-${mood}"></div></div>`;
  }

  function escapeCommunityHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function communityResourceCatalog() {
    return {
      foundations: [
        { label: 'Crypto basics explainer', url: 'https://www.youtube.com/watch?v=SSo_EIwHSd4', meta: 'Whiteboard Crypto' },
        { label: 'CoinGecko market overview', url: 'https://www.coingecko.com/', meta: 'CoinGecko' },
        { label: 'Beginner crypto guides', url: 'https://www.coinbase.com/learn/crypto-basics', meta: 'Coinbase Learn' },
      ],
      bitcoin: [
        { label: 'Bitcoin lesson path', url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4', meta: '3Blue1Brown' },
        { label: 'Bitcoin treasury news', url: 'https://www.coindesk.com/tag/bitcoin/', meta: 'CoinDesk' },
        { label: 'BTC market data', url: 'https://www.coingecko.com/en/coins/bitcoin', meta: 'CoinGecko' },
      ],
      defi: [
        { label: 'DeFi walkthrough', url: 'https://www.youtube.com/watch?v=xeaDE8wgVVQ', meta: 'Finematics' },
        { label: 'DeFi protocol data', url: 'https://defillama.com/', meta: 'DefiLlama' },
        { label: 'DeFi research', url: 'https://messari.io/', meta: 'Messari' },
      ],
      trading: [
        { label: 'Trading structure guide', url: 'https://www.youtube.com/results?search_query=The+Trading+Channel+market+structure+trading', meta: 'YouTube search' },
        { label: 'TradingView charts', url: 'https://www.tradingview.com/', meta: 'TradingView' },
        { label: 'Fear & Greed index', url: 'https://alternative.me/crypto/fear-and-greed-index/', meta: 'Alternative.me' },
      ],
      security: [
        { label: 'Wallet safety guide', url: 'https://www.youtube.com/watch?v=aUBid1zJC-U', meta: 'Coin Bureau' },
        { label: 'Security trends', url: 'https://blog.chainalysis.com/', meta: 'Chainalysis' },
        { label: 'Scam alerts', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories', meta: 'CISA' },
      ],
      risk: [
        { label: 'Crypto risk management', url: 'https://www.binance.com/en/blog/all/crypto-risk-management-strategies-421499824684903792', meta: 'Binance Learn' },
        { label: 'Investor alerts', url: 'https://www.sec.gov/investor/alerts', meta: 'SEC' },
        { label: 'Scam and rug-pull awareness', url: 'https://www.chainalysis.com/blog/', meta: 'Chainalysis' },
      ],
      scams: [
        { label: 'Fraud red flags', url: 'https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-and-scams', meta: 'FTC' },
        { label: 'Cybersecurity advisories', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories', meta: 'CISA' },
        { label: 'Wallet compromise response', url: 'https://support.metamask.io/stay-safe/protect-yourself/', meta: 'MetaMask Support' },
      ],
      ai: [
        { label: 'AI x crypto overview', url: 'https://www.youtube.com/results?search_query=AI+crypto+education', meta: 'YouTube search' },
        { label: 'AI research workflows', url: 'https://openai.com/index/', meta: 'OpenAI' },
        { label: 'Crypto AI news', url: 'https://www.theblock.co/', meta: 'The Block' },
      ],
      builder: [
        { label: 'Developer docs', url: 'https://ethereum.org/en/developers/docs/', meta: 'Ethereum.org' },
        { label: 'Smart contract patterns', url: 'https://docs.openzeppelin.com/contracts', meta: 'OpenZeppelin' },
        { label: 'Onchain analytics', url: 'https://dune.com/', meta: 'Dune' },
      ],
      regulation: [
        { label: 'Policy coverage', url: 'https://www.coindesk.com/policy/', meta: 'CoinDesk Policy' },
        { label: 'Global crypto rules', url: 'https://www.fatf-gafi.org/en/topics/virtual-assets.html', meta: 'FATF' },
        { label: 'Market supervision', url: 'https://www.esma.europa.eu/', meta: 'ESMA' },
      ],
      default: [
        { label: 'Juzzy learning module', url: 'https://www.youtube.com/results?search_query=crypto+education+module', meta: 'YouTube search' },
        { label: 'Market overview', url: 'https://www.coingecko.com/', meta: 'CoinGecko' },
        { label: 'Crypto news', url: 'https://www.coindesk.com/', meta: 'CoinDesk' },
      ],
    };
  }

  function getCommunityResourceSet(topic) {
    const text = String(topic || '').toLowerCase();
    const catalog = communityResourceCatalog();
    if (text.includes('beginner') || text.includes('foundation') || text.includes('basics') || text.includes('intro')) return catalog.foundations;
    if (text.includes('bitcoin') || text.includes('btc')) return catalog.bitcoin;
    if (text.includes('defi') || text.includes('yield')) return catalog.defi;
    if (text.includes('trade') || text.includes('chart') || text.includes('market')) return catalog.trading;
    if (text.includes('risk') || text.includes('volatile') || text.includes('loss')) return catalog.risk;
    if (text.includes('security') || text.includes('wallet') || text.includes('scam')) return catalog.security;
    if (text.includes('rug') || text.includes('fraud') || text.includes('phish') || text.includes('hack')) return catalog.scams;
    if (text.includes('ai')) return catalog.ai;
    if (text.includes('builder') || text.includes('contract') || text.includes('developer') || text.includes('onchain')) return catalog.builder;
    if (text.includes('regulation') || text.includes('policy')) return catalog.regulation;
    return catalog.default;
  }

  function renderResourceChips(resources) {
    return `<div class="community-resource-row">${resources.map((item) => `<a class="community-resource-chip" href="${escapeCommunityHtml(item.url)}" data-in-app-link="true" data-in-app-label="${escapeCommunityHtml(item.label)}" data-in-app-provider="${escapeCommunityHtml(item.meta)}"><span>${escapeCommunityHtml(item.label)}</span><small>${escapeCommunityHtml(item.meta)}</small></a>`).join('')}</div>`;
  }

  function buildCommunityPostMarkup(post) {
    const resources = getCommunityResourceSet(`${post.topic} ${post.body}`).slice(0, 3);
    const summary = escapeCommunityHtml(post.summary || post.topic || 'Community insight');
    return `<div class="community-post-summary">${summary}</div><div class="community-post-body">${post.body}</div>${renderResourceChips(resources)}`;
  }

  function buildAiResourceReply(userText, category) {
    const resources = getCommunityResourceSet(`${category} ${userText}`);
    const intro = category === 'technical'
      ? 'I pulled together a quick support pack with live references you can actually use right now.'
      : category === 'learning'
        ? 'Here is a stronger learning reply with live links you can use after the in-app lesson.'
        : 'Here is a curated reply with useful live links for the community.';
    return `${intro}${renderResourceChips(resources)}`;
  }

  function generateCommunityMembers() {
    if (state.community.members.length) return state.community.members;
    const first = ['Ari', 'Nova', 'Kian', 'Mila', 'Zeke', 'Tara', 'Rex', 'Lina', 'Orin', 'Pia', 'Jett', 'Sora', 'Niko', 'Vera', 'Dax'];
    const last = ['Wave', 'Ledger', 'Pulse', 'Chain', 'Signal', 'Mint', 'Vault', 'Mode', 'Byte', 'Flow', 'Node', 'Spark'];
    const moods = ['curious', 'alpha', 'builder', 'sage'];
    const palettes = ['cyan', 'violet', 'gold', 'emerald'];
    const roles = ['AI-simulated trader', 'AI-simulated builder', 'AI-simulated creator', 'AI-simulated researcher', 'AI-simulated macro watcher'];
    const members = [];
    for (let i = 0; i < COMMUNITY_MEMBER_TARGET; i += 1) {
      const name = `${first[i % first.length]} ${last[i % last.length]} ${i + 1}`;
      members.push({
        id: `community-member-${i + 1}`,
        name,
        mood: moods[i % moods.length],
        palette: palettes[i % palettes.length],
        role: roles[i % roles.length],
        address: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@community.ai`,
      });
    }
    state.community.members = members;
    return members;
  }

  function generateCommunityPosts() {
    if (state.community.posts.length) return state.community.posts;
    const topics = [
      'Just watched this amazing Bitcoin explainer: <a href="https://www.youtube.com/watch?v=SSo_EIwHSd4" data-in-app-link="true" data-in-app-label="Bitcoin Whitepaper Explained" data-in-app-provider="YouTube">Bitcoin Whitepaper Explained</a> - finally understanding why it matters!',
      'The DeFi course is 🔥! This video on <a href="https://www.youtube.com/watch?v=bBC-nXj3gV4" data-in-app-link="true" data-in-app-label="How DeFi Works" data-in-app-provider="YouTube">How DeFi Works</a> complements the lessons perfectly.',
      'Anyone else following the ETF flows? Check out <a href="https://www.youtube.com/watch?v=YIVAluSL9SU" data-in-app-link="true" data-in-app-label="ETF Flow Analysis" data-in-app-provider="YouTube">this analysis</a> - institutional adoption is real.',
      'Solana ecosystem is exploding! This <a href="https://www.youtube.com/watch?v=5oy1Q2p5yW8" data-in-app-link="true" data-in-app-label="Solana Deep Dive" data-in-app-provider="YouTube">Solana deep dive</a> explains why developers are flocking there.',
      'Great article on crypto regulations: <a href="https://www.coindesk.com/policy/2024/03/15/crypto-regulation-updates" data-in-app-link="true" data-in-app-label="Latest Policy Updates" data-in-app-provider="CoinDesk">Latest Policy Updates</a> - affects everyone in the space.',
      'Base chain is gaining traction! Watch <a href="https://www.youtube.com/watch?v=gyMwXuJrbJQ" data-in-app-link="true" data-in-app-label="Base Ecosystem Overview" data-in-app-provider="YouTube">this Base ecosystem overview</a> to understand the L2 landscape.',
      'AI agents + crypto = future! This <a href="https://www.youtube.com/watch?v=WfKU2n2aF3o" data-in-app-link="true" data-in-app-label="AI & Crypto Video" data-in-app-provider="YouTube">AI & Crypto video</a> blew my mind.',
      'Security is crucial! Just read <a href="https://blog.chainalysis.com/reports/crypto-security-trends-2024" data-in-app-link="true" data-in-app-label="Chainalysis Security Report" data-in-app-provider="Chainalysis">Chainalysis Security Report</a> - scary stats.',
      'Ethereum upgrades explained well: <a href="https://www.youtube.com/watch?v=RVMk5Mq8p7E" data-in-app-link="true" data-in-app-label="Dencun Upgrade Breakdown" data-in-app-provider="YouTube">Dencun Upgrade Breakdown</a> - layer 2s getting cheaper!',
      'Memecoin risks are real! Check out <a href="https://www.theblock.co/post/285471/memecoin-risks-analysis" data-in-app-link="true" data-in-app-label="Memecoin Risk Analysis" data-in-app-provider="The Block">this memecoin risk analysis</a> before apeing.',
      'NFT market analysis: <a href="https://www.youtube.com/watch?v=9xkNpQY9q6I" data-in-app-link="true" data-in-app-label="State of NFTs 2024" data-in-app-provider="YouTube">State of NFTs 2024</a> - not dead, just evolving!',
      'Yield farming strategies: <a href="https://www.youtube.com/watch?v=4M0QK3I9z6c" data-in-app-link="true" data-in-app-label="DeFi Yield Guide" data-in-app-provider="YouTube">DeFi Yield Guide</a> - be careful with impermanent loss!',
      'Tokenomics deep dive: <a href="https://messari.io/report/tokenomics-101" data-in-app-link="true" data-in-app-label="Messari Tokenomics Report" data-in-app-provider="Messari">Messari Tokenomics Report</a> - essential for investors.',
      'Crypto market cycles: <a href="https://www.youtube.com/watch?v=prv6T3j0a1k" data-in-app-link="true" data-in-app-label="Understanding Market Cycles" data-in-app-provider="YouTube">Understanding Market Cycles</a> - we might be early!',
      'Stablecoin risks exposed: <a href="https://www.bloomberg.com/crypto/articles/2024-03-10/stablecoin-risks-analysis" data-in-app-link="true" data-in-app-label="Bloomberg Stablecoin Analysis" data-in-app-provider="Bloomberg">Bloomberg Stablecoin Analysis</a> - not all are equal!',
    ];
    const members = generateCommunityMembers();
    state.community.posts = Array.from({ length: 48 }, (_, idx) => {
      const member = members[(idx * 17) % members.length];
      return {
        id: `community-post-${idx + 1}`,
        memberId: member.id,
        body: topics[idx % topics.length],
        summary: ['Live learning resource', 'Market pulse thread', 'Useful research drop', 'Builder insight', 'Community watchlist'][idx % 5],
        likes: 20 + ((idx * 13) % 420),
        replies: 4 + ((idx * 7) % 66),
        topic: ['Course', 'Markets', 'Influencers', 'Builders', 'DeFi'][idx % 5],
      };
    });
    return state.community.posts;
  }

  function renderCommunity() {
    const members = generateCommunityMembers();
    const posts = generateCommunityPosts();
    const avatar = loadCommunityAvatar();
    if (els.communityMemberCount) els.communityMemberCount.textContent = String(COMMUNITY_MEMBER_TARGET.toLocaleString());
    if (els.communityLiveThreads) els.communityLiveThreads.textContent = String((120 + posts.length).toLocaleString());
    if (els.communityPulse) els.communityPulse.textContent = 'AI';
    if (els.communityFeed) {
      els.communityFeed.innerHTML = posts.map((post) => {
        const member = members.find((item) => item.id === post.memberId);
        return `<div class="community-post-card"><div class="community-post-head">${makeAvatarMarkup(member.name, member.mood, member.palette)}<div><div class="community-post-name">${member.name}</div><div class="community-post-meta">${member.role} · ${member.address} · ${post.topic}</div></div><div class="community-post-badge">LIVE</div></div>${buildCommunityPostMarkup(post)}<div class="community-post-links"><button class="academy-hotspot" data-community-profile="${member.id}">Open profile</button><span class="muted small">${post.likes} likes · ${post.replies} replies</span></div></div>`;
      }).join('');
      Array.from(els.communityFeed.querySelectorAll('[data-community-profile]')).forEach((el) => {
        el.addEventListener('click', () => renderCommunityProfileCard(el.getAttribute('data-community-profile')));
      });
    }
    if (els.communityProfiles) {
      els.communityProfiles.innerHTML = members.slice(0, 8).map((member) => `
        <button class="community-profile-link" data-community-profile="${member.id}">
          ${makeAvatarMarkup(member.name, member.mood, member.palette)}
          <div>
            <div class="community-post-name">${member.name}</div>
            <div class="community-post-meta">${member.role}</div>
          </div>
        </button>
      `).join('');
      Array.from(els.communityProfiles.querySelectorAll('[data-community-profile]')).forEach((el) => {
        el.addEventListener('click', () => renderCommunityProfileCard(el.getAttribute('data-community-profile')));
      });
    }
    if (els.communityUserAvatarPreview) {
      els.communityUserAvatarPreview.innerHTML = `${makeAvatarMarkup(avatar.name, avatar.mood, avatar.palette, true)}<div class="community-user-meta"><div class="community-post-name">${avatar.name}</div><div class="community-post-meta">Your 3 Amigos Academy identity</div></div>`;
    }
    if (els.communityAvatarName) els.communityAvatarName.value = avatar.name;
    if (els.communityAvatarMood) els.communityAvatarMood.value = avatar.mood;
    if (els.communityAvatarPalette) els.communityAvatarPalette.value = avatar.palette;
  }

  function renderCommunityProfileCard(memberId) {
    const member = generateCommunityMembers().find((item) => item.id === memberId);
    if (!member || !els.communityProfiles) return;
    els.communityProfiles.innerHTML = `<div class="community-profile-expanded">${makeAvatarMarkup(member.name, member.mood, member.palette, true)}<div class="community-post-name">${member.name}</div><div class="community-post-meta">${member.role}</div><div class="community-profile-copy">This is an AI-simulated member profile used to create immersive community chatter inside 3 Amigos Academy.</div><div class="community-post-meta">${member.address}</div></div>`;
  }

  function saveCommunityAvatarFromInputs() {
    const avatar = {
      name: String(els.communityAvatarName?.value || '').trim() || defaultCommunityAvatar().name,
      mood: String(els.communityAvatarMood?.value || 'curious').trim() || 'curious',
      palette: String(els.communityAvatarPalette?.value || 'cyan').trim() || 'cyan',
    };
    saveCommunityAvatar(avatar);
    renderCommunity();
  }

  const COUNTRY_PROFILES = [
    { code: 'US', name: 'United States', currency: 'USD', legal: 'Educational content only. Crypto rules vary by state. Securities, tax, money transmission, consumer protection, and disclosure rules may apply. Users must verify current federal and state requirements before acting.' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', legal: 'Educational content only. Cryptoassets can fall under FCA, promotions, AML, and HMRC rules depending on activity. Users must verify current UK requirements before acting.' },
    { code: 'AU', name: 'Australia', currency: 'AUD', legal: 'Educational content only. Digital assets may involve tax, AML/CTF, licensing, and consumer law obligations. Users must verify current Australian requirements before acting.' },
    { code: 'CA', name: 'Canada', currency: 'CAD', legal: 'Educational content only. Crypto activity may involve securities, derivatives, tax, and provincial compliance obligations. Users must verify current Canadian requirements before acting.' },
    { code: 'DE', name: 'Germany', currency: 'EUR', legal: 'Educational content only. Tax and regulatory treatment depends on holding period, product structure, and use case. Users must verify current German and EU requirements before acting.' },
    { code: 'FR', name: 'France', currency: 'EUR', legal: 'Educational content only. Registration, tax, AML, and investor protection requirements may apply. Users must verify current French and EU requirements before acting.' },
    { code: 'ES', name: 'Spain', currency: 'EUR', legal: 'Educational content only. Spanish tax reporting and local compliance requirements may apply to crypto holdings and transactions. Users must verify current requirements before acting.' },
    { code: 'SG', name: 'Singapore', currency: 'SGD', legal: 'Educational content only. Digital payment token activity may fall within MAS frameworks depending on the service. Users must verify current Singapore requirements before acting.' },
    { code: 'JP', name: 'Japan', currency: 'JPY', legal: 'Educational content only. Japanese financial regulation can apply to exchange and token-related activity. Users must verify current Japanese requirements before acting.' },
    { code: 'KR', name: 'South Korea', currency: 'KRW', legal: 'Educational content only. Virtual asset activity may require compliance with exchange, tax, and reporting frameworks. Users must verify current Korean requirements before acting.' },
    { code: 'BR', name: 'Brazil', currency: 'BRL', legal: 'Educational content only. Brazilian tax and reporting obligations may apply to crypto transactions and holdings. Users must verify current Brazilian requirements before acting.' },
    { code: 'IN', name: 'India', currency: 'INR', legal: 'Educational content only. Indian crypto taxation and reporting obligations may apply under current policy settings. Users must verify current Indian requirements before acting.' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED', legal: 'Educational content only. Rules vary by emirate and free-zone regulator depending on the product and service. Users must verify current UAE requirements before acting.' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', legal: 'Educational content only. Crypto may be taxable and subject to evolving FSCA and exchange-control guidance. Users must verify current South African requirements before acting.' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', legal: 'Educational content only. Rules are evolving; users should review current SEC, CBN, tax, and local guidance before acting.' },
  ];

  const COMMON_LANGUAGES = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'zh-Hant', 'ja', 'ko', 'hi', 'bn', 'ur', 'ru', 'uk', 'tr', 'pl', 'id', 'vi',
    'th', 'sw', 'yo', 'am', 'fa', 'he', 'nl', 'sv', 'fi', 'no', 'da', 'cs', 'el', 'hu', 'ro', 'bg', 'sr', 'hr', 'sk', 'sl',
  ];

  const els = {
    hbMs: document.getElementById('hbMs'),
    statusText: document.getElementById('statusText'),
    email: document.getElementById('email'),
    navHomeBtn: document.getElementById('navHomeBtn'),
    simpleModeBtn: document.getElementById('simpleModeBtn'),
    ownerPlaque: document.getElementById('ownerPlaque'),
    connectBtn: document.getElementById('connectBtn'),
    subscribeBtn: document.getElementById('subscribeBtn'),
    fuel: document.getElementById('fuel'),
    fuelValue: document.getElementById('fuelValue'),
    gateSub: document.getElementById('gateSub'),
    gateUpfront: document.getElementById('gateUpfront'),
    gateRisk: document.getElementById('gateRisk'),
    gateFee: document.getElementById('gateFee'),
    gateTime: document.getElementById('gateTime'),
    oneInvest: document.getElementById('oneInvest'),
    autoStatus: document.getElementById('autoStatus'),
    autoNext: document.getElementById('autoNext'),
    stopAuto: document.getElementById('stopAuto'),
    payTradeFee: document.getElementById('payTradeFee'),
    simpleBar: document.getElementById('simpleBar'),
    simpleSubscribe: document.getElementById('simpleSubscribe'),
    simplePay: document.getElementById('simplePay'),
    simpleStart: document.getElementById('simpleStart'),
    simpleStop: document.getElementById('simpleStop'),
    cycleFill: document.getElementById('cycleFill'),
    cycleTime: document.getElementById('cycleTime'),
    kpiPnl: document.getElementById('kpiPnl'),
    kpiFees: document.getElementById('kpiFees'),
    kpiBanked: document.getElementById('kpiBanked'),
    kpiPaperPnl: document.getElementById('kpiPaperPnl'),
    leadersList: document.getElementById('leadersList'),
    leadersSource: document.getElementById('leadersSource'),
    leadersUniverse: document.getElementById('leadersUniverse'),
    leadersModeGainers: document.getElementById('leadersModeGainers'),
    leadersModeLosers: document.getElementById('leadersModeLosers'),
    terminal: document.getElementById('terminal'),
    brainToggle: document.getElementById('brainToggle'),
    reportSearch: document.getElementById('reportSearch'),
    reportsNewBtn: document.getElementById('reportsNewBtn'),
    reportsNewCount: document.getElementById('reportsNewCount'),
    exportBtn: document.getElementById('exportBtn'),
    reportsList: document.getElementById('reportsList'),
    opsMarket: document.getElementById('opsMarket'),
    opsAudit: document.getElementById('opsAudit'),
    opsUniverse: document.getElementById('opsUniverse'),
    opsLastMarket: document.getElementById('opsLastMarket'),
    opsLag: document.getElementById('opsLag'),
    opsCg: document.getElementById('opsCg'),
    opsBn: document.getElementById('opsBn'),
    opsDex: document.getElementById('opsDex'),
    opsPaperPos: document.getElementById('opsPaperPos'),
    opsPaperBanked: document.getElementById('opsPaperBanked'),
    opsAuditList: document.getElementById('opsAuditList'),
    opsFresh: document.getElementById('opsFresh'),
    opsAuditFresh: document.getElementById('opsAuditFresh'),
    opsForceSnapshot: document.getElementById('opsForceSnapshot'),
    opsReconnect: document.getElementById('opsReconnect'),
    vaultBalance: document.getElementById('vaultBalance'),
    vaultNetwork: document.getElementById('vaultNetwork'),
    vaultWallet: document.getElementById('vaultWallet'),
    vaultConnect: document.getElementById('vaultConnect'),
    vaultArm: document.getElementById('vaultArm'),
    vaultMaxUsd: document.getElementById('vaultMaxUsd'),
    vaultSlippage: document.getElementById('vaultSlippage'),
    addFunds: document.getElementById('addFunds'),
    withdrawFunds: document.getElementById('withdrawFunds'),
    tutCat: document.getElementById('tutCat'),
    tutSearch: document.getElementById('tutSearch'),
    tutProgress: document.getElementById('tutProgress'),
    tutCatalog: document.getElementById('tutCatalog'),
    academyOverview: document.getElementById('academyOverview'),
    academyJourney: document.getElementById('academyJourney'),
    academyProfile: document.getElementById('academyProfile'),
    academyFocus: document.getElementById('academyFocus'),
    academyTracks: document.getElementById('academyTracks'),
    academyPackages: document.getElementById('academyPackages'),
    academyRoadmap: document.getElementById('academyRoadmap'),
    academyBuilder: document.getElementById('academyBuilder'),
    tutModeChooser: document.getElementById('tutModeChooser'),
    tutModeTitle: document.getElementById('tutModeTitle'),
    tutModeDesc: document.getElementById('tutModeDesc'),
    tutModeQuick: document.getElementById('tutModeQuick'),
    tutModeDeep: document.getElementById('tutModeDeep'),
    tutReader: document.getElementById('tutReader'),
    tutTitle: document.getElementById('tutTitle'),
    tutLessonCat: document.getElementById('tutLessonCat'),
    tutBody: document.getElementById('tutBody'),
    tutExternalViewer: document.getElementById('tutExternalViewer'),
    tutExternalTitle: document.getElementById('tutExternalTitle'),
    tutExternalMeta: document.getElementById('tutExternalMeta'),
    tutExternalFrame: document.getElementById('tutExternalFrame'),
    tutExternalOpenNew: document.getElementById('tutExternalOpenNew'),
    tutExternalReturn: document.getElementById('tutExternalReturn'),
    tutPrev: document.getElementById('tutPrev'),
    tutNext: document.getElementById('tutNext'),
    tutProgressText: document.getElementById('tutProgressText'),
    tutProgressFill: document.getElementById('tutProgressFill'),
    tutChatMessages: document.getElementById('tutChatMessages'),
    tutChatInput: document.getElementById('tutChatInput'),
    tutChatSend: document.getElementById('tutChatSend'),
    tutTtsToggle: document.getElementById('tutTtsToggle'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    tutAiSettings: document.getElementById('tutAiSettings'),
    modalClose: document.getElementById('modalClose'),
    modalPrimary: document.getElementById('modalPrimary'),
    modalSecondary: document.getElementById('modalSecondary'),
    globalAiToggle: document.getElementById('globalAiToggle'),
    globalAiDock: document.getElementById('globalAiDock'),
    globalAiClose: document.getElementById('globalAiClose'),
    globalAiMessages: document.getElementById('globalAiMessages'),
    globalAiInput: document.getElementById('globalAiInput'),
    globalAiSend: document.getElementById('globalAiSend'),
    globalAiMic: document.getElementById('globalAiMic'),
    globalAiSpeak: document.getElementById('globalAiSpeak'),
    globalAiQuickActions: document.getElementById('globalAiQuickActions'),
    returnToLessonBtn: document.getElementById('returnToLessonBtn'),
    messagesUnreadBadge: document.getElementById('messagesUnreadBadge'),
    messagesAgentAddress: document.getElementById('messagesAgentAddress'),
    messagesThreadList: document.getElementById('messagesThreadList'),
    messagesThreadTitle: document.getElementById('messagesThreadTitle'),
    messagesThreadMessages: document.getElementById('messagesThreadMessages'),
    messagesCategory: document.getElementById('messagesCategory'),
    messagesSubject: document.getElementById('messagesSubject'),
    messagesComposer: document.getElementById('messagesComposer'),
    messagesRefundBtn: document.getElementById('messagesRefundBtn'),
    messagesSendBtn: document.getElementById('messagesSendBtn'),
    messagesNewThreadBtn: document.getElementById('messagesNewThreadBtn'),
    ownerRefundPanel: document.getElementById('ownerRefundPanel'),
    ownerRefundList: document.getElementById('ownerRefundList'),
    communityMemberCount: document.getElementById('communityMemberCount'),
    communityLiveThreads: document.getElementById('communityLiveThreads'),
    communityPulse: document.getElementById('communityPulse'),
    communityFeed: document.getElementById('communityFeed'),
    communityProfiles: document.getElementById('communityProfiles'),
    ideaFeedbackInput: document.getElementById('ideaFeedbackInput'),
    ideaFeedbackSubmit: document.getElementById('ideaFeedbackSubmit'),
    ideaFeedbackClear: document.getElementById('ideaFeedbackClear'),
    ideaFeedbackOutput: document.getElementById('ideaFeedbackOutput'),
    rewardStatusOutput: document.getElementById('rewardStatusOutput'),
    referralCodeDisplay: document.getElementById('referralCodeDisplay'),
    referralFriendEmail: document.getElementById('referralFriendEmail'),
    registerReferralBtn: document.getElementById('registerReferralBtn'),
    claimIdeaRewardBtn: document.getElementById('claimIdeaRewardBtn'),
    shareTierSummary: document.getElementById('shareTierSummary'),
    shareInviteLink: document.getElementById('shareInviteLink'),
    shareCopyInviteBtn: document.getElementById('shareCopyInviteBtn'),
    shareFamilyPassBtn: document.getElementById('shareFamilyPassBtn'),
    shareOpenOwnerAccessBtn: document.getElementById('shareOpenOwnerAccessBtn'),
    sharePreviewOutput: document.getElementById('sharePreviewOutput'),
    ownerAccessTab: document.getElementById('ownerAccessTab'),
    ownerAccessPanel: document.getElementById('ownerAccessPanel'),
    ownerGrantEmail: document.getElementById('ownerGrantEmail'),
    ownerGrantLifetimeBtn: document.getElementById('ownerGrantLifetimeBtn'),
    ownerFamilyShareEmail: document.getElementById('ownerFamilyShareEmail'),
    ownerFamilyShareBtn: document.getElementById('ownerFamilyShareBtn'),
    ownerSharePreview: document.getElementById('ownerSharePreview'),
    ownerAccessList: document.getElementById('ownerAccessList'),
    familyPlaque: document.getElementById('familyPlaque'),
    oracleTab: document.getElementById('oracleTab'),
    hallOfFameContainer: document.getElementById('hallOfFameContainer'),
    communityUserAvatarPreview: document.getElementById('communityUserAvatarPreview'),
    communityAvatarName: document.getElementById('communityAvatarName'),
    communityAvatarMood: document.getElementById('communityAvatarMood'),
    communityAvatarPalette: document.getElementById('communityAvatarPalette'),
    communityAvatarSaveBtn: document.getElementById('communityAvatarSaveBtn'),
    authGate: document.getElementById('authGate'),
    authSignInEmail: document.getElementById('authSignInEmail'),
    authSignInPassword: document.getElementById('authSignInPassword'),
    authSignInGoogleBtn: document.getElementById('authSignInGoogleBtn'),
    authSignInAppleBtn: document.getElementById('authSignInAppleBtn'),
    authSignInBtn: document.getElementById('authSignInBtn'),
    authName: document.getElementById('authName'),
    authEmail: document.getElementById('authEmail'),
    authPassword: document.getElementById('authPassword'),
    authCountry: document.getElementById('authCountry'),
    authLanguage: document.getElementById('authLanguage'),
    authLanguageCustom: document.getElementById('authLanguageCustom'),
    authCountryLegal: document.getElementById('authCountryLegal'),
    authLegalAgree: document.getElementById('authLegalAgree'),
    authGoogleBtn: document.getElementById('authGoogleBtn'),
    authAppleBtn: document.getElementById('authAppleBtn'),
    authSignUpBtn: document.getElementById('authSignUpBtn'),
    authUseStripeBtn: document.getElementById('authUseStripeBtn'),
    installAppBtn: document.getElementById('installAppBtn'),
    downloadDesktopBtn: document.getElementById('downloadDesktopBtn'),
    authStatusMessage: document.getElementById('authStatusMessage'),
    authSkipBtn: document.getElementById('authSkipBtn'),
    authSignOutBtn: document.getElementById('authSignOutBtn'),
    userIdentityPill: document.getElementById('userIdentityPill'),
    openSettingsBtn: document.getElementById('openSettingsBtn'),
    portfolioCountry: document.getElementById('portfolioCountry'),
    portfolioLanguage: document.getElementById('portfolioLanguage'),
    portfolioTotalValue: document.getElementById('portfolioTotalValue'),
    portfolioPositions: document.getElementById('portfolioPositions'),
    portfolioRegionCurrency: document.getElementById('portfolioRegionCurrency'),
    portfolioCountryLegal: document.getElementById('portfolioCountryLegal'),
    portfolioRows: document.getElementById('portfolioRows'),
    portfolioConnectWallet: document.getElementById('portfolioConnectWallet'),
    portfolioSubscribe: document.getElementById('portfolioSubscribe'),
    settingsCountry: document.getElementById('settingsCountry'),
    settingsLanguage: document.getElementById('settingsLanguage'),
    settingsLanguageCustom: document.getElementById('settingsLanguageCustom'),
    settingsLegalText: document.getElementById('settingsLegalText'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    checkYoutubeLinksBtn: document.getElementById('checkYoutubeLinksBtn'),
    openYoutubePlaylistBtn: document.getElementById('openYoutubePlaylistBtn'),
    youtubeLinkStatus: document.getElementById('youtubeLinkStatus'),

    chart: document.getElementById('chart'),
    chartFilterAll: document.getElementById('chartFilterAll'),
    chartFilterGains: document.getElementById('chartFilterGains'),
    chartFilterFalls: document.getElementById('chartFilterFalls'),
    chartFilterBirths: document.getElementById('chartFilterBirths'),
    chartFilterSandbox: document.getElementById('chartFilterSandbox'),
    chartSearch: document.getElementById('chartSearch'),
    chartAsset: document.getElementById('chartAsset'),
    chartTf: document.getElementById('chartTf'),
    chartAddLine: document.getElementById('chartAddLine'),
    chartClearLines: document.getElementById('chartClearLines'),
    chartRefresh: document.getElementById('chartRefresh'),
    chartStatAsset: document.getElementById('chartStatAsset'),
    chartStatLast: document.getElementById('chartStatLast'),
    chartStatChg: document.getElementById('chartStatChg'),
    chartLineReport: document.getElementById('chartLineReport'),
  };

  const state = {
    walletConnected: false,
    walletAddress: null,
    heartbeat: 0,
    autopilot: {
      active: false,
      startedAt: 0,
      endsAt: 0,
      durationMs: 24 * 60 * 60 * 1000,
      slices: 24,
      intervalMs: 60 * 60 * 1000,
      totalAmount: 0,
      sliceAmount: 0,
      nextIndex: 0,
      awaitingPaymentForIndex: null,
    },
    vault: {
      venue: 'onchain',
      network: 'solana',
      chainId: 8453,
      armed: false,
      maxUsdPerTrade: 250,
      slippageBps: 75,
    },
    leaders: new Map(),
    leadersLastFetchAt: 0,
    market: {
      connected: false,
      lastServerTs: 0,
      lastUpdateAt: 0,
      source: null,
      universe: new Map(),
      mode: 'gainers',
      lastEventTs: 0,
      birthKeys: new Set(),
      prevByKey: new Map(),
      lastSignalsAtByKey: new Map(),
    },
    audit: {
      connected: false,
      items: [],
    },
    brainPaused: false,
    pnl: 0,
    fees: 0,
    paper: {
      enabled: true,
      bankedUsd: 0,
      realizedUsd: 0,
      positions: new Map(),
    },
    billing: {
      subscribed: false,
      upfrontPaid: false,
      upfrontForTotal: 0,
    },
    user: {
      email: '',
      lastBillingFetchAt: 0,
    },
    profile: {
      loggedIn: false,
      name: '',
      country: '',
      language: 'en',
      languageCustom: '',
      legalAccepted: false,
    },
    ui: {
      simpleMode: false,
      actionStatus: 'Idle',
      navHistory: ['home'],
      navHistoryIndex: 0,
    },
    charts: {
      chart: null,
      series: null,
      liveSeries: null,
      liveHistory: new Map(),
      lastAsset: 'bitcoin',
      lastDays: 30,
      filter: 'all',
      priceLinesByAsset: new Map(),
      lastPriceByAsset: new Map(),
      lastCrossAtByLine: new Map(),
    },
    reports: [],
    reportsRendered: 0,
    reportsLastRenderedId: null,
    reportsNewPending: 0,
    messages: {
      threads: [],
      activeThreadId: null,
      unreadCount: 0,
    },
    community: {
      members: [],
      posts: [],
    },
  };

  const messageCenterKey = 'juzzy_message_center';
  const ownerRefundQueueKey = 'juzzy_owner_refund_queue';
  const communityAvatarKey = 'juzzy_community_avatar';
  const growthRewardsKey = 'juzzy_growth_rewards';
  const refundAccessFlag = 'refund-admin';
  const AI_GUIDE_NAME = 'Mira — Juzzy AI Guide';
  const AI_GUIDE_ADDRESS = 'ai.guide@juzzy.local';
  const lessonProfessorKey = 'juzzy_lesson_professor';
  const OWNER_APPROVER_EMAILS = ['owner@juzzy.local'];
  const AI_SERVICE_TEAMS = {
    learning: { name: 'Mira — Learning Support AI', address: 'learning@juzzy.internal.ai' },
    dean: { name: 'Dean Aurelius — Juzzy AI Dean', address: 'dean@juzzy.internal.ai' },
    billing: { name: 'Alden — Billing Access AI', address: 'billing@juzzy.internal.ai' },
    technical: { name: 'Nova — Technical Support AI', address: 'support@juzzy.internal.ai' },
    onboarding: { name: 'Sera — Onboarding AI', address: 'onboarding@juzzy.internal.ai' },
    operations: { name: 'Orin — Operations AI', address: 'ops@juzzy.internal.ai' },
  };
  const AI_PROFESSORS = {
    atlas: {
      name: 'Professor Atlas',
      title: 'AI Professor of Crypto Foundations',
      specialty: 'Foundations, token models, and first-principles teaching',
      tone: 'clear, structured, foundational',
      avatar: '🧭',
    },
    vega: {
      name: 'Professor Vega',
      title: 'AI Professor of Markets and Chartcraft',
      specialty: 'Charts, market structure, and practice-based analysis',
      tone: 'analytical, tactical, market-focused',
      avatar: '📈',
    },
    lyra: {
      name: 'Professor Lyra',
      title: 'AI Professor of Creator and Media Systems',
      specialty: 'Creator economy, products, audience trust, and media strategy',
      tone: 'creative, persuasive, product-minded',
      avatar: '🎬',
    },
    sol: {
      name: 'Professor Sol',
      title: 'AI Professor of Risk and Legitimacy',
      specialty: 'Risk controls, exchange legitimacy, safety, and due diligence',
      tone: 'careful, skeptical, safety-first',
      avatar: '🛡️',
    },
    nova: {
      name: 'Professor Nova',
      title: 'AI Professor of Builder and AI Systems',
      specialty: 'DeFi, smart-contract thinking, AI workflows, and technical literacy',
      tone: 'technical, systems-oriented, exploratory',
      avatar: '🤖',
    },
  };

  function defaultMessageCenter() {
    return {
      unreadCount: 0,
      activeThreadId: 'thread-welcome',
      threads: [
        {
          id: 'thread-welcome',
          subject: 'Welcome to Juzzy Message Center',
          category: 'learning',
          updatedAt: Date.now(),
          unread: false,
          messages: [
            {
              id: `msg-${Date.now()}`,
              senderName: AI_GUIDE_NAME,
              senderAddress: AI_GUIDE_ADDRESS,
              role: 'ai',
              body: 'Hi. I am Juzzy AI Guide, clearly labeled as an internal AI assistant. You can message me here about lessons, app features, or what to study next, and I will reply inside this inbox.',
              ts: Date.now(),
            },
          ],
        },
      ],
    };
  }

  function createRefundRequest() {
    const reason = String(els.messagesComposer?.value || '').trim() || 'User requested a refund review.';
    const subject = String(els.messagesSubject?.value || '').trim() || 'Refund request';
    const userEmail = String(state.user.email || 'user@juzzy.local').trim();
    const queue = loadOwnerRefundQueue();
    const request = {
      id: `refund-${Date.now()}`,
      subject,
      reason,
      userEmail,
      status: 'pending',
      createdAt: Date.now(),
    };
    queue.unshift(request);
    saveOwnerRefundQueue(queue);
    if (els.messagesCategory) els.messagesCategory.value = 'billing';
    if (els.messagesSubject) els.messagesSubject.value = subject;
    if (els.messagesComposer) {
      els.messagesComposer.value = `${reason}\n\nRefund request prepared for owner approval. Billing links: Subscription, Settings, and Portfolio access controls inside Juzzy.`;
    }
    sendMessageToAiInbox();
    renderOwnerRefundQueue();
  }

  function canAccessHiddenRefundArea() {
    const params = new URLSearchParams(window.location.search);
    return isOwnerApprover() && String(params.get('admin') || '').trim().toLowerCase() === refundAccessFlag;
  }

  function getActiveLessonContext() {
    const tut = allTutorials.find(t => t.id === activeTutId);
    const step = tut ? tut.steps[activeTutStep] : null;
    return { tut, step };
  }

  function getSelectedProfessorId() {
    try {
      const saved = String(localStorage.getItem(lessonProfessorKey) || 'atlas').trim();
      return AI_PROFESSORS[saved] ? saved : 'atlas';
    } catch {
      return 'atlas';
    }
  }

  function getSelectedProfessor() {
    return AI_PROFESSORS[getSelectedProfessorId()] || AI_PROFESSORS.atlas;
  }

  function setSelectedProfessor(id) {
    if (!AI_PROFESSORS[id]) return;
    try {
      localStorage.setItem(lessonProfessorKey, id);
    } catch {
      // ignore
    }
  }

  function renderProfessorFaculty() {
    const activeId = getSelectedProfessorId();
    return `<div class="academy-professor-panel"><div class="academy-professor-head"><div class="academy-ai-tools-title">AI Faculty</div><div class="muted small">Professor-style AI instructors, clearly presented as AI guides</div></div><div class="academy-professor-grid">${Object.entries(AI_PROFESSORS).map(([id, professor]) => `<button class="academy-professor-card ${id === activeId ? 'active' : ''}" data-professor-id="${id}"><div class="academy-professor-avatar">${professor.avatar}</div><div><div class="academy-professor-name">${professor.name}</div><div class="academy-professor-role">${professor.title}</div><div class="academy-professor-copy">${professor.specialty}</div></div></button>`).join('')}</div></div>`;
  }

  function bindProfessorFaculty() {
    if (!els.tutBody) return;
    Array.from(els.tutBody.querySelectorAll('[data-professor-id]')).forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-professor-id');
        setSelectedProfessor(id);
        renderTutStep();
      });
    });
  }

  function buildAiLessonFeatureOutput(action) {
    const { tut, step } = getActiveLessonContext();
    if (!tut || !step) return '<p>Open a lesson to activate AI lesson tools.</p>';
    const professor = getSelectedProfessor();
    const plain = tutStripHtml(step.html);
    const short = plain.split('. ').slice(0, 2).join('. ');
    const title = step.title;
    const outputs = {
      simplify: `<p><strong>${professor.name}:</strong> In a ${professor.tone} way, ${title} means: ${short || 'This step explains one core idea in a safer, simpler way.'}</p>`,
      deeper: `<p><strong>${professor.name} deep dive:</strong> This step connects <strong>${title}</strong> to the broader lesson <strong>${tut.title}</strong>. ${professor.title} would teach this through ${professor.specialty.toLowerCase()}.</p>`,
      analogy: `<p><strong>${professor.name} analogy:</strong> Think of this topic like a training simulator: you learn the rules, practice the sequence, and only then decide whether the real-world version makes sense for you.</p>`,
      quiz: `<p><strong>${professor.name} quiz:</strong> 1) What is the main idea of this step? 2) What is one risk or mistake to avoid? 3) What would you do inside Juzzy to practice it safely?</p>`,
      recap: `<p><strong>${professor.name} recap:</strong> ${short || 'This step teaches a key concept.'}</p><p>Main takeaway from ${professor.title}: understand the idea, practice it safely, and avoid acting on hype alone.</p>`,
      next: `<p><strong>${professor.name} next step:</strong> Finish this step, then use one of the lesson hotspots like Charts, Leaders, Brain, or Reports to reinforce the concept through interaction.</p>`,
      challenge: `<p><strong>${professor.name} challenge:</strong> Explain <strong>${title}</strong> in one sentence, name one risk, and connect it to one action you could take inside Juzzy.</p>`,
      glossary: `<p><strong>${professor.name} glossary note:</strong> This step likely includes core terms tied to <strong>${tut.cat}</strong>. Focus on the keywords in the heading and ask the AI to define any term you don’t recognize.</p>`,
      reflect: `<p><strong>${professor.name} reflection prompt:</strong> What part of this lesson still feels unclear, and what app feature would help you understand it better?</p>`,
      coach: `<p><strong>${professor.name} coaching note:</strong> Use the clickable hotspots, AI inbox, and practice labs to let this lesson become active rather than passive.</p>`,
    };
    return outputs[action] || '<p>The AI lesson tool is ready. Pick another action to keep exploring.</p>';
  }

  function renderAiLessonTools() {
    return `<div class="academy-ai-tools"><div class="academy-ai-tools-title">AI Lesson Tools</div><div class="academy-ai-tool-grid"><button class="academy-ai-tool" data-ai-tool="simplify">Simplify</button><button class="academy-ai-tool" data-ai-tool="deeper">Deep Dive</button><button class="academy-ai-tool" data-ai-tool="analogy">Analogy</button><button class="academy-ai-tool" data-ai-tool="quiz">Quiz Me</button><button class="academy-ai-tool" data-ai-tool="recap">Recap</button><button class="academy-ai-tool" data-ai-tool="next">Next Step</button><button class="academy-ai-tool" data-ai-tool="challenge">Challenge Me</button><button class="academy-ai-tool" data-ai-tool="glossary">Glossary</button><button class="academy-ai-tool" data-ai-tool="reflect">Reflect</button><button class="academy-ai-tool" data-ai-tool="coach">Coach</button></div><div id="lessonAiFeatureOutput" class="academy-ai-output">Tap an AI tool to generate an in-lesson assist.</div></div>`;
  }

  function bindAiLessonTools() {
    if (!els.tutBody) return;
    const output = els.tutBody.querySelector('#lessonAiFeatureOutput');
    Array.from(els.tutBody.querySelectorAll('[data-ai-tool]')).forEach((el) => {
      el.addEventListener('click', () => {
        const action = el.getAttribute('data-ai-tool');
        if (output) output.innerHTML = buildAiLessonFeatureOutput(action);
        updateLearnerProfile((profile) => {
          profile.interactionCount += 1;
          return profile;
        });
      });
    });
  }

  function loadMessageCenter() {
    try {
      const raw = JSON.parse(localStorage.getItem(messageCenterKey) || 'null');
      const data = raw && Array.isArray(raw.threads) ? raw : defaultMessageCenter();
      state.messages.threads = data.threads;
      state.messages.activeThreadId = data.activeThreadId || data.threads[0]?.id || null;
      state.messages.unreadCount = Number(data.unreadCount || 0);
    } catch {
      const data = defaultMessageCenter();
      state.messages.threads = data.threads;
      state.messages.activeThreadId = data.activeThreadId;
      state.messages.unreadCount = data.unreadCount;
    }
  }

  function saveMessageCenter() {
    try {
      localStorage.setItem(messageCenterKey, JSON.stringify({
        threads: state.messages.threads,
        activeThreadId: state.messages.activeThreadId,
        unreadCount: state.messages.unreadCount,
      }));
    } catch {
      // ignore
    }
  }

  function getActiveThread() {
    return state.messages.threads.find((thread) => thread.id === state.messages.activeThreadId) || state.messages.threads[0] || null;
  }

  function isOwnerApprover() {
    const email = String(state.user.email || '').trim().toLowerCase();
    return OWNER_APPROVER_EMAILS.includes(email);
  }

  function loadOwnerRefundQueue() {
    try {
      return JSON.parse(localStorage.getItem(ownerRefundQueueKey) || '[]');
    } catch {
      return [];
    }
  }

  function saveOwnerRefundQueue(items) {
    try {
      localStorage.setItem(ownerRefundQueueKey, JSON.stringify(items || []));
    } catch {
      // ignore
    }
  }

  function renderOwnerRefundQueue() {
    if (!els.ownerRefundPanel || !els.ownerRefundList) return;
    const visible = canAccessHiddenRefundArea();
    els.ownerRefundPanel.hidden = !visible;
    if (!visible) return;
    const queue = loadOwnerRefundQueue();
    els.ownerRefundList.innerHTML = queue.length
      ? queue.map((item) => `
        <div class="owner-refund-item">
          <div class="messages-thread-subject">${item.subject}</div>
          <div class="messages-thread-meta">${item.userEmail} · ${item.status} · ${new Date(item.createdAt).toLocaleString()}</div>
          <div class="owner-refund-copy">${item.reason}</div>
          <div class="messages-compose-actions">
            <button class="btn" data-owner-refund-action="approve" data-owner-refund-id="${item.id}">Approve</button>
            <button class="btn" data-owner-refund-action="reject" data-owner-refund-id="${item.id}">Reject</button>
          </div>
        </div>
      `).join('')
      : '<div class="muted small">No pending refund requests.</div>';
    Array.from(els.ownerRefundList.querySelectorAll('[data-owner-refund-action]')).forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-owner-refund-id');
        const action = el.getAttribute('data-owner-refund-action');
        const next = loadOwnerRefundQueue().map((item) => item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected', reviewedAt: Date.now() } : item);
        saveOwnerRefundQueue(next);
        renderOwnerRefundQueue();
      });
    });
  }

  function renderOwnerAccessPanel() {
    if (els.ownerAccessTab) els.ownerAccessTab.hidden = !isOwnerApprover();
    if (els.oracleTab) els.oracleTab.hidden = !isOwnerApprover();
    if (!els.ownerAccessPanel || !els.ownerAccessList) return;
    const visible = isOwnerApprover();
    els.ownerAccessPanel.hidden = !visible;
    if (!visible) return;
    const rewards = loadGrowthRewards();
    const grants = Array.isArray(rewards.ownerLifetimeAccess) ? rewards.ownerLifetimeAccess : [];
    const familyGrants = Array.isArray(rewards.familyLifetimeAccess) ? rewards.familyLifetimeAccess : [];
    const allEntries = [
      ...grants.map((email) => ({ email, meta: 'Lifetime free access granted' })),
      ...familyGrants.map((email) => ({ email, meta: 'Amego Family · Lifetime free access' })),
    ];
    els.ownerAccessList.innerHTML = allEntries.length
      ? allEntries.map((entry) => `
        <div class="owner-access-entry">
          <div class="messages-thread-subject">${escapeHtml(String(entry.email))}</div>
          <div class="messages-thread-meta">${escapeHtml(String(entry.meta))}</div>
        </div>
      `).join('')
      : '<div class="muted small">No lifetime access grants yet.</div>';
  }

  function isAmegoFamilyUser() {
    const rewards = loadGrowthRewards();
    const email = String(state.user.email || '').trim().toLowerCase();
    return Array.isArray(rewards.familyLifetimeAccess) && rewards.familyLifetimeAccess.includes(email);
  }

  function loadTradingSimulator() {
    const frame = document.getElementById('trading-simulator-frame');
    if (frame) {
      frame.innerHTML = `
        <iframe src="trading-simulator.html?embedded=1"
                title="Juzzy Trading Simulator"
                style="width: 100%; min-height: 980px; border: none; border-radius: 18px; background: #0D0D0D; box-shadow: 0 20px 48px rgba(0,0,0,0.28);"
                allow="clipboard-read; clipboard-write"
                onload="this.style.opacity='1'; this.style.transition='opacity 0.5s ease';"
                onerror="this.innerHTML='<div style=\'text-align: center; padding: 40px; color: #ff6b6b;\'>❌ Failed to load trading simulator</div>'">
        </iframe>
      `;
    }
  }

  function renderHallOfFame() {
  if (!els.hallOfFameContainer) return;
  
  const fakeAchievements = [
    { name: "Alex Chen", avatar: "🎓", achievement: "Completed 50 Modules", date: "2024-03-15" },
    { name: "Sarah Miller", avatar: "🏆", achievement: "Top Trader 30-Day Streak", date: "2024-03-14" },
    { name: "Mike Johnson", avatar: "💎", achievement: "DeFi Expert Certification", date: "2024-03-13" },
    { name: "Emma Davis", avatar: "🚀", achievement: "100 Lessons Completed", date: "2024-03-12" },
    { name: "Chris Wilson", avatar: "⭐", achievement: "Community Leader Award", date: "2024-03-11" },
    { name: "Lisa Anderson", avatar: "🎯", achievement: "Perfect Quiz Score Master", date: "2024-03-10" },
    { name: "Tom Martinez", avatar: "🔥", achievement: "30-Day Learning Streak", date: "2024-03-09" },
    { name: "Nina Patel", avatar: "💰", achievement: "Investment Strategy Pro", date: "2024-03-08" }
  ];

  const scrollContainer = els.hallOfFameContainer.querySelector('.hall-of-fame-scroll');
  if (!scrollContainer) return;

  scrollContainer.innerHTML = fakeAchievements.map(entry => `
    <div class="hall-of-fame-entry">
      <div class="hall-of-fame-avatar">${entry.avatar}</div>
      <div class="hall-of-fame-name">${escapeHtml(entry.name)}</div>
      <div class="hall-of-fame-achievement">${escapeHtml(entry.achievement)}</div>
      <div class="hall-of-fame-date">${new Date(entry.date).toLocaleDateString()}</div>
    </div>
  `).join('');
}

function grantOwnerLifetimeAccess() {
    if (!isOwnerApprover()) return;
    const email = String(els.ownerGrantEmail?.value || '').trim().toLowerCase();
    if (!validateEmail(email)) {
      openModal({ title: 'Valid email required', bodyHtml: '<div class="muted">Enter a valid email address to grant lifetime free access.</div>', primaryText: 'OK', secondaryText: 'Close' });
      return;
    }
    const rewards = loadGrowthRewards();
    const grants = Array.isArray(rewards.ownerLifetimeAccess) ? rewards.ownerLifetimeAccess : [];
    if (!grants.includes(email)) {
      rewards.ownerLifetimeAccess = [email, ...grants];
      saveGrowthRewards(rewards);
    }
    if (els.ownerGrantEmail) els.ownerGrantEmail.value = '';
    renderOwnerAccessPanel();
    renderGrowthRewards();
  }

  function createOwnerFamilyShareInvite() {
    if (!isOwnerApprover()) return;
    const email = String(els.ownerFamilyShareEmail?.value || '').trim().toLowerCase();
    if (!validateEmail(email)) {
      openModal({ title: 'Valid family email required', bodyHtml: '<div class="muted">Enter a valid family email to prepare a starter invite.</div>', primaryText: 'OK', secondaryText: 'Close' });
      return;
    }
    const rewards = loadGrowthRewards();
    const grants = Array.isArray(rewards.familyLifetimeAccess) ? rewards.familyLifetimeAccess : [];
    if (!grants.includes(email)) {
      rewards.familyLifetimeAccess = [email, ...grants];
      saveGrowthRewards(rewards);
    }
    const copy = buildShareCopy('family', email);
    if (els.ownerSharePreview) els.ownerSharePreview.textContent = copy;
    if (els.ownerFamilyShareEmail) els.ownerFamilyShareEmail.value = '';
    renderOwnerAccessPanel();
    renderGrowthRewards();
  }

  function updateMessagesUnreadBadge() {
    if (!els.messagesUnreadBadge) return;
    const count = Number(state.messages.unreadCount || 0);
    els.messagesUnreadBadge.textContent = String(count);
    els.messagesUnreadBadge.classList.toggle('util-hidden', count <= 0);
  }

  function renderMessageCenter() {
    const activeThread = getActiveThread();
    const team = AI_SERVICE_TEAMS[activeThread?.category || 'learning'] || { name: AI_GUIDE_NAME, address: AI_GUIDE_ADDRESS };
    if (els.messagesAgentAddress) els.messagesAgentAddress.textContent = team.address;
    if (els.messagesThreadList) {
      els.messagesThreadList.innerHTML = state.messages.threads.map((thread) => `
        <button class="messages-thread-item ${thread.id === state.messages.activeThreadId ? 'active' : ''}" data-thread-id="${thread.id}">
          <div class="messages-thread-subject">${escapeCommunityHtml(thread.subject)}</div>
          <div class="messages-thread-meta">${thread.unread ? 'New reply' : 'Open thread'} · ${escapeCommunityHtml(thread.category || 'learning')} · ${new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </button>
      `).join('');
      Array.from(els.messagesThreadList.querySelectorAll('[data-thread-id]')).forEach((el) => {
        el.addEventListener('click', () => {
          state.messages.activeThreadId = el.getAttribute('data-thread-id');
          const thread = getActiveThread();
          if (thread?.unread) {
            thread.unread = false;
            state.messages.unreadCount = Math.max(0, state.messages.unreadCount - 1);
            saveMessageCenter();
            updateMessagesUnreadBadge();
          }
          renderMessageCenter();
        });
      });
    }

    if (els.messagesThreadTitle) els.messagesThreadTitle.textContent = activeThread?.subject || team.name;
    if (els.messagesCategory) els.messagesCategory.value = activeThread?.category || 'learning';
    if (els.messagesThreadMessages) {
      els.messagesThreadMessages.innerHTML = (activeThread?.messages || []).map((message) => `
        <div class="messages-bubble ${message.role === 'user' ? 'user' : 'ai'}">
          <div class="messages-bubble-head">${escapeCommunityHtml(message.senderName)} · ${escapeCommunityHtml(message.senderAddress)}</div>
          <div>${message.role === 'ai' ? message.body : escapeCommunityHtml(message.body)}</div>
        </div>
      `).join('');
      els.messagesThreadMessages.scrollTop = els.messagesThreadMessages.scrollHeight;
    }
    renderOwnerRefundQueue();
  }

  function buildDelayedAiReply(userText, category) {
    const key = category || 'learning';
    const catalog = {
      learning: [
        'I reviewed your learning request. The best next move is to continue your current module, then open Charts or Leaders for guided practice.',
        'I can support that topic. Use the lesson AI, animated hotspots, and the next recommended module to deepen your understanding.',
      ],
      dean: [
        'The Dean of Juzzy reviewed your university-style message. The recommendation is to stay focused on guided learning, use the AI faculty, and build mastery step by step.',
        'From the Dean desk: your progress matters more than speed. Continue the pathway, use the professor team, and keep asking for support when needed.',
      ],
      billing: [
        'I checked the billing help path. Review your subscription status, upfront fee state, and learning access buttons inside the app before retrying.',
        'For access and billing guidance, check your email field, subscription state, and package eligibility inside Juzzy first. If billing still needs manual review, contact support through the normal billing help path.',
      ],
      technical: [
        'I reviewed the technical support context. The best first step is to refresh the affected tab, review live status indicators, and retry the workflow.',
        'For technical support, I recommend checking wallet connection state, chart refresh, and report logs before escalating the issue.',
      ],
      onboarding: [
        'I checked your onboarding request. The clearest next step is to confirm country selection, legal acknowledgement, and then start with the recommended beginner pathway.',
        'For onboarding support, begin with the Foundations pathway and use the message center any time you want a simpler explanation.',
      ],
      operations: [
        'I reviewed the operations/admin request. The best next action is to inspect reports, ops health, and platform settings to verify app state internally.',
        'For internal operations guidance, use the Reports, Ops, Settings, and Message Center together to review the running state of the app.',
      ],
    };
    const options = catalog[key] || catalog.learning;
    return `${options[Math.floor(Math.random() * options.length)]} Your message was: ${escapeCommunityHtml(String(userText || '').trim())}<div class="messages-ai-links">${buildAiResourceReply(userText, key)}</div>`;
  }

  function sendMessageToAiInbox() {
    const category = String(els.messagesCategory?.value || 'learning').trim() || 'learning';
    const team = AI_SERVICE_TEAMS[category] || { name: AI_GUIDE_NAME, address: AI_GUIDE_ADDRESS };
    const subject = String(els.messagesSubject?.value || '').trim() || 'New learning question';
    const body = String(els.messagesComposer?.value || '').trim();
    if (!body) return;
    let thread = getActiveThread();
    if (!thread || thread.subject === 'Welcome to Juzzy Message Center') {
      thread = {
        id: `thread-${Date.now()}`,
        subject,
        category,
        updatedAt: Date.now(),
        unread: false,
        messages: [],
      };
      state.messages.threads.unshift(thread);
      state.messages.activeThreadId = thread.id;
    }
    thread.subject = subject;
    thread.category = category;
    thread.updatedAt = Date.now();
    thread.messages.push({
      id: `msg-${Date.now()}`,
      senderName: state.profile.name || 'You',
      senderAddress: state.user.email || 'user@juzzy.local',
      role: 'user',
      body,
      ts: Date.now(),
    });
    if (els.messagesComposer) els.messagesComposer.value = '';
    saveMessageCenter();
    renderMessageCenter();

    const delayMs = 3000 + Math.floor(Math.random() * 9000);
    window.setTimeout(() => {
      thread.messages.push({
        id: `msg-${Date.now()}-ai`,
        senderName: team.name,
        senderAddress: team.address,
        role: 'ai',
        body: buildDelayedAiReply(body, category),
        ts: Date.now(),
      });
      thread.updatedAt = Date.now();
      thread.unread = !Boolean(document.querySelector('#tab-messages.panel.active'));
      if (thread.unread) state.messages.unreadCount += 1;
      saveMessageCenter();
      updateMessagesUnreadBadge();
      renderMessageCenter();
    }, delayMs);
  }

  function createNewMessageThread() {
    state.messages.activeThreadId = `thread-${Date.now()}`;
    state.messages.threads.unshift({
      id: state.messages.activeThreadId,
      subject: 'New learning question',
      category: String(els.messagesCategory?.value || 'learning').trim() || 'learning',
      updatedAt: Date.now(),
      unread: false,
      messages: [],
    });
    if (els.messagesSubject) els.messagesSubject.value = 'New learning question';
    if (els.messagesComposer) els.messagesComposer.value = '';
    saveMessageCenter();
    renderMessageCenter();
  }

  function isReportsActive() {
    return Boolean(document.querySelector('#tab-reports.panel.active'));
  }

  function loadVaultPrefs() {
    try {
      const net = String(localStorage.getItem('juzzy_vault_network') || '').trim();
      if (net === 'solana' || net === 'evm') state.vault.network = net;
    } catch {
      // ignore
    }

    try {
      const armed = localStorage.getItem('juzzy_vault_armed');
      if (armed === '1' || armed === '0') state.vault.armed = armed === '1';
    } catch {
      // ignore
    }

    try {
      const mx = Number(localStorage.getItem('juzzy_vault_max_usd') || '');
      if (Number.isFinite(mx) && mx > 0) state.vault.maxUsdPerTrade = mx;
    } catch {
      // ignore
    }

    try {
      const sl = Number(localStorage.getItem('juzzy_vault_slippage_bps') || '');
      if (Number.isFinite(sl) && sl >= 1 && sl <= 500) state.vault.slippageBps = sl;
    } catch {
      // ignore
    }

    if (els.vaultNetwork) {
      els.vaultNetwork.value = state.vault.network;
    }
    if (els.vaultArm) {
      els.vaultArm.checked = Boolean(state.vault.armed);
    }
    if (els.vaultMaxUsd) {
      els.vaultMaxUsd.value = String(state.vault.maxUsdPerTrade || 250);
    }
    if (els.vaultSlippage) {
      els.vaultSlippage.value = String(state.vault.slippageBps || 75);
    }
    renderVaultWallet();
    renderPortfolio();
    renderProfileUi();
  }

  function saveAuthProfile({ name, email, country, language, languageCustom, loggedIn }) {
    state.profile.name = String(name || '').trim();
    state.profile.country = String(country || '').toUpperCase();
    state.profile.language = String(language || 'en').trim() || 'en';
    state.profile.languageCustom = String(languageCustom || '').trim();
    state.profile.loggedIn = Boolean(loggedIn);
    state.profile.legalAccepted = true;
    state.user.email = String(email || '').trim();
    if (els.email) els.email.value = state.user.email;
    saveProfile();
    try {
      localStorage.setItem('pos_email', state.user.email);
    } catch {
      // ignore
    }
    renderProfileUi();
    renderPortfolio();
    state.user.lastBillingFetchAt = 0;
    fetchBillingStatus();
  }

  function setAuthStatus(message, type = 'info') {
    if (!els.authStatusMessage) return;
    els.authStatusMessage.textContent = String(message || '');
    els.authStatusMessage.style.color = type === 'error'
      ? '#ff8f9f'
      : type === 'success'
        ? '#8ff6c1'
        : 'rgba(234,240,255,0.78)';
  }

  function loadLocalAuthAccounts() {
    try {
      const raw = JSON.parse(localStorage.getItem(localAuthAccountsKey) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  function saveLocalAuthAccounts(accounts) {
    try {
      localStorage.setItem(localAuthAccountsKey, JSON.stringify(accounts || []));
    } catch {
      // ignore
    }
  }

  function findLocalAccountByEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    return loadLocalAuthAccounts().find((item) => String(item.email || '').trim().toLowerCase() === normalized) || null;
  }

  function upsertLocalAccount(account) {
    const accounts = loadLocalAuthAccounts();
    const normalized = String(account.email || '').trim().toLowerCase();
    const next = accounts.filter((item) => String(item.email || '').trim().toLowerCase() !== normalized);
    next.unshift({ ...account, email: normalized });
    saveLocalAuthAccounts(next);
  }

  function buildDesktopShortcutContent() {
    const target = window.location.href;
    return `[InternetShortcut]\r\nURL=${target}\r\nIconFile=${target.replace(/[^/]*$/, '')}favicon.ico\r\nIconIndex=0\r\n`;
  }

  function downloadDesktopShortcut() {
    const blob = new Blob([buildDesktopShortcutContent()], { type: 'application/internet-shortcut' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Juzzy Desktop.url';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setAuthStatus('Desktop shortcut downloaded. Save it to your Desktop and double-click it to open Juzzy.', 'success');
  }

  async function promptDesktopInstall() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      try {
        await deferredInstallPrompt.userChoice;
      } catch {
        // ignore
      }
      deferredInstallPrompt = null;
      setAuthStatus('Install prompt opened. If your browser supports app install, you can add Juzzy to your desktop.', 'success');
      return;
    }
    setAuthStatus('Direct install is not available in this browser context. Use "Download Desktop Shortcut" instead.', 'info');
  }

  function signInProfile() {
    const email = String(els.authSignInEmail?.value || '').trim();
    const password = String(els.authSignInPassword?.value || '').trim();
    const selectedCountry = String(els.authCountry?.value || '').toUpperCase();
    const language = String(els.authLanguage?.value || state.profile.language || 'en').trim();
    const languageCustom = String(els.authLanguageCustom?.value || '').trim();
    if (!validateEmail(email)) {
      appendTerminal('WARN', 'Sign-in requires a valid email.');
      setAuthStatus('Enter a valid email address to sign in.', 'error');
      return;
    }
    if (password.length < 4) {
      appendTerminal('WARN', 'Sign-in requires a password.');
      setAuthStatus('Enter your password to sign in.', 'error');
      return;
    }
    const account = findLocalAccountByEmail(email);
    if (!account) {
      appendTerminal('WARN', 'No local account found for that email.');
      setAuthStatus('No account found for that email. Create an account first.', 'error');
      return;
    }
    if (String(account.password || '') !== password) {
      appendTerminal('WARN', 'Incorrect password.');
      setAuthStatus('Incorrect password. Please try again.', 'error');
      return;
    }
    const country = selectedCountry || String(account.country || state.profile.country || '').toUpperCase();
    if (!country) {
      appendTerminal('WARN', 'Sign-in account is missing a saved country.');
      setAuthStatus('Select your country before signing in.', 'error');
      return;
    }
    if (!els.authLegalAgree?.checked) {
      appendTerminal('WARN', 'Please accept your country legal requirements before signing in.');
      setAuthStatus('Accept the legal confirmation before signing in.', 'error');
      return;
    }
    const fallbackName = account.name || state.profile.name || email.split('@')[0] || 'User';
    saveAuthProfile({
      name: fallbackName,
      email,
      country: country || account.country,
      language: language === 'custom' ? 'custom' : (language || account.language || 'en'),
      languageCustom: languageCustom || account.languageCustom || '',
      loggedIn: true,
    });
    appendTerminal('AUTH', `Signed in as ${email}.`);
    setAuthStatus(`Signed in as ${email}.`, 'success');
    setActiveTab('home');
  }

  function signUpProfile() {
    const name = String(els.authName?.value || '').trim();
    const email = String(els.authEmail?.value || '').trim();
    const password = String(els.authPassword?.value || '').trim();
    const country = String(els.authCountry?.value || '').toUpperCase();
    const language = String(els.authLanguage?.value || 'en').trim();
    const languageCustom = String(els.authLanguageCustom?.value || '').trim();
    if (!name) {
      appendTerminal('WARN', 'Create account requires your name.');
      setAuthStatus('Enter your full name to create an account.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      appendTerminal('WARN', 'Create account requires a valid email.');
      setAuthStatus('Enter a valid email address to create an account.', 'error');
      return;
    }
    if (password.length < 6) {
      appendTerminal('WARN', 'Create account requires a password with at least 6 characters.');
      setAuthStatus('Use a password with at least 6 characters.', 'error');
      return;
    }
    if (!country) {
      appendTerminal('WARN', 'Please select your country before using Juzzy.');
      setAuthStatus('Select your country before creating an account.', 'error');
      return;
    }
    if (!els.authLegalAgree?.checked) {
      appendTerminal('WARN', 'Please accept your country legal requirements to continue.');
      setAuthStatus('Accept the legal confirmation before creating an account.', 'error');
      return;
    }
    if (findLocalAccountByEmail(email)) {
      appendTerminal('WARN', 'An account with that email already exists.');
      setAuthStatus('An account with that email already exists. Sign in instead.', 'error');
      return;
    }
    upsertLocalAccount({
      name,
      email,
      password,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      createdAt: Date.now(),
    });
    saveAuthProfile({
      name,
      email,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      loggedIn: true,
    });
    appendTerminal('AUTH', `Account ready for ${email}.`);
    setAuthStatus(`Account created for ${email}.`, 'success');
    setActiveTab('portfolio');
  }

  function socialSignUp(provider) {
    const source = String(provider || '').toLowerCase() === 'apple' ? 'Apple' : 'Google';
    const country = String(els.authCountry?.value || state.profile.country || '').toUpperCase();
    const language = String(els.authLanguage?.value || state.profile.language || 'en').trim();
    const languageCustom = String(els.authLanguageCustom?.value || '').trim();
    const fallbackName = source === 'Apple' ? 'Apple User' : 'Google User';
    const existingEmail = String(els.authEmail?.value || state.user.email || '').trim();
    const email = validateEmail(existingEmail)
      ? existingEmail
      : `${source.toLowerCase()}.user.${Date.now()}@juzzy.local`;
    if (!country) {
      appendTerminal('WARN', 'Please select your country before using Juzzy.');
      setAuthStatus('Select your country before continuing.', 'error');
      return;
    }
    if (!els.authLegalAgree?.checked) {
      appendTerminal('WARN', `Please accept your country legal requirements before continuing with ${source}.`);
      setAuthStatus(`Accept the legal confirmation before continuing with ${source}.`, 'error');
      return;
    }
    upsertLocalAccount({
      name: String(els.authName?.value || '').trim() || fallbackName,
      email,
      password: `${source.toLowerCase()}-oauth`,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      createdAt: Date.now(),
      provider: source,
    });
    saveAuthProfile({
      name: String(els.authName?.value || '').trim() || fallbackName,
      email,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      loggedIn: true,
    });
    setAuthStatus(`${source} sign-in is ready for ${email}.`, 'success');
    appendTerminal('AUTH', `${source} quick signup ready.`);
    setActiveTab('portfolio');
  }

  function signOutProfile() {
    state.profile.loggedIn = false;
    state.profile.legalAccepted = false;
    saveProfile();
    renderProfileUi();
    setAuthStatus('Signed out. You can sign in again or create a new account.', 'info');
    appendTerminal('AUTH', 'Signed out.');
  }

  function skipAuthAndEnter() {
    // Allow guest access without full authentication
    state.profile.loggedIn = true; // Treat as logged in for UI purposes
    state.profile.name = 'Guest Learner';
    state.profile.legalAccepted = true;
    
    // Set a default country if not selected
    if (!state.profile.country) {
      state.profile.country = 'US'; // Default to US for guests
    }
    
    saveProfile();
    renderProfileUi();
    
    // Hide auth gate and show app
    if (els.authGate) {
      els.authGate.hidden = true;
    }
    
    appendTerminal('AUTH', 'Entered as Guest. Some features may require full sign-up.');
    emitAudit('AUTH_GUEST_ENTER', { country: state.profile.country }, 'INFO');
    
    // Start adaptive learning tracking
    if (typeof initAdaptiveLearning === 'function') {
      initAdaptiveLearning();
    }
  }

  function applySettingsProfile() {
    const country = String(els.settingsCountry?.value || state.profile.country || '').toUpperCase();
    const language = String(els.settingsLanguage?.value || state.profile.language || 'en').trim();
    const languageCustom = String(els.settingsLanguageCustom?.value || '').trim();
    if (!country) {
      appendTerminal('WARN', 'Please select your country before saving profile settings.');
      return;
    }
    state.profile.country = country;
    state.profile.language = language === 'custom' ? 'custom' : language;
    state.profile.languageCustom = languageCustom;
    saveProfile();
    renderProfileUi();
    renderPortfolio();
    appendTerminal('INFO', 'Profile settings saved.');
  }

  function saveVaultNetwork(net) {
    const v = net === 'evm' ? 'evm' : 'solana';
    state.vault.network = v;
    try {
      localStorage.setItem('juzzy_vault_network', v);
    } catch {
      // ignore
    }
    emitAudit('VAULT_NETWORK', { network: v });
  }

  function saveVaultRiskPrefs() {
    const armed = Boolean(els.vaultArm?.checked);
    const maxUsd = Number(els.vaultMaxUsd?.value || state.vault.maxUsdPerTrade);
    const slippageBps = Number(els.vaultSlippage?.value || state.vault.slippageBps);

    state.vault.armed = armed;
    if (Number.isFinite(maxUsd) && maxUsd > 0) state.vault.maxUsdPerTrade = maxUsd;
    if (Number.isFinite(slippageBps) && slippageBps >= 1 && slippageBps <= 500) state.vault.slippageBps = slippageBps;

    try {
      localStorage.setItem('juzzy_vault_armed', armed ? '1' : '0');
      localStorage.setItem('juzzy_vault_max_usd', String(state.vault.maxUsdPerTrade));
      localStorage.setItem('juzzy_vault_slippage_bps', String(state.vault.slippageBps));
    } catch {
      // ignore
    }
    emitAudit('VAULT_RISK', { armed: state.vault.armed, maxUsdPerTrade: state.vault.maxUsdPerTrade, slippageBps: state.vault.slippageBps });
  }

  function shortAddr(a) {
    const s = String(a || '');
    if (s.length < 10) return s;
    return `${s.slice(0, 6)}…${s.slice(-4)}`;
  }

  function renderVaultWallet() {
    if (!els.vaultWallet) return;
    if (state.walletConnected && state.walletAddress) {
      els.vaultWallet.textContent = shortAddr(state.walletAddress);
    } else {
      els.vaultWallet.textContent = 'Not connected';
    }
  }

  function getCountryProfile(code) {
    const key = String(code || '').toUpperCase();
    return COUNTRY_PROFILES.find((c) => c.code === key) || {
      code: key || 'GLOBAL',
      name: key || 'Country not selected',
      currency: 'USD',
      legal: 'Select your country before use. Juzzy provides educational content only and does not guarantee earnings, outcomes, or legal suitability in your jurisdiction.',
    };
  }

  function getSelectedLanguage(selectEl, customEl) {
    const custom = String(customEl?.value || '').trim();
    if (custom) return custom;
    return String(selectEl?.value || 'en').trim() || 'en';
  }

  function formatLanguage(code) {
    const value = String(code || 'en').trim() || 'en';
    try {
      const base = value.split('-')[0];
      const name = new Intl.DisplayNames([base], { type: 'language' }).of(base);
      return name ? `${name} (${value})` : value;
    } catch {
      return value;
    }
  }

  function populateCountryOptions() {
    [els.authCountry, els.settingsCountry].filter(Boolean).forEach((sel) => {
      const prev = String(sel.value || state.profile.country || '');
      sel.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Select your country';
      sel.appendChild(placeholder);
      for (const item of COUNTRY_PROFILES) {
        const opt = document.createElement('option');
        opt.value = item.code;
        opt.textContent = `${item.name} (${item.code})`;
        sel.appendChild(opt);
      }
      sel.value = COUNTRY_PROFILES.some((item) => item.code === prev) ? prev : '';
    });
  }

  function populateLanguageOptions() {
    [els.authLanguage, els.settingsLanguage].filter(Boolean).forEach((sel) => {
      const prev = String(sel.value || state.profile.language || 'en');
      sel.innerHTML = '';
      for (const code of COMMON_LANGUAGES) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = formatLanguage(code);
        sel.appendChild(opt);
      }
      const custom = document.createElement('option');
      custom.value = 'custom';
      custom.textContent = 'Custom language code';
      sel.appendChild(custom);
      sel.value = COMMON_LANGUAGES.includes(prev) ? prev : 'custom';
    });
  }

  function registerInstallSupport() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      setAuthStatus('Install is available. Use the Install App button to add Juzzy to your desktop.', 'success');
    });

    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('service-worker.js').catch(() => {
        // ignore registration failures
      });
    }
  }

  function saveProfile() {
    try {
      localStorage.setItem('juzzy_profile', JSON.stringify(state.profile));
    } catch {
      // ignore
    }
  }

  function loadProfile() {
    try {
      const raw = JSON.parse(localStorage.getItem('juzzy_profile') || 'null');
      if (raw && typeof raw === 'object') {
        state.profile.loggedIn = Boolean(raw.loggedIn);
        state.profile.name = String(raw.name || '');
        state.profile.country = String(raw.country || '');
        state.profile.language = String(raw.language || 'en');
        state.profile.languageCustom = String(raw.languageCustom || '');
        state.profile.legalAccepted = Boolean(raw.legalAccepted);
      }
    } catch {
      // ignore
    }
  }

  function renderCountryLegal() {
    const p = getCountryProfile(state.profile.country);
    const text = `${p.name}: ${p.legal} Educational content only. Nothing in Juzzy is a promise, guarantee, or assurance of profit, income, or investment success.`;
    if (els.authCountryLegal) els.authCountryLegal.textContent = text;
    if (els.settingsLegalText) els.settingsLegalText.textContent = text;
    if (els.portfolioCountryLegal) els.portfolioCountryLegal.textContent = text;
    if (els.portfolioRegionCurrency) els.portfolioRegionCurrency.textContent = `${p.name} / ${p.currency}`;
  }

  function renderProfileUi() {
    const lang = state.profile.languageCustom || state.profile.language || 'en';
    const country = getCountryProfile(state.profile.country);
    const selectedCountryCode = COUNTRY_PROFILES.some((item) => item.code === state.profile.country) ? state.profile.country : '';
    const isFamily = isAmegoFamilyUser();
    
    // Update owner plaque visibility
    if (els.ownerPlaque) {
      const isOwner = isOwnerApprover();
      els.ownerPlaque.classList.toggle('util-hidden', !isOwner);
      
      if (isOwner) {
        console.log('👑 Owner access detected - Displaying owner plaque');
      }
    }
    if (els.familyPlaque) {
      els.familyPlaque.classList.toggle('util-hidden', !isFamily || isOwnerApprover());
    }
    
    if (els.userIdentityPill) {
      const isOwner = isOwnerApprover();
      const baseText = state.profile.loggedIn
        ? `${state.profile.name || state.user.email || 'User'} • ${country.code}`
        : 'Guest';
      els.userIdentityPill.textContent = isOwner ? `👑 ${baseText}` : isFamily ? `💎 Amego Family • ${baseText}` : baseText;
    }
    if (els.portfolioCountry) els.portfolioCountry.textContent = country.name;
    if (els.portfolioLanguage) els.portfolioLanguage.textContent = formatLanguage(lang);
    if (els.settingsCountry) els.settingsCountry.value = selectedCountryCode;
    if (els.settingsLanguage) els.settingsLanguage.value = COMMON_LANGUAGES.includes(state.profile.language) ? state.profile.language : 'custom';
    if (els.settingsLanguageCustom) els.settingsLanguageCustom.value = state.profile.languageCustom || '';
    if (els.authCountry) els.authCountry.value = selectedCountryCode;
    if (els.authLanguage) els.authLanguage.value = COMMON_LANGUAGES.includes(state.profile.language) ? state.profile.language : 'custom';
    if (els.authLanguageCustom) els.authLanguageCustom.value = state.profile.languageCustom || '';
    if (els.authLegalAgree) els.authLegalAgree.checked = Boolean(state.profile.legalAccepted);
    if (els.authGate) els.authGate.hidden = state.profile.loggedIn && Boolean(state.profile.country) && Boolean(state.profile.legalAccepted);
    renderCountryLegal();
    renderGrowthRewards();
    renderOwnerAccessPanel();
  }

  function computePortfolioValue() {
    let total = Number(state.paper.bankedUsd || 0);
    for (const pos of state.paper.positions.values()) {
      const cur = state.market.universe.get(pos.key);
      const px = Number(cur?.priceUsd);
      const qty = Number(pos.qty || 0);
      if (Number.isFinite(px) && Number.isFinite(qty)) total += px * qty;
    }
    return total;
  }

  function renderPortfolio() {
    if (els.portfolioTotalValue) els.portfolioTotalValue.textContent = `$${formatMoney(computePortfolioValue())}`;
    if (els.portfolioPositions) els.portfolioPositions.textContent = String(state.paper.positions.size || 0);
    if (!els.portfolioRows) return;
    const rows = [];
    for (const pos of state.paper.positions.values()) {
      const cur = state.market.universe.get(pos.key);
      const px = Number(cur?.priceUsd);
      const qty = Number(pos.qty || 0);
      const value = Number.isFinite(px) ? px * qty : 0;
      rows.push(`
        <div class="report">
          <div><div class="id">${escapeHtml(String(pos.symbol || pos.name || pos.key))}</div><div class="muted small">${escapeHtml(String(pos.name || 'Tracked position'))}</div></div>
          <div><div style="font-weight:950">Qty ${formatMoney(qty)}</div><div class="muted small">Entry $${formatMoney(pos.entryPriceUsd || 0)}</div></div>
          <div><div style="font-weight:950">Value $${formatMoney(value)}</div><div class="muted small">Last $${formatMoney(px || 0)}</div></div>
          <div class="right"><button class="btn" style="height:38px" disabled>Tracked</button></div>
        </div>
      `);
    }
    if (!rows.length) {
      rows.push('<div class="muted">No holdings yet. Start with Tutorials, Leaders, Charts, or Oracle.</div>');
    }
    els.portfolioRows.innerHTML = rows.join('');
  }

  function findTutorialYouTubeLinks() {
    const links = [];
    const rx = /https:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/gi;
    for (const tut of allTutorials) {
      for (const step of Array.isArray(tut?.steps) ? tut.steps : []) {
        const html = String(step?.html || '');
        let m;
        while ((m = rx.exec(html))) {
          links.push({ tutorial: String(tut.title || tut.id || 'Tutorial'), url: m[0], videoId: m[1] });
        }
      }
    }
    return links;
  }

  function validateYouTubeLinks() {
    const found = findTutorialYouTubeLinks();
    const bad = found.filter((x) => !x.videoId || x.videoId.length < 6);
    if (!els.youtubeLinkStatus) return;
    if (!found.length) {
      els.youtubeLinkStatus.textContent = 'No YouTube links found in tutorials.';
      return;
    }
    els.youtubeLinkStatus.textContent = bad.length
      ? `Checked ${found.length} links. ${bad.length} invalid link(s) found.`
      : `Checked ${found.length} links. All detected YouTube links have valid structure.`;
  }

  function toHexQty(n) {
    const bi = typeof n === 'bigint' ? n : BigInt(String(n));
    return `0x${bi.toString(16)}`;
  }

  async function connectEvmWallet() {
    const eth = window.ethereum;
    if (!eth) throw new Error('MetaMask not found');
    const accts = await eth.request({ method: 'eth_requestAccounts' });
    const addr = Array.isArray(accts) ? String(accts[0] || '') : '';
    if (!addr) throw new Error('No account');
    state.walletConnected = true;
    state.walletAddress = addr;
    renderVaultWallet();
    emitAudit('WALLET_CONNECT', { network: 'evm', address: addr }, 'INFO');
    return addr;
  }

  async function ensureBaseChain() {
    const eth = window.ethereum;
    if (!eth) throw new Error('MetaMask not found');
    const want = state.vault.chainId || 8453;
    const curHex = await eth.request({ method: 'eth_chainId' });
    const cur = Number(curHex);
    if (cur === want) return;
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }],
      });
    } catch (e) {
      throw new Error('Please switch MetaMask to Base');
    }
  }

  const BASE_USDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

  async function fetch0xAllowance({ sellToken, owner }) {
    const url = `/api/0x/approve/allowance?chainId=${encodeURIComponent(state.vault.chainId)}&sellToken=${encodeURIComponent(sellToken)}&owner=${encodeURIComponent(owner)}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`0x allowance failed (${r.status})`);
    return await r.json();
  }

  async function fetch0xApproveTx({ sellToken, amount }) {
    const qs = `chainId=${encodeURIComponent(state.vault.chainId)}&sellToken=${encodeURIComponent(sellToken)}&amount=${encodeURIComponent(amount || '')}`;
    const r = await fetch(`/api/0x/approve/transaction?${qs}`);
    if (!r.ok) throw new Error(`0x approve tx failed (${r.status})`);
    return await r.json();
  }

  async function fetch0xQuote({ buyToken, sellToken, sellAmount, takerAddress, slippageBps }) {
    const qs = `chainId=${encodeURIComponent(state.vault.chainId)}&buyToken=${encodeURIComponent(buyToken)}&sellToken=${encodeURIComponent(sellToken)}&sellAmount=${encodeURIComponent(sellAmount)}&takerAddress=${encodeURIComponent(takerAddress)}&slippageBps=${encodeURIComponent(slippageBps)}`;
    const r = await fetch(`/api/0x/quote?${qs}`);
    if (!r.ok) throw new Error(`0x quote failed (${r.status})`);
    return await r.json();
  }

  async function sendEvmTx(tx) {
    const eth = window.ethereum;
    if (!eth) throw new Error('MetaMask not found');
    return await eth.request({ method: 'eth_sendTransaction', params: [tx] });
  }

  async function executeEvmBuyFlow({ assetKey, buyTokenAddress, amountUsd }) {
    if (state.vault.network !== 'evm') throw new Error('Vault network not EVM');
    if (!state.vault.armed) throw new Error('Trading not armed');
    if (!state.walletConnected || !state.walletAddress) throw new Error('Wallet not connected');

    const maxUsd = Number(state.vault.maxUsdPerTrade || 0);
    if (Number.isFinite(maxUsd) && maxUsd > 0 && amountUsd > maxUsd) {
      throw new Error(`Amount exceeds max ($${formatMoney(maxUsd)})`);
    }

    await ensureBaseChain();

    const sellToken = BASE_USDC;
    const buyToken = String(buyTokenAddress);
    const sellAmount = String(BigInt(Math.floor(amountUsd * 1_000_000))); // USDC 6 decimals
    const quote = await fetch0xQuote({
      buyToken,
      sellToken,
      sellAmount,
      takerAddress: state.walletAddress,
      slippageBps: Number(state.vault.slippageBps || 75),
    });

    emitAudit('TRADE_QUOTE', { chainId: state.vault.chainId, assetKey, sellToken, buyToken, sellAmount, quote: { buyAmount: quote?.buyAmount, price: quote?.price, guaranteedPrice: quote?.guaranteedPrice } }, 'INFO');

    const allowance = await fetch0xAllowance({ sellToken, owner: state.walletAddress });
    const allowanceAmt = BigInt(String(allowance?.allowance || '0'));
    const need = BigInt(sellAmount);
    if (allowanceAmt < need) {
      const approveTx = await fetch0xApproveTx({ sellToken, amount: sellAmount });
      const txHash = await sendEvmTx({
        from: state.walletAddress,
        to: String(approveTx?.to || ''),
        data: String(approveTx?.data || ''),
        value: toHexQty(0n),
      });
      emitAudit('TRADE_APPROVE_SUBMIT', { chainId: state.vault.chainId, assetKey, sellToken, amount: sellAmount, txHash }, 'INFO');
    }

    const swapTx = {
      from: state.walletAddress,
      to: String(quote?.to || ''),
      data: String(quote?.data || ''),
      value: toHexQty(BigInt(String(quote?.value || '0'))),
    };
    const swapHash = await sendEvmTx(swapTx);
    emitAudit('TRADE_SWAP_SUBMIT', { chainId: state.vault.chainId, assetKey, swapHash, sellAmount, buyAmount: quote?.buyAmount }, 'INFO');

    state.reports.unshift({
      id: `X-${String(Date.now())}`,
      asset: String(state.market.universe.get(assetKey)?.symbol || assetKey).toUpperCase(),
      status: 'TRADE_SWAP_SUBMIT',
      notional: amountUsd,
      fee: 0,
      ts: Date.now(),
      detail: { safeguards: 930, reason: 'EVM swap submitted (Base).', data: { chainId: state.vault.chainId, assetKey, swapHash, sellToken, buyToken, sellAmount, buyAmount: quote?.buyAmount } },
    });
    applyReportsLiveUpdate();

    return { swapHash };
  }

  function clearChartPriceLines(assetKey) {
    const k = String(assetKey || state.charts.lastAsset || '');
    const lines = state.charts.priceLinesByAsset.get(k) || [];
    for (const l of lines) {
      try {
        state.charts.series?.removePriceLine(l);
      } catch {
        // ignore
      }
    }
    state.charts.priceLinesByAsset.set(k, []);
    try {
      localStorage.setItem(`juzzy_chart_lines_${k}`, JSON.stringify([]));
    } catch {
      // ignore
    }
  }

  function restoreChartPriceLines(assetKey) {
    const k = String(assetKey || state.charts.lastAsset || '');
    if (!state.charts.series) return;

    clearChartPriceLines(k);
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(`juzzy_chart_lines_${k}`) || '[]');
    } catch {
      saved = [];
    }
    if (!Array.isArray(saved)) saved = [];

    const lines = [];
    for (const p of saved) {
      const price = Number(p);
      if (!Number.isFinite(price) || price <= 0) continue;
      try {
        const line = state.charts.series.createPriceLine({
          price,
          color: 'rgba(255,79,184,0.92)',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'R',
        });
        lines.push(line);
      } catch {
        // ignore
      }
    }
    state.charts.priceLinesByAsset.set(k, lines);
    renderChartLineReport(k);
  }

  function getSavedLines(assetKey) {
    const k = String(assetKey || state.charts.lastAsset || '');
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(`juzzy_chart_lines_${k}`) || '[]');
    } catch {
      saved = [];
    }
    if (!Array.isArray(saved)) saved = [];
    return saved.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  }

  function renderChartLineReport(assetKey) {
    if (!els.chartLineReport) return;
    const k = String(assetKey || state.charts.lastAsset || '');
    const it = state.market.universe.get(k);
    const sym = String(it?.symbol || it?.name || k || '').toUpperCase();
    const lines = getSavedLines(k);
    const px = Number(it?.priceUsd);

    if (!lines.length) {
      els.chartLineReport.textContent = '';
      return;
    }

    const parts = [];
    parts.push(`AI lines report (${sym || 'ASSET'}):`);
    if (Number.isFinite(px) && px > 0) {
      const nearest = lines.reduce((best, v) => {
        const d = Math.abs(v - px);
        if (!best || d < best.d) return { v, d };
        return best;
      }, null);
      if (nearest) {
        const pct = ((nearest.v - px) / px) * 100;
        parts.push(`Nearest line $${formatMoney(nearest.v)} (${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)`);
      }
    }
    parts.push(`Lines: ${lines.map((v) => `$${formatMoney(v)}`).join(' · ')}`);
    els.chartLineReport.textContent = parts.join(' ');
  }

  function recordTradeIntent({ side, assetKey, priceUsd, lineUsd, reason }) {
    const it = state.market.universe.get(assetKey);
    const sym = String(it?.symbol || it?.name || assetKey).toUpperCase();
    const msg = `Trade intent (${side}) ${sym} @ ~$${formatMoney(priceUsd)} (line $${formatMoney(lineUsd)}).`;

    emitAudit('TRADE_INTENT', { side, assetKey, symbol: sym, priceUsd, lineUsd, reason }, 'INFO');
    state.reports.unshift({
      id: `T-${String(Date.now())}`,
      asset: sym,
      status: 'TRADE_INTENT',
      notional: 0,
      fee: 0,
      ts: Date.now(),
      detail: { safeguards: 940, reason: msg, data: { side, assetKey, priceUsd, lineUsd, reason } },
    });
    applyReportsLiveUpdate();
  }

  function maybePromptTradeOnCross({ assetKey, priceUsd, lineUsd, dir }) {
    const cooldownKey = `${String(assetKey)}|${String(lineUsd)}|${String(dir)}`;
    const last = Number(state.charts.lastCrossAtByLine.get(cooldownKey) || 0);
    if (Date.now() - last < 45_000) return;
    state.charts.lastCrossAtByLine.set(cooldownKey, Date.now());

    const it = state.market.universe.get(assetKey);
    const sym = String(it?.symbol || it?.name || assetKey).toUpperCase();
    const side = dir === 'up' ? 'BUY' : 'SELL';
    const network = String(state.vault?.network || 'solana');
    const venueLabel = network === 'evm' ? 'EVM (MetaMask)' : 'Solana (Phantom + Jupiter)';

    const canExecuteEvmBuy = Boolean(
      network === 'evm' &&
        state.vault.armed &&
        side === 'BUY' &&
        String(it?.source || '') === 'dexscreener' &&
        String(it?.dex?.baseTokenAddress || ''),
    );

    openModal({
      title: `Line crossed: ${sym}`,
      bodyHtml: `
        <div class="muted">Price crossed <strong>$${formatMoney(lineUsd)}</strong> (${dir.toUpperCase()}).</div>
        <div class="muted">Current price: <strong>$${formatMoney(priceUsd)}</strong></div>
        <div class="muted small" style="margin-top:10px">AI note: a resistance break can signal continuation; a breakdown can signal weakness. Always confirm risk.</div>
        <div class="muted small" style="margin-top:10px">Venue: <strong>${venueLabel}</strong> (Base)</div>
        <div class="muted small" style="margin-top:10px">${canExecuteEvmBuy ? 'Mode: <strong>Live execute</strong> (will ask MetaMask to confirm).' : 'Mode: <strong>Intent only</strong> (execution unavailable for this asset/side or not armed). Your choice will be logged.'}</div>
      `,
      primaryText: canExecuteEvmBuy ? 'Quote + Confirm BUY' : `Confirm ${side}`,
      secondaryText: 'Cancel',
      onPrimary: async () => {
        if (!canExecuteEvmBuy) {
          recordTradeIntent({ side, assetKey, priceUsd, lineUsd, reason: `Line crossed ${dir}` });
          return;
        }

        try {
          if (!state.walletConnected) {
            await connectEvmWallet();
          }

          const raw = window.prompt(`Buy amount in USDC on Base (max $${formatMoney(state.vault.maxUsdPerTrade)}):`, '25');
          if (raw == null) return;
          const amountUsd = Number(String(raw).trim());
          if (!Number.isFinite(amountUsd) || amountUsd <= 0) return;

          const buyTokenAddress = String(it?.dex?.baseTokenAddress || '').trim();
          if (!buyTokenAddress) throw new Error('Missing token address');

          openModal({
            title: `Confirm BUY ${sym}`,
            bodyHtml: `<div class="muted">You are about to swap <strong>$${formatMoney(amountUsd)} USDC</strong> for <strong>${sym}</strong> on <strong>Base</strong>.</div><div class="muted small" style="margin-top:10px">Slippage: ${Number(state.vault.slippageBps || 75)} bps. MetaMask will ask you to confirm approval (if needed) and the swap.</div>`,
            primaryText: 'Execute in MetaMask',
            secondaryText: 'Cancel',
            onPrimary: async () => {
              try {
                await executeEvmBuyFlow({ assetKey, buyTokenAddress, amountUsd });
              } catch (e) {
                appendTerminal('WARN', `Trade failed: ${String(e?.message || e)}`);
                emitAudit('TRADE_SWAP_ERR', { chainId: state.vault.chainId, assetKey, error: String(e?.message || e) }, 'WARN');
                recordTradeIntent({ side: 'BUY', assetKey, priceUsd, lineUsd, reason: `Execution failed: ${String(e?.message || e)}` });
              }
            },
          });
        } catch (e) {
          appendTerminal('WARN', `Trade unavailable: ${String(e?.message || e)}`);
          emitAudit('TRADE_UNAVAILABLE', { assetKey, error: String(e?.message || e) }, 'WARN');
          recordTradeIntent({ side, assetKey, priceUsd, lineUsd, reason: `Trade unavailable: ${String(e?.message || e)}` });
        }
      },
    });
  }

  function checkResistanceCrosses(assetKey) {
    const k = String(assetKey || state.charts.lastAsset || '');
    const it = state.market.universe.get(k);
    const px = Number(it?.priceUsd);
    if (!Number.isFinite(px) || px <= 0) return;

    const prev = Number(state.charts.lastPriceByAsset.get(k) || 0);
    state.charts.lastPriceByAsset.set(k, px);
    if (!Number.isFinite(prev) || prev <= 0) return;

    const lines = getSavedLines(k);
    if (!lines.length) return;

    for (const lineUsd of lines) {
      if (prev < lineUsd && px >= lineUsd) {
        maybePromptTradeOnCross({ assetKey: k, priceUsd: px, lineUsd, dir: 'up' });
      }
      if (prev > lineUsd && px <= lineUsd) {
        maybePromptTradeOnCross({ assetKey: k, priceUsd: px, lineUsd, dir: 'down' });
      }
    }
  }

  async function fetchBinanceKlines(symbolUsdt, limit = 500) {
    const url = `/api/binance/klines?symbol=${encodeURIComponent(symbolUsdt)}&interval=1m&limit=${encodeURIComponent(limit)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance klines failed (${res.status})`);
    const payload = await res.json();
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return items
      .map((k) => {
        const t = Math.floor(Number(k?.[0] || 0) / 1000);
        const open = Number(k?.[1]);
        const high = Number(k?.[2]);
        const low = Number(k?.[3]);
        const close = Number(k?.[4]);
        if (!t || !Number.isFinite(open) || !Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(close)) return null;
        return { time: t, open, high, low, close };
      })
      .filter(Boolean);
  }

  function isNearTop(el) {
    if (!el) return true;
    return (el.scrollTop || 0) <= 20;
  }

  function isNearBottom(el) {
    if (!el) return false;
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
  }

  function updateReportsNewIndicator() {
    if (!els.reportsNewBtn || !els.reportsNewCount) return;
    const n = Number(state.reportsNewPending || 0);
    els.reportsNewCount.textContent = String(n);
    els.reportsNewBtn.hidden = n <= 0;
  }

  function buildReportRow(r) {
    const el = document.createElement('div');
    el.className = 'report';

    const dt = new Date(r.ts);
    const date = dt.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    el.innerHTML = `
      <div>
        <div class="id">${escapeHtml(r.id)}</div>
        <div class="muted small">${escapeHtml(date)}</div>
      </div>
      <div>
        <div style="font-weight:950">${escapeHtml(r.asset)}</div>
        <div class="muted small">Notional $${formatMoney(r.notional)}</div>
      </div>
      <div>
        <div style="font-weight:950">${escapeHtml(r.status)}</div>
        <div class="muted small">Fee $${formatMoney(r.fee)}</div>
      </div>
      <div class="right">
        <button class="btn" style="height:38px">Open</button>
      </div>
    `;

    el.addEventListener('click', () => {
      openModal({
        title: `${r.id} — ${r.asset}`,
        bodyHtml: `
          <div class="muted">Status: <strong>${escapeHtml(r.status)}</strong></div>
          <div class="muted">Notional: <strong>$${formatMoney(r.notional)}</strong></div>
          <div class="muted">Service fee (1%): <strong>$${formatMoney(r.fee)}</strong></div>
          <div class="muted">Safeguards: <strong>${r.detail.safeguards}</strong></div>
          <div class="muted" style="margin-top:10px">${escapeHtml(r.detail.reason)}</div>
          <div class="muted small" style="margin-top:10px">In V2 this drill-down can link out to raw logs, routes, and risk checks.</div>
        `,
        primaryText: 'Close',
        secondaryText: 'OK',
      });
    });

    return el;
  }

  function applyReportsLiveUpdate() {
    if (!els.reportsList) return;
    if (!isReportsActive()) return;
    if (state.reportsRendered <= 0) return;

    const currentTopId = state.reportsLastRenderedId;
    if (!currentTopId) return;
    const q = (els.reportSearch?.value || '').trim();
    if (q) return;

    const idx = state.reports.findIndex((r) => r && r.id === currentTopId);
    if (idx <= 0) return;

    const newOnes = state.reports.slice(0, idx);
    if (newOnes.length === 0) return;

    if (!isNearTop(els.reportsList)) {
      state.reportsNewPending += newOnes.length;
      updateReportsNewIndicator();
      return;
    }

    const prevScrollHeight = els.reportsList.scrollHeight;
    for (let i = newOnes.length - 1; i >= 0; i--) {
      const node = buildReportRow(newOnes[i]);
      els.reportsList.prepend(node);
      state.reportsRendered += 1;
    }
    state.reportsLastRenderedId = state.reports[0]?.id || state.reportsLastRenderedId;

    const delta = els.reportsList.scrollHeight - prevScrollHeight;
    els.reportsList.scrollTop += delta;
  }


  let marketStreamClient = null;
  let auditStreamClient = null;

  const brain = {
    lastGlobalSignalAt: 0,
    lastByKindKey: new Map(),
    maxSignalsPerMinute: 18,
    signalWindow: [],
  };

  function isRateLimited() {
    const now = Date.now();
    brain.signalWindow = brain.signalWindow.filter((t) => now - t < 60_000);
    return brain.signalWindow.length >= brain.maxSignalsPerMinute;
  }

  function canSignal(kind, key, cooldownMs) {
    const now = Date.now();
    const k = `${String(kind)}::${String(key || '')}`;
    const last = Number(brain.lastByKindKey.get(k) || 0);
    if (now - last < (Number(cooldownMs) || 0)) return false;
    if (isRateLimited()) return false;
    brain.lastByKindKey.set(k, now);
    brain.signalWindow.push(now);
    brain.lastGlobalSignalAt = now;
    return true;
  }

  function formatMoney(n) {
    const v = Number(n) || 0;
    return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function connectSseWithRetry(url, handlers, label) {
    let es = null;
    let retry = 0;
    let stopped = false;

    const baseDelayMs = 600;
    const maxDelayMs = 15_000;

    function close() {
      try {
        if (es) es.close();
      } catch {
        // ignore
      }
      es = null;
    }

    function scheduleReconnect() {
      if (stopped) return;
      const delay = Math.min(maxDelayMs, Math.floor(baseDelayMs * 2 ** retry));
      const jitter = Math.floor(Math.random() * 350);
      window.setTimeout(() => {
        if (stopped) return;
        retry = Math.min(6, retry + 1);
        connect();
      }, delay + jitter);
    }

    function connect() {
      close();
      try {
        es = new EventSource(url);
      } catch {
        scheduleReconnect();
        return;
      }

      es.onopen = () => {
        retry = 0;
        if (handlers?.onopen) handlers.onopen();
      };
      es.onerror = () => {
        if (handlers?.onerror) handlers.onerror();
        close();
        scheduleReconnect();
      };
      es.onmessage = (ev) => {
        if (handlers?.onmessage) handlers.onmessage(ev);
      };
    }

    connect();

    return {
      label,
      stop() {
        stopped = true;
        close();
      },
    };
  }

  function isCoinGeckoItem(item) {
    return item && item.source === 'coingecko' && typeof item.id === 'string' && item.id.length > 0;
  }

  function setChartFilter(filter) {
    state.charts.filter = String(filter || 'all');
    if (els.chartFilterAll) els.chartFilterAll.classList.toggle('active', state.charts.filter === 'all');
    if (els.chartFilterGains) els.chartFilterGains.classList.toggle('active', state.charts.filter === 'gains');
    if (els.chartFilterFalls) els.chartFilterFalls.classList.toggle('active', state.charts.filter === 'falls');
    if (els.chartFilterBirths) els.chartFilterBirths.classList.toggle('active', state.charts.filter === 'births');
    if (els.chartFilterSandbox) els.chartFilterSandbox.classList.toggle('active', state.charts.filter === 'sandbox');
    populateChartAssetOptions();
  }

  function populateChartAssetOptions() {
    if (!els.chartAsset) return;

    const SANDBOX_LIQ_USD_MAX = 200_000;
    const SANDBOX_AGE_MS_MAX = 24 * 60 * 60 * 1000;
    const BIRTH_AGE_MS_MAX = 2 * 60 * 60 * 1000;

    const q = String(els.chartSearch?.value || '').trim().toLowerCase();
    const selected = String(els.chartAsset.value || '');

    const items = Array.from(state.market.universe.values());
    const births = state.market.birthKeys;
    const filter = state.charts.filter;

    const filtered = items
      .filter((it) => {
        const sym = String(it?.symbol || '').toLowerCase();
        const name = String(it?.name || '').toLowerCase();
        if (q && !sym.includes(q) && !name.includes(q)) return false;
        const chg = Number(it?.chg24Pct);
        if (filter === 'gains') return Number.isFinite(chg) && chg > 0;
        if (filter === 'falls') return Number.isFinite(chg) && chg < 0;
        if (filter === 'births') {
          const createdAt = Number(it?.dex?.pairCreatedAt);
          const ageOk = Number.isFinite(createdAt) ? Date.now() - createdAt <= BIRTH_AGE_MS_MAX : false;
          return ageOk || Boolean(it?.key && births && births.has(it.key));
        }
        if (filter === 'sandbox') {
          if (String(it?.source || '') !== 'dexscreener') return false;
          const liq = Number(it?.dex?.liquidityUsd);
          const createdAt = Number(it?.dex?.pairCreatedAt);
          const ageOk = Number.isFinite(createdAt) ? Date.now() - createdAt <= SANDBOX_AGE_MS_MAX : false;
          const liqOk = Number.isFinite(liq) ? liq <= SANDBOX_LIQ_USD_MAX : false;
          return ageOk || liqOk;
        }
        return true;
      })
      .sort((a, b) => {
        const av = Number(a?.vol24Usd || 0);
        const bv = Number(b?.vol24Usd || 0);
        if (bv !== av) return bv - av;
        const achg = Math.abs(Number(a?.chg24Pct || 0));
        const bchg = Math.abs(Number(b?.chg24Pct || 0));
        return bchg - achg;
      })
      .slice(0, 400);

    els.chartAsset.innerHTML = '';
    for (const it of filtered) {
      const sym = String(it?.symbol || '').toUpperCase();
      if (!sym) continue;
      const opt = document.createElement('option');
      opt.value = String(it.key);
      opt.textContent = `${it.name || sym} (${sym})`;
      els.chartAsset.appendChild(opt);
    }

    if (selected && Array.from(els.chartAsset.options).some((o) => o.value === selected)) {
      els.chartAsset.value = selected;
      return;
    }

    if (els.chartAsset.options.length > 0) {
      els.chartAsset.value = els.chartAsset.options[0].value;
    }

    // Show empty-state hint when filter yields no results
    const noResults = els.chartAsset.options.length === 0;
    if (noResults && (filter === 'births' || filter === 'sandbox')) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = filter === 'births'
        ? '(No new tokens in the last 2 hours)'
        : '(No sandbox tokens found right now)';
      opt.disabled = true;
      opt.selected = true;
      els.chartAsset.appendChild(opt);
    }

    // If the selected asset changed, refresh the chart
    const newSel = String(els.chartAsset.value || '');
    if (newSel && newSel !== selected) {
      refreshChart();
    }
  }

  function upsertLivePoint(key, priceUsd) {
    if (!key) return;
    const px = Number(priceUsd);
    if (!Number.isFinite(px) || px <= 0) return;
    const arr = state.charts.liveHistory.get(key) || [];
    const t = Math.floor(Date.now() / 1000);
    const last = arr[arr.length - 1];
    if (last && last.time === t) {
      last.value = px;
    } else {
      arr.push({ time: t, value: px });
    }
    if (arr.length > 600) arr.splice(0, arr.length - 600);
    state.charts.liveHistory.set(key, arr);
    checkResistanceCrosses(key);
  }

  function nowTs() {
    const d = new Date();
    return d.toLocaleTimeString(undefined, { hour12: false });
  }

  function wireGlobalErrorHandlers() {
    window.addEventListener('error', (e) => {
      try {
        const msg = String(e?.message || 'Runtime error');
        const src = String(e?.filename || '');
        const line = Number(e?.lineno || 0);
        appendTerminal('ERR', `JS error: ${msg}${src ? ` (${src}${line ? `:${line}` : ''})` : ''}`);
        emitAudit('JS_ERROR', { message: msg, filename: src || null, lineno: Number.isFinite(line) ? line : null }, 'ERR');
      } catch {
        // ignore
      }
    });

    window.addEventListener('unhandledrejection', (e) => {
      try {
        const reason = e?.reason;
        const msg = String(reason?.message || reason || 'Unhandled promise rejection');
        appendTerminal('ERR', `Unhandled rejection: ${msg}`);
        emitAudit('JS_UNHANDLED_REJECTION', { message: msg }, 'ERR');
      } catch {
        // ignore
      }
    });
  }

  function renderTopStatus() {
    if (!els.statusText) return;
    const freshMs = 12_000;
    const last = Number(state.market.lastUpdateAt || 0);
    const age = last ? Date.now() - last : Infinity;
    const isFresh = Number.isFinite(age) && age >= 0 && age <= freshMs;
    const live = state.market.connected || isFresh;
    const mode = state.market.connected ? 'SSE' : isFresh ? 'SNAP' : 'OFF';
    const action = String(state.ui.actionStatus || 'Idle');
    els.statusText.textContent = live ? `LIVE:${mode}` : action;
  }

  function setStatus(text) {
    state.ui.actionStatus = String(text || 'Idle');
    renderTopStatus();
  }

  function updatePaperKpis() {
    if (els.kpiBanked) els.kpiBanked.textContent = `$${formatMoney(state.paper.bankedUsd)}`;
    if (!els.kpiPaperPnl) return;

    let pnl = 0;
    for (const pos of state.paper.positions.values()) {
      const cur = state.market.universe.get(pos.key);
      const px = Number(cur?.priceUsd);
      if (!Number.isFinite(px)) continue;
      const value = px * pos.qty;
      pnl += value - pos.notionalUsd;
    }
    els.kpiPaperPnl.textContent = `$${formatMoney(pnl)}`;
    renderPortfolio();
  }

  function ensurePaperPosition(it, notionalUsd = 100) {
    if (!state.paper.enabled) return;
    if (!it?.key) return;
    const key = String(it.key);
    const symbol = String(it.symbol || '').toUpperCase();
    const name = String(it.name || symbol || key);
    const px = Number(it.priceUsd);
    if (!Number.isFinite(px) || px <= 0) return;
    if (state.paper.positions.has(key)) return;

    const qty = notionalUsd / px;
    state.paper.positions.set(key, {
      key,
      symbol,
      name,
      entryPriceUsd: px,
      notionalUsd,
      qty,
      lastBankStep: 0,
      createdAt: Date.now(),
    });

    state.reports.unshift({
      id: `P-${String(Date.now())}`,
      asset: symbol || name,
      status: 'PAPER_TRACK_START',
      notional: notionalUsd,
      fee: 0,
      ts: Date.now(),
      detail: { safeguards: 980, reason: `Paper tracking started: entry $${formatMoney(px)}.` },
    });
    applyReportsLiveUpdate();
    emitAudit('PAPER_TRACK_START', { key, symbol, name, entryPriceUsd: px, notionalUsd }, 'INFO');
    updatePaperKpis();
  }

  function paperBankingTick() {
    if (!state.paper.enabled) return;
    let bankedAny = false;

    for (const pos of state.paper.positions.values()) {
      const cur = state.market.universe.get(pos.key);
      const px = Number(cur?.priceUsd);
      if (!Number.isFinite(px) || px <= 0) continue;

      const pct = ((px - pos.entryPriceUsd) / pos.entryPriceUsd) * 100;
      if (!Number.isFinite(pct)) continue;

      const step = Math.floor(pct / 10) * 10;
      const bankPerStepUsd = Math.max(0, pos.notionalUsd * 0.005);
      while (step >= pos.lastBankStep + 10) {
        pos.lastBankStep += 10;
        const bankUsd = bankPerStepUsd;
        if (bankUsd > 0) {
          state.paper.bankedUsd += bankUsd;
          state.paper.realizedUsd += bankUsd;
          bankedAny = true;

          state.reports.unshift({
            id: `BK-${String(Date.now())}`,
            asset: pos.symbol || pos.name,
            status: 'PAPER_BANK_GAIN',
            notional: bankUsd,
            fee: 0,
            ts: Date.now(),
            detail: {
              safeguards: 990,
              reason: `Banked 5% of gains at +${pos.lastBankStep}% step.`,
              key: pos.key,
              entryPriceUsd: pos.entryPriceUsd,
              priceUsd: px,
              bankUsd,
            },
          });
          emitAudit('PAPER_BANK_GAIN', { key: pos.key, symbol: pos.symbol, step: pos.lastBankStep, bankUsd, entryPriceUsd: pos.entryPriceUsd, priceUsd: px }, 'INFO');
        }
      }
    }

    if (bankedAny) {
      applyReportsLiveUpdate();
      updatePaperKpis();
    }
  }

  function setSimpleMode(on) {
    state.ui.simpleMode = Boolean(on);
    if (FEATURES.simpleMode) {
      document.body.classList.toggle('simple-mode', state.ui.simpleMode);
      if (els.simpleBar) els.simpleBar.hidden = !state.ui.simpleMode;
      if (els.simpleModeBtn) els.simpleModeBtn.textContent = state.ui.simpleMode ? 'Pro Mode' : 'Simple Mode';
    }
    localStorage.setItem('pos_simple_mode', state.ui.simpleMode ? '1' : '0');
  }

  function getEmail() {
    return (state.user.email || '').trim();
  }

  function validateEmail(email) {
    // Basic sanity check (not strict RFC validation)
    return /.+@.+\..+/.test(email);
  }

  function setAutoUi() {
    els.oneInvest.disabled = !canStartAutopilot();
    els.stopAuto.disabled = !state.autopilot.active;
    els.autoStatus.textContent = state.autopilot.active ? 'Running (24h)' : 'Off';

    els.gateSub.checked = state.billing.subscribed;
    els.gateUpfront.checked = state.billing.upfrontPaid && state.billing.upfrontForTotal === Number(els.fuel.value || 0);

    if (els.simpleStart) els.simpleStart.disabled = !canStartAutopilot();
    if (els.simpleStop) els.simpleStop.disabled = !state.autopilot.active;
  }

  function canStartAutopilot() {
    if (state.autopilot.active) return false;

    const total = Number(els.fuel.value || 0);
    const paidForThisTotal = state.billing.upfrontPaid && state.billing.upfrontForTotal === total;

    return Boolean(
      state.billing.subscribed &&
        paidForThisTotal &&
        els.gateRisk.checked &&
        els.gateFee.checked &&
        els.gateTime.checked,
    );
  }

  function qsAll(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  function getCurrentActiveTabId() {
    const activeTabBtn = document.querySelector('.tab.active');
    return activeTabBtn?.dataset?.tab || 'home';
  }

  function defaultGrowthRewards() {
    return {
      referralCode: '',
      referrals: [],
      suggestions: [],
      freeModuleCredits: 0,
      fullAccessUntil: 0,
      ownerLifetimeAccess: [],
      familyLifetimeAccess: [],
      starterTrialUsed: false,
      starterTrialEndsAt: 0,
      starterTrialCredits: 0,
      previewUnlockedLessons: [],
    };
  }

  function getStarterTierConfig() {
    return {
      name: 'Starter Trial',
      freeLessons: 6,
      premiumPreviewModules: 2,
      durationDays: 21,
      communityMode: 'read + guided prompts',
      includes: ['Freebies tab', 'selected community/resource links', 'limited academy lessons', 'share invitations'],
      upgradeHook: 'Unlock full pathways, deeper modules, premium boards, and paid course stacks with Stripe.',
    };
  }

  function isStarterTrialActive(rewards = loadGrowthRewards()) {
    return Number(rewards.starterTrialEndsAt || 0) > Date.now();
  }

  function getPreviewUnlockedLessons(rewards = loadGrowthRewards()) {
    return Array.isArray(rewards.previewUnlockedLessons) ? rewards.previewUnlockedLessons : [];
  }

  function hasLessonPreviewUnlock(id, rewards = loadGrowthRewards()) {
    return getPreviewUnlockedLessons(rewards).includes(String(id || '').trim());
  }

  function canAccessPaidLesson(id) {
    const rewards = loadGrowthRewards();
    const ownerGranted = Array.isArray(rewards.ownerLifetimeAccess)
      && rewards.ownerLifetimeAccess.includes(String(state.user.email || '').trim().toLowerCase());
    const familyGranted = Array.isArray(rewards.familyLifetimeAccess)
      && rewards.familyLifetimeAccess.includes(String(state.user.email || '').trim().toLowerCase());
    if (isOwnerApprover()) return true;
    if (state.billing.subscribed || ownerGranted || familyGranted || Number(rewards.fullAccessUntil || 0) > Date.now()) return true;
    return hasLessonPreviewUnlock(id, rewards);
  }

  function getShareBaseUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  function buildInviteLink(kind = 'starter', recipientEmail = '', recipientName = '') {
    const code = ensureReferralCode();
    const url = new URL(getShareBaseUrl(), window.location.href);
    url.searchParams.set('ref', code);
    url.searchParams.set('share', kind);
    if (recipientEmail) url.searchParams.set('familyEmail', String(recipientEmail || '').trim().toLowerCase());
    if (recipientName) url.searchParams.set('familyName', String(recipientName || '').trim());
    return url.toString();
  }

  function buildShareCopy(kind = 'starter', email = '') {
    const starter = getStarterTierConfig();
    const fallbackName = email ? String(email).split('@')[0] : '';
    const inviteLink = buildInviteLink(kind, email, fallbackName);
    const targetLine = email ? `I set this aside for ${email}. ` : '';
    return `${targetLine}Try Juzzy free with a guided ${starter.name.toLowerCase()} — ${starter.freeLessons} free lessons, curated freebies, selected community access, and premium previews without full unlocks. ${starter.upgradeHook} ${inviteLink}`;
  }

  function formatInviteDisplayName(raw) {
    const normalized = String(raw || '').trim();
    if (!normalized) return 'Amego Family Member';
    return normalized
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function provisionFamilyAccessFromInvite(email, nameHint = '') {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) return false;
    const rewards = loadGrowthRewards();
    const familyGrants = Array.isArray(rewards.familyLifetimeAccess) ? rewards.familyLifetimeAccess : [];
    if (!familyGrants.includes(normalizedEmail)) return false;
    const existing = findLocalAccountByEmail(normalizedEmail);
    const displayName = formatInviteDisplayName(nameHint || normalizedEmail.split('@')[0]);
    const country = String(state.profile.country || 'US').toUpperCase() || 'US';
    const language = String(state.profile.language || 'en').trim() || 'en';
    upsertLocalAccount({
      name: existing?.name || displayName,
      email: normalizedEmail,
      password: existing?.password || '__family_link_access__',
      country: existing?.country || country,
      language: existing?.language || language,
      languageCustom: existing?.languageCustom || '',
      createdAt: existing?.createdAt || Date.now(),
      provider: existing?.provider || 'family-link',
    });
    saveAuthProfile({
      name: existing?.name || displayName,
      email: normalizedEmail,
      country: existing?.country || country,
      language: existing?.language || language,
      languageCustom: existing?.languageCustom || '',
      loggedIn: true,
    });
    if (els.authGate) els.authGate.hidden = true;
    setActiveTab('home');
    setAuthStatus(`Signed in automatically with Amego Family access for ${normalizedEmail}.`, 'success');
    return true;
  }

  async function copyTextValue(value, successTitle = 'Copied') {
    const text = String(value || '').trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      openModal({ title: successTitle, bodyHtml: `<div class="muted">${escapeHtml(text)}</div>`, primaryText: 'OK', secondaryText: 'Close' });
    } catch {
      openModal({ title: successTitle, bodyHtml: `<div class="muted">${escapeHtml(text)}</div><div class="muted small" style="margin-top:10px">Clipboard access was unavailable, so your share text is shown here for manual copy.</div>`, primaryText: 'OK', secondaryText: 'Close' });
    }
  }

  function buildPlatformShareUrl(platform, text, link) {
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(link);
    if (platform === 'twitter') return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
    if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
    if (platform === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
    if (platform === 'reddit') return `https://www.reddit.com/submit?url=${encodedLink}&title=${encodedText}`;
    if (platform === 'whatsapp') return `https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`;
    if (platform === 'telegram') return `https://t.me/share/url?url=${encodedLink}&text=${encodedText}`;
    if (platform === 'messenger') return `https://www.facebook.com/dialog/send?link=${encodedLink}&app_id=123456789`;
    if (platform === 'email') return `mailto:?subject=${encodeURIComponent('Try Juzzy')}&body=${encodeURIComponent(`${text}\n\n${link}`)}`;
    if (platform === 'sms') return `sms:?&body=${encodeURIComponent(`${text} ${link}`)}`;
    if (platform === 'discord') return '';
    return link;
  }

  function openSharePlatform(platform) {
    const text = buildShareCopy(platform === 'family' ? 'family' : 'starter');
    const link = buildInviteLink(platform === 'family' ? 'family' : 'starter');
    const targetUrl = buildPlatformShareUrl(platform, text, link);
    if (els.sharePreviewOutput) {
      els.sharePreviewOutput.textContent = `${text}`;
    }
    if (platform === 'discord') {
      void copyTextValue(`${text}\n\n${link}`, 'Discord share copy ready');
      return;
    }
    if (platform === 'email' || platform === 'sms') {
      window.location.href = targetUrl;
      return;
    }
    if (targetUrl) {
      openExternalResourceInApp({
        url: targetUrl,
        label: `Share via ${platform}`,
        provider: 'Juzzy Share'
      });
    }
  }

  function renderShareTab() {
    const starter = getStarterTierConfig();
    const inviteLink = buildInviteLink('starter');
    if (els.shareTierSummary) {
      els.shareTierSummary.textContent = `${starter.name}: ${starter.freeLessons} free lessons, ${starter.premiumPreviewModules} premium preview unlocks, ${starter.communityMode}, freebies access, and a strong upgrade path into paid academy access.`;
    }
    if (els.shareInviteLink) els.shareInviteLink.value = inviteLink;
    if (els.sharePreviewOutput) els.sharePreviewOutput.textContent = buildShareCopy('starter');
  }

  function applySharedEntryContext() {
    const params = new URLSearchParams(window.location.search);
    const shareMode = String(params.get('share') || '').trim().toLowerCase();
    const requestedTab = String(params.get('tab') || '').trim().toLowerCase();
    const refCode = String(params.get('ref') || '').trim();
    const familyEmail = String(params.get('familyEmail') || '').trim().toLowerCase();
    const familyName = String(params.get('familyName') || '').trim();
    if (shareMode === 'family' && familyEmail) {
      const autoProvisioned = provisionFamilyAccessFromInvite(familyEmail, familyName);
      if (autoProvisioned) return;
    }
    if (shareMode && els.sharePreviewOutput) {
      const copy = buildShareCopy(shareMode === 'family' ? 'family' : 'starter');
      els.sharePreviewOutput.textContent = refCode ? `${copy} Referral code: ${refCode}` : copy;
    }
    if (requestedTab === 'share' || shareMode) {
      setActiveTab('share');
      return;
    }
    if (requestedTab === 'owner-access' && isOwnerApprover()) {
      setActiveTab('owner-access');
    }
  }

  function loadGrowthRewards() {
    try {
      const raw = JSON.parse(localStorage.getItem(growthRewardsKey) || 'null');
      return raw && typeof raw === 'object'
        ? { ...defaultGrowthRewards(), ...raw, referrals: Array.isArray(raw.referrals) ? raw.referrals : [], suggestions: Array.isArray(raw.suggestions) ? raw.suggestions : [] }
        : defaultGrowthRewards();
    } catch {
      return defaultGrowthRewards();
    }
  }

  function saveGrowthRewards(data) {
    try {
      localStorage.setItem(growthRewardsKey, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  function ensureReferralCode() {
    const rewards = loadGrowthRewards();
    if (!rewards.referralCode) {
      const seed = String(state.user.email || state.profile.name || 'guest').replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase() || 'JUZZY';
      rewards.referralCode = `${seed}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      saveGrowthRewards(rewards);
    }
    return rewards.referralCode;
  }

  function syncGrowthRewards() {
    const rewards = loadGrowthRewards();
    const currentEmail = String(state.user.email || '').trim().toLowerCase();
    if (currentEmail && state.billing.subscribed) {
      let changed = false;
      rewards.referrals = rewards.referrals.map((item) => {
        if (String(item.friendEmail || '').trim().toLowerCase() === currentEmail && !item.converted) {
          changed = true;
          return { ...item, converted: true, convertedAt: Date.now() };
        }
        return item;
      });
      if (changed) {
        const ownCode = rewards.referralCode;
        const earned = rewards.referrals.filter((item) => item.code === ownCode && item.converted && !item.rewarded).length;
        if (earned > 0) {
          rewards.freeModuleCredits += earned;
          rewards.referrals = rewards.referrals.map((item) => item.code === ownCode && item.converted ? { ...item, rewarded: true } : item);
        }
        saveGrowthRewards(rewards);
      }
    }
    renderGrowthRewards();
  }

  function renderGrowthRewards() {
    const rewards = loadGrowthRewards();
    const code = ensureReferralCode();
    const starter = getStarterTierConfig();
    if (!rewards.starterTrialUsed) {
      rewards.starterTrialUsed = true;
      rewards.starterTrialCredits = Math.max(Number(rewards.starterTrialCredits || 0), starter.premiumPreviewModules);
      rewards.starterTrialEndsAt = Math.max(Number(rewards.starterTrialEndsAt || 0), Date.now() + (starter.durationDays * 24 * 60 * 60 * 1000));
      saveGrowthRewards(rewards);
    }
    if (els.referralCodeDisplay) els.referralCodeDisplay.value = code;
    const activeUntil = Number(rewards.fullAccessUntil || 0);
    const starterEndsAt = Number(rewards.starterTrialEndsAt || 0);
    const starterTrialActive = isStarterTrialActive(rewards);
    const ownerGranted = Array.isArray(rewards.ownerLifetimeAccess)
      && rewards.ownerLifetimeAccess.includes(String(state.user.email || '').trim().toLowerCase());
    const familyGranted = Array.isArray(rewards.familyLifetimeAccess)
      && rewards.familyLifetimeAccess.includes(String(state.user.email || '').trim().toLowerCase());
    const hasFullAccess = activeUntil > Date.now();
    if (els.rewardStatusOutput) {
      els.rewardStatusOutput.innerHTML = `
        <div><strong>Referral code:</strong> ${escapeHtml(code)}</div>
        <div><strong>Free module credits:</strong> ${Number(rewards.freeModuleCredits || 0)}</div>
        <div><strong>Starter preview credits:</strong> ${Number(rewards.starterTrialCredits || 0)} of ${starter.premiumPreviewModules}</div>
        <div><strong>Starter trial window:</strong> ${starterTrialActive ? `Active until ${new Date(starterEndsAt).toLocaleDateString()}` : starterEndsAt ? `Expired on ${new Date(starterEndsAt).toLocaleDateString()}` : `Available for ${starter.durationDays} days from first use`}</div>
        <div><strong>Preview-unlocked premium lessons:</strong> ${getPreviewUnlockedLessons(rewards).length}</div>
        <div><strong>Full access reward:</strong> ${ownerGranted ? 'Lifetime owner-granted access active' : familyGranted ? 'Amego Family lifetime access active' : hasFullAccess ? `Active until ${new Date(activeUntil).toLocaleDateString()}` : 'Not currently active'}</div>
        <div><strong>Tracked referrals:</strong> ${rewards.referrals.length}</div>
        <div><strong>AI-approved ideas:</strong> ${rewards.suggestions.filter((item) => item.approved).length}</div>
      `;
    }
    renderShareTab();
    renderOwnerAccessPanel();
  }

  function registerReferral() {
    const friendEmail = String(els.referralFriendEmail?.value || '').trim().toLowerCase();
    if (!validateEmail(friendEmail)) {
      openModal({ title: 'Referral email required', bodyHtml: '<div class="muted">Enter a valid friend email to register the referral.</div>', primaryText: 'OK', secondaryText: 'Close' });
      return;
    }
    const ownEmail = String(state.user.email || '').trim().toLowerCase();
    if (friendEmail && ownEmail && friendEmail === ownEmail) {
      openModal({ title: 'Invalid referral', bodyHtml: '<div class="muted">You cannot refer your own email address.</div>', primaryText: 'OK', secondaryText: 'Close' });
      return;
    }
    const rewards = loadGrowthRewards();
    const code = ensureReferralCode();
    const exists = rewards.referrals.some((item) => item.friendEmail === friendEmail);
    if (!exists) {
      rewards.referrals.unshift({ code, friendEmail, createdAt: Date.now(), converted: false, rewarded: false });
      saveGrowthRewards(rewards);
    }
    if (els.referralFriendEmail) els.referralFriendEmail.value = '';
    renderGrowthRewards();
  }

  function claimIdeaReward() {
    const rewards = loadGrowthRewards();
    const ownEmail = String(state.user.email || '').trim().toLowerCase();
    const approved = rewards.suggestions.find((item) => item.ownerEmail === ownEmail && item.approved && !item.rewardClaimed);
    if (!approved) {
      renderGrowthRewards();
      return;
    }
    rewards.fullAccessUntil = Math.max(Date.now(), Number(rewards.fullAccessUntil || 0)) + (90 * 24 * 60 * 60 * 1000);
    rewards.suggestions = rewards.suggestions.map((item) => item.id === approved.id ? { ...item, rewardClaimed: true } : item);
    saveGrowthRewards(rewards);
    renderGrowthRewards();
  }

  function isPaidLesson(id) {
    const meta = getLessonMeta(id);
    const isOwner = isOwnerApprover();
    
    // Owner gets free access to all lessons
    if (isOwner) {
      console.log(`👑 Owner accessing lesson ${id} - Free access granted`);
      return false; // Return false so it's treated as free
    }
    
    return String(meta?.tier || 'Free').toLowerCase() !== 'free';
  }

  function canUsePaidModules() {
    const rewards = loadGrowthRewards();
    const ownerGranted = Array.isArray(rewards.ownerLifetimeAccess)
      && rewards.ownerLifetimeAccess.includes(String(state.user.email || '').trim().toLowerCase());
    const familyGranted = Array.isArray(rewards.familyLifetimeAccess)
      && rewards.familyLifetimeAccess.includes(String(state.user.email || '').trim().toLowerCase());
    
    // Owner gets full access to ALL levels and features
    const isOwner = isOwnerApprover();
    if (isOwner) {
      console.log('👑 Owner accessing all modules - Full access granted');
      return true;
    }
    
    return Boolean(state.billing.subscribed || ownerGranted || familyGranted || Number(rewards.fullAccessUntil || 0) > Date.now());
  }

  function promptStripeForModule(id) {
    const meta = getLessonMeta(id);
    const rewards = loadGrowthRewards();
    const availableCredits = Number(rewards.freeModuleCredits || 0);
    const starterCredits = Number(rewards.starterTrialCredits || 0);
    const starterTrialActive = isStarterTrialActive(rewards);
    if (hasLessonPreviewUnlock(id, rewards)) {
      openModal({ title: 'Preview already unlocked', bodyHtml: `<div class="muted"><strong>${escapeHtml(meta.trackTitle)}</strong> already has a starter preview unlock applied. Open it anytime during your current access state.</div>`, primaryText: 'OK', secondaryText: 'Close' });
      return;
    }
    if (starterTrialActive && starterCredits > 0) {
      openModal({
        title: 'Use starter preview unlock?',
        bodyHtml: `<div class="muted">Your hooked free tier includes <strong>${starterCredits}</strong> premium preview unlock${starterCredits === 1 ? '' : 's'} during a <strong>three-week starter window</strong>. Apply one preview unlock specifically to <strong>${escapeHtml(meta.title || meta.trackTitle)}</strong> now, or continue to Stripe for full access.</div>`,
        primaryText: 'Use 1 Preview Unlock',
        secondaryText: 'Go Premium',
        onPrimary: () => {
          const next = loadGrowthRewards();
          next.starterTrialCredits = Math.max(0, Number(next.starterTrialCredits || 0) - 1);
          next.previewUnlockedLessons = Array.from(new Set([String(id || '').trim(), ...getPreviewUnlockedLessons(next)]));
          saveGrowthRewards(next);
          renderGrowthRewards();
          openModal({ title: 'Preview unlocked', bodyHtml: `<div class="muted">A starter preview unlock was applied only to <strong>${escapeHtml(meta.title || meta.trackTitle)}</strong>. Other premium lessons remain locked unless they are individually unlocked or fully upgraded.</div>`, primaryText: 'OK', secondaryText: 'Close' });
        },
        onSecondary: () => { void startSubscriptionCheckout(); },
      });
      return;
    }
    if (availableCredits > 0) {
      openModal({
        title: 'Use free module credit?',
        bodyHtml: `<div class="muted">You have <strong>${availableCredits}</strong> free module credit${availableCredits === 1 ? '' : 's'}. You can use one credit to unlock <strong>${escapeHtml(meta.trackTitle)}</strong> now, or continue to Stripe.</div>`,
        primaryText: 'Use 1 Credit',
        secondaryText: 'Use Stripe',
        onPrimary: () => {
          const next = loadGrowthRewards();
          next.freeModuleCredits = Math.max(0, Number(next.freeModuleCredits || 0) - 1);
          next.previewUnlockedLessons = Array.from(new Set([String(id || '').trim(), ...getPreviewUnlockedLessons(next)]));
          saveGrowthRewards(next);
          renderGrowthRewards();
          openModal({ title: 'Module unlocked', bodyHtml: `<div class="muted">A free module credit was applied specifically to <strong>${escapeHtml(meta.title || meta.trackTitle)}</strong>.</div>`, primaryText: 'OK', secondaryText: 'Close' });
        },
        onSecondary: () => { void startSubscriptionCheckout(); },
      });
      return;
    }
    openModal({
      title: 'Unlock paid module',
      bodyHtml: `<div class="muted">${escapeHtml(meta.trackTitle)} is part of the <strong>${escapeHtml(meta.tier)}</strong> pathway. Continue to Stripe to unlock paid course access.</div>`,
      primaryText: 'Open Stripe Checkout',
      secondaryText: 'Close',
      onPrimary: () => { void startSubscriptionCheckout(); },
    });
  }

  function pushNavHistory(tabId) {
    const current = String(tabId || 'home');
    const hist = Array.isArray(state.ui.navHistory) ? state.ui.navHistory : ['home'];
    const index = Number(state.ui.navHistoryIndex || 0);
    if (hist[index] === current) return;
    const next = hist.slice(0, index + 1);
    next.push(current);
    state.ui.navHistory = next.slice(-40);
    state.ui.navHistoryIndex = state.ui.navHistory.length - 1;
  }

  function navigateHistory(direction) {
    const nextIndex = Number(state.ui.navHistoryIndex || 0) + Number(direction || 0);
    if (nextIndex < 0 || nextIndex >= state.ui.navHistory.length) return;
    state.ui.navHistoryIndex = nextIndex;
    const tabId = state.ui.navHistory[nextIndex] || 'home';
    setActiveTab(tabId, { skipHistoryPush: true });
  }

  function setActiveTab(tabId, opts = {}) {
    if (tabId === 'owner-access' && !isOwnerApprover()) {
      tabId = 'home';
    }
    if (tabId === 'oracle' && !isOwnerApprover()) {
      tabId = 'home';
    }
    qsAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    qsAll('.panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));
    if (!opts.skipHistoryPush) pushNavHistory(tabId);
    if (tabId === 'learn' || tabId === 'tutorial') {
      renderAcademyHub();
      initTutCategoryOptions();
      renderTutorialCatalog();
      // Initialize particles when tutorial tab opens
      if (tabId === 'tutorial') {
        initTutorialParticles();
      }
    }
    if (tabId === 'trading-simulator') {
      loadTradingSimulator();
    }
    if (tabId === 'home') {
      renderHallOfFame();
    }
    if (tabId === 'oracle') {
      renderOracle();
    }
    if (tabId === 'leaders') {
      renderLeaders();
    }
    if (tabId === 'charts') {
      initOrResizeChart();
      renderChartControls();
      renderChart();
    }
    if (tabId === 'portfolio') {
      renderPortfolio();
    }
    if (tabId === 'brain') {
      renderBrain();
    }
    if (tabId === 'reports') {
      resetReportsRender();
    }
    if (tabId === 'ops') {
      renderOps();
    }
    if (tabId === 'vault') {
      renderVault();
    }
    if (tabId === 'settings') {
      renderSettings();
    }
    if (tabId === 'about') {
      renderAbout();
    }
    if (tabId === 'messages') {
      renderMessageCenter();
      renderOwnerRefundQueue();
    }
    if (tabId === 'community') {
      renderCommunity();
    }
    if (tabId === 'share') {
      renderShareTab();
    }
    if (tabId === 'owner-access') {
      renderOwnerAccessPanel();
    }
    if (tabId === 'portfolio' || tabId === 'settings') {
      renderProfileUi();
      renderPortfolio();
    }
    renderGlobalAiQuickActions();
    emitAudit('UI_TAB', { tab: tabId });
  }

  async function emitAudit(type, data, level = 'INFO') {
    try {
      const email = getEmail();
      await postJson('/api/audit/emit', {
        type,
        level,
        source: 'client',
        email,
        data: data ?? null,
      });
    } catch {
      // ignore
    }
  }

  function renderOps() {
    if (els.opsUniverse) els.opsUniverse.textContent = String(state.market.universe.size || 0);
    if (els.opsLastMarket) {
      const t = Number(state.market.lastUpdateAt || 0);
      els.opsLastMarket.textContent = t ? new Date(t).toLocaleTimeString(undefined, { hour12: false }) : '—';
    }
    if (els.opsLag) {
      const lag = state.market.lastServerTs ? Math.max(0, Date.now() - state.market.lastServerTs) : 0;
      els.opsLag.textContent = state.market.lastServerTs ? `${Math.floor(lag)}ms` : '—';
    }

    if (els.opsFresh) {
      const age = state.market.lastUpdateAt ? Math.max(0, Date.now() - state.market.lastUpdateAt) : Infinity;
      els.opsFresh.textContent = Number.isFinite(age) ? `${Math.floor(age / 1000)}s` : '—';
    }
    if (els.opsAuditFresh) {
      const lastAuditTs = Number(state.audit.items?.[0]?.ts || 0);
      const age = lastAuditTs ? Math.max(0, Date.now() - lastAuditTs) : Infinity;
      els.opsAuditFresh.textContent = Number.isFinite(age) ? `${Math.floor(age / 1000)}s` : '—';
    }

    if (els.opsMarket) els.opsMarket.textContent = state.market.connected ? 'LIVE' : 'OFF';
    if (els.opsAudit) els.opsAudit.textContent = state.audit.connected ? 'LIVE' : 'OFF';

    renderTopStatus();

    const src = state.market.source || {};
    if (els.opsCg) els.opsCg.textContent = src?.coingecko?.ok ? 'OK' : src?.coingecko ? 'ERR' : '—';
    if (els.opsBn) els.opsBn.textContent = src?.binance?.ok ? 'OK' : src?.binance ? 'ERR' : '—';
    if (els.opsDex) els.opsDex.textContent = src?.dex?.ok ? 'OK' : src?.dex ? 'ERR' : '—';
    if (els.opsPaperPos) els.opsPaperPos.textContent = String(state.paper.positions.size || 0);
    if (els.opsPaperBanked) els.opsPaperBanked.textContent = `$${formatMoney(state.paper.bankedUsd)}`;

    if (els.opsAuditList) {
      els.opsAuditList.innerHTML = '';
      for (const e of state.audit.items.slice(0, 120)) {
        const line = document.createElement('div');
        line.className = 'term-line';
        const ts = new Date(e.ts || Date.now()).toLocaleTimeString(undefined, { hour12: false });
        line.innerHTML = `<div class="term-ts">${escapeHtml(ts)}</div><div>[${escapeHtml(String(e.level || 'INFO'))}] ${escapeHtml(String(e.type || 'EVENT'))}</div>`;
        els.opsAuditList.appendChild(line);
      }
    }
  }

  function brainSignal(level, msg, data) {
    appendTerminal(level, msg);
    emitAudit('BRAIN_SIGNAL', { level, msg, ...(data || {}) }, level === 'WARN' ? 'WARN' : 'INFO');
    state.reports.unshift({
      id: `S-${String(Date.now())}`,
      asset: String(data?.symbol || data?.name || 'MARKET'),
      status: 'LIVE_SIGNAL',
      notional: 0,
      fee: 0,
      ts: Date.now(),
      detail: { safeguards: 985, reason: msg, data: data || null },
    });
    applyReportsLiveUpdate();
  }

  function computeBrainSignalsFromSnapshot() {
    if (state.brainPaused) return;
    const now = Date.now();

    const SANDBOX_LIQ_USD_MAX = 120_000;
    const SANDBOX_VOL_USD_MAX = 450_000;
    const MOVERS_VOL_USD_MIN = 2_000_000;
    const MOVERS_CHG_MIN = 18;
    const REVERSAL_CHG_MIN = 12;
    const VOL_SPIKE_MULT = 3.2;

    const movers = [];
    const revs = [];
    const volSpikes = [];

    for (const it of state.market.universe.values()) {
      const key = String(it?.key || '');
      if (!key) continue;
      const sym = String(it?.symbol || '').toUpperCase();
      const chg = Number(it?.chg24Pct);
      const vol = Number(it?.vol24Usd);
      const px = Number(it?.priceUsd);
      if (!sym || !Number.isFinite(chg) || !Number.isFinite(px)) continue;

      const prev = state.market.prevByKey.get(key);
      const prevChg = Number(prev?.chg24Pct);
      const prevVol = Number(prev?.vol24Usd);

      if (Number.isFinite(vol) && vol >= MOVERS_VOL_USD_MIN && Math.abs(chg) >= MOVERS_CHG_MIN) {
        movers.push({ key, sym, chg, vol, px, src: String(it?.source || '') });
      }

      if (Number.isFinite(prevChg) && Math.abs(prevChg) >= REVERSAL_CHG_MIN && Math.abs(chg) >= REVERSAL_CHG_MIN) {
        const flipped = (prevChg > 0 && chg < 0) || (prevChg < 0 && chg > 0);
        if (flipped) {
          revs.push({ key, sym, chg, prevChg, vol, px, src: String(it?.source || '') });
        }
      }

      if (Number.isFinite(vol) && Number.isFinite(prevVol) && prevVol > 0 && vol / prevVol >= VOL_SPIKE_MULT) {
        volSpikes.push({ key, sym, chg, vol, prevVol, px, src: String(it?.source || '') });
      }
    }

    movers.sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg));
    const top = movers.slice(0, 3);
    for (const m of top) {
      if (!canSignal('mover', m.key, 90_000)) continue;
      const dir = m.chg >= 0 ? 'UP' : 'DOWN';
      brainSignal('SCAN', `Mover ${dir}: ${m.sym} ${m.chg.toFixed(2)}% (24h) · vol $${formatMoney(m.vol)}`, {
        key: m.key,
        symbol: m.sym,
        chg24Pct: m.chg,
        vol24Usd: m.vol,
        priceUsd: m.px,
        source: m.src,
      });
    }

    revs.sort((a, b) => Math.abs(b.chg - b.prevChg) - Math.abs(a.chg - a.prevChg));
    for (const r of revs.slice(0, 2)) {
      if (!canSignal('reversal', r.key, 3 * 60_000)) continue;
      const dir = r.chg >= 0 ? 'UP' : 'DOWN';
      brainSignal('WARN', `Reversal: ${r.sym} flipped ${r.prevChg.toFixed(2)}% → ${r.chg.toFixed(2)}% · now ${dir}`, {
        key: r.key,
        symbol: r.sym,
        chg24Pct: r.chg,
        prevChg24Pct: r.prevChg,
        vol24Usd: r.vol,
        priceUsd: r.px,
        source: r.src,
      });
    }

    volSpikes.sort((a, b) => (b.vol / Math.max(1, b.prevVol)) - (a.vol / Math.max(1, a.prevVol)));
    for (const v of volSpikes.slice(0, 2)) {
      if (!canSignal('volSpike', v.key, 3 * 60_000)) continue;
      const mult = v.prevVol > 0 ? v.vol / v.prevVol : 0;
      if (v.vol < 1_000_000) continue;
      brainSignal('SCAN', `Volume spike: ${v.sym} x${mult.toFixed(1)} · vol $${formatMoney(v.vol)}`, {
        key: v.key,
        symbol: v.sym,
        chg24Pct: v.chg,
        vol24Usd: v.vol,
        prevVol24Usd: v.prevVol,
        priceUsd: v.px,
        source: v.src,
      });
    }

    for (const k of state.market.birthKeys) {
      const it = state.market.universe.get(k);
      if (!it) continue;
      if (!canSignal('sandbox', k, 5 * 60_000)) continue;
      const sym = String(it?.symbol || '').toUpperCase();
      const chain = String(it?.dex?.chainId || 'dex');
      const liq = Number(it?.dex?.liquidityUsd);
      const vol = Number(it?.vol24Usd);
      if (Number.isFinite(liq) && liq > 120_000) continue;
      if (Number.isFinite(vol) && vol > 450_000) continue;
      brainSignal('DEX', `Sandbox watch: ${sym} on ${chain} · liq $${formatMoney(liq)} · vol $${formatMoney(vol)}`, {
        key: String(k),
        symbol: sym,
        chainId: chain,
        liquidityUsd: liq,
        vol24Usd: vol,
        source: 'dexscreener',
      });
    }
  }

  function connectAuditStream() {
    if (!window.EventSource) return;
    if (auditStreamClient) auditStreamClient.stop();
    auditStreamClient = connectSseWithRetry(
      '/api/audit/stream',
      {
        onopen: () => {
          state.audit.connected = true;
          renderOps();
        },
        onerror: () => {
          state.audit.connected = false;
          renderOps();
        },
        onmessage: (ev) => {
          try {
            const payload = JSON.parse(ev.data);
            if (payload?.type === 'audit_seed' && Array.isArray(payload.items)) {
              state.audit.items = payload.items;
              renderOps();
              return;
            }
            if (payload?.type === 'audit_event' && payload.event) {
              state.audit.items.unshift(payload.event);
              if (state.audit.items.length > 500) state.audit.items.length = 500;
              if (document.querySelector('#tab-ops.panel.active')) renderOps();
            }
          } catch {
            // ignore
          }
        },
      },
      'audit'
    );
  }

  function setLeadersMode(mode) {
    state.market.mode = mode === 'losers' ? 'losers' : 'gainers';
    if (els.leadersModeGainers) els.leadersModeGainers.classList.toggle('active', state.market.mode === 'gainers');
    if (els.leadersModeLosers) els.leadersModeLosers.classList.toggle('active', state.market.mode === 'losers');
    renderLeaders();
  }

  function initOrResizeChart() {
    if (!FEATURES.charts) return;
    if (!els.chart) return;
    if (!window.LightweightCharts) return;

    if (!state.charts.chart) {
      const c = window.LightweightCharts.createChart(els.chart, {
        layout: { background: { color: 'rgba(0,0,0,0)' }, textColor: 'rgba(234,240,255,0.9)' },
        grid: { vertLines: { color: 'rgba(255,255,255,0.06)' }, horzLines: { color: 'rgba(255,255,255,0.06)' } },
        rightPriceScale: { borderColor: 'rgba(255,255,255,0.12)' },
        timeScale: { borderColor: 'rgba(255,255,255,0.12)' },
      });
      const series = c.addCandlestickSeries({
        upColor: '#00e5ff',
        downColor: '#ff2bd6',
        borderDownColor: '#ff2bd6',
        borderUpColor: '#00e5ff',
        wickDownColor: 'rgba(255,43,214,0.85)',
        wickUpColor: 'rgba(0,229,255,0.85)',
      });
      const liveSeries = c.addLineSeries({
        color: 'rgba(0,229,255,0.95)',
        lineWidth: 2,
      });
      state.charts.chart = c;
      state.charts.series = series;
      state.charts.liveSeries = liveSeries;
    }

    const w = els.chart.clientWidth;
    const h = els.chart.clientHeight;
    if (w > 0 && h > 0) state.charts.chart.applyOptions({ width: w, height: h });
  }

  function toOhlcFromPrices(prices) {
    const out = [];
    for (let i = 0; i < prices.length; i++) {
      const [ms, v] = prices[i];
      const prev = i > 0 ? prices[i - 1][1] : v;
      const next = i + 1 < prices.length ? prices[i + 1][1] : v;
      const open = prev;
      const close = v;
      const high = Math.max(open, close, next);
      const low = Math.min(open, close, next);
      out.push({ time: Math.floor(ms / 1000), open, high, low, close });
    }
    return out;
  }

  async function fetchChartData(asset, days) {
    const url = `/api/coingecko/market_chart?coinId=${encodeURIComponent(asset)}&days=${encodeURIComponent(days)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Chart fetch failed (${res.status})`);
    const data = await res.json();
    const prices = Array.isArray(data?.prices) ? data.prices : [];
    return toOhlcFromPrices(prices);
  }

  async function loadMarketSnapshotOnce() {
    try {
      const res = await fetch('/api/market/snapshot');
      if (!res.ok) return;
      const payload = await res.json();
      if (payload?.type !== 'market_snapshot') return;
      const items = Array.isArray(payload.items) ? payload.items : [];
      if (items.length === 0) return;
      state.market.universe.clear();
      for (const it of items) {
        if (!it?.key) continue;
        state.market.universe.set(it.key, it);
      }
      state.market.source = payload.source || state.market.source;
      state.market.lastServerTs = Number(payload.serverTs) || state.market.lastServerTs;
      state.market.lastUpdateAt = Number(payload.lastUpdateAt) || state.market.lastUpdateAt;
      populateChartAssetOptions();
      renderLeaders();
      renderOps();

      renderTopStatus();

      if (document.querySelector('#tab-charts.panel.active')) {
        refreshChart();
      }
    } catch {
      // ignore
    }
  }

  async function refreshChart() {
    if (!FEATURES.charts) return;
    if (!els.chartAsset || !els.chartTf) return;
    initOrResizeChart();

    const sel = String(els.chartAsset.value || 'bitcoin');
    const tf = String(els.chartTf.value || 30);
    const days = tf === '1m' ? 1 : (Number(tf) || 30);
    state.charts.lastAsset = sel;
    state.charts.lastDays = days;

    const item = state.market.universe.get(sel);
    const useCandles = isCoinGeckoItem(item) || (!item && !sel.startsWith('bn:') && !sel.startsWith('dx:') && !sel.startsWith('cg:'));

    if (!state.charts.series || !state.charts.liveSeries) return;

    restoreChartPriceLines(sel);

    if (tf === '1m') {
      try {
        const sym = String(item?.symbol || '').toUpperCase();
        const isBn = String(item?.source || '') === 'binance' || sel.startsWith('bn:');
        if (!isBn || !sym) throw new Error('1m candles available for Binance-backed assets only');
        setStatus('Loading 1m candles…');
        const candles = await fetchBinanceKlines(`${sym}USDT`, 720);
        state.charts.liveSeries.setData([]);
        state.charts.series.setData(candles);
        const last = candles[candles.length - 1];
        const first = candles[0];
        const chg = first && last ? ((last.close - first.open) / first.open) * 100 : 0;
        if (els.chartStatAsset) els.chartStatAsset.textContent = `${sym} (1m)`;
        if (els.chartStatLast) els.chartStatLast.textContent = last ? `$${formatMoney(last.close)}` : '—';
        if (els.chartStatChg) els.chartStatChg.textContent = Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—';
        setStatus('Idle');
        return;
      } catch (e) {
        setStatus('Idle');
        const hist = state.charts.liveHistory.get(sel) || [];
        state.charts.series.setData([]);
        state.charts.liveSeries.setData(hist);
        appendTerminal('WARN', `1m candles unavailable (${String(e?.message || e)}). Showing live line instead.`);
        emitAudit('CHART_1M_FALLBACK_LIVE', { key: sel, error: String(e?.message || e) }, 'WARN');
        return;
      }
    }

    if (!useCandles) {
      const hist = state.charts.liveHistory.get(sel) || [];
      state.charts.series.setData([]);
      state.charts.liveSeries.setData(hist);
      const price = Number(item?.priceUsd);
      const chg = Number(item?.chg24Pct);
      if (els.chartStatAsset) els.chartStatAsset.textContent = String(item?.name || item?.symbol || sel);
      if (els.chartStatLast) els.chartStatLast.textContent = Number.isFinite(price) ? `$${formatMoney(price)}` : '—';
      if (els.chartStatChg) els.chartStatChg.textContent = Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—';
      return;
    }

    const cgId = item && isCoinGeckoItem(item) ? item.id : sel;

    try {
      setStatus('Loading chart…');
      const candles = await fetchChartData(cgId, days);
      state.charts.liveSeries.setData([]);
      state.charts.series.setData(candles);
      const last = candles[candles.length - 1];
      const first = candles[0];
      const chg = first && last ? ((last.close - first.open) / first.open) * 100 : 0;
      if (els.chartStatAsset) els.chartStatAsset.textContent = cgId;
      if (els.chartStatLast) els.chartStatLast.textContent = last ? `$${formatMoney(last.close)}` : '—';
      if (els.chartStatChg) els.chartStatChg.textContent = Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—';
      setStatus('Idle');
    } catch (e) {
      setStatus('Idle');

      const resolvedItem = item ||
        Array.from(state.market.universe.values()).find((a) => String(a?.id || '') === String(cgId)) ||
        Array.from(state.market.universe.values()).find((a) => String(a?.symbol || '').toLowerCase() === String(cgId || '').toLowerCase()) ||
        null;

      const hist = state.charts.liveHistory.get(sel) || [];
      if (hist.length > 1) {
        state.charts.series.setData([]);
        state.charts.liveSeries.setData(hist);
        const price = Number(resolvedItem?.priceUsd);
        const chg = Number(resolvedItem?.chg24Pct);
        if (els.chartStatAsset) els.chartStatAsset.textContent = String(resolvedItem?.name || resolvedItem?.symbol || cgId);
        if (els.chartStatLast) els.chartStatLast.textContent = Number.isFinite(price) ? `$${formatMoney(price)}` : '—';
        if (els.chartStatChg) els.chartStatChg.textContent = Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—';
        appendTerminal('WARN', `Candles unavailable (${String(e?.message || e)}). Showing live line instead.`);
        emitAudit('CHART_FALLBACK_LIVE', { key: sel, coinId: cgId, days, error: String(e?.message || e) }, 'WARN');
        return;
      }

      const price = Number(resolvedItem?.priceUsd);
      const chg = Number(resolvedItem?.chg24Pct);
      const p = Number.isFinite(price) && price > 0 ? price : 1;
      const now = Math.floor(Date.now() / 1000);
      state.charts.series.setData([]);
      state.charts.liveSeries.setData([{ time: now - 60, value: p }, { time: now, value: p }]);
      if (els.chartStatAsset) els.chartStatAsset.textContent = String(resolvedItem?.name || resolvedItem?.symbol || cgId);
      if (els.chartStatLast) els.chartStatLast.textContent = Number.isFinite(price) ? `$${formatMoney(price)}` : '—';
      if (els.chartStatChg) els.chartStatChg.textContent = Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—';
      appendTerminal('WARN', `Candles unavailable (${String(e?.message || e)}). Showing last known price.`);
      emitAudit('CHART_FALLBACK_FLAT', { key: sel, coinId: cgId, days, error: String(e?.message || e), priceUsd: Number.isFinite(price) ? price : null }, 'WARN');
    }
  }

  function openModal({ title, bodyHtml, primaryText = 'OK', secondaryText = 'Cancel', onPrimary, onSecondary }) {
    els.modalTitle.textContent = title;
    els.modalBody.innerHTML = bodyHtml;
    els.modalPrimary.textContent = primaryText;
    els.modalSecondary.textContent = secondaryText;
    els.modal.hidden = false;
    els.modal.style.display = 'grid';

    function cleanup() {
      els.modalPrimary.onclick = null;
      els.modalSecondary.onclick = null;
      els.modalClose.onclick = null;
      els.modal.onclick = null;
      window.removeEventListener('keydown', onKeyDown);
    }

    function close() {
      cleanup();
      els.modal.hidden = true;
      els.modal.style.display = 'none';
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') close();
    }

    els.modalClose.onclick = close;
    els.modal.onclick = (e) => {
      if (e.target === els.modal) close();
    };

    window.addEventListener('keydown', onKeyDown);

    els.modalSecondary.onclick = async () => {
      try {
        if (onSecondary) await onSecondary();
      } finally {
        close();
      }
    };

    els.modalPrimary.onclick = async () => {
      try {
        if (onPrimary) await onPrimary();
      } finally {
        close();
      }
    };
  }

  async function postJson(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data ?? {}),
    });

    const txt = await res.text();
    let payload = null;
    try {
      payload = txt ? JSON.parse(txt) : null;
    } catch {
      payload = { raw: txt };
    }

    if (!res.ok) {
      const msg = payload?.error || payload?.message || `Request failed (${res.status})`;
      throw new Error(msg);
    }

    return payload;
  }

  async function startSubscriptionCheckout() {
    try {
      const email = getEmail();
      if (!validateEmail(email)) {
        openModal({
          title: 'Enter your email',
          bodyHtml: '<div class="muted">Please type your email in the top bar before subscribing.</div>',
          primaryText: 'OK',
          secondaryText: 'Close',
        });
        return;
      }

      setStatus('Opening premium learning checkout…');
      const payload = await postJson('/api/stripe/subscribe', { email });
      if (payload?.url) window.location.href = payload.url;
      setStatus('Idle');
    } catch (e) {
      setStatus('Idle');
      openModal({ title: 'Stripe error', bodyHtml: `<div class="muted">${String(e.message || e)}</div>`, primaryText: 'OK', secondaryText: 'Close' });
    }
  }

  async function startTradeFeeCheckout(tradeNotionalUsd) {
    try {
      const email = getEmail();
      if (!validateEmail(email)) {
        openModal({
          title: 'Enter your email',
          bodyHtml: '<div class="muted">Please type your email in the top bar first.</div>',
          primaryText: 'OK',
          secondaryText: 'Close',
        });
        return;
      }

      setStatus('Opening demo workflow fee checkout…');
      localStorage.setItem('pos_pending_trade_notional', String(tradeNotionalUsd));
      localStorage.setItem('pos_pending_trade_fee', String(tradeNotionalUsd * 0.01));
      const payload = await postJson('/api/stripe/trade-fee', { tradeNotional: tradeNotionalUsd, email });
      if (payload?.url) window.location.href = payload.url;
      setStatus('Idle');
    } catch (e) {
      setStatus('Idle');
      openModal({ title: 'Stripe error', bodyHtml: `<div class="muted">${String(e.message || e)}</div>`, primaryText: 'OK', secondaryText: 'Close' });
    }
  }

  async function fetchBillingStatus() {
    const email = getEmail();
    const t = Date.now();
    if (!validateEmail(email)) return;
    if (t - state.user.lastBillingFetchAt < 2500) return;
    state.user.lastBillingFetchAt = t;

    try {
      const res = await fetch(`/api/billing/status?email=${encodeURIComponent(email)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data?.subscribed === 'boolean') state.billing.subscribed = data.subscribed;
      if (typeof data?.upfrontPaid === 'boolean') state.billing.upfrontPaid = data.upfrontPaid;
      if (Number.isFinite(Number(data?.upfrontForTotal))) state.billing.upfrontForTotal = Number(data.upfrontForTotal);

      if (Number.isFinite(Number(data?.feesTotal))) {
        state.fees = Number(data.feesTotal);
        els.kpiFees.textContent = `$${formatMoney(state.fees)}`;
      }

      setAutoUi();
      syncGrowthRewards();
    } catch {
      // ignore
    }
  }

  function connectWalletMock() {
    state.walletConnected = !state.walletConnected;
    if (state.walletConnected) {
      state.walletAddress = `0x${Math.floor(Math.random() * 16 ** 8).toString(16).padStart(8, '0')}…${Math.floor(Math.random() * 16 ** 4).toString(16).padStart(4, '0')}`;
      els.connectBtn.textContent = state.walletAddress;
      setStatus('Wallet connected');
    } else {
      state.walletAddress = null;
      els.connectBtn.textContent = 'Connect wallet';
      setStatus('Idle');
    }
  }

  function startAutopilot() {
    if (!canStartAutopilot()) {
      const total = Number(els.fuel.value || 0);
      const paidForThisTotal = state.billing.upfrontPaid && state.billing.upfrontForTotal === total;
      const missing = [];
      if (!state.billing.subscribed) missing.push('Subscription');
      if (!paidForThisTotal) missing.push('Upfront 1% fee');
      if (!els.gateRisk.checked) missing.push('Risk agreement');
      if (!els.gateFee.checked) missing.push('Fee agreement');
      if (!els.gateTime.checked) missing.push('24h agreement');

      openModal({
        title: 'Locked until paid & agreed',
        bodyHtml: `<div class="muted">Missing: <strong>${escapeHtml(missing.join(', '))}</strong></div><div class="muted small" style="margin-top:10px">Unlock premium learning first, then review the 1% demo workflow fee for the exact amount you selected. This flow is presented for educational use with paper-first behaviour.</div>`,
        primaryText: 'OK',
        secondaryText: 'Close',
      });
      return;
    }

    const total = Number(els.fuel.value || 0);
    if (!Number.isFinite(total) || total <= 0) return;

    state.autopilot.active = true;
    state.autopilot.startedAt = Date.now();
    state.autopilot.endsAt = state.autopilot.startedAt + state.autopilot.durationMs;
    state.autopilot.totalAmount = total;
    state.autopilot.sliceAmount = total / state.autopilot.slices;
    state.autopilot.nextIndex = 0;
    state.autopilot.awaitingPaymentForIndex = null;

    setStatus('Demo autopilot running');
    appendTerminal('INFO', `One Invest demo started. Total $${formatMoney(total)} split into ${state.autopilot.slices} educational slices.`);

    // Create a report record for the start.
    state.reports.unshift({
      id: `A-${String(Date.now())}`,
      asset: 'BASKET',
      status: 'AUTOPILOT_STARTED',
      notional: total,
      fee: total * 0.01,
      ts: Date.now(),
      detail: { safeguards: 1000, reason: 'User started One Invest (24h DCA schedule).' },
    });
    applyReportsLiveUpdate();

    setAutoUi();
  }

  function stopAutopilot() {
    if (!state.autopilot.active) return;
    state.autopilot.active = false;
    state.autopilot.awaitingPaymentForIndex = null;
    setStatus('Idle');
    appendTerminal('INFO', 'One Invest stopped by user.');

    state.reports.unshift({
      id: `A-${String(Date.now())}`,
      asset: 'BASKET',
      status: 'AUTOPILOT_STOPPED',
      notional: 0,
      fee: 0,
      ts: Date.now(),
      detail: { safeguards: 1000, reason: 'User stopped One Invest.' },
    });
    applyReportsLiveUpdate();

    setAutoUi();
  }

  function autopilotUpdate() {
    if (!state.autopilot.active) {
      els.autoNext.textContent = '—';
      els.cycleTime.textContent = '—';
      els.cycleFill.style.background = `conic-gradient(var(--blue) 0deg, rgba(255, 255, 255, 0.06) 0deg)`;
      return;
    }

    const t = Date.now();
    const remaining = Math.max(0, state.autopilot.endsAt - t);
    const pct = 1 - remaining / state.autopilot.durationMs;
    const deg = Math.floor(360 * pct);
    els.cycleFill.style.background = `conic-gradient(var(--blue) ${deg}deg, rgba(255, 255, 255, 0.06) 0deg)`;

    const hh = Math.floor(remaining / 3600000);
    const mm = Math.floor((remaining % 3600000) / 60000);
    const ss = Math.floor((remaining % 60000) / 1000);
    els.cycleTime.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

    // Next slice time.
    const nextAt = state.autopilot.startedAt + state.autopilot.nextIndex * state.autopilot.intervalMs;
    const untilNext = Math.max(0, nextAt - t);
    const nmm = Math.floor(untilNext / 60000);
    const nss = Math.floor((untilNext % 60000) / 1000);
    els.autoNext.textContent = state.autopilot.nextIndex >= state.autopilot.slices ? 'Done' : `${String(nmm).padStart(2, '0')}:${String(nss).padStart(2, '0')}`;

    if (remaining === 0 || state.autopilot.nextIndex >= state.autopilot.slices) {
      state.autopilot.active = false;
      setStatus('Idle');
      appendTerminal('INFO', 'One Invest completed (24h window ended).');
      setAutoUi();
      return;
    }

    // When a slice is due, log it (execution is V2; V1 can still prompt).
    if (untilNext === 0 && state.autopilot.awaitingPaymentForIndex == null) {
      const idx = state.autopilot.nextIndex;
      const sliceAmount = state.autopilot.sliceAmount;
      const fee = sliceAmount * 0.01;

      state.autopilot.awaitingPaymentForIndex = idx;
      appendTerminal('PLAN', `Slice #${idx + 1}/${state.autopilot.slices} scheduled. Amount $${formatMoney(sliceAmount)}.`);

      // Create report entry.
      state.reports.unshift({
        id: `S-${String(Date.now())}`,
        asset: 'BASKET',
        status: 'SLICE_READY',
        notional: sliceAmount,
        fee,
        ts: Date.now(),
        detail: { safeguards: 1000, reason: `Slice ${idx + 1} scheduled inside 24h window.` },
      });
      applyReportsLiveUpdate();

      // For V1 scaffold we auto-advance once a slice has been logged.
      state.autopilot.awaitingPaymentForIndex = null;
      state.autopilot.nextIndex += 1;
    }
  }

  function appendTerminal(level, msg) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<div class="term-ts">${nowTs()}</div><div>[${level}] ${escapeHtml(msg)}</div>`;
    els.terminal.appendChild(line);
    els.terminal.scrollTop = els.terminal.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function randomBrainEvent() {
    const events = [
      'Scanning liquidity + slippage constraints…',
      'Monitoring volatility regime shift…',
      'Checking token contract heuristics…',
      'Risk controls: max drawdown guard OK.',
      'Signal engine: no trade (insufficient edge).',
      'Order planner: preparing user-confirmed route…',
      'Fee disclosure: 1% per-trade service fee required.',
      'Audit log: snapshot saved.',
    ];
    return events[Math.floor(Math.random() * events.length)];
  }

  async function fetchLeaders() {
    const t = Date.now();
    if (t - state.leadersLastFetchAt < 3500) return;
    state.leadersLastFetchAt = t;

    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINGECKO_IDS.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Market data unavailable');
      const data = await res.json();
      state.leaders.clear();
      for (const row of data) {
        state.leaders.set(row.id, {
          id: row.id,
          symbol: String(row.symbol || '').toUpperCase(),
          name: row.name,
          price: row.current_price,
          chg: row.price_change_percentage_24h,
        });
      }
      if (els.leadersSource) els.leadersSource.textContent = 'CoinGecko';
      if (els.leadersUniverse) els.leadersUniverse.textContent = String(state.leaders.size);
      renderLeaders();
    } catch {
      if (!els.leadersList.hasChildNodes()) {
        els.leadersList.innerHTML = '<div class="muted" style="padding:12px">Failed to load market data.</div>';
      }
    }
  }

  function renderLeaders() {
    els.leadersList.innerHTML = '';

    const liveUniverse = state.market.universe;
    const hasLive = liveUniverse && liveUniverse.size > 0;

    let rows = [];
    if (hasLive) {
      rows = Array.from(liveUniverse.values())
        .filter((a) => Number.isFinite(Number(a?.chg24Pct)) && Number.isFinite(Number(a?.priceUsd)))
        .map((a) => ({
          id: a.id || a.key,
          key: a.key,
          symbol: String(a.symbol || '').toUpperCase(),
          name: a.name || String(a.symbol || '').toUpperCase(),
          price: Number(a.priceUsd),
          chg: Number(a.chg24Pct),
          source: a.source || 'unknown',
        }));

      rows.sort((a, b) => {
        if (state.market.mode === 'losers') return a.chg - b.chg;
        return b.chg - a.chg;
      });
      rows = rows.slice(0, 80);

      if (els.leadersSource) {
        const src = state.market.source;
        const cgOk = Boolean(src?.coingecko?.ok);
        const bnOk = Boolean(src?.binance?.ok);
        els.leadersSource.textContent = cgOk && bnOk ? 'CoinGecko + Binance' : bnOk ? 'Binance' : 'CoinGecko';
      }
      if (els.leadersUniverse) els.leadersUniverse.textContent = String(liveUniverse.size);
    } else {
      rows = Array.from(state.leaders.values()).map((row) => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        price: Number(row.price),
        chg: Number(row.chg),
        source: 'coingecko',
      }));
      rows.sort((a, b) => {
        if (state.market.mode === 'losers') return a.chg - b.chg;
        return b.chg - a.chg;
      });
    }

    for (const row of rows) {
      const chg = Number(row.chg);
      const chgClass = Number.isFinite(chg) ? (chg >= 0 ? 'pos' : 'neg') : '';
      const el = document.createElement('div');
      el.className = 'leaders-row';
      el.innerHTML = `
        <div class="asset">
          <div class="badge">${escapeHtml(String(row.symbol || '?').slice(0, 1) || '?')}</div>
          <div>
            <div style="font-weight:950">${escapeHtml(String(row.name || ''))}</div>
            <div class="muted small">${escapeHtml(String(row.symbol || ''))}${row.source ? ` · ${escapeHtml(String(row.source))}` : ''}</div>
          </div>
        </div>
        <div class="right" style="font-weight:950">$${formatMoney(row.price)}</div>
        <div class="right chg ${chgClass}">${Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—'}</div>
      `;

      el.addEventListener('click', () => {
        openModal({
          title: `${row.name} (${row.symbol})`,
          bodyHtml: `
            <div class="muted">Price: <strong>$${formatMoney(row.price)}</strong></div>
            <div class="muted">24h: <strong class="${chgClass}">${Number.isFinite(chg) ? `${chg.toFixed(2)}%` : '—'}</strong></div>
            <div class="muted">Source: <strong>${escapeHtml(String(row.source || ''))}</strong></div>
            <div class="muted small" style="margin-top:10px">Paper mode: you can track this asset and Juzzy will bank 5% of gains each +10% step.</div>
          `,
          primaryText: 'Track (paper)',
          secondaryText: 'Close',
          onPrimary: async () => {
            const it = (row.key && state.market.universe.get(String(row.key))) ||
              Array.from(state.market.universe.values()).find((a) => String(a.symbol || '').toUpperCase() === String(row.symbol || '').toUpperCase()) ||
              null;
            if (it) {
              ensurePaperPosition(it, 100);
            } else {
              openModal({ title: 'Not live-trackable', bodyHtml: '<div class="muted">This row is not in the live universe yet. Try again after the stream updates.</div>', primaryText: 'OK', secondaryText: 'Close' });
            }
          },
        });
      });

      els.leadersList.appendChild(el);
    }
  }

  function connectMarketStream() {
    if (!window.EventSource) return;
    if (marketStreamClient) marketStreamClient.stop();
    marketStreamClient = connectSseWithRetry(
      '/api/market/stream',
      {
        onopen: () => {
          state.market.connected = true;
          renderOps();
          renderTopStatus();
        },
        onerror: () => {
          state.market.connected = false;
          renderOps();
          renderTopStatus();
          void loadMarketSnapshotOnce();
        },
        onmessage: (ev) => {
          try {
            const payload = JSON.parse(ev.data);
            if (payload?.type !== 'market_snapshot') return;
            state.market.lastServerTs = Number(payload.serverTs) || 0;
            state.market.lastUpdateAt = Number(payload.lastUpdateAt) || 0;
            state.market.source = payload.source || null;
            renderOps();
            renderTopStatus();

            const items = Array.isArray(payload.items) ? payload.items : [];
            state.market.universe.clear();
            for (const it of items) {
              if (!it?.key) continue;
              state.market.universe.set(it.key, it);
            }

            updatePaperKpis();

            populateChartAssetOptions();
            const currentChartKey = String(els.chartAsset?.value || '');
            if (currentChartKey) {
              const cur = state.market.universe.get(currentChartKey);
              if (cur && Number.isFinite(Number(cur.priceUsd))) {
                upsertLivePoint(currentChartKey, cur.priceUsd);
                if (document.querySelector('#tab-charts.panel.active')) refreshChart();
              }
            }

            const events = Array.isArray(payload.events) ? payload.events : [];
            for (const evt of events) {
              if (!evt || !evt.type || !evt.ts) continue;
              if (state.market.lastEventTs && evt.ts <= state.market.lastEventTs) continue;

              if (evt.type === 'DEX_BIRTH') {
                if (evt.key) state.market.birthKeys.add(String(evt.key));
                const sym = String(evt.symbol || '???');
                const chain = String(evt.chainId || 'dex');
                const px = Number(evt.priceUsd);
                const liq = Number(evt.liquidityUsd);
                appendTerminal('DEX', `Birth: ${sym} on ${chain} · $${formatMoney(px)} · liq $${formatMoney(liq)}`);
                emitAudit('DEX_BIRTH', { symbol: sym, chain, priceUsd: px, liquidityUsd: liq, key: evt.key || '' }, 'INFO');

                state.reports.unshift({
                  id: `L-${String(Date.now())}`,
                  asset: sym,
                  status: 'LIVE_DEX_BIRTH',
                  notional: Number.isFinite(px) ? px : 0,
                  fee: 0,
                  ts: Date.now(),
                  detail: {
                    safeguards: 950,
                    reason: `New DEX pair detected on ${chain}.`,
                    url: evt.url || '',
                  },
                });
              }

              state.market.lastEventTs = Math.max(state.market.lastEventTs || 0, evt.ts);
            }

            applyReportsLiveUpdate();

            if (els.leadersUniverse) els.leadersUniverse.textContent = String(state.market.universe.size);
            if (document.querySelector('#tab-leaders.panel.active')) {
              renderLeaders();
            }
          } catch {
            // ignore
          }
        },
      },
      'market'
    );
  }

  function seedReports() {
    const assets = ['BTC', 'ETH', 'SOL', 'XRP', 'UNI', 'LINK'];
    const statuses = ['NO_TRADE', 'PROPOSED', 'EXECUTED', 'REJECTED'];

    state.reports = Array.from({ length: 1200 }, (_, i) => {
      const asset = assets[i % assets.length];
      const status = statuses[(i * 7) % statuses.length];
      const notional = 10 + (i % 200) * 5;
      const fee = notional * 0.01;
      const ts = Date.now() - i * 37_000;
      return {
        id: `R-${String(1200 - i).padStart(6, '0')}`,
        asset,
        status,
        notional,
        fee,
        ts,
        detail: {
          safeguards: Math.floor(800 + (i % 200)),
          reason:
            status === 'EXECUTED'
              ? 'User approved; execution route selected; fee collected.'
              : status === 'PROPOSED'
                ? 'Signal found; awaiting user consent + fee payment.'
                : status === 'REJECTED'
                  ? 'Filtered by risk controls.'
                  : 'No edge detected.',
        },
      };
    });

    state.reportsRendered = 0;
  }

  function matchesReportSearch(r, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    return r.id.toLowerCase().includes(s) || r.asset.toLowerCase().includes(s) || r.status.toLowerCase().includes(s);
  }

  function renderMoreReports(count = 30) {
    const q = (els.reportSearch.value || '').trim();
    const filtered = q ? state.reports.filter((r) => matchesReportSearch(r, q)) : state.reports;

    const slice = filtered.slice(state.reportsRendered, state.reportsRendered + count);
    state.reportsRendered += slice.length;

    for (const r of slice) {
      const el = buildReportRow(r);
      els.reportsList.appendChild(el);
    }

    if (!q && state.reportsRendered > 0 && state.reportsLastRenderedId == null) {
      state.reportsLastRenderedId = filtered[0]?.id || null;
    }
  }

  function resetReportsRender() {
    els.reportsList.innerHTML = '';
    state.reportsRendered = 0;
    state.reportsLastRenderedId = null;
    state.reportsNewPending = 0;
    updateReportsNewIndicator();
    renderMoreReports(40);
    const q = (els.reportSearch.value || '').trim();
    if (!q) state.reportsLastRenderedId = state.reports[0]?.id || null;
  }

  function exportReportsCsv() {
    const q = (els.reportSearch.value || '').trim();
    const filtered = q ? state.reports.filter((r) => matchesReportSearch(r, q)) : state.reports;
    const header = ['id', 'timestamp', 'asset', 'status', 'notional', 'fee', 'safeguards'];
    const rows = filtered.map((r) => [
      r.id,
      new Date(r.ts).toISOString(),
      r.asset,
      r.status,
      r.notional,
      r.fee,
      r.detail.safeguards,
    ]);

    const csv = [header, ...rows].map((a) => a.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ── Learn library (catalog + reader + TTS + AI chat) ──
  const allTutorials = [].concat(window.JUZZY_TUTORIALS || [], window.JUZZY_TUTORIALS_2 || []);
  const tutCategories = [...new Set(allTutorials.map(t => t.cat))];
  const tutCompletedKey = 'juzzy_tut_completed';
  const learnerProfileKey = 'juzzy_learner_profile';
  const learnerSessionKey = 'juzzy_learner_session';
  const academy = window.JUZZY_ACADEMY || { totalModules: allTutorials.length, liveModules: allTutorials.length, tracks: [], packages: [], monthlyBuilder: null, roadmap: [] };
  const lessonMetaById = new Map(allTutorials.map((lesson, index) => {
    const track = academy.tracks.find((item) => Array.isArray(item.categories) && item.categories.includes(lesson.cat)) || null;
    return [lesson.id, {
      moduleNumber: index + 1,
      trackTitle: track?.title || 'Juzzy Academy',
      tier: track?.tier || 'Free',
      totalModules: academy.totalModules || allTutorials.length,
    }];
  }));
  const tutState = {
    cat: 'all',
    search: '',
    completed: [...getTutCompleted()],
    expandedTracks: JSON.parse(localStorage.getItem('juzzy_tut_expanded_tracks') || 'null') || [],
    activeTrackKey: localStorage.getItem('juzzy_tut_active_track') || '',
    particles: [],
    achievements: JSON.parse(localStorage.getItem('juzzy_tutorial_achievements') || '[]'),
  };
  let activeTutId = null;
  let activeLessonExternalResource = null;
  let lastLessonReturn = { tabId: 'tutorial', lessonId: null, step: 0 };
  let globalAiVoiceEnabled = true;
  let globalAiRecognizer = null;

  function getTutCompleted() {
    try { return new Set(JSON.parse(localStorage.getItem(tutCompletedKey) || '[]')); } catch { return new Set(); }
  }
  function setTutCompleted(id) {
    const s = getTutCompleted(); s.add(id);
    localStorage.setItem(tutCompletedKey, JSON.stringify([...s]));
    tutState.completed = [...s];
    const tut = allTutorials.find((item) => item.id === id);
    updateLearnerProfile((profile) => {
      const ability = classifyLessonAbility(tut);
      profile.strengths[ability] = Number(profile.strengths[ability] || 1) + 0.6;
      profile.completedLessons = Array.from(new Set([...(profile.completedLessons || []), id]));
      profile.focusAreas = [
        `Build deeper ${ability} skill`,
        'Stay active with guided exploration',
        'Use AI for interactive revision',
      ];
      return profile;
    });
  }

  function defaultLearnerProfile() {
    return {
      strengths: { foundations: 1, safety: 1, investing: 1, analysis: 1, creator: 1, builder: 1 },
      focusAreas: ['Foundations', 'Risk awareness', 'Guided practice'],
      preferredMode: 'interactive',
      completedLessons: [],
      currentLessonId: null,
      currentStep: 0,
      lastActiveTab: 'tutorial',
      interactionCount: 0,
    };
  }

  function getLearnerProfile() {
    try {
      const raw = JSON.parse(localStorage.getItem(learnerProfileKey) || 'null');
      return raw && typeof raw === 'object'
        ? { ...defaultLearnerProfile(), ...raw, strengths: { ...defaultLearnerProfile().strengths, ...(raw.strengths || {}) } }
        : defaultLearnerProfile();
    } catch {
      return defaultLearnerProfile();
    }
  }

  function saveLearnerProfile(profile) {
    try {
      localStorage.setItem(learnerProfileKey, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  function updateLearnerProfile(mutator) {
    const profile = getLearnerProfile();
    const next = mutator ? mutator(profile) || profile : profile;
    saveLearnerProfile(next);
    return next;
  }

  function classifyLessonAbility(tut) {
    const cat = String(tut?.cat || '').toLowerCase();
    if (cat.includes('risk')) return 'safety';
    if (cat.includes('trading')) return 'investing';
    if (cat.includes('advanced') || cat.includes('defi')) return 'builder';
    if (cat.includes('app')) return 'analysis';
    if (cat.includes('using')) return 'analysis';
    return 'foundations';
  }

  function scoreLessonForUser(tut, profile, searchTerm = '') {
    if (!tut) return -Infinity;
    const completed = getTutCompleted();
    const meta = getLessonMeta(tut.id);
    const ability = classifyLessonAbility(tut);
    const abilityStrength = Number(profile?.strengths?.[ability] || 1);
    const isCompleted = completed.has(tut.id);
    const hasSearch = Boolean(String(searchTerm || '').trim());
    const normalizedSearch = String(searchTerm || '').trim().toLowerCase();
    const haystack = `${tut.title} ${tut.desc} ${tut.cat} ${meta.trackTitle}`.toLowerCase();
    let score = 0;

    score += Math.max(0, 12 - meta.moduleNumber) * 4;
    score += abilityStrength * 10;
    score += isCompleted ? -160 : 60;

    if (profile?.currentLessonId === tut.id) score += 120;
    if (profile?.completedLessons?.includes(tut.id)) score -= 40;
    if (isPaidLesson(tut.id)) score -= 8;

    if (hasSearch) {
      if (tut.title.toLowerCase().includes(normalizedSearch)) score += 120;
      else if (tut.desc.toLowerCase().includes(normalizedSearch)) score += 70;
      else if (haystack.includes(normalizedSearch)) score += 45;
    }

    return score;
  }

  function scoreTrackForUser(group, profile, searchTerm = '') {
    const lessons = Array.isArray(group?.lessons) ? group.lessons : [];
    if (!lessons.length) return -Infinity;
    const completedCount = lessons.filter((lesson) => tutState.completed.includes(lesson.id)).length;
    const nextLesson = lessons[0];
    let score = lessons.reduce((sum, lesson) => sum + scoreLessonForUser(lesson, profile, searchTerm), 0) / lessons.length;
    score += (lessons.length - completedCount) * 6;
    score -= completedCount * 3;
    if (nextLesson && profile?.currentLessonId === nextLesson.id) score += 50;
    return score;
  }

  function getNextRecommendedLesson() {
    const profile = getLearnerProfile();
    const ranked = [...allTutorials].sort((a, b) => scoreLessonForUser(b, profile) - scoreLessonForUser(a, profile));
    return ranked[0] || allTutorials[0] || null;
  }

  function rememberLessonReturn() {
    const payload = {
      tabId: document.querySelector('.tab.active')?.dataset.tab || 'tutorial',
      lessonId: activeTutId,
      step: activeTutStep,
    };
    lastLessonReturn = payload;
    try {
      localStorage.setItem(learnerSessionKey, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  function restoreLessonReturn() {
    const session = (() => {
      try { return JSON.parse(localStorage.getItem(learnerSessionKey) || 'null'); } catch { return null; }
    })() || lastLessonReturn;
    if (session?.lessonId) {
      setActiveTab('tutorial');
      openTutLesson(session.lessonId);
      startTutLesson(true);
      activeTutStep = Math.max(0, Number(session.step || 0));
      renderTutStep();
      return;
    }
    setActiveTab(session?.tabId || 'tutorial');
  }

  function closeLessonExternalResource() {
    activeLessonExternalResource = null;
    if (els.tutExternalViewer) els.tutExternalViewer.hidden = true;
    if (els.tutExternalFrame) els.tutExternalFrame.src = 'about:blank';
    if (els.tutExternalTitle) els.tutExternalTitle.textContent = 'Lesson Resource';
    if (els.tutExternalMeta) els.tutExternalMeta.textContent = 'External resource opened inside Juzzy';
  }

  function openExternalResourceModal(resource) {
    if (!resource?.url) return;
    const safeUrl = tutEscapeHtml(String(resource.url || '').trim());
    const safeLabel = tutEscapeHtml(String(resource.label || 'External Resource').trim());
    const safeProvider = tutEscapeHtml(String(resource.provider || 'Opened inside Juzzy').trim());
    openModal({
      title: String(resource.label || 'External Resource').trim() || 'External Resource',
      bodyHtml: `<div style="display:flex;flex-direction:column;gap:12px;min-height:70vh"><div class="muted small" style="line-height:1.65">You are still inside Juzzy. ${safeProvider} is opening inside the app below.</div><iframe src="${safeUrl}" title="${safeLabel}" referrerpolicy="no-referrer" style="width:100%;min-height:60vh;border:1px solid rgba(255,255,255,0.12);border-radius:14px;background:rgba(8,14,24,0.95)"></iframe></div>`,
      primaryText: 'Done',
      secondaryText: 'Close',
    });
  }

  function openExternalResourceInApp(resource) {
    if (!resource?.url) return;
    const normalizedResource = {
      url: String(resource.url || '').trim(),
      label: String(resource.label || 'External Resource').trim(),
      provider: String(resource.provider || 'External Resource').trim(),
    };
    if (!normalizedResource.url) return;
    if (activeTutId && els.tutReader && !els.tutReader.hidden) {
      openLessonExternalResource(normalizedResource);
      return;
    }
    openExternalResourceModal(normalizedResource);
  }

  function shouldRouteUrlInsideApp(url) {
    const normalized = String(url || '').trim();
    if (!normalized || !/^https?:\/\//i.test(normalized)) return false;
    try {
      const parsed = new URL(normalized, window.location.href);
      return parsed.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  function installWindowOpenInterceptor() {
    if (window.__juzzyWindowOpenIntercepted) return;
    window.__juzzyWindowOpenIntercepted = true;
    const originalWindowOpen = window.open.bind(window);
    window.open = function interceptedWindowOpen(url, target, features) {
      if (shouldRouteUrlInsideApp(url)) {
        openExternalResourceInApp({
          url: String(url || '').trim(),
          label: 'External Resource',
          provider: 'Opened inside Juzzy',
        });
        return window;
      }
      return originalWindowOpen(url, target, features);
    };
  }

  function openLessonExternalResource(resource) {
    if (!resource?.url) return;
    rememberLessonReturn();
    activeLessonExternalResource = {
      url: String(resource.url || '').trim(),
      label: String(resource.label || 'Lesson Resource').trim(),
      provider: String(resource.provider || 'External Resource').trim(),
    };
    if (els.tutExternalTitle) els.tutExternalTitle.textContent = activeLessonExternalResource.label;
    if (els.tutExternalMeta) els.tutExternalMeta.textContent = `${activeLessonExternalResource.provider} · Framed inside Juzzy when supported · Return to lesson anytime`;
    if (els.tutExternalFrame) els.tutExternalFrame.src = activeLessonExternalResource.url;
    if (els.tutExternalViewer) els.tutExternalViewer.hidden = false;
  }

  function openActiveLessonResourceInNewTab() {
    if (!activeLessonExternalResource?.url) return;
    openExternalResourceModal(activeLessonExternalResource);
  }

  function bindExternalLinksInContainer(container) {
    if (!container) return;
    Array.from(container.querySelectorAll('a[href^="http://"], a[href^="https://"], [data-in-app-link="true"]')).forEach((el) => {
      if (el.dataset.inAppBound === 'true') return;
      el.dataset.inAppBound = 'true';
      el.addEventListener('click', (event) => {
        const url = String(el.getAttribute('href') || el.getAttribute('data-lesson-resource-url') || '').trim();
        if (!url) return;
        event.preventDefault();
        openExternalResourceInApp({
          url,
          label: String(el.getAttribute('data-in-app-label') || el.getAttribute('data-lesson-resource-label') || el.textContent || 'External Resource').trim(),
          provider: String(el.getAttribute('data-in-app-provider') || el.getAttribute('data-lesson-resource-provider') || 'External Resource').trim(),
        });
      });
    });
  }

  function renderLearnerDashboard() {
    const profile = getLearnerProfile();
    const nextLesson = getNextRecommendedLesson();
    const strengths = Object.entries(profile.strengths).sort((a, b) => b[1] - a[1]);
    if (els.academyJourney) {
      els.academyJourney.innerHTML = `
        <div class="card-title">Continue Learning</div>
        <div class="academy-journey-card">
          <div>
            <div class="academy-journey-title">${nextLesson ? nextLesson.title : 'Your academy is ready'}</div>
            <div class="academy-card-copy">${nextLesson ? nextLesson.desc : 'Start your first module to begin building your personalized pathway.'}</div>
            <div class="academy-chip-row">
              <span class="academy-chip">${nextLesson ? getLessonMeta(nextLesson.id).trackTitle : 'Foundations'}</span>
              <span class="academy-chip">${nextLesson ? `${nextLesson.steps.length} lesson steps` : 'New learner path'}</span>
            </div>
          </div>
          <div class="academy-journey-actions">
            <button class="btn primary" data-academy-open="${nextLesson ? nextLesson.id : ''}">Continue</button>
            <button class="btn" data-academy-action="open-ai">Ask AI Guide</button>
          </div>
        </div>
      `;
    }
    if (els.academyProfile) {
      els.academyProfile.innerHTML = `
        <div class="card-title">Learner Ability Snapshot</div>
        <div class="academy-profile-grid">
          ${strengths.slice(0, 4).map(([key, value]) => `
            <div class="academy-profile-stat">
              <div class="academy-profile-label">${key}</div>
              <div class="academy-profile-value">${Math.min(100, Math.round(value * 10))}%</div>
            </div>
          `).join('')}
        </div>
        <div class="muted small" style="margin-top:10px">This adaptive profile is stored per user in the app now and can be connected to Supabase later for persistent cloud memory.</div>
      `;
    }
    if (els.academyFocus) {
      els.academyFocus.innerHTML = `
        <div class="card-title">Personalized Focus Areas</div>
        <div class="academy-chip-row">${profile.focusAreas.map((item) => `<span class="academy-chip">${item}</span>`).join('')}</div>
        <div class="academy-focus-links">
          <button class="btn" data-academy-jump="leaders">Explore live market examples</button>
          <button class="btn" data-academy-jump="charts">Open guided charts</button>
          <button class="btn" data-academy-jump="brain">See AI activity</button>
          <button class="btn" data-academy-action="return">Return to active lesson</button>
        </div>
      `;
    }

    Array.from(document.querySelectorAll('[data-academy-open]')).forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-academy-open');
        if (!id) return;
        openTutLesson(id);
      });
    });
    Array.from(document.querySelectorAll('[data-academy-jump]')).forEach((el) => {
      el.addEventListener('click', () => {
        rememberLessonReturn();
        setActiveTab(el.getAttribute('data-academy-jump'));
      });
    });
    Array.from(document.querySelectorAll('[data-academy-action]')).forEach((el) => {
      el.addEventListener('click', () => {
        const action = el.getAttribute('data-academy-action');
        if (action === 'open-ai') openGlobalAiDock();
        if (action === 'return') restoreLessonReturn();
      });
    });
  }

  function initTutCategoryOptions() {
    if (!els.tutCat) return;
    els.tutCat.innerHTML = '<option value="all">All categories</option>';
    for (const cat of tutCategories) {
      const o = document.createElement('option');
      o.value = cat; o.textContent = cat;
      els.tutCat.appendChild(o);
    }
  }

  function getLessonMeta(id) {
    return lessonMetaById.get(id) || { moduleNumber: 0, trackTitle: 'Juzzy Academy', tier: 'Free', totalModules: academy.totalModules || allTutorials.length };
  }

  function saveExpandedTutorialTracks() {
    try {
      localStorage.setItem('juzzy_tut_expanded_tracks', JSON.stringify(tutState.expandedTracks));
    } catch {
      // ignore
    }
  }

  function getTutorialTrackKey(trackTitle) {
    return String(trackTitle || 'Juzzy Academy').trim() || 'Juzzy Academy';
  }

  function toggleTutorialTrack(trackKey) {
    tutState.activeTrackKey = String(trackKey || '').trim();
    try {
      localStorage.setItem('juzzy_tut_active_track', tutState.activeTrackKey);
    } catch {
      // ignore
    }
    saveExpandedTutorialTracks();
    renderTutorialCatalog();
  }

  function sanitizeTutorialHtml(html) {
    return String(html || '')
      .replace(/<iframe[^>]*youtube[^>]*>[\s\S]*?<\/iframe>/gi, '<div class="academy-inline-visual"><strong>Visual lesson note:</strong> This module now uses Juzzy-native visuals and guided reading instead of external YouTube video embeds.</div>')
      .replace(/<iframe[^>]*youtu\.be[^>]*>[\s\S]*?<\/iframe>/gi, '<div class="academy-inline-visual"><strong>Visual lesson note:</strong> This module now uses Juzzy-native visuals and guided reading instead of external YouTube video embeds.</div>');
  }

  function renderAcademyHub() {
    if (els.academyOverview) {
      const country = getCountryProfile(state.profile.country);
      els.academyOverview.innerHTML = `
        <div class="academy-hero card">
          <div>
            <div class="academy-eyebrow">${academy.totalModules}-module immersive crypto university</div>
            <div class="academy-title">From crypto beginner to global crypto strategist, builder, and creator</div>
            <div class="academy-copy">Juzzy Academy now frames the app as an immersive learning universe spanning crypto foundations, safety, investing, technical analysis, DeFi, AI workflows, global regulation, builder literacy, creator education, tokenized content, and crypto business systems. Users practice concepts directly in Juzzy using charts, paper trading, reports, live market tools, guided demos, and simulation workflows. All content is educational only, not a promise of earnings, and should be reviewed against the laws of ${country.name}.</div>
          </div>
          <div class="academy-stats">
            <div class="academy-stat"><span class="academy-stat-value">${academy.totalModules}</span><span class="academy-stat-label">Total modules</span></div>
            <div class="academy-stat"><span class="academy-stat-value">${academy.liveModules}</span><span class="academy-stat-label">Live now</span></div>
            <div class="academy-stat"><span class="academy-stat-value">${academy.packages.length}</span><span class="academy-stat-label">Packages</span></div>
          </div>
        </div>
      `;
    }

    if (els.academyTracks) {
      els.academyTracks.innerHTML = `
        <div class="card-title">Program Pathways</div>
        <div class="academy-card-list">
          ${academy.tracks.map((track) => `
            <div class="academy-card">
              <div class="academy-card-head">
                <div>
                  <div class="academy-card-title">${track.title}</div>
                  <div class="academy-card-tier">${track.tier}</div>
                </div>
                <div class="academy-card-count">${track.totalModules} modules</div>
              </div>
              <div class="academy-card-copy">${track.summary}</div>
              <div class="academy-chip-row">${track.outcomes.map((item) => `<span class="academy-chip">${item}</span>`).join('')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (els.academyPackages) {
      els.academyPackages.innerHTML = `
        <div class="card-title">Membership Packages</div>
        <div class="academy-card-list">
          ${academy.packages.map((pkg) => `
            <div class="academy-card academy-package-card">
              <div class="academy-card-head">
                <div>
                  <div class="academy-card-title">${pkg.name}</div>
                  <div class="academy-card-tier">${pkg.audience}</div>
                </div>
                <div class="academy-package-price">${pkg.price}</div>
              </div>
              <div class="academy-chip-row">${pkg.includes.map((item) => `<span class="academy-chip">${item}</span>`).join('')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (els.academyRoadmap) {
      const roadmapPreview = academy.roadmap.slice(0, 12);
      els.academyRoadmap.innerHTML = `
        <div class="card-title">Global Academy Roadmap</div>
        <div class="academy-roadmap-list">
          ${roadmapPreview.map((item) => `
            <div class="academy-roadmap-item">
              <div class="academy-roadmap-number">${item.number}</div>
              <div>
                <div class="academy-roadmap-title">${item.trackTitle}</div>
                <div class="academy-roadmap-meta">${item.tier} · ${item.status}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="muted small" style="margin-top:10px">The first ${academy.liveModules} modules are live through the current academy lessons. The remaining roadmap modules are staged for rollout.</div>
      `;
    }

    if (els.academyBuilder && academy.monthlyBuilder) {
      els.academyBuilder.innerHTML = `
        <div class="card-title">${academy.monthlyBuilder.title}</div>
        <div class="academy-card-copy">${academy.monthlyBuilder.summary}</div>
        <div class="academy-builder-cadence">${academy.monthlyBuilder.cadence}</div>
        <div class="academy-chip-row">${academy.monthlyBuilder.pipeline.map((item) => `<span class="academy-chip">${item}</span>`).join('')}</div>
      `;
    }
    renderLearnerDashboard();
  }

  function renderTutorialCatalog() {
    if (!els.tutCatalog) return;
    tutState.completed = [...getTutCompleted()];
    const profile = getLearnerProfile();
    const filtered = allTutorials.filter(t => {
      if (tutState.cat !== 'all' && t.cat !== tutState.cat) return false;
      if (tutState.search) {
        const s = tutState.search.toLowerCase();
        return t.title.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s);
      }
      return true;
    });
    if (els.tutProgress) {
      const completedCount = getTutCompleted().size;
      els.tutProgress.textContent = `${completedCount}/${academy.liveModules || allTutorials.length} live modules completed`;
    }
    const grouped = filtered.reduce((acc, tut) => {
      const meta = getLessonMeta(tut.id);
      const trackKey = getTutorialTrackKey(meta.trackTitle);
      if (!acc.has(trackKey)) {
        acc.set(trackKey, {
          trackKey,
          title: meta.trackTitle,
          tier: meta.tier,
          lessons: [],
        });
      }
      acc.get(trackKey).lessons.push(tut);
      return acc;
    }, new Map());
    const groups = Array.from(grouped.values()).map((group) => {
      group.lessons.sort((a, b) => scoreLessonForUser(b, profile, tutState.search) - scoreLessonForUser(a, profile, tutState.search));
      const completedCount = group.lessons.filter((lesson) => tutState.completed.includes(lesson.id)).length;
      const recommendedLesson = group.lessons[0] || null;
      return {
        ...group,
        completedCount,
        recommendedLessonId: recommendedLesson?.id || null,
      };
    }).sort((a, b) => scoreTrackForUser(b, profile, tutState.search) - scoreTrackForUser(a, profile, tutState.search));
    if (!groups.length) {
      els.tutCatalog.innerHTML = `<div class="tut-empty-state"><div class="tut-card-title">No modules match your search yet</div><div class="tut-card-desc">Try a different keyword or switch to another lesson category.</div></div>`;
      return;
    }
    const activeTrackKey = groups.some((group) => group.trackKey === tutState.activeTrackKey)
      ? tutState.activeTrackKey
      : groups[0].trackKey;
    tutState.activeTrackKey = activeTrackKey;
    try {
      localStorage.setItem('juzzy_tut_active_track', tutState.activeTrackKey);
    } catch {
      // ignore
    }
    const activeGroup = groups.find((group) => group.trackKey === activeTrackKey) || groups[0];
    els.tutCatalog.innerHTML = `
      <section class="tut-bubble-shell">
        <div class="tut-bubble-header">
          <div>
            <div class="tut-track-eyebrow">Pathway bubbles</div>
            <div class="tut-track-title">Choose a module group instead of scrolling through every lesson</div>
            <div class="tut-track-meta">Each bubble opens a grouped module tab with its subtopics ready to launch in a focused lesson window.</div>
          </div>
        </div>
        <div class="tut-bubble-row">
          ${groups.map((group) => `
            <button class="tut-bubble-tab ${group.trackKey === activeTrackKey ? 'active' : ''}" type="button" data-track-toggle="${tutEscapeHtml(group.trackKey)}">
              <div class="tut-bubble-tier">${group.tier}</div>
              <div class="tut-bubble-title">${group.title}</div>
              <div class="tut-bubble-meta">${group.lessons.length} modules · ${group.completedCount} complete</div>
            </button>
          `).join('')}
        </div>
      </section>
      <section class="tut-track-group active" data-track-key="${tutEscapeHtml(activeGroup.trackKey)}">
        <div class="tut-track-toggle static">
          <div class="tut-track-summary">
            <div class="tut-track-eyebrow">${activeGroup.tier} pathway</div>
            <div class="tut-track-title-row">
              <div class="tut-track-title">${activeGroup.title}</div>
              <div class="tut-track-count">${activeGroup.lessons.length} subtopics</div>
            </div>
            <div class="tut-track-meta">${activeGroup.completedCount}/${activeGroup.lessons.length} completed · ${activeGroup.recommendedLessonId ? 'Best next lesson prioritized for this learner.' : 'Select a subtopic below to launch it instantly.'}</div>
          </div>
          <div class="tut-track-chevron">⬢</div>
        </div>
        <div class="tut-track-lessons">
          ${activeGroup.lessons.map((t) => `
            <div class="tut-card ${tutState.completed.includes(t.id) ? 'completed' : ''}" data-tut-id="${t.id}">
              <div class="tut-card-cat">Module ${getLessonMeta(t.id).moduleNumber} · ${t.cat}</div>
              <div class="tut-card-title">${t.title}</div>
              <div class="tut-card-desc">${t.desc}</div>
              <div class="tut-card-meta">
                <span class="tut-card-badge ${tutState.completed.includes(t.id) ? 'done' : ''}">${tutState.completed.includes(t.id) ? '✓ Done' : getLessonMeta(t.id).tier}</span>
                ${activeGroup.recommendedLessonId === t.id ? '<span class="tut-card-badge new">Recommended</span>' : ''}
                <span>${t.steps.length} steps</span>
              </div>
              <div class="tutorial-card-actions">
                <button class="btn" type="button" data-tut-open="${t.id}">Launch Module Window</button>
                ${isPaidLesson(t.id) ? '<button class="btn primary" type="button" data-tut-unlock="' + t.id + '">Unlock via Stripe</button>' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
    Array.from(els.tutCatalog.querySelectorAll('[data-track-toggle]')).forEach((el) => {
      el.addEventListener('click', () => {
        toggleTutorialTrack(el.getAttribute('data-track-toggle'));
      });
    });
    Array.from(els.tutCatalog.querySelectorAll('.tut-card')).forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-tut-id');
        openTutLesson(id);
      });
    });
    Array.from(els.tutCatalog.querySelectorAll('[data-tut-open]')).forEach((el) => {
      el.addEventListener('click', (evt) => {
        evt.stopPropagation();
        openTutLesson(el.getAttribute('data-tut-open'));
      });
    });
    Array.from(els.tutCatalog.querySelectorAll('[data-tut-unlock]')).forEach((el) => {
      el.addEventListener('click', (evt) => {
        evt.stopPropagation();
        promptStripeForModule(el.getAttribute('data-tut-unlock'));
      });
    });
  }

  // Particle effects for tutorial
  function initTutorialParticles() {
    const container = document.getElementById('tutParticles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'tut-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      container.appendChild(particle);
      tutState.particles.push(particle);
    }
  }

  // Achievement notification
  function showAchievement(title, description, icon = '🏆') {
    const achievement = document.createElement('div');
    achievement.className = 'tut-achievement';
    achievement.innerHTML = `
      <div class="tut-achievement-icon">${icon}</div>
      <div>
        <div style="font-weight:600">${title}</div>
        <div class="muted small">${description}</div>
      </div>
    `;
    document.body.appendChild(achievement);
    
    setTimeout(() => achievement.classList.add('show'), 100);
    setTimeout(() => {
      achievement.classList.remove('show');
      setTimeout(() => achievement.remove(), 500);
    }, 4000);
    
    // Track achievement
    const id = title.replace(/\s+/g, '_').toLowerCase();
    if (!tutState.achievements.includes(id)) {
      tutState.achievements.push(id);
      localStorage.setItem('juzzy_tutorial_achievements', JSON.stringify(tutState.achievements));
    }
  }

  let activeTutStep = 0;
  let tutTtsEnabled = false;

  // ── Text-to-Speech engine ──
  function tutTtsSpeak(text) {
    tutTtsStop();
    if (!window.speechSynthesis) return;
    const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.95;
    utt.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const eng = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'))
             || voices.find(v => v.lang.startsWith('en'))
             || voices[0];
    if (eng) utt.voice = eng;
    window.speechSynthesis.speak(utt);
  }
  function tutTtsStop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
  function tutTtsUpdateBtn() {
    if (!els.tutTtsToggle) return;
    els.tutTtsToggle.classList.toggle('active', tutTtsEnabled);
    els.tutTtsToggle.textContent = tutTtsEnabled ? '🔊' : '🔇';
    els.tutTtsToggle.title = tutTtsEnabled ? 'Voice ON — click to mute' : 'Voice OFF — click to enable';
  }

  // ── AI Chat assistant ──
  function tutChatClear() {
    if (els.tutChatMessages) els.tutChatMessages.innerHTML = '';
  }
  function tutChatAddMsg(role, html) {
    if (!els.tutChatMessages) return;
    const d = document.createElement('div');
    d.className = 'tut-chat-msg ' + role;
    d.innerHTML = html;
    els.tutChatMessages.appendChild(d);
    els.tutChatMessages.scrollTop = els.tutChatMessages.scrollHeight;
    return d;
  }
  function tutChatGreet() {
    tutChatClear();
    const tut = allTutorials.find(t => t.id === activeTutId);
    if (!tut) return;
    tutChatAddMsg('ai', `Hi! I\'m your AI assistant for <strong>${tut.title}</strong>. Ask me anything about this topic and I\'ll help explain it.`);
  }

  function globalAiAddMsg(role, html) {
    if (!els.globalAiMessages) return null;
    const d = document.createElement('div');
    d.className = 'tut-chat-msg ' + role;
    d.innerHTML = html;
    els.globalAiMessages.appendChild(d);
    els.globalAiMessages.scrollTop = els.globalAiMessages.scrollHeight;
    return d;
  }

  function getGlobalAiQuickActions() {
    const tabId = getCurrentActiveTabId();
    const byTab = {
      home: [
        'Show me the fastest way to start learning',
        'What course should I take first?',
        'Summarize what Juzzy can do for me'
      ],
      tutorial: [
        'Explain this lesson simply',
        'Quiz me on this topic',
        'Give me the next best lesson'
      ],
      oracle: [
        'Explain the current market setup',
        'Show me a low-risk practice idea',
        'What should I watch before trading?'
      ],
      charts: [
        'Teach me chart patterns',
        'What is support and resistance?',
        'How do I spot trend changes?'
      ],
      community: [
        'What should I pay attention to here?',
        'Summarize the latest community mood',
        'Show me beginner-safe discussion topics'
      ],
      portfolio: [
        'Explain diversification simply',
        'How should a beginner track risk?',
        'What portfolio mistakes should I avoid?'
      ]
    };
    return byTab[tabId] || [
      'What should I do on this screen?',
      'Give me the safest next step',
      'Explain this area in simple terms'
    ];
  }

  function renderGlobalAiQuickActions() {
    if (!els.globalAiQuickActions) return;
    const actions = getGlobalAiQuickActions();
    els.globalAiQuickActions.innerHTML = actions.map((label) => (
      `<button class="global-ai-chip" type="button" data-global-ai-prompt="${tutEscapeHtml(label)}">${tutEscapeHtml(label)}</button>`
    )).join('');
    Array.from(els.globalAiQuickActions.querySelectorAll('[data-global-ai-prompt]')).forEach((btn) => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-global-ai-prompt') || '';
        if (els.globalAiInput) els.globalAiInput.value = prompt;
        void globalAiAnswer(prompt);
      });
    });
  }

  function openGlobalAiDock() {
    if (!els.globalAiDock) return;
    els.globalAiDock.hidden = false;
    renderGlobalAiQuickActions();
    if (els.globalAiMessages && !els.globalAiMessages.children.length) {
      globalAiAddMsg('ai', '<p>I\'m Juzzy AI. I can explain the current screen, simplify lessons, generate practice steps, and guide you to the best next action.</p>');
    }
  }

  function closeGlobalAiDock() {
    if (els.globalAiDock) els.globalAiDock.hidden = true;
  }

  function toggleGlobalAiVoice() {
    globalAiVoiceEnabled = !globalAiVoiceEnabled;
    if (els.globalAiSpeak) els.globalAiSpeak.textContent = globalAiVoiceEnabled ? '🔊' : '🔇';
    if (!globalAiVoiceEnabled) tutTtsStop();
  }

  async function globalAiAnswer(question) {
    const q = String(question || '').trim();
    if (!q) return;
    openGlobalAiDock();
    globalAiAddMsg('user', tutEscapeHtml(q));
    const thinking = globalAiAddMsg('ai', '<span class="ai-thinking">Thinking…</span>');
    const answer = await generateTutAnswer(q, q.toLowerCase());
    if (thinking) thinking.innerHTML = answer;
    if (globalAiVoiceEnabled) tutTtsSpeak(answer);
    updateLearnerProfile((profile) => {
      profile.interactionCount += 1;
      return profile;
    });
  }

  function setupGlobalAiVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || globalAiRecognizer) return;
    globalAiRecognizer = new SpeechRecognition();
    globalAiRecognizer.lang = 'en-US';
    globalAiRecognizer.interimResults = false;
    globalAiRecognizer.maxAlternatives = 1;
    globalAiRecognizer.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (els.globalAiInput) els.globalAiInput.value = transcript;
      if (transcript) void globalAiAnswer(transcript);
    };
    globalAiRecognizer.onerror = () => {
      globalAiAddMsg('ai', '<p>Microphone input is unavailable right now. You can still type to chat.</p>');
    };
  }

  function startGlobalAiListening() {
    setupGlobalAiVoiceInput();
    if (!globalAiRecognizer) {
      globalAiAddMsg('ai', '<p>Your browser does not currently support microphone dictation here. Please type your question.</p>');
      return;
    }
    globalAiRecognizer.start();
  }

  function tutAIAnswer(question) {
    const q = String(question || '').toLowerCase().trim();
    if (!q) return;
    tutChatAddMsg('user', question.replace(/</g, '&lt;'));
    const thinking = tutChatAddMsg('ai', '<span class="ai-thinking">Thinking…</span>');

    setTimeout(async () => {
      const answer = await generateTutAnswer(question, q);
      if (thinking) thinking.innerHTML = answer;
      els.tutChatMessages.scrollTop = els.tutChatMessages.scrollHeight;
      if (tutTtsEnabled) tutTtsSpeak(answer);
    }, 600 + Math.random() * 400);
  }

  function tutEscapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tutStripHtml(s) {
    return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function sanitizeIdeaSubmission(value) {
    return String(value || '')
      .replace(/[\u0000-\u001F\u007F]/g, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function containsBlockedIdeaContent(value) {
    const text = String(value || '').toLowerCase();
    const blockedPatterns = [
      'script', 'javascript:', '<iframe', 'onerror=', 'onload=', 'powershell', 'cmd.exe', 'terminal command',
      'virus', 'malware', 'payload', 'ransomware', 'macro', '.exe', '.bat', 'download and run', 'keylogger',
      'prompt injection', 'ignore previous instructions', 'system prompt', 'bypass security', 'exploit', 'backdoor',
      'upload file', 'attach file', 'document attachment'
    ];
    return blockedPatterns.some((token) => text.includes(token));
  }

  function classifyIdeaEducationalValue(value) {
    const text = String(value || '').toLowerCase();
    const educationalSignals = [
      'learn', 'lesson', 'module', 'course', 'tutorial', 'education', 'quiz', 'practice', 'training', 'student',
      'teacher', 'academy', 'guide', 'feedback', 'improve', 'study', 'curriculum', 'explain', 'simulation'
    ];
    const score = educationalSignals.reduce((sum, token) => sum + (text.includes(token) ? 1 : 0), 0);
    return score;
  }

  function buildIdeaPlanHtml(rawIdea) {
    const idea = sanitizeIdeaSubmission(rawIdea);
    if (!idea) {
      return '<div class="ideas-lab-result-title">Nothing to review yet</div><div class="muted">Type your idea manually to start the secure AI review.</div>';
    }
    if (containsBlockedIdeaContent(idea)) {
      return `<div class="ideas-lab-result-title ideas-lab-result-reject">Rejected for security</div><div class="muted">This submission contains risky or system-oriented content that Juzzy AI will not process. For safety, the Ideas Lab only accepts typed educational product suggestions and never executes instructions, opens files, or accepts technical payloads.</div><div class="ideas-lab-result-list"><div><strong>Why rejected:</strong> unsafe system, exploit, attachment, or code-like language was detected.</div><div><strong>What to do instead:</strong> rewrite the idea as a plain educational feature request in your own words.</div></div>`;
    }
    const educationalScore = classifyIdeaEducationalValue(idea);
    if (educationalScore < 2) {
      return `<div class="ideas-lab-result-title ideas-lab-result-reject">Needs stronger educational value</div><div class="muted">Juzzy AI only advances ideas that clearly improve learning, safety, guided practice, or educational outcomes.</div><div class="ideas-lab-result-list"><div><strong>Your idea:</strong> ${tutEscapeHtml(idea)}</div><div><strong>How to improve it:</strong> explain what learners gain, which lesson flow it improves, and how it stays safe and educational.</div></div>`;
    }
    const roadmap = [
      'Define the learning goal and who the feature helps most',
      'Design the safest educational workflow and clear user prompts',
      'Add AI guidance, explanations, and learning checkpoints',
      'Add compliance, abuse prevention, and user-facing safety limits',
      'Test it with beginner and advanced learners before release'
    ];
    const safeguards = [
      'Typed input only with no paste or attachments',
      'Strict sanitization before AI review',
      'No code execution or file handling from user content',
      'Educational-only scope with compliance messaging',
      'Manual product review before any real implementation decisions'
    ];
    return `
      <div class="ideas-lab-result-title ideas-lab-result-accept">Educational idea approved for planning</div>
      <div class="muted">Juzzy AI has converted this suggestion into a safe implementation brief. The system does not execute user instructions directly; it creates a controlled product plan.</div>
      <div class="ideas-lab-result-list">
        <div><strong>Idea summary:</strong> ${tutEscapeHtml(idea)}</div>
        <div><strong>Learning value:</strong> This idea appears to improve learner understanding, guided practice, or educational engagement inside Juzzy.</div>
        <div><strong>AI build brief:</strong> Create a focused feature that teaches clearly, keeps actions safe, and supports measurable student progress.</div>
      </div>
      <div class="ideas-lab-subtitle">Implementation roadmap</div>
      <ol class="ideas-lab-roadmap">${roadmap.map((item) => `<li>${tutEscapeHtml(item)}</li>`).join('')}</ol>
      <div class="ideas-lab-subtitle">Security safeguards</div>
      <ul class="ideas-lab-roadmap">${safeguards.map((item) => `<li>${tutEscapeHtml(item)}</li>`).join('')}</ul>
    `;
  }

  function reviewIdeaFeedback() {
    const raw = String(els.ideaFeedbackInput?.value || '');
    if (!els.ideaFeedbackOutput) return;
    const html = buildIdeaPlanHtml(raw);
    els.ideaFeedbackOutput.innerHTML = html;
    const idea = sanitizeIdeaSubmission(raw);
    const approved = !containsBlockedIdeaContent(idea) && classifyIdeaEducationalValue(idea) >= 2;
    if (idea) {
      const rewards = loadGrowthRewards();
      const ownerEmail = String(state.user.email || '').trim().toLowerCase() || 'guest@juzzy.local';
      const existing = rewards.suggestions.find((item) => item.idea === idea && item.ownerEmail === ownerEmail);
      if (!existing) {
        rewards.suggestions.unshift({
          id: `idea-${Date.now()}`,
          ownerEmail,
          idea,
          approved,
          rewardClaimed: false,
          createdAt: Date.now(),
        });
        saveGrowthRewards(rewards);
      }
      renderGrowthRewards();
    }
    updateLearnerProfile((profile) => {
      profile.interactionCount += 1;
      return profile;
    });
  }

  function clearIdeaFeedback() {
    if (els.ideaFeedbackInput) els.ideaFeedbackInput.value = '';
    if (els.ideaFeedbackOutput) {
      els.ideaFeedbackOutput.innerHTML = 'AI review will appear here. Safe educational ideas will be converted into a product brief, learning value summary, safeguards list, and implementation roadmap.';
    }
  }

  function hardenPromptInput(el) {
    if (!el) return;
    el.addEventListener('paste', (e) => {
      e.preventDefault();
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
    });
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    el.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
        e.preventDefault();
      }
    });
  }

  function initPromptSecurityHardening() {
    [
      els.globalAiInput,
      els.tutChatInput,
      els.messagesComposer,
      els.ideaFeedbackInput,
    ].forEach(hardenPromptInput);
  }

  function tutContainsAny(q, words) {
    return words.some((w) => q.includes(w));
  }

  function getTutorialAIConfig() {
    return {
      endpoint: String(localStorage.getItem('juzzy_tutorial_ai_endpoint') || '').trim(),
      apiKey: String(localStorage.getItem('juzzy_tutorial_ai_key') || '').trim(),
      model: String(localStorage.getItem('juzzy_tutorial_ai_model') || 'gpt-4o-mini').trim(),
    };
  }

  async function tutFetchOnlineAnswer(question, context) {
    const cfg = getTutorialAIConfig();
    if (!cfg.endpoint || !cfg.apiKey) return null;
    try {
      const resp = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify({
          model: cfg.model,
          messages: [
            {
              role: 'system',
              content: `You are Juzzy's tutorial AI assistant. You are helpful, concise, and knowledgeable about crypto, trading, finance, programming, science, history, writing, business, and general knowledge. When the user asks about the current lesson, prioritize explaining that content. Do not provide financial, legal, or tax advice. Do not promise earnings or likely profits. Remind the user to verify local laws and use risk management instead.`,
            },
            {
              role: 'user',
              content: `Current lesson context: ${context}\n\nUser question: ${question}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || null;
    } catch {
      return null;
    }
  }

  function tutLocalAnswer(q, originalQuestion) {
    const { tut, step } = (() => {
      const tut = allTutorials.find(t => t.id === activeTutId);
      const step = tut ? tut.steps[activeTutStep] : null;
      return { tut, step };
    })();

    // Lesson-specific routing
    if (tutContainsAny(q, ['what is', 'explain', 'define', 'meaning'])) {
      if (step) return `<p>Great question! This step covers <strong>${step.title}</strong>. ${tutStripHtml(step.html).split('. ').slice(0,2).join('. ')}.</p><p>Would you like me to go deeper on any part?</p>`;
    }

    // Crypto & DeFi
    if (tutContainsAny(q, ['bitcoin', 'btc'])) {
      return '<p><strong>Bitcoin</strong> is the first cryptocurrency, a decentralized digital money secured by proof-of-work. It has a fixed supply of 21 million and is often called digital gold.</p>';
    }
    if (tutContainsAny(q, ['ethereum', 'eth'])) {
      return '<p><strong>Ethereum</strong> is a programmable blockchain that supports smart contracts and decentralized apps. ETH is used to pay for transactions and secure the network.</p>';
    }
    if (tutContainsAny(q, ['defi', 'decentralized finance'])) {
      return '<p><strong>DeFi</strong> recreates financial services like lending, borrowing, and exchanges using smart contracts instead of banks. Popular protocols include Uniswap, Aave, and Compound.</p>';
    }

    // Trading & risk
    if (tutContainsAny(q, ['dca', 'dollar cost averaging'])) {
      return '<p><strong>DCA</strong> means investing a fixed amount regularly, regardless of price. It reduces timing risk. In Juzzy, the One Invest feature splits your amount into 24 hourly buys.</p>';
    }
    if (tutContainsAny(q, ['stop loss', 'stop-loss'])) {
      return '<p>A <strong>stop loss</strong> is a pre-set price to sell an asset to limit downside. For example, a 10% stop on $100 ETH sells at $90 to prevent larger losses.</p>';
    }
    if (tutContainsAny(q, ['slippage'])) {
      return '<p><strong>Slippage</strong> is the difference between expected and actual execution price. It happens on low-liquidity pools or large trades. Juzzy lets you set slippage tolerance in bps.</p>';
    }

    // Wallets & security
    if (tutContainsAny(q, ['wallet', 'metamask', 'phantom'])) {
      return '<p>A <strong>wallet</strong> holds your private keys. MetaMask works for EVM chains like Ethereum and Base; Phantom is for Solana. Never share your seed phrase.</p>';
    }
    if (tutContainsAny(q, ['seed phrase', 'private key'])) {
      return '<p>A <strong>seed phrase</strong> (12–24 words) is your master backup. Anyone with it can steal your funds. Write it on paper and store it securely offline.</p>';
    }

    // Juzzy app help
    if (tutContainsAny(q, ['juzzy', 'this app', 'how do i', 'how to use'])) {
      return '<p>In Juzzy:<br>• <strong>Leaders</strong> — top market movers<br>• <strong>Charts</strong> — price analysis with tools<br>• <strong>Vault</strong> — wallet and trade settings<br>• <strong>Reports</strong> — activity log<br>• <strong>Brain</strong> — AI signals<br>Ask about any specific feature!</p>';
    }

    // Programming & tech
    if (tutContainsAny(q, ['javascript', 'js'])) {
      return '<p><strong>JavaScript</strong> is the language of the web. It\'s used for frontend interactivity, backend Node.js, and smart contracts on some platforms.</p>';
    }
    if (tutContainsAny(q, ['api', 'rest api'])) {
      return '<p>An <strong>API</strong> lets applications talk to each other. REST APIs use HTTP verbs like GET, POST, PUT, DELETE to exchange data, usually as JSON.</p>';
    }

    // Science & general
    if (tutContainsAny(q, ['quantum', 'quantum computing'])) {
      return '<p><strong>Quantum computing</strong> uses quantum bits (qubits) that can be 0, 1, or both. It promises breakthroughs in cryptography, simulation, and optimization.</p>';
    }
    if (tutContainsAny(q, ['blockchain'])) {
      return '<p>A <strong>blockchain</strong> is a distributed ledger where data is stored in sequential blocks linked by cryptography. It\'s immutable and maintained by a network of nodes.</p>';
    }

    // Fallback to lesson content
    if (tut && q.length > 3) {
      const words = q.split(/\s+/).filter(w => w.length > 3);
      const relevant = tut.steps.find(s => {
        const stxt = `${s.title} ${s.html}`.toLowerCase();
        return words.some(w => stxt.includes(w));
      });
      if (relevant) {
        return `<p>Based on this lesson, here's what I know: ${tutStripHtml(relevant.html).split('. ').slice(0,2).join('. ')}.</p><p>Check the <strong>${relevant.title}</strong> step for more.</p>`;
      }
    }

    // General fallback
    return `<p>That's a good question! I can answer about crypto, trading, programming, science, history, writing, business, or the current lesson. Try rephrasing or ask about something like "What is DCA?" or "How do wallets work?"</p>`;
  }

  async function generateTutAnswer(originalQuestion, q) {
    const { tut, step } = (() => {
      const tut = allTutorials.find(t => t.id === activeTutId);
      const step = tut ? tut.steps[activeTutStep] : null;
      return { tut, step };
    })();
    const context = tut ? `Lesson: ${tut.title} (${tut.cat}). Step: ${step ? step.title : 'none'}. Content: ${tutStripHtml(step ? step.html : '')}` : 'No active lesson.';

    // Try online first
    const online = await tutFetchOnlineAnswer(originalQuestion, context);
    if (online) return `<p>${tutEscapeHtml(online)}</p>`;

    // Fallback to local
    return tutLocalAnswer(q, originalQuestion);
  }

  function openTutorialAISettings() {
    const cfg = getTutorialAIConfig();
    openModal({
      title: 'Tutorial AI Settings',
      bodyHtml: `
        <div class="muted small" style="margin-bottom:16px">
          Configure an OpenAI-compatible API endpoint to enable live AI responses. Leave fields empty to use the built-in local knowledge engine.
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label class="muted small">API Endpoint (e.g. https://api.openai.com/v1/chat/completions)</label>
            <input id="tutAiEndpoint" class="input" value="${tutEscapeHtml(cfg.endpoint)}" placeholder="https://api.openai.com/v1/chat/completions" />
          </div>
          <div>
            <label class="muted small">API Key</label>
            <input id="tutAiKey" class="input" type="password" value="${tutEscapeHtml(cfg.apiKey)}" placeholder="sk-..." />
          </div>
          <div>
            <label class="muted small">Model (e.g. gpt-4o-mini, gpt-4o, gpt-3.5-turbo)</label>
            <input id="tutAiModel" class="input" value="${tutEscapeHtml(cfg.model)}" placeholder="gpt-4o-mini" />
          </div>
        </div>
      `,
      primaryText: 'Save',
      secondaryText: 'Cancel',
      onPrimary: () => {
        const endpoint = String(document.getElementById('tutAiEndpoint').value || '').trim();
        const apiKey = String(document.getElementById('tutAiKey').value || '').trim();
        const model = String(document.getElementById('tutAiModel').value || '').trim() || 'gpt-4o-mini';
        localStorage.setItem('juzzy_tutorial_ai_endpoint', endpoint);
        localStorage.setItem('juzzy_tutorial_ai_key', apiKey);
        localStorage.setItem('juzzy_tutorial_ai_model', model);
        if (endpoint && apiKey) {
          tutChatAddMsg('ai', '✅ Live AI configured! I\'ll now use the online endpoint for responses.');
        } else {
          tutChatAddMsg('ai', '⚙️ Settings saved. Using local knowledge engine (no endpoint configured).');
        }
      }
    });
  }

  function extractFirstSentences(html, count) {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, count).join(' ').trim();
  }

  // ── Mode chooser flow ──
  function openTutLesson(id) {
    const tut = allTutorials.find(t => t.id === id);
    if (!tut) return;
    if (isPaidLesson(id) && !canAccessPaidLesson(id)) {
      promptStripeForModule(id);
      return;
    }
    const meta = getLessonMeta(id);
    activeTutId = id;
    activeTutStep = 0;
    rememberLessonReturn();
    updateLearnerProfile((profile) => {
      profile.currentLessonId = id;
      profile.currentStep = 0;
      profile.lastActiveTab = 'tutorial';
      return profile;
    });
    els.tutCatalog.hidden = true;
    els.tutModeChooser.hidden = false;
    els.tutReader.hidden = true;
    els.tutModeTitle.textContent = tut.title;
    els.tutModeDesc.textContent = `Module ${meta.moduleNumber} of ${meta.totalModules} · ${meta.trackTitle} · ${meta.tier}. ${tut.desc}${isPaidLesson(id) ? ' This is a paid pathway module and can be unlocked via Stripe at any time.' : ''} This module opens in a focused lesson window so the user lands straight into the subpage instead of scrolling through the full academy.`;
    tutChatClear();
    initTutorialParticles();
  }

  function startTutLesson(withVoice) {
    tutTtsEnabled = withVoice;
    if (!activeTutId) return;
    if (isPaidLesson(activeTutId) && !canAccessPaidLesson(activeTutId)) {
      promptStripeForModule(activeTutId);
      return;
    }
    els.tutModeChooser.hidden = true;
    els.tutReader.hidden = false;
    if (els.tutModeChooser) els.tutModeChooser.hidden = true;
    if (els.tutReader) els.tutReader.hidden = false;
    closeLessonExternalResource();
    tutTtsUpdateBtn();
    tutChatGreet();
    renderTutStep();
  }

  function closeTutLesson() {
    tutTtsStop();
    closeLessonExternalResource();
    if (els.tutReader) els.tutReader.hidden = true;
    if (els.tutModeChooser) els.tutModeChooser.hidden = true;
    if (els.tutCatalog) els.tutCatalog.hidden = false;
    activeTutId = null;
    activeTutStep = 0;
    renderTutorialCatalog();
  }

  function renderTutStep() {
    const tut = allTutorials.find(t => t.id === activeTutId);
    if (!tut) return;
    const step = tut.steps[activeTutStep];
    if (!step) return;
    const meta = getLessonMeta(tut.id);
    const country = getCountryProfile(state.profile.country);
    const isFinalStep = activeTutStep === tut.steps.length - 1;
    const lessonResourceHtml = isFinalStep && tut.youtubeResource
      ? `<div class="academy-inline-visual academy-lesson-resource"><strong>Supporting video resource:</strong> Finish the in-app lesson first, then use this matched external resource if you want reinforcement.<div style="margin-top:10px"><div><strong>${tut.youtubeResource.title}</strong> · ${tut.youtubeResource.creator}</div><div class="muted small" style="margin-top:6px">${tut.youtubeResource.description || ''}</div><div style="margin-top:12px"><button class="btn primary" data-lesson-action="open-resource" data-lesson-resource-url="${tutEscapeHtml(tut.youtubeResource.url || '')}" data-lesson-resource-label="${tutEscapeHtml(tut.youtubeResource.title || 'Supporting video')}" data-lesson-resource-provider="${tutEscapeHtml(tut.youtubeResource.creator || 'External resource')}">▶ Open supporting video</button></div></div></div>`
      : '';
    if (els.tutTitle) els.tutTitle.textContent = tut.title;
    if (els.tutLessonCat) els.tutLessonCat.textContent = `${tut.cat} · ${meta.trackTitle} · ${meta.tier}`;
    if (els.tutProgressText) els.tutProgressText.textContent = `Step ${activeTutStep + 1} of ${tut.steps.length}`;
    if (els.tutProgressFill) {
      const progress = ((activeTutStep + 1) / tut.steps.length) * 100;
      els.tutProgressFill.style.width = progress + '%';
    }
    if (els.tutBody) {
      els.tutBody.style.animation = 'none';
      void els.tutBody.offsetHeight;
      els.tutBody.style.animation = '';
      els.tutBody.innerHTML = `<div class="academy-module-banner">Module ${meta.moduleNumber} · ${meta.trackTitle} · ${meta.tier}</div><div class="academy-inline-visual"><strong>${country.name} compliance note:</strong> This lesson is educational only. It is not financial, legal, or tax advice, and nothing in Juzzy guarantees profit, income, or investing success. You must verify the laws and requirements of your country before acting.</div>${renderProfessorFaculty()}<div class="academy-lesson-actions"><button class="btn" data-lesson-jump="leaders">Live examples</button><button class="btn" data-lesson-jump="charts">Open charts</button><button class="btn" data-lesson-jump="brain">See AI signals</button><button class="btn" data-lesson-action="ask-ai">Ask AI</button><button class="btn" data-lesson-action="return">Back to module</button>${isPaidLesson(tut.id) && !canAccessPaidLesson(tut.id) ? '<button class="btn primary" data-lesson-action="unlock-module">Unlock via Stripe</button>' : ''}</div>${renderAiLessonTools()}<h3>${step.title}</h3>${sanitizeTutorialHtml(step.html)}${lessonResourceHtml}`;
      bindLessonInteractiveActions();
      bindProfessorFaculty();
      bindAiLessonTools();
    }
    if (els.tutPrev) els.tutPrev.disabled = activeTutStep === 0;
    if (els.tutNext) els.tutNext.textContent = activeTutStep === tut.steps.length - 1 ? 'Finish ✓' : 'Next →';
    if (tutTtsEnabled) tutTtsSpeak(step.title + '. ' + step.html);
  }

  function bindLessonInteractiveActions() {
    if (!els.tutBody) return;
    bindExternalLinksInContainer(els.tutBody);
    Array.from(els.tutBody.querySelectorAll('[data-lesson-jump]')).forEach((el) => {
      el.addEventListener('click', () => {
        rememberLessonReturn();
        setActiveTab(el.getAttribute('data-lesson-jump'));
      });
    });
    Array.from(els.tutBody.querySelectorAll('[data-lesson-action]')).forEach((el) => {
      el.addEventListener('click', () => {
        const action = el.getAttribute('data-lesson-action');
        if (action === 'ask-ai') openGlobalAiDock();
        if (action === 'return') restoreLessonReturn();
        if (action === 'unlock-module' && activeTutId) promptStripeForModule(activeTutId);
        if (action === 'open-resource') {
          const resourceUrl = String(el.getAttribute('data-lesson-resource-url') || '').trim();
          const resourceLabel = String(el.getAttribute('data-lesson-resource-label') || '').trim();
          const resourceProvider = String(el.getAttribute('data-lesson-resource-provider') || '').trim();
          if (resourceUrl) {
            openLessonExternalResource({
              url: resourceUrl,
              label: resourceLabel || 'Lesson Resource',
              provider: resourceProvider || 'External Resource',
            });
          }
        }
      });
    });
    Array.from(els.tutBody.querySelectorAll('[data-lesson-resource-url]')).forEach((el) => {
      if (el.getAttribute('data-lesson-action') === 'open-resource') return;
      el.addEventListener('click', () => {
        const resourceUrl = String(el.getAttribute('data-lesson-resource-url') || '').trim();
        const resourceLabel = String(el.getAttribute('data-lesson-resource-label') || '').trim();
        const resourceProvider = String(el.getAttribute('data-lesson-resource-provider') || '').trim();
        if (!resourceUrl) return;
        openLessonExternalResource({
          url: resourceUrl,
          label: resourceLabel || 'Lesson Resource',
          provider: resourceProvider || 'External Resource',
        });
      });
    });
  }

  function tutStepNav(delta) {
    tutTtsStop();
    const tut = allTutorials.find(t => t.id === activeTutId);
    if (!tut) return;
    if (delta > 0 && activeTutStep === tut.steps.length - 1) {
      setTutCompleted(activeTutId);
      showAchievement('Lesson Complete!', `You've finished "${tut.title}"`, '🎓');
      
      // Check for milestone achievements
      const completedCount = getTutCompleted().size;
      if (completedCount === 1) {
        showAchievement('First Steps!', 'Completed your first tutorial', '🌟');
      } else if (completedCount === 5) {
        showAchievement('Learning Streak!', 'Completed 5 tutorials', '🔥');
      } else if (completedCount === 10) {
        showAchievement('Knowledge Seeker!', 'Completed 10 tutorials', '💎');
      } else if (completedCount === 25) {
        showAchievement('Master Student!', 'Completed 25 tutorials', '👑');
      }
      
      closeTutLesson();
      return;
    }
    activeTutStep = Math.max(0, Math.min(tut.steps.length - 1, activeTutStep + delta));
    rememberLessonReturn();
    updateLearnerProfile((profile) => {
      profile.currentLessonId = activeTutId;
      profile.currentStep = activeTutStep;
      return profile;
    });
    renderTutStep();
  }

  function initEvents() {
    qsAll('.tab').forEach((b) => {
      b.addEventListener('click', () => setActiveTab(b.dataset.tab));
    });

    qsAll('[data-share-platform]').forEach((b) => {
      b.addEventListener('click', () => openSharePlatform(String(b.getAttribute('data-share-platform') || '')));
    });

    qsAll('[data-jump]').forEach((b) => {
      b.addEventListener('click', () => setActiveTab(b.dataset.jump));
    });

    if (els.navHomeBtn) els.navHomeBtn.addEventListener('click', () => setActiveTab('home'));

    if (els.globalAiToggle) els.globalAiToggle.addEventListener('click', openGlobalAiDock);
    if (els.globalAiClose) els.globalAiClose.addEventListener('click', closeGlobalAiDock);
    if (els.globalAiSpeak) els.globalAiSpeak.addEventListener('click', toggleGlobalAiVoice);
    if (els.globalAiMic) els.globalAiMic.addEventListener('click', startGlobalAiListening);
    if (els.globalAiSend) els.globalAiSend.addEventListener('click', () => {
      const q = String(els.globalAiInput?.value || '').trim();
      if (!q) return;
      els.globalAiInput.value = '';
      void globalAiAnswer(q);
    });
    if (els.globalAiInput) els.globalAiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = String(els.globalAiInput.value || '').trim();
        if (!q) return;
        els.globalAiInput.value = '';
        void globalAiAnswer(q);
      }
    });
    if (els.returnToLessonBtn) els.returnToLessonBtn.addEventListener('click', restoreLessonReturn);
    if (els.messagesSendBtn) els.messagesSendBtn.addEventListener('click', sendMessageToAiInbox);
    if (els.messagesNewThreadBtn) els.messagesNewThreadBtn.addEventListener('click', createNewMessageThread);
    if (els.communityAvatarSaveBtn) els.communityAvatarSaveBtn.addEventListener('click', saveCommunityAvatarFromInputs);
    if (els.ideaFeedbackSubmit) els.ideaFeedbackSubmit.addEventListener('click', reviewIdeaFeedback);
    if (els.ideaFeedbackClear) els.ideaFeedbackClear.addEventListener('click', clearIdeaFeedback);
    if (els.registerReferralBtn) els.registerReferralBtn.addEventListener('click', registerReferral);
    if (els.claimIdeaRewardBtn) els.claimIdeaRewardBtn.addEventListener('click', claimIdeaReward);
    if (els.shareCopyInviteBtn) els.shareCopyInviteBtn.addEventListener('click', () => { void copyTextValue(buildInviteLink('starter'), 'Starter invite copied'); });
    if (els.shareFamilyPassBtn) els.shareFamilyPassBtn.addEventListener('click', () => { void copyTextValue(buildShareCopy('family'), 'Family share message ready'); });
    if (els.shareOpenOwnerAccessBtn) els.shareOpenOwnerAccessBtn.addEventListener('click', () => setActiveTab(isOwnerApprover() ? 'owner-access' : 'share'));
    if (els.ownerGrantLifetimeBtn) els.ownerGrantLifetimeBtn.addEventListener('click', grantOwnerLifetimeAccess);
    if (els.ownerFamilyShareBtn) els.ownerFamilyShareBtn.addEventListener('click', createOwnerFamilyShareInvite);
    if (els.ideaFeedbackInput) els.ideaFeedbackInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        reviewIdeaFeedback();
      }
    });
    if (els.messagesComposer) els.messagesComposer.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessageToAiInbox();
      }
    });

    if (els.openSettingsBtn) els.openSettingsBtn.addEventListener('click', () => setActiveTab('settings'));

    if (els.authCountry) {
      els.authCountry.addEventListener('change', () => {
        state.profile.country = String(els.authCountry.value || 'US').toUpperCase();
        renderCountryLegal();
      });
    }

    if (els.settingsCountry) {
      els.settingsCountry.addEventListener('change', () => {
        state.profile.country = String(els.settingsCountry.value || 'US').toUpperCase();
        renderCountryLegal();
      });
    }

    if (els.authLanguage) {
      els.authLanguage.addEventListener('change', () => {
        if (els.authLanguage.value !== 'custom' && els.authLanguageCustom) els.authLanguageCustom.value = '';
      });
    }

    if (els.settingsLanguage) {
      els.settingsLanguage.addEventListener('change', () => {
        if (els.settingsLanguage.value !== 'custom' && els.settingsLanguageCustom) els.settingsLanguageCustom.value = '';
      });
    }

    if (els.authSignInBtn) els.authSignInBtn.addEventListener('click', signInProfile);
    if (els.authSignInGoogleBtn) els.authSignInGoogleBtn.addEventListener('click', () => socialSignUp('google'));
    if (els.authSignInAppleBtn) els.authSignInAppleBtn.addEventListener('click', () => socialSignUp('apple'));
    if (els.authGoogleBtn) els.authGoogleBtn.addEventListener('click', () => socialSignUp('google'));
    if (els.authAppleBtn) els.authAppleBtn.addEventListener('click', () => socialSignUp('apple'));
    if (els.authSkipBtn) els.authSkipBtn.addEventListener('click', skipAuthAndEnter);
    if (els.authSignUpBtn) els.authSignUpBtn.addEventListener('click', signUpProfile);
    if (els.authSignOutBtn) els.authSignOutBtn.addEventListener('click', signOutProfile);
    if (els.saveSettingsBtn) els.saveSettingsBtn.addEventListener('click', applySettingsProfile);
    if (els.authUseStripeBtn) els.authUseStripeBtn.addEventListener('click', startSubscriptionCheckout);
    if (els.installAppBtn) els.installAppBtn.addEventListener('click', () => { void promptDesktopInstall(); });
    if (els.downloadDesktopBtn) els.downloadDesktopBtn.addEventListener('click', downloadDesktopShortcut);
    if (els.portfolioConnectWallet) els.portfolioConnectWallet.addEventListener('click', connectWalletMock);
    if (els.portfolioSubscribe) els.portfolioSubscribe.addEventListener('click', startSubscriptionCheckout);
    if (els.checkYoutubeLinksBtn) els.checkYoutubeLinksBtn.addEventListener('click', validateYouTubeLinks);
    if (els.openYoutubePlaylistBtn) {
      els.openYoutubePlaylistBtn.addEventListener('click', () => {
        const first = findTutorialYouTubeLinks()[0];
        if (first?.url) {
          openExternalResourceInApp({
            url: first.url,
            label: first.title || 'Tutorial Playlist Resource',
            provider: first.creator || 'External Resource',
          });
        }
      });
    }

    els.email.addEventListener('input', () => {
      state.user.email = String(els.email.value || '').trim();
      localStorage.setItem('pos_email', state.user.email);
      // refresh billing state when email changes
      state.user.lastBillingFetchAt = 0;
      fetchBillingStatus();
    });

    if (FEATURES.simpleMode && els.simpleModeBtn) {
      els.simpleModeBtn.addEventListener('click', () => setSimpleMode(!state.ui.simpleMode));
    }

    if (FEATURES.simpleMode && els.simpleSubscribe) {
      els.simpleSubscribe.addEventListener('click', () => els.subscribeBtn.click());
      els.simplePay.addEventListener('click', () => els.payTradeFee.click());
      els.simpleStart.addEventListener('click', () => els.oneInvest.click());
      els.simpleStop.addEventListener('click', () => els.stopAuto.click());
    }

    els.fuel.addEventListener('input', () => {
      els.fuelValue.textContent = String(els.fuel.value);
      // Changing the amount invalidates the previously paid upfront fee.
      setAutoUi();
    });

    [els.gateRisk, els.gateFee, els.gateTime].forEach((c) => {
      c.addEventListener('change', setAutoUi);
    });

    els.connectBtn.addEventListener('click', connectWalletMock);
    els.oneInvest.addEventListener('click', startAutopilot);
    els.stopAuto.addEventListener('click', stopAutopilot);
    els.subscribeBtn.addEventListener('click', startSubscriptionCheckout);
    els.payTradeFee.addEventListener('click', async () => {
      const notional = Number(els.fuel.value || 0);
      const fee = notional * 0.01;
      openModal({
        title: 'Pay upfront 1% service fee',
        bodyHtml: `
          <div class="muted">Agreed total amount: <strong>$${formatMoney(notional)}</strong></div>
          <div class="muted">Upfront fee (1%): <strong>$${formatMoney(fee)}</strong></div>
          <div class="muted small" style="margin-top:10px">You will be redirected to Stripe Checkout. After success, One Invest unlocks for this exact amount.</div>
        `,
        primaryText: 'Continue to Stripe',
        secondaryText: 'Cancel',
        onPrimary: async () => {
          const email = getEmail();
          if (!validateEmail(email)) {
            openModal({
              title: 'Enter your email',
              bodyHtml: '<div class="muted">Please type your email in the top bar first.</div>',
              primaryText: 'OK',
              secondaryText: 'Close',
            });
            return;
          }

          localStorage.setItem('pos_pending_upfront_total', String(notional));
          localStorage.setItem('pos_pending_upfront_fee', String(fee));
          const payload = await postJson('/api/stripe/upfront-fee', { totalAmount: notional, email });
          if (payload?.url) window.location.href = payload.url;
        },
      });
    });

    els.brainToggle.addEventListener('click', () => {
      state.brainPaused = !state.brainPaused;
      els.brainToggle.textContent = state.brainPaused ? 'Resume stream' : 'Pause stream';
      appendTerminal('INFO', state.brainPaused ? 'Stream paused.' : 'Stream resumed.');
    });

    if (els.leadersModeGainers) {
      els.leadersModeGainers.addEventListener('click', () => setLeadersMode('gainers'));
      els.leadersModeLosers.addEventListener('click', () => setLeadersMode('losers'));
    }

    if (FEATURES.charts && els.chartRefresh) {
      els.chartRefresh.addEventListener('click', refreshChart);
      if (els.chartAsset) els.chartAsset.addEventListener('change', refreshChart);
      if (els.chartTf) els.chartTf.addEventListener('change', refreshChart);
      window.addEventListener('resize', () => initOrResizeChart());

      if (els.chartSearch) els.chartSearch.addEventListener('input', populateChartAssetOptions);
      if (els.chartFilterAll) {
        els.chartFilterAll.addEventListener('click', () => setChartFilter('all'));
        els.chartFilterGains.addEventListener('click', () => setChartFilter('gains'));
        els.chartFilterFalls.addEventListener('click', () => setChartFilter('falls'));
        els.chartFilterBirths.addEventListener('click', () => setChartFilter('births'));
        if (els.chartFilterSandbox) els.chartFilterSandbox.addEventListener('click', () => setChartFilter('sandbox'));
      }

      if (els.chartAddLine) {
        els.chartAddLine.addEventListener('click', () => {
          const k = String(els.chartAsset?.value || state.charts.lastAsset || '');
          if (!k) return;
          const it = state.market.universe.get(k);
          const cur = Number(it?.priceUsd);
          const def = Number.isFinite(cur) ? String(cur) : '';
          const raw = window.prompt('Add resistance line price (USD):', def);
          if (raw == null) return;
          const price = Number(String(raw).trim());
          if (!Number.isFinite(price) || price <= 0) return;

          let saved = [];
          try {
            saved = JSON.parse(localStorage.getItem(`juzzy_chart_lines_${k}`) || '[]');
          } catch {
            saved = [];
          }
          if (!Array.isArray(saved)) saved = [];
          saved.push(price);
          saved = Array.from(new Set(saved.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0)));
          saved.sort((a, b) => a - b);
          try {
            localStorage.setItem(`juzzy_chart_lines_${k}`, JSON.stringify(saved));
          } catch {
            // ignore
          }
          restoreChartPriceLines(k);
        });
      }

      if (els.chartClearLines) {
        els.chartClearLines.addEventListener('click', () => {
          const k = String(els.chartAsset?.value || state.charts.lastAsset || '');
          if (!k) return;
          clearChartPriceLines(k);
        });
      }
    }

    els.exportBtn.addEventListener('click', exportReportsCsv);

    els.reportSearch.addEventListener('input', () => {
      resetReportsRender();
    });

    if (els.reportsNewBtn) {
      els.reportsNewBtn.addEventListener('click', () => {
        state.reportsNewPending = 0;
        updateReportsNewIndicator();
        if (els.reportsList) els.reportsList.scrollTop = 0;
        resetReportsRender();
      });
    }

    els.reportsList.addEventListener('scroll', () => {
      const nearBottom = els.reportsList.scrollTop + els.reportsList.clientHeight >= els.reportsList.scrollHeight - 120;
      if (nearBottom) renderMoreReports(30);

      if (isNearTop(els.reportsList) && state.reportsNewPending > 0) {
        state.reportsNewPending = 0;
        updateReportsNewIndicator();
      }
    });

    // Tutorial events
    if (els.tutCat) els.tutCat.addEventListener('change', () => {
      tutState.cat = els.tutCat.value;
      renderTutorialCatalog();
    });
    if (els.tutSearch) els.tutSearch.addEventListener('input', () => {
      tutState.search = els.tutSearch.value;
      renderTutorialCatalog();
    });
    if (els.tutPrev) els.tutPrev.addEventListener('click', () => tutStepNav(-1));
    if (els.tutNext) els.tutNext.addEventListener('click', () => tutStepNav(1));
    if (els.tutModeQuick) els.tutModeQuick.addEventListener('click', () => startTutLesson(false));
    if (els.tutModeDeep) els.tutModeDeep.addEventListener('click', () => startTutLesson(true));
    if (els.tutExternalOpenNew) els.tutExternalOpenNew.addEventListener('click', openActiveLessonResourceInNewTab);
    if (els.tutExternalReturn) els.tutExternalReturn.addEventListener('click', restoreLessonReturn);
    if (els.tutTtsToggle) els.tutTtsToggle.addEventListener('click', () => {
      tutTtsEnabled = !tutTtsEnabled;
      tutTtsUpdateBtn();
      if (tutTtsEnabled) {
        const tut = allTutorials.find(t => t.id === activeTutId);
        const step = tut ? tut.steps[activeTutStep] : null;
        if (step) tutTtsSpeak(step.title + '. ' + step.html);
      } else {
        tutTtsStop();
      }
    });
    document.addEventListener('click', (event) => {
      const externalLink = event.target instanceof Element ? event.target.closest('a[href^="http://"], a[href^="https://"], [data-in-app-link="true"]') : null;
      if (!externalLink) return;
      const href = String(externalLink.getAttribute('href') || '').trim();
      if (!href) return;
      if (externalLink.hasAttribute('data-lesson-resource-url')) return;
      if (externalLink.closest('#modalBody') && externalLink.tagName === 'A') return;
      event.preventDefault();
      openExternalResourceInApp({
        url: href,
        label: String(externalLink.getAttribute('data-in-app-label') || externalLink.textContent || 'External Resource').trim(),
        provider: String(externalLink.getAttribute('data-in-app-provider') || 'External Resource').trim(),
      });
    });
    if (els.tutChatSend) els.tutChatSend.addEventListener('click', () => {
      const q = String(els.tutChatInput?.value || '').trim();
      if (!q) return;
      els.tutChatInput.value = '';
      tutAIAnswer(q);
    });
    if (els.tutAiSettings) els.tutAiSettings.addEventListener('click', openTutorialAISettings);
    if (els.tutChatInput) els.tutChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = String(els.tutChatInput.value || '').trim();
        if (!q) return;
        els.tutChatInput.value = '';
        tutAIAnswer(q);
      }
    });

    window.addEventListener('message', (event) => {
      const payload = event?.data;
      if (!payload || typeof payload !== 'object') return;
      if (payload.type === 'juzzy-simulator-nav') {
        const tabId = String(payload.tabId || '').trim();
        if (!tabId) return;
        setActiveTab(tabId);
        return;
      }
      if (payload.type === 'juzzy-open-resource') {
        const url = String(payload.url || '').trim();
        if (!url) return;
        openExternalResourceInApp({
          url,
          label: String(payload.label || 'External Resource').trim(),
          provider: String(payload.provider || 'External Resource').trim(),
        });
      }
    });
    if (els.backBtn) els.backBtn.addEventListener('click', navigateHistory);
    if (els.globalAiToggle) els.globalAiToggle.addEventListener('click', toggleGlobalAiDock);

    els.opsForceSnapshot.addEventListener('click', async () => {
      appendTerminal('INFO', 'OPS: Forcing market snapshot refresh…');
      emitAudit('OPS_FORCE_SNAPSHOT', {}, 'INFO');
      await loadMarketSnapshotOnce();
      renderOps();
    });

    if (els.opsReconnect) {
      els.opsReconnect.addEventListener('click', () => {
        appendTerminal('INFO', 'OPS: Reconnecting SSE streams…');
        emitAudit('OPS_RECONNECT_STREAMS', {}, 'INFO');
        connectMarketStream();
        connectAuditStream();
        renderOps();
      });
    }

    els.addFunds.addEventListener('click', () => {
      openModal({ title: 'Add funds', bodyHtml: '<div class="muted">Non-custodial: this will deep-link to a wallet on-ramp in V2.</div>', primaryText: 'OK', secondaryText: 'Close' });
    });
    els.withdrawFunds.addEventListener('click', () => {
      openModal({ title: 'Withdraw', bodyHtml: '<div class="muted">Non-custodial: withdrawals happen from your wallet/exchange. V2 will deep-link to your wallet.</div>', primaryText: 'OK', secondaryText: 'Close' });
    });

    if (els.vaultNetwork) {
      els.vaultNetwork.addEventListener('change', () => {
        saveVaultNetwork(String(els.vaultNetwork.value || 'solana'));
      });
    }

    if (els.vaultConnect) {
      els.vaultConnect.addEventListener('click', async () => {
        try {
          if (String(state.vault.network) !== 'evm') {
            openModal({ title: 'Connect wallet', bodyHtml: '<div class="muted">EVM wallet connect uses MetaMask. Switch Execution network to EVM to connect.</div>', primaryText: 'OK', secondaryText: 'Close' });
            return;
          }
          await connectEvmWallet();
          await ensureBaseChain();
          openModal({ title: 'Wallet connected', bodyHtml: `<div class="muted">Connected: <strong>${shortAddr(state.walletAddress)}</strong> on Base.</div>`, primaryText: 'OK', secondaryText: 'Close' });
        } catch (e) {
          openModal({ title: 'Wallet connect failed', bodyHtml: `<div class="muted">${String(e?.message || e)}</div>`, primaryText: 'OK', secondaryText: 'Close' });
        }
      });
    }

    if (els.vaultArm) els.vaultArm.addEventListener('change', saveVaultRiskPrefs);
    if (els.vaultMaxUsd) els.vaultMaxUsd.addEventListener('change', saveVaultRiskPrefs);
    if (els.vaultSlippage) els.vaultSlippage.addEventListener('change', saveVaultRiskPrefs);
  }

  function heartbeatTick() {
    state.heartbeat += 1;
    els.hbMs.textContent = String(HEARTBEAT_MS);
    autopilotUpdate();
    paperBankingTick();

    if (state.heartbeat % 6 === 0) {
      computeBrainSignalsFromSnapshot();
    }

    if (state.heartbeat % 8 === 0) {
      fetchLeaders();
    }

    if (state.autopilot.active && state.heartbeat % 12 === 0) {
      const drift = (Math.random() - 0.45) * 0.55;
      state.pnl += drift;
      els.kpiPnl.textContent = `$${formatMoney(state.pnl)}`;
    }
  }

  function startLiveFallbackLoop() {
    window.setInterval(() => {
      if (!state.market.connected) void loadMarketSnapshotOnce();
    }, 6000);

    window.setInterval(() => {
      if (document.querySelector('#tab-ops.panel.active')) renderOps();
      if (document.querySelector('#tab-leaders.panel.active')) renderLeaders();
      if (document.querySelector('#tab-charts.panel.active')) {
        const k = String(els.chartAsset?.value || '');
        if (k) {
          const cur = state.market.universe.get(k);
          if (cur && Number.isFinite(Number(cur.priceUsd))) upsertLivePoint(k, cur.priceUsd);
        }
        refreshChart();
      }
    }, 4500);
  }

  function handleStripeReturn() {
    const params = new URLSearchParams(window.location.search);
    const stripeState = params.get('stripe');
    const flow = params.get('flow');
    if (!stripeState) return;

    if (stripeState === 'success') {
      if (flow === 'subscribe') {
        // Server webhook is the source of truth. This is just UX feedback.
        appendTerminal('BILL', 'Subscription active.');
        state.reports.unshift({
          id: `B-${String(Date.now())}`,
          asset: 'USD',
          status: 'SUBSCRIPTION_ACTIVE',
          notional: 0,
          fee: 0,
          ts: Date.now(),
          detail: { safeguards: 1000, reason: 'Stripe subscription activated.' },
        });
        resetReportsRender();
      }

      if (flow === 'upfront') {
        const totalRaw = localStorage.getItem('pos_pending_upfront_total');
        const feeRaw = localStorage.getItem('pos_pending_upfront_fee');
        const total = totalRaw != null ? Number(totalRaw) : 0;
        const fee = feeRaw != null ? Number(feeRaw) : 0;
        if (Number.isFinite(total) && total > 0) appendTerminal('BILL', `Upfront fee paid for total $${formatMoney(total)}.`);

        state.reports.unshift({
          id: `B-${String(Date.now())}`,
          asset: 'USD',
          status: 'UPFRONT_FEE_PAID',
          notional: Number.isFinite(total) ? total : 0,
          fee: Number.isFinite(fee) ? fee : 0,
          ts: Date.now(),
          detail: { safeguards: 1000, reason: 'Upfront 1% service fee paid via Stripe.' },
        });
        resetReportsRender();

        localStorage.removeItem('pos_pending_upfront_total');
        localStorage.removeItem('pos_pending_upfront_fee');
      }

      if (flow === 'trade') {
        const tradeRaw = localStorage.getItem('pos_pending_trade_notional');
        const feeRaw = localStorage.getItem('pos_pending_trade_fee');
        const tradeNotional = tradeRaw != null ? Number(tradeRaw) : 0;
        const fee = feeRaw != null ? Number(feeRaw) : 0;
        if (Number.isFinite(tradeNotional) && tradeNotional > 0) {
          appendTerminal('BILL', `Per-trade fee paid for trade $${formatMoney(tradeNotional)}.`);
        }

        state.reports.unshift({
          id: `B-${String(Date.now())}`,
          asset: 'USD',
          status: 'TRADE_FEE_PAID',
          notional: Number.isFinite(tradeNotional) ? tradeNotional : 0,
          fee: Number.isFinite(fee) ? fee : 0,
          ts: Date.now(),
          detail: { safeguards: 1000, reason: 'Per-trade 1% service fee paid via Stripe.' },
        });
        resetReportsRender();

        localStorage.removeItem('pos_pending_trade_notional');
        localStorage.removeItem('pos_pending_trade_fee');
      }
    }

    // Refresh server-side billing state after returning from Stripe.
    state.user.lastBillingFetchAt = 0;
    fetchBillingStatus();

    // Clean URL.
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  function wireUi() {
    document.title = 'Juzzy: wireUi START';
    console.log('[BOOT] wireUi() called');
    installWindowOpenInterceptor();
    setActiveTab('oracle');
    loadProfile();
    populateCountryOptions();
    populateLanguageOptions();
    initPromptSecurityHardening();
    els.fuelValue.textContent = String(els.fuel.value);
    setStatus('Idle');
    appendTerminal('INFO', 'Dashboard loaded.');
    appendTerminal('INFO', 'This is a scaffold. No profit guarantees.');
    loadVaultPrefs();
    wireGlobalErrorHandlers();
    updatePaperKpis();

    // Always wire interactions first so the app never becomes a non-clickable shell
    // if a network call or stream setup throws.
    try {
      initEvents();
      document.title = 'Juzzy: events WIRED';
      console.log('[BOOT] initEvents() succeeded');
    } catch (e) {
      document.title = 'Juzzy: initEvents CRASHED - ' + String(e?.message || e);
      console.error('[BOOT] initEvents CRASHED', e);
      appendTerminal('ERR', `UI init failed: ${String(e?.message || e)}`);
    }

    const safe = (label, fn) => {
      try {
        const out = fn();
        return out;
      } catch (e) {
        appendTerminal('ERR', `${label} failed: ${String(e?.message || e)}`);
        emitAudit('BOOT_ERR', { label, error: String(e?.message || e) }, 'ERR');
        return null;
      }
    };

    safe('connectMarketStream', () => connectMarketStream());
    safe('connectAuditStream', () => connectAuditStream());
    safe('loadMarketSnapshotOnce', () => void loadMarketSnapshotOnce());
    safe('startLiveFallbackLoop', () => startLiveFallbackLoop());

    state.user.email = localStorage.getItem('pos_email') || '';
    els.email.value = state.user.email;

    setSimpleMode(localStorage.getItem('pos_simple_mode') === '1');

    setAutoUi();
    renderProfileUi();
    renderPortfolio();
    validateYouTubeLinks();

    safe('seedReports', () => seedReports());
    safe('loadMessageCenter', () => loadMessageCenter());
    safe('resetReportsRender', () => resetReportsRender());
    safe('renderAcademyHub', () => renderAcademyHub());
    safe('initTutCategoryOptions', () => initTutCategoryOptions());
    safe('renderTutorialCatalog', () => renderTutorialCatalog());
    safe('updateMessagesUnreadBadge', () => updateMessagesUnreadBadge());
    safe('renderMessageCenter', () => renderMessageCenter());
    safe('renderOwnerRefundQueue', () => renderOwnerRefundQueue());
    safe('renderCommunity', () => renderCommunity());
    safe('setupGlobalAiVoiceInput', () => setupGlobalAiVoiceInput());
    safe('fetchLeaders', () => fetchLeaders());

    safe('handleStripeReturn', () => handleStripeReturn());
    safe('fetchBillingStatus', () => fetchBillingStatus());

    if (FEATURES.charts) {
      initOrResizeChart();
      refreshChart();
    }

    // Set home as default tab for educational focus
    setActiveTab('home');
    safe('applySharedEntryContext', () => applySharedEntryContext());

    window.setInterval(heartbeatTick, HEARTBEAT_MS);
  }

  try {
    wireUi();
    document.title = 'Juzzy: READY';
    console.log('[BOOT] wireUi() completed');
  } catch(e) {
    document.title = 'Juzzy: wireUi CRASHED - ' + String(e?.message || e);
    console.error('[BOOT] wireUi CRASHED', e);
  }
  
  // FORCE REMOVE AI ELEMENTS - FIX BOTH ISSUES
  function removeAIElements() {
    const aiSelectors = [
      '.global-ai',
      '.ai-assistant',
      '.juzzy-ai',
      '.ai-chat',
      '.ai-popup',
      '.ai-assistant-btn',
      '.ai-box',
      '.chat-widget',
      '.floating-ai',
      '[class*="ai-assistant"]',
      '[class*="global-ai"]',
      '[class*="juzzy-ai"]',
      '[id*="ai-assistant"]',
      '[id*="globalAi"]',
      '[id*="juzzyAi"]',
      '[id*="globalAi"]'
    ];
    
    aiSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.top = '-9999px';
        el.style.width = '0';
        el.style.height = '0';
        el.style.overflow = 'hidden';
      });
    });
  }

  // Fix margin issues
  function fixMargins() {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.left = '0';
    document.body.style.right = '0';
    
    const containers = document.querySelectorAll('.app, .container, .main, .content, .wrapper, .layout');
    containers.forEach(container => {
      container.style.margin = '0';
      container.style.padding = '0';
      container.style.width = '100%';
      container.style.maxWidth = '100%';
      container.style.left = '0';
      container.style.right = '0';
    });
  }

  // Run fixes immediately and continuously
  removeAIElements();
  fixMargins();
  
  // Keep removing AI elements every 500ms
  setInterval(() => {
    removeAIElements();
    fixMargins();
  }, 500);
  
  console.log('🔧 AI BOX REMOVED - MARGIN ISSUES FIXED');
})();
