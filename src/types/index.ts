export type EventCategory = 
  | 'Familiar'
  | 'Cultural'
  | 'Deportivo'
  | 'Gastronómico'
  | 'Juventud y Arte'
  | 'Ferias y Mercados'
  | 'Ecológico';

export type MunicipioSur = 'Villa Nueva' | 'San Miguel Petapa' | 'Villa Canales';

export type SurZona =
  // Villa Nueva
  | 'Zona 1 - Centro Histórico'
  | 'Zona 2 - Linda Vista'
  | 'Zona 3 - Ciudad del Sol'
  | 'Zona 4 - Santa Clara'
  | 'Zona 5 - El Frutal'
  | 'Zona 6 - Mártires del Pueblo'
  | 'Zona 10 - Ciudad Real'
  | 'Zona 12 - San José Villa Nueva'
  | 'Bárcena & Naciones Unidas'
  // San Miguel Petapa
  | 'Petapa - Centro & Plaza Mayor'
  | 'Petapa - Villa Hermosa I y II'
  | 'Petapa - Los Álamos & El Frutal'
  | 'Petapa - Prados de Villa Hermosa'
  | 'Petapa - Santa Inés Petapa'
  | 'Petapa - Ribera del Lago'
  // Villa Canales
  | 'Villa Canales - Centro & Plaza'
  | 'Villa Canales - Boca del Monte'
  | 'Villa Canales - Santa Elena Barillas'
  | 'Villa Canales - El Jocotillo'
  | 'Villa Canales - Colmenas & Chichimecas';

// Backward compatibility alias
export type VillaNuevaZona = SurZona | string;

export interface EventItem {
  id: string;
  slug?: string;
  title: string;
  category: EventCategory;
  municipio: MunicipioSur;
  date: string; // YYYY-MM-DD
  time: string;
  locationName: string;
  zona: VillaNuevaZona;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  shortSummary: string;
  organizer: {
    name: string;
    role: string;
    verified: boolean;
    type: 'Radar Sur (Exclusivo)' | 'Radar Villa Nueva (Exclusivo)' | 'Alcaldía Villa Nueva' | 'Alcaldía San Miguel Petapa' | 'Alcaldía Villa Canales' | 'Colectivo Vecinal' | 'Comité Comunitario' | 'Club Deportivo';
  };
  sourceType?: 'radar' | 'municipal'; // Private Radar event vs Municipal alliance event
  targetAudience: string;
  cost: string; // "Gratis", "Q10", etc.
  capacity: number;
  rsvpCount: number;
  isFeatured: boolean;
  status: 'Aprobado' | 'En Revisión' | 'Destacado';
  tags: string[];
  amenities: string[];
  gradientTheme: string;
  accentColor: string;
  iconName: string;
  imageUrl?: string;
  galleryImages?: string[];
  mapsUrl?: string;
  wazeUrl?: string;
  howToGetThere?: string;
}

export type EntrepreneurCategory =
  | 'Gastronomía & Food Trucks'
  | 'Café, Repostería & Postres'
  | 'Artesanías & Hecho a Mano'
  | 'Moda, Ropa & Calzado'
  | 'Servicios Locales & Profesionales'
  | 'Salud, Belleza & Bienestar'
  | 'Tecnología & Accesorios'
  | 'Patrocinador Oficial de Evento';

export type AdSpaceType =
  | 'Stand Comercial en Feria / Bazar'
  | 'Espacio Food Truck / Remolque'
  | 'Patrocinio Oficial de Evento (Lonas & Escenario)'
  | 'Degustación & Muestreo de Producto'
  | 'Anuncio Digital en Radar Sur'
  | 'Anuncio Digital en Radar Villa Nueva';

export interface EntrepreneurAd {
  id: string;
  businessName: string;
  ownerName: string;
  category: EntrepreneurCategory;
  municipio?: MunicipioSur;
  phone: string;
  email: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  spaceType: AdSpaceType;
  targetEventId?: string;
  targetEventTitle?: string;
  zona: VillaNuevaZona;
  productDescription: string;
  imageUrl: string;
  galleryImages?: string[];
  specialOffer?: string;
  status: 'aprobado' | 'en_revision' | 'destacado' | 'contactado';
  budget?: string;
  verifiedBadge?: boolean;
  couponCode?: string;
  discountPercentage?: number;
  couponsLeft?: number;
  totalCouponsIssued?: number;
  couponsRedeemed?: number;
  password?: string;
  createdAt?: string;
}

export interface UniqueCouponVoucher {
  id: string;
  code: string; // Código único aleatorio ej: VN-CHUC-8K2P
  businessId: string;
  businessName: string;
  municipio?: MunicipioSur;
  discountPercentage: number;
  specialOffer: string;
  issuedAt: string;
  expiresAt: string;
  status: 'activo' | 'canjeado' | 'expirado';
  redeemedAt?: string;
  userIdentifier?: string;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  isAiAgent?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'Vecino' | 'Líder Comunitario' | 'Moderador IA' | 'Admin Municipal';
  zona: VillaNuevaZona;
  timestamp: string;
  content: string;
  eventId?: string;
  eventTitle?: string;
  upvotes: number;
  upvotedBy: string[];
  replies: ForumReply[];
  tags: string[];
  aiModeration: {
    status: 'safe' | 'flagged' | 'quarantined';
    familyScore: number; // 0 to 100
    analysisNotes: string;
    checkedByAgent: string;
    checkedAt: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'vecino' | 'organizador' | 'admin';
  municipio?: MunicipioSur;
  zona: VillaNuevaZona;
  avatar: string;
  savedEvents: string[];
  rsvps: {
    eventId: string;
    ticketCode: string;
    numPeople: number;
    qrSimulated: string;
    registeredAt: string;
  }[];
  notificationsEnabled: boolean;
  notificationRadiusKm: number;
}

export interface AiSubagent {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  status: 'active' | 'analyzing' | 'idle';
  lastAction: string;
  processedCount: number;
  model: string;
  description: string;
  specialty: string;
  badges: string[];
}

export interface PlatformMetrics {
  totalEventsActive: number;
  totalRsvps: number;
  activeNeighbors: number;
  familyFriendlinessIndex: number;
  topZonas: { zona: string; count: number; percentage: number }[];
  categoryBreakdown: { category: string; count: number; color: string }[];
  weeklyAttendanceForecast: { day: string; predictedAttendance: number }[];
  moderationStats: {
    reviewedPosts: number;
    autoApproved: number;
    flagged: number;
    responseTimeMs: number;
  };
}
