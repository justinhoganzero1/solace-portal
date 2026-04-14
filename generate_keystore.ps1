Write-Host "Generating Android release keystore using keytool..."
$keystoreName = "release-key.jks"
$keyAlias = "solaceportal"
$storePassword = "changeit"
$keyPassword = "changeit"
$validityDays = 10000
$commonName = "Solace Portal"
$orgUnit = "Dev"
$organization = "Solace"
$city = "City"
$state = "State"
$country = "US"

$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
    Write-Error "keytool not found. Install JDK and ensure keytool is on PATH."
    exit 1
}

& $keytool.Source -genkeypair -v -keystore $keystoreName -alias $keyAlias -keyalg RSA -keysize 2048 -validity $validityDays -storepass $storePassword -keypass $keyPassword -dname "CN=$commonName, OU=$orgUnit, O=$organization, L=$city, ST=$state, C=$country"
Write-Host "Keystore generated: $keystoreName"
Write-Host "Update android/key.properties with the generated keystore path and passwords."
