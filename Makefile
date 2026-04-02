# ─────────────────────────────────────────────────────────────────────────────
# Mobile Jaga Rumah — Makefile
# Jalankan: make <target>
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: help install start start-reset \
        android android-release android-device \
        ios ios-release ios-device \
        apk apk-release aab \
        clean clean-android clean-ios clean-all \
        pod pod-update \
        lint lint-fix format test test-watch \
        log-android log-ios

# ── Default: tampilkan daftar perintah ───────────────────────────────────────
help:
	@echo ""
	@echo "  Mobile Jaga Rumah — Perintah yang tersedia"
	@echo "  ─────────────────────────────────────────────"
	@echo "  Setup"
	@echo "    make install          Install semua dependencies (npm install)"
	@echo "    make pod              Install CocoaPods (iOS)"
	@echo "    make pod-update       Update CocoaPods"
	@echo ""
	@echo "  Development"
	@echo "    make start            Jalankan Metro bundler"
	@echo "    make start-reset      Metro bundler + reset cache"
	@echo ""
	@echo "  Android"
	@echo "    make android          Run di emulator/device Android (debug)"
	@echo "    make android-release  Run mode release di Android"
	@echo "    make android-device   Run di physical device Android"
	@echo "    make apk              Build APK debug"
	@echo "    make apk-release      Build APK release"
	@echo "    make aab              Build AAB (Google Play)"
	@echo "    make log-android      Tampilkan log Android"
	@echo ""
	@echo "  iOS"
	@echo "    make ios              Run di simulator iOS (debug)"
	@echo "    make ios-release      Run mode release di iOS"
	@echo "    make ios-device       Run di physical device iOS"
	@echo "    make log-ios          Tampilkan log iOS"
	@echo ""
	@echo "  Clean"
	@echo "    make clean            React Native clean"
	@echo "    make clean-android    Gradle clean"
	@echo "    make clean-ios        Xcode clean"
	@echo "    make clean-all        Bersihkan semua (RN + Gradle + node_modules)"
	@echo ""
	@echo "  Kualitas Kode"
	@echo "    make lint             Cek ESLint"
	@echo "    make lint-fix         Auto-fix ESLint"
	@echo "    make format           Format dengan Prettier"
	@echo "    make test             Jalankan unit test"
	@echo "    make test-watch       Test mode watch"
	@echo ""

# ── Setup ─────────────────────────────────────────────────────────────────────
install:
	npm install

pod:
	cd ios && pod install

pod-update:
	cd ios && pod update

# ── Metro ─────────────────────────────────────────────────────────────────────
start:
	npx react-native start

start-reset:
	npx react-native start --reset-cache

# ── Android ───────────────────────────────────────────────────────────────────
android:
	npx react-native run-android

android-release:
	npx react-native run-android --mode=release

android-device:
	npx react-native run-android --active-arch-only

apk:
	cd android && ./gradlew assembleDebug
	@echo ""
	@echo "  ✓ APK debug: android/app/build/outputs/apk/debug/app-debug.apk"

apk-release:
	cd android && ./gradlew assembleRelease
	@echo ""
	@echo "  ✓ APK release: android/app/build/outputs/apk/release/app-release.apk"

aab:
	cd android && ./gradlew bundleRelease
	@echo ""
	@echo "  ✓ AAB: android/app/build/outputs/bundle/release/app-release.aab"

log-android:
	npx react-native log-android

# ── iOS ───────────────────────────────────────────────────────────────────────
ios:
	npx react-native run-ios

ios-release:
	npx react-native run-ios --configuration Release

ios-device:
	npx react-native run-ios --device

log-ios:
	npx react-native log-ios

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	npx react-native clean

clean-android:
	cd android && ./gradlew clean

clean-ios:
	cd ios && xcodebuild clean -workspace MobileJagarUmah.xcworkspace -scheme MobileJagarUmah 2>/dev/null || echo "Xcode tidak ditemukan (skip)"

clean-all: clean clean-android
	rm -rf node_modules
	npm install
	@echo "  ✓ Selesai. Jalankan 'make pod' untuk iOS."

# ── Kualitas Kode ─────────────────────────────────────────────────────────────
lint:
	npx eslint . --ext .js,.jsx

lint-fix:
	npx eslint . --ext .js,.jsx --fix

format:
	npx prettier --write "src/**/*.{js,jsx}"

test:
	npx jest

test-watch:
	npx jest --watch
