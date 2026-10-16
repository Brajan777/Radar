import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EntrepreneurAd } from '../types';

export interface SupabaseConfigState {
  url: string;
  key: string;
  isConfigured: boolean;
  source: 'env' | 'storage' | 'none';
}

/**
 * Obtiene la configuración actual de Supabase (desde variables VITE_ o almacenamiento local de respaldo)
 */
export const getSupabaseConfig = (): SupabaseConfigState => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = '';
  let localKey = '';
  if (typeof window !== 'undefined') {
    try {
      localUrl = (localStorage.getItem('radar_supabase_url') || '').trim();
      localKey = (localStorage.getItem('radar_supabase_anon_key') || '').trim();
    } catch {
      // Ignorar restricciones de almacenamiento
    }
  }

  // Priorizar VITE_ si existe y no es placeholder, sino usar local
  const isEnvValid = Boolean(envUrl && envKey && envUrl.startsWith('http') && !envUrl.includes('YOUR_'));
  if (isEnvValid) {
    return { url: envUrl, key: envKey, isConfigured: true, source: 'env' };
  }

  const isLocalValid = Boolean(localUrl && localKey && localUrl.startsWith('http'));
  if (isLocalValid) {
    return { url: localUrl, key: localKey, isConfigured: true, source: 'storage' };
  }

  return { url: envUrl, key: envKey, isConfigured: false, source: 'none' };
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

/**
 * Retorna el cliente Supabase singleton
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && lastUsedUrl === url && lastUsedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false }
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Error inicializando cliente de Supabase:', err);
    return null;
  }
};

/**
 * Permite al administrador guardar o actualizar las credenciales de Supabase en vivo
 */
export const saveSupabaseCredentials = (url: string, anonKey: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem('radar_supabase_url', url.trim());
    localStorage.setItem('radar_supabase_anon_key', anonKey.trim());
    cachedClient = null;
    return true;
  } catch (err) {
    console.error('Error guardando credenciales locales:', err);
    return false;
  }
};

/**
 * Limpia las credenciales almacenadas localmente
 */
export const clearSupabaseCredentials = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('radar_supabase_url');
    localStorage.removeItem('radar_supabase_anon_key');
    cachedClient = null;
  } catch {
    // Ignorar
  }
};

/**
 * Convierte un objeto de la aplicación a fila para Supabase
 */
const adToDbRow = (ad: EntrepreneurAd) => ({
  id: ad.id,
  business_name: ad.businessName,
  owner_name: ad.ownerName,
  category: ad.category,
  municipio: ad.municipio || 'Villa Nueva',
  phone: ad.phone,
  email: ad.email,
  instagram_url: ad.instagramUrl || null,
  space_type: ad.spaceType,
  target_event_id: ad.targetEventId || null,
  target_event_title: ad.targetEventTitle || null,
  zona: ad.zona,
  product_description: ad.productDescription,
  image_url: ad.imageUrl,
  special_offer: ad.specialOffer || null,
  coupon_code: ad.couponCode || null,
  discount_percentage: ad.discountPercentage || 15,
  coupons_left: ad.couponsLeft || 15,
  total_coupons_issued: ad.totalCouponsIssued || 25,
  coupons_redeemed: ad.couponsRedeemed || 0,
  password: ad.password || null,
  status: ad.status || 'en_revision',
  created_at: ad.createdAt || new Date().toISOString(),
  budget: ad.budget || null,
  verified_badge: Boolean(ad.verifiedBadge)
});

/**
 * Convierte una fila de base de datos (snake_case o camelCase) a EntrepreneurAd
 */
