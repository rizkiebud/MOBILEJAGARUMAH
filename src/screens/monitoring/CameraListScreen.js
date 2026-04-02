import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useApp} from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import {Colors} from '../../theme/colors';

const {width} = Dimensions.get('window');

const FILTERS = [
  {id: 'all', label: 'Semua'},
  {id: 'online', label: 'Online'},
  {id: 'offline', label: 'Offline'},
  {id: 'recording', label: 'Merekam'},
];

const BatteryIcon = ({level}) => {
  let icon = 'battery';
  let color = Colors.online;
  if (level <= 15) {
    icon = 'battery-alert';
    color = Colors.alertHigh;
  } else if (level <= 30) {
    icon = 'battery-low';
    color = Colors.alertMedium;
  } else if (level <= 60) {
    icon = 'battery-medium';
    color = Colors.accentYellow;
  }
  return <Icon name={icon} size={14} color={color} />;
};

const CameraGridCard = ({camera, onPress}) => (
  <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.85}>
    {/* Preview area */}
    <View style={styles.gridPreview}>
      <Icon name="cctv" size={32} color={Colors.textMuted} />
      <View style={styles.gridBadges}>
        {camera.status === 'online' && <StatusBadge type="LIVE" />}
        {camera.isRecording && <StatusBadge type="REC" />}
        {camera.hasMotion && <StatusBadge type="MOTION" />}
        {camera.batteryLevel <= 15 && <StatusBadge type="BATTERY" />}
      </View>
      <View
        style={[
          styles.gridStatusDot,
          {backgroundColor: camera.status === 'online' ? Colors.online : Colors.offline},
        ]}
      />
    </View>

    {/* Info */}
    <View style={styles.gridInfo}>
      <Text style={styles.gridName} numberOfLines={1}>{camera.name}</Text>
      <Text style={styles.gridLocation} numberOfLines={1}>{camera.location}</Text>
      <View style={styles.gridMeta}>
        <View style={styles.gridMetaItem}>
          <BatteryIcon level={camera.batteryLevel} />
          <Text style={styles.gridMetaText}>{camera.batteryLevel}%</Text>
        </View>
        <Text style={styles.gridMetaDot}>•</Text>
        <Text style={styles.gridMetaText}>{camera.resolution}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const CameraListCard = ({camera, onPress}) => (
  <TouchableOpacity style={styles.listCard} onPress={onPress} activeOpacity={0.85}>
    {/* Preview */}
    <View style={styles.listPreview}>
      <Icon name="cctv" size={24} color={Colors.textMuted} />
      <View
        style={[
          styles.listStatusDot,
          {backgroundColor: camera.status === 'online' ? Colors.online : Colors.offline},
        ]}
      />
    </View>

    {/* Info */}
    <View style={styles.listInfo}>
      <View style={styles.listRow}>
        <Text style={styles.listName} numberOfLines={1}>{camera.name}</Text>
        <View style={styles.listBadges}>
          {camera.status === 'online' && <StatusBadge type="LIVE" />}
          {camera.isRecording && <StatusBadge type="REC" />}
          {camera.hasMotion && <StatusBadge type="MOTION" />}
        </View>
      </View>
      <Text style={styles.listLocation}>{camera.location}</Text>
      <View style={styles.listMeta}>
        <Icon
          name={camera.status === 'online' ? 'wifi' : 'wifi-off'}
          size={12}
          color={camera.status === 'online' ? Colors.online : Colors.offline}
        />
        <Text
          style={[
            styles.listMetaText,
            {color: camera.status === 'online' ? Colors.online : Colors.offline},
          ]}>
          {camera.status === 'online' ? 'Online' : 'Offline'}
        </Text>
        <Text style={styles.listMetaDot}>•</Text>
        <BatteryIcon level={camera.batteryLevel} />
        <Text style={styles.listMetaText}>{camera.batteryLevel}%</Text>
        <Text style={styles.listMetaDot}>•</Text>
        <Text style={styles.listMetaText}>{camera.resolution}</Text>
        <Text style={styles.listMetaDot}>•</Text>
        <Text style={styles.listMetaText}>{camera.fps} fps</Text>
      </View>
    </View>

    <Icon name="chevron-right" size={18} color={Colors.textMuted} />
  </TouchableOpacity>
);

const CameraListScreen = ({navigation}) => {
  const {cameras, cameraStats} = useApp();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCameras = useMemo(() => {
    let result = cameras;

    // Filter
    if (activeFilter === 'online') result = result.filter(c => c.status === 'online');
    else if (activeFilter === 'offline') result = result.filter(c => c.status === 'offline');
    else if (activeFilter === 'recording') result = result.filter(c => c.isRecording);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q),
      );
    }

    return result;
  }, [cameras, activeFilter, searchQuery]);

  const handleCameraPress = camera => {
    navigation.navigate('CameraDetail', {cameraId: camera.id});
  };

  const renderGridItem = ({item}) => (
    <CameraGridCard camera={item} onPress={() => handleCameraPress(item)} />
  );

  const renderListItem = ({item}) => (
    <CameraListCard camera={item} onPress={() => handleCameraPress(item)} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari kamera..."
            placeholderTextColor={Colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(v => (v === 'grid' ? 'list' : 'grid'))}>
          <Icon
            name={viewMode === 'grid' ? 'view-list' : 'view-grid'}
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, {backgroundColor: Colors.primary}]} />
          <Text style={styles.statText}>{cameraStats.total} Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statDot, {backgroundColor: Colors.online}]} />
          <Text style={styles.statText}>{cameraStats.online} Online</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statDot, {backgroundColor: Colors.recBadge}]} />
          <Text style={styles.statText}>{cameraStats.recording} Rekam</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statDot, {backgroundColor: Colors.offline}]} />
          <Text style={styles.statText}>{cameraStats.offline} Offline</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.id)}>
            <Text
              style={[
                styles.filterChipText,
                activeFilter === f.id && styles.filterChipTextActive,
              ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Camera List */}
      {filteredCameras.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="cctv-off" size={52} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Tidak Ada Kamera</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : 'Tidak ada kamera dengan filter ini'}
          </Text>
        </View>
      ) : (
        <FlatList
          key={viewMode}
          data={filteredCameras}
          keyExtractor={item => item.id}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          numColumns={viewMode === 'grid' ? 2 : 1}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  viewToggle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  statDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },

  // Grid Card
  gridCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gridPreview: {
    height: 100,
    backgroundColor: '#0A0E14',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridBadges: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  gridStatusDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.backgroundCard,
  },
  gridInfo: {
    padding: 10,
  },
  gridName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  gridLocation: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  gridMetaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  gridMetaDot: {
    color: Colors.textMuted,
    fontSize: 10,
  },

  // List Card
  listCard: {
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
  listPreview: {
    width: 72,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#0A0E14',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  listStatusDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.backgroundCard,
  },
  listInfo: {
    flex: 1,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  listName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  listBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  listLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  listMetaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  listMetaDot: {
    color: Colors.textMuted,
    fontSize: 10,
  },

  // Empty
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default CameraListScreen;
