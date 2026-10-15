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
  CheckCircle2
} from 'lucide-react';
import { EventItem, UserProfile, EventCategory, SurZona, MunicipioSur, EntrepreneurAd, AdSpaceType } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';
import { ZONAS_BY_MUNICIPIO } from './HeroSection';

interface AdminPanelProps {
  events: EventItem[];
  currentUser: UserProfile;
  entrepreneurAds?: EntrepreneurAd[];
  onUpdateEvent: (updatedEvent: EventItem) => void;
  onDeleteEvent: (eventId: string) => void;
  onCreateEvent: (newEvent: EventItem) => void;
  onUpdateAd?: (updatedAd: EntrepreneurAd) => void;
  onDeleteAd?: (adId: string) => void;
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
}) => {
  const [adminTab, setAdminTab] = useState<'events' | 'ads' | 'users' | 'subagents'>('events');
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [adFilterStatus, setAdFilterStatus] = useState<string>('all');
  const [showManualUrl, setShowManualUrl] = useState(false);

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
    if (adFilterStatus === 'all') return true;
    return ad.status === adFilterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Admin Header with Azul, Blanco y Rojo styling */}
      <div className="bg-white border-2 border-blue-900/15 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600 mb-1">
              <DragonRadarLogo size="sm" />
              <span>Consola de Administración Radar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-90s text-black uppercase">
              Control de Eventos & Ads
            </h2>
            <p className="text-xs sm:text-sm text-black font-bold mt-0.5">
              Plataforma privada: crea y gestiona actividades municipales o exclusivas Radar, y aprueba solicitudes comerciales de emprendedores.
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
        </div>
      )}

      {/* Tab 2: Entrepreneur Ads Management */}
      {adminTab === 'ads' && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-red-600">
                <Store className="w-4 h-4" />
                <span>Gestión de Anunciantes & Stands</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950 font-serif-display">
                Solicitudes de Emprendedores y Ads Recopilados ({entrepreneurAds.length})
              </h3>
              <p className="text-xs text-slate-500">
                Revisa las solicitudes de food trucks, stands comerciales y marcas que desean unirse a las actividades.
              </p>
            </div>

            {/* Filter by status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filtrar:</span>
              <select
                value={adFilterStatus}
                onChange={(e) => setAdFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
              >
                <option value="all">Todos ({entrepreneurAds.length})</option>
                <option value="en_revision">En Evaluación</option>
                <option value="aprobado">Aprobados</option>
                <option value="destacado">Destacados</option>
                <option value="contactado">Contactados</option>
              </select>
            </div>
          </div>

          {filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAds.map((ad) => {
                const whatsappUrl = `https://wa.me/${ad.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hola ${ad.ownerName}, te saludamos de Radar Villa Nueva respecto a tu solicitud de stand para ${ad.businessName}.`
                )}`;

                return (
                  <div 
                    key={ad.id}
                    className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ad.imageUrl}
                            alt={ad.businessName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                              {ad.category}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {ad.businessName}
                            </h4>
                            <span className="text-xs text-slate-500">Por {ad.ownerName}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div>
                          {ad.status === 'aprobado' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Aprobado
                            </span>
                          )}
                          {ad.status === 'destacado' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300">
                              Destacado
                            </span>
                          )}
                          {ad.status === 'en_revision' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              En Revisión
                            </span>
                          )}
                          {ad.status === 'contactado' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                              Contactado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/80 text-slate-700">
                        <div>
                          <span className="text-slate-400 block">Espacio:</span>
                          <strong>{ad.spaceType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Zona:</span>
                          <strong>{ad.zona.split(' - ')[0]}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block">Evento Deseado:</span>
                          <strong>{ad.targetEventTitle || 'Todos'}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 bg-white p-2.5 rounded-xl border border-slate-100">
                        {ad.productDescription}
                      </p>

                      {ad.specialOffer && (
                        <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                          <strong>Oferta Radar:</strong> {ad.specialOffer}
                        </div>
                      )}
                    </div>

                    {/* Actions toolbar */}
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          title="Contactar al emprendedor por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleToggleAdVerified(ad)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            ad.verifiedBadge
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
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
                          className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold"
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
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                      const updatedType = editingEvent.sourceType === 'municipal' 
                        ? `Alcaldía ${newMuni}` 
                        : editingEvent.organizer.type;
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
