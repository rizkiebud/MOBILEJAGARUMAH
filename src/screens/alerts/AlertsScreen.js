import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useApp} from '../../context/AppContext';
import {Colors} from '../../theme/colors';

const FILTERS = [
  {id: 'all', label: 'Semua', icon: 'bell-outline'},
  {id: 'motion', label: 'Gerakan', icon: 'motion-sensor'},
  {id: 'offline', label: 'Offline', icon: 'wifi-off'},
  {id: 'battery', label: 'Baterai', icon: 'battery-alert'},
  {id: 'system', label: 'Sistem', icon: 'cog-outline'},
];

const SEVERITY_CONFIG = {
  high: {color: Colors.alertHigh, label: 'Tinggi', bg: Colors.alertHigh + '15'},
  medium: {color: Colors.alertMedium, label: 'Sedang', bg: Colors.alertMedium + '15'},
  low: {color: Colors.alertLow, label: 'Rendah', bg: Colors.alertLow + '15'},
};

const TYPE_ICON = {
  motion: 'motion-sensor',
  offline: 'wifi-off',
  battery: 'battery-alert',
  system: 'cog-outline',
};

const getTimeAgo = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
};

const AlertItem = ({item, onMarkRead, onDelete, onNavigate}) => {
  const sev = SEVERITY_CONFIG[item.severity];

  return (
    <View style={[styles.alertCard, !item.isRead && styles.alertCardUnread]}>
      {!item.isRead && <View style={styles.unreadBar} />}

      <View style={styles.alertMain}>
        {/* Icon */}
        <View style={[styles.alertIconBg, {backgroundColor: sev.bg}]}>
          <Icon name={TYPE_ICON[item.type] || 'bell'} size={20} color={sev.color} />
        </View>

        {/* Content */}
        <View style={styles.alertContent}>
          <View style={styles.alertTopRow}>
            <Text style={[styles.alertTitle, !item.isRead && styles.alertTitleUnread]}>
              {item.title}
            </Text>
            <View style={[styles.severityBadge, {backgroundColor: sev.bg}]}>
              <Text style={[styles.severityText, {color: sev.color}]}>{sev.label}</Text>
            </View>
          </View>

          <Text style={styles.alertMessage} numberOfLines={2}>{item.message}</Text>

          <View style={styles.alertBottomRow}>
            {item.cameraName && (
              <View style={styles.cameraBadge}>
                <Icon name="cctv" size={10} color={Colors.textMuted} />
                <Text style={styles.cameraName}>{item.cameraName}</Text>
              </View>
            )}
            <Text style={styles.alertTime}>{getTimeAgo(item.timestamp)}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.alertActions}>
        {!item.isRead && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onMarkRead(item.id)}>
            <Icon name="check" size={15} color={Colors.primary} />
            <Text style={styles.actionText}>Tandai dibaca</Text>
          </TouchableOpacity>
        )}

        {item.cameraId && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate(item.cameraId)}>
            <Icon name="cctv" size={15} color={Colors.textSecondary} />
            <Text style={styles.actionTextGray}>Lihat kamera</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item.id)}>
          <Icon name="trash-can-outline" size={15} color={Colors.alertHigh} />
          <Text style={styles.actionTextDanger}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AlertsScreen = ({navigation}) => {
  const {alerts, unreadAlertsCount, markAlertRead, markAllAlertsRead, deleteAlert, deleteAllAlerts} =
    useApp();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return alerts;
    return alerts.filter(a => a.type === activeFilter);
  }, [alerts, activeFilter]);

  const unreadInFilter = filtered.filter(a => !a.isRead).length;

  const handleMarkRead = (id) => markAlertRead(id);

  const handleDelete = (id) => {
    Alert.alert('Hapus Peringatan', 'Yakin ingin menghapus peringatan ini?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Hapus', style: 'destructive', onPress: () => deleteAlert(id)},
    ]);
  };

  const handleDeleteAll = () => {
    Alert.alert('Hapus Semua', 'Yakin ingin menghapus semua peringatan?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Hapus Semua', style: 'destructive', onPress: deleteAllAlerts},
    ]);
  };

  const handleNavigateCamera = (cameraId) => {
    navigation.navigate('Monitoring', {
      screen: 'CameraDetail',
      params: {cameraId},
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <Text style={styles.actionBarInfo}>
          {unreadAlertsCount > 0
            ? `${unreadAlertsCount} belum dibaca`
            : 'Semua sudah dibaca'}
        </Text>
        <View style={styles.actionBarBtns}>
          {unreadAlertsCount > 0 && (
            <TouchableOpacity style={styles.topBtn} onPress={markAllAlertsRead}>
              <Icon name="check-all" size={16} color={Colors.primary} />
              <Text style={styles.topBtnText}>Baca Semua</Text>
            </TouchableOpacity>
          )}
          {alerts.length > 0 && (
            <TouchableOpacity style={[styles.topBtn, styles.topBtnDanger]} onPress={handleDeleteAll}>
              <Icon name="trash-can-outline" size={16} color={Colors.alertHigh} />
              <Text style={[styles.topBtnText, {color: Colors.alertHigh}]}>Hapus Semua</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterScroll}>
        {FILTERS.map(f => {
          const count =
            f.id === 'all'
              ? alerts.filter(a => !a.isRead).length
              : alerts.filter(a => a.type === f.id && !a.isRead).length;

          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.id)}>
              <Icon
                name={f.icon}
                size={14}
                color={activeFilter === f.id ? Colors.primary : Colors.textMuted}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === f.id && styles.filterChipTextActive,
                ]}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="bell-check-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Tidak Ada Peringatan</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'all'
              ? 'Belum ada peringatan yang masuk'
              : `Tidak ada peringatan kategori "${FILTERS.find(f => f.id === activeFilter)?.label}"`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <AlertItem
              item={item}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onNavigate={handleNavigateCamera}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionBarInfo: {fontSize: 13, color: Colors.textSecondary, fontWeight: '500'},
  actionBarBtns: {flexDirection: 'row', gap: 8},
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
  },
  topBtnDanger: {backgroundColor: Colors.alertHigh + '15'},
  topBtnText: {fontSize: 12, color: Colors.primary, fontWeight: '600'},

  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {backgroundColor: Colors.primary + '20', borderColor: Colors.primary},
  filterChipText: {fontSize: 12, color: Colors.textMuted, fontWeight: '600'},
  filterChipTextActive: {color: Colors.primary},
  filterBadge: {
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: Colors.alertHigh,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {fontSize: 9, color: '#fff', fontWeight: '800'},

  listContent: {padding: 16, paddingTop: 4},

  alertCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  alertCardUnread: {borderColor: Colors.primary + '40'},
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.primary,
  },
  alertMain: {
    flexDirection: 'row',
    padding: 14,
    paddingLeft: 17,
    gap: 12,
  },
  alertIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  alertContent: {flex: 1},
  alertTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    flex: 1,
  },
  alertTitleUnread: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  severityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    flexShrink: 0,
  },
  severityText: {fontSize: 10, fontWeight: '700'},
  alertMessage: {fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginBottom: 8},
  alertBottomRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  cameraBadge: {flexDirection: 'row', alignItems: 'center', gap: 4},
  cameraName: {fontSize: 11, color: Colors.textMuted},
  alertTime: {fontSize: 11, color: Colors.textMuted},

  alertActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionText: {fontSize: 11, color: Colors.primary, fontWeight: '600'},
  actionTextGray: {fontSize: 11, color: Colors.textSecondary, fontWeight: '600'},
  actionTextDanger: {fontSize: 11, color: Colors.alertHigh, fontWeight: '600'},

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {fontSize: 16, fontWeight: '700', color: Colors.textSecondary},
  emptySubtitle: {fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19},
});

export default AlertsScreen;
