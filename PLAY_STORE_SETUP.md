# Play Store Release Setup

This project is configured to build a Play Store release bundle for an Android WebView wrapper.

## 1. Prepare release signing

1. Copy `android/key.properties.example` to `android/key.properties`.
2. Fill in your release keystore details:
   - `storeFile`: path to your `.jks`, `.keystore`, or `.p12`
   - `storePassword`
   - `keyAlias`
   - `keyPassword`

If `keytool` is not available, install a JDK and add it to your PATH before generating the keystore.

You also need the Android SDK installed to run `flutter build appbundle --release`.

### Example

```text
storePassword=myStorePassword
keyPassword=myKeyPassword
keyAlias=myKeyAlias
storeFile=C:/Users/User/keystore/my-release-key.p12
```

## 2. Confirm app URL and branding

- Edit `lib/main.dart` and update `kInitialPortalUrl` to the web app URL you want to wrap.
- Update the app label or launcher icon if desired in `android/app/src/main/AndroidManifest.xml` / `android/app/src/main/res/mipmap-*`.

## 3. Build the Android app bundle

From the project root:

```bash
flutter pub get
flutter build appbundle --release
```

The result will be in `build/app/outputs/bundle/release/app-release.aab`.

## 4. Upload to Google Play

1. Open Google Play Console.
2. Create a new app if needed.
3. Upload the generated `.aab` to the release track.
4. Complete listing, content rating, and privacy policy details.

## 5. Notes

- `android/key.properties` is ignored by Git.
- If you do not have a release keystore, generate one with the Java `keytool`.
- The app ID is `com.solaceportal.app`, which should remain unique for Play Store.
