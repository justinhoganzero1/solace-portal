class AppConfig {
  final String webUrl;
  final String appName;
  final String packageId;
  final String version;

  AppConfig({
    required this.webUrl,
    required this.appName,
    required this.packageId,
    this.version = '1.0.0+1',
  });

  factory AppConfig.fromUrl(String url) {
    final uri = Uri.parse(url);
    final domain = uri.host.replaceAll('.', '_');
    final appName = _generateAppName(uri.host);
    final packageId = 'com.webwrap.$domain';
    
    return AppConfig(
      webUrl: url,
      appName: appName,
      packageId: packageId,
    );
  }

  static String _generateAppName(String domain) {
    // Convert domain to app name
    final parts = domain.split('.');
    if (parts.length >= 2) {
      return '${parts[1][0].toUpperCase()}${parts[1].substring(1)} Portal';
    }
    return 'Web Portal';
  }

  Map<String, dynamic> toJson() {
    return {
      'webUrl': webUrl,
      'appName': appName,
      'packageId': packageId,
      'version': version,
    };
  }
}
