import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'holographic_ui.dart';
import 'avatar_ai.dart';

class CompleteDevSuite {
  static const String packageName = 'Solace-Complete-Dev-Suite';
  static const String version = '1.0.0';
  
  // Platform support
  static const List<String> supportedPlatforms = [
    'Android', 'iOS', 'Web', 'Windows', 'macOS', 'Linux', 'PlayStation', 'Xbox', 'Switch'
  ];
  
  // Development tools included
  static const List<String> includedTools = [
    'Android Studio Integration',
    'Visual Studio Code Templates',
    'PlayStation SDK Bundler',
    'Xbox Development Kit',
    'Nintendo Switch Tools',
    'Cross-Platform Builder',
    'AI Code Generator',
    'Automatic Testing Suite',
    'Cloud Build System',
    'App Store Deployment',
  ];
  
  // Features included
  static const List<String> premiumFeatures = [
    'Multi-Platform Support',
    'AI-Powered Development',
    'Voice-Controlled Coding',
    'Holographic UI Templates',
    'Automatic Testing',
    'Cloud Build Pipeline',
    'App Store Optimization',
    'Analytics Integration',
    'Monetization Tools',
    'Viral Marketing Suite',
  ];
}

class CompleteDevSuiteWidget extends StatefulWidget {
  const CompleteDevSuiteWidget({Key? key}) : super(key: key);

  @override
  _CompleteDevSuiteWidgetState createState() => _CompleteDevSuiteWidgetState();
}

