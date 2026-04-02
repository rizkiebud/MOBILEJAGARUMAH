import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

const StatusBadge = ({type, size = 'sm'}) => {
  const configs = {
    LIVE: {color: Colors.liveBadge, label: 'LIVE', pulse: true},
    REC: {color: Colors.recBadge, label: 'REC'},
    MOTION: {color: Colors.accentYellow, label: 'GERAKAN'},
    OFFLINE: {color: Colors.offline, label: 'OFFLINE'},
    ONLINE: {color: Colors.online, label: 'ONLINE'},
    BATTERY: {color: Colors.alertHigh, label: 'BATERAI'},
  };

  const config = configs[type] || configs.OFFLINE;
  const isLarge = size === 'lg';

  return (
    <View style={[styles.badge, {backgroundColor: config.color + '33'}, isLarge && styles.badgeLg]}>
      <View style={[styles.dot, {backgroundColor: config.color}, isLarge && styles.dotLg]} />
      <Text style={[styles.label, {color: config.color}, isLarge && styles.labelLg]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  badgeLg: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotLg: {
    width: 7,
    height: 7,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  labelLg: {
    fontSize: 11,
  },
});

export default StatusBadge;
