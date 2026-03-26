(() => {
  document.title = 'Juzzy: IIFE entered';
  console.log('[BOOT] IIFE entered');
  const HEARTBEAT_MS = 444;
  const COINGECKO_IDS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'cardano', 'dogecoin', 'polygon', 'chainlink', 'uniswap', 'litecoin'];

  const FEATURES = {
    charts: true,
    simpleMode: true,
  };
  const COMMUNITY_MEMBER_TARGET = 5824;

  function defaultCommunityAvatar() {
    return {
      name: state.profile.name || 'Campus Explorer',
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
      'Token universe module is wild, finally seeing how narratives rotate across sectors.',
      'Anyone else using the chart tools right after the lesson hotspots? Makes the course stick better.',
      'Builder track plus AI professor Nova is making DeFi way less intimidating.',
      'Big chatter today around ETF flows, memecoin risk, and whether influencers are front-running attention.',
      'Creator economy lessons are surprisingly strong. Tokenized media models feel more real after the labs.',
      'Exchange legitimacy path should honestly be required before anybody touches a deposit button.',
      'Community note: this campus feed is AI-simulated, but the market topics are still useful to explore.',
      'Seeing random talk about Solana, Base, AI agents, and whether macro liquidity is the real driver again.',
      'Influencer chatter never stops. Half the lesson is learning how not to get manipulated by it.',
      'Risk professor Sol is ruthless in the best way possible. Every hype cycle needs that energy.',
    ];
    const members = generateCommunityMembers();
    state.community.posts = Array.from({ length: 48 }, (_, idx) => {
      const member = members[(idx * 17) % members.length];
      return {
        id: `community-post-${idx + 1}`,
        memberId: member.id,
        body: topics[idx % topics.length],
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
        return `<div class="community-post-card"><div class="community-post-head">${makeAvatarMarkup(member.name, member.mood, member.palette)}<div><div class="community-post-name">${member.name}</div><div class="community-post-meta">${member.role} · ${member.address} · ${post.topic}</div></div></div><div class="community-post-body">${post.body}</div><div class="community-post-links"><button class="academy-hotspot" data-community-profile="${member.id}">Open profile</button><span class="muted small">${post.likes} likes · ${post.replies} replies</span></div></div>`;
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
      els.communityUserAvatarPreview.innerHTML = `${makeAvatarMarkup(avatar.name, avatar.mood, avatar.palette, true)}<div class="community-user-meta"><div class="community-post-name">${avatar.name}</div><div class="community-post-meta">Your customizable campus identity</div></div>`;
    }
    if (els.communityAvatarName) els.communityAvatarName.value = avatar.name;
    if (els.communityAvatarMood) els.communityAvatarMood.value = avatar.mood;
    if (els.communityAvatarPalette) els.communityAvatarPalette.value = avatar.palette;
  }

  function renderCommunityProfileCard(memberId) {
    const member = generateCommunityMembers().find((item) => item.id === memberId);
    if (!member || !els.communityProfiles) return;
    els.communityProfiles.innerHTML = `<div class="community-profile-expanded">${makeAvatarMarkup(member.name, member.mood, member.palette, true)}<div class="community-post-name">${member.name}</div><div class="community-post-meta">${member.role}</div><div class="community-profile-copy">This is an AI-simulated campus member profile used to create immersive community chatter inside Juzzy.</div><div class="community-post-meta">${member.address}</div></div>`;
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
    simpleModeBtn: document.getElementById('simpleModeBtn'),
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
  const AI_GUIDE_NAME = 'Mira — Juzzy AI Guide';
  const AI_GUIDE_ADDRESS = 'guide@juzzy.internal.ai';
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
    const visible = isOwnerApprover();
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
          <div class="messages-thread-subject">${thread.subject}</div>
          <div class="messages-thread-meta">${thread.unread ? 'New reply' : 'Open thread'} · ${thread.category || 'learning'} · ${new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
          <div class="messages-bubble-head">${message.senderName} · ${message.senderAddress}</div>
          <div>${message.body}</div>
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
        'I checked the billing help path. Review your subscription status, upfront fee state, and learning access buttons inside the app before retrying. You can also generate a refund request here for owner review if needed.',
        'For access and billing guidance, check your email field, subscription state, and package eligibility inside Juzzy first. If you need a refund request, use the refund button in this inbox.',
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
    return `${options[Math.floor(Math.random() * options.length)]} Your message was: ${String(userText || '').trim()}`;
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

  function signInProfile() {
    const email = String(els.authSignInEmail?.value || '').trim();
    const password = String(els.authSignInPassword?.value || '').trim();
    const country = String(els.authCountry?.value || '').toUpperCase();
    const language = String(els.authLanguage?.value || state.profile.language || 'en').trim();
    const languageCustom = String(els.authLanguageCustom?.value || '').trim();
    if (!validateEmail(email)) {
      appendTerminal('WARN', 'Sign-in requires a valid email.');
      return;
    }
    if (password.length < 4) {
      appendTerminal('WARN', 'Sign-in requires a password.');
      return;
    }
    if (!country) {
      appendTerminal('WARN', 'Please select your country before using Juzzy.');
      return;
    }
    if (!els.authLegalAgree?.checked) {
      appendTerminal('WARN', 'Please accept your country legal requirements before signing in.');
      return;
    }
    const fallbackName = state.profile.name || email.split('@')[0] || 'User';
    saveAuthProfile({
      name: fallbackName,
      email,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      loggedIn: true,
    });
    appendTerminal('AUTH', `Signed in as ${email}.`);
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
      return;
    }
    if (!validateEmail(email)) {
      appendTerminal('WARN', 'Create account requires a valid email.');
      return;
    }
    if (password.length < 6) {
      appendTerminal('WARN', 'Create account requires a password with at least 6 characters.');
      return;
    }
    if (!country) {
      appendTerminal('WARN', 'Please select your country before using Juzzy.');
      return;
    }
    if (!els.authLegalAgree?.checked) {
      appendTerminal('WARN', 'Please accept your country legal requirements to continue.');
      return;
    }
    saveAuthProfile({
      name,
      email,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      loggedIn: true,
    });
    appendTerminal('AUTH', `Account ready for ${email}.`);
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
      return;
    }
    if (!els.authLegalAgree?.checked) {
      appendTerminal('WARN', `Please accept your country legal requirements before continuing with ${source}.`);
      return;
    }
    saveAuthProfile({
      name: String(els.authName?.value || '').trim() || fallbackName,
      email,
      country,
      language: language === 'custom' ? 'custom' : language,
      languageCustom,
      loggedIn: true,
    });
    appendTerminal('AUTH', `${source} quick signup ready.`);
    setActiveTab('portfolio');
  }

  function signOutProfile() {
    state.profile.loggedIn = false;
    state.profile.legalAccepted = false;
    saveProfile();
    renderProfileUi();
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
    if (els.userIdentityPill) {
      els.userIdentityPill.textContent = state.profile.loggedIn
        ? `${state.profile.name || state.user.email || 'User'} • ${country.code}`
        : 'Guest';
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

  function setActiveTab(tabId) {
    qsAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    qsAll('.panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));
    if (tabId === 'learn' || tabId === 'tutorial') {
      renderAcademyHub();
      initTutCategoryOptions();
      renderTutorialCatalog();
      // Initialize particles when tutorial tab opens
      if (tabId === 'tutorial') {
        initTutorialParticles();
      }
    }
    if (tabId === 'charts') {
      if (!state.charts.initialized) {
        initOrResizeChart();
        state.charts.initialized = true;
      }
    }
    if (tabId === 'leaders') {
      renderLeaders();
    }

    if (tabId === 'reports') {
      resetReportsRender();
    }

    if (tabId === 'ops') {
      renderOps();
    }

    if (tabId === 'messages') {
      state.messages.unreadCount = 0;
      state.messages.threads.forEach((thread) => { thread.unread = false; });
      saveMessageCenter();
      updateMessagesUnreadBadge();
      renderMessageCenter();
      renderOwnerRefundQueue();
    }

    if (tabId === 'community') {
      renderCommunity();
    }

    if (tabId === 'portfolio' || tabId === 'settings') {
      renderProfileUi();
      renderPortfolio();
    }

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

      setStatus('Creating subscription checkout…');
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

      setStatus('Creating per-trade checkout…');
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
        bodyHtml: `<div class="muted">Missing: <strong>${escapeHtml(missing.join(', '))}</strong></div><div class="muted small" style="margin-top:10px">Press Subscribe first, then pay the upfront 1% fee for the exact amount you selected.</div>`,
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

    setStatus('Autopilot running');
    appendTerminal('INFO', `One Invest started. Total $${formatMoney(total)} split into ${state.autopilot.slices} slices.`);

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
    particles: [],
    achievements: JSON.parse(localStorage.getItem('juzzy_tutorial_achievements') || '[]'),
  };
  let activeTutId = null;
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

  function getNextRecommendedLesson() {
    const completed = getTutCompleted();
    const firstIncomplete = allTutorials.find((lesson) => !completed.has(lesson.id));
    return firstIncomplete || allTutorials[0] || null;
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
    els.tutCatalog.innerHTML = filtered.map(t => `
      <div class="tut-card ${tutState.completed.includes(t.id) ? 'completed' : ''}" data-tut-id="${t.id}">
        <div class="tut-card-cat">Module ${getLessonMeta(t.id).moduleNumber} · ${getLessonMeta(t.id).trackTitle}</div>
        <div class="tut-card-title">${t.title}</div>
        <div class="tut-card-desc">${t.desc}</div>
        <div class="tut-card-meta">
          <span class="tut-card-badge ${tutState.completed.includes(t.id) ? 'done' : ''}">${tutState.completed.includes(t.id) ? '✓ Done' : getLessonMeta(t.id).tier}</span>
          <span>${t.cat}</span>
          <span>${t.steps.length} steps</span>
        </div>
      </div>
    `).join('');
    Array.from(els.tutCatalog.querySelectorAll('.tut-card')).forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-tut-id');
        openTutLesson(id);
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

  function openGlobalAiDock() {
    if (!els.globalAiDock) return;
    els.globalAiDock.hidden = false;
    if (els.globalAiMessages && !els.globalAiMessages.children.length) {
      globalAiAddMsg('ai', '<p>I\'m Juzzy AI. Ask about your lesson, explore the app, or use the microphone to talk.</p>');
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
    els.tutModeDesc.textContent = `Module ${meta.moduleNumber} of ${meta.totalModules} · ${meta.trackTitle} · ${meta.tier}. ${tut.desc}`;
    tutChatClear();
    initTutorialParticles();
  }

  function startTutLesson(withVoice) {
    tutTtsEnabled = withVoice;
    els.tutModeChooser.hidden = true;
    els.tutReader.hidden = false;
    if (els.tutModeChooser) els.tutModeChooser.hidden = true;
    if (els.tutReader) els.tutReader.hidden = false;
    tutTtsUpdateBtn();
    tutChatGreet();
    renderTutStep();
  }

  function closeTutLesson() {
    tutTtsStop();
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
      els.tutBody.innerHTML = `<div class="academy-module-banner">Module ${meta.moduleNumber} · ${meta.trackTitle} · ${meta.tier}</div><div class="academy-inline-visual"><strong>${country.name} compliance note:</strong> This lesson is educational only. It is not financial, legal, or tax advice, and nothing in Juzzy guarantees profit, income, or investing success. You must verify the laws and requirements of your country before acting.</div>${renderProfessorFaculty()}<div class="academy-lesson-actions"><button class="btn" data-lesson-jump="leaders">Live examples</button><button class="btn" data-lesson-jump="charts">Open charts</button><button class="btn" data-lesson-jump="brain">See AI signals</button><button class="btn" data-lesson-action="ask-ai">Ask AI</button><button class="btn" data-lesson-action="return">Back to module</button></div>${renderAiLessonTools()}<h3>${step.title}</h3>${sanitizeTutorialHtml(step.html)}`;
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

    qsAll('[data-jump]').forEach((b) => {
      b.addEventListener('click', () => setActiveTab(b.dataset.jump));
    });

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
    if (els.messagesRefundBtn) els.messagesRefundBtn.addEventListener('click', createRefundRequest);
    if (els.messagesSendBtn) els.messagesSendBtn.addEventListener('click', sendMessageToAiInbox);
    if (els.messagesNewThreadBtn) els.messagesNewThreadBtn.addEventListener('click', createNewMessageThread);
    if (els.communityAvatarSaveBtn) els.communityAvatarSaveBtn.addEventListener('click', saveCommunityAvatarFromInputs);
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
    if (els.portfolioConnectWallet) els.portfolioConnectWallet.addEventListener('click', connectWalletMock);
    if (els.portfolioSubscribe) els.portfolioSubscribe.addEventListener('click', startSubscriptionCheckout);
    if (els.checkYoutubeLinksBtn) els.checkYoutubeLinksBtn.addEventListener('click', validateYouTubeLinks);
    if (els.openYoutubePlaylistBtn) {
      els.openYoutubePlaylistBtn.addEventListener('click', () => {
        const first = findTutorialYouTubeLinks()[0];
        if (first?.url) window.open(first.url, '_blank', 'noopener,noreferrer');
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

    if (els.opsForceSnapshot) {
      els.opsForceSnapshot.addEventListener('click', async () => {
        appendTerminal('INFO', 'OPS: Forcing market snapshot refresh…');
        emitAudit('OPS_FORCE_SNAPSHOT', {}, 'INFO');
        await loadMarketSnapshotOnce();
        renderOps();
      });
    }

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
    setActiveTab('oracle');
    loadProfile();
    populateCountryOptions();
    populateLanguageOptions();
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
})();
