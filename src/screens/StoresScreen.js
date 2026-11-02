import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useWallet } from '../context/WalletContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SettingsSection from '../components/SettingsSection';
import { formatARS } from '../utils/format';
import { colors } from '../theme/colors';

export const LOCALES_ADHERIDOS = [
  {
    id: 'cafe-martinez',
    nombre: 'Café Martínez Sustentable',
    categoria: 'Gastronomía',
    icono: 'cafe-outline',
    beneficio: '20% OFF en café y pastelería',
    puntos: 450,
    dir: 'Av. Corrientes 1520, San Nicolás',
    dist: 320,
    descripcion: 'Válido llevando tu vaso reutilizable o consumiendo en el local.',
  },
  {
    id: 'carrefour-bio',
    nombre: 'Carrefour Bio & Market',
    categoria: 'Supermercados',
    icono: 'cart-outline',
    beneficio: '$1.500 de ahorro en tu compra',
    puntos: 1200,
    dir: 'Av. Santa Fe 1450, Recoleta',
    dist: 850,
    descripcion: 'Aplicable en productos seleccionados de la línea orgánica y sustentable.',
  },
  {
    id: 'dietetica-tomillo',
    nombre: 'Dietética & Granel Tomillo',
    categoria: 'Almacén Natural',
    icono: 'leaf-outline',
    beneficio: '15% OFF en compras a granel',
    puntos: 600,
    dir: 'Juramento 2140, Belgrano',
    dist: 1400,
    descripcion: 'Llevando tus propios envases o bolsas de tela.',
  },
  {
    id: 'libreria-bosque',
    nombre: 'Librería Verde & Papelería',
    categoria: 'Librería',
    icono: 'book-outline',
    beneficio: 'Cuaderno ecológico de regalo',
    puntos: 800,
    dir: 'Honduras 4820, Palermo',
    dist: 1900,
    descripcion: 'Cuaderno A5 de hojas 100% recicladas y tapa plantable.',
  },
  {
    id: 'patagonia-moda',
    nombre: 'Moda Circular Vintage',
    categoria: 'Indumentaria',
    icono: 'shirt-outline',
    beneficio: '25% OFF en indumentaria reciclada',
    puntos: 1500,
    dir: 'Serrano 1380, Palermo Soho',
    dist: 2200,
    descripcion: 'Prendas recuperadas y supra-recicladas.',
  },
  {
    id: 'heladeria-artesanal',
    nombre: 'Heladería Artesanal Río',
    categoria: 'Gastronomía',
    icono: 'ice-cream-outline',
    beneficio: '1/4 kg gratis en la compra de 1 kg',
    puntos: 700,
    dir: 'Av. Córdoba 3400, Almagro',
    dist: 2700,
    descripcion: 'Presentá tu cupón al momento de hacer el pedido.',
  },
];

const CHIPS = [
  { id: 'todos', label: 'Todos' },
  { id: 'Gastronomía', label: 'Gastronomía' },
  { id: 'Supermercados', label: 'Supermercados' },
  { id: 'Almacén Natural', label: 'Almacén Natural' },
  { id: 'Librería', label: 'Librería' },
  { id: 'Indumentaria', label: 'Indumentaria' },
];

const distancia = (m) => (m < 1000 ? `A ${m} m` : `A ${(m / 1000).toFixed(1).replace('.', ',')} km`);

