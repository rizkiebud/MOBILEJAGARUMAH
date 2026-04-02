import React, {useRef, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import {Colors} from '../../theme/colors';

const LoadingButton = ({
  title,
  onPress,
  isLoading,
  disabled,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {toValue: 0.7, duration: 800, useNativeDriver: true}),
          Animated.timing(opacityAnim, {toValue: 1, duration: 800, useNativeDriver: true}),
        ]),
      ).start();
    } else {
      opacityAnim.stopAnimation();
      opacityAnim.setValue(1);
    }
  }, [isLoading, opacityAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
      textColor: Colors.textPrimary,
    },
    secondary: {
      backgroundColor: Colors.backgroundSecondary,
      textColor: Colors.textPrimary,
    },
    danger: {
      backgroundColor: Colors.alertHigh,
      textColor: Colors.textPrimary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: Colors.primary,
      borderWidth: 1.5,
      textColor: Colors.primary,
    },
  };

  const vs = variantStyles[variant];

  return (
    <Animated.View
      style={[{transform: [{scale: scaleAnim}], opacity: opacityAnim}, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: vs.backgroundColor},
          vs.borderColor && {borderColor: vs.borderColor, borderWidth: vs.borderWidth},
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        activeOpacity={0.9}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={vs.textColor} size="small" />
            <Text style={[styles.text, {color: vs.textColor}, textStyle]}>
              Memproses...
            </Text>
          </View>
        ) : (
          <Text style={[styles.text, {color: vs.textColor}, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default LoadingButton;
