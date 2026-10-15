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
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  const distanceKm = calculateDistanceKm(userCoords, event.coordinates);

  const gallery = event.galleryImages && event.galleryImages.length > 0 
    ? event.galleryImages 
    : [event.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85'];

  const googleMapsUrl = event.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`;
  const wazeUrl = event.wazeUrl || `https://waze.com/ul?ll=${event.coordinates.lat},${event.coordinates.lng}&navigate=yes`;

  const handleIssueTicket = () => {
    const code = `SUR-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketCode(code);
    setTicketIssued(true);
    onConfirmRsvp(event.id, ticketCount);
  };

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText(`${event.locationName}, ${event.zona}, ${event.municipio}, Guatemala. GPS: ${event.coordinates.lat}, ${event.coordinates.lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const isRadarEvent = event.sourceType === 'radar' || event.organizer.type === 'Radar Sur (Exclusivo)' || event.organizer.type === 'Radar Villa Nueva (Exclusivo)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Visual Hero with 90s Pop Motif */}
        <div className="relative min-h-[220px] sm:min-h-[260px] p-5 sm:p-6 text-white overflow-hidden flex flex-col justify-between bg-black shrink-0 border-b-4 border-black">
          {/* Main Visual Image */}
          <img
            src={gallery[selectedPhotoIndex] || event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35" />

          {/* Top Bar with Dragon Radar Badge & Close */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#FFE600] px-3 py-1.5 border-2 border-black text-black shadow-[3px_3px_0_#000]">
              <DragonRadarLogo size="sm" />
              <span className="text-[11px] font-90s uppercase tracking-wider text-black">
                Radar Sur · {event.municipio}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenShare && (
                <button
                  onClick={() => onOpenShare(event)}
                  className="p-2 bg-white hover:bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
                  title="Compartir en Redes Sociales"
                >
                  <Share2 className="w-4 h-4 text-black" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white hover:bg-[#FF007F] hover:text-white text-black border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title and Key Badges */}
          <div className="relative z-10 space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-90s">
              {isRadarEvent ? (
                <span className="px-2.5 py-0.5 bg-[#FF007F] text-white uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                  ★ EXCLUSIVO RADAR SUR
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-[#00F0FF] text-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                  🏛️ {event.organizer.type}
                </span>
              )}
              <span className="px-2.5 py-0.5 bg-[#FFE600] text-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                {event.municipio}
              </span>
              <span className="px-2.5 py-0.5 bg-white text-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[2px_2px_0_#000]">
                {event.category}
              </span>
              <span className="px-2.5 py-0.5 bg-[#CCFF00] text-black uppercase text-[10px] tracking-wider font-extrabold border-2 border-black shadow-[2px_2px_0_#000]">
                {event.cost}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-90s leading-tight text-white drop-shadow-[2px_2px_0_#000] uppercase">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-white font-bold">
              <span className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-white/50 text-[#FFE600]">
                <Calendar className="w-3.5 h-3.5" />
                {event.date} · {event.time}
              </span>
              <span className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-white/50 text-[#00F0FF]">
                <MapPin className="w-3.5 h-3.5 text-[#FF007F]" />
                {formatDistance(distanceKm)} desde ti
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Neo-Brutalist 90s Style) */}
        <div className="flex border-b-3 border-black bg-[#FFE600] px-4 pt-2 gap-2 text-xs font-90s shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('fotos')}
            className={`py-2 px-3 sm:px-4 border-2 border-b-0 border-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fotos'
                ? 'bg-white text-black shadow-[2px_-2px_0_#000] -translate-y-0.5'
                : 'bg-[#FFE600] text-black hover:bg-white/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#FF007F]" />
            <span>GALERÍA & DETALLES</span>
          </button>

          <button
            onClick={() => setActiveTab('ubicacion')}
            className={`py-2 px-3 sm:px-4 border-2 border-b-0 border-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ubicacion'
                ? 'bg-white text-black shadow-[2px_-2px_0_#000] -translate-y-0.5'
                : 'bg-[#FFE600] text-black hover:bg-white/60'
            }`}
          >
            <Navigation className="w-4 h-4 text-[#00F0FF]" />
            <span>CÓMO LLEGAR (GPS)</span>
          </button>

          <button
            onClick={() => setActiveTab('ticket')}
            className={`py-2 px-3 sm:px-4 border-2 border-b-0 border-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ticket'
                ? 'bg-white text-black shadow-[2px_-2px_0_#000] -translate-y-0.5'
                : 'bg-[#FFE600] text-black hover:bg-white/60'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#FF007F]" />
            <span>PASE FAMILIAR QR</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs sm:text-sm bg-white">
          
          {/* TAB 1: Fotos y Galería Visual */}
          {activeTab === 'fotos' && (
            <div className="space-y-6">
              {/* Photo Switcher Row */}
              {gallery.length > 1 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-90s uppercase tracking-wider text-black block">
                    Fotos de la actividad ({gallery.length} fotos)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative overflow-hidden aspect-[4/3] border-2 border-black transition-all cursor-pointer ${
                          selectedPhotoIndex === idx
                            ? 'ring-2 ring-[#FF007F] shadow-[3px_3px_0_#000] -translate-y-0.5'
                            : 'opacity-70 hover:opacity-100'
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
                <h4 className="text-xs font-90s uppercase tracking-wider text-black">
                  Sobre esta actividad
                </h4>
                <p className="text-black font-medium leading-relaxed text-xs sm:text-sm">
                  {event.description}
                </p>
              </div>

              {/* Organizer & Verification Badge */}
              <div className="p-4 bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center font-90s text-base shrink-0">
                    ★
                  </div>
                  <div>
                    <div className="font-90s text-black text-xs sm:text-sm flex items-center gap-1.5 uppercase">
                      <span>{event.organizer.name}</span>
                      {event.organizer.verified && (
                        <ShieldCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-black/70">
                      {event.organizer.type} · {event.targetAudience}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-[10px] font-90s text-black bg-[#CCFF00] border-2 border-black shadow-[2px_2px_0_#000] shrink-0">
                  Verificado Radar Sur
                </span>
              </div>

              {/* Amenities & Security */}
              <div className="space-y-2">
                <h4 className="text-xs font-90s uppercase tracking-wider text-black">
                  Servicios y Comodidades Incluidas
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {event.amenities.map((am) => (
                    <div 
                      key={am}
                      className="p-2.5 bg-[#FFFDF0] border-2 border-black text-black text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0_#000]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#FF007F] shrink-0" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action to Open Location Tab */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('ubicacion')}
                  className="w-full py-3 px-4 bg-[#00F0FF] hover:bg-[#FFE600] text-black font-90s border-3 border-black shadow-[4px_4px_0_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>VER UBICACIÓN EXACTA Y ENLACES DE NAVEGACIÓN</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Ubicación & Enlaces para Llegar (Google Maps & Waze) */}
          {activeTab === 'ubicacion' && (
            <div className="space-y-6">
              
              {/* Highlight Location Box */}
              <div className="p-4 bg-[#FFE600]/30 border-3 border-black shadow-[4px_4px_0_#000] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-90s uppercase tracking-wider text-[#FF007F]">
                      Destino en {event.municipio}
                    </span>
                    <h3 className="text-base sm:text-lg font-90s text-black uppercase">
                      {event.locationName}
                    </h3>
                    <div className="text-xs text-black font-bold">
                      {event.zona} · GPS: <span className="font-mono bg-white px-1 border border-black">{event.coordinates.lat}, {event.coordinates.lng}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLocation}
                    className="p-2 bg-white hover:bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] font-90s text-black transition-all shrink-0 flex items-center gap-1 text-xs cursor-pointer"
                    title="Copiar datos de ubicación"
                  >
                    {copiedCoords ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCoords ? '¡COPIADO!' : 'COPIAR'}</span>
                  </button>
                </div>

                {/* Distance Badge */}
                <div className="flex items-center gap-3 pt-2 border-t-2 border-black text-xs text-black font-bold">
                  <span className="flex items-center gap-1 bg-white px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0_#000]">
                    <Footprints className="w-3.5 h-3.5 text-[#00F0FF]" />
                    Distancia: {formatDistance(distanceKm)}
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0_#000]">
                    <Car className="w-3.5 h-3.5 text-[#FF007F]" />
                    Aprox. {Math.round(distanceKm * 3.2 + 3)} min en auto
                  </span>
                </div>
              </div>

              {/* Direct Maps & Waze Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-90s uppercase tracking-wider text-black">
                  Enlaces Directos de Navegación (Abre tu app favorita)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Maps Button */}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-[#FFE600] hover:bg-[#00F0FF] text-black border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-between text-left transition-all group hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center font-black shrink-0">
                        <MapPin className="w-5 h-5 text-[#FFE600]" />
                      </div>
                      <div>
                        <div className="font-90s text-black text-sm uppercase">
                          Google Maps
                        </div>
                        <div className="text-[11px] font-bold text-black/80">
                          Ruta GPS paso a paso
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Waze Button */}
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-[#00F0FF] hover:bg-[#FFE600] text-black border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-between text-left transition-all group hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black text-[#00F0FF] border-2 border-black flex items-center justify-center font-black shrink-0">
                        <Navigation className="w-5 h-5 text-[#00F0FF]" />
                      </div>
                      <div>
                        <div className="font-90s text-black text-sm uppercase">
                          Waze
                        </div>
                        <div className="text-[11px] font-bold text-black/80">
                          Alertas PMT del Sur en vivo
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Instructions / How to get there */}
              <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] space-y-2">
                <div className="flex items-center gap-2 text-xs font-90s text-black uppercase">
                  <Compass className="w-4 h-4 text-[#FF007F]" />
                  <span>Instrucciones de Llegada y Accesos Viales</span>
                </div>
                <p className="text-xs text-black font-medium leading-relaxed">
                  {event.howToGetThere || `Acceso directo por las vías principales de ${event.zona} en ${event.municipio}. Conexión rápida por CA-9 Sur, VAS o Bulevar El Frutal. Sigue las indicaciones de la PMT para parqueos autorizados.`}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Pase Familiar QR */}
          {activeTab === 'ticket' && (
            <div className="space-y-6">
              {!ticketIssued ? (
                <div className="p-6 bg-[#FFFDF0] border-4 border-dashed border-black text-center space-y-4">
                  <div className="w-12 h-12 bg-[#FFE600] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0_#000]">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-90s text-black uppercase">
                      Generar Pase Familiar Gratuito
                    </h3>
                    <p className="text-xs text-black font-bold max-w-sm mx-auto">
                      Obtén tu pase digital para ti y tu familia con acceso directo a {event.title}.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2">
                    <span className="text-xs font-90s text-black uppercase">Integrantes:</span>
                    <div className="flex items-center gap-1.5 bg-white border-2 border-black p-1 shadow-[2px_2px_0_#000]">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setTicketCount(num)}
                          className={`w-7 h-7 text-xs font-90s border transition-all cursor-pointer ${
                            ticketCount === num
                              ? 'bg-[#FF007F] text-white border-black'
                              : 'text-black hover:bg-slate-100 border-transparent'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleIssueTicket}
                    className="px-6 py-3 bg-[#FF007F] hover:bg-[#FFE600] hover:text-black text-white font-90s text-xs border-3 border-black shadow-[4px_4px_0_#000] transition-all cursor-pointer"
                  >
                    CONFIRMAR Y EMITIR PASE QR ★
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-[#FFE600] text-black border-4 border-black shadow-[6px_6px_0_#000] space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-black pb-3">
                    <div className="flex items-center gap-2">
                      <DragonRadarLogo size="sm" />
                      <span className="font-90s text-xs uppercase text-black">
                        Pase Oficial Radar Sur · {event.municipio}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black bg-black text-[#FFE600] px-2 py-0.5 border border-white">
                      {ticketCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-90s text-black uppercase leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs font-bold text-black">
                        {event.date} · {event.time}
                      </p>
                      <p className="text-xs font-90s bg-[#00F0FF] px-2 py-0.5 border border-black inline-block mt-1">
                        Válido para {ticketCount} personas ({user.name})
                      </p>
                    </div>

                    <div className="w-18 h-18 bg-white border-2 border-black p-1 shadow-[3px_3px_0_#000] flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-black flex items-center justify-between text-xs font-bold text-black">
                    <span>Presentar al ingreso en {event.locationName}</span>
                    <span className="text-[#FF007F] font-90s">✓ CONFIRMADO</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFFDF0] border-t-3 border-black flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-black">
            <ShieldCheck className="w-4 h-4 text-[#FF007F]" />
            <span>Alianza Intermunicipal: Villa Nueva · Petapa · Villa Canales</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-90s text-black bg-[#CCFF00] hover:bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>GOOGLE MAPS</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-90s text-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
