import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Mapeo semántico de iconos para alta consistencia visual y cross-platform
const ICON_MAP = {
  home: '⌂',
  scan: '⛶',
  camera: '📷',
  map: '📍',
  pin: '📍',
  wallet: '💳',
  recycle: '♻',
  leaf: '🌱',
  bottle: '🍾',
  water: '💧',
  co2: '☁',
  check: '✓',
  close: '✕',
  arrowRight: '→',
  arrowLeft: '←',
  chevronRight: '›',
  lock: '🔒',
  mail: '✉',
  user: '👤',
  eye: '👁',
  eyeOff: '🙈',
  mp: '⚡',
  flash: '🔦',
  refresh: '⟳',
  shield: '🛡',
  award: '🏆',
  sparkle: '✨',
  logout: '⎋',
  clock: '⏱',
  direction: '↗',
  trash: '🗑',
};

export default function Icon({
  name,
  size = 20,
  color = colors.slate700,
  style,
  badge = false,
  badgeBg = colors.primarySoft,
}) {
  const glyph = ICON_MAP[name] || '•';

  if (badge) {
    const badgeSize = Math.round(size * 1.8);
    return (
      <View
        style={[
          styles.badgeContainer,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: badgeBg,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.glyph,
            {
              fontSize: size,
              color: color,
              lineHeight: Math.round(size * 1.2),
            },
          ]}
        >
          {glyph}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text
        style={[
          styles.glyph,
          {
            fontSize: size,
            color: color,
            lineHeight: Math.round(size * 1.15),
          },
        ]}
      >
        {glyph}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyph: {
    textAlign: 'center',
    fontWeight: '700',
    includeFontPadding: false,
  },
});
