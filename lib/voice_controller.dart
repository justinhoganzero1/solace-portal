import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'dart:math' as math;

class VoiceController {
  static final VoiceController _instance = VoiceController._internal();
  factory VoiceController() => _instance;
  VoiceController._internal();

  final FlutterTts _flutterTts = FlutterTts();
  
  bool _isInitialized = false;
  bool _isSpeaking = false;
  bool _isListening = false; // Simulated for UI
  
  Function()? onSpeakStart;
  Function()? onSpeakComplete;

  bool get isInitialized => _isInitialized;
  bool get isSpeaking => _isSpeaking;
  bool get isListening => _isListening;

  Future<void> initialize() async {
    try {
      // Initialize text to speech
      await _flutterTts.setLanguage('en-US');
      await _flutterTts.setPitch(1.0);
      await _flutterTts.setSpeechRate(0.9);
      await _flutterTts.setVolume(1.0);
      
      _flutterTts.setStartHandler(() {
        _isSpeaking = true;
        onSpeakStart?.call();
      });
      
      _flutterTts.setCompletionHandler(() {
        _isSpeaking = false;
        onSpeakComplete?.call();
      });
      
      _isInitialized = true;
    } catch (e) {
      print('Voice initialization failed: $e');
    }
  }

  Future<void> startListening() async {
    // Simulate listening for UI purposes
    _isListening = true;
    // In a real implementation, this would start speech recognition
    await Future.delayed(Duration(seconds: 2));
    _isListening = false;
  }

  Future<void> stopListening() async {
    _isListening = false;
  }

  Future<void> speak(String text, {String? voice}) async {
    if (_isSpeaking) {
      await _flutterTts.stop();
    }

    if (voice != null) {
      await _flutterTts.setVoice({'name': voice});
    }

    await _flutterTts.speak(text);
  }

  Future<void> stopSpeaking() async {
    if (_isSpeaking) {
      await _flutterTts.stop();
      _isSpeaking = false;
    }
  }

  void dispose() {
    _flutterTts.stop();
  }
}

class VoiceInteractionWidget extends StatefulWidget {
  final String aiResponse;
  final Function(String) onUserInput;
  final bool isAIResponding;
  
  const VoiceInteractionWidget({
    Key? key,
    required this.aiResponse,
    required this.onUserInput,
    this.isAIResponding = false,
  }) : super(key: key);

  @override
  _VoiceInteractionWidgetState createState() => _VoiceInteractionWidgetState();
}

class _VoiceInteractionWidgetState extends State<VoiceInteractionWidget>
    with TickerProviderStateMixin {
  final VoiceController _voiceController = VoiceController();
  late AnimationController _pulseController;
  late AnimationController _waveController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _waveAnimation;
  
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    
    _pulseController = AnimationController(
      duration: Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _waveController = AnimationController(
      duration: Duration(milliseconds: 1000),
      vsync: this,
    );
    
    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
    
    _waveAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _waveController,
      curve: Curves.easeInOut,
    ));
    
    _initializeVoice();
  }

  Future<void> _initializeVoice() async {
    try {
      await _voiceController.initialize();
      
      _voiceController.onSpeakStart = () {
        _pulseController.repeat(reverse: true);
        setState(() {});
      };
      
      _voiceController.onSpeakComplete = () {
        _pulseController.stop();
        setState(() {});
      };
      
      setState(() {
        _isInitialized = true;
      });
    } catch (e) {
      print('Voice initialization failed: $e');
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _waveController.dispose();
    _voiceController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(VoiceInteractionWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    
    // Speak AI response when it changes
    if (widget.aiResponse != oldWidget.aiResponse && 
        widget.aiResponse.isNotEmpty && 
        _isInitialized) {
      _voiceController.speak(widget.aiResponse);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return _buildVoiceIndicator('Initializing Voice...', Icons.settings_voice, Colors.grey);
    }

    return Column(
      children: [
        // AI Speaker Indicator
        _buildSpeakerIndicator(),
        
        SizedBox(height: 16),
        
        // Voice Controls
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildVoiceButton(
              icon: _voiceController.isListening ? Icons.mic : Icons.mic_none,
              label: _voiceController.isListening ? 'Listening...' : 'Tap to Speak',
              isActive: _voiceController.isListening,
              onPressed: _voiceController.isListening 
                  ? () => _voiceController.stopListening()
                  : () => _voiceController.startListening(),
              color: Colors.red,
            ),
            
            _buildVoiceButton(
              icon: _voiceController.isSpeaking ? Icons.volume_up : Icons.volume_off,
              label: _voiceController.isSpeaking ? 'Speaking...' : 'AI Voice',
              isActive: _voiceController.isSpeaking,
              onPressed: _voiceController.isSpeaking 
                  ? () => _voiceController.stopSpeaking()
                  : () => _voiceController.speak(widget.aiResponse),
              color: Colors.blue,
            ),
          ],
        ),
        
        // Voice Wave Visualization
        if (_voiceController.isListening || _voiceController.isSpeaking)
          _buildVoiceWave(),
      ],
    );
  }

  Widget _buildSpeakerIndicator() {
    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _voiceController.isSpeaking ? _pulseAnimation.value : 1.0,
          child: Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.blue.withOpacity(0.2),
                  Colors.cyan.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _voiceController.isSpeaking 
                    ? Colors.cyan.withOpacity(0.8)
                    : Colors.cyan.withOpacity(0.3),
                width: 2,
              ),
              boxShadow: _voiceController.isSpeaking ? [
                BoxShadow(
                  color: Colors.cyan.withOpacity(0.5),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ] : [],
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [Colors.blue, Colors.cyan],
                    ),
                  ),
                  child: Icon(
                    Icons.speaker,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'AI Assistant Voice',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        _voiceController.isSpeaking 
                            ? 'Speaking response...' 
                            : 'Ready to speak',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 12,
                        ),
                      ),
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

  Widget _buildVoiceButton({
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onPressed,
    required Color color,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: AnimatedBuilder(
        animation: isActive ? _pulseAnimation : const AlwaysStoppedAnimation(0),
        builder: (context, child) {
          return Transform.scale(
            scale: isActive ? _pulseAnimation.value : 1.0,
            child: Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isActive 
                      ? [color, color.withOpacity(0.7)]
                      : [color.withOpacity(0.3), color.withOpacity(0.1)],
                ),
                borderRadius: BorderRadius.circular(25),
                border: Border.all(
                  color: isActive ? color : color.withOpacity(0.5),
                  width: 2,
                ),
                boxShadow: isActive ? [
                  BoxShadow(
                    color: color.withOpacity(0.5),
                    blurRadius: 20,
                    spreadRadius: 2,
                  ),
                ] : [],
              ),
              child: Column(
                children: [
                  Icon(
                    icon,
                    color: Colors.white,
                    size: 32,
                  ),
                  SizedBox(height: 8),
                  Text(
                    label,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildVoiceWave() {
    return AnimatedBuilder(
      animation: _waveAnimation,
      builder: (context, child) {
        return Container(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(20, (index) {
              final height = 10 + 
                  (_voiceController.isListening ? 30 : 20) * 
                  math.sin((_waveAnimation.value * 2 * math.pi) + (index * 0.5)).abs();
              
              return Container(
                width: 3,
                height: height,
                margin: EdgeInsets.symmetric(horizontal: 2),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      _voiceController.isListening ? Colors.red : Colors.blue,
                      _voiceController.isListening ? Colors.orange : Colors.cyan,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              );
            }),
          ),
        );
      },
    );
  }

  Widget _buildVoiceIndicator(String text, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color),
          SizedBox(width: 12),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
