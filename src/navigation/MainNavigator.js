import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MonitoringNavigator from './MonitoringNavigator';
import AlertsScreen from '../screens/alerts/AlertsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import {useApp} from '../context/AppContext';
import {Colors} from '../theme/colors';

const Tab = createBottomTabNavigator();

const BadgeIcon = ({name, color, size, count}) => (
  <View style={{position: 'relative'}}>
    <Icon name={name} size={size} color={color} />
    {count > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
      </View>
    )}
  </View>
);

const MainNavigator = () => {
  const {unreadAlertsCount} = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
        headerStyle: {backgroundColor: Colors.backgroundCard},
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {fontWeight: '700'},
        headerShadowVisible: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <Icon name="view-dashboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Monitoring"
        component={MonitoringNavigator}
        options={{
          headerShown: false,
          title: 'Monitoring',
          tabBarIcon: ({color, size}) => (
            <Icon name="cctv" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: 'Peringatan',
          tabBarIcon: ({color, size}) => (
            <BadgeIcon
              name="bell-outline"
              color={color}
              size={size}
              count={unreadAlertsCount}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({color, size}) => (
            <Icon name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBarBorder,
    height: Platform.OS === 'ios' ? 85 : 62,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    paddingTop: 8,
    elevation: 0,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: Colors.tabBar,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.alertHigh,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.tabBar,
  },
  badgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '800',
  },
});

export default MainNavigator;
