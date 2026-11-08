import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { colors, shadows, radii } from '../theme/colors';

export default function HomeScreen({ navigate }) {
  const { usuarioActivo, logout } = useAuth();
  const { balance, recycledKg, movimientos } = useWallet();

  const userInitial = (usuarioActivo?.nombre || 'E')[0].toUpperCase();
  const co2Evitado = (recycledKg * 2.0).toFixed(1);
  const aguaAhorrada = (recycledKg * 5.0).toFixed(0);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* 1. Header con Perfil Ecológico y Saludo */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.greeting}>
                Hola, {usuarioActivo?.nombre || 'Ecologista'}
              </Text>
              <Text style={styles.wave}>👋</Text>
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.ecoBadge}>
                <Icon name="leaf" size={11} color={colors.primaryDark} />
                <Text style={styles.ecoBadgeText}>Nivel 2 • Eco-Guardián</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={logout}
          style={styles.logoutBtn}
          activeOpacity={0.7}
        >
          <Icon name="logout" size={14} color={colors.danger} />
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Tarjeta FinTech: Balance de Reci-Créditos */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTopRow}>
          <View>
            <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
            <Text style={styles.balancePoints}>
              {balance.toLocaleString()}{' '}
              <Text style={styles.pointsUnit}>PTS</Text>
            </Text>
          </View>
          <View style={styles.balanceIconWrap}>
            <Icon name="recycle" size={24} color={colors.white} />
          </View>
        </View>

        <View style={styles.arsEquivRow}>
          <Text style={styles.arsEquivText}>
            ≈ ${balance.toLocaleString()} ARS canjeables
          </Text>
          <View style={styles.instantBadge}>
            <Text style={styles.instantText}>Acreditación inmediata</Text>
          </View>
        </View>

        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={styles.cardActionBtnMp}
            activeOpacity={0.85}
            onPress={() => navigate('mp_transfer')}
          >
            <Icon name="mp" size={16} color={colors.mp} />
            <Text style={styles.cardActionBtnMpText}>Retirar con Mercado Pago</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Panel de Impacto Ambiental (Métricas en 3 Columnas) */}
      <View style={styles.impactContainer}>
        <Text style={styles.sectionHeader}>TU IMPACTO POSITIVO</Text>
        <View style={styles.impactGrid}>
          {/* Métrica 1: Plástico PET */}
          <View style={styles.impactCol}>
            <View style={[styles.impactIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Icon name="bottle" size={18} color={colors.primary} />
            </View>
            <Text style={styles.impactNumber}>{recycledKg} Kg</Text>
            <Text style={styles.impactSub}>Plástico PET</Text>
          </View>

          {/* Métrica 2: CO2 Evitado */}
          <View style={styles.impactCol}>
            <View style={[styles.impactIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Icon name="co2" size={18} color="#2563EB" />
            </View>
            <Text style={styles.impactNumber}>{co2Evitado} Kg</Text>
            <Text style={styles.impactSub}>CO₂ Evitado</Text>
          </View>

          {/* Métrica 3: Agua Ahorrada */}
          <View style={styles.impactCol}>
            <View style={[styles.impactIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Icon name="water" size={18} color="#0D9488" />
            </View>
            <Text style={styles.impactNumber}>{aguaAhorrada} L</Text>
            <Text style={styles.impactSub}>Agua Ahorrada</Text>
          </View>
        </View>
      </View>

      {/* 4. Acciones Rápidas (Quick Actions) */}
      <Text style={styles.sectionHeader}>ACCIONES RÁPIDAS</Text>
      
      {/* Escáner de botellas */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.85}
        onPress={() => navigate('scan')}
      >
        <View style={[styles.actionIconBadge, { backgroundColor: colors.primarySoft }]}>
          <Icon name="camera" size={20} color={colors.primary} />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Escanear Envase PET</Text>
          <Text style={styles.actionSub}>Sumá +50 PTS por cada botella registrada</Text>
        </View>
        <Icon name="chevronRight" size={18} color={colors.slate400} />
      </TouchableOpacity>

      {/* Puntos de entrega Reci-Drops */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.85}
        onPress={() => navigate('map')}
      >
        <View style={[styles.actionIconBadge, { backgroundColor: '#EFF6FF' }]}>
          <Icon name="map" size={20} color="#2563EB" />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Puntos Reci-Drops</Text>
          <Text style={styles.actionSub}>Centros verdes cercanos (a 250m) abiertos</Text>
        </View>
        <Icon name="chevronRight" size={18} color={colors.slate400} />
      </TouchableOpacity>

      {/* 5. Consejo Verde */}
      <View style={styles.tipCard}>
        <Icon name="sparkle" size={18} color={colors.amber} style={styles.tipIcon} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Tip para sumar más puntos:</Text>
          <Text style={styles.tipText}>
            Entregá las botellas limpias, secas y aplastadas. ¡Ayudás a optimizar el espacio y acelerás el canje!
          </Text>
        </View>
      </View>

      {/* 6. Últimos Movimientos (Preview) */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionHeader}>ÚLTIMOS RECICLAJES</Text>
          <TouchableOpacity onPress={() => navigate('wallet')}>
            <Text style={styles.seeAllText}>Ver todos ›</Text>
          </TouchableOpacity>
        </View>

        {movimientos.slice(0, 2).map((mov) => (
          <View key={mov.id} style={styles.recentItem}>
            <View style={styles.recentLeft}>
              <View
                style={[
                  styles.recentDot,
                  { backgroundColor: mov.tipo === 'blue' ? colors.mp : colors.green },
                ]}
              />
              <Text style={styles.recentText}>{mov.texto}</Text>
            </View>
            <Text
              style={[
                styles.recentAmount,
                mov.tipo === 'blue' ? styles.recentBlue : styles.recentGreen,
              ]}
            >
              {mov.monto}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 18,
    paddingTop: 12,
    paddingBottom: 95,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.3,
  },
  wave: {
    fontSize: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  ecoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dangerBg,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
  },
  logoutText: {
    fontSize: 11,
    color: colors.danger,
    fontWeight: '700',
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: 20,
    marginBottom: 20,
    ...shadows.card,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
  },
  balancePoints: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.8,
    marginTop: 2,
  },
  pointsUnit: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.greenLight,
  },
  balanceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arsEquivRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  arsEquivText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  instantBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  instantText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  cardActionsRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  cardActionBtnMp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: 11,
    borderRadius: radii.md,
    ...shadows.sm,
  },
  cardActionBtnMpText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.mpDark,
  },
  impactContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  impactCol: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  impactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  impactNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.2,
  },
  impactSub: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.slate500,
    marginTop: 2,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  actionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  actionSub: {
    fontSize: 11,
    color: colors.slate500,
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEFCE8',
    borderRadius: radii.md,
    padding: 14,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 1,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 11,
    color: '#A16207',
    lineHeight: 16,
  },
  recentSection: {
    marginTop: 4,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  recentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  recentText: {
    fontSize: 12,
    color: colors.slate700,
    fontWeight: '500',
  },
  recentAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  recentGreen: {
    color: colors.primary,
  },
  recentBlue: {
    color: colors.mp,
  },
});
