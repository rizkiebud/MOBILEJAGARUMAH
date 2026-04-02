import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../context/AuthContext';
import {useApp} from '../../context/AppContext';
import {Colors} from '../../theme/colors';
import {CLOUD_STORAGE, USER_STATS} from '../../data/mockData';

// ─── Sub-components ─────────────────────────────────────────────────────────

const MenuRow = ({icon, label, subtitle, value, onPress, rightEl, iconColor, danger}) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, {backgroundColor: (iconColor || Colors.primary) + '18'}]}>
      <Icon name={icon} size={18} color={danger ? Colors.alertHigh : (iconColor || Colors.primary)} />
    </View>
    <View style={styles.menuInfo}>
      <Text style={[styles.menuLabel, danger && {color: Colors.alertHigh}]}>{label}</Text>
      {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
    </View>
    {rightEl || (
      <View style={styles.menuRight}>
        {value ? <Text style={styles.menuValue}>{value}</Text> : null}
        <Icon name="chevron-right" size={18} color={Colors.textMuted} />
      </View>
    )}
  </TouchableOpacity>
);

const SectionHeader = ({title}) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const StatCard = ({icon, value, label, color}) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={22} color={color || Colors.primary} />
    <Text style={[styles.statValue, {color: color || Colors.primary}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useAuth();
  const {cameraStats} = useApp();

  const [notifSettings, setNotifSettings] = useState({
    motion: true,
    offline: true,
    battery: true,
    system: false,
    email: true,
    push: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    biometric: true,
  });

  const toggleNotif = (key) => {
    setNotifSettings(prev => ({...prev, [key]: !prev[key]}));
  };

  const toggleSecurity = (key) => {
    setSecuritySettings(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Anda akan keluar dari akun ini. Lanjutkan?',
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: logout,
        },
      ],
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Ganti Password', 'Fitur ganti password akan segera tersedia.');
  };

  const storagePercent = (CLOUD_STORAGE.used / CLOUD_STORAGE.total) * 100;
  const storageColor =
    storagePercent > 90
      ? Colors.alertHigh
      : storagePercent > 70
      ? Colors.alertMedium
      : Colors.primary;

  const NotifToggle = ({icon, label, settingKey, iconColor}) => (
    <View style={styles.menuRow}>
      <View style={[styles.menuIcon, {backgroundColor: (iconColor || Colors.primary) + '18'}]}>
        <Icon name={icon} size={18} color={iconColor || Colors.primary} />
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Switch
        value={notifSettings[settingKey]}
        onValueChange={() => toggleNotif(settingKey)}
        trackColor={{false: Colors.border, true: Colors.primary + '60'}}
        thumbColor={notifSettings[settingKey] ? Colors.primary : Colors.textMuted}
      />
    </View>
  );

  const SecurityToggle = ({icon, label, subtitle, settingKey}) => (
    <View style={styles.menuRow}>
      <View style={[styles.menuIcon, {backgroundColor: Colors.secondary + '18'}]}>
        <Icon name={icon} size={18} color={Colors.secondary} />
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuLabel}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={securitySettings[settingKey]}
        onValueChange={() => toggleSecurity(settingKey)}
        trackColor={{false: Colors.border, true: Colors.secondary + '60'}}
        thumbColor={securitySettings[settingKey] ? Colors.secondary : Colors.textMuted}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.avatar || 'U'}</Text>
            </View>
            <View style={[styles.planBadge, user?.plan === 'Premium' && styles.planBadgePremium]}>
              <Icon
                name={user?.plan === 'Premium' ? 'crown' : 'shield-outline'}
                size={10}
                color={user?.plan === 'Premium' ? '#FFD700' : Colors.primary}
              />
              <Text style={[styles.planText, user?.plan === 'Premium' && styles.planTextPremium]}>
                {user?.plan || 'Basic'}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.phone && (
              <Text style={styles.userPhone}>{user.phone}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Icon name="pencil-outline" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Plan Info */}
        <View style={styles.planCard}>
          <View style={styles.planLeft}>
            <Icon name="crown" size={20} color="#FFD700" />
            <View>
              <Text style={styles.planCardTitle}>Plan {user?.plan || 'Basic'}</Text>
              {user?.planExpiry && (
                <Text style={styles.planExpiry}>Berlaku s/d {user.planExpiry}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="cctv"
            value={cameraStats.total}
            label="Kamera"
            color={Colors.primary}
          />
          <View style={styles.statDivider} />
          <StatCard
            icon="record-circle"
            value={USER_STATS.activeRecordings}
            label="Aktif Rekam"
            color={Colors.recBadge}
          />
          <View style={styles.statDivider} />
          <StatCard
            icon="calendar-check"
            value={USER_STATS.daysActive}
            label="Hari Aktif"
            color={Colors.secondary}
          />
        </View>

        {/* Cloud Storage */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View style={styles.storageLeft}>
              <Icon name="cloud-outline" size={20} color={storageColor} />
              <Text style={styles.storageTitle}>Penyimpanan Cloud</Text>
            </View>
            <Text style={styles.storageSize}>
              {CLOUD_STORAGE.used} / {CLOUD_STORAGE.total} {CLOUD_STORAGE.unit}
            </Text>
          </View>
          <View style={styles.storageBarBg}>
            <View
              style={[
                styles.storageBarFill,
                {width: `${storagePercent}%`, backgroundColor: storageColor},
              ]}
            />
          </View>
          <Text style={styles.storagePercent}>
            {storagePercent.toFixed(0)}% digunakan •{' '}
            <Text style={{color: Colors.textPrimary}}>
              {(CLOUD_STORAGE.total - CLOUD_STORAGE.used).toFixed(1)} {CLOUD_STORAGE.unit} tersisa
            </Text>
          </Text>
        </View>

        {/* Keamanan Akun */}
        <SectionHeader title="Keamanan Akun" />
        <View style={styles.menuCard}>
          <SecurityToggle
            icon="two-factor-authentication"
            label="Verifikasi 2 Langkah (2FA)"
            subtitle="Tambah lapisan keamanan ekstra"
            settingKey="twoFactor"
          />
          <View style={styles.menuDivider} />
          <SecurityToggle
            icon="fingerprint"
            label="Login Biometrik"
            subtitle="Gunakan sidik jari / wajah"
            settingKey="biometric"
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="lock-reset"
            label="Ganti Password"
            iconColor={Colors.secondary}
            onPress={handleChangePassword}
          />
        </View>

        {/* Notifikasi */}
        <SectionHeader title="Pengaturan Notifikasi" />
        <View style={styles.menuCard}>
          <NotifToggle icon="motion-sensor" label="Deteksi Gerakan" settingKey="motion" iconColor={Colors.accentYellow} />
          <View style={styles.menuDivider} />
          <NotifToggle icon="wifi-off" label="Kamera Offline" settingKey="offline" iconColor={Colors.offline} />
          <View style={styles.menuDivider} />
          <NotifToggle icon="battery-alert" label="Baterai Kritis" settingKey="battery" iconColor={Colors.alertHigh} />
          <View style={styles.menuDivider} />
          <NotifToggle icon="cog-outline" label="Notifikasi Sistem" settingKey="system" iconColor={Colors.textSecondary} />
          <View style={styles.menuDivider} />
          <NotifToggle icon="email-outline" label="Notifikasi Email" settingKey="email" iconColor={Colors.primary} />
          <View style={styles.menuDivider} />
          <NotifToggle icon="bell-ring-outline" label="Push Notification" settingKey="push" iconColor={Colors.primary} />
        </View>

        {/* Akun */}
        <SectionHeader title="Akun" />
        <View style={styles.menuCard}>
          <MenuRow
            icon="account-edit-outline"
            label="Edit Profil"
            iconColor={Colors.primary}
            onPress={() => Alert.alert('Edit Profil', 'Fitur akan segera tersedia.')}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="history"
            label="Riwayat Aktivitas"
            iconColor={Colors.primary}
            onPress={() => Alert.alert('Riwayat', 'Fitur akan segera tersedia.')}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="credit-card-outline"
            label="Kelola Langganan"
            value={user?.plan}
            iconColor={Colors.accentYellow}
            onPress={() => Alert.alert('Langganan', 'Fitur akan segera tersedia.')}
          />
        </View>

        {/* Aplikasi */}
        <SectionHeader title="Aplikasi" />
        <View style={styles.menuCard}>
          <MenuRow
            icon="translate"
            label="Bahasa"
            value="Indonesia"
            iconColor={Colors.primary}
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="theme-light-dark"
            label="Tema"
            value="Gelap"
            iconColor={Colors.primary}
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="bell-badge-outline"
            label="Suara Notifikasi"
            value="Aktif"
            iconColor={Colors.primary}
            onPress={() => {}}
          />
        </View>

        {/* Bantuan */}
        <SectionHeader title="Bantuan & Informasi" />
        <View style={styles.menuCard}>
          <MenuRow
            icon="help-circle-outline"
            label="Pusat Bantuan"
            iconColor={Colors.textSecondary}
            onPress={() => Alert.alert('Bantuan', 'Hubungi support@mobilejaga.id')}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="chat-outline"
            label="Hubungi Kami"
            iconColor={Colors.textSecondary}
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="star-outline"
            label="Beri Penilaian"
            iconColor={Colors.accentYellow}
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="shield-check-outline"
            label="Kebijakan Privasi"
            iconColor={Colors.textSecondary}
            onPress={() => {}}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="information-outline"
            label="Versi Aplikasi"
            value="1.0.0"
            iconColor={Colors.textSecondary}
            onPress={() => {}}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Icon name="logout" size={18} color={Colors.alertHigh} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Mobile Jaga Rumah v1.0.0 · © 2026</Text>
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scroll: {padding: 16},

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  avatarWrap: {position: 'relative'},
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: Colors.primary + '25',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  avatarText: {fontSize: 22, fontWeight: '800', color: Colors.primary},
  planBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  planBadgePremium: {backgroundColor: '#FFD70020', borderColor: '#FFD70040'},
  planText: {fontSize: 9, fontWeight: '800', color: Colors.primary},
  planTextPremium: {color: '#FFD700'},
  userInfo: {flex: 1},
  userName: {fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2},
  userEmail: {fontSize: 12, color: Colors.textSecondary, marginBottom: 1},
  userPhone: {fontSize: 11, color: Colors.textMuted},
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.accentYellow + '30',
  },
  planLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  planCardTitle: {fontSize: 14, fontWeight: '700', color: Colors.textPrimary},
  planExpiry: {fontSize: 11, color: Colors.textMuted, marginTop: 1},
  upgradeBtn: {
    backgroundColor: Colors.accentYellow + '20',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accentYellow + '50',
  },
  upgradeBtnText: {fontSize: 12, fontWeight: '700', color: Colors.accentYellow},

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statCard: {flex: 1, alignItems: 'center', gap: 4},
  statValue: {fontSize: 22, fontWeight: '800'},
  statLabel: {fontSize: 11, color: Colors.textSecondary, fontWeight: '500'},
  statDivider: {width: 1, height: 40, backgroundColor: Colors.border},

  storageCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  storageLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  storageTitle: {fontSize: 14, fontWeight: '700', color: Colors.textPrimary},
  storageSize: {fontSize: 12, color: Colors.textSecondary, fontWeight: '600'},
  storageBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  storageBarFill: {height: '100%', borderRadius: 4},
  storagePercent: {fontSize: 11, color: Colors.textMuted},

  sectionHeader: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {flex: 1},
  menuLabel: {fontSize: 14, fontWeight: '600', color: Colors.textPrimary},
  menuSubtitle: {fontSize: 11, color: Colors.textSecondary, marginTop: 1},
  menuRight: {flexDirection: 'row', alignItems: 'center', gap: 4},
  menuValue: {fontSize: 12, color: Colors.textSecondary},
  menuDivider: {height: 1, backgroundColor: Colors.border, marginHorizontal: 14},

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.alertHigh + '15',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.alertHigh + '30',
  },
  logoutText: {fontSize: 15, fontWeight: '700', color: Colors.alertHigh},

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
});

export default ProfileScreen;
