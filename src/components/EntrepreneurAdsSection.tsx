import React, { useState, useEffect } from 'react';
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
  Star,
  QrCode,
  Clock,
  Ticket,
  X,
  Copy,
  Database,
  Lock
} from 'lucide-react';
import { EntrepreneurAd, EntrepreneurCategory, AdSpaceType, VillaNuevaZona, MunicipioSur, EventItem } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';
import { ZONAS_BY_MUNICIPIO } from './HeroSection';

interface EntrepreneurAdsSectionProps {
  ads: EntrepreneurAd[];
  events: EventItem[];
  onSubmitAd: (newAd: EntrepreneurAd) => void;
  onSelectEvent?: (event: EventItem) => void;
  onOpenBusinessPortal?: () => void;
}

const CATEGORIES: { label: string; value: EntrepreneurCategory | 'all' }[] = [
  { label: 'Todos los Emprendimientos', value: 'all' },
  { label: 'Gastronomía & Food Trucks', value: 'Gastronomía & Food Trucks' },
  { label: 'Café & Repostería', value: 'Café, Repostería & Postres' },
  { label: 'Artesanías & Hecho a Mano', value: 'Artesanías & Hecho a Mano' },
  { label: 'Moda, Ropa & Calzado', value: 'Moda, Ropa & Calzado' },
  { label: 'Servicios & Profesionales', value: 'Servicios Locales & Profesionales' },
  { label: 'Patrocinadores Oficiales', value: 'Patrocinador Oficial de Evento' },
];

