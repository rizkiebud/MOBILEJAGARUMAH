import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CameraListScreen from '../screens/monitoring/CameraListScreen';
import CameraDetailScreen from '../screens/monitoring/CameraDetailScreen';
import {Colors} from '../theme/colors';

const Stack = createNativeStackNavigator();

const MonitoringNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: Colors.backgroundCard},
      headerTintColor: Colors.textPrimary,
      headerTitleStyle: {fontWeight: '700'},
      headerShadowVisible: false,
    }}>
    <Stack.Screen
      name="CameraList"
      component={CameraListScreen}
      options={{title: 'Monitoring CCTV'}}
    />
    <Stack.Screen
      name="CameraDetail"
      component={CameraDetailScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default MonitoringNavigator;
