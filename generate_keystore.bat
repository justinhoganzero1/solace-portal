@echo off
REM Generate a new Android release keystore using Java keytool.
REM Replace the values below with your chosen alias, passwords, and keystore filename.

set KEYSTORE_NAME=release-key.jks
set KEY_ALIAS=solaceportal
set STORE_PASSWORD=changeit
set KEY_PASSWORD=changeit
set VALIDITY_DAYS=10000
set COMMON_NAME=Solace Portal
set ORGANIZATION_UNIT=Dev
set ORGANIZATION=Solace
set CITY=City
set STATE=State
set COUNTRY=US

keytool -genkeypair -v -keystore %KEYSTORE_NAME% -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity %VALIDITY_DAYS% -storepass %STORE_PASSWORD% -keypass %KEY_PASSWORD% -dname "CN=%COMMON_NAME%, OU=%ORGANIZATION_UNIT%, O=%ORGANIZATION%, L=%CITY%, ST=%STATE%, C=%COUNTRY%"

echo Keystore generated: %KEYSTORE_NAME%
echo Update android/key.properties with the generated keystore path and passwords.
