import { EntrepreneurAd, UniqueCouponVoucher } from '../types';

const VAULT_STORAGE_KEY = 'radar_sur_vouchers_vault_v1';
const USER_ACTIVE_VOUCHERS_KEY = 'radar_user_active_vouchers_v1';

// Caracteres limpios y fáciles de leer (sin O, 0, I, 1 para evitar confusiones de clientes)
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function getRandomString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return result;
}

// Cargar bóveda desde localStorage
export function loadVouchersVault(): UniqueCouponVoucher[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      // Semilla inicial con algunos cupones de demostración para visualización
      const seed: UniqueCouponVoucher[] = [
        {
          id: 'vch-seed-01',
          code: 'VN-CHUC-7K2M',
          businessId: 'ad-vn-01',
          businessName: 'El Chuchito Gourmet & Ahumados Villa Nueva',
          municipio: 'Villa Nueva',
          discountPercentage: 15,
          specialOffer: '15% de descuento en órdenes familiares de más de 6 chuchitos',
          issuedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          status: 'canjeado',
          redeemedAt: new Date(Date.now() - 1000 * 60 * 10).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' }),
        },
        {
          id: 'vch-seed-02',
          code: 'SMP-MANG-9B4X',
          businessId: 'ad-smp-01',
          businessName: 'Helados Artesanales & Mangonadas Petapa',
          municipio: 'San Miguel Petapa',
          discountPercentage: 20,
          specialOffer: '20% OFF en mangonadas gigantes con tajín y chamoy',
          issuedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          status: 'canjeado',
          redeemedAt: new Date(Date.now() - 1000 * 60 * 3).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' }),
        }
      ];
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando bóveda de cupones:', e);
    return [];
  }
}

// Guardar bóveda
export function saveVouchersVault(vault: UniqueCouponVoucher[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
    // Disparar evento para que todos los componentes se sincronicen en vivo
    window.dispatchEvent(new Event('radar_vouchers_updated'));
  } catch (e) {
    console.error('Error guardando bóveda de cupones:', e);
  }
}

// Genera un código único aleatorio irrepetible
export function generateUniqueRandomCode(business: EntrepreneurAd, existingVault: UniqueCouponVoucher[]): string {
  let muniPrefix = 'SUR';
  if (business.municipio === 'Villa Nueva') muniPrefix = 'VN';
  else if (business.municipio === 'San Miguel Petapa') muniPrefix = 'SMP';
  else if (business.municipio === 'Villa Canales') muniPrefix = 'VC';

  // Obtener 3 a 4 letras clave del nombre del negocio
  const cleanName = business.businessName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase();
  const nameSlug = (cleanName.length >= 4 ? cleanName.substring(0, 4) : (cleanName || 'RADR')).padEnd(4, 'X');

  let uniqueCode = '';
  let attempts = 0;
  
  // Garantizar que no exista colisión en la bóveda
  do {
    const randomSuffix = getRandomString(4);
    uniqueCode = `${muniPrefix}-${nameSlug}-${randomSuffix}`;
    attempts++;
  } while (existingVault.some(v => v.code === uniqueCode) && attempts < 100);

  return uniqueCode;
}

// Emite un voucher único para un cliente
export function issueUniqueVoucher(business: EntrepreneurAd): UniqueCouponVoucher {
  const vault = loadVouchersVault();
  
  // Revisar si el usuario actual ya tiene un cupón ACTIVO en este navegador para este negocio
  const activeUserVouchersRaw = localStorage.getItem(USER_ACTIVE_VOUCHERS_KEY);
  let activeUserVouchers: Record<string, string> = {}; // businessId -> voucherId
  if (activeUserVouchersRaw) {
    try {
      activeUserVouchers = JSON.parse(activeUserVouchersRaw);
    } catch {}
  }

  const existingVoucherId = activeUserVouchers[business.id];
  if (existingVoucherId) {
    const found = vault.find(v => v.id === existingVoucherId);
    if (found) {
      const isExpired = new Date(found.expiresAt).getTime() < Date.now();
      // Si aún está activo y no ha sido canjeado ni expirado, se devuelve el mismo
      if (found.status === 'activo' && !isExpired) {
        return found;
      }
    }
  }

  // Generar nuevo código aleatorio único
  const newCode = generateUniqueRandomCode(business, vault);
  const now = new Date();
  const expires = new Date(now.getTime() + 1000 * 60 * 25); // 25 minutos de validez temporal

  const newVoucher: UniqueCouponVoucher = {
    id: `vch_${Date.now()}_${getRandomString(4).toLowerCase()}`,
    code: newCode,
    businessId: business.id,
    businessName: business.businessName,
    municipio: business.municipio,
    discountPercentage: business.discountPercentage || 15,
    specialOffer: business.specialOffer || `${business.discountPercentage || 15}% de descuento`,
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: 'activo'
  };

  vault.unshift(newVoucher);
  saveVouchersVault(vault);

  // Guardar en cupones activos del usuario
  activeUserVouchers[business.id] = newVoucher.id;
  try {
    localStorage.setItem(USER_ACTIVE_VOUCHERS_KEY, JSON.stringify(activeUserVouchers));
  } catch {}

  return newVoucher;
}