const dbRowToAd = (row: any): EntrepreneurAd => ({
  id: String(row.id || `ad-${Date.now()}`),
  businessName: row.business_name || row.businessName || 'Emprendimiento',
  ownerName: row.owner_name || row.ownerName || 'Emprendedor',
  category: row.category || 'Gastronomía & Food Trucks',
  municipio: row.municipio || 'Villa Nueva',
  phone: row.phone || '',
  email: row.email || '',
  instagramUrl: row.instagram_url || row.instagramUrl || undefined,
  spaceType: row.space_type || row.spaceType || 'Stand Comercial en Feria / Bazar',
  targetEventId: row.target_event_id || row.targetEventId || undefined,
  targetEventTitle: row.target_event_title || row.targetEventTitle || undefined,
  zona: row.zona || 'Zona 1 - Centro Histórico',
  productDescription: row.product_description || row.productDescription || '',
  imageUrl: row.image_url || row.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  specialOffer: row.special_offer || row.specialOffer || undefined,
  couponCode: row.coupon_code || row.couponCode || undefined,
  discountPercentage: row.discount_percentage ?? row.discountPercentage ?? 15,
  couponsLeft: row.coupons_left ?? row.couponsLeft ?? 15,
  totalCouponsIssued: row.total_coupons_issued ?? row.totalCouponsIssued ?? 25,
  couponsRedeemed: row.coupons_redeemed ?? row.couponsRedeemed ?? 0,
  password: row.password || undefined,
  status: row.status || 'en_revision',
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  budget: row.budget || undefined,
  verifiedBadge: Boolean(row.verified_badge ?? row.verifiedBadge ?? false)
});

/**
 * Guarda una nueva solicitud de emprendedor en Supabase
 */
export const saveEntrepreneurToSupabase = async (
  ad: EntrepreneurAd
): Promise<{ success: boolean; error?: string; isStoredInSupabase: boolean }> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Si no está configurado, no rompemos el flujo
    return {
      success: true,
      isStoredInSupabase: false,
      error: 'Supabase no está configurado. La solicitud se almacenó en memoria local.'
    };
  }

  try {
    const row = adToDbRow(ad);
    const { error } = await supabase
      .from('entrepreneurs')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Error insertando en tabla entrepreneurs de Supabase:', error);
      return {
        success: false,
        error: error.message,
        isStoredInSupabase: false
      };
    }

    return {
      success: true,
      isStoredInSupabase: true
    };
  } catch (err: any) {
    console.error('Excepción al conectar con Supabase:', err);
    return {
      success: false,
      error: err?.message || 'Error desconocido al conectar con Supabase',
      isStoredInSupabase: false
    };
  }
};

/**
 * Consulta todos los emprendedores registrados desde Supabase
 */
export const fetchEntrepreneursFromSupabase = async (): Promise<{
  success: boolean;
  ads: EntrepreneurAd[];
  error?: string;
}> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, ads: [], error: 'Supabase no configurado' };
  }

  try {
    const { data, error } = await supabase
      .from('entrepreneurs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error consultando entrepreneurs en Supabase:', error);
      return { success: false, ads: [], error: error.message };
    }

    const ads = (data || []).map(dbRowToAd);
    return { success: true, ads };
  } catch (err: any) {
    console.error('Excepción al obtener emprendedores de Supabase:', err);
    return { success: false, ads: [], error: err?.message || 'Error al conectar' };
  }
};

/**
 * Actualiza el estado (aprobado, en_revision, destacado) de un emprendedor en Supabase
 */
export const updateEntrepreneurStatusInSupabase = async (
  id: string,
  status: 'aprobado' | 'en_revision' | 'destacado' | 'contactado',
  verifiedBadge?: boolean
): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const updates: any = { status };
    if (verifiedBadge !== undefined) {
      updates.verified_badge = verifiedBadge;
    }

    const { error } = await supabase
      .from('entrepreneurs')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error actualizando estado en Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Excepción al actualizar estado en Supabase:', err);
    return false;
  }
};

/**
 * Elimina una solicitud de emprendedor en Supabase
 */
export const deleteEntrepreneurFromSupabase = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('entrepreneurs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando emprendedor en Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Excepción eliminando emprendedor en Supabase:', err);
    return false;
  }
};

/**
 * Comprueba la conectividad con Supabase y la existencia de la tabla
 */
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      connected: false,
      tableExists: false,
      message: 'Faltan credenciales (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).'
    };
  }

  try {
    const { data, error } = await supabase
      .from('entrepreneurs')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "entrepreneurs" does not exist')) {
        return {
          connected: true,
          tableExists: false,
          message: 'Conectado a Supabase, pero la tabla "entrepreneurs" aún no ha sido creada. Ejecuta el script SQL en Supabase.'
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: `Error de conexión: ${error.message}`
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: `¡Conexión exitosa con Supabase! Tabla 'entrepreneurs' lista.`
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: `Error: ${err?.message || 'No se pudo conectar a Supabase'}`
    };
  }
};
