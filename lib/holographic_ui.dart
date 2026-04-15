import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:math' as math;

class HolographicTheme {
  static const Color primaryHologram = Color(0xFF00D4FF);
  static const Color secondaryHologram = Color(0xFF7B2FFF);
  static const Color accentHologram = Color(0xFFFF006E);
  static const Color glassSurface = Color(0x11FFFFFF);
  static const Color neonBorder = Color(0xFF00FFFF);
  static const Color deepSpace = Color(0xFF0A0A0F);
  static const Color cosmicPurple = Color(0xFF1A0B2E);
  
  static List<Color> get holographicGradient => [
    Color(0xFF00D4FF),
    Color(0xFF7B2FFF),
    Color(0xFFFF006E),
    Color(0xFFFFE600),
  ];
  
  static List<Color> get spaceGradient => [
    Color(0xFF0A0A0F),
    Color(0xFF1A0B2E),
    Color(0xFF2D1B69),
    Color(0xFF0A0A0F),
  ];
}

class HolographicCard extends StatefulWidget {
  final Widget child;
  final double depth;
  final double width;
  final double height;
  final VoidCallback? onTap;
  final bool floating;
  final bool glowing;
  
  const HolographicCard({
    Key? key,
    required this.child,
    this.depth = 20.0,
    this.width = double.infinity,
    this.height = 150.0,
    this.onTap,
    this.floating = true,
    this.glowing = true,
  }) : super(key: key);
  
  @override
  _HolographicCardState createState() => _HolographicCardState();
}

class _HolographicCardState extends State<HolographicCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _floatAnimation;
  late Animation<double> _glowAnimation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 4),
      vsync: this,
    );
    
    _floatAnimation = Tween<double>(
      begin: 0,
      end: 10,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
    
    _glowAnimation = Tween<double>(
      begin: 0.3,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
    
    if (widget.floating) {
      _controller.repeat(reverse: true);
    }
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(0, widget.floating ? -_floatAnimation.value : 0),
            child: Container(
              width: widget.width,
              height: widget.height,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    HolographicTheme.glassSurface,
                    HolographicTheme.glassSurface.withOpacity(0.05),
                  ],
                ),
                border: Border.all(
                  color: widget.glowing 
                    ? HolographicTheme.neonBorder.withOpacity(_glowAnimation.value)
                    : HolographicTheme.neonBorder.withOpacity(0.3),
                  width: 2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: HolographicTheme.primaryHologram.withOpacity(0.3),
                    blurRadius: widget.glowing ? 20 + _glowAnimation.value * 10 : 20,
                    spreadRadius: widget.glowing ? 2 + _glowAnimation.value : 2,
                  ),
                  BoxShadow(
                    color: HolographicTheme.secondaryHologram.withOpacity(0.2),
                    blurRadius: 15,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: BackdropFilter(
                  filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.1),
                        width: 1,
                      ),
                    ),
                    child: widget.child,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class HolographicButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;
  final Color? primaryColor;
  final Color? secondaryColor;
  final double? width;
  final double? height;
  final IconData? icon;
  
  const HolographicButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.primaryColor,
    this.secondaryColor,
    this.width,
    this.height,
    this.icon,
  }) : super(key: key);
  
  @override
  _HolographicButtonState createState() => _HolographicButtonState();
}

