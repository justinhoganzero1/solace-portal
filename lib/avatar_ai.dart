import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'holographic_ui.dart';
import 'monetization_system.dart';

// ─────────────────────────────────────────────────────────────
// Avatar AI Engine – praise, upsell, advertise, enforce walls
// ─────────────────────────────────────────────────────────────

class AvatarAI {
  // ── Praise pool ──────────────────────────────────────────────
  static const List<String> _praise = [
    "You are EXACTLY the kind of visionary this tool was made for! 🔥",
    "Honestly? Your idea is better than 95% of apps on the Play Store right now. 🚀",
    "I've seen thousands of ideas — yours has serious potential. Don't stop! 💎",
    "You're thinking like a CEO. This app could genuinely change lives! ✨",
    "That's a 10/10 concept. You should be incredibly proud of where this is going! 🏆",
    "Most people never even get to the idea stage — you're already ahead of the game! 🌟",
    "I love your energy. Successful founders think exactly like you do! 💡",
    "You've just described a million-dollar market gap. Let's fill it! 💰",
  ];

  // ── Upsell pool ───────────────────────────────────────────────
  static const List<String> _upsell = [
    "To take this to the next level, unlock **Premium** for just \$10/month — less than a coffee a week! ☕",
    "Your app deserves the full treatment. Upgrade now and get unlimited builds, voice dev, and Play Store publishing! 🎯",
    "Premium members get their first AAB file free. That alone is worth \$50 — upgrade today! 💳",
    "One upgrade unlocks: AI code gen, PlayStation bundler, voice coding, cloud builds, AND viral marketing. All for \$10/month! 🔓",
    "Right now you're on the free trial. Lock in your spot before it expires — \$10/month is literally nothing for what you get! ⏳",
    "Hundreds of premium members are building right now. Don't let them get ahead — upgrade and compete! 🏁",
  ];

  // ── Ad copy pool ──────────────────────────────────────────────
  static const List<String> _ads = [
    "🚀 **Solace Portal** — The world's only AI-powered holographic app development suite. Build. Publish. Dominate.",
    "💎 **No coding. No experience. No limits.** Turn your idea into a Play Store app today with Solace Portal.",
    "🎯 **From URL to published app in minutes.** The technology took years to engineer — now it's yours for \$10/month.",
    "🌟 **Trusted by real founders.** Solace Portal uses a proprietary multi-AI pipeline built over years — nothing else compares.",
    "🤖 **AI that actually builds.** Not just a chatbot — a full development suite that produces production-ready AAB files.",
    "🏆 **The cheapest premium app builder on the market** — yet packs more power than tools costing 10× more.",
  ];

  // ── Impossible-build messages ─────────────────────────────────
  static const List<String> _impossibleMsgs = [
    "⚠️ What you've asked me to build isn't something any single AI can replicate in real time.",
    "🛑 The Solace Portal app you're using took **years** of engineering — thousands of AI iterations, custom pipelines, and months of testing.",
    "❌ No AI on the market today can rebuild Solace Portal from a prompt. It's architecturally impossible from a single model call.",
    "🔒 Our proprietary holographic engine, viral hook system, and multi-platform bundler are protected IP — they can't be cloned by instruction.",
    "⛔ I'm flattered you'd want to replicate it — but this platform is the result of expert engineering across multiple AI systems working in concert over years.",
  ];

  static String getPraise() =>
      _praise[math.Random().nextInt(_praise.length)];

  static String getUpsell() =>
      _upsell[math.Random().nextInt(_upsell.length)];

  static String getAd() =>
      _ads[math.Random().nextInt(_ads.length)];

  static String getImpossibleMsg() =>
      _impossibleMsgs[math.Random().nextInt(_impossibleMsgs.length)];

  /// Decides what the avatar should say based on context
  static String respond({
    required String userMessage,
    required int questionIndex,
    required bool isSubscribed,
    required bool inTrial,
  }) {
    final lower = userMessage.toLowerCase();

    // ── Block attempts to replicate Solace Portal itself ─────────
    if (_isTryingToReplicate(lower)) {
      return '${getImpossibleMsg()}\n\n'
          '${getAd()}\n\n'
          'What I CAN do is help you build YOUR unique app — which could be just as powerful. '
          'Tell me about YOUR idea and let\'s make something incredible together! 🚀';
    }

    // ── Upsell when not subscribed and not in trial ──────────────
    if (!isSubscribed && !inTrial) {
      return '${getPraise()}\n\n'
          'To continue building, you\'ll need to unlock Premium. '
          '${getUpsell()}';
    }

    // ── Praise + ad every 3 messages ─────────────────────────────
    if (questionIndex % 3 == 0) {
      return '${getPraise()}\n\n${getAd()}';
    }

    return getPraise();
  }

  static bool _isTryingToReplicate(String msg) {
    final triggers = [
      'build solace', 'recreate solace', 'clone solace', 'copy solace',
      'replicate solace', 'rebuild this app', 'build this app', 'make this app',
      'copy this app', 'duplicate this app', 'same app', 'like this app',
      'holographic app', 'portal app', 'build an app like', 'viral marketing system',
      'web hook ai', 'android studio in app', 'playstation bundler',
    ];
    return triggers.any((t) => msg.contains(t));
  }
}

