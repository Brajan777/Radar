import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Radio, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  CheckCircle2, 
  Navigation, 
  ExternalLink,
  Store,
  Flame,
  Zap,
  Star
} from 'lucide-react';
import { VillaNuevaZona, MunicipioSur } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMunicipio: string;
  onMunicipioChange: (m: string) => void;
  selectedZona: string;
  onZonaChange: (z: string) => void;
  quickFilter: string;
  onQuickFilterChange: (q: string) => void;
  onOpenMap?: () => void;
  onOpenCalendar: () => void;
  onOpenPropose?: () => void;
  onOpenShareModal?: () => void;
  onScrollToExplanation: () => void;
  onScrollToEvents: () => void;
  onScrollToSocial: () => void;
  userCoords: { lat: number; lng: number };
  isGeoActive: boolean;
  totalEventsCount: number;
}

export const ZONAS_BY_MUNICIPIO: Record<MunicipioSur, string[]> = {
  'Villa Nueva': [
    'Zona 1 - Centro Histórico',
    'Zona 2 - Linda Vista',
    'Zona 3 - Ciudad del Sol',
    'Zona 4 - Santa Clara',
    'Zona 5 - El Frutal',
    'Zona 6 - Mártires del Pueblo',
    'Zona 10 - Ciudad Real',
    'Zona 12 - San José Villa Nueva',
    'Bárcena & Naciones Unidas',
  ],
  'San Miguel Petapa': [
    'Petapa - Centro & Plaza Mayor',
    'Petapa - Villa Hermosa I y II',
    'Petapa - Los Álamos & El Frutal',
    'Petapa - Prados de Villa Hermosa',
    'Petapa - Santa Inés Petapa',
    'Petapa - Ribera del Lago',
  ],
  'Villa Canales': [
    'Villa Canales - Centro & Plaza',
    'Villa Canales - Boca del Monte',
    'Villa Canales - Santa Elena Barillas',
    'Villa Canales - El Jocotillo',
    'Villa Canales - Colmenas & Chichimecas',
  ]
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedMunicipio,
  onMunicipioChange,
  selectedZona,
  onZonaChange,
  quickFilter,
  onQuickFilterChange,
  onOpenCalendar,
  onOpenPropose,
  onScrollToEvents,
  totalEventsCount,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const heroPhotos = [
    {
      title: 'Festival del Chuchito y Sabor',
      subtitle: 'Plaza Central de Villa Nueva · Gastronomía tradicional',
      municipio: 'Villa Nueva',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      tag: 'Alcaldía Villa Nueva',
      badgeColor: 'bg-[#FFE600] text-black',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5262,-90.5878'
    },
    {
      title: 'Festival del Mango y Tradición Petapa',
      subtitle: 'Parque Central de San Miguel Petapa · Artesanías y Dulces',
      municipio: 'San Miguel Petapa',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1200&q=85',
      tag: 'Alcaldía San Miguel Petapa',
      badgeColor: 'bg-[#00F0FF] text-black',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5028,-90.5611'
    },
    {
      title: 'Gran Feria de la Piña Canaleña',
      subtitle: 'Plaza Mayor de Villa Canales · Tradición y Postres',
      municipio: 'Villa Canales',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      tag: 'Alcaldía Villa Canales',
      badgeColor: 'bg-[#CCFF00] text-black',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.4828,-90.5333'
    },
    {
      title: 'Gran Bicitour y Circuito Intermunicipal',
      subtitle: 'Conexión El Frutal · Villa Nueva · Petapa · Villa Canales',
      municipio: 'Intermunicipal',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85',
      tag: '★ Exclusivo Radar Sur',
      badgeColor: 'bg-[#FF007F] text-white',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5110,-90.5650'
    },
  ];

  return (
    <div id="inicio" className="relative overflow-hidden bg-[#FFFDF0] bg-grid-90s pt-8 pb-14 sm:pb-20 border-b-4 border-black">
      {/* 90s Retro Background Accents */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-[#FFE600] rounded-full border-4 border-black -z-0 opacity-40 blur-sm pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#FF007F] border-4 border-black -z-0 opacity-30 rotate-12 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#00F0FF] rounded-full border-3 border-black -z-0 opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Main 90s Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Narrative for the 3 Municipalities */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge Row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black rotate-[-1deg]">
                <DragonRadarLogo size="sm" />
                <span>RADAR SUR</span>
              </div>
              <span className="px-2.5 py-1 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s rotate-[1deg] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 3 MUNICIPIOS UNIDOS
              </span>
              <span className="px-2.5 py-1 bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0_#000] text-xs font-black">
                VN · PETAPA · CANALES
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-90s text-black leading-[1.08] tracking-tight uppercase">
              ¡Detección Total de Eventos en{' '}
              <span className="bg-[#FFE600] px-2 border-3 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] inline-block mt-1">
                El Sur
              </span>!
            </h1>

            {/* Clear Explanation */}
            <div className="p-3.5 sm:p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] space-y-2">
              <p className="text-xs sm:text-base text-black font-medium leading-relaxed">
                Plataforma cívica y comercial que une la agenda de las alcaldías de <strong className="bg-[#FFE600] px-1 border border-black">Villa Nueva</strong>, <strong className="bg-[#00F0FF] px-1 border border-black">San Miguel Petapa</strong> y <strong className="bg-[#CCFF00] px-1 border border-black">Villa Canales</strong>, junto a <strong className="bg-[#FF007F] text-white px-1 border border-black">eventos y bazares de Radar Sur</strong>.
              </p>
              <p className="text-[11px] sm:text-sm text-black/80 font-bold flex items-center gap-2 pt-1 border-t-2 border-black/10">
                <span className="text-[#FF007F]">★</span> Rutas directas con Google Maps y Waze, cupones QR para emprendedores y operativos viales coordinados.
              </p>
            </div>

            {/* Action Buttons: Only 2 Primary Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onScrollToEvents}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-90s text-black bg-[#FFE600] hover:bg-[#FF007F] hover:text-white border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover-lift transition-bounce flex items-center justify-center gap-2 cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse text-[#FF007F]" />
                <span>DESCUBRIR PLANES DEL SUR</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenCalendar}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-90s text-black bg-[#CCFF00] hover:bg-[#FFE600] border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover-lift transition-bounce flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>CALENDARIO</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-black">
              <span className="bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <span>3 Municipios Aliados</span>
              </span>
              <span className="bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF007F]" />
                <span>{totalEventsCount}+ Eventos Activos</span>
              </span>
              <span className="bg-[#CCFF00] px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>100% Familiar & Seguro</span>
              </span>
            </div>
          </div>

          {/* Right Column: Visual Photo Card with 90s Retro Cassette / TV Frame */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-none border-4 border-black bg-white p-2 shadow-[8px_8px_0_#000]">
              
              {/* Retro TV Header Bar */}
              <div className="bg-[#FFE600] border-2 border-black px-3 py-1.5 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF007F] border border-black" />
                  <span className="w-3 h-3 rounded-full bg-[#00F0FF] border border-black" />
                  <span className="w-3 h-3 rounded-full bg-[#CCFF00] border border-black" />
                  <span className="text-[11px] font-90s text-black uppercase tracking-wider ml-1">
                    SEÑAL RADAR SUR
                  </span>
                </div>
                <span className="text-[10px] font-mono font-black bg-black text-[#FFE600] px-1.5 py-0.5">
                  LIVE 2026
                </span>
              </div>

              {/* Photo Area */}
              <div className="relative aspect-[4/3] overflow-hidden border-2 border-black bg-black">
                <img 
                  src={heroPhotos[activePhotoIdx].image} 
                  alt={heroPhotos[activePhotoIdx].title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                {/* Tag Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-1 text-[11px] font-90s uppercase border-2 border-black shadow-[3px_3px_0_#000] ${heroPhotos[activePhotoIdx].badgeColor}`}>
                    {heroPhotos[activePhotoIdx].tag}
                  </span>
                  <span className="px-2 py-1 text-[10px] font-90s uppercase bg-black text-[#FFE600] border border-white shadow-[2px_2px_0_#000]">
                    {heroPhotos[activePhotoIdx].municipio}
                  </span>
                </div>

                {/* Google Maps Button */}
                <a
                  href={heroPhotos[activePhotoIdx].mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#FFE600] hover:bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s flex items-center gap-1 transition-all"
                  title="Abrir ubicación en Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FF007F]" />
                  <span>MAPS</span>
                </a>

                {/* Photo Caption */}
                <div className="absolute bottom-3 inset-x-3 z-10 text-white">
                  <h3 className="text-base sm:text-lg font-90s text-[#FFE600] drop-shadow-[2px_2px_0_#000] leading-tight">
                    {heroPhotos[activePhotoIdx].title}
                  </h3>
                  <p className="text-xs text-white font-bold drop-shadow-[1px_1px_0_#000] mt-0.5">
                    {heroPhotos[activePhotoIdx].subtitle}
                  </p>
                </div>
              </div>

              {/* Thumbnail Selector buttons */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {heroPhotos.map((photo, idx) => {
                  const isActive = idx === activePhotoIdx;
                  return (
                    <button
                      key={photo.title}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative aspect-[4/3] border-2 transition-all cursor-pointer ${
                        isActive 
                          ? 'border-black ring-2 ring-[#FF007F] shadow-[3px_3px_0_#000]' 
                          : 'border-black/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={photo.image} 
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
