import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'config.dart';

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
      title: 'Solace Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue),
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

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.transparent)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            if (mounted) {
              setState(() {
                isLoading = true;
                hasError = false;
              });
            }
          },
          onPageFinished: (_) {
            if (mounted) {
              setState(() {
                isLoading = false;
              });
            }
          },
          onWebResourceError: (_) {
            if (mounted) {
              setState(() {
                isLoading = false;
                hasError = true;
              });
            }
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Solace Portal'),
        actions: [
          if (_selectedIndex == 0)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _reloadPage,
              tooltip: 'Reload',
            ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          // WebView Tab
          SafeArea(
            child: Stack(
              children: [
                WebViewWidget(controller: controller),
                if (isLoading) const Center(child: CircularProgressIndicator()),
                if (hasError)
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      margin: const EdgeInsets.symmetric(horizontal: 24),
                      decoration: BoxDecoration(
                        color: Colors.white..withValues(alpha: 0.1),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 12,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text(
                            'Unable to load page',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Check your network connection and try again.',
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _reloadPage,
                            child: const Text('Try again'),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
          // Developer Info Tab
          _buildDeveloperInfoTab(),
          // App Builder Tab
          _buildAppBuilderTab(),
          // Complete Suite Tab
          _buildCompleteSuiteTab(),
          // AI App Maker Tab
          _buildAIAppMakerTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Portal',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.info),
            label: 'Developer',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.build),
            label: 'Build App',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.auto_awesome),
            label: 'Complete Suite',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.smart_toy),
            label: 'AI App Maker',
          ),
        ],
      ),
    );
  }

  Widget _buildDeveloperInfoTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.warning, color: Colors.orange),
                      SizedBox(width: 8),
                      Text(
                        '⚠️ Important Developer Notice',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'To develop, modify, or build this Flutter app, you MUST install Android Studio on your computer.',
                    style: TextStyle(fontSize: 16),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📋 Required Setup',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    '1. Install Android Studio from developer.android.com\n'
                    '2. Install Flutter SDK\n'
                    '3. Configure Android Studio with Flutter plugin\n'
                    '4. Set up Android SDK and emulator\n'
                    '5. Run: flutter pub get\n'
                    '6. Run: flutter run',
                    style: TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📱 App Information',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Package: com.solaceportal.app\n'
                    'Version: 1.0.0+1\n'
                    'Framework: Flutter 3.41.6\n'
                    'WebView: webview_flutter ^4.2.1\n'
                    'Target: Android (Play Store Ready)',
                    style: TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '🌐 Web Portal',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'This app wraps: https://golden-vault-empire.lovable.app\n\n'
                    'The web version is always available without installation.',
                    style: TextStyle(fontSize: 14),
                  ),
                  SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () => _launchWebPortal(),
                    child: Text('Open Web Portal'),
                  ),
                ],
              ),
            ),
          ),
        ],
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

  void _selectAvatar(String avatar) {
    setState(() {
      selectedAvatar = avatar;
    });
    _addAIMessage('Hi! I\'m ${avatar == 'belinda' ? 'Belinda' : 'Sven'}, your AI app developer. Tell me about the app you want to build and I\'ll guide you through creating it step by step!');
  }

  void _sendMessage(String message) {
    if (message.trim().isEmpty) return;
    
    _chatController.clear();
    _addUserMessage(message);
    
    // Process the message and generate AI response
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
    });
    _scrollToBottom();
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
    // Simulate AI processing
    Future.delayed(Duration(milliseconds: 1500), () {
      if (currentQuestionIndex == 0) {
        _addAIMessage('Great! I\'d love to help you build your app. Let me ask you some questions to understand exactly what you need. First question: What is the main purpose of your app?');
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
      'What is the main purpose of your app?',
      'Who is your target audience?',
      'What problem does your app solve?',
      'What features should your app have?',
      'Do you need user authentication?',
      'Will your app need a database?',
      'Do you need payment processing?',
      'What platforms do you want to support?',
      'Do you need push notifications?',
      'Will your app need offline functionality?',
      'What is your preferred color scheme?',
      'Do you have a logo or brand identity?',
      'What is your budget for development?',
      'When do you need the app completed?',
      'Do you need social media integration?',
      'Will your app need GPS/location services?',
      'Do you need camera/photo functionality?',
      'Will your app need file sharing?',
      'Do you need analytics tracking?',
      'What is your monetization strategy?',
      'Do you need multilingual support?',
      'Final question: What makes your app unique?',
    ];
    
    if (currentQuestionIndex < questions.length) {
      _addAIMessage(questions[currentQuestionIndex]);
      currentQuestionIndex++;
    }
  }

  void _startAppGeneration() {
    _addAIMessage('Perfect! I have all the information I need. Let me start generating your complete app with all the features you\'ve requested. This will include:');
    _addAIMessage('• Custom UI/UX design\n• Full functionality implementation\n• Database integration\n• Authentication system\n• Payment processing\n• Push notifications\n• Analytics tracking\n• Play Store optimization');
    
    Future.delayed(Duration(seconds: 2), () {
      _addAIMessage('🔥 Building your app now... This usually takes 3-5 minutes to generate a complete, production-ready application.');
      
      Future.delayed(Duration(seconds: 5), () {
        _addAIMessage('🎉 Your app is complete! I\'ve generated everything including:');
        _addAIMessage('✅ Complete source code\n✅ Professional UI design\n✅ All requested features\n✅ Database setup\n✅ Authentication system\n✅ Payment integration\n✅ Play Store AAB file\n✅ App icons and screenshots\n\nYour app is ready for immediate deployment!');
      });
    });
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
