# Mobile Jaga Rumah 🏠🔒

Aplikasi mobile CCTV untuk monitoring keamanan rumah berbasis React Native.

## Fitur Lengkap

### 1. Autentikasi
- **Login** dengan Email, Nomor Telepon, atau WhatsApp
- **Registrasi** akun baru dengan validasi form real-time
- Animasi shake pada error input & loading indicator
- **Demo:** `rizki@mobilejaga.id` / `password123`

### 2. Dashboard
- Toggle status sistem keamanan (Armed / Disarmed)
- Statistik kamera: Total, Online, Merekam, Offline
- Aksi cepat: Mode Siaga, Deteksi Gerakan, Rekam Semua, Snapshot
- Preview live kamera 2×2 dengan badge LIVE & REC
- Grafik aktivitas 7 hari (`react-native-chart-kit`)
- Daftar peringatan terbaru yang belum dibaca

### 3. Monitoring CCTV
#### List Kamera
- Toggle **Grid View** & **List View**
- Filter: Semua / Online / Offline / Merekam
- Pencarian kamera real-time
- Badge: LIVE, REC, GERAKAN, BATERAI
- Status bar statistik kamera

#### Detail Kamera (4 Tab)
| Tab | Fitur |
|-----|-------|
| **Live** | Streaming player + HUD overlay, PTZ control (pan/tilt), Zoom slider, Snapshot, Record, Mute, Share |
| **Rekaman** | Timeline rekaman + filter tanggal, Play & Download clip |
| **Pengaturan** | Night vision, Audio, Deteksi gerakan, Rekaman otomatis, Resolusi, FPS |
| **Info** | Spesifikasi lengkap, Status baterai, Lokasi, Jaringan (IP, MAC, sinyal) |

### 4. Peringatan
- Filter berdasarkan kategori: Gerakan / Offline / Baterai / Sistem
- Badge unread count di tab bar
- Level keparahan dengan warna: Tinggi (merah) / Sedang (kuning) / Rendah (hijau)
- Tandai dibaca / Hapus individual atau semua
- Navigasi langsung ke kamera terkait

### 5. Profil
- Info user dengan avatar inisial & plan berlangganan
- Statistik penggunaan (kamera, rekaman aktif, hari aktif)
- Status penyimpanan cloud dengan progress bar
- Keamanan akun (2FA, Biometrik, Ganti Password)
- Pengaturan notifikasi per kategori (push, email, tipe alert)
- Menu lengkap (akun, aplikasi, bantuan & informasi)

---

## Struktur Project

```
MobileJagarUmah/
├── index.js                    # Entry point
├── app.json
├── package.json
├── babel.config.js
├── metro.config.js
└── src/
    ├── App.js                  # Root component
    ├── theme/
    │   └── colors.js           # Design system colors
    ├── data/
    │   └── mockData.js         # Data dummy (kamera, alert, rekaman)
    ├── context/
    │   ├── AuthContext.js      # State autentikasi
    │   └── AppContext.js       # State app (kamera, alert)
    ├── navigation/
    │   ├── AppNavigator.js     # Root navigator
    │   ├── AuthNavigator.js    # Stack auth (Login, Register)
    │   ├── MainNavigator.js    # Bottom tab navigator
    │   └── MonitoringNavigator.js # Stack monitoring
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── dashboard/
    │   │   └── DashboardScreen.js
    │   ├── monitoring/
    │   │   ├── CameraListScreen.js
    │   │   └── CameraDetailScreen.js
    │   ├── alerts/
    │   │   └── AlertsScreen.js
    │   └── profile/
    │       └── ProfileScreen.js
    └── components/
        └── common/
            ├── AnimatedInput.js   # Input dengan animasi shake & border
            ├── LoadingButton.js   # Button dengan loading state
            └── StatusBadge.js     # Badge LIVE / REC / GERAKAN / dst
```

---

## Cara Menjalankan

### Prasyarat
- Node.js >= 20
- React Native CLI
- Android Studio (untuk Android) atau Xcode (untuk iOS)

### Instalasi

```bash
# Clone / masuk ke direktori
cd MobileJagarUmah

# Install dependencies
npm install

# iOS (Mac only)
cd ios && pod install && cd ..

# Jalankan Metro bundler
npm start

# Run di Android
npm run android

# Run di iOS
npm run ios
```

### Akun Demo
| Field    | Value                    |
|----------|--------------------------|
| Email    | rizki@mobilejaga.id      |
| Password | password123              |
| Plan     | Premium                  |

---

## Teknologi

| Paket | Kegunaan |
|-------|----------|
| `react-native` 0.73 | Framework utama |
| `@react-navigation/native` | Navigasi |
| `@react-navigation/bottom-tabs` | Tab bar navigasi |
| `@react-navigation/native-stack` | Stack navigator |
| `react-native-chart-kit` | Grafik aktivitas |
| `react-native-svg` | Dependensi chart |
| `react-native-vector-icons` | Icon set (MaterialCommunityIcons) |
| `react-native-reanimated` | Animasi performa tinggi |
| `react-native-gesture-handler` | Gesture handler |
| `react-native-safe-area-context` | Safe area |
| `@react-native-async-storage/async-storage` | Persistensi session |
| `react-native-linear-gradient` | Gradien UI |
| `react-native-video` | Video player CCTV |
