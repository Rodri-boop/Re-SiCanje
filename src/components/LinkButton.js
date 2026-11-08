import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import Icon from './Icon';

export default function LinkButton({
  title,
  onPress,
  icon,
  color = colors.primary,
  style,
  textStyle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={styles.row}>
        {icon && <Icon name={icon} size={15} color={color} style={styles.icon} />}
        <Text style={[styles.text, { color }, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
