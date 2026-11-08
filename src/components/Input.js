import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radii } from '../theme/colors';
import Icon from './Icon';

export default function Input({
  label,
  icon,
  secureTextEntry,
  error,
  helperText,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isPassword = Boolean(secureTextEntry);
  const effectiveSecure = isPassword && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={18}
            color={isFocused ? colors.primary : colors.slate400}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          placeholderTextColor={colors.slate400}
          style={[styles.input, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={effectiveSecure}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setIsPasswordVisible((v) => !v)}
            activeOpacity={0.7}
          >
            <Icon
              name={isPasswordVisible ? 'eyeOff' : 'eye'}
              size={18}
              color={colors.slate400}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate700,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FAFDFB',
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.dark,
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.danger,
    marginTop: 4,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 11,
    color: colors.slate500,
    marginTop: 4,
    marginLeft: 2,
  },
});
