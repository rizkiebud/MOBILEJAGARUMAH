import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  FlatList,
  StatusBar,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useApp} from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import {Colors} from '../../theme/colors';

const {width} = Dimensions.get('window');

// ─── Tab: LIVE ────────────────────────────────────────────────────────────────
const LiveTab = ({camera, onUpdate}) => {
  const [zoom, setZoom] = useState(1);
  const [isMuted, setIsMuted] = useState(!camera.audioEnabled);
  const [isRecording, setIsRecording] = useState(camera.isRecording);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Video Player */}
      <View style={styles.playerContainer}>
        <View style={styles.playerScreen}>
          <Icon name="cctv" size={52} color={Colors.textMuted} />
          <Text style={styles.playerStreamText}>
            {camera.status === 'offline' ? 'Kamera Offline' : 'Streaming Live...'}
          </Text>
          {camera.status === 'online' && (
            <Text style={styles.playerUrl} numberOfLines={1}>
              {camera.streamUrl}
            </Text>
          )}
        </View>

        {/* HUD Overlay */}
        <View style={styles.hudTop}>
          <View style={styles.hudLeft}>
            {camera.status === 'online' && <StatusBadge type="LIVE" size="lg" />}
            {isRecording && <StatusBadge type="REC" size="lg" />}
          </View>
          <View style={styles.hudRight}>
            <Text style={styles.hudTime}>
              {new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}
            </Text>
          </View>
        </View>

        <View style={styles.hudBottom}>
          <Text style={styles.hudCamName}>{camera.name}</Text>
          <Text style={styles.hudLocation}>{camera.location}</Text>
        </View>
      </View>

      {/* Zoom Slider */}
      <View style={styles.zoomRow}>
        <Icon name="magnify-minus" size={18} color={Colors.textSecondary} />
        <View style={styles.zoomSliderWrap}>
          <Slider
            style={{flex: 1}}
            minimumValue={1}
            maximumValue={8}
            step={0.5}
            value={zoom}
            onValueChange={setZoom}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />
        </View>
        <Icon name="magnify-plus" size={18} color={Colors.textSecondary} />
        <Text style={styles.zoomLabel}>{zoom.toFixed(1)}x</Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsRow}>
        <ControlBtn
          icon="camera"
          label="Snapshot"
          onPress={() => Alert.alert('Snapshot', 'Gambar berhasil disimpan')}
        />
        <ControlBtn
          icon={isRecording ? 'stop-circle' : 'record-circle'}
          label={isRecording ? 'Stop' : 'Rekam'}
          color={isRecording ? Colors.alertHigh : Colors.recBadge}
          onPress={() => {
            setIsRecording(r => !r);
            onUpdate({isRecording: !isRecording});
          }}
        />
        <ControlBtn
          icon={isMuted ? 'volume-off' : 'volume-high'}
          label={isMuted ? 'Unmute' : 'Mute'}
          onPress={() => setIsMuted(m => !m)}
        />
        <ControlBtn
          icon="share-variant"
          label="Bagikan"
          onPress={() => Alert.alert('Bagikan', 'Link stream disalin')}
        />
      </View>

      {/* PTZ Controls */}
      <View style={styles.ptzSection}>
        <Text style={styles.sectionLabel}>Kontrol PTZ</Text>
        <View style={styles.ptzContainer}>
          {/* Up */}
          <View style={styles.ptzRow}>
            <PTZBtn icon="arrow-up-circle" label="Atas" />
          </View>
          {/* Mid Row: Left, Home, Right */}
          <View style={styles.ptzRowMid}>
            <PTZBtn icon="arrow-left-circle" label="Kiri" />
            <PTZBtn icon="home-circle" label="Home" color={Colors.primary} />
            <PTZBtn icon="arrow-right-circle" label="Kanan" />
          </View>
          {/* Down */}
          <View style={styles.ptzRow}>
            <PTZBtn icon="arrow-down-circle" label="Bawah" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const ControlBtn = ({icon, label, onPress, color}) => (
  <TouchableOpacity style={styles.ctrlBtn} onPress={onPress}>
    <View style={[styles.ctrlIconBg, color && {backgroundColor: color + '20'}]}>
      <Icon name={icon} size={22} color={color || Colors.textSecondary} />
    </View>
    <Text style={styles.ctrlLabel}>{label}</Text>
  </TouchableOpacity>
);

