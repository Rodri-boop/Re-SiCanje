import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, shadows, radii } from '../theme/colors';
import Icon from './Icon';

export default function BottomNav({ current, onNavigate }) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.dock}>
        {/* Tab 1: Inicio */}
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => onNavigate('home')}
        >
          <View style={[styles.iconWrap, current === 'home' && styles.iconWrapActive]}>
            <Icon
              name="home"
              size={20}
              color={current === 'home' ? colors.primary : colors.slate400}
            />
          </View>
          <Text style={[styles.label, current === 'home' && styles.labelActive]}>
            Inicio
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Puntos Reci-Drops */}
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => onNavigate('map')}
        >
          <View style={[styles.iconWrap, current === 'map' && styles.iconWrapActive]}>
            <Icon
              name="map"
              size={20}
              color={current === 'map' ? colors.primary : colors.slate400}
            />
          </View>
          <Text style={[styles.label, current === 'map' && styles.labelActive]}>
            Puntos
          </Text>
        </TouchableOpacity>

        {/* Botón Central Flotante (FAB): Escanear */}
        <View style={styles.fabAnchor}>
          <TouchableOpacity
            style={[styles.fabBtn, current === 'scan' && styles.fabBtnActive]}
            activeOpacity={0.85}
            onPress={() => onNavigate('scan')}
          >
            <Icon name="scan" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={[styles.fabLabel, current === 'scan' && styles.labelActive]}>
            Escanear
          </Text>
        </View>

        {/* Tab 3: Billetera */}
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => onNavigate('wallet')}
        >
          <View style={[styles.iconWrap, current === 'wallet' && styles.iconWrapActive]}>
            <Icon
              name="wallet"
              size={20}
              color={current === 'wallet' ? colors.primary : colors.slate400}
            />
          </View>
          <Text style={[styles.label, current === 'wallet' && styles.labelActive]}>
            Billetera
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Mercado Pago */}
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => onNavigate('mp_transfer')}
        >
          <View style={[styles.iconWrap, current === 'mp_transfer' && styles.iconWrapActiveMp]}>
            <Icon
              name="mp"
              size={20}
              color={current === 'mp_transfer' ? colors.mp : colors.slate400}
            />
          </View>
          <Text style={[styles.label, current === 'mp_transfer' && styles.labelActiveMp]}>
            Retirar MP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 18 : 10,
    paddingHorizontal: 12,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    ...shadows.hover,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    padding: 4,
    borderRadius: radii.sm,
  },
  iconWrapActive: {
    backgroundColor: colors.primarySoft,
  },
  iconWrapActiveMp: {
    backgroundColor: colors.mpSoft,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.slate400,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  labelActiveMp: {
    color: colors.mp,
    fontWeight: '800',
  },
  fabAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    marginHorizontal: 4,
  },
  fabBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: colors.white,
    ...shadows.fab,
    elevation: 8,
  },
  fabBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primarySoft,
  },
  fabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate600,
    marginTop: 3,
  },
});
