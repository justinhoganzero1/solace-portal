import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'dart:convert';

class MonetizationSystem {
  static final MonetizationSystem _instance = MonetizationSystem._internal();
  factory MonetizationSystem() => _instance;
  MonetizationSystem._internal();

  static const String stripePublishableKey = 'pk_live_51SvNs0LGip9LWuvpRvng7l9I3NouqNEs7Bj6cNQ5Ugrq0FMfNq3O6ARqucNPtB6E6souVJM4AwXMhiKKqB4aQXmA00hDIJgPof';
  static const String baseUrl = 'https://golden-vault-empire.lovable.app';
  
  // Pricing tiers
  static const double monthlyPrice = 10.0;
  static const double aabPrice = 50.0;
  static const int trialMinutes = 120; // 2 hours
  
  SharedPreferences? _prefs;
  String? _userId;
  bool _isInitialized = false;

  bool get isInitialized => _isInitialized;
  String? get userId => _userId;

  Future<void> initialize() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      _userId = _prefs?.getString('user_id') ?? Uuid().v4();
      await _prefs?.setString('user_id', _userId!);
      
      // Initialize Stripe
      Stripe.publishableKey = stripePublishableKey;
      await Stripe.instance.applySettings();
      
      _isInitialized = true;
    } catch (e) {
      print('Monetization initialization failed: $e');
    }
  }

  // Trial management
  bool get isInTrial {
    final trialStart = _prefs?.getInt('trial_start');
    if (trialStart == null) {
      startTrial();
      return true;
    }
    
    final elapsed = DateTime.now().millisecondsSinceEpoch - trialStart;
    return elapsed < (trialMinutes * 60 * 1000);
  }

  int get trialMinutesRemaining {
    final trialStart = _prefs?.getInt('trial_start') ?? DateTime.now().millisecondsSinceEpoch;
    final elapsed = DateTime.now().millisecondsSinceEpoch - trialStart;
    final remaining = trialMinutes - (elapsed ~/ (60 * 1000));
    return remaining > 0 ? remaining : 0;
  }

  void startTrial() {
    _prefs?.setInt('trial_start', DateTime.now().millisecondsSinceEpoch);
  }

  // Subscription management
  bool get hasActiveSubscription {
    final expiry = _prefs?.getInt('subscription_expiry');
    if (expiry == null) return false;
    return DateTime.now().millisecondsSinceEpoch < expiry;
  }

  Future<bool> purchaseMonthlySubscription() async {
    try {
      // Create payment intent
      final response = await http.post(
        Uri.parse('$baseUrl/create-payment-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': (monthlyPrice * 100).toInt(), // Convert to cents
          'currency': 'usd',
          'user_id': _userId,
          'type': 'monthly_subscription',
        }),
      );

      final data = jsonDecode(response.body);
      final clientSecret = data['client_secret'];

      // Confirm payment
      final paymentIntent = await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
      );

      if (paymentIntent.status == PaymentIntentsStatus.Succeeded) {
        // Activate subscription for 30 days
        final expiry = DateTime.now().add(Duration(days: 30)).millisecondsSinceEpoch;
        await _prefs?.setInt('subscription_expiry', expiry);
        return true;
      }
    } catch (e) {
      print('Payment failed: $e');
    }
    return false;
  }

  Future<bool> purchaseAABGeneration() async {
    try {
      // Check if user has active subscription
      if (hasActiveSubscription) {
        return true; // Free for subscribers
      }

      // Create payment intent for AAB
      final response = await http.post(
        Uri.parse('$baseUrl/create-payment-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': (aabPrice * 100).toInt(),
          'currency': 'usd',
          'user_id': _userId,
          'type': 'aab_generation',
        }),
      );

      final data = jsonDecode(response.body);
      final clientSecret = data['clientSecret'];

      // Confirm payment
      final paymentIntent = await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
      );

      if (paymentIntent.status == PaymentIntentsStatus.Succeeded) {
        // Grant one-time AAB generation
        final currentCredits = _prefs?.getInt('aab_credits') ?? 0;
        await _prefs?.setInt('aab_credits', currentCredits + 1);
        return true;
      }
    } catch (e) {
      print('AAB payment failed: $e');
    }
    return false;
  }

  int get aabCredits {
    return _prefs?.getInt('aab_credits') ?? 0;
  }

  Future<bool> consumeAABCredit() async {
    final credits = aabCredits;
    if (credits > 0 || hasActiveSubscription) {
      if (!hasActiveSubscription) {
        await _prefs?.setInt('aab_credits', credits - 1);
      }
      return true;
    }
    return false;
  }

  // Feature access control
  bool get canUseAIAppMaker {
    return hasActiveSubscription || isInTrial;
  }

  bool get canUseCompleteSuite {
    return hasActiveSubscription || isInTrial;
  }

  bool get canUseVoiceInteraction {
    return hasActiveSubscription || isInTrial;
  }

  bool get canGenerateAAB {
    return hasActiveSubscription || aabCredits > 0;
  }
}

class PaywallWidget extends StatelessWidget {
  final String feature;
  final String description;
  final VoidCallback onPurchase;
  final VoidCallback onRestore;
  
  const PaywallWidget({
    Key? key,
    required this.feature,
    required this.description,
    required this.onPurchase,
    required this.onRestore,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final monetization = MonetizationSystem();
    
    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFF6B6B),
            Color(0xFF4ECDC4),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.lock,
            size: 64,
            color: Colors.white,
          ),
          SizedBox(height: 16),
          Text(
            'Premium Feature',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 8),
          Text(
            feature,
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 16),
          Text(
            description,
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 16,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 24),
          
          // Pricing options
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                _buildPricingOption(
                  'Monthly Subscription',
                  '\$10/month',
                  'Unlimited access to all features',
                  () => onPurchase(),
                  Colors.green,
                ),
                SizedBox(height: 12),
                _buildPricingOption(
                  'Pay-per-AAB',
                  '\$50 per app',
                  'Generate individual AAB files',
                  () => onPurchase(),
                  Colors.blue,
                ),
              ],
            ),
          ),
          
          SizedBox(height: 16),
          
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: onRestore,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white.withOpacity(0.2),
                    foregroundColor: Colors.white,
                  ),
                  child: Text('Restore Purchases'),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.withOpacity(0.8),
                    foregroundColor: Colors.white,
                  ),
                  child: Text('Maybe Later'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPricingOption(
    String title,
    String price,
    String description,
    VoidCallback onTap,
    Color color,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.5)),
        ),
        child: Row(
          children: [
            Icon(Icons.star, color: Colors.white),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    price,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    description,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
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
  }
}

class TrialWidget extends StatelessWidget {
  final VoidCallback onUpgrade;
  
  const TrialWidget({Key? key, required this.onUpgrade}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final monetization = MonetizationSystem();
    final minutesRemaining = monetization.trialMinutesRemaining;
    
    return Container(
      margin: EdgeInsets.all(16),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFFFFA726),
            Color(0xFFFF7043),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.orange.withOpacity(0.3),
            blurRadius: 15,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.timer, color: Colors.white, size: 24),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Free Trial Active',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '$minutesRemaining minutes remaining',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 12),
          Text(
            'Enjoy unlimited access to all premium features during your trial!',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 12,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 12),
          ElevatedButton(
            onPressed: onUpgrade,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.orange,
              minimumSize: Size(double.infinity, 40),
            ),
            child: Text('Upgrade Now - Save 50%'),
          ),
        ],
      ),
    );
  }
}
