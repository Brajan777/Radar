import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Ticket, 
  Share2, 
  Check, 
  Download, 
  AlertCircle,
  QrCode,
  ExternalLink,
  Navigation,
  Compass,
  Copy,
  Car,
  Footprints,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { EventItem, UserProfile } from '../types';
import { formatDistance, LatLng, calculateDistanceKm } from '../utils/geo';
import { DragonRadarLogo } from './DragonRadarLogo';

interface EventModalProps {
  event: EventItem | null;
  userCoords: LatLng;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRsvp: (eventId: string, count: number) => void;
  onOpenShare?: (event: EventItem) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  userCoords,
  user,
  isOpen,
  onClose,
  onConfirmRsvp,
  onOpenShare,
}) => {
  if (!isOpen || !event) return null;

  const [activeTab, setActiveTab] = useState<'fotos' | 'ubicacion' | 'ticket'>('fotos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [ticketCount, setTicketCount] = useState<number>(2);
  const [ticketIssued, setTicketIssued] = useState<boolean>(false);
  const [ticketCode, setTicketCode] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  const distanceKm = calculateDistanceKm(userCoords, event.coordinates);

  const gallery = event.galleryImages && event.galleryImages.length > 0 
    ? event.galleryImages 
    : [event.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85'];

  const googleMapsUrl = event.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`;
  const wazeUrl = event.wazeUrl || `https://waze.com/ul?ll=${event.coordinates.lat},${event.coordinates.lng}&navigate=yes`;

  const handleIssueTicket = () => {
    const code = `RADAR-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketCode(code);
    setTicketIssued(true);
    onConfirmRsvp(event.id, ticketCount);
  };

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText(`${event.locationName}, ${event.zona}, Villa Nueva, Guatemala. GPS: ${event.coordinates.lat}, ${event.coordinates.lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Visual Hero with 90s Pop Motif */}
        <div className="relative min-h-[200px] sm:min-h-[250px] p-6 text-white overflow-hidden flex flex-col justify-between bg-black shrink-0 border-b-4 border-black">
          {/* Main Visual Image */}
          <img
            src={gallery[selectedPhotoIndex] || event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

          {/* Top Bar with Dragon Radar Badge & Close */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#FFE600] px-3 py-1.5 border-2 border-black text-black shadow-[2px_2px_0_#000]">
              <DragonRadarLogo size="sm" />
              <span className="text-[11px] font-90s uppercase tracking-wider text-black">
                Radar · Villa Nueva
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenShare && (
                <button
                  onClick={() => onOpenShare(event)}
                  className="p-2 bg-white hover:bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
                  title="Compartir en Redes Sociales"
                >
                  <Share2 className="w-4 h-4 text-black" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white hover:bg-[#FF007F] hover:text-white text-black border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title and Key Badges */}
          <div className="relative z-10 space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-90s">
              {event.sourceType === 'radar' || event.organizer.type === 'Radar Villa Nueva (Exclusivo)' ? (
                <span className="px-2.5 py-0.5 bg-[#FF007F] text-white uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                  ★ EXCLUSIVO RADAR
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-[#00F0FF] text-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                  🏛️ MUNICIPAL
                </span>
              )}
              <span className="px-2.5 py-0.5 bg-[#FFE600] text-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                {event.category}
              </span>
              <span className="px-2.5 py-0.5 bg-white text-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                {event.zona.split(' - ')[0]}
              </span>
              <span className="px-2.5 py-0.5 bg-[#CCFF00] text-black uppercase text-[10px] tracking-wider font-extrabold border-2 border-black shadow-[2px_2px_0_#000]">
                {event.cost}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-display leading-tight text-white drop-shadow-md">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 font-medium">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Calendar className="w-4 h-4" />
                {event.date} · {event.time}
              </span>
              <span className="flex items-center gap-1.5 text-blue-200">
                <MapPin className="w-4 h-4 text-red-500" />
                {formatDistance(distanceKm)} desde tu punto
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Fotos & Galería, Cómo Llegar / Mapa, Pase Familiar) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('fotos')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'fotos'
                ? 'bg-white text-blue-800 border-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-blue-700" />
            <span>Galería & Detalles</span>
          </button>

          <button
            onClick={() => setActiveTab('ubicacion')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'ubicacion'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Navigation className="w-4 h-4 text-red-600" />
            <span>Cómo Llegar (GPS & Waze)</span>
          </button>

          <button
            onClick={() => setActiveTab('ticket')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'ticket'
                ? 'bg-white text-blue-800 border-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Ticket className="w-4 h-4 text-blue-700" />
            <span>Pase Familiar QR</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs sm:text-sm">
          
          {/* TAB 1: Fotos y Galería Visual */}
          {activeTab === 'fotos' && (
            <div className="space-y-6">
              {/* Photo Switcher Row */}
              {gallery.length > 1 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Fotos y Vistas del Evento ({gallery.length} fotos disponibles)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                          selectedPhotoIndex === idx
                            ? 'border-red-600 ring-2 ring-red-500/30 scale-102 shadow-sm'
                            : 'border-slate-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Vista ${idx + 1}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sobre esta actividad
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {event.description}
                </p>
              </div>

              {/* Organizer & Verification Badge */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{event.organizer.name}</span>
                      {event.organizer.verified && (
                        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {event.organizer.type} · {event.targetAudience}
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 text-[11px] font-bold text-blue-900 bg-blue-100/80 rounded-full border border-blue-200 shrink-0">
                  Verificado por Radar
                </span>
              </div>

              {/* Amenities & Security */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Servicios y Comodidades Incluidas
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {event.amenities.map((am) => (
                    <div 
                      key={am}
                      className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-800 text-xs font-medium flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action to Open Location Tab */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('ubicacion')}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Ver Ubicación Exacta y Enlaces para Llegar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Ubicación & Enlaces para Llegar (Google Maps & Waze) */}
          {activeTab === 'ubicacion' && (
            <div className="space-y-6">
              
              {/* Highlight Location Box */}
              <div className="p-4 bg-gradient-to-br from-blue-50 via-white to-red-50 border-2 border-blue-900/20 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                      Destino en Villa Nueva
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {event.locationName}
                    </h3>
                    <div className="text-xs text-slate-600 font-medium">
                      {event.zona} · Coordenadas: <span className="font-mono text-blue-900 font-bold">{event.coordinates.lat}, {event.coordinates.lng}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLocation}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors shrink-0 flex items-center gap-1 text-xs"
                    title="Copiar datos de ubicación"
                  >
                    {copiedCoords ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCoords ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                {/* Distance Badge */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                  <span className="flex items-center gap-1 font-bold text-blue-900">
                    <Footprints className="w-3.5 h-3.5 text-blue-700" />
                    Distancia: {formatDistance(distanceKm)}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Car className="w-3.5 h-3.5 text-red-600" />
                    Aprox. {Math.round(distanceKm * 3.5 + 4)} min en auto
                  </span>
                </div>
              </div>

              {/* Direct Maps & Waze Links (The User's Core Request!) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enlaces Directos de Navegación (Toca para Abrir)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Maps Button */}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-white hover:bg-blue-50 border-2 border-blue-600 rounded-2xl flex items-center justify-between text-left transition-all shadow-sm group hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-blue-950 text-sm">
                          Abrir en Google Maps
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Ruta GPS paso a paso
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Waze Button */}
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-white hover:bg-sky-50 border-2 border-sky-500 rounded-2xl flex items-center justify-between text-left transition-all shadow-sm group hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black shrink-0">
                        <Navigation className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-950 text-sm">
                          Navegar con Waze
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Tráfico y alertas PMT en vivo
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Instructions / How to get there */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Compass className="w-4 h-4 text-red-600" />
                  <span>Instrucciones de Llegada y Parqueo</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {event.howToGetThere || `Acceso directo por las vías principales de ${event.zona}. Sigue las indicaciones viales de la PMT de Villa Nueva para acceso a parqueos autorizados.`}
                </p>
              </div>

              {/* Mini Simulated Radar Screen View */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-4 text-white border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <DragonRadarLogo size="md" />
                  <div>
                    <div className="text-xs font-bold text-green-400">
                      Coordenadas fijadas en Radar
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Lat: {event.coordinates.lat} · Lng: {event.coordinates.lng}
                    </div>
                  </div>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Ir al Mapa
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Pase Familiar QR */}
          {activeTab === 'ticket' && (
            <div className="space-y-6">
              {!ticketIssued ? (
                <div className="p-6 bg-slate-50 border-2 border-dashed border-blue-300 rounded-3xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Generar Pase Familiar Gratuito
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Obtén un boleto digital con código QR para ti y tu familia con acceso prioritario.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2">
                    <span className="text-xs font-bold text-slate-700">Integrantes:</span>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setTicketCount(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            ticketCount === num
                              ? 'bg-blue-700 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleIssueTicket}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Confirmar y Emitir Pase QR
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-gradient-to-br from-blue-900 to-slate-950 text-white rounded-3xl border-2 border-red-500 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <DragonRadarLogo size="sm" />
                      <span className="font-black text-xs tracking-wider uppercase text-amber-300">
                        Pase Oficial Radar Villa Nueva
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 font-bold">
                      {ticketCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold font-serif-display text-white">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {event.date} · {event.time}
                      </p>
                      <p className="text-xs text-amber-200 font-semibold">
                        Válido para {ticketCount} personas ({user.name})
                      </p>
                    </div>

                    <div className="w-16 h-16 bg-white rounded-xl p-1.5 shadow-md flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-slate-900" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Presentar al ingreso en {event.locationName}</span>
                    <span className="text-green-400 font-bold">✓ Confirmado</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Evento respaldado por Radar Villa Nueva</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Abrir Google Maps</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
