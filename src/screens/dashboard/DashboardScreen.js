import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart} from 'react-native-chart-kit';
import {useAuth} from '../../context/AuthContext';
import {useApp} from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import {Colors} from '../../theme/colors';
import {ACTIVITY_DATA} from '../../data/mockData';

const {width} = Dimensions.get('window');

const StatCard = ({icon, label, value, color, sublabel}) => (
  <View style={[styles.statCard, {borderColor: color + '30'}]}>
    <View style={[styles.statIconBg, {backgroundColor: color + '20'}]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    {sublabel && <Text style={styles.statSublabel}>{sublabel}</Text>}
  </View>
);

const CameraPreviewCard = ({camera, onPress}) => (
  <TouchableOpacity style={styles.previewCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.previewScreen}>
      <Icon name="cctv" size={28} color={Colors.textMuted} />
      <Text style={styles.previewNoSignal}>
        {camera.status === 'offline' ? 'Offline' : 'Live'}
      </Text>
    </View>
    <View style={styles.previewOverlay}>
      <View style={styles.previewBadges}>
        {camera.status === 'online' && <StatusBadge type="LIVE" />}
        {camera.isRecording && <StatusBadge type="REC" />}
        {camera.hasMotion && <StatusBadge type="MOTION" />}
      </View>
      <View style={styles.previewInfo}>
        <Text style={styles.previewName} numberOfLines={1}>{camera.name}</Text>
        <Text style={styles.previewLocation} numberOfLines={1}>{camera.location}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const QuickActionBtn = ({icon, label, active, onPress, color}) => (
  <TouchableOpacity style={styles.quickActionBtn} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.quickActionIcon, {backgroundColor: (active ? color : Colors.backgroundSecondary) + (active ? '25' : '')}]}>
      <Icon name={icon} size={22} color={active ? color : Colors.textSecondary} />
    </View>
    <Text style={[styles.quickActionLabel, active && {color}]}>{label}</Text>
  </TouchableOpacity>
);