// Obtener el voucher activo del cliente para un negocio
export function getUserActiveVoucher(businessId: string): UniqueCouponVoucher | null {
  const vault = loadVouchersVault();
  const activeUserVouchersRaw = localStorage.getItem(USER_ACTIVE_VOUCHERS_KEY);
  if (!activeUserVouchersRaw) return null;
  try {
    const activeUserVouchers = JSON.parse(activeUserVouchersRaw);
    const voucherId = activeUserVouchers[businessId];
    if (!voucherId) return null;
    return vault.find(v => v.id === voucherId) || null;
  } catch {
    return null;
  }
}

// Obtener todos los vouchers de un negocio específico
export function getVouchersForBusiness(businessId: string): UniqueCouponVoucher[] {
  const vault = loadVouchersVault();
  return vault.filter(v => v.businessId === businessId);
}

// Canjear y quemar un voucher para evitar su reutilización
export interface RedeemResult {
  success: boolean;
  message: string;
  voucher?: UniqueCouponVoucher;
  alreadyRedeemedAt?: string;
}

export function redeemVoucher(inputCode: string, businessId?: string): RedeemResult {
  if (!inputCode || !inputCode.trim()) {
    return {
      success: false,
      message: 'Ingresa un código de cupón para validar.'
    };
  }

  const cleanCode = inputCode.trim().toUpperCase();
  const vault = loadVouchersVault();

  // Buscar el cupón por código exacto
  const voucherIndex = vault.findIndex(v => v.code.toUpperCase() === cleanCode);

  if (voucherIndex === -1) {
    // Si no está en la bóveda, verificar si es el código estático genérico antiguo
    return {
      success: false,
      message: `El código "${cleanCode}" no fue encontrado en los registros de Radar Sur.`
    };
  }

  const voucher = vault[voucherIndex];

  // Si se pasa businessId, validar que pertenezca a este negocio
  if (businessId && voucher.businessId !== businessId) {
    return {
      success: false,
      message: `Este cupón no pertenece a tu negocio. Corresponde a "${voucher.businessName}".`
    };
  }

  // 1. REGLA CLAVE: Verificar si ya fue canjeado para evitar reutilizaciones
  if (voucher.status === 'canjeado') {
    return {
      success: false,
      alreadyRedeemedAt: voucher.redeemedAt || 'fecha anterior',
      message: `⚠️ ¡ALERTA DE REUTILIZACIÓN! Este código ya fue canjeado el ${voucher.redeemedAt || 'en una transacción previa'}. Un código no puede utilizarse más de una vez.`
    };
  }

  // 2. Verificar expiración
  const isExpired = new Date(voucher.expiresAt).getTime() < Date.now();
  if (isExpired) {
    voucher.status = 'expirado';
    vault[voucherIndex] = voucher;
    saveVouchersVault(vault);
    return {
      success: false,
      message: `El código expiró a las ${new Date(voucher.expiresAt).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}. El cliente debe generar un nuevo cupón.`
    };
  }

  // 3. CANJE EXITOSO: QUEMAR EL CÓDIGO
  const nowString = new Date().toLocaleString('es-GT', { 
    dateStyle: 'short', 
    timeStyle: 'short' 
  });

  voucher.status = 'canjeado';
  voucher.redeemedAt = nowString;
  vault[voucherIndex] = voucher;
  saveVouchersVault(vault);

  return {
    success: true,
    message: `✅ ¡CÓDIGO VÁLIDO Y CANJEADO! Descuento del ${voucher.discountPercentage}% aplicado con éxito. El código ${voucher.code} ha quedado QUEMADO y no podrá volver a usarse.`,
    voucher
  };
}
