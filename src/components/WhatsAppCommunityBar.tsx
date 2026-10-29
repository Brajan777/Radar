import React, { useState } from 'react';
import { MessageCircle, Bell, ArrowRight, X, Sparkles, Flame, Check } from 'lucide-react';

interface WhatsAppCommunityBarProps {
  channelUrl?: string;
  onDismiss?: () => void;
}

export const WhatsAppCommunityBar: React.FC<WhatsAppCommunityBarProps> = ({
  channelUrl = 'https://chat.whatsapp.com/invite/radar-sur-guatemala',
  onDismiss
}) => {
  const [copied, setCopied] = useState(false);

  // WhatsApp click-to-chat with pre-filled message if they don't have direct channel link yet
  const defaultWhatsAppUrl = `https://wa.me/50215310000?text=${encodeURIComponent(
    '¡Hola Radar Sur! Quiero unirme a la lista VIP de WhatsApp para recibir los planes, eventos y cupones de comida de Villa Nueva, Petapa y Villa Canales los fines de semana.'
  )}`;

  const finalUrl = channelUrl.includes('radar-sur-guatemala') ? defaultWhatsAppUrl : channelUrl;

  const handleShareLink = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-[#FFE600] border-b-4 border-black p-3 sm:p-4 text-black shadow-[0_4px_0_#000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Headline & Badge */}
        <div className="flex items-center gap-3 text-left w-full md:w-auto">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#25D366] text-black border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-black fill-black/10" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-black text-[#FFE600] px-2 py-0.5 text-[10px] font-90s uppercase tracking-wider">
                ★ CANAL VIP WHATSAPP
              </span>
              <span className="text-[10px] font-bold text-black flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#FF007F]" />
                +2,400 vecinos suscritos en el Sur
              </span>
            </div>
            <h4 className="font-90s text-xs sm:text-sm text-black uppercase leading-tight mt-0.5">
              ¿Qué hacer el finde? Recibe la agenda cada viernes en tu WhatsApp
            </h4>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleShareLink}
            className="flex-1 md:flex-initial px-4 py-2 bg-[#25D366] hover:bg-black hover:text-[#25D366] text-black font-90s text-xs border-2 border-black shadow-[3px_3px_0_#000] hover-lift transition-bounce flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>UNIRME GRATIS POR WHATSAPP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 bg-white hover:bg-slate-200 text-black border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              title="Ocultar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export const FloatingWhatsAppButton: React.FC = () => {
  const defaultWhatsAppUrl = `https://wa.me/50215310000?text=${encodeURIComponent(
    '¡Hola Radar Sur! Deseo recibir los mejores planes de fin de semana y cupones de comida en Villa Nueva, San Miguel Petapa y Villa Canales.'
  )}`;

  return (
    <a
      href={defaultWhatsAppUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-4 sm:right-6 z-40 bg-[#25D366] hover:bg-[#1ebd5a] text-black font-90s border-3 border-black shadow-[4px_4px_0_#000] px-3.5 py-2.5 flex items-center gap-2 text-xs transition-transform hover:-translate-y-1 active:translate-y-0 group cursor-pointer"
      title="Unirse al canal de WhatsApp de Planes del Finde"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFE600] border border-black"></span>
      </span>
      <MessageCircle className="w-4 h-4 text-black" />
      <span className="hidden sm:inline">PLANES DEL FINDE</span>
      <span className="bg-black text-[#FFE600] px-1.5 py-0.2 text-[10px] ml-0.5">VIP</span>
    </a>
  );
};
