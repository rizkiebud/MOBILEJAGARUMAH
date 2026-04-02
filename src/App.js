import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './context/AuthContext';
import {AppProvider} from './context/AppContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <AppNavigator />
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
