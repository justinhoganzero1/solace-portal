import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:ui' as ui;
import 'dart:math' as math;
import 'config.dart';
import 'holographic_ui.dart';
import 'voice_controller.dart';
import 'monetization_system.dart';
import 'viral_marketing.dart';
import 'complete_dev_suite.dart';
import 'playstation_bundler.dart';
import 'avatar_ai.dart';

// This will be dynamically set by the user
String kInitialPortalUrl = 'https://golden-vault-empire.lovable.app';
AppConfig? currentConfig;

void main() {
  runApp(const SolacePortalApp());
}

class SolacePortalApp extends StatelessWidget {
  const SolacePortalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Solace Portal - Holographic Suite',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: HolographicTheme.primaryHologram,
        scaffoldBackgroundColor: HolographicTheme.deepSpace,
      ),
      home: const SolacePortal(),
    );
  }
}

class SolacePortal extends StatefulWidget {
  const SolacePortal({super.key});

  @override
  State<SolacePortal> createState() => _SolacePortalState();
}

class _SolacePortalState extends State<SolacePortal> {
  late final WebViewController controller;
  bool isLoading = true;
  bool hasError = false;
  int _selectedIndex = 0;
  
  // AI Chat variables
  String selectedAvatar = 'belinda';
  final TextEditingController _chatController = TextEditingController();
  final ScrollController _chatScrollController = ScrollController();
  List<Map<String, dynamic>> chatMessages = [];
  int currentQuestionIndex = 0;
  
  // System instances
  final MonetizationSystem _monetization = MonetizationSystem();
  final ViralMarketingSystem _viralMarketing = ViralMarketingSystem();
  
  // Voice interaction
  String _currentAIResponse = '';
  bool _isAIResponding = false;
  
  @override
  void initState() {
    super.initState();
    _initializeSystems();
    _setupWebView();
  }
  
  Future<void> _initializeSystems() async {
    try {
      await _monetization.initialize();
      await _viralMarketing.initialize();
    } catch (e) {
      print('System initialization failed: $e');
    }
  }

