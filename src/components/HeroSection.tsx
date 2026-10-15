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
import { VillaNuevaZona } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedZona: string;
  onZonaChange: (z: string) => void;
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

const ZONAS_LIST: VillaNuevaZona[] = [
  'Zona 1 - Centro Histórico',
  'Zona 2 - Linda Vista',
  'Zona 3 - Ciudad del Sol',
  'Zona 4 - Santa Clara',
  'Zona 5 - El Frutal',
  'Zona 6 - Mártires del Pueblo',
  'Zona 10 - Ciudad Real',
  'Zona 12 - San José Villa Nueva',
  'Bárcena & Naciones Unidas',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedZona,
  onZonaChange,
  onOpenCalendar,
  onOpenPropose,
  onScrollToEvents,
  totalEventsCount,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const heroPhotos = [
    {
      title: 'Festival del Chuchito & Tradición',
      subtitle: 'Plaza Central de Villa Nueva · Gastronomía tradicional',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      tag: 'Evento Municipal Oficial',
      badgeColor: 'bg-[#00F0FF]',
      isRadar: false,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5262,-90.5878'
    },
    {
      title: 'Radar Fest: Food Trucks & Música en Vivo',
      subtitle: 'Explanada El Frutal · Producción Privada Radar',
      image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=1200&q=85',
      tag: 'Evento Exclusivo Radar',
      badgeColor: 'bg-[#FF007F] text-white',
      isRadar: true,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5120,-90.5720'
    },
    {
      title: 'Cine Bajo las Estrellas & Pícnic',
      subtitle: 'Parque Naciones Unidas · Mirador hacia el Lago',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85',
      tag: 'Comunitario & Familiar',
      badgeColor: 'bg-[#FFE600]',
      isRadar: false,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.4842,-90.5985'
    },
    {
      title: 'Bazar Nocturno & Rock Acústico Radar',
      subtitle: 'Terraza Santa Clara · Emprendedores locales',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85',
      tag: 'Evento Exclusivo Radar',
      badgeColor: 'bg-[#CCFF00]',
      isRadar: true,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5380,-90.5725'
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
          
          {/* Left Column: 90s Bold Narrative */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge Row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black rotate-[-1deg]">
                <DragonRadarLogo size="sm" />
                <span>RADAR</span>
              </div>
              <span className="px-2.5 py-1 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s rotate-[2deg] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 100% RADICAL
              </span>
              <span className="px-2 py-1 bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0_#000] text-xs font-bold">
                12 ZONAS
              </span>
            </div>

            {/* Main Headline with 90s Pop Punch */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-90s text-black leading-[1.08] tracking-tight uppercase">
              ¡Detección Total de Eventos en{' '}
              <span className="bg-[#FFE600] px-2 border-3 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] inline-block mt-1">
                Villa Nueva
              </span>!
            </h1>

            {/* Clear Explanation with 90s styling */}
            <div className="p-3.5 sm:p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] space-y-2">
              <p className="text-xs sm:text-base text-black font-medium leading-relaxed">
                Plataforma privada e independiente que escanea y reúne tanto las <strong className="bg-[#00F0FF] px-1 border border-black">actividades municipales oficiales</strong> como los <strong className="bg-[#FF007F] text-white px-1 border border-black">eventos exclusivos organizados por Radar</strong>.
              </p>
              <p className="text-[11px] sm:text-sm text-black/80 font-bold flex items-center gap-2 pt-1 border-t-2 border-black/10">
                <span className="text-[#FF007F]">★</span> Explora fotos reales, abre rutas en Google Maps y Waze, y suma tu emprendimiento al bazar.
              </p>
            </div>

            {/* Action Buttons: 90s Neo-Brutalist Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onScrollToEvents}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-90s text-black bg-[#FFE600] hover:bg-[#FF007F] hover:text-white border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                <span>EXPLORAR EVENTOS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPropose}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-90s text-black bg-[#00F0FF] hover:bg-[#FFE600] border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>PROPONER ACTIVIDAD</span>
              </button>
              <button
                onClick={onOpenCalendar}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-90s text-black bg-[#CCFF00] hover:bg-[#FFE600] border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>CALENDARIO</span>
              </button>

              <a
                href="#emprendedores"
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-90s text-white bg-[#FF007F] hover:bg-[#FFE600] hover:text-black border-3 border-black shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>ADS EMPRENDEDORES</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-black">
              <span className="bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <span>12 Zonas Cubiertas</span>
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
                    CANAL RADAR
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
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                {/* Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 text-[11px] font-90s uppercase border-2 border-black shadow-[3px_3px_0_#000] ${heroPhotos[activePhotoIdx].badgeColor}`}>
                    {heroPhotos[activePhotoIdx].tag}
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

        {/* 90s Neo-Brutalist Search Bar */}
        <div className="mt-10 sm:mt-14 bg-[#FFE600] border-4 border-black p-4 sm:p-5 shadow-[8px_8px_0_#000]">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-[#FF007F] text-white font-90s text-xs border-2 border-black shadow-[2px_2px_0_#000]">
              ★ SCANNER
            </span>
            <span className="text-xs font-black text-black">
              Filtra actividades en segundos por palabra clave o zona
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2 font-black" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar comida, música, feria, deporte o lugar..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border-3 border-black text-black font-bold placeholder-black/50 focus:outline-none focus:bg-[#FFFDF0] shadow-[3px_3px_0_#000]"
              />
            </div>

            {/* Zona Dropdown */}
            <div className="md:col-span-4 relative">
              <MapPin className="w-4 h-4 text-[#FF007F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedZona}
                onChange={(e) => onZonaChange(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-white border-3 border-black text-black font-black appearance-none cursor-pointer shadow-[3px_3px_0_#000] focus:outline-none"
              >
                <option value="all">Todas las Zonas de Villa Nueva</option>
                {ZONAS_LIST.map((zona) => (
                  <option key={zona} value={zona}>
                    {zona}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action buttons */}
            <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2">
              <button
                onClick={onOpenCalendar}
                className="flex-1 md:flex-none px-4 py-2.5 text-xs font-90s text-black bg-[#00F0FF] hover:bg-white border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>CALENDARIO</span>
              </button>

              <a
                href="#emprendedores"
                className="flex-1 md:flex-none px-4 py-2.5 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Store className="w-3.5 h-3.5" />
                <span>UNIRSE</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
