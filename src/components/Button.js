import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, shadows, radii } from '../theme/colors';
import Icon from './Icon';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const isGoogle = variant === 'google';
  const isOutline = variant === 'outline' || variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isMp = variant === 'mp';
  const isGreen = variant === 'green' || variant === 'primary';
  const isDanger = variant === 'danger';

  // Base background
  let bgStyle = styles.bgPrimary;
  let labelColor = colors.white;

  if (isGoogle) {
    bgStyle = styles.bgGoogle;
    labelColor = colors.slate800;
  } else if (isOutline) {
    bgStyle = styles.bgOutline;
    labelColor = colors.primary;
  } else if (isGhost) {
    bgStyle = styles.bgGhost;
    labelColor = colors.primary;
  } else if (isMp) {
    bgStyle = styles.bgMp;
    labelColor = colors.white;
  } else if (isDanger) {
    bgStyle = styles.bgDanger;
    labelColor = colors.white;
  }

  const sizeStyle = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const textSizeStyle = size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[
        styles.base,
        bgStyle,
        sizeStyle,
        !isOutline && !isGhost && shadows.sm,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {isGoogle && (
            <View style={styles.googleIconBadge}>
              <Text style={styles.googleG}>G</Text>
            </View>
          )}

          {icon && iconPosition === 'left' && !isGoogle && (
            <Icon
              name={icon}
              size={size === 'sm' ? 16 : 18}
              color={labelColor}
              style={styles.iconLeft}
            />
          )}

          <Text style={[styles.text, textSizeStyle, { color: labelColor }, textStyle]}>
            {title}
          </Text>

          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={size === 'sm' ? 16 : 18}
              color={labelColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  bgMp: {
    backgroundColor: colors.mp,
  },
  bgOutline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  bgGhost: {
    backgroundColor: 'transparent',
  },
  bgDanger: {
    backgroundColor: colors.danger,
  },
  bgGoogle: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EA4335',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  googleG: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 13,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
