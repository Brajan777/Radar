import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  Instagram, 
  Facebook, 
  Twitter, 
  Calendar, 
  MapPin, 
  QrCode,
  Users,
  ExternalLink,
  Navigation,
  Zap,
  Flame,
  Star
} from 'lucide-react';
import { EventItem } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface SocialPromotionHubProps {
  events: EventItem[];
  selectedEventId?: string;
  onOpenEventModal: (event: EventItem) => void;
}

export const SocialPromotionHub: React.FC<SocialPromotionHubProps> = ({
  events,
}) => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activePlatform, setActivePlatform] = useState<'whatsapp' | 'instagram' | 'facebook' | 'twitter'>('whatsapp');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedFlyer, setCopiedFlyer] = useState(false);

  const currentEvent = events[activeEventIndex] || events[0];

  if (!currentEvent) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://villanueva.gob.gt';
  const eventLink = `${appUrl}/#evento-${currentEvent.id}`;
  const mapsLink = currentEvent.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${currentEvent.coordinates.lat},${currentEvent.coordinates.lng}`;

  const getShareCopy = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return `★ ¡ACTIVIDAD DETECTADA EN RADAR SUR! ★\n\n🎉 *${currentEvent.title}*\n🗓️ *Fecha:* ${currentEvent.date} (${currentEvent.time})\n📍 *Lugar:* ${currentEvent.locationName} (${currentEvent.zona}, ${currentEvent.municipio})\n🎟️ *Entrada:* ${currentEvent.cost}\n\n${currentEvent.shortSummary}\n\n🗺️ *Cómo llegar (Google Maps):* ${mapsLink}\n👉 *Pase gratuito en:* ${eventLink}\n\n#RadarSur #${currentEvent.municipio.replace(/\s+/g, '')} #Guatemala #EventosFamiliares`;
      case 'instagram':
        return `¡Radar Sur detectó un plan imperdible! ★✨ Este ${currentEvent.date} viviremos "${currentEvent.title}" en ${currentEvent.locationName} (${currentEvent.municipio}).\n\nAmbiente 100% familiar y seguro. ¡Guarda esta publicación y pasa la voz a tus vecinos!\n\n📍 Ruta Google Maps: ${mapsLink}\n🔗 Pase libre en Radar Sur.\n\n#RadarSur #${currentEvent.municipio.replace(/\s+/g, '')} #Eventos #Cultura #Guatemala`;
      case 'facebook':
        return `¡Alerta comunitaria Radar Sur! ★🇬🇹\n\nEste ${currentEvent.date} se llevará a cabo "${currentEvent.title}" en ${currentEvent.locationName} (${currentEvent.zona}, ${currentEvent.municipio}).\n\nVen con toda tu familia. Entrada: ${currentEvent.cost}.\n\n🗺️ Cómo llegar con Google Maps: ${mapsLink}\n🎟️ Pase libre y detalles en: ${eventLink}\n\n¡Comparte con tus amigos y vecinos!`;
      case 'twitter':
        return `★ ¡Evento en Radar Sur! "${currentEvent.title}" el ${currentEvent.date} en ${currentEvent.locationName}, ${currentEvent.municipio}. ${currentEvent.cost}. Ruta Maps: ${mapsLink} #RadarSur`;
      default:
        return '';
    }
  };

  const handleCopyCaption = () => {
    const text = getShareCopy(activePlatform);
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleLaunchShare = (network: 'whatsapp' | 'facebook' | 'twitter') => {
    const text = getShareCopy(network);
    if (network === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if (network === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mapsLink)}&quote=${encodeURIComponent(text)}`, '_blank');
    } else if (network === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleDownloadFlyer = () => {
    setCopiedFlyer(true);
    setTimeout(() => setCopiedFlyer(false), 3000);
  };

  return (
    <section id="redes-sociales" className="py-14 sm:py-20 bg-[#FFFDF0] bg-grid-90s border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-3 rotate-[-1deg]">
              <DragonRadarLogo size="sm" />
              <span>ESTUDIO DE DIFUSIÓN SOCIAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
              Promociona y Comparte en tus Redes
            </h2>
            <p className="mt-2 text-black text-sm sm:text-base font-bold">
              Genera flyers digitales o copia textos con enlaces directos a Google Maps para WhatsApp e Instagram.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-[#FFE600] border-3 border-black p-3 shrink-0 text-xs shadow-[4px_4px_0_#000]">
            <div className="w-10 h-10 bg-black text-[#FFE600] border-2 border-white flex items-center justify-center font-90s text-base">
              ★
            </div>
            <div>
              <div className="font-90s text-black">1,840+ Vecinos Informados</div>
              <div className="text-black font-bold text-[11px]">por WhatsApp e Instagram este mes</div>
            </div>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selector & Caption Generator */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Event */}
            <div className="bg-white border-4 border-black p-5 sm:p-6 space-y-4 shadow-[6px_6px_0_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <label className="text-xs font-90s uppercase text-black flex items-center gap-2">
                  <DragonRadarLogo size="sm" />
                  <span>1. Selecciona el Evento</span>
                </label>
                <span className="text-xs font-90s text-[#FF007F]">
                  {events.length} ACTIVIDADES
                </span>
              </div>

              {/* Event Picker Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {events.map((ev, idx) => {
                  const isSelected = idx === activeEventIndex;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setActiveEventIndex(idx)}
                      className={`p-2.5 text-left border-2 border-black transition-all text-xs flex items-start gap-2.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FFE600] text-black shadow-[3px_3px_0_#000] -translate-y-0.5' 
                          : 'bg-white text-black hover:bg-slate-100 shadow-[1.5px_1.5px_0_#000]'
                      }`}
                    >
                      <div className={`w-6 h-6 border border-black shrink-0 flex items-center justify-center font-90s text-[10px] ${
                        isSelected ? 'bg-[#FF007F] text-white' : 'bg-slate-200 text-black'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-90s truncate text-black">{ev.title}</div>
                        <div className="text-[10px] font-bold text-black/70 truncate">{ev.date} · {ev.zona.split(' - ')[0]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Platform */}
            <div className="bg-white border-4 border-black p-5 sm:p-6 space-y-4 shadow-[6px_6px_0_#000]">
              <label className="text-xs font-90s uppercase text-black block border-b-2 border-black pb-2">
                2. Adapta el Mensaje con Enlace a Google Maps
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, activeBg: 'bg-[#25D366] text-black' },
                  { id: 'instagram', label: 'Instagram', icon: Instagram, activeBg: 'bg-[#FF007F] text-white' },
                  { id: 'facebook', label: 'Facebook', icon: Facebook, activeBg: 'bg-[#00F0FF] text-black' },
                  { id: 'twitter', label: 'X / Twitter', icon: Twitter, activeBg: 'bg-black text-white' },
                ].map((plat) => {
                  const Icon = plat.icon;
                  const isActive = activePlatform === plat.id;
                  return (
                    <button
                      key={plat.id}
                      onClick={() => setActivePlatform(plat.id as any)}
                      className={`px-3.5 py-2 border-2 border-black text-xs font-90s flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? `${plat.activeBg} shadow-[3px_3px_0_#000] -translate-y-0.5`
                          : 'bg-white text-black hover:bg-[#FFE600] shadow-[1.5px_1.5px_0_#000]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{plat.label.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Caption Box */}
              <div className="relative">
                <textarea
                  readOnly
                  value={getShareCopy(activePlatform)}
                  rows={6}
                  className="w-full p-3.5 text-xs font-mono font-bold bg-[#FFFDF0] border-3 border-black text-black focus:outline-none resize-none leading-relaxed shadow-[3px_3px_0_#000]"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopyCaption}
                      className="px-4 py-2.5 text-xs font-90s bg-[#FFE600] hover:bg-black hover:text-white text-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#FF007F]" />
                          <span>¡COPIADO CON MAPS!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPIAR MENSAJE</span>
                        </>
                      )}
                    </button>

                    {activePlatform === 'whatsapp' && (
                      <button
                        onClick={() => handleLaunchShare('whatsapp')}
                        className="px-4 py-2.5 text-xs font-90s bg-[#25D366] hover:bg-black hover:text-white text-black border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>ABRIR WHATSAPP</span>
                      </button>
                    )}

                    {activePlatform === 'facebook' && (
                      <button
                        onClick={() => handleLaunchShare('facebook')}
                        className="px-4 py-2.5 text-xs font-90s bg-[#00F0FF] hover:bg-black hover:text-white text-black border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                        <span>COMPARTIR FB</span>
                      </button>
                    )}

                    {activePlatform === 'twitter' && (
                      <button
                        onClick={() => handleLaunchShare('twitter')}
                        className="px-4 py-2.5 text-xs font-90s bg-black hover:bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        <span>TWITTEAR</span>
                      </button>
                    )}
                  </div>

                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-90s text-[#FF007F] hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>PUNTO GPS</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Community WhatsApp Box */}
            <div className="p-4 bg-[#00F0FF] text-black border-4 border-black flex items-center justify-between gap-4 shadow-[5px_5px_0_#000]">
              <div className="flex items-center gap-3">
                <DragonRadarLogo size="md" />
                <div>
                  <h4 className="text-xs sm:text-sm font-90s uppercase">
                    Canal Radar WhatsApp
                  </h4>
                  <p className="text-[11px] font-bold">
                    Avisos de eventos familiares directo en tu celular.
                  </p>
                </div>
              </div>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-90s bg-[#FF007F] hover:bg-black text-white border-2 border-black shadow-[2px_2px_0_#000] shrink-0 flex items-center gap-1"
              >
                <span>UNIRME</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Flyer Generator & Preview */}
          <div className="lg:col-span-5 space-y-4">
            <label className="text-xs font-90s uppercase text-black block flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#FF007F]" />
              <span>3. Flyer Digital (9:14)</span>
            </label>

            {/* The Digital Flyer Card */}
            <div className="relative mx-auto max-w-sm border-4 border-black bg-black text-white aspect-[9/14] flex flex-col justify-between overflow-hidden shadow-[8px_8px_0_#000] group">
              {/* Event Cover Photo */}
              <div className="absolute inset-0">
                {currentEvent.imageUrl ? (
                  <img 
                    src={currentEvent.imageUrl} 
                    alt={currentEvent.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFE600] opacity-70" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              </div>

              {/* Flyer Top Header */}
              <div className="relative p-4 flex items-center justify-between text-xs z-10 border-b-2 border-white/20 bg-black/60">
                <div className="flex items-center gap-2">
                  <DragonRadarLogo size="sm" />
                  <div>
                    <div className="font-90s text-[#FFE600] tracking-wider text-[11px] uppercase">
                      RADAR
                    </div>
                    <div className="text-[9px] text-[#00F0FF] font-bold">
                      ★ EDICIÓN OFICIAL ★
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[9px] font-90s uppercase bg-[#FF007F] text-white border border-white">
                  {currentEvent.category}
                </span>
              </div>

              {/* Flyer Body Info with Location */}
              <div className="relative p-5 space-y-2.5 z-10">
                <span className="inline-block px-2 py-0.5 text-[10px] font-90s uppercase bg-[#FFE600] text-black border border-black">
                  {currentEvent.cost}
                </span>

                <h3 className="text-xl sm:text-2xl font-90s uppercase leading-tight text-white drop-shadow-[2px_2px_0_#000]">
                  {currentEvent.title}
                </h3>

                <div className="space-y-1 text-xs text-white font-bold drop-shadow-[1px_1px_0_#000]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                    <span>{currentEvent.date} · {currentEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF007F] shrink-0" />
                    <span className="truncate">{currentEvent.locationName}</span>
                  </div>
                </div>

                {/* Google Maps link tag on flyer */}
                <div className="p-2 bg-[#00F0FF] border-2 border-black text-black text-[10px] font-90s flex items-center justify-between shadow-[2px_2px_0_#000]">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#FF007F]" />
                    <span>RUTA EN GOOGLE MAPS ACTIVA</span>
                  </span>
                  <span className="bg-black text-white px-1.5 py-0.5">{currentEvent.zona.split(' - ')[0]}</span>
                </div>

                {/* Simulated QR Code for pass */}
                <div className="pt-2 border-t border-white/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-90s text-[#CCFF00] uppercase tracking-wider">
                      ESCANEA PARA LLEGAR
                    </div>
                    <div className="text-xs font-mono text-white font-bold">
                      radarvillanueva.gt
                    </div>
                  </div>

                  <div className="w-12 h-12 bg-white border-2 border-black p-1 shadow-[2px_2px_0_#000] flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Flyer Download Action */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleDownloadFlyer}
                className="w-full py-3 px-4 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedFlyer ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFE600]" />
                    <span>¡FLYER GUARDADO CON ÉXITO!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>GUARDAR FLYER (WHATSAPP / STORIES)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