class _CompleteDevSuiteWidgetState extends State<CompleteDevSuiteWidget>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _rotateController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _rotateAnimation;
  
  String _selectedPlatform = 'Android';
  String _selectedTool = 'Android Studio Integration';

  @override
  void initState() {
    super.initState();
    
    _pulseController = AnimationController(
      duration: Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _rotateController = AnimationController(
      duration: Duration(seconds: 20),
      vsync: this,
    );
    
    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.1,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
    
    _rotateAnimation = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(_rotateController);
    
    _pulseController.repeat(reverse: true);
    _rotateController.repeat();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _rotateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          // Header with rotating logo
          _buildHeader(),
          
          SizedBox(height: 16),
          
          // Platform selector
          _buildPlatformSelector(),
          
          SizedBox(height: 16),
          
          // Tools section
          _buildToolsSection(),
          
          SizedBox(height: 16),
          
          // Features showcase
          _buildFeaturesSection(),
          
          SizedBox(height: 16),
          
          // Download section
          _buildDownloadSection(),
          
          SizedBox(height: 16),
          
          // Installation guide
          _buildInstallationGuide(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return HolographicCard(
          depth: 40,
          height: 150,
          glowing: true,
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  HolographicTheme.primaryHologram,
                  HolographicTheme.secondaryHologram,
                  HolographicTheme.accentHologram,
                ],
              ),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AnimatedBuilder(
                    animation: _rotateAnimation,
                    builder: (context, child) {
                      return Transform.rotate(
                        angle: _rotateAnimation.value,
                        child: Icon(
                          Icons.code,
                          size: 50,
                          color: Colors.white,
                        ),
                      );
                    },
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Complete Development Suite',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: HolographicTheme.primaryHologram,
                          blurRadius: 20,
                        ),
                      ],
                    ),
                  ),
                  Text(
                    'All-in-One Package - ${CompleteDevSuite.version}',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildPlatformSelector() {
    return HolographicCard(
      depth: 25,
      height: 120,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '🎯 Select Platform',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: CompleteDevSuite.supportedPlatforms.length,
                itemBuilder: (context, index) {
                  final platform = CompleteDevSuite.supportedPlatforms[index];
                  final isSelected = _selectedPlatform == platform;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedPlatform = platform;
                      });
                    },
                    child: Container(
                      margin: EdgeInsets.only(right: 8),
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: isSelected
                          ? LinearGradient(
                              colors: [
                                HolographicTheme.primaryHologram,
                                HolographicTheme.secondaryHologram,
                              ],
                            )
                          : LinearGradient(
                              colors: [
                                Colors.white.withOpacity(0.1),
                                Colors.white.withOpacity(0.05),
                              ],
                            ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSelected
                            ? HolographicTheme.neonBorder
                            : Colors.white.withOpacity(0.3),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          platform,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToolsSection() {
    return HolographicCard(
      depth: 30,
      height: 200,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '🛠️ Development Tools',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 3,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                itemCount: CompleteDevSuite.includedTools.length,
                itemBuilder: (context, index) {
                  final tool = CompleteDevSuite.includedTools[index];
                  final isSelected = _selectedTool == tool;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() { _selectedTool = tool; });
                      if (tool == 'Android Studio Integration') {
                        _showAndroidStudioPaywall(context);
                      }
                    },
                    child: Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: isSelected
                          ? LinearGradient(
                              colors: [
                                Colors.green.withOpacity(0.8),
                                Colors.blue.withOpacity(0.8),
                              ],
                            )
                          : LinearGradient(
                              colors: [
                                Colors.white.withOpacity(0.1),
                                Colors.white.withOpacity(0.05),
                              ],
                            ),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isSelected
                            ? Colors.green
                            : Colors.white.withOpacity(0.3),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          tool,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturesSection() {
    return HolographicCard(
      depth: 25,
      height: 180,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '✨ Premium Features',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                itemCount: CompleteDevSuite.premiumFeatures.length,
                itemBuilder: (context, index) {
                  final feature = CompleteDevSuite.premiumFeatures[index];
                  return Padding(
                    padding: EdgeInsets.symmetric(vertical: 2),
                    child: Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 16),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            feature,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDownloadSection() {
    return HolographicCard(
      depth: 35,
      height: 160,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              '📥 Download Complete Suite',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),
            Text(
              'Package Size: 2.8 GB\nIncludes all tools and templates',
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: HolographicButton(
                    text: 'Download for Windows',
                    onPressed: _downloadWindows,
                    primaryColor: Colors.blue,
                    secondaryColor: Colors.cyan,
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: HolographicButton(
                    text: 'Download for macOS',
                    onPressed: _downloadMacOS,
                    primaryColor: Colors.orange,
                    secondaryColor: Colors.red,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInstallationGuide() {
    return HolographicCard(
      depth: 20,
      height: 140,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📋 Installation Guide',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: Text(
                '1. Download the package for your platform\n'
                '2. Extract to your development folder\n'
                '3. Run setup.exe (Windows) or installer.pkg (macOS)\n'
                '4. Follow the installation wizard\n'
                '5. Launch Complete Dev Suite',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _downloadWindows() {
    // Simulate download
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🚀 Downloading Complete Dev Suite for Windows...'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _downloadMacOS() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🚀 Downloading Complete Dev Suite for macOS...'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _showAndroidStudioPaywall(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(16),
        child: Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0A0A0F), Color(0xFF1A0B2E)],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: HolographicTheme.neonBorder.withOpacity(0.6),
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: HolographicTheme.primaryHologram.withOpacity(0.4),
                blurRadius: 30,
                spreadRadius: 4,
              ),
            ],
          ),
          padding: const EdgeInsets.all(24),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.android, color: Colors.green, size: 52),
                const SizedBox(height: 12),
                const Text(
                  'Android Studio Integration',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                // Avatar praise + paywall
                AvatarCard(
                  avatarId: 'belinda',
                  message:
                      '${AvatarAI.getPraise()}\n\n'
                      'The Android Studio integration is a **Premium feature**. '
                      'It ships the full Android Studio toolchain pre-configured '
                      'for our pipeline — saving you hours of setup.\n\n'
                      '${AvatarAI.getUpsell()}',
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.withOpacity(0.5)),
                  ),
                  child: Column(
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.info_outline, color: Colors.amber),
                          SizedBox(width: 8),
                          Text(
                            'What\'s included',
                            style: TextStyle(
                                color: Colors.amber,
                                fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ...[
                        'Android Studio 2024 pre-configured',
                        'Solace build plugin installed',
                        'Keystore & signing wizard',
                        'One-click AAB bundler',
                        'Emulator presets for 12 devices',
                        'Firebase & Stripe SDKs pre-wired',
                      ].map(
                        (f) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 2),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle,
                                  color: Colors.green, size: 14),
                              const SizedBox(width: 8),
                              Text(f,
                                  style: TextStyle(
                                      color: Colors.white.withOpacity(0.9),
                                      fontSize: 12)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () => Navigator.of(ctx).pop(),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          HolographicTheme.primaryHologram,
                          HolographicTheme.secondaryHologram,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: const Center(
                      child: Text(
                        'Upgrade to Premium — \$10/month →',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 15),
                      ),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: Text(
                    'Maybe later',
                    style: TextStyle(color: Colors.white.withOpacity(0.5)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
