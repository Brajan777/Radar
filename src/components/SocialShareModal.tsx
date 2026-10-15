import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Check, 
  Copy, 
  MessageCircle, 
  Send, 
  Calendar, 
  MapPin, 
  Navigation,
  ExternalLink
} from 'lucide-react';
import { EventItem } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface SocialShareModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const eventUrl = typeof window !== 'undefined' ? window.location.href : 'https://villanueva.gob.gt';
  const mapsUrl = event.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`;

  const shareText = `★ ¡RADAR DETECTÓ ESTA ACTIVIDAD! ★
"${event.title}"
🗓️ Fecha: ${event.date} (${event.time})
📍 Lugar: ${event.locationName}, ${event.zona}
🎟️ Entrada: ${event.cost}

🗺️ Cómo llegar (Google Maps): ${mapsUrl}
👉 Reserva tu pase familiar aquí: ${eventUrl}

#Radar #VillaNueva #Eventos #FamiliaGuate`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mapsUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const tweetText = `★ ¡Radar Villa Nueva! "${event.title}" el ${event.date} en ${event.locationName}. ${event.cost}. Ruta Maps: ${mapsUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopyInviteText = () => {
    navigator.clipboard?.writeText(shareText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden my-6">
        {/* Header in 90s Style */}
        <div className="p-4 sm:p-5 border-b-4 border-black flex items-center justify-between bg-[#FFE600] text-black">
          <div className="flex items-center gap-2.5">
            <DragonRadarLogo size="sm" />
            <div>
              <span className="text-[10px] font-90s tracking-wider uppercase text-[#FF007F] block">
                ★ DIFUSIÓN ★
              </span>
              <h3 className="text-base sm:text-lg font-90s uppercase text-black leading-tight">
                Compartir Actividad & Maps
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:text-white bg-white hover:bg-[#FF007F] border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Preview Card */}
          <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] space-y-3">
            <div className="flex items-start gap-3">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 border-2 border-black object-cover shrink-0"
                />
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <span className="px-2 py-0.5 border border-black text-[10px] font-90s uppercase bg-[#FF007F] text-white">
                  {event.category}
                </span>
                <h4 className="font-90s text-black text-sm uppercase truncate">
                  {event.title}
                </h4>
                <div className="text-[11px] font-bold text-black flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#FF007F]" />
                  <span>{event.date} · {event.time}</span>
                </div>
                <div className="text-[11px] font-bold text-black flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00F0FF]" />
                  <span className="truncate">{event.locationName}</span>
                </div>
              </div>
            </div>

            {/* Google Maps link chip */}
            <div className="p-2.5 bg-[#00F0FF] border-2 border-black flex items-center justify-between text-black font-90s">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF007F] shrink-0" />
                <span className="truncate text-[10px]">ENLACE GPS MAPS INCLUIDO</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-90s bg-white px-2 py-0.5 border border-black hover:bg-[#FFE600] flex items-center gap-1 shrink-0"
              >
                <span>PROBAR</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-90s uppercase text-black block">
              Compartir directamente con un clic:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleShareWhatsApp}
                className="p-3 bg-[#25D366] hover:bg-black hover:text-white text-black font-90s border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP</span>
              </button>

              <button
                onClick={handleShareFacebook}
                className="p-3 bg-[#00F0FF] hover:bg-black hover:text-white text-black font-90s border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>FACEBOOK</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="p-3 bg-black hover:bg-[#FF007F] text-white font-90s border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>X / TWITTER</span>
              </button>

              <button
                onClick={handleShareTelegram}
                className="p-3 bg-[#0088CC] hover:bg-black text-white font-90s border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>TELEGRAM</span>
              </button>
            </div>
          </div>

          {/* Copyable Message Box */}
          <div className="space-y-2 pt-2 border-t-2 border-black">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-90s uppercase text-black">
                Texto para enviar a grupos:
              </span>
              <button
                onClick={handleCopyInviteText}
                className="text-xs font-90s text-[#FF007F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedInvite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInvite ? '¡COPIADO!' : 'COPIAR TEXTO'}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={shareText}
              rows={4}
              className="w-full p-3 font-mono font-bold text-[11px] bg-white border-2 border-black text-black resize-none focus:outline-none shadow-[2px_2px_0_#000]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFE600] border-t-4 border-black flex items-center justify-between">
          <span className="text-[11px] font-90s text-black uppercase">
            Radar · Villa Nueva
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-90s text-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
