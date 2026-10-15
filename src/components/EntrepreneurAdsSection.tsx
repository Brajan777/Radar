import React, { useState } from 'react';
import { 
  Store, 
  Sparkles, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Send, 
  Check, 
  Filter, 
  Tag, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight, 
  Award,
  AlertCircle,
  Zap,
  Flame,
  Star
} from 'lucide-react';
import { EntrepreneurAd, EntrepreneurCategory, AdSpaceType, VillaNuevaZona, EventItem } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface EntrepreneurAdsSectionProps {
  ads: EntrepreneurAd[];
  events: EventItem[];
  onSubmitAd: (newAd: EntrepreneurAd) => void;
  onSelectEvent?: (event: EventItem) => void;
}

const CATEGORIES: { label: string; value: EntrepreneurCategory | 'all' }[] = [
  { label: 'Todos los Emprendimientos', value: 'all' },
  { label: 'Gastronomía & Food Trucks', value: 'Gastronomía & Food Trucks' },
  { label: 'Café & Repostería', value: 'Café, Repostería & Postres' },
  { label: 'Artesanías & Manualidades', value: 'Artesanías & Hecho a Mano' },
  { label: 'Moda, Ropa & Calzado', value: 'Moda, Ropa & Calzado' },
  { label: 'Patrocinadores Oficiales', value: 'Patrocinador Oficial de Evento' },
  { label: 'Servicios & Profesionales', value: 'Servicios Locales & Profesionales' },
];

const SPACE_TYPES: AdSpaceType[] = [
  'Stand Comercial en Feria / Bazar',
  'Espacio Food Truck / Remolque',
  'Patrocinio Oficial de Evento (Lonas & Escenario)',
  'Degustación & Muestreo de Producto',
  'Anuncio Digital en Radar Villa Nueva'
];

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

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Food Truck & Hamburguesas',
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cafetería & Panadería',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Artesanías & Recuerdos',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Paletas & Postres Helados',
    url: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Moda & Ropa Urbana',
    url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Tecnología & Sonido',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
  }
];

