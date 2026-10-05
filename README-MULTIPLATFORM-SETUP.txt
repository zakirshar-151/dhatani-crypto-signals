DHATANI CRYPTO SIGNALS — MULTI-PLATFORM BUILD

This bundle is ready to copy into the root of the existing GitHub repository:
  zakirshar-151/dhatani-crypto-signals

Files:
  .github/workflows/build-multiplatform.yml  -> builds APK + Windows EXE + Chrome PWA
  package.json                               -> Electron/EXE build configuration
  electron/main.cjs                          -> Windows tray/background cloud alert monitor
  manifest.webmanifest                       -> Chrome PWA manifest
  sw.js                                      -> offline shell + push notification service worker

IMPORTANT:
- The workflow uses the existing repository index.html as the application UI.
- APK is an installable debug APK and contains a foreground service that polls the Dhatani cloud alert API while the screen is off.
- Windows EXE keeps the app running in the tray and polls the same cloud alert API.
- WebApp/PWA is packaged as a downloadable GitHub Actions artifact.
- True fresh signal generation still requires the cloud signal engine to be online. The clients can alert from the central cloud database while the device screen is off.
- GitHub Actions artifacts are available from the Actions run page after the workflow finishes.
