import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../context/AuthContext';
import AnimatedInput from '../../components/common/AnimatedInput';
import LoadingButton from '../../components/common/LoadingButton';
import {Colors} from '../../theme/colors';

const LOGIN_TABS = [
  {id: 'email', label: 'Email', icon: 'email-outline'},
  {id: 'phone', label: 'Telepon', icon: 'phone-outline'},
  {id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp'},
];

const LoginScreen = ({navigation}) => {
  const {login} = useAuth();
  const [activeTab, setActiveTab] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(logoAnim, {toValue: 1, tension: 80, friction: 8, useNativeDriver: true}),
      Animated.timing(formOpacity, {toValue: 1, duration: 600, delay: 300, useNativeDriver: true}),
      Animated.timing(formAnim, {toValue: 0, duration: 500, delay: 300, useNativeDriver: true}),
    ]).start();
  }, []);

  const getPlaceholder = () => {
    const map = {
      email: 'rizki@mobilejaga.id',
      phone: '08xxxxxxxxxx',
      whatsapp: '08xxxxxxxxxx',
    };
    return map[activeTab];
  };

  const getLeftIcon = () => {
    const map = {
      email: 'email-outline',
      phone: 'phone-outline',
      whatsapp: 'whatsapp',
    };
    return map[activeTab];
  };

  const getKeyboardType = () => {
    if (activeTab === 'email') return 'email-address';
    return 'phone-pad';
  };

  const validate = () => {
    const newErrors = {};

    if (!identifier.trim()) {
      if (activeTab === 'email') newErrors.identifier = 'Email wajib diisi';
      else newErrors.identifier = 'Nomor telepon wajib diisi';
    } else if (activeTab === 'email' && !/\S+@\S+\.\S+/.test(identifier)) {
      newErrors.identifier = 'Format email tidak valid';
    } else if (activeTab !== 'email' && identifier.replace(/\D/g, '').length < 10) {
      newErrors.identifier = 'Nomor telepon tidak valid (min 10 digit)';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoginError('');
    setIsLoading(true);

    const result = await login(identifier.trim(), password);

    if (!result.success) {
      setLoginError(result.error);
    }
    setIsLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIdentifier('');
    setErrors({});
    setLoginError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Header / Logo */}
        <Animated.View style={[styles.header, {opacity: logoAnim, transform: [{scale: logoAnim}]}]}>
          <View style={styles.logoContainer}>
            <Icon name="shield-home" size={52} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>Mobile Jaga Rumah</Text>
          <Text style={styles.appTagline}>Sistem Keamanan Rumah Pintar</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.card,
            {opacity: formOpacity, transform: [{translateY: formAnim}]},
          ]}>
          <Text style={styles.title}>Masuk ke Akun</Text>
          <Text style={styles.subtitle}>Pantau keamanan rumah Anda kapan saja</Text>

          {/* Login Method Tabs */}
          <View style={styles.tabContainer}>
            {LOGIN_TABS.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => handleTabChange(tab.id)}>
                <Icon
                  name={tab.icon}
                  size={16}
                  color={activeTab === tab.id ? Colors.primary : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab.id && styles.tabLabelActive,
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs */}
          <AnimatedInput
            label={
              activeTab === 'email'
                ? 'Alamat Email'
                : activeTab === 'phone'
                ? 'Nomor Telepon'
                : 'Nomor WhatsApp'
            }
            value={identifier}
            onChangeText={text => {
              setIdentifier(text);
              if (errors.identifier) setErrors(prev => ({...prev, identifier: ''}));
              if (loginError) setLoginError('');
            }}
            error={errors.identifier}
            keyboardType={getKeyboardType()}
            placeholder={getPlaceholder()}
            leftIcon={getLeftIcon()}
          />

          <AnimatedInput
            label="Password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({...prev, password: ''}));
              if (loginError) setLoginError('');
            }}
            error={errors.password}
            secureTextEntry={!showPassword}
            placeholder="Masukkan password Anda"
            leftIcon="lock-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {/* Login Error */}
          {loginError ? (
            <View style={styles.loginErrorContainer}>
              <Icon name="alert-circle" size={16} color={Colors.alertHigh} />
              <Text style={styles.loginErrorText}>{loginError}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <LoadingButton
            title="Masuk"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.loginBtn}
          />

          {/* Demo hint */}
          <View style={styles.demoHint}>
            <Icon name="information-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.demoText}>
              Demo: rizki@mobilejaga.id / password123
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <Text style={styles.registerTextBold}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 5,
  },
  tabActive: {
    backgroundColor: Colors.backgroundCard,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  loginErrorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.alertHigh + '15',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.alertHigh + '30',
  },
  loginErrorText: {
    color: Colors.alertHigh,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    marginBottom: 16,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  demoText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  registerTextBold: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
