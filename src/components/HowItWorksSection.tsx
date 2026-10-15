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
  Store
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
      title: 'Detección en tu Zona',
      description: 'Escaneo y catálogo de actividades municipales y exclusivas en las 12 zonas de Villa Nueva.',
      badge: '★ ESCANEO LOCAL',
      cardBg: 'bg-[#FFE600]',
      btnBg: 'bg-white hover:bg-black hover:text-white',
      bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      actionText: 'Ver Eventos',
      action: onExploreEvents,
    },
    {
      number: '02',
      title: 'Google Maps & Waze',
      description: 'Cada ficha cuenta con coordenadas precisas, ruta directa en Waze/Maps y parqueos verificados.',
      badge: '★ RUTA EN VIVO',
      cardBg: 'bg-[#00F0FF]',
      btnBg: 'bg-[#FFE600] hover:bg-black hover:text-white',
      bgImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      actionText: 'Explorar Rutas',
      action: onExploreEvents,
    },
    {
      number: '03',
      title: 'Difusión Social',
      description: 'Flyers automáticos listos para WhatsApp, Instagram Stories y Facebook en 1 clic.',
      badge: '★ VIRALIZA TU ZONA',
      cardBg: 'bg-[#FF007F] text-white',
      btnBg: 'bg-[#FFE600] text-black hover:bg-white',
      bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      actionText: 'Crear Flyers',
      action: onOpenShareModal,
    },
    {
      number: '04',
      title: 'Bazar & Emprendedores',
      description: 'Postula tu negocio o food truck para colocar tu stand en las ferias y bazares de Villa Nueva.',
      badge: '★ ESPACIO COMERCIAL',
      cardBg: 'bg-[#CCFF00]',
      btnBg: 'bg-black text-white hover:bg-[#FF007F]',
      bgImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      actionText: 'Unirse al Bazar',
      action: () => {
        const el = document.getElementById('emprendedores');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section id="como-funciona" className="py-14 sm:py-20 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-3 rotate-[-1deg]">
            <DragonRadarLogo size="sm" />
            <span>GUÍA RÁPIDA · RADAR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
            ¿Cómo Funciona el Radar y Cómo te Conecta?
          </h2>

          <p className="mt-3 text-sm sm:text-base text-black font-medium leading-relaxed bg-[#FFFDF0] p-3 border-2 border-black shadow-[3px_3px_0_#000]">
            <strong>Radar</strong> conecta a los vecinos con actividades reales, coordinadas con la PMT para acceso vial y con enlaces directos para no perderte ningún festival.
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
                  <h3 className="text-lg font-90s leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                    {step.description}
                  </p>
                </div>

                <button
                  onClick={step.action}
                  className={`w-full py-2 px-3 text-xs font-90s border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${step.btnBg}`}
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment Strip in 90s Danger / Caution Pattern */}
        <div className="mt-10 p-5 sm:p-6 bg-[#FFE600] border-4 border-black shadow-[6px_6px_0_#000] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-90s text-black">
              <Zap className="w-4 h-4 text-[#FF007F]" />
              <span>GARANTÍA 100% VILLA NUEVA · COORDENADAS PMT</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-90s text-black uppercase">
              Rutas Exactas a Google Maps y Waze
            </h4>
            <p className="text-xs sm:text-sm text-black font-medium">
              Todo evento cuenta con botón directo de navegación y datos de estacionamiento verificado.
            </p>
          </div>

          <button
            onClick={onExploreEvents}
            className="px-6 py-3 bg-[#FF007F] hover:bg-black text-white font-90s text-xs uppercase border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
          >
            VER CATÁLOGO HOY ★
          </button>
        </div>

      </div>
    </section>
  );
};
