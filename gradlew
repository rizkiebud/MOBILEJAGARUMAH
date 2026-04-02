#!/bin/sh
# Wrapper agar ./gradlew bisa dijalankan dari root project.
# Mendelegasikan semua argumen ke android/gradlew.
exec "$(dirname "$0")/android/gradlew" "$@"