class _HolographicButtonState extends State<HolographicButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pulseAnimation;
  late Animation<double> _shimmerAnimation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.05,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
    
    _shimmerAnimation = Tween<double>(
      begin: -1.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
    
    _controller.repeat();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onPressed,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _pulseAnimation.value,
            child: Container(
              width: widget.width,
              height: widget.height ?? 50,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(25),
                gradient: LinearGradient(
                  begin: Alignment(-1.0 + _shimmerAnimation.value, 0),
                  end: Alignment(1.0 + _shimmerAnimation.value, 0),
                  colors: [
                    widget.primaryColor ?? HolographicTheme.primaryHologram,
                    widget.secondaryColor ?? HolographicTheme.secondaryHologram,
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: (widget.primaryColor ?? HolographicTheme.primaryHologram).withOpacity(0.5),
                    blurRadius: 20,
                    spreadRadius: 2,
                  ),
                  BoxShadow(
                    color: (widget.secondaryColor ?? HolographicTheme.secondaryHologram).withOpacity(0.3),
                    blurRadius: 15,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (widget.icon != null) ...[
                      Icon(
                        widget.icon,
                        color: Colors.white,
                        size: 20,
                      ),
                      SizedBox(width: 8),
                    ],
                    Text(
                      widget.text,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(0, 2),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class ParticleField extends StatefulWidget {
  final int particleCount;
  final Size size;
  
  const ParticleField({
    Key? key,
    this.particleCount = 50,
    required this.size,
  }) : super(key: key);
  
  @override
  _ParticleFieldState createState() => _ParticleFieldState();
}

class _ParticleFieldState extends State<ParticleField>
    with TickerProviderStateMixin {
  late List<Particle> particles;
  late AnimationController _controller;
  
  @override
  void initState() {
    super.initState();
    particles = List.generate(
      widget.particleCount,
      (index) => Particle(widget.size),
    );
    
    _controller = AnimationController(
      duration: Duration(seconds: 20),
      vsync: this,
    )..repeat();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: widget.size,
          painter: ParticlePainter(particles, _controller.value),
        );
      },
    );
  }
}

class Particle {
  final double x;
  final double y;
  final double size;
  final double speed;
  final Color color;
  final double opacity;
  
  Particle(Size screenSize)
      : x = math.Random().nextDouble() * screenSize.width,
        y = math.Random().nextDouble() * screenSize.height,
        size = math.Random().nextDouble() * 3 + 1,
        speed = math.Random().nextDouble() * 2 + 0.5,
        color = HolographicTheme.holographicGradient[
          math.Random().nextInt(HolographicTheme.holographicGradient.length)
        ],
        opacity = math.Random().nextDouble() * 0.5 + 0.3;
}

class ParticlePainter extends CustomPainter {
  final List<Particle> particles;
  final double animationValue;
  
  ParticlePainter(this.particles, this.animationValue);
  
  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < particles.length; i++) {
      final particle = particles[i];
      final paint = Paint()
        ..color = particle.color.withOpacity(particle.opacity)
        ..style = PaintingStyle.fill;
      
      final y = (particle.y + animationValue * particle.speed * 50) % size.height;
      final x = particle.x + math.sin(animationValue * 2 + i) * 20;
      
      canvas.drawCircle(Offset(x, y), particle.size, paint);
    }
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class HolographicScaffold extends StatefulWidget {
  final Widget body;
  final String title;
  final List<Widget>? actions;
  final bool showParticles;
  final Widget? floatingActionButton;
  
  const HolographicScaffold({
    Key? key,
    required this.body,
    required this.title,
    this.actions,
    this.showParticles = true,
    this.floatingActionButton,
  }) : super(key: key);
  
  @override
  _HolographicScaffoldState createState() => _HolographicScaffoldState();
}

class _HolographicScaffoldState extends State<HolographicScaffold>
    with TickerProviderStateMixin {
  late AnimationController _backgroundController;
  late Animation<double> _backgroundAnimation;
  
  @override
  void initState() {
    super.initState();
    _backgroundController = AnimationController(
      duration: Duration(seconds: 30),
      vsync: this,
    );
    
    _backgroundAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(_backgroundController);
    
    _backgroundController.repeat();
  }
  
  @override
  void dispose() {
    _backgroundController.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HolographicTheme.deepSpace,
      body: Stack(
        children: [
          // Animated gradient background
          AnimatedBuilder(
            animation: _backgroundAnimation,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment(
                      math.sin(_backgroundAnimation.value * 2 * math.pi) * 0.5,
                      math.cos(_backgroundAnimation.value * 2 * math.pi) * 0.5,
                    ),
                    end: Alignment(
                      -math.sin(_backgroundAnimation.value * 2 * math.pi) * 0.5,
                      -math.cos(_backgroundAnimation.value * 2 * math.pi) * 0.5,
                    ),
                    colors: HolographicTheme.spaceGradient,
                  ),
                ),
              );
            },
          ),
          
          // Particle field
          if (widget.showParticles)
            Positioned.fill(
              child: ParticleField(
                size: Size(MediaQuery.of(context).size.width, MediaQuery.of(context).size.height),
              ),
            ),
          
          // Main content
          SafeArea(
            child: Column(
              children: [
                // Holographic app bar
                Container(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          widget.title,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            shadows: [
                              Shadow(
                                color: HolographicTheme.primaryHologram,
                                blurRadius: 20,
                              ),
                            ],
                          ),
                        ),
                      ),
                      if (widget.actions != null) ...widget.actions!,
                    ],
                  ),
                ),
                
                // Body content
                Expanded(child: widget.body),
              ],
            ),
          ),
          
          // Floating action button
          if (widget.floatingActionButton != null)
            Positioned(
              bottom: 20,
              right: 20,
              child: widget.floatingActionButton!,
            ),
        ],
      ),
    );
  }
}
