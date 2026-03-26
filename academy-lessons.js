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

  function buildSteps(track, moduleIndex, moduleNumber, theme, blueprint) {
    const assessmentPrompt = blueprint.assessments[moduleIndex % blueprint.assessments.length];
    const labPrompt = blueprint.labs[moduleIndex % blueprint.labs.length];
    return [
      {
        title: `Concept Focus — ${theme}`,
        html: `${animatedConceptPanel(theme, track.title, moduleNumber)}<p>This module immerses the learner in <strong>${escapeHtml(theme)}</strong> inside <strong>${escapeHtml(track.title)}</strong>. It connects core ideas, practical crypto context, and the user behaviours that matter most when navigating this part of the market.</p><p>Each concept is framed for education, guided exploration, and better judgement rather than guaranteed outcomes.</p>`,
      },
      {
        title: 'Visual Walkthrough',
        html: `${visualSvg(track.title, moduleNumber, theme)}<p>This visual block anchors the learner in the module theme and keeps the lesson interactive and easy to follow. Users can ask AI questions, click into related app areas, and return to the module without losing context.</p>`,
      },
      {
        title: 'Assessment Checkpoint',
        html: `<div class="tip"><strong>Assessment task:</strong> ${escapeHtml(assessmentPrompt)}.</div><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-action="ask-ai">Get AI hint</button><button class="academy-hotspot" data-lesson-jump="reports">Open review log</button></div><ol><li>Explain the lesson idea in your own words.</li><li>Name one pitfall or risk attached to this topic.</li><li>Describe how you would explore it safely inside Juzzy first.</li></ol>`,
      },
      {
        title: 'Practice Lab',
        html: `<div class="warn"><strong>Practice lab:</strong> ${escapeHtml(labPrompt)}.</div><div class="academy-hotspot-row"><button class="academy-hotspot" data-lesson-jump="oracle">Run guided demo</button><button class="academy-hotspot" data-lesson-jump="charts">Inspect live chart</button><button class="academy-hotspot" data-lesson-action="return">Back to lesson flow</button></div><p>This lab is designed for guided clicking, dummy actions, and review. It keeps the learner engaged while reinforcing the module through action rather than passive reading.</p>`,
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
      });
      moduleNumber += 1;
    }
  }

  return lessons;
})();

window.JUZZY_TUTORIALS = (window.JUZZY_TUTORIALS || []).concat(window.JUZZY_ACADEMY_LESSONS || []);
