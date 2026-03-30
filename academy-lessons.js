window.JUZZY_ACADEMY_LESSONS = (() => {
  const academy = window.JUZZY_ACADEMY || { tracks: [] };

  const trackBlueprints = {
    foundations: {
      categoryPool: ['Crypto Basics', 'Using Juzzy'],
      themes: ['What Money Becomes on Blockchain', 'How Blockchains Keep History', 'Wallet Safety Foundations', 'Token Types and Their Roles', 'How Markets Move', 'Reading a Crypto Project', 'How Juzzy Demonstrations Work', 'Building a Safe First Routine'],
      assessments: ['Explain the idea in plain language', 'List three beginner mistakes to avoid', 'Compare two crypto concepts', 'Describe the safest first action'],
      labs: ['Open a chart and identify one trend', 'Review a sample wallet safety checklist', 'Practice a dummy buy scenario', 'Write a one-sentence lesson summary'],
    },
    safety: {
      categoryPool: ['Risk Management'],
      themes: ['Scam Signals and Red Flags', 'Exchange Legitimacy Checks', 'Custody and Counterparty Risk', 'Fraud Narratives and Social Pressure', 'Security Habits for Real Users', 'Risk Controls Before Any Buy', 'Tax and Record-Keeping Awareness', 'How to Slow Down Before Committing Capital'],
      assessments: ['Identify the strongest red flag', 'Write a due-diligence checklist', 'Explain one custody risk', 'State when not to invest'],
      labs: ['Review a mock exchange profile', 'Mark a risky promise in sample copy', 'Use Juzzy reports as an audit checklist', 'Practice rejecting a scam pitch'],
    },
    investing: {
      categoryPool: ['Trading Strategies', 'Risk Management'],
      themes: ['Capital Allocation and Position Sizing', 'Dollar-Cost Averaging Systems', 'Entry and Exit Planning', 'Portfolio Rules That Reduce Emotion', 'How to Use Demo Buys for Practice', 'Long-Term vs Short-Term Thinking', 'Volatility and Drawdown Awareness', 'Building an Investment Playbook'],
      assessments: ['Write an entry rule', 'Explain your exit plan', 'Define position size for a sample account', 'Compare two investment approaches'],
      labs: ['Run a dummy buy sequence', 'Practice risk gates in Oracle', 'Review a demo portfolio allocation', 'Use charts to justify a mock decision'],
    },
    advanced: {
      categoryPool: ['DeFi & On-Chain', 'Advanced', 'App Features'],
      themes: ['On-Chain Signals and Wallet Behaviour', 'AI-Assisted Research Workflows', 'Protocol Design and Risk Layers', 'Liquidity Structure and Market Microstructure', 'Advanced Juzzy Research Loops', 'Smart Contract Thinking for Learners', 'Signal Validation Routines', 'Advanced Review and Reflection'],
      assessments: ['Interpret an on-chain clue', 'Describe an AI research workflow', 'Explain a protocol risk', 'Summarize a market structure insight'],
      labs: ['Review a mock on-chain dashboard', 'Compare two protocol setups', 'Use AI to explain a hard concept', 'Build a research checklist'],
    },
    'token-universe': {
      categoryPool: ['Crypto Basics', 'Advanced'],
      themes: ['Payment Coins and Store-of-Value Assets', 'Smart Contract Ecosystems', 'Stablecoins and Settlement Layers', 'DeFi Tokens and Utility Models', 'NFT, Gaming, and Culture Tokens', 'AI, Data, and Infrastructure Tokens', 'Memecoins, Hype, and Narrative Cycles', 'How to Compare Entire Crypto Sectors'],
      assessments: ['Classify a token sector', 'Compare two sector risk profiles', 'Explain a token utility model', 'Describe why narratives matter'],
      labs: ['Sort tokens into sectors', 'Review a mock sector map', 'Use charts to compare two ecosystems', 'Create a simple watchlist by sector'],
    },
    'exchanges-platforms': {
      categoryPool: ['Risk Management', 'Using Juzzy'],
      themes: ['Exchange Due Diligence', 'Wallet and Platform Trust Signals', 'Licensing, Registration, and Disclosure Clues', 'Launchpads, Copy Trading, and Platform Risk', 'Fee Structures and Withdrawal Policies', 'Transparency, Proof, and Reporting', 'How to Review a Platform Before a Deposit', 'Building a Legitimacy Review Habit'],
      assessments: ['Score a platform review', 'List three trust signals', 'Describe one reason to walk away', 'Explain a custody concern'],
      labs: ['Audit a mock exchange landing page', 'Review a fake fee table', 'Use Juzzy notes for platform comparison', 'Write a go/no-go decision'],
    },
    'charting-analysis': {
      categoryPool: ['Trading Strategies', 'Advanced', 'Using Juzzy'],
      themes: ['Trend, Structure, and Momentum', 'Support, Resistance, and Zones', 'Entries, Exits, and Confirmation', 'Volume and Participation', 'Timeframe Alignment', 'Pattern Reading Without Overconfidence', 'Technical Analysis Inside Juzzy', 'Reviewing Your Decisions'],
      assessments: ['Mark a market structure change', 'Explain an entry trigger', 'Compare two timeframes', 'Describe how confirmation works'],
      labs: ['Draw lines on a chart', 'Compare two price swings', 'Use a resistance alert as a demo', 'Record a mock chart decision'],
    },
    'portfolio-wealth': {
      categoryPool: ['Trading Strategies', 'Risk Management'],
      themes: ['Long-Term Allocation Logic', 'Core and Satellite Models', 'Rebalancing and Discipline', 'Capital Preservation', 'Cash, Stablecoins, and Optionality', 'Managing Different Time Horizons', 'Separating Investing from Speculation', 'Building a Wealth Framework'],
      assessments: ['Write an allocation rule', 'Explain rebalancing', 'Describe your risk bucket', 'Compare speculation and investing'],
      labs: ['Create a demo portfolio split', 'Review a rebalance scenario', 'Practice stablecoin allocation logic', 'Write a portfolio note'],
    },
    'defi-yield-systems': {
      categoryPool: ['DeFi & On-Chain', 'Advanced'],
      themes: ['Lending and Borrowing Systems', 'Liquidity Pools and AMMs', 'Staking and Validator Economics', 'Bridges and Cross-Chain Risk', 'Governance and Token Incentives', 'Yield Systems and Their Failure Modes', 'Protocol Evaluation Frameworks', 'DeFi Practice and Risk Reflection'],
      assessments: ['Explain an AMM', 'Identify a DeFi risk', 'Compare staking models', 'Describe why APY can mislead'],
      labs: ['Review a mock protocol page', 'Compare two LP setups', 'List risks before using a bridge', 'Create a DeFi caution checklist'],
    },
    'ai-crypto-workflows': {
      categoryPool: ['Advanced', 'App Features'],
      themes: ['AI as a Crypto Tutor', 'AI for Research Summaries', 'Prompting for Safer Learning', 'AI for Comparative Analysis', 'AI and Decision Support Boundaries', 'Building Repeatable AI Workflows', 'Using Juzzy AI Across Tabs', 'AI Revision and Reflection'],
      assessments: ['Write a better prompt', 'Summarize an AI workflow', 'Explain AI limits', 'Describe a safe use case'],
      labs: ['Ask the AI to explain a chart', 'Generate a study checklist', 'Compare two tokens with AI', 'Use voice chat for revision'],
    },
    'creator-economy': {
      categoryPool: ['App Features', 'Using Juzzy'],
      themes: ['Crypto Education as a Product', 'Memberships and Token-Gated Communities', 'Content Strategy for Crypto Learners', 'Digital Product Ecosystems', 'Audience Trust and Ethical Framing', 'Interactive Education Experiences', 'Tokenized Access Models', 'Creator Operations in Crypto'],
      assessments: ['Define a creator offer', 'Explain a token-gated model', 'Describe a trust principle', 'Compare two education products'],
      labs: ['Plan a learner community', 'Map a content funnel', 'Create a simple course offer', 'Write a responsible creator disclaimer'],
    },
    'video-products': {
      categoryPool: ['App Features', 'Using Juzzy'],
      themes: ['Video Scripting for Crypto Education', 'Producing Visual Explanations', 'Packaging Video Products', 'Selling Video-Based Learning', 'Investment-Themed Media Risks', 'Building a Video Lesson Library', 'Calls to Action and Audience Flow', 'Creator Review and Iteration'],
      assessments: ['Write a video hook', 'Outline a lesson script', 'Describe a packaging decision', 'Explain a compliance-sensitive phrase'],
      labs: ['Draft a 60-second lesson plan', 'Build a three-part video series idea', 'Review a sample product page', 'Create a video CTA sequence'],
    },
    'business-builder': {
      categoryPool: ['App Features', 'Advanced'],
      themes: ['Research Communities and Membership Models', 'Data, Signals, and Subscription Products', 'Education Businesses in Crypto', 'Retention and Engagement Design', 'Revenue Systems and Pricing Logic', 'Operational Workflows and Support', 'Trust, Brand, and Long-Term Value', 'Business Strategy Review'],
      assessments: ['Describe a crypto business model', 'Explain one retention system', 'Compare two pricing structures', 'List one trust-building action'],
      labs: ['Map a member journey', 'Build a sample pricing ladder', 'Plan a content calendar', 'Draft a community value statement'],
    },
    'developer-track': {
      categoryPool: ['Advanced', 'App Features', 'DeFi & On-Chain'],
      themes: ['How Blockchains Are Structured', 'Smart Contracts and State', 'Wallet Connections and Signatures', 'Dapp Architecture Basics', 'Reading Technical Documentation', 'Token Standards and Interfaces', 'Security Mindset for Builders', 'Builder Practice and Review'],
      assessments: ['Explain a smart contract', 'Describe a wallet signature', 'Compare two token standards', 'Summarize a dapp architecture'],
      labs: ['Map a simple dapp flow', 'Read a sample interface', 'List builder security checks', 'Write a technical glossary'],
    },
    'global-regulation': {
      categoryPool: ['Risk Management'],
      themes: ['Global Policy Differences', 'Consumer Protection Concepts', 'Disclosures and Promotions', 'Tax Context by Activity Type', 'Jurisdictional Restrictions', 'Why Legal Context Changes', 'When to Seek Professional Advice', 'Regulation Review and Reflection'],
      assessments: ['Explain why laws differ', 'List a disclosure obligation', 'Describe a restricted activity risk', 'State when to seek advice'],
      labs: ['Compare two jurisdictions at a high level', 'Review a disclosure sample', 'Write a country check routine', 'Create a legal-awareness checklist'],
    },
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function visualSvg(trackTitle, moduleNumber, theme) {
    const label = escapeHtml(theme.slice(0, 36));
    return `<div class="academy-animated-visual" style="--module-delay:${(moduleNumber % 5) * 0.4}s"><div class="academy-visual-orb"></div><div class="academy-visual-card"><svg width="320" height="180" viewBox="0 0 320 180" role="img" aria-label="${escapeHtml(trackTitle)} module visual"><defs><linearGradient id="academyGrad${moduleNumber}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#7a5cff"/></linearGradient></defs><rect x="18" y="18" width="284" height="144" rx="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)"/><circle cx="74" cy="88" r="36" fill="url(#academyGrad${moduleNumber})" opacity="0.95"/><rect x="126" y="52" width="132" height="14" rx="7" fill="rgba(255,255,255,0.86)"/><rect x="126" y="80" width="108" height="10" rx="5" fill="rgba(255,255,255,0.35)"/><rect x="126" y="100" width="122" height="10" rx="5" fill="rgba(255,255,255,0.22)"/><text x="126" y="138" font-size="13" fill="#dff9ff">${label}</text><text x="52" y="92" font-size="15" fill="#06131d" font-weight="700">M${moduleNumber}</text></svg></div><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-jump="leaders">Explore market</button><button class="academy-hotspot" data-lesson-jump="charts">Open chart</button><button class="academy-hotspot" data-lesson-action="ask-ai">Ask AI</button></div></div>`;
  }

  function animatedConceptPanel(theme, trackTitle, moduleNumber) {
    return `<div class="academy-concept-panel" style="--panel-delay:${(moduleNumber % 4) * 0.35}s"><div class="academy-concept-badge">Interactive concept</div><div class="academy-concept-title">${escapeHtml(theme)}</div><div class="academy-concept-copy">This animated content panel keeps the learner active with moving visuals, guided prompts, and clickable pathways into the app.</div><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-jump="brain">See AI activity</button><button class="academy-hotspot" data-lesson-jump="portfolio">View portfolio demo</button><button class="academy-hotspot" data-lesson-action="return">Stay in module</button></div></div>`;
  }

  function buildYouTubeResource(track, cat, theme) {
    const normalizedCategory = String(cat || '').toLowerCase();
    const normalizedTrack = String(track.id || '').toLowerCase();

    const resourcesByCategory = {
      'crypto basics': {
        title: 'But how does bitcoin actually work?',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4',
      },
      'using juzzy': {
        title: 'How Does Bitcoin Work? With Scott Driscoll Of Curious Inventor',
        creator: 'CuriousInventor',
        url: 'https://www.youtube.com/watch?v=gq_r21Kg8yo',
      },
      'risk management': {
        title: 'SAFEST WAY To Store Your Crypto!! DON\'T RISK IT!!',
        creator: 'Coin Bureau',
        url: 'https://www.youtube.com/watch?v=aUBid1zJC-U',
      },
      'trading strategies': {
        title: 'The Complete Guide To Market Structure',
        creator: 'The Trading Channel',
        url: 'https://www.youtube.com/results?search_query=The+Trading+Channel+market+structure+trading',
      },
      'defi & on-chain': {
        title: 'Introduction to Smart Contracts and Ethereum',
        creator: 'Finematics',
        url: 'https://www.youtube.com/watch?v=xeaDE8wgVVQ',
      },
      advanced: {
        title: 'Introduction to Smart Contracts and Ethereum',
        creator: 'Finematics',
        url: 'https://www.youtube.com/watch?v=xeaDE8wgVVQ',
      },
      'app features': {
        title: 'What Is Cryptocurrency? - Crypto Whiteboard 101',
        creator: 'Whiteboard Crypto',
        url: 'https://www.youtube.com/watch?v=k1aOoX5ucgc',
      },
    };

    const resourcesByTrack = {
      foundations: {
        title: 'What Is Bitcoin & How Does It Work? (w/ Andrei Jikh)',
        creator: 'Impaulsive / Andrei Jikh',
        url: 'https://www.youtube.com/watch?v=jVkOpxluhBY',
      },
      safety: {
        title: 'SAFEST WAY To Store Your Crypto!! DON\'T RISK IT!!',
        creator: 'Coin Bureau',
        url: 'https://www.youtube.com/watch?v=aUBid1zJC-U',
      },
      investing: {
        title: 'Is Bitcoin a Store of Value? Digital Gold Explained',
        creator: 'The Plain Bagel',
        url: 'https://www.youtube.com/watch?v=b70MwTkV9t8',
      },
      advanced: {
        title: 'Introduction to Smart Contracts and Ethereum',
        creator: 'Finematics',
        url: 'https://www.youtube.com/watch?v=xeaDE8wgVVQ',
      },
      'charting-analysis': {
        title: 'The Complete Guide To Market Structure',
        creator: 'The Trading Channel',
        url: 'https://www.youtube.com/results?search_query=The+Trading+Channel+market+structure+trading',
      },
      'defi-yield-systems': {
        title: 'Introduction to Smart Contracts and Ethereum',
        creator: 'Finematics',
        url: 'https://www.youtube.com/watch?v=xeaDE8wgVVQ',
      },
    };

    const base = resourcesByTrack[normalizedTrack] || resourcesByCategory[normalizedCategory] || {
      title: `${theme} on YouTube`,
      creator: 'YouTube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.title} ${theme}`)}`,
    };

    return {
      ...base,
      label: `Watch after finishing this lesson: ${base.title}`,
      description: `This external resource supports the module topic "${theme}" after the learner completes the in-app lesson flow.`,
    };
  }

  function buildScenario(theme, trackTitle, moduleNumber) {
    return `You are stepping into module <strong>${moduleNumber}</strong> of <strong>${escapeHtml(trackTitle)}</strong>. Imagine a learner opens Juzzy after hearing strong opinions online about <strong>${escapeHtml(theme)}</strong>. The learner is curious, slightly overwhelmed, and trying to tell the difference between real understanding and noisy confidence. This module slows the moment down so the learner can see what matters, what is misleading, and what deserves a second look.`;
  }

  function buildCuriosityPrompt(theme) {
    return `<div class="tip"><strong>Curiosity hook:</strong> If someone mentions <strong>${escapeHtml(theme)}</strong> with total confidence, what evidence would you want to see before trusting the claim?</div>`;
  }

  function buildLessonScene(theme, cat) {
    return `<div class="academy-inline-visual"><strong>Scene setter:</strong> This lesson treats <strong>${escapeHtml(theme)}</strong> as a live user situation inside <strong>${escapeHtml(cat)}</strong> rather than a dry glossary entry. You are not just reading definitions. You are learning what to notice, what to question, and how to respond with better judgement.</div>`;
  }

  function buildMicroStory(theme, blueprint, moduleIndex) {
    const labPrompt = blueprint.labs[moduleIndex % blueprint.labs.length];
    return `<p>A typical beginner mistake is to rush past the meaning of <strong>${escapeHtml(theme)}</strong> and copy what louder users are doing. Juzzy flips that pattern. First, you understand the concept. Then you test it in a safer learning environment. Finally, you connect it to an action like: <strong>${escapeHtml(labPrompt)}</strong>.</p>`;
  }

  function buildDecisionGrid(theme) {
    return `<ul><li><strong>Notice:</strong> What clues tell you this concept is actually present?</li><li><strong>Question:</strong> What could be misunderstood, exaggerated, or marketed badly?</li><li><strong>Act:</strong> What is the safest next learning move before taking any outside action related to <strong>${escapeHtml(theme)}</strong>?</li></ul>`;
  }

  function buildReflectionPrompt(theme) {
    return `<div class="warn"><strong>Reflection prompt:</strong> If you had to teach <strong>${escapeHtml(theme)}</strong> to a smart friend in 30 seconds, which example would you use and which mistake would you warn them about first?</div>`;
  }

  function buildExternalLessonResources(track, cat, theme) {
    const normalizedCategory = String(cat || '').toLowerCase();
    const normalizedTrack = String(track.id || '').toLowerCase();
    const categoryMap = {
      'crypto basics': [
        { label: 'Bitcoin explainer', provider: 'bitcoin.org', url: 'https://bitcoin.org/en/how-it-works' },
        { label: 'Ethereum basics', provider: 'ethereum.org', url: 'https://ethereum.org/en/learn/' },
      ],
      'risk management': [
        { label: 'Consumer safety guidance', provider: 'Coinbase Learn', url: 'https://www.coinbase.com/learn/crypto-basics/7-tips-to-invest-safely-in-crypto' },
        { label: 'Crypto scam awareness', provider: 'Binance Academy', url: 'https://academy.binance.com/en/articles/common-crypto-scams-and-how-to-avoid-them' },
      ],
      'trading strategies': [
        { label: 'Technical analysis primer', provider: 'Binance Academy', url: 'https://academy.binance.com/en/articles/a-beginners-guide-to-technical-analysis' },
        { label: 'Market structure concepts', provider: 'Coinbase Learn', url: 'https://www.coinbase.com/learn/advanced-trading/what-is-technical-analysis' },
      ],
      'defi & on-chain': [
        { label: 'DeFi fundamentals', provider: 'ethereum.org', url: 'https://ethereum.org/en/defi/' },
        { label: 'Smart contract basics', provider: 'Chainlink Education Hub', url: 'https://chain.link/education/smart-contracts' },
      ],
      advanced: [
        { label: 'Smart contract overview', provider: 'ethereum.org', url: 'https://ethereum.org/en/smart-contracts/' },
        { label: 'Oracle system overview', provider: 'Chainlink Education Hub', url: 'https://chain.link/education' },
      ],
      'app features': [
        { label: 'Learn crypto glossary', provider: 'Coinbase Learn', url: 'https://www.coinbase.com/learn/crypto-basics/what-is-cryptocurrency' },
        { label: 'Crypto concepts library', provider: 'Binance Academy', url: 'https://academy.binance.com/en' },
      ],
      'using juzzy': [
        { label: 'Market cap explainer', provider: 'CoinMarketCap Alexandria', url: 'https://coinmarketcap.com/alexandria/glossary/market-capitalization-market-cap-mcap' },
        { label: 'CoinGecko Learn hub', provider: 'CoinGecko', url: 'https://www.coingecko.com/learn' },
      },
    };
    const trackMap = {
      safety: [
        { label: 'Wallet security guide', provider: 'Ledger Academy', url: 'https://www.ledger.com/academy/basic-basics/2-how-to-own-crypto/what-is-a-crypto-wallet' },
        { label: 'Phishing awareness', provider: 'Binance Academy', url: 'https://academy.binance.com/en/articles/how-to-avoid-phishing-attacks' },
      ],
      investing: [
        { label: 'Dollar-cost averaging', provider: 'Coinbase Learn', url: 'https://www.coinbase.com/learn/crypto-basics/what-is-dollar-cost-averaging' },
        { label: 'Portfolio basics', provider: 'CoinGecko Learn', url: 'https://www.coingecko.com/learn/crypto-portfolio-management' },
      ],
      'charting-analysis': [
        { label: 'Candlestick basics', provider: 'Binance Academy', url: 'https://academy.binance.com/en/articles/how-to-read-candlestick-charts' },
        { label: 'Support and resistance', provider: 'Coinbase Learn', url: 'https://www.coinbase.com/learn/advanced-trading/what-are-support-resistance-levels' },
      ],
      'defi-yield-systems': [
        { label: 'What is staking?', provider: 'ethereum.org', url: 'https://ethereum.org/en/staking/' },
        { label: 'Liquidity pool basics', provider: 'CoinMarketCap Alexandria', url: 'https://coinmarketcap.com/alexandria/glossary/liquidity-pool' },
      ],
      'global-regulation': [
        { label: 'Global crypto policy overview', provider: 'Chainalysis', url: 'https://www.chainalysis.com/blog/' },
        { label: 'Consumer investor alerts', provider: 'IOSCO', url: 'https://www.iosco.org/investor_protection/' },
      },
    };
    const resources = trackMap[normalizedTrack] || categoryMap[normalizedCategory] || [
      { label: `${theme} research results`, provider: 'Google Search', url: `https://www.google.com/search?q=${encodeURIComponent(`${track.title} ${theme} crypto learning`)}` },
      { label: `${theme} glossary search`, provider: 'CoinMarketCap Alexandria', url: `https://coinmarketcap.com/alexandria/search?query=${encodeURIComponent(theme)}` },
    ];
    return resources.slice(0, 2);
  }

  function buildExternalResourceMarkup(resources) {
    return `<div class="academy-inline-visual academy-lesson-links"><strong>Explore outside the lesson without losing your place:</strong><div class="academy-resource-link-grid">${resources.map((resource) => `<button class="academy-resource-link" data-lesson-resource-url="${escapeHtml(resource.url)}" data-lesson-resource-label="${escapeHtml(resource.label)}" data-lesson-resource-provider="${escapeHtml(resource.provider)}" type="button"><span class="academy-resource-link-title">${escapeHtml(resource.label)}</span><span class="academy-resource-link-meta">${escapeHtml(resource.provider)} · Opens inside Juzzy viewer</span><span class="academy-resource-link-return">Return to this lesson anytime</span></button>`).join('')}</div></div>`;
  }

  function buildSteps(track, moduleIndex, moduleNumber, theme, blueprint) {
    const assessmentPrompt = blueprint.assessments[moduleIndex % blueprint.assessments.length];
    const labPrompt = blueprint.labs[moduleIndex % blueprint.labs.length];
    const externalResourceMarkup = buildExternalResourceMarkup(buildExternalLessonResources(track, blueprint.categoryPool[moduleIndex % blueprint.categoryPool.length] || blueprint.categoryPool[0] || 'Crypto Basics', theme));
    return [
      {
        title: `Concept Focus — ${theme}`,
        html: `${animatedConceptPanel(theme, track.title, moduleNumber)}${buildCuriosityPrompt(theme)}${buildLessonScene(theme, blueprint.categoryPool[moduleIndex % blueprint.categoryPool.length] || 'Crypto Basics')}<p>${buildScenario(theme, track.title, moduleNumber)}</p><p>This module immerses the learner in <strong>${escapeHtml(theme)}</strong> inside <strong>${escapeHtml(track.title)}</strong>. It connects core ideas, practical crypto context, and the user behaviours that matter most when navigating this part of the market.</p><p>Each concept is framed for education, guided exploration, and better judgement rather than guaranteed outcomes.</p>`,
      },
      {
        title: 'Core Explanation',
        html: `<div class="tip"><strong>What this module teaches:</strong> ${escapeHtml(theme)} is being taught as a real user skill, not just a theory label.</div><p>Start by identifying what problem this concept solves for the user. In crypto, almost every idea exists because users need a better way to store value, move value, verify trust, manage risk, or interpret market behaviour.</p><p>This lesson keeps the explanation grounded in first principles, user safety, and decision quality. The goal is for the learner to understand what the concept is, why it matters, and how it appears in real activity across wallets, exchanges, charts, communities, and protocols.</p>${buildMicroStory(theme, blueprint, moduleIndex)}${buildDecisionGrid(theme)}`,
      },
      {
        title: 'Visual Walkthrough',
        html: `${visualSvg(track.title, moduleNumber, theme)}<p>This visual block anchors the learner in the module theme and keeps the lesson interactive and easy to follow. Users can ask AI questions, click into related app areas, and return to the module without losing context.</p><p>As you move through the visual, imagine narrating what is happening to a beginner: what part is the core mechanism, what part is a signal, and what part could easily confuse someone seeing this for the first time?</p>`,
      },
      {
        title: 'Real-World Lens',
        html: `<p>Now shift from definition to reality. Where would a user actually encounter <strong>${escapeHtml(theme)}</strong>? Maybe in a wallet decision, a platform screen, a chart move, a token page, a social post, or an AI-generated explanation. The important skill is not memorizing the term. The important skill is spotting the moment when the term becomes relevant.</p><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-jump="leaders">Check live movers</button><button class="academy-hotspot" data-lesson-jump="reports">Open reports</button><button class="academy-hotspot" data-lesson-action="ask-ai">Ask for a real-world example</button></div><ol><li>Where does this concept show up first for a normal user?</li><li>How is it usually misunderstood online?</li><li>What extra information would make your interpretation stronger?</li></ol>${externalResourceMarkup}`,
      },
      {
        title: 'Why It Matters For The User',
        html: `<p>The learner should leave this section knowing how <strong>${escapeHtml(theme)}</strong> changes their decisions. Juzzy treats every lesson as a judgement tool: what should the user notice, compare, avoid, or practice differently after learning this idea?</p><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-jump="leaders">See live examples</button><button class="academy-hotspot" data-lesson-jump="charts">Inspect market context</button><button class="academy-hotspot" data-lesson-action="ask-ai">Ask AI for a simpler explanation</button></div><ol><li>What signal should a beginner notice first?</li><li>What mistake does this concept help prevent?</li><li>What safer next action does this module encourage?</li></ol>${buildReflectionPrompt(theme)}`,
      },
      {
        title: 'Assessment Checkpoint',
        html: `<div class="tip"><strong>Assessment task:</strong> ${escapeHtml(assessmentPrompt)}.</div><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-action="ask-ai">Get AI hint</button><button class="academy-hotspot" data-lesson-jump="reports">Open review log</button></div><ol><li>Explain the lesson idea in your own words.</li><li>Name one pitfall or risk attached to this topic.</li><li>Describe how you would explore it safely inside Juzzy first.</li><li>Give one example that proves you understand the idea beyond just repeating the name.</li></ol>`,
      },
      {
        title: 'Practice Lab',
        html: `<div class="warn"><strong>Practice lab:</strong> ${escapeHtml(labPrompt)}.</div><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-jump="oracle">Run guided demo</button><button class="academy-hotspot" data-lesson-jump="charts">Inspect live chart</button><button class="academy-hotspot" data-lesson-action="return">Back to lesson flow</button></div><p>This lab is designed for guided clicking, dummy actions, and review. It keeps the learner engaged while reinforcing the module through action rather than passive reading.</p><p>Try to act like a calm analyst, not an impulsive user. Pause, observe the signal, note what is uncertain, and only then decide what the smartest practice action would be.</p>`,
      },
      {
        title: 'Lesson Summary & Reflection',
        html: `<div class="academy-inline-visual"><strong>End-of-lesson reflection:</strong> You should now be able to describe <strong>${escapeHtml(theme)}</strong>, explain why it matters, and practice it safely inside Juzzy before trusting outside noise.</div><p>Before moving on, summarize the lesson in your own words and compare what you believed before the module with what you understand now.</p><ul><li>State the concept plainly.</li><li>List one risk or misuse to watch for.</li><li>Describe one Juzzy tool that helps you learn or test this safely.</li><li>Name one question you would ask next if you wanted to go deeper.</li></ul><p>The best learners leave a module with sharper questions, not just more words. That is how this lesson becomes memorable instead of forgettable.</p>`,
      },
    ];
  }

  const lessons = [];
  let moduleNumber = 1;

  for (const track of academy.tracks || []) {
    const blueprint = trackBlueprints[track.id] || trackBlueprints.foundations;
    for (let index = 0; index < Number(track.totalModules || 0); index += 1) {
      const theme = blueprint.themes[index % blueprint.themes.length];
      const cat = blueprint.categoryPool[index % blueprint.categoryPool.length] || blueprint.categoryPool[0] || 'Crypto Basics';
      lessons.push({
        id: `academy-${track.id}-${index + 1}`,
        cat,
        title: `${track.title} — ${theme} ${index + 1}`,
        desc: `${track.summary} Module ${index + 1} builds user understanding through visuals, assessment, and practice lab interaction.`,
        steps: buildSteps(track, index, moduleNumber, theme, blueprint),
        youtubeResource: buildYouTubeResource(track, cat, theme),
      });
      moduleNumber += 1;
    }
  }

  return lessons;
})();

window.JUZZY_TUTORIALS = (window.JUZZY_TUTORIALS || []).concat(window.JUZZY_ACADEMY_LESSONS || []);
