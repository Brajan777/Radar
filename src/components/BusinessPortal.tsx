import React, { useState } from 'react';
import { 
  Store, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Edit3, 
  Save, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  LogOut, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Lock
} from 'lucide-react';
import { EntrepreneurAd, EventItem, MunicipioSur } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface BusinessPortalProps {
  businessAds: EntrepreneurAd[];
  activeBusinessId: string | null;
  events: EventItem[];
  onSelectBusiness: (id: string | null) => void;
  onUpdateBusiness: (updatedAd: EntrepreneurAd) => void;
  onExitPortal: () => void;
  onGoToRegister: () => void;
}

export const BusinessPortal: React.FC<BusinessPortalProps> = ({
  businessAds,
  activeBusinessId,
  events,
  onSelectBusiness,
  onUpdateBusiness,
  onExitPortal,
  onGoToRegister,
}) => {
  // Login / Auth State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tab inside active business dashboard
  const [portalTab, setPortalTab] = useState<'cupones' | 'perfil' | 'eventos'>('cupones');

  // Customer redemption input
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  // Editing state for profile & coupons
  const activeBusiness = businessAds.find(b => b.id === activeBusinessId) || null;

  const [editName, setEditName] = useState(activeBusiness?.businessName || '');
  const [editOwner, setEditOwner] = useState(activeBusiness?.ownerName || '');
  const [editPhone, setEditPhone] = useState(activeBusiness?.phone || '');
  const [editDescription, setEditDescription] = useState(activeBusiness?.productDescription || '');
  const [editOffer, setEditOffer] = useState(activeBusiness?.specialOffer || '');
  const [editDiscount, setEditDiscount] = useState<number>(activeBusiness?.discountPercentage || 15);
  const [editCouponCode, setEditCouponCode] = useState(activeBusiness?.couponCode || '');
  const [editCouponsLeft, setEditCouponsLeft] = useState<number>(activeBusiness?.couponsLeft || 15);
  const [editImageUrl, setEditImageUrl] = useState(activeBusiness?.imageUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update local edit form when active business changes
  React.useEffect(() => {
    if (activeBusiness) {
      setEditName(activeBusiness.businessName);
      setEditOwner(activeBusiness.ownerName);
      setEditPhone(activeBusiness.phone);
      setEditDescription(activeBusiness.productDescription);
      setEditOffer(activeBusiness.specialOffer || '');
      setEditDiscount(activeBusiness.discountPercentage || 15);
      setEditCouponCode(activeBusiness.couponCode || `RADAR-${activeBusiness.businessName.substring(0, 4).toUpperCase()}15`);
      setEditCouponsLeft(activeBusiness.couponsLeft ?? 15);
      setEditImageUrl(activeBusiness.imageUrl);
    }
  }, [activeBusinessId]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const term = loginEmailOrPhone.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (!term) {
      setLoginError('Por favor ingresa tu correo electrónico o teléfono registrado.');
      return;
    }

    // Buscar negocio por correo, teléfono o ID
    const found = businessAds.find(b => 
      b.email.toLowerCase() === term || 
      b.phone.replace(/[^0-9]/g, '') === term.replace(/[^0-9]/g, '') ||
      b.id === term ||
      b.businessName.toLowerCase().includes(term)
    );

    if (!found) {
      setLoginError('No encontramos ningún negocio registrado con ese correo o teléfono. Regístrate o selecciona un negocio demo.');
      return;
    }

    // En producción se valida password; si es nuevo o no tiene se asigna demo
    if (found.password && pass && found.password !== pass) {
      setLoginError('Contraseña incorrecta. (Prueba con negocio123 o selecciona abajo en Demo)');
      return;
    }

    onSelectBusiness(found.id);
  };

  const handleQuickDemoLogin = (businessId: string) => {
    onSelectBusiness(businessId);
    setLoginError(null);
  };

  // Canjear 1 cupón de cliente
  const handleRedeemCoupon = () => {
    if (!activeBusiness) return;

    const currentLeft = activeBusiness.couponsLeft ?? 15;
    if (currentLeft <= 0) {
      alert('¡Ya no tienes cupones disponibles! Aumenta tu límite en la pestaña de Ajustes de Cupón.');
      return;
    }

    const currentRedeemed = activeBusiness.couponsRedeemed ?? 0;
    const newLeft = currentLeft - 1;
    const newRedeemed = currentRedeemed + 1;

    const updated: EntrepreneurAd = {
      ...activeBusiness,
      couponsLeft: newLeft,
      couponsRedeemed: newRedeemed,
      totalCouponsIssued: activeBusiness.totalCouponsIssued || (newLeft + newRedeemed)
    };

    onUpdateBusiness(updated);
    setEditCouponsLeft(newLeft);
    setRedeemSuccessMsg(`¡Cupón canjeado con éxito! Código ${activeBusiness.couponCode || 'RADAR'}. Te quedan ${newLeft} cupones.`);
    setRedeemCodeInput('');
    setTimeout(() => setRedeemSuccessMsg(null), 4000);
  };

  // Guardar cambios del perfil o cupón
  const handleSaveProfileAndCoupons = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;

    const total = (activeBusiness.couponsRedeemed ?? 0) + editCouponsLeft;

    const updated: EntrepreneurAd = {
      ...activeBusiness,
      businessName: editName.trim() || activeBusiness.businessName,
      ownerName: editOwner.trim() || activeBusiness.ownerName,
      phone: editPhone.trim() || activeBusiness.phone,
      productDescription: editDescription.trim() || activeBusiness.productDescription,
      specialOffer: editOffer.trim() || activeBusiness.specialOffer,
      discountPercentage: Number(editDiscount) || 15,
      couponCode: editCouponCode.trim().toUpperCase() || activeBusiness.couponCode,
      couponsLeft: Number(editCouponsLeft),
      totalCouponsIssued: total,
      imageUrl: editImageUrl.trim() || activeBusiness.imageUrl
    };

    onUpdateBusiness(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // =========================================================================
  // PANTALLA 1: LOGIN DE EMPRENDEDORES (Si no hay negocio activo seleccionado)
  // =========================================================================
  if (!activeBusiness) {
    return (
      <div className="min-h-screen bg-[#FFFDF0] bg-grid-90s py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          
          {/* Top Logo & Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DragonRadarLogo size="md" />
              <div>
                <span className="text-xl font-90s uppercase tracking-tight text-black block leading-none">
                  RADAR SUR
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#FF007F] block">
                  PORTAL EXCLUSIVO NEGOCIOS
                </span>
              </div>
            </div>

            <button
              onClick={onExitPortal}
              className="px-3 py-1.5 text-xs font-90s bg-white hover:bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0_#000] hover-lift transition-bounce cursor-pointer"
            >
              ← Ir a la Web
            </button>
          </div>

          {/* Login Neo-Brutalist Box */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] p-6 sm:p-8 space-y-6">
            <div className="border-b-3 border-black pb-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFE600] border-2 border-black text-black font-90s text-xs shadow-[2px_2px_0_#000]">
                <Store className="w-3.5 h-3.5" />
                <span>INICIAR SESIÓN NEGOCIOS</span>
              </div>
              <h2 className="text-2xl font-90s text-black uppercase mt-1">
                Panel del Emprendedor
              </h2>
              <p className="text-xs text-black/80 font-bold">
                Gestiona tus cupones de descuento, lleva el conteo de canjes en vivo y visualiza eventos en Villa Nueva, Petapa y Canales.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-[#FF007F] text-white border-2 border-black text-xs font-bold shadow-[3px_3px_0_#000] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="block text-black uppercase font-90s">
                  Correo Electrónico o Teléfono:
                </label>
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="ej: donalupe.chuchitos@gmail.com o 5521-3344"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0_#000]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-black uppercase font-90s">
                  Contraseña o PIN:
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="•••••••• (ej: negocio123)"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0_#000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s text-sm border-3 border-black shadow-[4px_4px_0_#000] hover-lift transition-bounce cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>INGRESAR A MI NEGOCIO ★</span>
              </button>
            </form>

            {/* Quick Demo Selector */}
            <div className="pt-4 border-t-2 border-black space-y-2">
              <div className="text-[11px] font-90s uppercase text-black flex items-center justify-between">
                <span>Acceso Rápido (Negocios Registrados):</span>
                <span className="text-[#FF007F]">Demo 1-Clic</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {businessAds.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleQuickDemoLogin(b.id)}
                    className="w-full text-left p-2.5 bg-slate-50 hover:bg-[#00F0FF] text-black border-2 border-black font-bold text-xs shadow-[2px_2px_0_#000] hover-lift transition-bounce flex items-center justify-between cursor-pointer"
                  >
                    <div className="truncate">
                      <strong className="block text-black truncate">{b.businessName}</strong>
                      <span className="text-[10px] text-black/70">
                        {b.municipio} · {b.couponsLeft ?? 15} cupones disponibles
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 text-black" />
                  </button>
                ))}
              </div>
            </div>

            {/* Register CTA */}
            <div className="pt-4 border-t-2 border-black/20 text-center space-y-2">
              <p className="text-xs text-black font-medium">
                ¿Tu negocio aún no está en Radar Sur?
              </p>
              <button
                onClick={() => {
                  onExitPortal();
                  onGoToRegister();
                }}
                className="w-full py-2 bg-[#CCFF00] hover:bg-[#FFE600] text-black font-90s text-xs border-2 border-black shadow-[3px_3px_0_#000] hover-lift transition-bounce cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>POSTULAR NEGOCIO O FOOD TRUCK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 2: DASHBOARD INTERACTIVO DEL NEGOCIO ACTIVO
  // =========================================================================
  const totalIssued = activeBusiness.totalCouponsIssued || 25;
  const leftCount = activeBusiness.couponsLeft ?? 15;
  const redeemedCount = activeBusiness.couponsRedeemed ?? (totalIssued - leftCount);
  const percentClaimed = Math.min(100, Math.round((redeemedCount / totalIssued) * 100));

  return (
    <div className="min-h-screen bg-[#FFFDF0] bg-grid-90s py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner Navigation */}
      <header className="max-w-7xl mx-auto bg-white border-4 border-black shadow-[6px_6px_0_#000] p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeBusiness.imageUrl}
            alt={activeBusiness.businessName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover border-3 border-black shadow-[3px_3px_0_#000] shrink-0"
          />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#FFE600] text-black border border-black font-90s text-[10px] uppercase">
                {activeBusiness.category}
              </span>
              <span className="px-2 py-0.5 bg-[#00F0FF] text-black border border-black font-90s text-[10px] uppercase">
                {activeBusiness.municipio} ({activeBusiness.zona.split(' - ')[0]})
              </span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white border border-black font-90s text-[10px] uppercase">
                ● ACTIVO EN RADAR
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-90s text-black uppercase truncate leading-tight">
              {activeBusiness.businessName}
            </h1>
            <p className="text-xs text-black/80 font-bold truncate">
              Por {activeBusiness.ownerName} · WhatsApp: {activeBusiness.phone}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExitPortal}
            className="px-3.5 py-2 text-xs font-90s bg-[#00F0FF] hover:bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0_#000] hover-lift transition-bounce flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Web Pública</span>
          </button>

          <button
            onClick={() => onSelectBusiness(null)}
            className="px-3.5 py-2 text-xs font-90s bg-[#FF007F] hover:bg-black text-white border-2 border-black shadow-[2px_2px_0_#000] hover-lift transition-bounce flex items-center gap-1.5 cursor-pointer"
            title="Cerrar sesión de este negocio"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto space-y-6">

        {/* 4 Neo-Brutalist Visual Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Cupones Disponibles */}
          <div className="p-4 bg-[#FFE600] border-3 border-black shadow-[4px_4px_0_#000] space-y-2 hover-lift transition-bounce">
            <div className="flex items-center justify-between text-xs font-90s text-black">
              <span>CUPONES EN STOCK</span>
              <Ticket className="w-4 h-4 text-[#FF007F]" />
            </div>
            <div className="text-3xl font-90s text-black">
              {leftCount}
            </div>
            <p className="text-[11px] font-bold text-black/80">
              Disponibles para vecinos en Radar Sur
            </p>
          </div>

          {/* Card 2: Cupones Canjeados */}
          <div className="p-4 bg-[#00F0FF] border-3 border-black shadow-[4px_4px_0_#000] space-y-2 hover-lift transition-bounce">
            <div className="flex items-center justify-between text-xs font-90s text-black">
              <span>CANJES COMPLETADOS</span>
              <CheckCircle2 className="w-4 h-4 text-black" />
            </div>
            <div className="text-3xl font-90s text-black">
              {redeemedCount}
            </div>
            <p className="text-[11px] font-bold text-black/80">
              Clientes que ya compraron con tu cupón
            </p>
          </div>

          {/* Card 3: Descuento Activo */}
          <div className="p-4 bg-[#FF007F] text-white border-3 border-black shadow-[4px_4px_0_#000] space-y-2 hover-lift transition-bounce">
            <div className="flex items-center justify-between text-xs font-90s text-white">
              <span>OFERTA LIMITADA</span>
              <DollarSign className="w-4 h-4 text-[#FFE600]" />
            </div>
            <div className="text-3xl font-90s text-white">
              {activeBusiness.discountPercentage || 15}% OFF
            </div>
            <p className="text-[11px] font-bold text-white/90 truncate">
              Código: <strong>{activeBusiness.couponCode || 'RADAR-SUR'}</strong>
            </p>
          </div>

          {/* Card 4: Tasa de Conversión */}
          <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] space-y-2 hover-lift transition-bounce">
            <div className="flex items-center justify-between text-xs font-90s text-black">
              <span>EFECTIVIDAD RADAR</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-90s text-black">
              {percentClaimed}%
            </div>
            <div className="w-full bg-slate-200 h-2 border border-black overflow-hidden">
              <div 
                className="bg-[#FF007F] h-full transition-all duration-500" 
                style={{ width: `${percentClaimed}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b-3 border-black pb-3 overflow-x-auto">
          {[
            { id: 'cupones', label: '🎟️ GESTIÓN DE CUPONES & CANJES', color: 'bg-[#FFE600]' },
            { id: 'perfil', label: '🏪 EDITAR PERFIL & FOTOS DEL NEGOCIO', color: 'bg-[#00F0FF]' },
            { id: 'eventos', label: '📅 EVENTOS & FERIAS DISPONIBLES', color: 'bg-[#CCFF00]' }
          ].map((tab) => {
            const isActive = portalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPortalTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-90s border-2 border-black transition-bounce hover-lift cursor-pointer shrink-0 ${
                  isActive
                    ? `${tab.color} text-black shadow-[3px_3px_0_#000] scale-102`
                    : 'bg-white text-black hover:bg-slate-100 shadow-[1.5px_1.5px_0_#000]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: GESTIÓN DE CUPONES & CANJE DIRECTO DE CLIENTES */}
        {portalTab === 'cupones' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Módulo de Canje Rápido ("Validar Cupón de Cliente") */}
            <div className="lg:col-span-5 bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] space-y-6">
              <div className="border-b-2 border-black pb-3 space-y-1">
                <span className="px-2 py-0.5 bg-[#FF007F] text-white font-90s text-[10px] uppercase border border-black">
                  ★ CAJA & CANJE EN VIVO
                </span>
                <h3 className="text-lg font-90s text-black uppercase">
                  Canjear Cupón de Cliente
                </h3>
                <p className="text-xs text-black/80 font-medium">
                  Cuando un vecino te visite o te escriba mostrando su código QR de Radar Sur, canjéalo aquí para descontar del stock.
                </p>
              </div>

              {redeemSuccessMsg && (
                <div className="p-3 bg-emerald-500 text-white border-2 border-black font-bold text-xs shadow-[3px_3px_0_#000] flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{redeemSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="p-4 bg-[#FFFDF0] border-2 border-black space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-black">
                    <span>Código de tu Negocio:</span>
                    <strong className="bg-[#FFE600] px-2 py-0.5 border border-black font-mono">
                      {activeBusiness.couponCode || 'RADAR-SUR'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-black">
                    <span>Descuento Aplicado:</span>
                    <strong className="text-[#FF007F] font-black">{activeBusiness.discountPercentage || 15}% OFF</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-black">
                    <span>Cupones Restantes:</span>
                    <strong className="bg-black text-[#CCFF00] px-2 py-0.5 font-mono">{leftCount}</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-90s text-black uppercase">
                    Código de cliente (Opcional):
                  </label>
                  <input
                    type="text"
                    value={redeemCodeInput}
                    onChange={(e) => setRedeemCodeInput(e.target.value)}
                    placeholder={activeBusiness.couponCode || "ej: RADAR-CHUCHITO15"}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0_#000]"
                  />
                </div>

                <button
                  onClick={handleRedeemCoupon}
                  disabled={leftCount <= 0}
                  className={`w-full py-3.5 font-90s text-sm border-3 border-black shadow-[4px_4px_0_#000] hover-lift transition-bounce flex items-center justify-center gap-2 cursor-pointer ${
                    leftCount > 0 
                      ? 'bg-[#CCFF00] hover:bg-[#FFE600] text-black' 
                      : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>{leftCount > 0 ? 'VALIDAR Y CANJEAR 1 CUPÓN (-1)' : 'SIN CUPONES DISPONIBLES'}</span>
                </button>
              </div>

              {/* Progress and Urgency Explanation */}
              <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-none text-xs text-blue-950 space-y-1 font-medium">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Estrategia de Ventas:</span>
                </div>
                <p>
                  Tener un número limitado de cupones (ej. 20-25) genera <strong>urgencia real</strong> en los vecinos para visitarte antes de que se agoten.
                </p>
              </div>
            </div>

            {/* Right Col: Configuración de la Promoción */}
            <div className="lg:col-span-7 bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] space-y-6">
              <div className="border-b-2 border-black pb-3 space-y-1">
                <span className="px-2 py-0.5 bg-[#00F0FF] text-black font-90s text-[10px] uppercase border border-black">
                  ★ AJUSTES DE PROMOCIÓN
                </span>
                <h3 className="text-lg font-90s text-black uppercase">
                  Editar Cupón y Oferta Comercial
                </h3>
                <p className="text-xs text-black/80 font-medium">
                  Actualiza el porcentaje de descuento y las condiciones que verán los clientes en Radar Sur.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-500 text-white border-2 border-black font-bold text-xs shadow-[3px_3px_0_#000] flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>¡Cambios guardados con éxito en Radar Sur y Supabase!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfileAndCoupons} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-black uppercase font-90s">
                      Código del Cupón (Mayúsculas):
                    </label>
                    <input
                      type="text"
                      value={editCouponCode}
                      onChange={(e) => setEditCouponCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black font-mono font-black text-sm text-black shadow-[2px_2px_0_#000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-black uppercase font-90s">
                      % de Descuento:
                    </label>
                    <div className="flex gap-1.5">
                      {[10, 15, 20, 25, 30].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setEditDiscount(pct)}
                          className={`flex-1 py-2 text-xs font-90s border-2 border-black cursor-pointer transition-colors ${
                            editDiscount === pct
                              ? 'bg-[#FF007F] text-white shadow-[2px_2px_0_#000]'
                              : 'bg-white text-black hover:bg-[#FFE600]'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-black uppercase font-90s">
                    Cantidad de Cupones Restantes en Stock:
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditCouponsLeft(prev => Math.max(0, prev - 1))}
                      className="p-2.5 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer font-black"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={editCouponsLeft}
                      onChange={(e) => setEditCouponsLeft(Number(e.target.value))}
                      className="w-24 text-center px-3.5 py-2 bg-[#FFFDF0] border-2 border-black font-mono font-black text-lg text-black shadow-[2px_2px_0_#000]"
                    />
                    <button
                      type="button"
                      onClick={() => setEditCouponsLeft(prev => prev + 5)}
                      className="px-3 py-2 bg-[#CCFF00] hover:bg-[#FFE600] border-2 border-black font-90s text-xs shadow-[2px_2px_0_#000] cursor-pointer"
                    >
                      +5 Cupones
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-black uppercase font-90s">
                    Texto de la Oferta Promocional:
                  </label>
                  <input
                    type="text"
                    value={editOffer}
                    onChange={(e) => setEditOffer(e.target.value)}
                    placeholder="ej: 15% de descuento en la compra del combo familiar con bebidas"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0_#000]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s text-xs border-3 border-black shadow-[3px_3px_0_#000] hover-lift transition-bounce cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR AJUSTES DE CUPÓN ★</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: EDITAR PERFIL & FOTOS DEL NEGOCIO */}
        {portalTab === 'perfil' && (
          <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_#000] space-y-6">
            <div className="border-b-2 border-black pb-3 space-y-1">
              <span className="px-2 py-0.5 bg-[#00F0FF] text-black font-90s text-[10px] uppercase border border-black">
                ★ IDENTIDAD COMERCIAL
              </span>
              <h3 className="text-xl font-90s text-black uppercase">
                Información de tu Negocio en Radar Sur
              </h3>
              <p className="text-xs text-black/80 font-bold">
                Mantén actualizada la fotografía de tus productos y tu número de WhatsApp para recibir pedidos de los vecinos.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500 text-white border-2 border-black font-bold text-xs shadow-[3px_3px_0_#000] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>¡Perfil actualizado con éxito!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfileAndCoupons} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-black uppercase font-90s">Nombre Comercial del Negocio:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold shadow-[2px_2px_0_#000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-black uppercase font-90s">Nombre del Propietario:</label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold shadow-[2px_2px_0_#000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-black uppercase font-90s">Teléfono de WhatsApp para Pedidos:</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold shadow-[2px_2px_0_#000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-black uppercase font-90s">URL de Fotografía de Productos:</label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold shadow-[2px_2px_0_#000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-black uppercase font-90s">Descripción de Productos y Especialidades:</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF0] border-2 border-black text-black font-bold shadow-[2px_2px_0_#000]"
                />
              </div>

              {/* Photo Preview */}
              <div className="p-3 bg-slate-50 border-2 border-black flex items-center gap-4">
                <img
                  src={editImageUrl || activeBusiness.imageUrl}
                  alt="Vista previa"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover border-2 border-black shadow-[2px_2px_0_#000]"
                />
                <div className="text-xs space-y-1">
                  <strong className="block text-black font-90s uppercase">Vista Previa de Foto de Portada</strong>
                  <p className="text-black/70">
                    Esta imagen se muestra en la tarjeta de cupones y en el directorio de emprendedores de Villa Nueva, Petapa y Canales.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s text-xs border-3 border-black shadow-[3px_3px_0_#000] hover-lift transition-bounce cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>GUARDAR PERFIL DEL NEGOCIO ★</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: EVENTOS & FERIAS DISPONIBLES EN EL SUR */}
        {portalTab === 'eventos' && (
          <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_#000] space-y-6">
            <div className="border-b-2 border-black pb-3 space-y-1">
              <span className="px-2 py-0.5 bg-[#CCFF00] text-black font-90s text-[10px] uppercase border border-black">
                ★ OPORTUNIDADES COMERCIALES
              </span>
              <h3 className="text-xl font-90s text-black uppercase">
                Próximas Actividades y Bazares en Villa Nueva, Petapa y Canales
              </h3>
              <p className="text-xs text-black/80 font-bold">
                Participa con tu stand, carrito o food truck en los eventos masivos coordinados por las alcaldías y Radar Sur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 border-2 border-black bg-[#FFFDF0] hover:bg-white shadow-[3px_3px_0_#000] hover-lift transition-bounce flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-90s uppercase">
                      <span className="bg-[#FFE600] px-2 py-0.5 border border-black text-black">
                        {ev.municipio}
                      </span>
                      <span className="bg-[#00F0FF] px-2 py-0.5 border border-black text-black">
                        {ev.category}
                      </span>
                    </div>

                    <h4 className="font-90s text-sm text-black leading-snug line-clamp-2">
                      {ev.title}
                    </h4>

                    <div className="text-[11px] font-bold text-black/80 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF007F]" />
                        <span>{ev.date} · {ev.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-black" />
                        <span className="truncate">{ev.locationName}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/50255213344?text=${encodeURIComponent(`Hola, soy de ${activeBusiness.businessName} y me interesa participar con stand en el evento "${ev.title}".`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s text-xs border border-black shadow-[2px_2px_0_#000] text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>SOLICITAR STAND / ESPACIO</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
