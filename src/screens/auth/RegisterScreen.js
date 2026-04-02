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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../context/AuthContext';
import AnimatedInput from '../../components/common/AnimatedInput';
import LoadingButton from '../../components/common/LoadingButton';
import {Colors} from '../../theme/colors';

const RegisterScreen = ({navigation}) => {
  const {register} = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');

  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {toValue: 0, duration: 500, useNativeDriver: true}),
      Animated.timing(opacityAnim, {toValue: 1, duration: 500, useNativeDriver: true}),
    ]).start();
  }, []);

  const updateForm = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
    if (errors[field]) setErrors(prev => ({...prev, [field]: ''}));
    if (registerError) setRegisterError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Nomor telepon tidak valid';
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password harus mengandung huruf dan angka';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setRegisterError('');
    setIsLoading(true);

    const result = await register(form);

    if (!result.success) {
      setRegisterError(result.error);
    }
    setIsLoading(false);
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return {level: 'Lemah', color: Colors.alertHigh, width: '25%'};
    if (p.length < 8 || !/[A-Z]/.test(p)) return {level: 'Cukup', color: Colors.accentYellow, width: '50%'};
    if (!/[!@#$%^&*]/.test(p)) return {level: 'Kuat', color: Colors.accentGreen, width: '75%'};
    return {level: 'Sangat Kuat', color: Colors.secondary, width: '100%'};
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Buat Akun</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <Animated.View
          style={{opacity: opacityAnim, transform: [{translateY: slideAnim}]}}>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name="account-plus-outline" size={42} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Buat Akun Baru</Text>
          <Text style={styles.subtitle}>
            Daftarkan diri Anda untuk mulai memantau keamanan
          </Text>

          {/* Register Error */}
          {registerError ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle" size={16} color={Colors.alertHigh} />
              <Text style={styles.errorBannerText}>{registerError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <AnimatedInput
            label="Nama Lengkap *"
            value={form.name}
            onChangeText={v => updateForm('name', v)}
            error={errors.name}
            placeholder="Masukkan nama lengkap Anda"
            leftIcon="account-outline"
            autoCapitalize="words"
          />

          <AnimatedInput
            label="Alamat Email *"
            value={form.email}
            onChangeText={v => updateForm('email', v)}
            error={errors.email}
            keyboardType="email-address"
            placeholder="nama@domain.com"
            leftIcon="email-outline"
          />

          <AnimatedInput
            label="Nomor Telepon"
            value={form.phone}
            onChangeText={v => updateForm('phone', v)}
            error={errors.phone}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx (opsional)"
            leftIcon="phone-outline"
          />

          <AnimatedInput
            label="Nomor WhatsApp"
            value={form.whatsapp}
            onChangeText={v => updateForm('whatsapp', v)}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx (opsional)"
            leftIcon="whatsapp"
          />

          <AnimatedInput
            label="Password *"
            value={form.password}
            onChangeText={v => updateForm('password', v)}
            error={errors.password}
            secureTextEntry={!showPassword}
            placeholder="Minimal 6 karakter"
            leftIcon="lock-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {/* Password Strength */}
          {passwordStrength && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {width: passwordStrength.width, backgroundColor: passwordStrength.color},
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, {color: passwordStrength.color}]}>
                {passwordStrength.level}
              </Text>
            </View>
          )}

          <AnimatedInput
            label="Konfirmasi Password *"
            value={form.confirmPassword}
            onChangeText={v => updateForm('confirmPassword', v)}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholder="Ulangi password Anda"
            leftIcon="lock-check-outline"
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Terms */}
          <Text style={styles.terms}>
            Dengan mendaftar, Anda menyetujui{' '}
            <Text style={styles.termsLink}>Syarat & Ketentuan</Text> dan{' '}
            <Text style={styles.termsLink}>Kebijakan Privasi</Text> kami.
          </Text>

          {/* Register Button */}
          <LoadingButton
            title="Buat Akun"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.registerBtn}
          />

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <Text style={styles.loginTextBold}>Masuk</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.alertHigh + '15',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.alertHigh + '30',
  },
  errorBannerText: {
    color: Colors.alertHigh,
    fontSize: 13,
    flex: 1,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -8,
    marginBottom: 16,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    width: 70,
    textAlign: 'right',
  },
  terms: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  registerBtn: {
    marginBottom: 16,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginTextBold: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RegisterScreen;
