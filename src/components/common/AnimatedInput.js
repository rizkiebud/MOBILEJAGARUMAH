import React, {useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../theme/colors';

const AnimatedInput = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, {toValue: 10, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: -10, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: 10, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: -10, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: 0, duration: 60, useNativeDriver: true}),
      ]).start();
    }
  }, [error, shakeAnim]);

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? Colors.alertHigh : Colors.border,
      error ? Colors.alertHigh : Colors.primary,
    ],
  });

  return (
    <Animated.View style={[styles.container, {transform: [{translateX: shakeAnim}]}]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputWrapper, {borderColor}]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={error ? Colors.alertHigh : Colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoCorrect={false}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Icon name={rightIcon} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={14} color={Colors.alertHigh} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    height: '100%',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.alertHigh,
    flex: 1,
  },
});

export default AnimatedInput;