const SPACE_TYPES: AdSpaceType[] = [
  'Stand Comercial en Feria / Bazar',
  'Espacio Food Truck / Remolque',
  'Patrocinio Oficial de Evento (Lonas & Escenario)',
  'Degustación & Muestreo de Producto',
  'Anuncio Digital en Radar Sur'
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
  onOpenBusinessPortal,
}) => {
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<EntrepreneurCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'directory' | 'form'>('directory');

  // Interactive Coupon Modal State
  const [activeCouponAd, setActiveCouponAd] = useState<EntrepreneurAd | null>(null);
  const [couponTimerSeconds, setCouponTimerSeconds] = useState<number>(1200); // 20 minutes countdown
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);

  // Form State
  const [formMunicipio, setFormMunicipio] = useState<MunicipioSur>('Villa Nueva');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState<EntrepreneurCategory>('Gastronomía & Food Trucks');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [couponsStock, setCouponsStock] = useState<number>(20);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [zona, setZona] = useState<VillaNuevaZona>('Zona 1 - Centro Histórico');
  const [spaceType, setSpaceType] = useState<AdSpaceType>('Stand Comercial en Feria / Bazar');
  const [targetEventId, setTargetEventId] = useState<string>('todos');
  const [productDescription, setProductDescription] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [budget, setBudget] = useState('Q350');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  // Submitted ticket
  const [lastSubmittedAd, setLastSubmittedAd] = useState<EntrepreneurAd | null>(null);

  // Countdown timer for coupon urgency
  useEffect(() => {
    if (!activeCouponAd) return;
    setCouponTimerSeconds(1200); // Reset to 20 minutes on open
    const interval = setInterval(() => {
      setCouponTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCouponAd]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtered ads
  const filteredAds = ads.filter((ad) => {
    const matchesMuni = selectedMunicipio === 'all' || ad.municipio === selectedMunicipio;
    const matchesCat = selectedCategory === 'all' || ad.category === selectedCategory;
    return matchesMuni && matchesCat;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim() || !productDescription.trim()) return;

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : imageUrl;
    const selectedEvent = events.find((ev) => ev.id === targetEventId);

    const generatedCode = couponCode.trim() 
      ? couponCode.trim().toUpperCase() 
      : `RADAR-${businessName.trim().substring(0, 4).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;

    const newAd: EntrepreneurAd = {
      id: `ad-sur-${Date.now().toString().slice(-5)}`,
      businessName: businessName.trim(),
      ownerName: ownerName.trim() || 'Emprendedor del Sur',
      category,
      municipio: formMunicipio,
      phone: phone.trim(),
      email: email.trim() || 'contacto@emprendimiento.gt',
      password: password.trim() || 'radar123',
      instagramUrl: instagramUrl.trim() || undefined,
      spaceType,
      targetEventId: targetEventId !== 'todos' ? targetEventId : undefined,
      targetEventTitle: selectedEvent ? selectedEvent.title : 'Todos los eventos en mi municipio',
      zona,
      productDescription: productDescription.trim(),
      imageUrl: finalImage,
      specialOffer: specialOffer.trim() || `${discountPercent}% de descuento presentando cupón de Radar Sur`,
      couponCode: generatedCode,
      discountPercentage: discountPercent || 15,
      couponsLeft: couponsStock || 20,
      totalCouponsIssued: couponsStock || 20,
      couponsRedeemed: 0,
      status: 'en_revision',
      createdAt: new Date().toISOString().split('T')[0],
      budget: budget.trim() || undefined,
      verifiedBadge: false
    };

    onSubmitAd(newAd);
    setLastSubmittedAd(newAd);
    setActiveTab('directory');

    // Reset Form
    setBusinessName('');
    setOwnerName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setProductDescription('');
    setSpecialOffer('');
    setCouponCode('');
    setCustomImageUrl('');
  };

  const generateWhatsAppInquiryUrl = (ad: EntrepreneurAd) => {
    const cleanPhone = ad.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('502') ? cleanPhone : `502${cleanPhone}`;
    const text = `¡Hola ${ad.businessName}! Los vi en Radar Sur (${ad.municipio}). Me gustaría consultar información sobre sus productos y promociones especiales.`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  };

  const generateWhatsAppCouponRedeem = (ad: EntrepreneurAd) => {
    const cleanPhone = ad.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('502') ? cleanPhone : `502${cleanPhone}`;
    const code = ad.couponCode || 'RADAR-SUR15';
    const text = `¡Hola ${ad.businessName}! Acabo de generar mi Cupón Oficial en Radar Sur (#${code}). Quiero aprovechar el descuento en mi pedido o visita a su stand.`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  };

  const getMuniBadge = (muni?: string) => {
    switch (muni) {
      case 'Villa Nueva':
        return 'bg-[#FFE600] text-black';
      case 'San Miguel Petapa':
        return 'bg-[#00F0FF] text-black';
      case 'Villa Canales':
        return 'bg-[#CCFF00] text-black';
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <section id="emprendedores" className="py-14 sm:py-20 bg-[#FFFDF0] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section with Distinct Buttons and Detailed Coupon Explanation */}
        <div className="bg-[#FFE600] border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_#000] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#FF007F] text-white font-90s text-xs border-2 border-black shadow-[2px_2px_0_#000]">
                  ★ RADAR COMERCIAL & EMPRENDEDORES
                </span>
                <span className="px-2 py-0.5 bg-black text-[#FFE600] font-90s text-[11px] border border-white">
                  VILLA NUEVA · PETAPA · VILLA CANALES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-90s text-black uppercase tracking-tight leading-tight">
                Vitrina Comercial & Cupones con Descuento
              </h2>
              <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                Conectamos a más de 80 microempresarios, food trucks y artesanos del Sur con miles de vecinos. ¡Los negocios otorgan descuentos especiales limitados para darse a conocer y atraer nuevos clientes a sus stands y pedidos!
              </p>

              {/* Crucial Rule Banner: 1 coupon per person */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-[#FFE600] border-2 border-black font-90s text-xs shadow-[3px_3px_0_#FF007F]">
                <AlertCircle className="w-4 h-4 text-[#FF007F] shrink-0 animate-pulse" />
                <span>REGLA: SOLO 1 CUPÓN POR PERSONA (USO ÚNICO · NO SE PUEDE REPETIR)</span>
              </div>
            </div>

            {/* 3 Distinctly Styled Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              
              {/* Button 1: Portal de Negocios (Dark Neo-Brutalist Gold Accent) */}
              <button
                onClick={() => {
                  if (onOpenBusinessPortal) {
                    onOpenBusinessPortal();
                  } else {
                    window.location.hash = '#negocio';
                  }
                }}
                className="px-4 py-3 bg-black hover:bg-neutral-900 text-[#FFE600] border-3 border-black shadow-[4px_4px_0_#CCFF00] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center gap-3 cursor-pointer text-left group"
                title="Acceso para dueños de negocios para ver y canjear cupones"
              >
                <div className="w-9 h-9 bg-[#CCFF00] text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_#fff] group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="block font-90s text-xs uppercase leading-tight text-[#CCFF00]">
                    SOY NEGOCIO / MI PORTAL
                  </span>
                  <span className="text-[10px] text-white font-bold block">
                    Acceder & canjear cupones en vivo →
                  </span>
                </div>
              </button>

              {/* Button 2: Postular Marca (Hot Magenta Punchy CTA) */}
              <button
                onClick={() => setActiveTab('form')}
                className="px-4 py-3 bg-[#FF007F] hover:bg-black text-white border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center gap-3 cursor-pointer text-left group"
              >
                <div className="w-9 h-9 bg-white text-[#FF007F] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000] group-hover:rotate-12 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-90s text-xs uppercase leading-tight text-white">
                    POSTULAR MI MARCA / AD
                  </span>
                  <span className="text-[10px] text-white/90 font-bold block">
                    Stand en bazares & vitrina digital
                  </span>
                </div>
              </button>

              {/* Button 3: Ver Vitrina (Electric Cyan Directory) */}
              <button
                onClick={() => setActiveTab('directory')}
                className="px-4 py-3 bg-[#00F0FF] hover:bg-white text-black border-3 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center gap-3 cursor-pointer text-left group"
              >
                <div className="w-9 h-9 bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000] group-hover:scale-105 transition-transform">
                  <Ticket className="w-5 h-5 text-[#FF007F]" />
                </div>
                <div>
                  <span className="block font-90s text-xs uppercase leading-tight text-black">
                    VER VITRINA & CUPONES
                  </span>
                  <span className="text-[10px] text-black/80 font-bold block">
                    {ads.length} emprendimientos disponibles
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* Educational 3-Step Banner: How Discounts and 1-Coupon-Per-Person Rule Work */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t-3 border-black">
            <div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-1">
              <div className="flex items-center gap-2 font-90s text-xs text-black">
                <span className="w-5 h-5 bg-[#FFE600] border border-black flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>DESCUENTOS PARA NUEVOS CLIENTES</span>
              </div>
              <p className="text-[11px] font-bold text-slate-800 leading-snug">
                Los comercios ofrecen promociones con descuento (15% al 50% OFF) de manera limitada para que los vecinos los conozcan y compren por primera vez.
              </p>
            </div>

            <div className="p-3.5 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] space-y-1">
              <div className="flex items-center gap-2 font-90s text-xs text-white">
                <span className="w-5 h-5 bg-black text-[#FFE600] border border-white flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>SOLO 1 CUPÓN POR PERSONA</span>
              </div>
              <p className="text-[11px] font-bold text-white leading-snug">
                <strong>No se puede repetir.</strong> Cada persona puede redimir únicamente 1 cupón por negocio, garantizando que el beneficio llegue a nuevos clientes.
              </p>
            </div>

            <div className="p-3.5 bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0_#000] space-y-1">
              <div className="flex items-center gap-2 font-90s text-xs text-black">
                <span className="w-5 h-5 bg-[#CCFF00] border border-black flex items-center justify-center text-[10px] shrink-0">3</span>
                <span>CONTROL & CANJE DIRECTO</span>
              </div>
              <p className="text-[11px] font-bold text-black leading-snug">
                Muestras tu cupón QR en el stand o lo envías por WhatsApp. El negocio valida el código en su portal y descuenta el stock en tiempo real.
              </p>
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
                    <Sparkles className="w-3.5 h-3.5 text-[#FF007F]" /> ¡SOLICITUD ENVIADA AL RADAR SUR!
                  </div>
                  <h3 className="text-xl sm:text-2xl font-90s text-black uppercase">
                    ¡Gracias, {lastSubmittedAd.ownerName}! Tu negocio está en proceso de revisión.
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
                <span className="text-black/60 block font-bold">Municipio / Zona:</span>
                <strong className="text-sm font-90s text-black">{lastSubmittedAd.municipio} · {lastSubmittedAd.zona.split(' - ')[0]}</strong>
              </div>
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
                <span className="text-black/60 block font-bold">Cupón Creado:</span>
                <strong className="text-sm font-90s text-[#FF007F]">#{lastSubmittedAd.couponCode || 'RADAR-SUR15'}</strong>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onOpenBusinessPortal) {
                    onOpenBusinessPortal();
                  } else {
                    window.location.hash = '#negocio';
                  }
                }}
                className="px-5 py-2.5 text-xs font-90s text-black bg-[#FFE600] hover:bg-[#00F0FF] border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <Store className="w-4 h-4 text-[#FF007F]" />
                <span>ENTRAR A MI PORTAL DE NEGOCIO Y VER MIS CUPONES →</span>
              </button>

              <button
                onClick={() => setLastSubmittedAd(null)}
                className="px-4 py-2.5 text-xs font-90s text-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                CERRAR AVISO
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher & Municipality Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
            
            {/* View switcher */}
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
                <span>VITRINA & CUPONES ({filteredAds.length})</span>
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

            {/* Municipality Selector Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-90s uppercase text-black mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF007F]" /> MUNICIPIO:
              </span>
              {[
                { id: 'all', label: 'TODO EL SUR' },
                { id: 'Villa Nueva', label: 'VILLA NUEVA' },
                { id: 'San Miguel Petapa', label: 'PETAPA' },
                { id: 'Villa Canales', label: 'VILLA CANALES' },
              ].map((muni) => {
                const isActive = selectedMunicipio === muni.id;
                return (
                  <button
                    key={muni.id}
                    onClick={() => setSelectedMunicipio(muni.id)}
                    className={`px-3 py-1 text-xs font-90s border-2 border-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black text-[#FFE600] shadow-[2px_2px_0_#000] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-[#FFE600] shadow-[1px_1px_0_#000]'
                    }`}
                  >
                    {muni.label}
                  </button>
                );
              })}
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

        {/* VIEW 1: DIRECTORY OF ENTREPRENEURS & CUPONES */}
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

                      {/* Top Header Tags */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                        <span className={`px-2 py-0.5 text-[10px] font-90s uppercase border-2 border-black shadow-[2px_2px_0_#000] ${getMuniBadge(ad.municipio)}`}>
                          {ad.municipio || 'Sur Metropolitano'}
                        </span>

                        {ad.discountPercentage && (
                          <span className="px-2 py-0.5 text-[11px] font-90s bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0_#000] animate-pulse">
                            ★ {ad.discountPercentage}% OFF
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

                        {/* Special Offer Box with Coupon Hook */}
                        {ad.specialOffer && (
                          <div className="p-2.5 bg-[#FFE600]/40 border-2 border-black text-black text-xs space-y-1 shadow-[2px_2px_0_#000]">
                            <div className="flex items-center gap-1.5 font-90s text-[11px] uppercase text-[#FF007F]">
                              <Tag className="w-3.5 h-3.5" />
                              <span>OFERTA ESPECIAL RADAR</span>
                            </div>
                            <p className="font-bold text-[11px]">
                              {ad.specialOffer}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions: Coupon Button & WhatsApp */}
                      <div className="pt-3 border-t-2 border-black space-y-2">
                        {/* Interactive Coupon Trigger Button */}
                        <button
                          onClick={() => setActiveCouponAd(ad)}
                          className="w-full py-2.5 px-3 bg-[#FF007F] hover:bg-[#FFE600] hover:text-black text-white text-xs font-90s border-2 border-black shadow-[3px_3px_0_#000] hover-lift transition-bounce flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <QrCode className="w-4 h-4 animate-pulse" />
                          <span>OBTENER CUPÓN CON CÓDIGO QR ★</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <a
                            href={generateWhatsAppInquiryUrl(ad)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 px-3 bg-[#CCFF00] hover:bg-[#00F0FF] text-black text-xs font-90s border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center justify-center gap-1.5 text-center"
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
                              title="Instagram"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border-4 border-black max-w-md mx-auto space-y-3 shadow-[6px_6px_0_#000]">
                <Store className="w-10 h-10 text-black mx-auto" />
                <h4 className="text-base font-90s text-black uppercase">
                  No hay anuncios en esta sección aún
                </h4>
                <p className="text-xs text-black font-medium">
                  ¡Sé el primer negocio en anunciar tu marca en Radar Sur!
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 text-xs font-90s bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer"
                >
                  POSTULAR AHORA ★
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: REGISTRATION FORM */}
        {activeTab === 'form' && (
          <div id="ad-form-box" className="bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0_#000] space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-3 border-black">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-90s uppercase tracking-wider text-[#FF007F]">
                  <DragonRadarLogo size="sm" />
                  <span>CONVOCATORIA ABIERTA · VILLA NUEVA · PETAPA · VILLA CANALES</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-90s text-black uppercase mt-1">
                  Postula tu Negocio, Stand o Food Truck
                </h3>
                <p className="text-xs sm:text-sm text-black font-medium">
                  Registra tu marca para aparecer en la vitrina de Radar Sur y en bazares intermunicipales.
                </p>
              </div>

              <div className="px-4 py-2 bg-[#FFE600] border-2 border-black text-black text-xs font-90s shadow-[3px_3px_0_#000] shrink-0">
                ★ REVISIÓN EN MENOS DE 24 HORAS
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Municipio Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Municipio Sede *
                  </label>
                  <select
                    value={formMunicipio}
                    onChange={(e) => {
                      const newMuni = e.target.value as MunicipioSur;
                      setFormMunicipio(newMuni);
                      setZona(ZONAS_BY_MUNICIPIO[newMuni][0] as VillaNuevaZona);
                    }}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    <option value="Villa Nueva">Villa Nueva</option>
                    <option value="San Miguel Petapa">San Miguel Petapa</option>
                    <option value="Villa Canales">Villa Canales</option>
                  </select>
                </div>

                {/* Zona Selector (dynamically loaded based on municipality) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Zona / Colonia de {formMunicipio} *
                  </label>
                  <select
                    value={zona}
                    onChange={(e) => setZona(e.target.value as VillaNuevaZona)}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    {ZONAS_BY_MUNICIPIO[formMunicipio].map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

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
                    WhatsApp para Pedidos y Canje *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 5412-8890"
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

                {/* Special Offer for Neighbors */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Promoción / Descuento para Vecinos de Radar Sur
                  </label>
                  <input
                    type="text"
                    value={specialOffer}
                    onChange={(e) => setSpecialOffer(e.target.value)}
                    placeholder="Ej. 15% de descuento al mostrar código Radar Sur"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                {/* Email for login */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Correo Electrónico (para login de tu negocio) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@negocio.gt"
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                  />
                </div>

                {/* User Password / PIN */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#FF007F]" />
                    <span>Contraseña / PIN de tu Portal *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea un PIN o clave secreta (ej. 2026negocio)"
                    className="w-full px-4 py-3 text-sm bg-[#FFE600]/30 border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-500 font-bold block">
                    Con este PIN y tu correo/teléfono podrás ingresar a tu panel y canjear cupones de clientes.
                  </span>
                </div>

                {/* Limited Coupons Stock Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#FF007F]" />
                    <span>Límite de Cupones Iniciales a Otorgar *</span>
                  </label>
                  <select
                    value={couponsStock}
                    onChange={(e) => setCouponsStock(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    <option value={10}>10 Cupones Limitados (Prueba Piloto)</option>
                    <option value={20}>20 Cupones Limitados (Recomendado)</option>
                    <option value={30}>30 Cupones Limitados (Campaña Activa)</option>
                    <option value={50}>50 Cupones Limitados (Gran Promoción)</option>
                    <option value={100}>100 Cupones Limitados (Apertura / Stand)</option>
                  </select>
                </div>

                {/* Discount Percentage */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Porcentaje de Descuento (% OFF) *
                  </label>
                  <select
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-black text-black shadow-[3px_3px_0_#000] focus:outline-none"
                  >
                    <option value={10}>10% de Descuento</option>
                    <option value={15}>15% de Descuento (Estándar Radar)</option>
                    <option value={20}>20% de Descuento</option>
                    <option value={25}>25% de Descuento</option>
                    <option value={30}>30% de Descuento</option>
                    <option value={50}>50% de Descuento (Super Promo)</option>
                  </select>
                </div>

              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-90s text-black uppercase">
                  Descripción del Producto o Servicio *
                </label>
                <textarea
                  required
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe tus especialidades, qué incluye tu stand y qué te hace único en el Sur..."
                  className="w-full px-4 py-3 text-sm bg-white border-3 border-black font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-3 border-black">
                <div className="space-y-1">
                  <div className="text-xs font-90s text-black flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF007F]" />
                    <span>ALIANZA INTERMUNICIPAL · RADAR SUR</span>
                  </div>
                  <div className="text-[11px] font-bold text-black/70 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>Conectado a Base de Datos Supabase (recepción en tiempo real)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s text-sm border-3 border-black shadow-[5px_5px_0_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR SOLICITUD AL RADAR SUR ★</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* INTERACTIVE COUPON MODAL WITH COUNTDOWN TIMER & QR */}
      {activeCouponAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FFE600] border-4 border-black shadow-[10px_10px_0_#000] p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-3 border-black pb-4">
              <div className="flex items-center gap-2">
                <DragonRadarLogo size="sm" />
                <div>
                  <span className="text-[10px] font-90s uppercase bg-[#FF007F] text-white px-2 py-0.5 border border-black block">
                    CUPÓN EXCLUSIVO RADAR SUR
                  </span>
                  <h3 className="text-lg font-90s text-black uppercase mt-0.5">
                    {activeCouponAd.businessName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveCouponAd(null)}
                className="p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Urgency Countdown Bar */}
            <div className="bg-black text-white p-3 border-2 border-black flex items-center justify-between text-xs font-90s shadow-[3px_3px_0_#000]">
              <div className="flex items-center gap-2 text-[#FFE600]">
                <Clock className="w-4 h-4 animate-spin text-[#FF007F]" />
                <span>VALIDEZ TEMPORAL:</span>
              </div>
              <span className="bg-[#FF007F] text-white px-2.5 py-0.5 border border-white text-sm font-mono tracking-wider">
                {formatTimer(couponTimerSeconds)}
              </span>
            </div>

            {/* QR and Code Box */}
            <div className="bg-white border-3 border-black p-5 text-center space-y-3 shadow-[4px_4px_0_#000]">
              <div className="w-40 h-40 bg-[#FFFDF0] border-2 border-black p-2 mx-auto shadow-[3px_3px_0_#000] flex items-center justify-center">
                <QrCode className="w-full h-full text-black" />
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-black/70 uppercase">
                  CÓDIGO DE CANJE:
                </div>
                <div className="inline-flex items-center gap-2 bg-[#FFE600] px-3 py-1 border-2 border-black font-mono font-black text-sm text-black shadow-[2px_2px_0_#000]">
                  <span>{activeCouponAd.couponCode || 'RADAR-SUR15'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(activeCouponAd.couponCode || 'RADAR-SUR15');
                      setCopiedCoupon(true);
                      setTimeout(() => setCopiedCoupon(false), 2000);
                    }}
                    className="p-0.5 hover:text-[#FF007F] cursor-pointer"
                    title="Copiar código"
                  >
                    {copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs font-black text-black">
                {activeCouponAd.specialOffer || '15% de descuento al mostrar este código'}
              </p>
              
              <div className="text-[10px] font-bold text-black/60 pt-1 border-t border-black/10">
                Ubicación: {activeCouponAd.municipio} ({activeCouponAd.zona}) · Cupón personal
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <a
                href={generateWhatsAppCouponRedeem(activeCouponAd)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#CCFF00] hover:bg-black hover:text-[#CCFF00] text-black font-90s text-xs border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CANJEAR POR WHATSAPP CON EL NEGOCIO</span>
              </a>

              <button
                onClick={() => setActiveCouponAd(null)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-black font-90s text-xs border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                GUARDAR Y CERRAR
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
