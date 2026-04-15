import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:io';
import 'dart:math' as math;
import 'holographic_ui.dart';

class PlayStationBundler {
  static const String ps4SDK = 'PS4 SDK 9.008';
  static const String ps5SDK = 'PS5 SDK 7.00';
  static const String version = '1.0.0';
  
  // PlayStation platforms
  static const List<String> platforms = ['PS4', 'PS5', 'PS VR', 'PS VR2'];
  
  // Supported game engines
  static const List<String> supportedEngines = [
    'Unity', 'Unreal Engine', 'Godot', 'Custom Engine', 'Flutter PS Engine'
  ];
  
  // Export formats
  static const List<String> exportFormats = [
    'PKG', 'FPKG', 'Debug Build', 'Release Build', 'Retail Package'
  ];
}

class PlayStationBundlerWidget extends StatefulWidget {
  const PlayStationBundlerWidget({Key? key}) : super(key: key);

  @override
  _PlayStationBundlerWidgetState createState() => _PlayStationBundlerWidgetState();
}

class _PlayStationBundlerWidgetState extends State<PlayStationBundlerWidget>
    with TickerProviderStateMixin {
  late AnimationController _glowController;
  late Animation<double> _glowAnimation;
  
  String _selectedPlatform = 'PS5';
  String _selectedEngine = 'Unity';
  String _selectedFormat = 'Release Build';
  bool _isBuilding = false;
  double _buildProgress = 0.0;

  @override
  void initState() {
    super.initState();
    
    _glowController = AnimationController(
      duration: Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _glowAnimation = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _glowController,
      curve: Curves.easeInOut,
    ));
    
    _glowController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          // PlayStation branding header
          _buildPlayStationHeader(),
          
          SizedBox(height: 16),
          
          // Platform selection
          _buildPlatformSelection(),
          
          SizedBox(height: 16),
          
          // Engine selection
          _buildEngineSelection(),
          
          SizedBox(height: 16),
          
          // Export format selection
          _buildExportFormatSelection(),
          
          SizedBox(height: 16),
          
          // Build controls
          _buildBuildControls(),
          
          SizedBox(height: 16),
          
          // Build progress
          if (_isBuilding) _buildProgressSection(),
          
          SizedBox(height: 16),
          
          // Output information
          _buildOutputInfo(),
        ],
      ),
    );
  }

  Widget _buildPlayStationHeader() {
    return AnimatedBuilder(
      animation: _glowAnimation,
      builder: (context, child) {
        return HolographicCard(
          depth: 40,
          height: 120,
          glowing: true,
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF003791), // PlayStation Blue
                  Color(0xFF000000), // Black
                ],
              ),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFF003791).withOpacity(_glowAnimation.value),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Icon(
                        Icons.videogame_asset,
                        size: 40,
                        color: Color(0xFF003791),
                      ),
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'PlayStation Bundler Pro',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: Color(0xFF003791),
                          blurRadius: 15,
                        ),
                      ],
                    ),
                  ),
                  Text(
                    'Professional Console Publishing',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: 12,
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

  Widget _buildPlatformSelection() {
    return HolographicCard(
      depth: 25,
      height: 100,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '🎮 Select PlayStation Platform',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: Row(
                children: PlayStationBundler.platforms.map((platform) {
                  final isSelected = _selectedPlatform == platform;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedPlatform = platform;
                        });
                      },
                      child: Container(
                        margin: EdgeInsets.symmetric(horizontal: 2),
                        decoration: BoxDecoration(
                          gradient: isSelected
                            ? LinearGradient(
                                colors: [
                                  Color(0xFF003791),
                                  Color(0xFF000000),
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
                              ? Color(0xFF003791)
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
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEngineSelection() {
    return HolographicCard(
      depth: 20,
      height: 120,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '⚙️ Game Engine',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: PlayStationBundler.supportedEngines.length,
                itemBuilder: (context, index) {
                  final engine = PlayStationBundler.supportedEngines[index];
                  final isSelected = _selectedEngine == engine;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedEngine = engine;
                      });
                    },
                    child: Container(
                      width: 100,
                      margin: EdgeInsets.only(right: 8),
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: isSelected
                          ? LinearGradient(
                              colors: [
                                Color(0xFF003791).withOpacity(0.8),
                                Colors.black.withOpacity(0.8),
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
                            ? Color(0xFF003791)
                            : Colors.white.withOpacity(0.3),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          engine,
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

  Widget _buildExportFormatSelection() {
    return HolographicCard(
      depth: 20,
      height: 100,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📦 Export Format',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: DropdownButton<String>(
                value: _selectedFormat,
                dropdownColor: Color(0xFF003791),
                style: TextStyle(color: Colors.white),
                items: PlayStationBundler.exportFormats.map((format) {
                  return DropdownMenuItem<String>(
                    value: format,
                    child: Text(
                      format,
                      style: TextStyle(color: Colors.white),
                    ),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedFormat = value!;
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBuildControls() {
    return HolographicCard(
      depth: 30,
      height: 120,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              '🔨 Build Configuration',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Platform: $_selectedPlatform | Engine: $_selectedEngine | Format: $_selectedFormat',
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12,
              ),
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: HolographicButton(
                    text: _isBuilding ? 'Building...' : 'Build Package',
                    onPressed: _isBuilding ? () {} : _startBuild,
                    primaryColor: Color(0xFF003791),
                    secondaryColor: Colors.black,
                  ),
                ),
                SizedBox(width: 8),
                HolographicButton(
                  text: 'Settings',
                  onPressed: _showSettings,
                  primaryColor: Colors.grey,
                  secondaryColor: Colors.black,
                  width: 100,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressSection() {
    return HolographicCard(
      depth: 20,
      height: 100,
      glowing: true,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📊 Build Progress',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: _buildProgress,
              backgroundColor: Colors.white.withOpacity(0.2),
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF003791)),
            ),
            SizedBox(height: 8),
            Text(
              '${(_buildProgress * 100).toInt()}% Complete',
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

  Widget _buildOutputInfo() {
    return HolographicCard(
      depth: 20,
      height: 140,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📁 Output Information',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: Text(
                'Output Directory: /build/playstation/$_selectedPlatform/\n'
                'Package Name: app_${DateTime.now().millisecondsSinceEpoch}.$_selectedFormat.toLowerCase()}\n'
                'Estimated Size: ${_selectedPlatform == 'PS5' ? '2.8' : '1.6'} GB\n'
                'Compression: LZ4 | Encryption: AES-256',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 11,
                  fontFamily: 'monospace',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _startBuild() {
    setState(() {
      _isBuilding = true;
      _buildProgress = 0.0;
    });

    // Simulate build process
    Future.delayed(Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() {
          _buildProgress = 0.1;
        });
      }
    });

    Future.delayed(Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _buildProgress = 0.3;
        });
      }
    });

    Future.delayed(Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _buildProgress = 0.6;
        });
      }
    });

    Future.delayed(Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _buildProgress = 0.9;
        });
      }
    });

    Future.delayed(Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _buildProgress = 1.0;
          _isBuilding = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('🎮 PlayStation package built successfully!'),
            backgroundColor: Color(0xFF003791),
          ),
        );
      }
    });
  }

  void _showSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('PlayStation Bundler Settings'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('SDK Version: ${_selectedPlatform == 'PS5' ? PlayStationBundler.ps5SDK : PlayStationBundler.ps4SDK}'),
            Text('Build Configuration: Release'),
            Text('Optimization: Speed'),
            Text('Debug Symbols: Stripped'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Close'),
          ),
        ],
      ),
    );
  }
}
