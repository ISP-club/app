# umiswap-wallet

## Install the dependencies
```bash
npm install
```

## Install IDE helper
```bash
quasar run ide-helper generate
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

## Android
```bash
$ quasar build -m cordova -T android
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore key/google.keystore dist/cordova/android/apk/release/app-release-unsigned.apk alias_name
$ /sdk/build-tools/30.0.3/zipalign -v 4 dist/cordova/android/apk/release/app-release-unsigned.apk app-release.apk
```

## Docker
```bash
$ docker buildx build --push --platform linux/amd64 -t ladonta/umiswap-wallet:[version] .
```