export default function StoresScreen({ navigate }) {
  const { balance, canjearPuntos } = useWallet();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [cuponGenerado, setCuponGenerado] = useState(null);

  const lista = LOCALES_ADHERIDOS
    .filter((l) => (categoria === 'todos' ? true : l.categoria === categoria))
    .filter((l) => `${l.nombre} ${l.beneficio} ${l.dir}`.toLowerCase().includes(busqueda.trim().toLowerCase()))
    .sort((a, b) => a.dist - b.dist);

  const solicitarCanje = (local) => {
    if (balance < local.puntos) {
      Alert.alert(
        'Reci-Points insuficientes',
        `Necesitás ${formatARS(local.puntos)} Reci-Points para este beneficio. Tu saldo actual es de ${formatARS(balance)} pts.`
      );
      return;
    }

    Alert.alert(
      'Confirmar canje',
      `¿Querés canjear ${formatARS(local.puntos)} Reci-Points por "${local.beneficio}" en ${local.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: () => {
            const res = canjearPuntos({
              local: local.nombre,
              puntos: local.puntos,
              beneficio: local.beneficio,
            });
            if (res.ok) {
              setCuponGenerado({
                codigo: res.cupon,
                local: local.nombre,
                beneficio: local.beneficio,
                puntos: local.puntos,
              });
            } else {
              Alert.alert(res.title, res.message);
            }
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <Header title="Locales adheridos" onBack={() => navigate('wallet')} />

      {/* Banner de saldo actual en Reci-Points */}
      <View style={s.balanceBanner}>
        <View style={s.balanceLeft}>
          <Text style={s.balLabel}>TUS RECI-POINTS DISPONIBLES</Text>
          <View style={s.pointsRow}>
            <Text style={s.balPoints}>{formatARS(balance)}</Text>
            <Text style={s.balUnit}>pts</Text>
          </View>
        </View>
        <View style={s.balIcon}>
          <Ionicons name="gift-outline" size={28} color={colors.white} />
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={s.search}>
        <Ionicons name="search" size={20} color={colors.slate} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar local, rubro o beneficio..."
          placeholderTextColor={colors.slate}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={colors.slate} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros por categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipsScroll} contentContainerStyle={s.chips}>
        {CHIPS.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => setCategoria(c.id)}
            style={[s.chip, categoria === c.id && s.chipOn]}
          >
            <Text style={[s.chipTxt, categoria === c.id && { color: colors.white }]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listado de comercios */}
      <Text style={s.section}>Beneficios disponibles</Text>
      {lista.map((local) => {
        const alcanza = balance >= local.puntos;
        return (
          <Card key={local.id} style={s.card}>
            <View style={s.cardTop}>
              <View style={s.localIcon}>
                <Ionicons name={local.icono} size={24} color={colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.nombreRow}>
                  <Text style={s.localNombre} numberOfLines={1}>{local.nombre}</Text>
                </View>
                <View style={s.badgeRow}>
                  <Badge label={local.categoria} variant="mint" />
                  <Text style={s.distancia}>{distancia(local.dist)}</Text>
                </View>
              </View>
            </View>

            {/* Recuadro de beneficio */}
            <View style={s.beneficioBox}>
              <Ionicons name="sparkles" size={18} color={colors.greenDark} />
              <View style={{ flex: 1 }}>
                <Text style={s.beneficioTxt}>{local.beneficio}</Text>
                <Text style={s.beneficioDesc}>{local.descripcion}</Text>
              </View>
            </View>

            <View style={s.cardBottom}>
              <View>
                <Text style={s.costoLabel}>Costo del canje</Text>
                <Text style={s.costoPuntos}>{formatARS(local.puntos)} pts</Text>
              </View>

              <TouchableOpacity
                style={[s.btnCanje, !alcanza && s.btnDisabled]}
                onPress={() => solicitarCanje(local)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={alcanza ? 'ticket-outline' : 'lock-closed-outline'}
                  size={16}
                  color={alcanza ? colors.white : colors.slate}
                />
                <Text style={[s.btnCanjeTxt, !alcanza && { color: colors.slate }]}>
                  {alcanza ? 'Canjear' : `Faltan ${formatARS(local.puntos - balance)}`}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        );
      })}

      {lista.length === 0 && (
        <View style={s.vacioBox}>
          <Ionicons name="storefront-outline" size={48} color={colors.slate} />
          <Text style={s.vacio}>No encontramos locales adheridos para este filtro.</Text>
        </View>
      )}

      <View style={{ height: 16 }} />
      <SettingsSection variant="check" />

      {/* Modal de Cupón Canjeado */}
      <Modal visible={!!cuponGenerado} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <View style={s.checkCircle}>
                <Ionicons name="checkmark" size={32} color={colors.white} />
              </View>
              <Text style={s.modalTitle}>¡Canje confirmado!</Text>
              <Text style={s.modalSub}>Ya tenés tu cupón para canjear en el local</Text>
            </View>

            <View style={s.voucherBox}>
              <Text style={s.voucherLocal}>{cuponGenerado?.local}</Text>
              <Text style={s.voucherBeneficio}>{cuponGenerado?.beneficio}</Text>
              <View style={s.sep} />

              <View style={s.qrBox}>
                <QRCode value={cuponGenerado?.codigo || 'RECICANJE'} size={140} />
              </View>

              <Text style={s.codigoLabel}>CÓDIGO DE CUPÓN</Text>
              <Text style={s.codigoTxt}>{cuponGenerado?.codigo}</Text>
              <Text style={s.validezTxt}>Mostrá este código o el QR en la caja al momento de pagar.</Text>
            </View>

            <Button
              variant="green"
              title="Volver a mi Billetera"
              onPress={() => {
                setCuponGenerado(null);
                navigate('wallet');
              }}
            />
            <Button
              variant="outline"
              title="Seguir viendo locales"
              onPress={() => setCuponGenerado(null)}
              style={{ marginBottom: 0 }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  balanceBanner: {
    backgroundColor: colors.navy,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLeft: { flex: 1 },
  balLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
  pointsRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  balPoints: { fontSize: 32, fontWeight: '800', color: colors.white },
  balUnit: { fontSize: 16, fontWeight: '700', color: colors.green, marginLeft: 6 },
  balIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.ink },
  chipsScroll: { marginBottom: 16 },
  chips: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipTxt: { fontSize: 13, fontWeight: '700', color: colors.slate },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 12 },
  card: { padding: 18, marginBottom: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  localIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  localNombre: { fontSize: 16, fontWeight: '800', color: colors.ink },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  distancia: { fontSize: 13, color: colors.slate, fontWeight: '500' },
  beneficioBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.mint,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  beneficioTxt: { fontSize: 14, fontWeight: '800', color: colors.greenDark },
  beneficioDesc: { fontSize: 12, color: colors.greenDark, marginTop: 2, opacity: 0.9 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  costoLabel: { fontSize: 12, color: colors.slate },
  costoPuntos: { fontSize: 18, fontWeight: '800', color: colors.navy, marginTop: 2 },
  btnCanje: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.green,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  btnDisabled: { backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.border },
  btnCanjeTxt: { fontSize: 14, fontWeight: '800', color: colors.white },
  vacioBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  vacio: { textAlign: 'center', color: colors.slate, marginTop: 10, fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: { alignItems: 'center', marginBottom: 16 },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
  modalSub: { fontSize: 14, color: colors.slate, textAlign: 'center', marginTop: 4 },
  voucherBox: {
    width: '100%',
    backgroundColor: colors.soft,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  voucherLocal: { fontSize: 16, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  voucherBeneficio: { fontSize: 14, fontWeight: '700', color: colors.greenDark, marginTop: 4, textAlign: 'center' },
  sep: { height: 1, width: '100%', backgroundColor: colors.border, marginVertical: 12 },
  qrBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codigoLabel: { fontSize: 11, fontWeight: '800', color: colors.slate, letterSpacing: 1 },
  codigoTxt: { fontSize: 20, fontWeight: '900', color: colors.navy, letterSpacing: 2, marginTop: 2 },
  validezTxt: { fontSize: 12, color: colors.slate, textAlign: 'center', marginTop: 8, lineHeight: 18 },
});