export const EntrepreneurAdsSection: React.FC<EntrepreneurAdsSectionProps> = ({
  ads,
  events,
  onSubmitAd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EntrepreneurCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'directory' | 'form'>('directory');

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState<EntrepreneurCategory>('Gastronomía & Food Trucks');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [zona, setZona] = useState<VillaNuevaZona>('Zona 1 - Centro Histórico');
  const [spaceType, setSpaceType] = useState<AdSpaceType>('Stand Comercial en Feria / Bazar');
  const [targetEventId, setTargetEventId] = useState<string>('todos');
  const [productDescription, setProductDescription] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [budget, setBudget] = useState('Q350');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  // Submitted ticket
  const [lastSubmittedAd, setLastSubmittedAd] = useState<EntrepreneurAd | null>(null);

  // Filtered ads
  const filteredAds = ads.filter((ad) => {
    if (selectedCategory === 'all') return true;
    return ad.category === selectedCategory;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim() || !productDescription.trim()) return;

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : imageUrl;
    const selectedEvent = events.find((ev) => ev.id === targetEventId);

    const newAd: EntrepreneurAd = {
      id: `ad-vn-${Date.now().toString().slice(-5)}`,
      businessName: businessName.trim(),
      ownerName: ownerName.trim() || 'Emprendedor Villanovano',
      category,
      phone: phone.trim(),
      email: email.trim() || 'contacto@emprendimiento.gt',
      instagramUrl: instagramUrl.trim() || undefined,
      spaceType,
      targetEventId: targetEventId !== 'todos' ? targetEventId : undefined,
      targetEventTitle: selectedEvent ? selectedEvent.title : 'Todos los eventos en mi zona',
      zona,
      productDescription: productDescription.trim(),
      imageUrl: finalImage,
      specialOffer: specialOffer.trim() || undefined,
      status: 'en_revision',
      createdAt: new Date().toISOString().split('T')[0],
      budget: budget.trim() || undefined,
      verifiedBadge: false
    };

    onSubmitAd(newAd);
    setLastSubmittedAd(newAd);

    // Reset fields
    setBusinessName('');
    setOwnerName('');
    setPhone('');
    setEmail('');
    setProductDescription('');
    setSpecialOffer('');
    setCustomImageUrl('');
    setInstagramUrl('');
  };

  const generateWhatsAppInquiryUrl = (ad: EntrepreneurAd) => {
    const text = encodeURIComponent(
      `¡Hola ${ad.businessName}! Vi su anuncio en Radar y me interesan sus productos. ¿Podrían brindarme información?`
    );
    const cleanPhone = ad.phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone.length === 8 ? '502' + cleanPhone : cleanPhone}?text=${text}`;
  };

  const generateSubmitWhatsAppConfirmation = (ad: EntrepreneurAd) => {
    const text = encodeURIComponent(
      `¡Hola equipo de Radar! Acabo de postular mi emprendimiento:\n\n` +
      `🏷️ Negocio: ${ad.businessName}\n` +
      `👤 Contacto: ${ad.ownerName}\n` +
      `🎪 Espacio Solicitado: ${ad.spaceType}\n` +
      `📍 Zona: ${ad.zona}\n` +
      `🎯 Evento: ${ad.targetEventTitle || 'Todos los eventos'}\n` +
      `📞 Teléfono: ${ad.phone}\n` +
      `🆔 Folio: #${ad.id.toUpperCase()}\n\n` +
      `Deseo coordinar mi stand comercial. ¡Gracias!`
    );
    return `https://wa.me/50254128890?text=${text}`;
  };

  return (
    <section id="emprendedores" className="py-14 sm:py-20 bg-[#FFFDF0] bg-grid-90s border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Billboard Header */}
        <div className="bg-[#FFE600] border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0_#000] relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-2 right-4 text-6xl font-90s opacity-10 select-none pointer-events-none">
            ★ RADAR ADS ★
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s rotate-[-1deg]">
                <DragonRadarLogo size="sm" />
                <span>★ BAZAR & ANUNCIOS · RADAR ★</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-90s text-black uppercase tracking-tight leading-tight">
                Emprendedores & Ads en Villa Nueva
              </h2>

              <p className="text-black text-sm sm:text-base font-medium leading-relaxed bg-white p-3 border-2 border-black shadow-[3px_3px_0_#000]">
                <strong>Radar</strong> es una plataforma privada independiente que conecta a miles de familias con actividades de las 12 zonas. Si tienes un food truck, marca artesanal, cafetería o deseas patrocinar una fecha, ¡postula tu anuncio y asegura tu stand comercial!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-90s text-black">
                <span className="bg-[#00F0FF] px-2.5 py-1 border border-black shadow-[2px_2px_0_#000] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stands & Food Trucks
                </span>
                <span className="bg-[#CCFF00] px-2.5 py-1 border border-black shadow-[2px_2px_0_#000] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Familias Verificadas
                </span>
                <span className="bg-white px-2.5 py-1 border border-black shadow-[2px_2px_0_#000] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enlaces a WhatsApp & Maps
                </span>
              </div>
            </div>

            {/* Quick Toggle Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('form');
                  const formEl = document.getElementById('ad-form-box');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 text-xs sm:text-sm font-90s text-white bg-[#FF007F] hover:bg-black border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>POSTULAR MI NEGOCIO</span>
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                className={`px-6 py-3.5 text-xs sm:text-sm font-90s border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'directory'
                    ? 'bg-white text-black'
                    : 'bg-[#00F0FF] text-black hover:bg-white'
                }`}
              >
                <Store className="w-4 h-4 text-[#FF007F]" />
                <span>DIRECTORIO ({ads.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Banner when user registers an ad */}
        {lastSubmittedAd && (
          <div className="bg-[#CCFF00] border-4 border-black p-6 sm:p-8 text-black shadow-[8px_8px_0_#000]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black text-[#FFE600] border-2 border-white flex items-center justify-center font-90s text-xl shadow-[3px_3px_0_#000] shrink-0">
                  ★
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-90s uppercase text-black">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF007F]" /> ¡SOLICITUD RECIBIDA CON ÉXITO!
                  </div>
                  <h3 className="text-xl sm:text-2xl font-90s text-black uppercase">
                    ¡Gracias, {lastSubmittedAd.ownerName}! Tu negocio está en el Radar.
                  </h3>
                </div>
              </div>

              <div className="px-3.5 py-1.5 bg-white border-2 border-black text-xs font-90s text-black shadow-[2px_2px_0_#000]">
                FOLIO: #{lastSubmittedAd.id.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
                <span className="text-black/60 block font-bold">Negocio:</span>
                <strong className="text-sm font-90s text-black">{lastSubmittedAd.businessName}</strong>
              </div>
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
                <span className="text-black/60 block font-bold">Espacio Solicitado:</span>
                <strong className="text-sm font-90s text-black">{lastSubmittedAd.spaceType}</strong>
              </div>
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
                <span className="text-black/60 block font-bold">Evento:</span>
                <strong className="text-sm font-90s text-black">{lastSubmittedAd.targetEventTitle || 'Todos en mi zona'}</strong>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={generateSubmitWhatsAppConfirmation(lastSubmittedAd)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 text-xs sm:text-sm font-90s text-black bg-[#FFE600] hover:bg-black hover:text-white border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CONFIRMAR POR WHATSAPP AL EQUIPO RADAR</span>
              </a>

              <button
                onClick={() => setLastSubmittedAd(null)}
                className="px-4 py-3 text-xs font-90s text-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                CERRAR AVISO
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher & Category Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
            <div className="flex items-center gap-2 p-1 bg-white border-2 border-black shadow-[3px_3px_0_#000]">
              <button
                onClick={() => setActiveTab('directory')}
                className={`px-4 py-2 text-xs font-90s transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'directory'
                    ? 'bg-[#FFE600] text-black border border-black shadow-[2px_2px_0_#000]'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#FF007F]" />
                <span>VITRINA COMERCIAL ({filteredAds.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 text-xs font-90s transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'form'
                    ? 'bg-[#FF007F] text-white border border-black shadow-[2px_2px_0_#000]'
                    : 'text-black hover:bg-[#FF007F]/20'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>POSTULAR NEGOCIO / AD</span>
              </button>
            </div>

            <div className="text-xs font-bold text-black bg-[#CCFF00] px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
              ★ Espacios disponibles para ferias y bazares en Villa Nueva
            </div>
          </div>

          {/* Category Filter Chips for Directory */}
          {activeTab === 'directory' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-xs font-90s uppercase text-black mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#FF007F]" /> RUBRO:
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1 text-xs font-90s whitespace-nowrap border-2 border-black shadow-[2px_2px_0_#000] shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#00F0FF] text-black'
                        : 'bg-white text-black hover:bg-[#FFE600]'
                    }`}
                  >
                    {cat.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* VIEW 1: DIRECTORY OF ENTREPRENEURS & ADS */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {filteredAds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="neo-card flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Image & Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden border-b-3 border-black bg-black">
                      <img
                        src={ad.imageUrl}
                        alt={ad.businessName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Space Type Badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                        <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0_#000]">
                          {ad.spaceType.split(' ')[0]} {ad.spaceType.split(' ')[1]}
                        </span>
                        {ad.verifiedBadge && (
                          <span className="px-2 py-0.5 text-[10px] font-90s bg-[#CCFF00] text-black border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1">
                            <Award className="w-3 h-3 text-black" /> VERIFICADO
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        {ad.status === 'destacado' && (
                          <span className="px-2 py-0.5 text-[10px] font-90s bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0_#000]">
                            ★ DESTACADO
                          </span>
                        )}
                      </div>

                      {/* Business Name on Photo Overlay */}
                      <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                        <div className="text-[10px] font-90s text-[#00F0FF] uppercase tracking-wider">
                          {ad.category}
                        </div>
                        <h3 className="text-base sm:text-lg font-90s text-[#FFE600] uppercase leading-tight drop-shadow-[2px_2px_0_#000]">
                          {ad.businessName}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-black border-b-2 border-black pb-2">
                          <span>Por {ad.ownerName}</span>
                          <span className="flex items-center gap-1 bg-[#FFFDF0] px-1.5 py-0.5 border border-black">
                            <MapPin className="w-3 h-3 text-[#FF007F]" />
                            {ad.zona.split(' - ')[0]}
                          </span>
                        </div>

                        <p className="text-xs text-black/80 font-medium line-clamp-3 leading-relaxed">
                          {ad.productDescription}
                        </p>

                        {ad.specialOffer && (
                          <div className="p-2 bg-[#FFE600]/40 border-2 border-black text-black text-xs flex items-start gap-1.5 shadow-[2px_2px_0_#000]">
                            <Tag className="w-3.5 h-3.5 text-[#FF007F] shrink-0 mt-0.5" />
                            <span>
                              <strong>Promoción:</strong> {ad.specialOffer}
                            </span>
                          </div>
                        )}

                        {ad.targetEventTitle && (
                          <div className="text-[10px] font-90s text-black bg-[#00F0FF]/30 p-2 border border-black truncate">
                            EN: <strong>{ad.targetEventTitle}</strong>
                          </div>
                        )}
                      </div>

                      {/* Actions: Contact WhatsApp */}
                      <div className="pt-3 border-t-2 border-black flex items-center gap-2">
                        <a
                          href={generateWhatsAppInquiryUrl(ad)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 px-3 bg-[#CCFF00] hover:bg-[#FFE600] text-black text-xs font-90s border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WHATSAPP PEDIDOS</span>
                        </a>

                        {ad.instagramUrl && (
                          <a
                            href={ad.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-black bg-white hover:bg-[#FF007F] hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-colors"
                            title="Ver Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}

                        {ad.facebookUrl && (
                          <a
                            href={ad.facebookUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-black bg-white hover:bg-[#00F0FF] border-2 border-black shadow-[2px_2px_0_#000] transition-colors"
                            title="Ver Facebook"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border-4 border-black max-w-md mx-auto space-y-3 shadow-[6px_6px_0_#000]">
                <Store className="w-10 h-10 text-black mx-auto" />
                <h4 className="text-base font-90s text-black uppercase">
                  No hay anuncios en esta categoría aún
                </h4>
                <p className="text-xs text-black font-medium">
                  ¡Sé el primer emprendedor en anunciar tu marca en esta sección!
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 text-xs font-90s bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000]"
                >
                  POSTULAR AHORA ★
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: REGISTRATION FORM ("POSTULA TU EMPRENDIMIENTO / AD") */}
        {activeTab === 'form' && (
          <div id="ad-form-box" className="bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0_#000] space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-3 border-black">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-90s uppercase tracking-wider text-[#FF007F]">
                  <DragonRadarLogo size="sm" />
                  <span>CONVOCATORIA ABIERTA · 12 ZONAS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-90s text-black uppercase mt-1">
                  Formulario de Postulación de Ads & Stands
                </h3>
                <p className="text-xs sm:text-sm text-black font-medium">
                  Registra tu negocio para participar en ferias gastronómicas y bazares comunitarios.
                </p>
              </div>

              <div className="px-4 py-2 bg-[#FFE600] border-2 border-black text-black text-xs font-90s shadow-[3px_3px_0_#000] shrink-0">
                ★ REVISIÓN EN MENOS DE 24 HORAS
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Nombre del Negocio / Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Tacos El Chapín, Café Los Encinos..."
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Nombre del Propietario / Encargado *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. María Fernanda Morales"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 54128890 o +502 5412-8890"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@miemprendimiento.gt"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Categoría / Rubro *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EntrepreneurCategory)}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Space Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Tipo de Espacio Deseado *
                  </label>
                  <select
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value as AdSpaceType)}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    {SPACE_TYPES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Zona */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Zona de Villa Nueva *
                  </label>
                  <select
                    value={zona}
                    onChange={(e) => setZona(e.target.value as VillaNuevaZona)}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    {ZONAS_LIST.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Event of Interest */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Evento de Interés
                  </label>
                  <select
                    value={targetEventId}
                    onChange={(e) => setTargetEventId(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    <option value="todos">★ Todos los eventos en mi zona</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.sourceType === 'radar' ? '[RADAR]' : '[MUNICIPAL]'} {ev.title} ({ev.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-90s text-black uppercase">
                  Descripción de Productos y Propuesta *
                </label>
                <textarea
                  required
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Detalla qué vendes, si necesitas electricidad 110v o agua, y qué hace especial a tu producto..."
                  className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              {/* Special Offer & Social Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Promo para Usuarios de Radar (Opcional)
                  </label>
                  <input
                    type="text"
                    value={specialOffer}
                    onChange={(e) => setSpecialOffer(e.target.value)}
                    placeholder="Ej. 10% de descuento al mostrar código Radar"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Instagram o Enlace Web (Opcional)
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/tu_marca"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>
              </div>

              {/* Photo Selector for Ad */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-90s text-black uppercase">
                  Foto de Portada de tu Emprendimiento
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => {
                        setImageUrl(preset.url);
                        setCustomImageUrl('');
                      }}
                      className={`relative aspect-[4/3] border-3 text-left transition-all cursor-pointer ${
                        imageUrl === preset.url && !customImageUrl
                          ? 'border-black ring-3 ring-[#FF007F] shadow-[4px_4px_0_#000]'
                          : 'border-black/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 inset-x-1 text-[9px] font-90s text-white bg-black/80 px-1 py-0.5 truncate block">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="O pega aquí una URL directa de tu imagen/logo..."
                    className="w-full px-4 py-2.5 text-xs bg-white border-2 border-black font-bold text-black shadow-[2px_2px_0_#000]"
                  />
                </div>
              </div>

              {/* Submit Buttons Row */}
              <div className="pt-4 border-t-3 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-bold text-black flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#FF007F] shrink-0" />
                  <span>Tu postulación pasará a evaluación técnica de logística Radar.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className="w-full sm:w-auto px-5 py-3 text-xs font-90s text-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
                  >
                    CANCELAR
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-90s text-white bg-[#FF007F] hover:bg-black border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ENVIAR SOLICITUD ★</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
};
