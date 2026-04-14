# Solace Portal

Solace Portal is a Flutter WebView wrapper app for delivering a web app inside a native Android shell.

## Project setup

This project is already configured for Play Store publishing with:

- Android `applicationId` set to `com.solaceportal.app`
- Release signing configuration using `android/key.properties`
- Internet permission enabled in Android manifest
- A reusable WebView wrapper in `lib/main.dart`

## Customize your wrapped app

To change the wrapped app, edit the `kInitialPortalUrl` constant in `lib/main.dart`.

## Build for release

1. Copy `android/key.properties.example` to `android/key.properties`.
2. Fill in your keystore details:
   - `storeFile`
   - `storePassword`
   - `keyAlias`
   - `keyPassword`
3. Run:
   - `flutter pub get`
   - `flutter build appbundle --release`
4. Upload the generated `.aab` file to Google Play Console.

## Keystore generation

If you do not have a release keystore yet, use one of these helper scripts from the project root:

- `generate_keystore.bat`
- `generate_keystore.ps1`

This project already includes a generated keystore at `android/release-key.p12`.
If you want to use it, keep `android/key.properties` as-is or update it with your own values.

If `keytool` is not available, install the JDK and add it to your PATH.

Then copy the generated keystore path and passwords into `android/key.properties` if you create a new keystore.

## Android SDK requirement

To build the Android app bundle, you must install the Android SDK and set `ANDROID_HOME` or `ANDROID_SDK_ROOT` to the SDK path.

## Notes

- Do not commit `android/key.properties` to source control.
- Use a valid Play Store console account and valid app listing details.