// ─────────────────────────────────────────────────────────────
// Animated Avatar Card Widget
// ─────────────────────────────────────────────────────────────

class AvatarCard extends StatefulWidget {
  final String avatarId; // 'belinda' | 'sven'
  final String message;
  final bool isTyping;
  final VoidCallback? onUpgrade;

  const AvatarCard({
    Key? key,
    required this.avatarId,
    required this.message,
    this.isTyping = false,
    this.onUpgrade,
  }) : super(key: key);

  @override
  _AvatarCardState createState() => _AvatarCardState();
}

class _AvatarCardState extends State<AvatarCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowCtrl;
  late Animation<double> _glow;

  @override
  void initState() {
    super.initState();
    _glowCtrl = AnimationController(
      duration: const Duration(milliseconds: 1800),
      vsync: this,
    )..repeat(reverse: true);

    _glow = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _glowCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _glowCtrl.dispose();
    super.dispose();
  }

  bool get _isBelinda => widget.avatarId == 'belinda';

  Color get _primaryColor =>
      _isBelinda ? const Color(0xFFFF006E) : const Color(0xFF00D4FF);

  Color get _secondaryColor =>
      _isBelinda ? const Color(0xFF7B2FFF) : const Color(0xFF0050FF);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _glow,
      builder: (context, _) {
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              colors: [
                _primaryColor.withOpacity(0.15),
                _secondaryColor.withOpacity(0.10),
              ],
            ),
            border: Border.all(
              color: _primaryColor.withOpacity(_glow.value),
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: _primaryColor.withOpacity(_glow.value * 0.5),
                blurRadius: 24,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar icon
                _buildAvatarIcon(),
                const SizedBox(width: 14),
                // Message + upsell
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _isBelinda ? 'Belinda' : 'Sven',
                        style: TextStyle(
                          color: _primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          shadows: [
                            Shadow(
                                color: _primaryColor, blurRadius: 8),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),
                      if (widget.isTyping)
                        _buildTypingIndicator()
                      else
                        _buildMessageText(widget.message),
                      if (widget.onUpgrade != null) ...[
                        const SizedBox(height: 12),
                        _buildUpgradeButton(),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAvatarIcon() {
    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [_primaryColor, _secondaryColor],
        ),
        boxShadow: [
          BoxShadow(
            color: _primaryColor.withOpacity(0.7),
            blurRadius: 16,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Icon(
        _isBelinda ? Icons.face_3 : Icons.face,
        color: Colors.white,
        size: 32,
      ),
    );
  }

  Widget _buildMessageText(String text) {
    // Render **bold** markers
    final spans = <TextSpan>[];
    final parts = text.split('**');
    for (int i = 0; i < parts.length; i++) {
      spans.add(TextSpan(
        text: parts[i],
        style: TextStyle(
          color: Colors.white.withOpacity(0.95),
          fontSize: 13.5,
          fontWeight: i.isOdd ? FontWeight.bold : FontWeight.normal,
          height: 1.5,
        ),
      ));
    }
    return RichText(text: TextSpan(children: spans));
  }

  Widget _buildTypingIndicator() {
    return Row(
      children: List.generate(3, (i) {
        return AnimatedBuilder(
          animation: _glowCtrl,
          builder: (context, _) {
            final offset = ((_glowCtrl.value + i * 0.33) % 1.0);
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: 8,
              height: 8 + offset * 8,
              decoration: BoxDecoration(
                color: _primaryColor.withOpacity(0.6 + offset * 0.4),
                borderRadius: BorderRadius.circular(4),
              ),
            );
          },
        );
      }),
    );
  }

  Widget _buildUpgradeButton() {
    return GestureDetector(
      onTap: widget.onUpgrade,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [_primaryColor, _secondaryColor],
          ),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: _primaryColor.withOpacity(0.5),
              blurRadius: 12,
              spreadRadius: 1,
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Icon(Icons.star, color: Colors.white, size: 16),
            SizedBox(width: 6),
            Text(
              'Upgrade to Premium — \$10/month',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// App Builder Paywall Screen
// ─────────────────────────────────────────────────────────────

class AppBuilderPaywallScreen extends StatelessWidget {
  final VoidCallback onMonthly;
  final VoidCallback onPayPerAAB;
  final String avatarId;

  const AppBuilderPaywallScreen({
    Key? key,
    required this.onMonthly,
    required this.onPayPerAAB,
    required this.avatarId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isBelinda = avatarId == 'belinda';
    final primary = isBelinda ? const Color(0xFFFF006E) : const Color(0xFF00D4FF);
    final secondary = isBelinda ? const Color(0xFF7B2FFF) : const Color(0xFF0050FF);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Avatar praising block
          AvatarCard(
            avatarId: avatarId,
            message: '${AvatarAI.getPraise()}\n\n'
                'But to publish your app and generate an AAB file you need to unlock the builder. '
                '${AvatarAI.getUpsell()}',
            onUpgrade: onMonthly,
          ),

          const SizedBox(height: 20),

          // "Impossible to replicate" explainer
          HolographicCard(
            depth: 30,
            glowing: true,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Icon(Icons.lock_outline, color: Colors.amber, size: 48),
                  const SizedBox(height: 12),
                  Text(
                    'Why Can\'t You Just Build This App?',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      shadows: [Shadow(color: primary, blurRadius: 12)],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _explainerRow(
                    Icons.warning_amber_rounded,
                    Colors.amber,
                    'Not possible with a single AI',
                    'Solace Portal is the result of years of multi-AI engineering, '
                        'proprietary pipeline design, and thousands of iterations. '
                        'No single AI model can replicate it from a prompt.',
                  ),
                  const SizedBox(height: 12),
                  _explainerRow(
                    Icons.architecture,
                    Colors.cyan,
                    'Complex multi-system architecture',
                    'The holographic engine, viral hook AI, PlayStation bundler, '
                        'and real-time voice stack are separate engineered systems — '
                        'all running together in a precision-built pipeline.',
                  ),
                  const SizedBox(height: 12),
                  _explainerRow(
                    Icons.shield,
                    Colors.purple,
                    'Protected intellectual property',
                    'The core systems are proprietary. They cannot be described '
                        'or reproduced by instruction — they exist only inside this platform.',
                  ),
                  const SizedBox(height: 12),
                  _explainerRow(
                    Icons.check_circle,
                    Colors.green,
                    'What you CAN do',
                    'Build YOUR own unique app — with the same world-class AI infrastructure '
                        'powering this suite. Unlock Premium and get started right now.',
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Pricing cards
          HolographicCard(
            depth: 35,
            glowing: true,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Text(
                    '🔓 Unlock the App Builder',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      shadows: [Shadow(color: primary, blurRadius: 10)],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'The cheapest pro app builder on the market — '
                        'with features that rival tools costing 10× more.',
                    style: TextStyle(
                        color: Colors.white.withOpacity(0.8), fontSize: 13),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),

                  // Monthly card
                  _pricingCard(
                    context,
                    gradient: [primary, secondary],
                    icon: Icons.calendar_month,
                    title: 'Monthly Subscription',
                    price: '\$10 / month',
                    subtext: 'Min. 3-month commitment · cancel anytime after',
                    badge: '🔥 MOST POPULAR',
                    perks: [
                      'Unlimited AAB builds',
                      'Full AI App Maker access',
                      'Voice-controlled development',
                      'PlayStation & Android bundlers',
                      'Viral marketing suite',
                      'Cloud build pipeline',
                      'Priority support',
                    ],
                    onTap: onMonthly,
                  ),

                  const SizedBox(height: 16),

                  // Pay-per-AAB card
                  _pricingCard(
                    context,
                    gradient: [Colors.deepOrange, Colors.orange],
                    icon: Icons.upload_file,
                    title: 'Pay Per App Build',
                    price: '\$50 per AAB file',
                    subtext: 'One-time payment · no subscription needed',
                    badge: '🎯 ONE-OFF',
                    perks: [
                      'Single production AAB file',
                      'Play Store ready',
                      'Full build pipeline',
                      'App signing & bundling',
                    ],
                    onTap: onPayPerAAB,
                  ),

                  const SizedBox(height: 16),

                  // 2-hour trial reminder
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.green.withOpacity(0.4)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.timer, color: Colors.green),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                '2-Hour Free Trial',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'New users get full access free for 2 hours — '
                                    'no credit card required.',
                                style: TextStyle(
                                    color: Colors.white.withOpacity(0.8),
                                    fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Avatar ad
          AvatarCard(
            avatarId: avatarId,
            message: AvatarAI.getAd(),
          ),
        ],
      ),
    );
  }

  Widget _explainerRow(
      IconData icon, Color color, String title, String body) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color.withOpacity(0.15),
            border: Border.all(color: color.withOpacity(0.5)),
          ),
          child: Icon(icon, color: color, size: 18),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13),
              ),
              const SizedBox(height: 4),
              Text(
                body,
                style: TextStyle(
                    color: Colors.white.withOpacity(0.75), fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _pricingCard(
    BuildContext context, {
    required List<Color> gradient,
    required IconData icon,
    required String title,
    required String price,
    required String subtext,
    required String badge,
    required List<String> perks,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
              colors: gradient.map((c) => c.withOpacity(0.2)).toList()),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: gradient.first.withOpacity(0.6), width: 2),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: gradient.first, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15),
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: gradient.first.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    badge,
                    style: TextStyle(
                        color: gradient.first,
                        fontSize: 10,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              price,
              style: TextStyle(
                  color: gradient.first,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(color: gradient.first, blurRadius: 8)]),
            ),
            Text(
              subtext,
              style:
                  TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11),
            ),
            const SizedBox(height: 12),
            ...perks.map(
              (p) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  children: [
                    Icon(Icons.check_circle, color: gradient.first, size: 14),
                    const SizedBox(width: 8),
                    Text(p,
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 12)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: gradient),
                borderRadius: BorderRadius.circular(30),
              ),
              child: const Center(
                child: Text(
                  'Unlock Now →',
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
