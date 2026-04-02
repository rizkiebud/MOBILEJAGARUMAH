import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEMO_USER} from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isEmail = identifier === DEMO_USER.email;
    const isPhone = identifier === DEMO_USER.phone || identifier === '081234567890';
    const isWhatsapp = identifier === DEMO_USER.whatsapp;

    if ((isEmail || isPhone || isWhatsapp) && password === DEMO_USER.password) {
      const userData = {...DEMO_USER};
      delete userData.password;
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return {success: true};
    }

    return {
      success: false,
      error: 'Email/nomor dan password tidak cocok. Demo: rizki@mobilejaga.id / password123',
    };
  };

  const register = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (data.email === DEMO_USER.email) {
      return {success: false, error: 'Email sudah terdaftar'};
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      avatar: data.name.substring(0, 2).toUpperCase(),
      plan: 'Basic',
      planExpiry: '',
      joinDate: new Date().toISOString().split('T')[0],
      daysActive: 0,
    };

    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return {success: true};
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updates) => {
    const updatedUser = {...user, ...updates};
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