const DashboardScreen = ({navigation}) => {
  const {user} = useAuth();
  const {
    cameras,
    alerts,
    systemArmed,
    motionDetectionActive,
    standbyMode,
    cameraStats,
    toggleSystemArmed,
    toggleMotionDetection,
    toggleStandbyMode,
  } = useApp();

  const [armedAnimating, setArmedAnimating] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleArmedToggle = () => {
    setArmedAnimating(true);
    Animated.sequence([
      Animated.timing(pulseAnim, {toValue: 0.9, duration: 100, useNativeDriver: true}),
      Animated.timing(pulseAnim, {toValue: 1.1, duration: 150, useNativeDriver: true}),
      Animated.timing(pulseAnim, {toValue: 1, duration: 100, useNativeDriver: true}),
    ]).start(() => setArmedAnimating(false));
    toggleSystemArmed();
  };

  const recentAlerts = alerts.filter(a => !a.isRead).slice(0, 3);
  const previewCameras = cameras.slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Selamat Datang,</Text>
            <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Alerts')}>
            <Icon name="bell-outline" size={24} color={Colors.textPrimary} />
            {alerts.filter(a => !a.isRead).length > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {alerts.filter(a => !a.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Security Status Card */}
        <Animated.View
          style={[styles.securityCard, {transform: [{scale: pulseAnim}]}]}>
          <View style={styles.securityLeft}>
            <View
              style={[
                styles.securityIconBg,
                {backgroundColor: systemArmed ? Colors.primary + '20' : Colors.offline + '20'},
              ]}>
              <Icon
                name={systemArmed ? 'shield-check' : 'shield-off'}
                size={36}
                color={systemArmed ? Colors.primary : Colors.offline}
              />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>
                {systemArmed ? 'Sistem Aktif' : 'Sistem Tidak Aktif'}
              </Text>
              <Text style={styles.securitySubtitle}>
                {systemArmed
                  ? 'Semua sensor dalam kondisi siaga'
                  : 'Sistem keamanan dinonaktifkan'}
              </Text>
              <View
                style={[
                  styles.securityStatus,
                  {backgroundColor: systemArmed ? Colors.online + '20' : Colors.offline + '20'},
                ]}>
                <View
                  style={[
                    styles.securityDot,
                    {backgroundColor: systemArmed ? Colors.online : Colors.offline},
                  ]}
                />
                <Text
                  style={[
                    styles.securityStatusText,
                    {color: systemArmed ? Colors.online : Colors.offline},
                  ]}>
                  {systemArmed ? 'ARMED' : 'DISARMED'}
                </Text>
              </View>
            </View>
          </View>
          <Switch
            value={systemArmed}
            onValueChange={handleArmedToggle}
            trackColor={{false: Colors.border, true: Colors.primary + '60'}}
            thumbColor={systemArmed ? Colors.primary : Colors.textMuted}
          />
        </Animated.View>

        {/* Camera Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Statistik Kamera</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Monitoring')}>
            <Text style={styles.sectionLink}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="cctv"
            label="Total"
            value={cameraStats.total}
            color={Colors.primary}
          />
          <StatCard
            icon="wifi"
            label="Online"
            value={cameraStats.online}
            color={Colors.online}
          />
          <StatCard
            icon="record-circle"
            label="Merekam"
            value={cameraStats.recording}
            color={Colors.recBadge}
          />
          <StatCard
            icon="wifi-off"
            label="Offline"
            value={cameraStats.offline}
            color={Colors.offline}
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionBtn
            icon="shield-alert"
            label="Mode Siaga"
            active={standbyMode}
            color={Colors.accentYellow}
            onPress={toggleStandbyMode}
          />
          <QuickActionBtn
            icon="motion-sensor"
            label="Deteksi Gerak"
            active={motionDetectionActive}
            color={Colors.primary}
            onPress={toggleMotionDetection}
          />
          <QuickActionBtn
            icon="record-circle"
            label="Rekam Semua"
            active={false}
            color={Colors.recBadge}
            onPress={() => {}}
          />
          <QuickActionBtn
            icon="camera-outline"
            label="Snapshot"
            active={false}
            color={Colors.secondary}
            onPress={() => {}}
          />
        </View>

        {/* Live Preview Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preview Kamera</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Monitoring')}>
            <Text style={styles.sectionLink}>Semua Kamera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewGrid}>
          {previewCameras.map(camera => (
            <CameraPreviewCard
              key={camera.id}
              camera={camera}
              onPress={() =>
                navigation.navigate('CameraDetail', {cameraId: camera.id})
              }
            />
          ))}
        </View>

        {/* Activity Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aktivitas 7 Hari</Text>
          <Text style={styles.sectionSubtitle}>Deteksi gerakan</Text>
        </View>

        <View style={styles.chartCard}>
          <LineChart
            data={ACTIVITY_DATA}
            width={width - 64}
            height={160}
            chartConfig={{
              backgroundColor: Colors.backgroundCard,
              backgroundGradientFrom: Colors.backgroundCard,
              backgroundGradientTo: Colors.backgroundCard,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
              labelColor: () => Colors.textSecondary,
              style: {borderRadius: 16},
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: Colors.primary,
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: Colors.border,
                strokeWidth: 0.5,
              },
            }}
            bezier
            style={styles.chart}
            withShadow={false}
            withInnerLines
            withOuterLines={false}
          />
        </View>

        {/* Recent Alerts */}
        {recentAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Peringatan Terbaru</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
                <Text style={styles.sectionLink}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>

            {recentAlerts.map(alert => (
              <TouchableOpacity
                key={alert.id}
                style={styles.alertItem}
                onPress={() => navigation.navigate('Alerts')}>
                <View
                  style={[
                    styles.alertIconBg,
                    {
                      backgroundColor:
                        alert.severity === 'high'
                          ? Colors.alertHigh + '20'
                          : alert.severity === 'medium'
                          ? Colors.alertMedium + '20'
                          : Colors.alertLow + '20',
                    },
                  ]}>
                  <Icon
                    name={
                      alert.type === 'motion'
                        ? 'motion-sensor'
                        : alert.type === 'offline'
                        ? 'wifi-off'
                        : alert.type === 'battery'
                        ? 'battery-alert'
                        : 'information'
                    }
                    size={18}
                    color={
                      alert.severity === 'high'
                        ? Colors.alertHigh
                        : alert.severity === 'medium'
                        ? Colors.alertMedium
                        : Colors.alertLow
                    }
                  />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage} numberOfLines={1}>
                    {alert.message}
                  </Text>
                </View>
                <View style={styles.alertDot} />
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.alertHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  securityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  securityIconBg: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  securitySubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
    alignSelf: 'flex-start',
  },
  securityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  securityStatusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 4,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 4,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statSublabel: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  previewCard: {
    width: (width - 50) / 2,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E14',
  },
  previewNoSignal: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: Colors.overlay,
  },
  previewBadges: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  previewInfo: {},
  previewName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  previewLocation: {
    fontSize: 9,
    color: Colors.textSecondary,
  },
  chartCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
    marginLeft: -12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  alertIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

export default DashboardScreen;
