import React from 'react';
import { 
  Compass, 
  Share2, 
  Ticket, 
  ArrowRight,
  Navigation,
  Sparkles,
  MapPin,
  CheckCircle2,
  Zap,
  Store,
  QrCode
} from 'lucide-react';
import { DragonRadarLogo } from './DragonRadarLogo';

interface HowItWorksProps {
  onExploreEvents: () => void;
  onOpenMap?: () => void;
  onOpenShareModal: () => void;
  onOpenPropose: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({
  onExploreEvents,
  onOpenShareModal,
}) => {
  const steps = [
    {
      number: '01',
      title: '3 Municipios Unidos',
      description: 'Catálogo unificado de actividades de las alcaldías de Villa Nueva, San Miguel Petapa y Villa Canales, más eventos Radar.',
      badge: '★ ALIANZA SUR',
      cardBg: 'bg-[#FFE600]',
      btnBg: 'bg-white hover:bg-black hover:text-white',
      bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      actionText: 'Ver Eventos',
      action: onExploreEvents,
    },
    {
      number: '02',
      title: 'Google Maps & 3 PMT',
      description: 'Coordenadas GPS exactas, rutas en Waze/Maps e información de parqueos y cierres viales de las 3 Policías Municipales.',
      badge: '★ RUTAS & TRÁFICO',
      cardBg: 'bg-[#00F0FF]',
      btnBg: 'bg-[#FFE600] hover:bg-black hover:text-white',
      bgImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      actionText: 'Explorar Rutas',
      action: onExploreEvents,
    },
    {
      number: '03',
      title: 'Cupones con Código QR',
      description: 'Descuentos exclusivos (15% a 25%) para canjear en restaurantes, food trucks y tiendas del Sur con código QR en tu celular.',
      badge: '★ DESCUENTOS EN VIVO',
      cardBg: 'bg-[#CCFF00]',
      btnBg: 'bg-black text-white hover:bg-[#FF007F]',
      bgImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      actionText: 'Canjear Cupones',
      action: () => {
        const el = document.getElementById('emprendedores');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      number: '04',
      title: 'Difusión Comunitaria',
      description: 'Genera flyers automáticos y mensajes listos para compartir con tus vecinos en grupos de WhatsApp e Instagram.',
      badge: '★ PASA LA VOZ',
      cardBg: 'bg-[#FF007F] text-white',
      btnBg: 'bg-[#FFE600] text-black hover:bg-white',
      bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      actionText: 'Crear Flyers',
      action: onOpenShareModal,
    },
  ];

  return (
    <section id="como-funciona" className="py-14 sm:py-20 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-3 rotate-[-1deg]">
            <DragonRadarLogo size="sm" />
            <span>GUÍA RÁPIDA · RADAR SUR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
            ¿Cómo Funciona Radar Sur y Cómo te Conecta?
          </h2>

          <p className="mt-3 text-sm sm:text-base text-black font-medium leading-relaxed bg-[#FFFDF0] p-3 border-2 border-black shadow-[3px_3px_0_#000]">
            <strong>Radar Sur</strong> unifica la agenda de <strong>Villa Nueva</strong>, <strong>San Miguel Petapa</strong> y <strong>Villa Canales</strong> en un solo portal cívico e interactivo para fortalecer la convivencia vecinal y el comercio de barrio.
          </p>
        </div>

        {/* 4 Cards Grid with 90s Block Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`border-3 border-black shadow-[6px_6px_0_#000] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] overflow-hidden ${step.cardBg}`}
            >
              {/* Photo Header */}
              <div className="relative h-40 overflow-hidden border-b-3 border-black bg-black">
                <img 
                  src={step.bgImage} 
                  alt={step.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                
                {/* Step Number Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="w-8 h-8 bg-black text-[#FFE600] font-90s text-sm border-2 border-white flex items-center justify-center shadow-[2px_2px_0_#000]">
                    {step.number}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[10px] font-90s px-2 py-0.5 bg-black text-white border border-white shadow-[2px_2px_0_#000]">
                    {step.badge}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-90s uppercase leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold leading-relaxed opacity-90">
                    {step.description}
                  </p>
                </div>

                <button
                  onClick={step.action}
                  className={`w-full py-2.5 px-3 text-xs font-90s border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${step.btnBg}`}
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
