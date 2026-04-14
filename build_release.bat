@echo off
REM Build a release app bundle for Google Play
setlocal
flutter pub get
if ERRORLEVEL 1 exit /b 1
flutter build appbundle --release
if ERRORLEVEL 1 exit /b 1
endlocal
