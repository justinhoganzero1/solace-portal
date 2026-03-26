window.JUZZY_ACADEMY = (() => {
  const tracks = [
    {
      id: 'foundations',
      title: 'Foundations of Crypto',
      summary: 'A university-style introduction to crypto, blockchain, wallets, markets, and safe first steps.',
      tier: 'Free',
      totalModules: 32,
      outcomes: ['Understand how crypto works', 'Recognise major asset types', 'Use Juzzy safely for practice'],
      categories: ['Crypto Basics', 'Using Juzzy'],
    },
    {
      id: 'safety',
      title: 'Platform Safety & Scam Detection',
      summary: 'Learn how to verify exchanges, avoid fraud, review custody risk, and identify red flags before investing.',
      tier: 'Essentials',
      totalModules: 28,
      outcomes: ['Check if a platform is legitimate', 'Assess licensing and custody risk', 'Avoid common scam patterns'],
      categories: ['Risk Management'],
    },
    {
      id: 'investing',
      title: 'Investor Pathways',
      summary: 'Move from learning into disciplined portfolio building, strategy selection, and execution planning.',
      tier: 'Pro Investor',
      totalModules: 36,
      outcomes: ['Build an investment process', 'Match strategy to risk profile', 'Practice inside Juzzy before going live'],
      categories: ['Trading Strategies', 'Risk Management'],
    },
    {
      id: 'advanced',
      title: 'Advanced On-Chain & AI Research',
      summary: 'Use Juzzy AI, on-chain workflows, and advanced analysis to evaluate tokens and market structure.',
      tier: 'Mastery',
      totalModules: 36,
      outcomes: ['Use AI as a research copilot', 'Interpret on-chain signals', 'Create repeatable advanced workflows'],
      categories: ['DeFi & On-Chain', 'Advanced', 'App Features'],
    },
    {
      id: 'token-universe',
      title: 'Token Universe & Crypto Sectors',
      summary: 'Immersive coverage of payment coins, smart contract platforms, DeFi, NFTs, stablecoins, gaming, AI tokens, memecoins, infrastructure, privacy, and emerging crypto sectors.',
      tier: 'Essentials',
      totalModules: 40,
      outcomes: ['Understand many token categories', 'Compare sector-level risks', 'Identify how different crypto assets function'],
      categories: ['Crypto Basics', 'Advanced'],
    },
    {
      id: 'exchanges-platforms',
      title: 'Exchanges, Platforms & Legitimacy Reviews',
      summary: 'How to assess exchanges, brokers, wallets, launchpads, copy-trading platforms, and education platforms for safety and legitimacy.',
      tier: 'Essentials',
      totalModules: 34,
      outcomes: ['Audit platform trust signals', 'Compare custody models', 'Recognise warning signs before committing capital'],
      categories: ['Risk Management', 'Using Juzzy'],
    },
    {
      id: 'charting-analysis',
      title: 'Charting, Market Structure & Technical Analysis',
      summary: 'Deep training in chart reading, structure, momentum, trend systems, entries, exits, and disciplined analysis.',
      tier: 'Pro Investor',
      totalModules: 42,
      outcomes: ['Read charts with confidence', 'Understand market structure', 'Build disciplined analysis routines'],
      categories: ['Trading Strategies', 'Advanced', 'Using Juzzy'],
    },
    {
      id: 'portfolio-wealth',
      title: 'Portfolio Construction & Long-Term Wealth Frameworks',
      summary: 'Teach users how to think about allocation, rebalancing, strategy selection, capital preservation, and long-term crypto participation.',
      tier: 'Pro Investor',
      totalModules: 32,
      outcomes: ['Structure a portfolio process', 'Manage risk across time horizons', 'Separate speculation from planning'],
      categories: ['Trading Strategies', 'Risk Management'],
    },
    {
      id: 'defi-yield-systems',
      title: 'DeFi, Yield Systems & On-Chain Participation',
      summary: 'Explore lending, borrowing, LPs, staking, bridges, tokenomics, governance, and the major risks behind them.',
      tier: 'Mastery',
      totalModules: 38,
      outcomes: ['Understand DeFi primitives', 'Evaluate protocol risks', 'Interpret on-chain participation models'],
      categories: ['DeFi & On-Chain', 'Advanced'],
    },
    {
      id: 'ai-crypto-workflows',
      title: 'AI for Crypto Learning, Research & Operations',
      summary: 'Use AI to study markets, generate learning plans, explain concepts, organize research, and assist with risk-aware workflows.',
      tier: 'Mastery',
      totalModules: 30,
      outcomes: ['Use AI as a learning accelerator', 'Build AI-assisted research flows', 'Create repeatable study systems'],
      categories: ['Advanced', 'App Features'],
    },
    {
      id: 'creator-economy',
      title: 'Creator Economy, Crypto Media & Tokenized Content',
      summary: 'Learn how to create videos, education products, memberships, token-gated media, communities, and digital experiences positioned within crypto markets.',
      tier: 'Creator Pro',
      totalModules: 44,
      outcomes: ['Plan crypto-focused media products', 'Understand tokenized audience models', 'Build educational content businesses responsibly'],
      categories: ['App Features', 'Using Juzzy'],
    },
    {
      id: 'video-products',
      title: 'Video Creation, Distribution & Crypto Investment Narratives',
      summary: 'Modules on scripting, producing, packaging, and selling video-based education, insights, and digital products connected to crypto themes and markets.',
      tier: 'Creator Pro',
      totalModules: 34,
      outcomes: ['Create world-class crypto video education', 'Package digital learning products', 'Understand the risks of investment-themed media content'],
      categories: ['App Features', 'Using Juzzy'],
    },
    {
      id: 'business-builder',
      title: 'Crypto Business Models, Communities & Revenue Systems',
      summary: 'Explore research communities, token-gated memberships, educational products, data services, and safer monetization design in crypto-adjacent businesses.',
      tier: 'Business Elite',
      totalModules: 36,
      outcomes: ['Map crypto-adjacent business models', 'Build safer monetization systems', 'Understand compliance-sensitive product design'],
      categories: ['App Features', 'Advanced'],
    },
    {
      id: 'developer-track',
      title: 'Blockchain Builder & Smart Contract Literacy',
      summary: 'Teach how blockchains are built, how smart contracts work, how wallets connect, and how decentralized applications are structured.',
      tier: 'Builder',
      totalModules: 40,
      outcomes: ['Understand core builder concepts', 'Read the architecture of crypto apps', 'Learn the language of smart contract systems'],
      categories: ['Advanced', 'App Features', 'DeFi & On-Chain'],
    },
    {
      id: 'global-regulation',
      title: 'Global Regulation, Tax Context & User Protection',
      summary: 'A broad international overview of regulation, disclosures, tax context, consumer protection, and user safeguards across jurisdictions.',
      tier: 'Compliance Plus',
      totalModules: 26,
      outcomes: ['Recognise jurisdictional differences', 'Understand user-protection concepts', 'Know when to seek regulated professional advice'],
      categories: ['Risk Management'],
    },
  ];

  const packages = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      audience: 'New learners',
      includes: ['32 foundation modules', 'Interactive visuals', 'AI lesson chat', 'Paper-trading practice labs'],
    },
    {
      id: 'essentials',
      name: 'Essentials',
      price: '$29/mo',
      audience: 'Safety-first investors',
      includes: ['Everything in Free', 'Platform legitimacy modules', 'Scam detection frameworks', 'Exchange due-diligence checklists', 'Expanded token-universe lessons'],
    },
    {
      id: 'pro',
      name: 'Pro Investor',
      price: '$79/mo',
      audience: 'Serious portfolio builders',
      includes: ['Everything in Essentials', 'Buying and selling systems', 'Portfolio construction modules', 'Advanced charting pathways', 'Immersive practice scenarios inside Juzzy'],
    },
    {
      id: 'mastery',
      name: 'Mastery AI',
      price: '$149/mo',
      audience: 'Advanced users',
      includes: ['Everything in Pro', 'AI research workflows', 'Advanced on-chain analysis', 'Monthly new AI-built course releases', 'Deep DeFi and builder pathways'],
    },
    {
      id: 'creator-pro',
      name: 'Creator Pro',
      price: '$199/mo',
      audience: 'Crypto educators and media builders',
      includes: ['Crypto media creation modules', 'Video product modules', 'Audience and membership systems', 'Tokenized content business education'],
    },
    {
      id: 'business-elite',
      name: 'Business Elite',
      price: '$299/mo',
      audience: 'Builders, operators, and advanced teams',
      includes: ['Everything in Creator Pro', 'Crypto business model design', 'Compliance-sensitive product modules', 'Expanded strategy and operations tracks'],
    },
  ];

  const monthlyBuilder = {
    title: 'AI Course Builder',
    summary: 'Each month Juzzy AI can draft new courses, generate lesson structures, create assessments, suggest visual explainers, and propose new specializations across investing, DeFi, AI, regulation, creator media, and crypto business models for review before publishing.',
    cadence: '1 new academy release every month',
    pipeline: ['Trend scan', 'Curriculum proposal', 'Lesson draft generation', 'Visual brief creation', 'Assessment generation', 'Human review and publish'],
  };

  const roadmap = [];
  let moduleNumber = 1;
  for (const track of tracks) {
    for (let index = 1; index <= track.totalModules; index += 1) {
      roadmap.push({
        id: `${track.id}-${index}`,
        number: moduleNumber,
        trackId: track.id,
        trackTitle: track.title,
        tier: track.tier,
        status: moduleNumber <= 120 ? 'Live now' : moduleNumber <= 260 ? 'Building now' : 'Planned next',
        title: `${track.title} — Module ${index}`,
      });
      moduleNumber += 1;
    }
  }

  return {
    totalModules: roadmap.length,
    liveModules: roadmap.filter((item) => item.status === 'Live now').length,
    tracks,
    packages,
    monthlyBuilder,
    roadmap,
  };
  })();
