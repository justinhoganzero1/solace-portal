Write-Host "Building Flutter release app bundle..."
flutter pub get
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
flutter build appbundle --release
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Build complete. Find the bundle at build/app/outputs/bundle/release/app-release.aab"
