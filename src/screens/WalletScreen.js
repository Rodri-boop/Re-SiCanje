import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { colors, shadows, radii } from '../theme/colors';

export default function WalletScreen({ navigate }) {
  const { balance, recycledKg, movimientos } = useWallet();
  const { usuarioActivo } = useAuth();
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'reciclaje' | 'retiros'

  const filteredMovimientos = movimientos.filter((m) => {
    if (filtro === 'reciclaje') return m.tipo === 'green';
    if (filtro === 'retiros') return m.tipo === 'blue';
    return true;
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mi Billetera Verde</Text>
          <Text style={styles.subtitle}>Tus puntos acumulados y retiros en dinero</Text>
        </View>
        <View style={styles.iconBadgeTop}>
          <Icon name="wallet" size={20} color={colors.primary} />
        </View>
      </View>

      {/* Tarjeta Digital: Virtual Reci-Card */}
      <View style={styles.virtualCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardBrand}>
            <Icon name="recycle" size={20} color={colors.white} />
            <Text style={styles.cardBrandText}>RE-SICANJE ECO</Text>
          </View>
          <Text style={styles.cardContactless}>))))</Text>
        </View>

        <View style={styles.cardChipRow}>
          <View style={styles.cardChip} />
          <Text style={styles.cardMemberId}>ID #PET-2026-AR</Text>
        </View>

        <View style={styles.cardBalanceSection}>
          <Text style={styles.cardBalanceLabel}>SALDO DISPONIBLE</Text>
          <Text style={styles.cardBalanceAmount}>${balance.toLocaleString()} ARS</Text>
          <Text style={styles.cardBalancePts}>Equivalente a {balance.toLocaleString()} Puntos</Text>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardHolderLabel}>TITULAR</Text>
            <Text style={styles.cardHolderName}>
              {(usuarioActivo?.nombre || 'Ecologista Activo').toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardValidBadge}>
            <Text style={styles.cardValidText}>1 PTS = 1 ARS</Text>
          </View>
        </View>
      </View>

      {/* Botón Principal: Retirar a Mercado Pago */}
      <TouchableOpacity
        style={styles.mpWithdrawBtn}
        activeOpacity={0.88}
        onPress={() => navigate('mp_transfer')}
      >
        <View style={styles.mpBtnLeft}>
          <View style={styles.mpIconCircle}>
            <Icon name="mp" size={18} color={colors.white} />
          </View>
          <View>
            <Text style={styles.mpBtnTitle}>Transferir a Mercado Pago</Text>
            <Text style={styles.mpBtnSub}>Sin comisiones • Acreditación instantánea</Text>
          </View>
        </View>
        <Icon name="chevronRight" size={18} color={colors.mpDark} />
      </TouchableOpacity>

      {/* Resumen de Tasas / Métricas */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Icon name="bottle" size={16} color={colors.primary} />
          <Text style={styles.statVal}>{recycledKg} Kg</Text>
          <Text style={styles.statLabel}>PET Reciclado</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="sparkle" size={16} color={colors.amber} />
          <Text style={styles.statVal}>$50 ARS</Text>
          <Text style={styles.statLabel}>Por Botella</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="shield" size={16} color="#2563EB" />
          <Text style={styles.statVal}>0% Fee</Text>
          <Text style={styles.statLabel}>En Retiros</Text>
        </View>
      </View>

      {/* Historial de Movimientos con Filtros */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Historial de Movimientos</Text>

        {/* Filtros */}
        <View style={styles.filterPills}>
          {[
            ['todos', 'Todos'],
            ['reciclaje', 'Reciclajes (+)'],
            ['retiros', 'Retiros (-)'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterPill, filtro === key && styles.filterPillActive]}
              onPress={() => setFiltro(key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filtro === key && styles.filterPillTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de Movimientos */}
        {filteredMovimientos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay movimientos en esta categoría.</Text>
          </View>
        ) : (
          filteredMovimientos.map((mov) => {
            const isWithdraw = mov.tipo === 'blue';
            return (
              <View key={mov.id} style={styles.movementCard}>
                <View style={styles.movementLeft}>
                  <View
                    style={[
                      styles.movementIconWrap,
                      {
                        backgroundColor: isWithdraw ? colors.mpSoft : colors.primarySoft,
                      },
                    ]}
                  >
                    <Icon
                      name={isWithdraw ? 'mp' : 'bottle'}
                      size={18}
                      color={isWithdraw ? colors.mp : colors.primary}
                    />
                  </View>
                  <View style={styles.movementDetails}>
                    <Text style={styles.movementTitle}>{mov.texto}</Text>
                    <View style={styles.statusRow}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: isWithdraw ? colors.mp : colors.green },
                        ]}
                      />
                      <Text style={styles.statusText}>
                        {isWithdraw ? 'Transferido a cuenta' : 'Acreditado'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={[
                    styles.movementAmount,
                    isWithdraw ? styles.amountBlue : styles.amountGreen,
                  ]}
                >
                  {mov.monto}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 18,
    paddingTop: 14,
    paddingBottom: 95,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.slate500,
    marginTop: 2,
  },
  iconBadgeTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  virtualCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardBrandText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  cardContactless: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '900',
    fontSize: 14,
  },
  cardChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardChip: {
    width: 34,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  cardMemberId: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardBalanceSection: {
    marginVertical: 6,
  },
  cardBalanceLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardBalanceAmount: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  cardBalancePts: {
    color: colors.greenLight,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  cardHolderLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardHolderName: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  cardValidBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  cardValidText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  mpWithdrawBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 16,
    ...shadows.sm,
  },
  mpBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mpIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mpBtnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.mpDark,
  },
  mpBtnSub: {
    fontSize: 11,
    color: '#0369A1',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: colors.slate500,
    marginTop: 2,
  },
  historySection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 10,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate600,
  },
  filterPillTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  movementCard: {
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
  movementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  movementIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  movementDetails: {
    flex: 1,
  },
  movementTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    color: colors.slate500,
  },
  movementAmount: {
    fontSize: 13,
    fontWeight: '900',
  },
  amountGreen: {
    color: colors.primary,
  },
  amountBlue: {
    color: colors.mp,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: colors.slate400,
  },
});
