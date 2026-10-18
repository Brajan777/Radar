import React, { useState } from 'react';
import { 
  Settings, 
  Calendar, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  X, 
  Star, 
  Sparkles, 
  Save,
  Filter,
  Compass,
  Store,
  Phone,
  MessageCircle,
  ExternalLink,
  MapPin,
  Tag,
  Radio,
  Award,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Database,
  RefreshCw,
  Copy,
  Key,
  Layers,
  Grid,
  List
} from 'lucide-react';
import { EventItem, UserProfile, EventCategory, SurZona, MunicipioSur, EntrepreneurAd, AdSpaceType } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';
import { ZONAS_BY_MUNICIPIO } from './HeroSection';
import { 
  getSupabaseConfig, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection 
} from '../lib/supabase';

export const PRESET_EVENT_PHOTOS = [
  { label: 'Feria Familiar', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gastronomía & Food', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Deporte & Carreras', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Música en Vivo', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
  { label: 'Arte & Cultura', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bazar Comercial', url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80' },
];

interface AdminPanelProps {
  events: EventItem[];
  currentUser: UserProfile;
  entrepreneurAds?: EntrepreneurAd[];
  onUpdateEvent: (updatedEvent: EventItem) => void;
  onDeleteEvent: (eventId: string) => void;
  onCreateEvent: (newEvent: EventItem) => void;
  onUpdateAd?: (updatedAd: EntrepreneurAd) => void;
  onDeleteAd?: (adId: string) => void;
  onSyncSupabase?: () => Promise<void>;
  onOpenBusinessPortal?: (businessId: string) => void;
}

const CATEGORIES: EventCategory[] = [
  'Familiar',
  'Cultural',
  'Deportivo',
  'Gastronómico',
  'Juventud y Arte',
  'Ferias y Mercados',
  'Ecológico',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  events,
  currentUser,
  entrepreneurAds = [],
  onUpdateEvent,
  onDeleteEvent,
  onCreateEvent,
  onUpdateAd,
  onDeleteAd,
  onSyncSupabase,
  onOpenBusinessPortal,
}) => {
  const [adminTab, setAdminTab] = useState<'events' | 'ads' | 'subagents' | 'users'>('events');
  const [eventViewMode, setEventViewMode] = useState<'cards' | 'table'>('cards');
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [adFilterStatus, setAdFilterStatus] = useState<string>('all');
  const [adFilterMuni, setAdFilterMuni] = useState<string>('all');
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Métricas visuales de Negocios y Cupones
  const totalBusinesses = entrepreneurAds.length;
  const vnBusinesses = entrepreneurAds.filter(b => b.municipio === 'Villa Nueva').length;
  const smpBusinesses = entrepreneurAds.filter(b => b.municipio === 'San Miguel Petapa').length;
  const vcBusinesses = entrepreneurAds.filter(b => b.municipio === 'Villa Canales').length;

  const totalCouponsAvailable = entrepreneurAds.reduce((acc, b) => acc + (b.couponsLeft ?? 15), 0);
  const totalCouponsRedeemed = entrepreneurAds.reduce((acc, b) => acc + (b.couponsRedeemed ?? 0), 0);
  const totalCouponsIssued = entrepreneurAds.reduce((acc, b) => acc + (b.totalCouponsIssued ?? 25), 0);
  const totalEventCapacity = events.reduce((acc, ev) => acc + (ev.capacity || 0), 0);

  // Supabase states
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [showSupabaseSettings, setShowSupabaseSettings] = useState(false);
  const [inputUrl, setInputUrl] = useState(supabaseConfig.url || '');
  const [inputKey, setInputKey] = useState(supabaseConfig.key || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showStatus('La imagen es demasiado pesada. Elige una menor a 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 850;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          if (editingEvent) {
            setEditingEvent({
              ...editingEvent,
              imageUrl: optimizedDataUrl
            });
            showStatus('¡Foto subida con éxito desde tu dispositivo!');
          }
        } else {
          if (editingEvent) {
            setEditingEvent({
              ...editingEvent,
              imageUrl: rawResult
            });
            showStatus('Foto cargada desde tu dispositivo.');
          }
        }
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEditedEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    onUpdateEvent(editingEvent);
    setEditingEvent(null);
    showStatus(`Evento "${editingEvent.title}" guardado con éxito.`);
  };

  const handleToggleFeatured = (ev: EventItem) => {
    const updated = { ...ev, isFeatured: !ev.isFeatured };
    onUpdateEvent(updated);
    showStatus(`Estado destacado de "${ev.title}" actualizado.`);
  };

  const handleToggleAdStatus = (ad: EntrepreneurAd, newStatus: 'aprobado' | 'en_revision' | 'destacado' | 'contactado') => {
    if (!onUpdateAd) return;
    const updated = { ...ad, status: newStatus };
    onUpdateAd(updated);
    showStatus(`Estatus de "${ad.businessName}" cambiado a: ${newStatus.toUpperCase()}`);
  };

  const handleToggleAdVerified = (ad: EntrepreneurAd) => {
    if (!onUpdateAd) return;
    const updated = { ...ad, verifiedBadge: !ad.verifiedBadge };
    onUpdateAd(updated);
    showStatus(`Insignia de verificación para "${ad.businessName}" actualizada.`);
  };

  const handleTriggerSubagentAudit = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showStatus('Auditoría completada por el Guardián Comunitario: 100% de las solicitudes y eventos verificados.');
    }, 1500);
  };

  const filteredAds = entrepreneurAds.filter(ad => {
    const matchesStatus = adFilterStatus === 'all' || ad.status === adFilterStatus;
    const matchesMuni = adFilterMuni === 'all' || ad.municipio === adFilterMuni;
    return matchesStatus && matchesMuni;
  });

  return (
    <div className="space-y-6">
      {/* Admin Header with 90s Pop & Neo-Brutalist Styling */}
      <div className="bg-white border-4 border-black p-5 sm:p-7 shadow-[6px_6px_0_#000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-90s uppercase tracking-wider text-[#FF007F] mb-1">
              <DragonRadarLogo size="sm" />
              <span>Consola de Administración Radar Sur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-90s text-black uppercase tracking-tight">
              Control Maestro de Eventos, Negocios & Cupones
            </h2>
            <p className="text-xs sm:text-sm text-black font-bold mt-0.5">
              Administración unificada para Villa Nueva, San Miguel Petapa y Villa Canales: edita fotos, gestiona aforos y supervisa cupones en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 text-xs font-90s text-black bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000]">
              ADMIN: <strong>{currentUser.name}</strong>
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-[#CCFF00] border-2 border-black text-xs font-90s text-black flex items-center gap-2 shadow-[3px_3px_0_#000]">
            <Check className="w-4 h-4 text-black shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 4 Neo-Brutalist Visual KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="p-4 bg-[#FFE600] border-3 border-black shadow-[4px_4px_0_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-90s uppercase text-black">Negocios Registrados</span>
              <Store className="w-5 h-5 text-black" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-90s text-black">{totalBusinesses}</span>
              <span className="text-xs font-bold text-black ml-1.5">locales</span>
            </div>
            <div className="text-[10px] font-bold text-black border-t border-black/30 pt-1.5 flex justify-between">
              <span>VN: {vnBusinesses}</span>
              <span>Petapa: {smpBusinesses}</span>
              <span>Canales: {vcBusinesses}</span>
            </div>
          </div>

          <div className="p-4 bg-[#00F0FF] border-3 border-black shadow-[4px_4px_0_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-90s uppercase text-black">Cupones Disponibles</span>
              <Tag className="w-5 h-5 text-black" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-90s text-black">{totalCouponsAvailable}</span>
              <span className="text-xs font-bold text-black ml-1.5">en stock</span>
            </div>
            <div className="text-[10px] font-bold text-black border-t border-black/30 pt-1.5 flex justify-between">
              <span>Total Emitidos: {totalCouponsIssued}</span>
              <span className="text-[#FF007F] font-90s">En Vivo</span>
            </div>
          </div>

          <div className="p-4 bg-[#CCFF00] border-3 border-black shadow-[4px_4px_0_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-90s uppercase text-black">Canjes de Clientes</span>
              <Award className="w-5 h-5 text-black" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-90s text-black">{totalCouponsRedeemed}</span>
              <span className="text-xs font-bold text-black ml-1.5">canjeados</span>
            </div>
            <div className="text-[10px] font-bold text-black border-t border-black/30 pt-1.5">
              <span>Compras con descuento registradas</span>
            </div>
          </div>

          <div className="p-4 bg-[#FF007F] text-white border-3 border-black shadow-[4px_4px_0_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-90s uppercase text-white">Eventos Activos</span>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-90s text-white">{events.length}</span>
              <span className="text-xs font-bold text-white ml-1.5">actividades</span>
            </div>
            <div className="text-[10px] font-bold text-white border-t border-white/30 pt-1.5 flex justify-between">
              <span>Aforo Total:</span>
              <span className="font-90s">{totalEventCapacity.toLocaleString()} pases</span>
            </div>
          </div>
        </div>

        {/* Quick Portal Switcher Banner */}
        <div className="mt-4 p-3.5 bg-black text-[#FFE600] border-3 border-black shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00F0FF] shrink-0" />
            <p className="text-xs font-bold text-white">
              ¿Quieres probar cómo los emprendedores gestionan sus cupones y canjean códigos en vivo?
            </p>
          </div>
          {onOpenBusinessPortal && (
            <button
              onClick={() => onOpenBusinessPortal(entrepreneurAds[0]?.id || '')}
              className="px-4 py-2 bg-[#00F0FF] hover:bg-[#FFE600] text-black border-2 border-white shadow-[2px_2px_0_#fff] text-xs font-90s uppercase tracking-wider shrink-0 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              🚀 ABRIR PORTAL DE NEGOCIOS ({totalBusinesses})
            </button>
          )}
        </div>

        {/* Tab switchers in 90s style */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t-2 border-black overflow-x-auto no-scrollbar">
          {[
            { id: 'events', label: 'Gestión de Eventos', icon: Calendar, count: events.length },
            { id: 'ads', label: 'Ads de Emprendedores', icon: Store, count: entrepreneurAds.length },
            { id: 'subagents', label: 'Subagente IA', icon: Sparkles },
            { id: 'users', label: 'Padrón Vecinal', icon: Users, count: 4890 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-90s border-2 border-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#FFE600] text-black shadow-[3px_3px_0_#000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#00F0FF] shadow-[2px_2px_0_#000]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 border border-black ${
                    isActive ? 'bg-[#FF007F] text-white' : 'bg-slate-200 text-black'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Events Management */}
      {adminTab === 'events' && (
        <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-90s text-black uppercase">
                Listado de Eventos Radar Sur ({events.length})
              </h3>
              <p className="text-xs text-black font-bold">
                Actividades activas en Villa Nueva, San Miguel Petapa y Villa Canales visibles en la web pública.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle: Cards vs Table */}
              <div className="flex items-center bg-white border-2 border-black p-0.5 shadow-[2px_2px_0_#000]">
                <button
                  type="button"
                  onClick={() => setEventViewMode('cards')}
                  className={`px-3 py-1.5 text-xs font-90s transition-all cursor-pointer flex items-center gap-1.5 ${
                    eventViewMode === 'cards'
                      ? 'bg-[#FFE600] text-black shadow-[1px_1px_0_#000]'
                      : 'text-black hover:bg-slate-100'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>TARJETAS FOTO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEventViewMode('table')}
                  className={`px-3 py-1.5 text-xs font-90s transition-all cursor-pointer flex items-center gap-1.5 ${
                    eventViewMode === 'table'
                      ? 'bg-[#FFE600] text-black shadow-[1px_1px_0_#000]'
                      : 'text-black hover:bg-slate-100'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>TABLA</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const freshEvent: EventItem = {
                    id: `ev-adm-${Date.now()}`,
                    title: 'Nuevo Evento Radar Sur',
                    category: 'Familiar',
                    municipio: 'Villa Nueva',
                    zona: 'Zona 1 - Centro Histórico',
                    date: '2026-11-15',
                    time: '10:00 AM - 04:00 PM',
                    locationName: 'Parque Central de Villa Nueva',
                    coordinates: { lat: 14.5262, lng: -90.5878 },
                    description: 'Descripción completa del evento para las familias y vecinos del sur...',
                    shortSummary: 'Actividad familiar para disfrutar el fin de semana en el sur metropolitano.',
                    organizer: {
                      name: 'Radar Sur (Producción)',
                      role: 'Organizador Oficial',
                      verified: true,
                      type: 'Radar Sur (Exclusivo)',
                    },
                    sourceType: 'radar',
                    targetAudience: 'Familias y Vecinos de Villa Nueva, Petapa y Villa Canales',
                    cost: 'Entrada Gratis',
                    capacity: 1000,
                    rsvpCount: 0,
                    isFeatured: true,
                    status: 'Aprobado',
                    tags: ['Familiar', 'RadarSur', 'Música'],
                    amenities: ['Seguridad PMT', 'Parqueo Guiado', 'Stands Emprendedores'],
                    gradientTheme: 'from-blue-900 via-indigo-800 to-red-600',
                    accentColor: '#dc2626',
                    iconName: 'Radio',
                    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
                    galleryImages: [
                      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
                    ],
                    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5262,-90.5878',
                    wazeUrl: 'https://waze.com/ul?ll=14.5262,-90.5878&navigate=yes',
                    howToGetThere: 'Acceso principal por 3a calle del Parque Central. Parqueo coordinado por PMT.'
                  };
                  onCreateEvent(freshEvent);
                  setEditingEvent(freshEvent);
                  showStatus('Nuevo evento creado. Modifica los campos a continuación.');
                }}
                className="px-4 py-2.5 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ CREAR NUEVO EVENTO</span>
              </button>
            </div>
          </div>

          {/* Cards View Mode: Visual with Large Photos & Direct Info Edit */}
          {eventViewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev) => {
                const isRadar = ev.sourceType === 'radar' || ev.organizer.type?.includes('Radar');
                return (
                  <div
                    key={ev.id}
                    className="border-3 border-black bg-white shadow-[4px_4px_0_#000] flex flex-col justify-between overflow-hidden group hover:-translate-y-0.5 transition-all"
                  >
                    <div>
                      {/* Image Preview with Hover Overlay */}
                      <div className="relative h-44 bg-slate-900 border-b-3 border-black overflow-hidden">
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1 flex-wrap">
                          {isRadar ? (
                            <span className="px-2 py-0.5 text-[9px] font-90s uppercase bg-[#FF007F] text-white border border-black shadow-[1px_1px_0_#000]">
                              ⚡ Radar Sur Exclusivo
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-90s uppercase bg-[#00F0FF] text-black border border-black shadow-[1px_1px_0_#000]">
                              🏛️ Municipal ({ev.municipio || 'Villa Nueva'})
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-[9px] font-90s uppercase bg-[#FFE600] text-black border border-black shadow-[1px_1px_0_#000]">
                            {ev.category}
                          </span>
                        </div>

                        {ev.isFeatured && (
                          <div className="absolute top-2 right-2 bg-[#FFE600] text-black px-2 py-0.5 border border-black text-[10px] font-90s flex items-center gap-1 shadow-[1px_1px_0_#000]">
                            <Star className="w-3 h-3 fill-black" />
                            <span>DESTACADO</span>
                          </div>
                        )}

                        {/* Quick Change Photo Button over image */}
                        <button
                          onClick={() => setEditingEvent(ev)}
                          className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/85 hover:bg-[#FF007F] text-white border border-white text-[10px] font-90s flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Cambiar Foto</span>
                        </button>
                      </div>

                      {/* Content info */}
                      <div className="p-4 space-y-2.5">
                        <h4 className="text-base font-90s text-black leading-snug line-clamp-2">
                          {ev.title}
                        </h4>

                        <div className="text-xs font-bold text-slate-700 space-y-1">
                          <div className="flex items-center gap-1.5 text-black">
                            <MapPin className="w-3.5 h-3.5 text-[#FF007F] shrink-0" />
                            <span className="line-clamp-1">{ev.locationName} · {ev.zona.split(' - ')[0]}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span>📅 {ev.date}</span>
                            <span>⏰ {ev.time}</span>
                          </div>
                        </div>

                        {/* Capacity meter */}
                        <div className="pt-2 border-t border-black/20 flex items-center justify-between text-xs">
                          <span className="font-bold text-black">Pases / Aforo:</span>
                          <span className="font-mono font-bold bg-[#FFE600] px-2 py-0.5 border border-black">
                            {ev.rsvpCount} / {ev.capacity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="p-3 bg-slate-50 border-t-2 border-black flex items-center justify-between gap-2">
                      <button
                        onClick={() => setEditingEvent(ev)}
                        className="flex-1 py-2 px-3 bg-[#FFE600] hover:bg-[#00F0FF] text-black border-2 border-black font-90s text-xs shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>EDITAR FOTO E INFO</span>
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(ev)}
                        className={`p-2 border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer ${
                          ev.isFeatured ? 'bg-[#FFE600] text-black' : 'bg-white text-slate-400 hover:text-black'
                        }`}
                        title="Alternar Destacado"
                      >
                        <Star className={`w-3.5 h-3.5 ${ev.isFeatured ? 'fill-black' : ''}`} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Seguro que deseas eliminar "${ev.title}"?`)) {
                            onDeleteEvent(ev.id);
                            showStatus(`Evento "${ev.title}" eliminado.`);
                          }
                        }}
                        className="p-2 bg-white hover:bg-red-500 hover:text-white text-red-600 border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black min-w-[700px] border-2 border-black">
              <thead className="bg-[#FFE600] text-black uppercase tracking-wider text-[10px] font-90s border-b-2 border-black">
                <tr>
                  <th className="p-3">Tipo & Título</th>
                  <th className="p-3">Municipio & Sector</th>
                  <th className="p-3">Fecha y Hora</th>
                  <th className="p-3">Aforo / Pases</th>
                  <th className="p-3">Destacado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {events.map((ev) => {
                  const isRadar = ev.sourceType === 'radar' || ev.organizer.type?.includes('Radar');
                  return (
                    <tr key={ev.id} className="hover:bg-[#FFFDF0] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isRadar ? (
                            <span className="px-2 py-0.5 text-[9px] font-90s uppercase bg-[#FF007F] text-white border border-black shadow-[1px_1px_0_#000]">
                              ⚡ Radar Sur Exclusivo
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-90s uppercase bg-[#00F0FF] text-black border border-black shadow-[1px_1px_0_#000]">
                              🏛️ Municipal
                            </span>
                          )}
                          <span className="text-[10px] text-black font-bold">({ev.category})</span>
                        </div>
                        <span className="font-bold text-black block text-sm">{ev.title}</span>
                        <span className="text-[11px] text-slate-600 font-medium">{ev.locationName}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-90s text-black text-xs block">{ev.municipio || 'Villa Nueva'}</span>
                        <span className="text-[11px] text-slate-600 font-bold">{ev.zona.split(' - ')[0]}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{ev.date}</span>
                        <span className="text-slate-400 block text-[10px]">{ev.time}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono tabular-nums">
                        {ev.rsvpCount} / {ev.capacity}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleFeatured(ev)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            ev.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title="Alternar destacado"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingEvent(ev)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar evento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Seguro que deseas eliminar "${ev.title}"?`)) {
                                onDeleteEvent(ev.id);
                                showStatus(`Evento "${ev.title}" eliminado.`);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar evento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* Tab 2: Entrepreneur Ads & Coupons Management */}
      {adminTab === 'ads' && (
        <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-black">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-90s uppercase text-[#FF007F]">
                <Store className="w-4 h-4" />
                <span>Gestión de Emprendedores, Cupones & Stands</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-90s text-black uppercase tracking-tight">
                Directorio Comercial & Control de Cupones ({filteredAds.length})
              </h3>
              <p className="text-xs text-black font-bold">
                Supervisa negocios registrados, niveles de inventario de cupones con descuento y estados de aprobación.
              </p>
            </div>

            {/* Filter by status & municipality */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Municipality filter buttons */}
              <div className="flex items-center bg-white border-2 border-black p-0.5 shadow-[2px_2px_0_#000]">
                {[
                  { id: 'all', label: 'TODO EL SUR' },
                  { id: 'Villa Nueva', label: 'VILLA NUEVA' },
                  { id: 'San Miguel Petapa', label: 'PETAPA' },
                  { id: 'Villa Canales', label: 'VILLA CANALES' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setAdFilterMuni(m.id)}
                    className={`px-2.5 py-1 text-[11px] font-90s transition-all cursor-pointer ${
                      adFilterMuni === m.id
                        ? 'bg-[#FFE600] text-black shadow-[1px_1px_0_#000]'
                        : 'text-black hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Status select */}
              <select
                value={adFilterStatus}
                onChange={(e) => setAdFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[#00F0FF] border-2 border-black font-90s text-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                <option value="all">TODOS LOS ESTADOS ({entrepreneurAds.length})</option>
                <option value="en_revision">EN EVALUACIÓN</option>
                <option value="aprobado">APROBADOS</option>
                <option value="destacado">DESTACADOS</option>
                <option value="contactado">CONTACTADOS</option>
              </select>
            </div>
          </div>

          {/* Supabase Database Connection & Sync Banner */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  supabaseConfig.isConfigured 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Base de Datos de Emprendedores (Supabase)
                    </h4>
                    {supabaseConfig.isConfigured ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                        ● Conectado ({supabaseConfig.source === 'env' ? 'Vercel / .env' : 'Config Local'})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">
                        ● Modo Local (Faltan credenciales)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {supabaseConfig.isConfigured
                      ? `Conectado a: ${supabaseConfig.url} · Las solicitudes de emprendedores se guardan en vivo.`
                      : 'Las solicitudes se guardan temporalmente en memoria. Conecta tu proyecto de Supabase para almacenar la data permanentemente.'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {onSyncSupabase && (
                  <button
                    onClick={async () => {
                      setIsSyncing(true);
                      await onSyncSupabase();
                      setIsSyncing(false);
                      showStatus('Sincronización con Supabase finalizada.');
                    }}
                    disabled={isSyncing}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    title="Cargar registros más recientes desde Supabase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                  </button>
                )}

                <button
                  onClick={async () => {
                    setIsTesting(true);
                    setTestResult(null);
                    const res = await testSupabaseConnection();
                    setIsTesting(false);
                    setTestResult(res.message);
                    showStatus(res.message);
                  }}
                  disabled={isTesting}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Probar conexión con Supabase"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isTesting ? 'Probando...' : 'Probar Conexión'}</span>
                </button>

                <button
                  onClick={() => setShowSupabaseSettings(prev => !prev)}
                  className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                    showSupabaseSettings 
                      ? 'bg-blue-600 text-white border-blue-700' 
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Credenciales</span>
                </button>

                <button
                  onClick={() => {
                    const sqlCode = `-- SQL para Supabase (Tabla de Emprendedores)
CREATE TABLE IF NOT EXISTS public.entrepreneurs (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    category TEXT NOT NULL,
    municipio TEXT NOT NULL DEFAULT 'Villa Nueva',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    instagram_url TEXT,
    space_type TEXT NOT NULL DEFAULT 'Stand Comercial en Feria / Bazar',
    target_event_id TEXT,
    target_event_title TEXT,
    zona TEXT NOT NULL,
    product_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    special_offer TEXT,
    coupon_code TEXT,
    discount_percentage INTEGER DEFAULT 15,
    coupons_left INTEGER DEFAULT 15,
    status TEXT NOT NULL DEFAULT 'en_revision' CHECK (status IN ('aprobado', 'en_revision', 'destacado', 'contactado')),
    budget TEXT,
    verified_badge BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.entrepreneurs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir registro publico" ON public.entrepreneurs;
CREATE POLICY "Permitir registro publico" ON public.entrepreneurs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Permitir lectura publica" ON public.entrepreneurs;
CREATE POLICY "Permitir lectura publica" ON public.entrepreneurs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Permitir actualizacion" ON public.entrepreneurs;
CREATE POLICY "Permitir actualizacion" ON public.entrepreneurs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Permitir eliminacion" ON public.entrepreneurs;
CREATE POLICY "Permitir eliminacion" ON public.entrepreneurs FOR DELETE TO anon, authenticated USING (true);`;
                    navigator.clipboard?.writeText(sqlCode);
                    setCopiedSql(true);
                    showStatus('¡Script SQL copiado al portapapeles! Pégalo en el SQL Editor de Supabase.');
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Copiar script SQL para crear la tabla en Supabase"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{copiedSql ? '¡SQL Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>
            </div>

            {/* Test Result Message Box */}
            {testResult && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}

            {/* Supabase Settings Form */}
            {showSupabaseSettings && (
              <div className="p-4 bg-white border-2 border-blue-200 rounded-2xl space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span>Configurar Credenciales de Supabase</span>
                  </div>
                  <button
                    onClick={() => setShowSupabaseSettings(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Project URL (VITE_SUPABASE_URL):
                    </label>
                    <input
                      type="url"
                      placeholder="https://xyzabcdefg.supabase.co"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Anon Public Key (VITE_SUPABASE_ANON_KEY):
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>💡 Encuentra estos valores en tu panel de Supabase: <strong>Project Settings → API</strong>.</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      if (!inputUrl.trim() || !inputKey.trim()) {
                        showStatus('Por favor ingresa tanto la URL como la Anon Key de Supabase.');
                        return;
                      }
                      saveSupabaseCredentials(inputUrl.trim(), inputKey.trim());
                      const updated = getSupabaseConfig();
                      setSupabaseConfig(updated);
                      showStatus('¡Credenciales de Supabase guardadas con éxito!');
                      if (onSyncSupabase) {
                        await onSyncSupabase();
                      }
                      setShowSupabaseSettings(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Guardar y Conectar
                  </button>

                  <button
                    onClick={() => {
                      clearSupabaseCredentials();
                      setInputUrl('');
                      setInputKey('');
                      setSupabaseConfig(getSupabaseConfig());
                      showStatus('Credenciales locales limpiadas.');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>

          {filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAds.map((ad) => {
                const whatsappUrl = `https://wa.me/${ad.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hola ${ad.ownerName}, te saludamos de Radar Sur respecto a tu negocio "${ad.businessName}".`
                )}`;

                const couponsLeft = ad.couponsLeft ?? 15;
                const totalIssued = ad.totalCouponsIssued ?? 25;
                const redeemed = ad.couponsRedeemed ?? 0;
                const percentLeft = Math.min(100, Math.round((couponsLeft / (totalIssued || 1)) * 100));

                return (
                  <div 
                    key={ad.id}
                    className="p-5 border-3 border-black bg-white shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Business Header Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.imageUrl}
                            alt={ad.businessName}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover border-2 border-black shadow-[2px_2px_0_#000]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 bg-[#FF007F] text-white text-[9px] font-90s uppercase border border-black">
                                {ad.category}
                              </span>
                              <span className="px-1.5 py-0.5 bg-[#FFE600] text-black text-[9px] font-90s uppercase border border-black">
                                {ad.municipio || 'Villa Nueva'}
                              </span>
                            </div>
                            <h4 className="text-base font-90s text-black leading-tight mt-1">
                              {ad.businessName}
                            </h4>
                            <span className="text-xs text-black font-bold">Por {ad.ownerName}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div>
                          {ad.status === 'aprobado' && (
                            <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-[#CCFF00] text-black border border-black shadow-[1.5px_1.5px_0_#000]">
                              ✓ Aprobado
                            </span>
                          )}
                          {ad.status === 'destacado' && (
                            <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-[#FFE600] text-black border border-black shadow-[1.5px_1.5px_0_#000]">
                              ★ Destacado
                            </span>
                          )}
                          {ad.status === 'en_revision' && (
                            <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-[#00F0FF] text-black border border-black shadow-[1.5px_1.5px_0_#000]">
                              En Revisión
                            </span>
                          )}
                          {ad.status === 'contactado' && (
                            <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-white text-black border border-black shadow-[1.5px_1.5px_0_#000]">
                              Contactado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Live Coupon Inventory & Redemption Bar */}
                      <div className="p-3 bg-[#FFE600]/25 border-2 border-black shadow-[2px_2px_0_#000] space-y-2">
                        <div className="flex items-center justify-between text-xs font-90s text-black">
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-[#FF007F]" />
                            <span>STOCK: {couponsLeft} / {totalIssued} CUPONES</span>
                          </span>
                          <span className="text-[10px] bg-black text-[#FFE600] px-1.5 py-0.5 font-mono font-bold">
                            Canjes: {redeemed}
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full bg-white border border-black h-2.5 overflow-hidden">
                          <div 
                            className="bg-[#FF007F] h-full transition-all duration-300"
                            style={{ width: `${percentLeft}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="font-bold text-black">
                            Descuento: <strong className="text-[#FF007F] font-90s">{ad.discountPercentage ?? 15}% OFF</strong> ({ad.couponCode || 'RADAR-SUR'})
                          </span>

                          {onUpdateAd && (
                            <button
                              onClick={() => {
                                const updated = {
                                  ...ad,
                                  couponsLeft: couponsLeft + 5,
                                  totalCouponsIssued: totalIssued + 5
                                };
                                onUpdateAd(updated);
                                showStatus(`+5 cupones agregados a "${ad.businessName}".`);
                              }}
                              className="px-2.5 py-1 bg-[#00F0FF] hover:bg-[#FFE600] text-black border border-black font-90s text-[10px] transition-all cursor-pointer shadow-[1px_1px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
                              title="Recargar 5 cupones al negocio"
                            >
                              +5 CUPONES
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Location & Details row */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-black/20 text-black font-medium">
                        <div>
                          <span className="text-black/60 block font-bold">Espacio:</span>
                          <strong>{ad.spaceType}</strong>
                        </div>
                        <div>
                          <span className="text-black/60 block font-bold">Zona:</span>
                          <strong>{ad.zona.split(' - ')[0]}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-black/60 block font-bold">Evento / Feria Deseada:</span>
                          <strong>{ad.targetEventTitle || 'Todos los eventos'}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-black font-medium line-clamp-2 bg-slate-50 p-2.5 border border-black">
                        {ad.productDescription}
                      </p>

                      {ad.specialOffer && (
                        <div className="text-[11px] text-black font-bold bg-[#CCFF00]/40 p-2 border border-black flex items-center gap-1.5">
                          <span className="text-[#FF007F] font-90s">★ OFERTA:</span> {ad.specialOffer}
                        </div>
                      )}
                    </div>

                    {/* Actions toolbar */}
                    <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {onOpenBusinessPortal && (
                          <button
                            onClick={() => onOpenBusinessPortal(ad.id)}
                            className="px-3 py-1.5 bg-[#FFE600] hover:bg-[#00F0FF] text-black text-xs font-90s border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center gap-1 cursor-pointer"
                            title="Abrir el portal del emprendedor para este negocio"
                          >
                            <Store className="w-3.5 h-3.5 text-black" />
                            <span>PORTAL NEGOCIO</span>
                          </button>
                        )}

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-[#00FF66] hover:bg-emerald-400 text-black text-xs font-90s border-2 border-black shadow-[2px_2px_0_#000] transition-colors flex items-center gap-1"
                          title="Contactar al emprendedor por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleToggleAdVerified(ad)}
                          className={`p-1.5 border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer ${
                            ad.verifiedBadge
                              ? 'bg-[#FFE600] text-black'
                              : 'bg-white text-slate-400 hover:text-black'
                          }`}
                          title="Alternar insignia de verificado"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <select
                          value={ad.status}
                          onChange={(e) => handleToggleAdStatus(ad, e.target.value as any)}
                          className="px-2 py-1 text-xs bg-white border-2 border-black font-90s text-black"
                        >
                          <option value="en_revision">En Revisión</option>
                          <option value="aprobado">Aprobar</option>
                          <option value="destacado">Destacar</option>
                          <option value="contactado">Contactado</option>
                        </select>

                        {onDeleteAd && (
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar solicitud de "${ad.businessName}"?`)) {
                                onDeleteAd(ad.id);
                                showStatus(`Solicitud de "${ad.businessName}" eliminada.`);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-500 hover:text-white border-2 border-black transition-colors"
                            title="Eliminar ad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No hay solicitudes con este filtro.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Subagent Policy */}
      {adminTab === 'subagents' && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-red-600">
            <Sparkles className="w-4 h-4" />
            <span>Guardián Comunitario Radar IA</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-serif-display">
            Directivas y Protección Automática
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            El subagente inteligente analiza las publicaciones de eventos, solicitudes comerciales de emprendedores y coordinación de rutas seguras con datos en tiempo real de PMT Villa Nueva.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2 text-blue-950 font-medium">
            <div className="flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Estado: Activo y en escucha en las 12 zonas</span>
            </div>
            <div>Modelo en ejecución: <strong>Gemini 2.5 Flash</strong> con latencia de ~310ms.</div>
          </div>
        </div>
      )}

      {/* Tab 5: Users */}
      {adminTab === 'users' && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-serif-display">
            Padrón Vecinal de Radar
          </h3>
          <p className="text-xs text-slate-600">
            Más de 4,890 vecinos y familias registradas en las 12 zonas para recibir alertas de proximidad y pases digitales QR.
          </p>
        </div>
      )}

      {/* Edit Event Modal Drawer inside Admin */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border-2 border-blue-900/20 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-black text-red-600 uppercase tracking-wider block">
                  Edición Administrativa de Evento
                </span>
                <h3 className="text-base sm:text-lg font-bold text-blue-950 font-serif-display">
                  {editingEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedEvent} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Event Type: Radar Sur Exclusivo vs Municipal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#FFE600]/20 rounded-2xl border-2 border-black shadow-[2px_2px_0_#000]">
                <div>
                  <label className="font-90s text-black block mb-1 uppercase">Tipo de Actividad:</label>
                  <select
                    value={editingEvent.sourceType || 'radar'}
                    onChange={(e) => {
                      const isRadar = e.target.value === 'radar';
                      const muni = editingEvent.municipio || 'Villa Nueva';
                      setEditingEvent({ 
                        ...editingEvent, 
                        sourceType: e.target.value as any,
                        organizer: {
                          ...editingEvent.organizer,
                          type: isRadar ? 'Radar Sur (Exclusivo)' : `Alcaldía ${muni}`
                        }
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-black font-bold"
                  >
                    <option value="radar">⚡ Evento Exclusivo Radar Sur</option>
                    <option value="municipal">🏛️ Evento Municipal Oficial</option>
                  </select>
                </div>

                <div>
                  <label className="font-90s text-black block mb-1 uppercase">Entidad Organizadora:</label>
                  <input
                    type="text"
                    value={editingEvent.organizer.name}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      organizer: { ...editingEvent.organizer, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-black font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-90s text-black block mb-1 uppercase">Título del Evento:</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-black rounded-lg text-black font-bold focus:outline-none"
                />
              </div>

              {/* 3-way Geographic & Classification Control */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-90s text-black block mb-1 uppercase">Municipio:</label>
                  <select
                    value={editingEvent.municipio || 'Villa Nueva'}
                    onChange={(e) => {
                      const newMuni = e.target.value as MunicipioSur;
                      const defaultZona = ZONAS_BY_MUNICIPIO[newMuni]?.[0] || editingEvent.zona;
                      const updatedType = (editingEvent.sourceType === 'municipal' 
                        ? `Alcaldía ${newMuni}` 
                        : editingEvent.organizer.type) as any;
                      setEditingEvent({
                        ...editingEvent,
                        municipio: newMuni,
                        zona: defaultZona as SurZona,
                        organizer: {
                          ...editingEvent.organizer,
                          type: updatedType
                        }
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#FFE600] border-2 border-black rounded-lg text-black font-90s"
                  >
                    <option value="Villa Nueva">Villa Nueva</option>
                    <option value="San Miguel Petapa">San Miguel Petapa</option>
                    <option value="Villa Canales">Villa Canales</option>
                  </select>
                </div>

                <div>
                  <label className="font-90s text-black block mb-1 uppercase">Zona / Sector:</label>
                  <select
                    value={editingEvent.zona}
                    onChange={(e) => setEditingEvent({ ...editingEvent, zona: e.target.value as SurZona })}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-black font-bold"
                  >
                    {(ZONAS_BY_MUNICIPIO[editingEvent.municipio || 'Villa Nueva'] || []).map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-90s text-black block mb-1 uppercase">Categoría:</label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as EventCategory })}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-black font-bold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha (YYYY-MM-DD):</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario:</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Costo / Entrada:</label>
                  <input
                    type="text"
                    value={editingEvent.cost}
                    onChange={(e) => setEditingEvent({ ...editingEvent, cost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lugar / Ubicación:</label>
                <input
                  type="text"
                  value={editingEvent.locationName}
                  onChange={(e) => setEditingEvent({ ...editingEvent, locationName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              {/* Navigation links for GPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enlace Google Maps:</label>
                  <input
                    type="url"
                    value={editingEvent.mapsUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, mapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enlace Waze:</label>
                  <input
                    type="url"
                    value={editingEvent.wazeUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, wazeUrl: e.target.value })}
                    placeholder="https://waze.com/ul?..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              {/* Subida de Foto desde PC o Móvil */}
              <div className="p-4 bg-slate-50 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-90s text-xs text-black uppercase flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#FF007F]" />
                    <span>Foto Principal del Evento:</span>
                  </label>
                  {editingEvent.imageUrl && (
                    <span className="text-[10px] font-bold bg-[#00FF66] text-black px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]">
                      ✓ Foto Cargada
                    </span>
                  )}
                </div>

                {/* Vista Previa de la Foto */}
                {editingEvent.imageUrl ? (
                  <div className="space-y-2">
                    <div className="relative border-3 border-black overflow-hidden bg-black/5 rounded-xl max-h-56 flex items-center justify-center">
                      <img
                        src={editingEvent.imageUrl}
                        alt="Vista previa"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded-sm border border-white/20">
                        Foto activa del evento
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <label 
                        htmlFor="admin-file-upload-change"
                        className="px-3.5 py-2 bg-[#FFE600] hover:bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0_#000] text-xs font-90s uppercase flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Cambiar Foto (PC / Celular)</span>
                        <input
                          id="admin-file-upload-change"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setEditingEvent({ ...editingEvent, imageUrl: '' })}
                        className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border-2 border-black shadow-[2px_2px_0_#000] text-xs font-bold uppercase transition-all"
                      >
                        Quitar Foto
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowManualUrl(!showManualUrl)}
                        className="text-[11px] text-slate-600 hover:text-black underline ml-auto font-medium"
                      >
                        {showManualUrl ? 'Ocultar URL manual' : 'O usar URL manual'}
                      </button>
                    </div>

                    {/* Presets de Fotos Temáticas con 1 Clic */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-90s uppercase text-black block mb-1.5">
                        🎨 O elige una foto temática predefinida (1 clic):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {PRESET_EVENT_PHOTOS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setEditingEvent({ ...editingEvent, imageUrl: preset.url });
                              showStatus(`Foto cambiada a "${preset.label}".`);
                            }}
                            className={`p-1.5 border-2 border-black text-[10px] font-90s text-left flex items-center gap-2 transition-all cursor-pointer ${
                              editingEvent.imageUrl === preset.url
                                ? 'bg-[#FFE600] text-black shadow-[2px_2px_0_#000]'
                                : 'bg-white hover:bg-[#00F0FF] text-black shadow-[1px_1px_0_#000]'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-7 h-7 object-cover border border-black shrink-0"
                            />
                            <span className="truncate">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-3 border-dashed border-black/40 hover:border-black p-5 text-center bg-white rounded-xl space-y-2.5 transition-colors">
                    <div className="w-12 h-12 mx-auto bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center">
                      <Upload className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <label 
                        htmlFor="admin-file-upload-new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF007F] hover:bg-[#FFE600] text-white hover:text-black border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s uppercase cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Subir Foto de la PC o Móvil</span>
                        <input
                          id="admin-file-upload-new"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 font-bold mt-2">
                        Toca el botón para elegir una foto de tu galería, cámara o archivos (JPG, PNG, WebP)
                      </p>
                    </div>

                    {/* Presets rápidos si no tiene foto */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-90s uppercase text-black block mb-1.5">
                        🎨 O elige una foto temática predefinida (1 clic):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {PRESET_EVENT_PHOTOS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setEditingEvent({ ...editingEvent, imageUrl: preset.url });
                              showStatus(`Foto asignada: "${preset.label}".`);
                            }}
                            className="p-1.5 border-2 border-black text-[10px] font-90s text-left flex items-center gap-2 bg-white hover:bg-[#00F0FF] text-black shadow-[1px_1px_0_#000] transition-all cursor-pointer"
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-7 h-7 object-cover border border-black shrink-0"
                            />
                            <span className="truncate">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowManualUrl(!showManualUrl)}
                        className="text-[11px] text-slate-500 hover:text-black underline font-medium"
                      >
                        {showManualUrl ? 'Ocultar entrada de URL manual' : '¿Prefieres pegar un enlace URL web?'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Entrada de URL manual opcional */}
                {showManualUrl && (
                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Pegar URL externa directa (opcional):
                    </label>
                    <input
                      type="url"
                      value={editingEvent.imageUrl || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción Completa:</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