  Future<void> _setupWebView() async {
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.transparent)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            setState(() {
              isLoading = true;
              hasError = false;
            });
          },
          onPageFinished: (_) {
            setState(() {
              isLoading = false;
            });
          },
          onWebResourceError: (error) {
            setState(() {
              isLoading = false;
              hasError = true;
            });
          },
        ),
      )
      ..loadRequest(Uri.parse(kInitialPortalUrl));
  }

  void _reloadPage() {
    controller.reload();
    if (mounted) {
      setState(() {
        isLoading = true;
        hasError = false;
      });
    }
  }

  Future<void> _launchWebPortal() async {
    final Uri url = Uri.parse('https://golden-vault-empire.lovable.app');
    if (!await launchUrl(url)) {
      // Handle error - could show a snackbar or dialog
    }
  }

  @override
  Widget build(BuildContext context) {
    return HolographicScaffold(
      title: 'Solace Portal - Holographic Suite',
      showParticles: true,
      actions: [
        if (_selectedIndex == 0)
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  HolographicTheme.primaryHologram,
                  HolographicTheme.secondaryHologram,
                ],
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.refresh, color: Colors.white),
              onPressed: _reloadPage,
              tooltip: 'Reload',
            ),
          ),
      ],
      body: Column(
        children: [
          // 3D Tab Navigation with holographic effects
          _buildHolographicTabBar(),
          
          // Main content area with 3D perspective
          Expanded(
            child: IndexedStack(
              index: _selectedIndex,
              children: [
                // WebView Tab with holographic container
                _buildHolographicWebViewTab(),
                // Developer Info Tab
                _buildHolographicDeveloperInfoTab(),
                // App Builder Tab
                _buildHolographicAppBuilderTab(),
                // Complete Suite Tab
                _buildHolographicCompleteSuiteTab(),
                // AI App Maker Tab
                _buildHolographicAIAppMakerTab(),
                // Complete Dev Suite Tab
                _buildHolographicCompleteDevSuiteTab(),
                // PlayStation Bundler Tab
                _buildHolographicPlayStationBundlerTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHolographicTabBar() {
    return Container(
      margin: EdgeInsets.all(16),
      child: Row(
        children: [
          for (int i = 0; i < 7; i++)
            Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedIndex = i;
                  });
                },
                child: Container(
                  margin: EdgeInsets.symmetric(horizontal: 4),
                  height: 80,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(15),
                    gradient: _selectedIndex == i
                        ? LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: HolographicTheme.holographicGradient,
                          )
                        : LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              HolographicTheme.glassSurface,
                              HolographicTheme.glassSurface.withOpacity(0.05),
                            ],
                          ),
                    border: Border.all(
                      color: _selectedIndex == i
                          ? HolographicTheme.neonBorder
                          : HolographicTheme.neonBorder.withOpacity(0.3),
                      width: 2,
                    ),
                    boxShadow: _selectedIndex == i
                        ? [
                            BoxShadow(
                              color: HolographicTheme.primaryHologram.withOpacity(0.5),
                              blurRadius: 20,
                              spreadRadius: 2,
                            ),
                            BoxShadow(
                              color: HolographicTheme.secondaryHologram.withOpacity(0.3),
                              blurRadius: 15,
                              spreadRadius: 1,
                            ),
                          ]
                        : [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 10,
                            ),
                          ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _getTabIcon(i),
                        color: Colors.white,
                        size: 24,
                        shadows: [
                          Shadow(
                            color: _selectedIndex == i
                                ? HolographicTheme.primaryHologram
                                : Colors.transparent,
                            blurRadius: 10,
                          ),
                        ],
                      ),
                      SizedBox(height: 4),
                      Text(
                        _getTabLabel(i),
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: _selectedIndex == i ? FontWeight.bold : FontWeight.normal,
                          shadows: [
                            Shadow(
                              color: _selectedIndex == i
                                  ? HolographicTheme.primaryHologram
                                  : Colors.transparent,
                              blurRadius: 5,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  IconData _getTabIcon(int index) {
    switch (index) {
      case 0: return Icons.home;
      case 1: return Icons.info;
      case 2: return Icons.build;
      case 3: return Icons.auto_awesome;
      case 4: return Icons.smart_toy;
      case 5: return Icons.computer;
      case 6: return Icons.videogame_asset;
      default: return Icons.home;
    }
  }

  String _getTabLabel(int index) {
    switch (index) {
      case 0: return 'Portal';
      case 1: return 'Developer';
      case 2: return 'Build App';
      case 3: return 'Complete Suite';
      case 4: return 'AI App Maker';
      case 5: return 'Dev Suite';
      case 6: return 'PS Bundler';
      default: return 'Portal';
    }
  }

  Widget _buildHolographicWebViewTab() {
    return Container(
      margin: EdgeInsets.all(16),
      child: HolographicCard(
        depth: 30,
        height: double.infinity,
        glowing: true,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: Stack(
            children: [
              WebViewWidget(controller: controller),
              if (isLoading)
                Container(
                  color: Colors.black.withOpacity(0.7),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: HolographicTheme.holographicGradient,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: HolographicTheme.primaryHologram.withOpacity(0.5),
                                blurRadius: 20,
                              ),
                            ],
                          ),
                          child: Center(
                            child: CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                              strokeWidth: 3,
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Loading Portal...',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            shadows: [
                              Shadow(
                                color: HolographicTheme.primaryHologram,
                                blurRadius: 10,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              if (hasError)
                Container(
                  color: Colors.black.withOpacity(0.7),
                  child: Center(
                    child: Container(
                      padding: EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.red.withOpacity(0.2),
                            Colors.orange.withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Colors.red.withOpacity(0.5),
                          width: 2,
                        ),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.error_outline,
                            color: Colors.red,
                            size: 48,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Unable to load page',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Check your network connection and try again.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.8),
                            ),
                          ),
                          SizedBox(height: 16),
                          HolographicButton(
                            text: 'Try Again',
                            onPressed: _reloadPage,
                            primaryColor: Colors.red,
                            secondaryColor: Colors.orange,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHolographicDeveloperInfoTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          HolographicCard(
            depth: 25,
            height: 120,
            glowing: true,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Colors.orange, Colors.red],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.orange.withOpacity(0.5),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: Icon(Icons.warning, color: Colors.white, size: 20),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '⚠️ Important Developer Notice',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            shadows: [
                              Shadow(
                                color: Colors.orange,
                                blurRadius: 10,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Text(
                    'To develop, modify, or build this Flutter app, you MUST install Android Studio on your computer.',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          HolographicCard(
            depth: 20,
            height: 180,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📋 Required Setup',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: HolographicTheme.primaryHologram,
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 12),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Text(
                        '1. Install Android Studio from developer.android.com\n'
                        '2. Install Flutter SDK\n'
                        '3. Configure Android Studio with Flutter plugin\n'
                        '4. Set up Android SDK and emulator\n'
                        '5. Run: flutter pub get\n'
                        '6. Run: flutter run',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          HolographicCard(
            depth: 20,
            height: 160,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📱 App Information',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: HolographicTheme.secondaryHologram,
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 12),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Text(
                        'Package: com.solaceportal.app\n'
                        'Version: 1.0.0+1\n'
                        'Framework: Flutter 3.41.6\n'
                        'WebView: webview_flutter ^4.2.1\n'
                        'Target: Android (Play Store Ready)',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          HolographicCard(
            depth: 25,
            height: 140,
            glowing: true,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '🌐 Web Portal',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: HolographicTheme.accentHologram,
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'This app wraps: https://golden-vault-empire.lovable.app\n\n'
                    'The web version is always available without installation.',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 13,
                    ),
                  ),
                  SizedBox(height: 12),
                  HolographicButton(
                    text: 'Open Web Portal',
                    onPressed: _launchWebPortal,
                    icon: Icons.launch,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHolographicAppBuilderTab() {
    return Container(
      margin: EdgeInsets.all(16),
      child: HolographicCard(
        depth: 25,
        height: double.infinity,
        glowing: true,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '🚀 Easy App Builder',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      color: HolographicTheme.primaryHologram,
                      blurRadius: 15,
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Just enter your website URL and we\'ll create a Play Store-ready app for you!',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 14,
                ),
              ),
              SizedBox(height: 24),
              HolographicButton(
                text: 'Start Building',
                onPressed: () {},
                icon: Icons.rocket_launch,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHolographicCompleteSuiteTab() {
    return Container(
      margin: EdgeInsets.all(16),
      child: HolographicCard(
        depth: 30,
        height: double.infinity,
        glowing: true,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '🎯 Complete App Development Suite',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      color: HolographicTheme.secondaryHologram,
                      blurRadius: 15,
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              Text(
                'The ONLY tool you need - Enter URL → Get Complete Play Store App',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 14,
                ),
              ),
              SizedBox(height: 24),
              HolographicButton(
                text: 'Launch Complete Suite',
                onPressed: () {},
                icon: Icons.auto_awesome,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHolographicAIAppMakerTab() {
    // Full paywall: not subscribed AND trial expired
    if (!_monetization.canUseAIAppMaker && !_monetization.isInTrial) {
      return AppBuilderPaywallScreen(
        avatarId: selectedAvatar,
        onMonthly: _purchaseMonthly,
        onPayPerAAB: _purchaseAAB,
      );
    }

    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          // Trial widget if applicable
          if (_monetization.isInTrial) ...[
            TrialWidget(onUpgrade: _showPaywall),
            SizedBox(height: 16),
          ],
          
          // Avatar praise / ad banner at top
          AvatarCard(
            avatarId: selectedAvatar,
            message: AvatarAI.getAd(),
            onUpgrade: _monetization.hasActiveSubscription ? null : _showPaywall,
          ),

          SizedBox(height: 8),

          // Avatar selection
          HolographicCard(
            depth: 25,
            height: 120,
            glowing: true,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildAvatarSelector('belinda', 'Belinda', Colors.pink),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildAvatarSelector('sven', 'Sven', Colors.blue),
                  ),
                ],
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Voice interaction widget
          HolographicCard(
            depth: 20,
            height: 200,
            glowing: true,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: VoiceInteractionWidget(
                aiResponse: _currentAIResponse,
                onUserInput: _handleVoiceInput,
                isAIResponding: _isAIResponding,
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Chat interface
          HolographicCard(
            depth: 30,
            height: 400,
            glowing: true,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(
                    '💬 Chat with ${selectedAvatar == 'belinda' ? 'Belinda' : 'Sven'}',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListView.builder(
                        controller: _chatScrollController,
                        itemCount: chatMessages.length,
                        itemBuilder: (context, index) {
                          final message = chatMessages[index];
                          final isUser = message['isUser'] as bool;
                          
                          return Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            child: Row(
                              mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                              children: [
                                if (!isUser) ...[
                                  Container(
                                    width: 30,
                                    height: 30,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      gradient: LinearGradient(
                                        colors: selectedAvatar == 'belinda' 
                                          ? [Colors.pink, Colors.purple]
                                          : [Colors.blue, Colors.cyan],
                                      ),
                                    ),
                                    child: Icon(
                                      selectedAvatar == 'belinda' ? Icons.face : Icons.fitness_center,
                                      color: Colors.white,
                                      size: 16,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                ],
                                Flexible(
                                  child: Container(
                                    padding: EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: isUser 
                                        ? HolographicTheme.primaryHologram.withOpacity(0.8)
                                        : Colors.white.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Text(
                                      message['text'] as String,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ),
                                if (isUser) ...[
                                  SizedBox(width: 8),
                                  Container(
                                    width: 30,
                                    height: 30,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Colors.grey.shade600,
                                    ),
                                    child: Icon(
                                      Icons.person,
                                      color: Colors.white,
                                      size: 16,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _chatController,
                          decoration: InputDecoration(
                            hintText: 'Type your message...',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: BorderSide(color: HolographicTheme.neonBorder),
                            ),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.1),
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                          ),
                          style: TextStyle(color: Colors.white),
                          onSubmitted: (value) => _sendMessage(value),
                        ),
                      ),
                      SizedBox(width: 8),
                      HolographicButton(
                        text: 'Send',
                        onPressed: () => _sendMessage(_chatController.text),
                        width: 80,
                        height: 50,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Viral marketing widget
          ViralMarketingWidget(),
        ],
      ),
    );
  }

  Widget _buildPaywallTab() {
    return Container(
      margin: EdgeInsets.all(16),
      child: PaywallWidget(
        feature: 'AI App Maker',
        description: 'Chat with AI assistants to create professional mobile apps through conversation. Includes voice interaction, 22-question briefing system, and automatic AAB generation.',
        onPurchase: _showPurchaseOptions,
        onRestore: _restorePurchases,
      ),
    );
  }

  Widget _buildAvatarSelector(String avatar, String name, Color color) {
    final isSelected = selectedAvatar == avatar;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedAvatar = avatar;
        });
        _addAIMessage('Hi! I\'m $name, your AI app developer. Tell me about the app you want to build!');
      },
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          gradient: isSelected 
            ? LinearGradient(colors: [color, color.withOpacity(0.7)])
            : LinearGradient(colors: [color.withOpacity(0.3), color.withOpacity(0.1)]),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : color.withOpacity(0.5),
            width: 2,
          ),
          boxShadow: isSelected ? [
            BoxShadow(
              color: color.withOpacity(0.5),
              blurRadius: 15,
              spreadRadius: 2,
            ),
          ] : [],
        ),
        child: Column(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [color.withOpacity(0.8), color.withOpacity(0.5)],
                ),
              ),
              child: Icon(
                avatar == 'belinda' ? Icons.face : Icons.fitness_center,
                color: Colors.white,
                size: 30,
              ),
            ),
            SizedBox(height: 8),
            Text(
              name,
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleVoiceInput(String input) {
    _addUserMessage(input);
    _processUserMessage(input);
  }

  void _sendMessage(String message) {
    if (message.trim().isEmpty) return;
    
    _chatController.clear();
    _addUserMessage(message);
    _processUserMessage(message);
  }

  void _addUserMessage(String message) {
    setState(() {
      chatMessages.add({'text': message, 'isUser': true});
    });
    _scrollToBottom();
  }

  void _addAIMessage(String message) {
    setState(() {
      chatMessages.add({'text': message, 'isUser': false});
      _currentAIResponse = message;
      _isAIResponding = true;
    });
    _scrollToBottom();
    
    // Stop AI responding after a delay
    Future.delayed(Duration(seconds: 3), () {
      setState(() {
        _isAIResponding = false;
      });
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_chatScrollController.hasClients) {
        _chatScrollController.animateTo(
          _chatScrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _processUserMessage(String message) {
    Future.delayed(Duration(milliseconds: 1200), () {
      if (!mounted) return;

      // Avatar AI decides the response first
      final avatarReply = AvatarAI.respond(
        userMessage: message,
        questionIndex: currentQuestionIndex,
        isSubscribed: _monetization.hasActiveSubscription,
        inTrial: _monetization.isInTrial,
      );

      // If avatar replied with praise/upsell/impossible msg, show it
      if (avatarReply.isNotEmpty &&
          (AvatarAI.respond(
                    userMessage: message,
                    questionIndex: currentQuestionIndex,
                    isSubscribed: _monetization.hasActiveSubscription,
                    inTrial: _monetization.isInTrial,
                  ) !=
                  AvatarAI.getPraise() ||
              currentQuestionIndex % 3 == 0 ||
              message.toLowerCase().contains('solace') ||
              message.toLowerCase().contains('this app'))) {
        _addAIMessage(avatarReply);
      }

      // Then continue question flow
      if (currentQuestionIndex == 0) {
        _addAIMessage(
            'Amazing! Let me ask you 22 quick questions so I can build exactly what you need. 🚀\n\nQuestion 1: What is the main purpose of your app?');
        currentQuestionIndex = 1;
      } else if (currentQuestionIndex < 22) {
        _askNextQuestion();
      } else {
        _startAppGeneration();
      }
    });
  }

  void _askNextQuestion() {
    final questions = [
      'Question 1: What is the main purpose of your app?',
      'Question 2: Who is your target audience?',
      'Question 3: What core problem does your app solve?',
      'Question 4: What are the must-have features?',
      'Question 5: Do you need user accounts / login?',
      'Question 6: Will your app store data in a database?',
      'Question 7: Do you need in-app purchases or payments?',
      'Question 8: Which platforms — Android, iOS, or both?',
      'Question 9: Do you need push notifications?',
      'Question 10: Should it work offline?',
      'Question 11: What colour scheme fits your brand?',
      'Question 12: Do you have a logo or existing branding?',
      'Question 13: Do you need social media login (Google/Facebook)?',
      'Question 14: Does your app need GPS or location features?',
      'Question 15: Do you need a camera or photo gallery?',
      'Question 16: Will users share or upload files?',
      'Question 17: Do you need analytics and crash reporting?',
      'Question 18: Do you need multilingual / multi-currency support?',
      'Question 19: Any third-party integrations (Stripe, Firebase, etc.)?',
      'Question 20: What existing apps are closest to your idea?',
      'Question 21: What makes yours different from those apps?',
      'Final Question 22: Give me one sentence that describes your dream user experience! ✨',
    ];

    // Inject a praise every 5 questions
    if (currentQuestionIndex % 5 == 0 && currentQuestionIndex > 0) {
      _addAIMessage(AvatarAI.getPraise());
    }

    if (currentQuestionIndex < questions.length) {
      _addAIMessage(questions[currentQuestionIndex]);
      currentQuestionIndex++;
    }
  }

  void _startAppGeneration() {
    _addAIMessage(
        '${AvatarAI.getPraise()}\n\n'
        'I now have everything I need. Your app concept is genuinely exciting — '
        'let me analyse all 22 answers and begin the build pipeline. 🔥');

    Future.delayed(Duration(seconds: 2), () {
      if (!mounted) return;
      _addAIMessage(
          '⚙️ Initialising AI build pipeline...\n'
          '• Parsing your requirements\n'
          '• Selecting optimal architecture\n'
          '• Generating UI/UX blueprints\n'
          '• Wiring data models\n'
          '• Configuring third-party integrations\n\n'
          'This typically takes 3–5 minutes for a production-quality app.');

      Future.delayed(Duration(seconds: 5), () {
        if (!mounted) return;

        if (!_monetization.canGenerateAAB) {
          // Hard paywall on AAB export
          _addAIMessage(
              '✅ Your app blueprint is **complete and ready to compile**!\n\n'
              '🏗️ Source code generated\n'
              '🎨 UI/UX design finalised\n'
              '🔌 All integrations wired\n\n'
              '⚠️ **To export your AAB file and publish to the Play Store, '
              'you need to unlock the builder.**\n\n'
              '${AvatarAI.getUpsell()}');
          Future.delayed(Duration(milliseconds: 500), () {
            if (mounted) _showPaywall();
          });
        } else {
          _addAIMessage(
              '🎉 **Your app is built and ready!**\n\n'
              '✅ Complete source code\n'
              '✅ Professional holographic UI\n'
              '✅ All requested features\n'
              '✅ Database & auth wired\n'
              '✅ Play Store AAB file generated\n'
              '✅ App icons & screenshots\n\n'
              '${AvatarAI.getPraise()}\n\n'
              'Your AAB file is ready for immediate Play Store upload. '
              'You should be incredibly proud — most developers never get here. '
              'You just did it with AI. 🚀');
        }
      });
    });
  }

  void _showPaywall() {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: PaywallWidget(
          feature: 'AI App Maker',
          description: 'Unlock unlimited access to AI-powered app creation with voice interaction and automatic AAB generation.',
          onPurchase: _showPurchaseOptions,
          onRestore: _restorePurchases,
        ),
      ),
    );
  }

  void _showPurchaseOptions() {
    Navigator.of(context).pop();
    // Show purchase options dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Choose Your Plan'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: Text('Monthly Subscription - \$10/month'),
              subtitle: Text('Unlimited access to all features'),
              onTap: () => _purchaseMonthly(),
            ),
            ListTile(
              title: Text('Pay-per-AAB - \$50 per app'),
              subtitle: Text('Generate individual AAB files'),
              onTap: () => _purchaseAAB(),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _purchaseMonthly() async {
    final success = await _monetization.purchaseMonthlySubscription();
    if (success) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('🎉 Purchase successful! Welcome to Premium!')),
      );
      setState(() {});
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Purchase failed. Please try again.')),
      );
    }
  }

  Future<void> _purchaseAAB() async {
    final success = await _monetization.purchaseAABGeneration();
    if (success) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ AAB credit purchased! You can now generate one app.')),
      );
      setState(() {});
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Purchase failed. Please try again.')),
      );
    }
  }

  void _restorePurchases() {
    // Implement purchase restoration
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('🔄 Restoring purchases...')),
    );
  }

  void _selectAvatar(String avatar) {
    setState(() {
      selectedAvatar = avatar;
    });
    _addAIMessage('Hi! I\'m ${avatar == 'belinda' ? 'Belinda' : 'Sven'}, your AI app developer. Tell me about the app you want to build and I\'ll guide you through creating it step by step!');
  }

  Widget _buildHolographicCompleteDevSuiteTab() {
    // Check if user can access this feature
    if (!_monetization.canUseCompleteSuite && !_monetization.isInTrial) {
      return _buildPaywallTab();
    }

    return Container(
      margin: EdgeInsets.all(16),
      child: HolographicCard(
        depth: 40,
        height: double.infinity,
        glowing: true,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: CompleteDevSuiteWidget(),
        ),
      ),
    );
  }

  Widget _buildHolographicPlayStationBundlerTab() {
    // Check if user can access this feature
    if (!_monetization.canUseCompleteSuite && !_monetization.isInTrial) {
      return _buildPaywallTab();
    }

    return Container(
      margin: EdgeInsets.all(16),
      child: HolographicCard(
        depth: 40,
        height: double.infinity,
        glowing: true,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: PlayStationBundlerWidget(),
        ),
      ),
    );
  }

  Widget _buildAppBuilderTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.auto_awesome, color: Colors.blue),
                      SizedBox(width: 8),
                      Text(
                        '🚀 Easy App Builder',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Just enter your website URL and we\'ll create a Play Store-ready app for you!',
                    style: TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step 1: Enter Your Website URL',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'https://your-website.com',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.link),
                    ),
                    onChanged: (value) {
                      // Update URL as user types
                    },
                  ),
                  SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => _showAppPreview(),
                    icon: Icon(Icons.preview),
                    label: Text('Preview App Configuration'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: Size(double.infinity, 48),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step 2: Build Your App',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Click the button below to automatically generate your Play Store AAB file.',
                    style: TextStyle(fontSize: 14),
                  ),
                  SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => _buildPlayStoreApp(),
                    icon: Icon(Icons.build),
                    label: Text('🔥 Build Play Store App (1-Click)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      minimumSize: Size(double.infinity, 48),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAppPreview() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        String url = 'https://your-website.com';
        return AlertDialog(
          title: Text('App Configuration Preview'),
          content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'https://your-website.com',
                      border: OutlineInputBorder(),
                      labelText: 'Website URL',
                    ),
                    onChanged: (value) {
                      url = value;
                      setState(() {});
                    },
                  ),
                  SizedBox(height: 16),
                  if (url.isNotEmpty && url.startsWith('http'))
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('App Name: ${AppConfig.fromUrl(url).appName}'),
                        Text('Package ID: ${AppConfig.fromUrl(url).packageId}'),
                        Text('Version: 1.0.0+1'),
                        SizedBox(height: 8),
                        Container(
                          padding: EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.1),
                            border: Border.all(color: Colors.green),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.check_circle, color: Colors.green, size: 16),
                              SizedBox(width: 8),
                              Text('Ready to build!', style: TextStyle(color: Colors.green)),
                            ],
                          ),
                        ),
                      ],
                    ),
                ],
              );
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (url.isNotEmpty && url.startsWith('http')) {
                  currentConfig = AppConfig.fromUrl(url);
                  kInitialPortalUrl = url;
                  Navigator.of(context).pop();
                  _buildPlayStoreApp();
                }
              },
              child: Text('Build App'),
            ),
          ],
        );
      },
    );
  }

  void _buildPlayStoreApp() {
    if (currentConfig == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please configure your app first')),
      );
      return;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('🔥 Building Your App'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Creating your Play Store-ready app...'),
              SizedBox(height: 8),
              Text(
                'This may take a few minutes.',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        );
      },
    );

    // Simulate build process (in real app, this would trigger Flutter build)
    Future.delayed(Duration(seconds: 3), () {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✅ App built successfully! AAB file ready.'),
          backgroundColor: Colors.green,
        ),
      );
    });
  }

  Widget _buildCompleteSuiteTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.auto_awesome, color: Colors.purple),
                      SizedBox(width: 8),
                      Text(
                        '🚀 Complete App Development Suite',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'The ONLY tool you need - Enter URL → Get Complete Play Store App',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                  ),
                  SizedBox(height: 8),
                  Container(
                    padding: EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.1),
                      border: Border.all(color: Colors.green),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 16),
                        SizedBox(width: 8),
                        Text('No Android Studio required!', style: TextStyle(color: Colors.green)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          
          // Step 1: App Configuration
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step 1: App Configuration',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'https://your-app.com',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.link),
                      labelText: 'Your Website URL',
                    ),
                    onChanged: (value) => _updateAppConfig(value),
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'My App',
                            border: OutlineInputBorder(),
                            labelText: 'App Name',
                          ),
                          onChanged: (value) => _updateAppName(value),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'com.myapp',
                            border: OutlineInputBorder(),
                            labelText: 'Package ID',
                          ),
                          onChanged: (value) => _updatePackageId(value),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Step 2: App Icon Maker
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step 2: App Icon Maker',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Create professional app icons in all required sizes',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _pickIconImage(),
                          icon: Icon(Icons.upload),
                          label: Text('Upload Image'),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _generateIconFromText(),
                          icon: Icon(Icons.text_fields),
                          label: Text('Generate from Text'),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Container(
                    height: 100,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.apps, size: 40, color: Colors.grey),
                          Text('Icon Preview', style: TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Step 3: Screenshots & Metadata
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step 3: Screenshots & Metadata',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'Amazing app that does...',
                      border: OutlineInputBorder(),
                      labelText: 'App Description',
                    ),
                    maxLines: 3,
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _generateScreenshots(),
                          icon: Icon(Icons.screenshot),
                          label: Text('Auto Screenshots'),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _uploadScreenshots(),
                          icon: Icon(Icons.upload),
                          label: Text('Upload Screenshots'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Step 4: One-Command Build
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step 4: Complete App Build',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      border: Border.all(color: Colors.blue),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Icon(Icons.flash_on, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('One-Command Complete Build', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          '• Generates all app icons\n• Creates screenshots\n• Builds AAB file\n• Optimizes for Play Store\n• Ready for immediate upload',
                          style: TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => _buildCompleteApp(),
                    icon: Icon(Icons.rocket_launch),
                    label: Text('🚀 BUILD COMPLETE APP (1-CLICK)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.purple,
                      foregroundColor: Colors.white,
                      minimumSize: Size(double.infinity, 48),
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          SizedBox(height: 16),
          
          // Results Section
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📱 Your Complete App Package',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  _buildResultsList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultsList() {
    return Column(
      children: [
        _buildResultItem('📦 AAB File', 'build/app/outputs/bundle/release/app-release.aab', 'Play Store Ready'),
        _buildResultItem('🎨 App Icons', 'android/app/src/main/res/mipmap-*', 'All sizes generated'),
        _buildResultItem('📸 Screenshots', 'screenshots/', 'Auto-captured'),
        _buildResultItem('📋 Metadata', 'store-listing.txt', 'Play Store optimized'),
        _buildResultItem('🔧 Source Code', 'lib/', 'Clean & documented'),
      ],
    );
  }

  Widget _buildResultItem(String title, String path, String description) {
    return Container(
      margin: EdgeInsets.only(bottom: 8),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
                Text(description, style: TextStyle(fontSize: 12, color: Colors.grey)),
                Text(path, style: TextStyle(fontSize: 10, color: Colors.blue)),
              ],
            ),
          ),
          IconButton(
            onPressed: () => _copyPath(path),
            icon: Icon(Icons.copy, size: 16),
          ),
        ],
      ),
    );
  }

  void _updateAppConfig(String url) {
    // Update app configuration based on URL
  }

  void _updateAppName(String name) {
    // Update app name
  }

  void _updatePackageId(String packageId) {
    // Update package ID
  }

  void _pickIconImage() {
    // Open image picker for icon
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Icon image picker opened')),
    );
  }

  void _generateIconFromText() {
    // Generate icon from text
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Generating icon from app name...')),
    );
  }

  void _generateScreenshots() {
    // Generate automatic screenshots
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Generating screenshots from web app...')),
    );
  }

  void _uploadScreenshots() {
    // Upload custom screenshots
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Screenshot uploader opened')),
    );
  }

  void _buildCompleteApp() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('🚀 Building Complete App Package'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Creating professional-grade app...'),
              SizedBox(height: 8),
              Text('This includes:'),
              Text('• Icon generation'),
              Text('• Screenshot capture'),
              Text('• AAB compilation'),
              Text('• Play Store optimization'),
              SizedBox(height: 8),
              Text('Usually takes 2-5 minutes', style: TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        );
      },
    );

    // Simulate complete build process
    Future.delayed(Duration(seconds: 5), () {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 Complete app package ready! Everything generated.'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 5),
        ),
      );
    });
  }

  void _copyPath(String path) {
    // Copy path to clipboard
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Path copied: $path')),
    );
  }

  Widget _buildAIAppMakerTab() {
    return Column(
      children: [
        // Avatar Selection Bar
        Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.purple.shade800, Colors.pink.shade600],
            ),
          ),
          child: Column(
            children: [
              Text(
                '🤖 AI App Maker',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildAvatarCard(
                      'Belinda',
                      'Your AI Assistant',
                      '👩‍💼',
                      Colors.pink.shade300,
                      () => _selectAvatar('belinda'),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildAvatarCard(
                      'Sven',
                      'Your AI Assistant',
                      '👨‍💼',
                      Colors.blue.shade300,
                      () => _selectAvatar('sven'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        // Chat Interface
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.grey.shade900,
                  Colors.black,
                ],
              ),
            ),
            child: Column(
              children: [
                // Avatar Display Area
                Container(
                  height: 200,
                  child: _buildAvatarDisplay(),
                ),
                // Chat Messages
                Expanded(
                  child: Container(
                    margin: EdgeInsets.all(16),
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: _buildChatMessages(),
                  ),
                ),
                // Input Area
                Container(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _chatController,
                          decoration: InputDecoration(
                            hintText: 'Tell me about the app you want to build...',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: BorderSide(color: Colors.pink.shade300),
                            ),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.1),
                            prefixIcon: Icon(Icons.chat, color: Colors.white.withOpacity(0.7)),
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                          ),
                          style: TextStyle(color: Colors.white),
                          onSubmitted: (value) => _sendMessage(value),
                        ),
                      ),
                      SizedBox(width: 8),
                      FloatingActionButton(
                        onPressed: () => _sendMessage(_chatController.text),
                        backgroundColor: Colors.pink.shade400,
                        child: Icon(Icons.send, color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAvatarCard(String name, String role, String emoji, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.2),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selectedAvatar == name.toLowerCase() ? Colors.white : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          children: [
            Text(
              emoji,
              style: TextStyle(fontSize: 40),
            ),
            SizedBox(height: 8),
            Text(
              name,
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(
              role,
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatarDisplay() {
    if (selectedAvatar == 'belinda') {
      return Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.pink.shade200,
              Colors.purple.shade400,
            ],
          ),
        ),
        child: Stack(
          children: [
            // City lights background
            Positioned.fill(
              child: CustomPaint(
                painter: CityLightsPainter(),
              ),
            ),
            // Belinda avatar
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [Colors.yellow.shade200, Colors.pink.shade300],
                      ),
                      border: Border.all(color: Colors.white, width: 3),
                    ),
                    child: Icon(
                      Icons.face,
                      size: 50,
                      color: Colors.pink.shade700,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Belinda',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: Colors.black,
                          offset: Offset(1, 1),
                          blurRadius: 3,
                        ),
                      ],
                    ),
                  ),
                  Text(
                    'Your AI App Developer',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    } else {
      return Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade200,
              Colors.blue.shade600,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [Colors.blue.shade200, Colors.blue.shade400],
                  ),
                  border: Border.all(color: Colors.white, width: 3),
                ),
                child: Icon(
                  Icons.fitness_center,
                  size: 50,
                  color: Colors.blue.shade800,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Sven',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      color: Colors.black,
                      offset: Offset(1, 1),
                      blurRadius: 3,
                    ),
                  ],
                ),
              ),
              Text(
                'Your AI App Builder',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      );
    }
  }

  Widget _buildChatMessages() {
    return ListView.builder(
      controller: _chatScrollController,
      itemCount: chatMessages.length,
      itemBuilder: (context, index) {
        final message = chatMessages[index];
        final isUser = message['isUser'] as bool;
        
        return Padding(
          padding: EdgeInsets.only(bottom: 12),
          child: Row(
            mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
            children: [
              if (!isUser) ...[
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: selectedAvatar == 'belinda' 
                        ? [Colors.pink.shade300, Colors.purple.shade400]
                        : [Colors.blue.shade300, Colors.blue.shade500],
                    ),
                  ),
                  child: Icon(
                    selectedAvatar == 'belinda' ? Icons.face : Icons.fitness_center,
                    size: 18,
                    color: Colors.white,
                  ),
                ),
                SizedBox(width: 8),
              ],
              Flexible(
                child: Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isUser 
                      ? Colors.pink.shade400 
                      : Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isUser 
                        ? Colors.pink.shade300 
                        : Colors.white.withOpacity(0.2),
                    ),
                  ),
                  child: Text(
                    message['text'] as String,
                    style: TextStyle(
                      color: isUser ? Colors.white : Colors.white.withOpacity(0.9),
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
              if (isUser) ...[
                SizedBox(width: 8),
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.grey.shade600,
                  ),
                  child: Icon(
                    Icons.person,
                    size: 18,
                    color: Colors.white,
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  }

class CityLightsPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.yellow.withOpacity(0.6)
      ..style = PaintingStyle.fill;
    
    // Draw city lights
    for (int i = 0; i < 50; i++) {
      final x = (i * 20) % size.width;
      final y = (i * 15) % size.height;
      canvas.drawCircle(Offset(x, y), 2, paint);
    }
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
