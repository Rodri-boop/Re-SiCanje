import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, shadows, radii } from '../theme/colors';
import Icon from './Icon';

export default function Card({
  label,
  value,
  sub,
  tag,
  icon,
  backgroundColor = colors.surface,
  valueColor,
  textColor,
  onPress,
  style,
  children,
}) {
  const isDarkBg =
    backgroundColor === colors.primary ||
    backgroundColor === colors.primaryDark ||
    backgroundColor === colors.green ||
    backgroundColor === colors.dark ||
    backgroundColor === colors.mp;

  const resolvedValueColor = valueColor || (isDarkBg ? colors.white : colors.slate800);
  const resolvedLabelColor = isDarkBg ? 'rgba(255, 255, 255, 0.85)' : colors.slate500;
  const resolvedSubColor = textColor || (isDarkBg ? 'rgba(255, 255, 255, 0.92)' : colors.slate600);

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor },
        !isDarkBg && styles.cardBorder,
        shadows.card,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.labelContainer}>
          {label && <Text style={[styles.label, { color: resolvedLabelColor }]}>{label}</Text>}
          {tag && (
            <View style={[styles.tagBadge, isDarkBg && styles.tagBadgeDark]}>
              <Text style={[styles.tagText, isDarkBg && styles.tagTextDark]}>{tag}</Text>
            </View>
          )}
        </View>

        {icon && (
          <Icon
            name={icon}
            size={18}
            color={isDarkBg ? colors.white : colors.primary}
            badge
            badgeBg={isDarkBg ? 'rgba(255, 255, 255, 0.18)' : colors.primarySoft}
          />
        )}
      </View>

      {value !== undefined && (
        <Text style={[styles.value, { color: resolvedValueColor }]}>{value}</Text>
      )}

      {sub && <Text style={[styles.sub, { color: resolvedSubColor }]}>{sub}</Text>}

      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: radii.lg,
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tagBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  tagBadgeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  tagTextDark: {
    color: colors.white,
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  sub: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