const PTZBtn = ({icon, label, color}) => (
  <TouchableOpacity style={styles.ptzBtn} activeOpacity={0.7}>
    <Icon name={icon} size={40} color={color || Colors.textSecondary} />
  </TouchableOpacity>
);

// ─── Tab: REKAMAN ─────────────────────────────────────────────────────────────
const RecordingsTab = ({camera, recordings}) => {
  const cameraRecordings = recordings.filter(r => r.cameraId === camera.id);
  const [selectedDate, setSelectedDate] = useState('all');

  const dates = ['all', ...new Set(cameraRecordings.map(r => r.date))];

  const filtered =
    selectedDate === 'all'
      ? cameraRecordings
      : cameraRecordings.filter(r => r.date === selectedDate);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
      {/* Date Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
        {dates.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.dateChip, selectedDate === d && styles.dateChipActive]}
            onPress={() => setSelectedDate(d)}>
            <Text
              style={[
                styles.dateChipText,
                selectedDate === d && styles.dateChipTextActive,
              ]}>
              {d === 'all' ? 'Semua' : d}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.emptyRec}>
          <Icon name="video-off-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyRecText}>Belum ada rekaman</Text>
        </View>
      ) : (
        filtered.map(rec => (
          <View key={rec.id} style={styles.recCard}>
            <View style={styles.recThumb}>
              <Icon name="video" size={24} color={Colors.textMuted} />
              {rec.hasMotion && (
                <View style={styles.recMotionBadge}>
                  <Icon name="motion-sensor" size={10} color={Colors.accentYellow} />
                </View>
              )}
            </View>
            <View style={styles.recInfo}>
              <Text style={styles.recDate}>{rec.date}</Text>
              <Text style={styles.recTime}>
                {rec.startTime} – {rec.endTime}
              </Text>
              <View style={styles.recMeta}>
                <Icon name="clock-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.recMetaText}>{rec.duration}</Text>
                <Text style={styles.recMetaDot}>•</Text>
                <Icon name="harddisk" size={11} color={Colors.textMuted} />
                <Text style={styles.recMetaText}>{rec.size}</Text>
              </View>
            </View>
            <View style={styles.recActions}>
              <TouchableOpacity style={styles.recActionBtn}>
                <Icon name="play-circle-outline" size={26} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.recActionBtn}>
                <Icon name="download" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// ─── Tab: PENGATURAN ──────────────────────────────────────────────────────────
const SettingsTab = ({camera, onUpdate}) => {
  const [settings, setSettings] = useState({
    nightVision: camera.nightVision,
    audioEnabled: camera.audioEnabled,
    motionDetection: camera.motionDetection,
    autoRecord: camera.autoRecord,
  });
  const [resolution, setResolution] = useState(camera.resolution);
  const [fps, setFps] = useState(camera.fps);

  const RESOLUTIONS = ['720p', '1080p', '4K'];
  const FPS_OPTIONS = [15, 20, 25, 30];

  const toggle = (key) => {
    const next = {...settings, [key]: !settings[key]};
    setSettings(next);
    onUpdate(next);
  };

  const SettingToggle = ({icon, label, subtitle, settingKey}) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggle(settingKey)}
        trackColor={{false: Colors.border, true: Colors.primary + '60'}}
        thumbColor={settings[settingKey] ? Colors.primary : Colors.textMuted}
      />
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
      <Text style={styles.settingGroupLabel}>Kamera</Text>
      <View style={styles.settingCard}>
        <SettingToggle
          icon="weather-night"
          label="Night Vision"
          subtitle="Aktifkan penglihatan malam"
          settingKey="nightVision"
        />
        <View style={styles.settingDivider} />
        <SettingToggle
          icon="microphone"
          label="Audio"
          subtitle="Rekam audio bersama video"
          settingKey="audioEnabled"
        />
      </View>

      <Text style={styles.settingGroupLabel}>Deteksi & Rekaman</Text>
      <View style={styles.settingCard}>
        <SettingToggle
          icon="motion-sensor"
          label="Deteksi Gerakan"
          subtitle="Kirim notifikasi saat ada gerakan"
          settingKey="motionDetection"
        />
        <View style={styles.settingDivider} />
        <SettingToggle
          icon="record-circle"
          label="Rekaman Otomatis"
          subtitle="Rekam saat gerakan terdeteksi"
          settingKey="autoRecord"
        />
      </View>

      <Text style={styles.settingGroupLabel}>Kualitas Video</Text>
      <View style={styles.settingCard}>
        <Text style={styles.settingLabel2}>Resolusi</Text>
        <View style={styles.optionRow}>
          {RESOLUTIONS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.optionChip, resolution === r && styles.optionChipActive]}
              onPress={() => {
                setResolution(r);
                onUpdate({resolution: r});
              }}>
              <Text
                style={[
                  styles.optionChipText,
                  resolution === r && styles.optionChipTextActive,
                ]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.settingDivider} />
        <Text style={styles.settingLabel2}>Frame Rate (FPS)</Text>
        <View style={styles.optionRow}>
          {FPS_OPTIONS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.optionChip, fps === f && styles.optionChipActive]}
              onPress={() => {
                setFps(f);
                onUpdate({fps: f});
              }}>
              <Text
                style={[
                  styles.optionChipText,
                  fps === f && styles.optionChipTextActive,
                ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ─── Tab: INFO ────────────────────────────────────────────────────────────────
const InfoTab = ({camera}) => {
  const InfoRow = ({icon, label, value, valueColor}) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Icon name={icon} size={16} color={Colors.primary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && {color: valueColor}]}>{value}</Text>
    </View>
  );

  const batteryColor =
    camera.batteryLevel <= 15
      ? Colors.alertHigh
      : camera.batteryLevel <= 30
      ? Colors.alertMedium
      : Colors.online;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
      {/* Battery */}
      <View style={styles.batteryCard}>
        <View style={styles.batteryHeader}>
          <Icon
            name={camera.batteryLevel <= 15 ? 'battery-alert' : 'battery'}
            size={22}
            color={batteryColor}
          />
          <Text style={styles.batteryTitle}>Status Baterai</Text>
        </View>
        <View style={styles.batteryBarBg}>
          <View
            style={[
              styles.batteryBarFill,
              {
                width: `${camera.batteryLevel}%`,
                backgroundColor: batteryColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.batteryPct, {color: batteryColor}]}>
          {camera.batteryLevel}%{' '}
          {camera.batteryLevel <= 15 ? '— Segera isi ulang!' : '— Normal'}
        </Text>
      </View>

      <Text style={styles.infoGroupLabel}>Spesifikasi</Text>
      <View style={styles.infoCard}>
        <InfoRow icon="cctv" label="Resolusi" value={camera.resolution} />
        <View style={styles.infoDivider} />
        <InfoRow icon="film" label="Frame Rate" value={`${camera.fps} fps`} />
        <View style={styles.infoDivider} />
        <InfoRow icon="weather-night" label="Night Vision" value={camera.nightVision ? 'Aktif' : 'Nonaktif'} valueColor={camera.nightVision ? Colors.online : Colors.textMuted} />
        <View style={styles.infoDivider} />
        <InfoRow icon="microphone" label="Audio" value={camera.audioEnabled ? 'Aktif' : 'Nonaktif'} valueColor={camera.audioEnabled ? Colors.online : Colors.textMuted} />
      </View>

      <Text style={styles.infoGroupLabel}>Jaringan</Text>
      <View style={styles.infoCard}>
        <InfoRow icon="ip-network" label="Alamat IP" value={camera.ip} />
        <View style={styles.infoDivider} />
        <InfoRow icon="ethernet" label="MAC Address" value={camera.mac} />
        <View style={styles.infoDivider} />
        <InfoRow icon="wifi" label="Kekuatan Sinyal" value={`${camera.signalStrength}%`} valueColor={camera.signalStrength > 60 ? Colors.online : Colors.alertMedium} />
        <View style={styles.infoDivider} />
        <InfoRow icon="video-wireless" label="Stream URL" value={camera.streamUrl} />
      </View>

      <Text style={styles.infoGroupLabel}>Status</Text>
      <View style={styles.infoCard}>
        <InfoRow
          icon={camera.status === 'online' ? 'check-circle' : 'close-circle'}
          label="Status"
          value={camera.status === 'online' ? 'Online' : 'Offline'}
          valueColor={camera.status === 'online' ? Colors.online : Colors.offline}
        />
        <View style={styles.infoDivider} />
        <InfoRow icon="clock-outline" label="Uptime" value={camera.uptime} />
        <View style={styles.infoDivider} />
        <InfoRow icon="update" label="Firmware" value={camera.firmware} />
        <View style={styles.infoDivider} />
        <InfoRow
          icon="harddisk"
          label="Penyimpanan"
          value={`${camera.storage.used} / ${camera.storage.total} GB`}
        />
      </View>

      <Text style={styles.infoGroupLabel}>Lokasi</Text>
      <View style={styles.infoCard}>
        <InfoRow icon="map-marker" label="Lokasi" value={camera.location} />
        <View style={styles.infoDivider} />
        <InfoRow icon="tag" label="Nama Kamera" value={camera.name} />
      </View>
    </ScrollView>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TABS = ['Live', 'Rekaman', 'Pengaturan', 'Info'];

const CameraDetailScreen = ({route, navigation}) => {
  const {cameraId} = route.params;
  const {getCameraById, updateCamera, getRecordingsByCamera} = useApp();
  const [activeTab, setActiveTab] = useState(0);

  const camera = getCameraById(cameraId);
  const recordings = getRecordingsByCamera(cameraId);

  if (!camera) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={{color: Colors.textSecondary}}>Kamera tidak ditemukan</Text>
      </View>
    );
  }

  const handleUpdate = (updates) => {
    updateCamera(cameraId, updates);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0:
        return <LiveTab camera={camera} onUpdate={handleUpdate} />;
      case 1:
        return <RecordingsTab camera={camera} recordings={recordings} />;
      case 2:
        return <SettingsTab camera={camera} onUpdate={handleUpdate} />;
      case 3:
        return <InfoTab camera={camera} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{camera.name}</Text>
          <View style={styles.headerStatus}>
            <View
              style={[
                styles.headerStatusDot,
                {backgroundColor: camera.status === 'online' ? Colors.online : Colors.offline},
              ]}
            />
            <Text style={styles.headerStatusText}>
              {camera.status === 'online' ? 'Online' : 'Offline'} • {camera.location}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Icon name="dots-vertical" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === idx && styles.tabItemActive]}
            onPress={() => setActiveTab(idx)}>
            <Text
              style={[
                styles.tabItemText,
                activeTab === idx && styles.tabItemTextActive,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent2}>{renderTab()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {flex: 1},
  headerTitle: {fontSize: 16, fontWeight: '700', color: Colors.textPrimary},
  headerStatus: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2},
  headerStatusDot: {width: 6, height: 6, borderRadius: 3},
  headerStatusText: {fontSize: 11, color: Colors.textSecondary},
  headerBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {borderBottomColor: Colors.primary},
  tabItemText: {fontSize: 13, color: Colors.textMuted, fontWeight: '600'},
  tabItemTextActive: {color: Colors.primary},
  tabContent2: {flex: 1},
  tabContent: {padding: 16},

  // Live Tab
  playerContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#060A0F',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerScreen: {alignItems: 'center', gap: 8},
  playerStreamText: {fontSize: 14, color: Colors.textSecondary},
  playerUrl: {fontSize: 10, color: Colors.textMuted, maxWidth: 200},
  hudTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudLeft: {flexDirection: 'row', gap: 6},
  hudRight: {},
  hudTime: {fontSize: 12, color: '#fff', fontWeight: '600', backgroundColor: Colors.overlay, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4},
  hudBottom: {position: 'absolute', bottom: 10, left: 10},
  hudCamName: {fontSize: 13, fontWeight: '700', color: '#fff'},
  hudLocation: {fontSize: 10, color: 'rgba(255,255,255,0.7)'},

  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundCard,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  zoomSliderWrap: {flex: 1},
  zoomLabel: {fontSize: 12, color: Colors.textSecondary, width: 32, textAlign: 'right'},

  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ctrlBtn: {flex: 1, alignItems: 'center', gap: 6},
  ctrlIconBg: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ctrlLabel: {fontSize: 10, color: Colors.textSecondary, fontWeight: '500'},

  ptzSection: {padding: 16},
  sectionLabel: {fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12},
  ptzContainer: {alignItems: 'center', gap: 4},
  ptzRow: {alignItems: 'center'},
  ptzRowMid: {flexDirection: 'row', alignItems: 'center', gap: 20},
  ptzBtn: {padding: 6},

  // Recordings Tab
  dateRow: {marginBottom: 14},
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  dateChipActive: {backgroundColor: Colors.primary + '20', borderColor: Colors.primary},
  dateChipText: {fontSize: 12, color: Colors.textSecondary, fontWeight: '600'},
  dateChipTextActive: {color: Colors.primary},
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  recThumb: {
    width: 64,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0A0E14',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recMotionBadge: {position: 'absolute', top: 3, right: 3, backgroundColor: Colors.accentYellow + '30', borderRadius: 4, padding: 2},
  recInfo: {flex: 1},
  recDate: {fontSize: 11, color: Colors.textMuted, marginBottom: 2},
  recTime: {fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4},
  recMeta: {flexDirection: 'row', alignItems: 'center', gap: 4},
  recMetaText: {fontSize: 11, color: Colors.textMuted},
  recMetaDot: {fontSize: 10, color: Colors.textMuted},
  recActions: {flexDirection: 'row', alignItems: 'center', gap: 4},
  recActionBtn: {padding: 4},
  emptyRec: {alignItems: 'center', paddingVertical: 40, gap: 10},
  emptyRecText: {fontSize: 14, color: Colors.textMuted},

  // Settings Tab
  settingGroupLabel: {fontSize: 12, color: Colors.textMuted, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, marginTop: 4, textTransform: 'uppercase'},
  settingCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {flex: 1},
  settingLabel: {fontSize: 14, fontWeight: '600', color: Colors.textPrimary},
  settingLabel2: {fontSize: 13, fontWeight: '600', color: Colors.textPrimary, paddingHorizontal: 14, paddingTop: 14, marginBottom: 10},
  settingSubtitle: {fontSize: 11, color: Colors.textSecondary, marginTop: 1},
  settingDivider: {height: 1, backgroundColor: Colors.border, marginHorizontal: 14},
  optionRow: {flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 14, flexWrap: 'wrap'},
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionChipActive: {backgroundColor: Colors.primary + '20', borderColor: Colors.primary},
  optionChipText: {fontSize: 13, color: Colors.textSecondary, fontWeight: '600'},
  optionChipTextActive: {color: Colors.primary},

  // Info Tab
  batteryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  batteryHeader: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12},
  batteryTitle: {fontSize: 15, fontWeight: '700', color: Colors.textPrimary},
  batteryBarBg: {height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 6},
  batteryBarFill: {height: '100%', borderRadius: 4},
  batteryPct: {fontSize: 12, fontWeight: '600'},
  infoGroupLabel: {fontSize: 12, color: Colors.textMuted, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, marginTop: 4, textTransform: 'uppercase'},
  infoCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  infoRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 10},
  infoIconWrap: {width: 28, height: 28, borderRadius: 7, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center'},
  infoLabel: {flex: 1, fontSize: 13, color: Colors.textSecondary},
  infoValue: {fontSize: 13, color: Colors.textPrimary, fontWeight: '600', maxWidth: 180, textAlign: 'right'},
  infoDivider: {height: 1, backgroundColor: Colors.border, marginHorizontal: 14},
});

export default CameraDetailScreen;
