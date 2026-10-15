import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown,
  Sparkles,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Radio,
  Store,
  Flame,
  Zap
} from 'lucide-react';
import { UserProfile } from '../types';
import { triggerBrowserPushNotification } from '../utils/geo';
import { DragonRadarLogo } from './DragonRadarLogo';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onChangeUserRole: (role: 'vecino' | 'organizador' | 'admin') => void;
  onOpenProposeModal?: () => void;
  onOpenProfileModal: () => void;
  onOpenAdmin: () => void;
  onOpenSocialModal: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onChangeUserRole,
  onOpenProposeModal,
  onOpenProfileModal,
  onOpenAdmin,
  onOpenSocialModal,
  unreadNotificationsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleEnablePush = async () => {
    await triggerBrowserPushNotification(
      '¡Radar Activo! ★',
      'Te avisaremos al instante cuando se detecten actividades familiares y festivales en tu zona.'
    );
  };

  const navLinks = [
    { id: 'inicio', label: 'Inicio', href: '#inicio' },
    { id: 'como-funciona', label: '¿Cómo Funciona?', href: '#como-funciona' },
    { id: 'eventos', label: 'Eventos', href: '#eventos' },
    { id: 'emprendedores', label: 'Emprendedores & Ads', href: '#emprendedores' },
    { id: 'calendario', label: 'Calendario', href: '#calendario' },
    { id: 'redes-sociales', label: 'Estudio Social', href: '#redes-sociales' },
  ];

  const handleNavClick = (id: string, href: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF0] border-b-4 border-black shadow-[0_4px_0_0_#000]">
      {/* Marquee Ticker Bar */}
      <div className="bg-[#FFE600] border-b-2 border-black text-black text-xs font-black py-1.5 px-4 overflow-hidden select-none">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="px-2 py-0.5 bg-[#FF007F] text-white font-90s text-[10px] uppercase tracking-wider border border-black shadow-[2px_2px_0_#000] shrink-0">
              ★ RADAR SUR OFICIAL
            </span>
            <div className="overflow-hidden relative flex-1 min-w-0 max-w-[220px] xs:max-w-[280px] sm:max-w-[600px] md:max-w-[800px]">
              <div className="animate-ticker whitespace-nowrap flex items-center gap-6 text-[11px] font-bold">
                <span>★ RADAR SUR ★ 3 MUNICIPIOS: VILLA NUEVA · SAN MIGUEL PETAPA · VILLA CANALES</span>
                <span>★ ALCALDÍAS & EXCLUSIVOS RADAR</span>
                <span>★ CUPONES QR & EMPRENDEDORES</span>
                <span>★ RUTAS A GOOGLE MAPS Y WAZE</span>
                <span>★ RADAR SUR ★ 3 MUNICIPIOS: VILLA NUEVA · SAN MIGUEL PETAPA · VILLA CANALES</span>
                <span>★ ALCALDÍAS & EXCLUSIVOS RADAR</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-[11px]">
            <span className="flex items-center gap-1 font-black bg-white px-2 py-0.5 border border-black shadow-[2px_2px_0_#000]">
              <span className="text-[#FF007F]">3 PMT:</span> VN 1531 · Petapa 1550 · Canales 1545
            </span>
            <a 
              href="https://whatsapp.com" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#00F0FF] hover:bg-[#CCFF00] px-2 py-0.5 border border-black font-black text-black shadow-[2px_2px_0_#000] transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Radar Sur</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          
          {/* Brand Logo: Clean Radar */}
          <a 
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('inicio', '#inicio');
            }}
            className="flex items-center gap-3 text-left group shrink-0 focus:outline-none"
          >
            <DragonRadarLogo size="md" />

            <div>
              <span className="text-2xl sm:text-3xl font-90s tracking-tight text-black block leading-none group-hover:text-[#FF007F] transition-colors">
                RADAR SUR
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider text-black block mt-1">
                Villa Nueva · Petapa · Villa Canales
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-black text-black">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id, link.href);
                }}
                className="px-2.5 py-1 text-black hover:bg-[#FFE600] border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0_#000] transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls: 90s Chunky Neon Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Push Alert Bell */}
            <button
              onClick={handleEnablePush}
              title="Activar alertas del Radar para eventos cercanos"
              className="p-2 bg-white hover:bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all relative"
            >
              <Bell className="w-4 h-4 text-black" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FF007F] border-2 border-black" />
              )}
            </button>

            {/* Social Share Hub Quick Button */}
            <button
              onClick={onOpenSocialModal}
              title="Promocionar en Redes Sociales"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-black text-black bg-[#00F0FF] hover:bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Difundir</span>
            </button>

            {/* Emprendedores & Ads CTA Button: Super Flashy 90s Hot Magenta */}
            <a
              href="#emprendedores"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('emprendedores', '#emprendedores');
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-90s text-black bg-[#FFE600] hover:bg-[#FF007F] hover:text-white border-2 border-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-1.5 shrink-0"
              title="Sección de Emprendedores y Ads"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Unirse:</span> Emprendedores
            </a>

            {/* User Profile Avatar & Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 p-1 bg-white border-2 border-black shadow-[2px_2px_0_#000] hover:bg-[#CCFF00] transition-colors focus:outline-none"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 object-cover border border-black"
                />
                <ChevronDown className="w-3.5 h-3.5 text-black" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border-3 border-black shadow-[6px_6px_0_#000] py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b-2 border-black bg-[#FFE600]">
                    <div className="font-90s text-black text-sm">{user.name}</div>
                    <div className="text-[11px] font-bold text-black capitalize">
                      Rol: {user.role} · {user.zona.split(' - ')[0]}
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        onOpenProfileModal();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#00F0FF] text-black font-bold flex items-center justify-between"
                    >
                      <span>Mi Perfil & Pases Registrados</span>
                      <span>★</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t-2 border-black px-4 py-2 bg-slate-50">
                    <span className="text-[10px] uppercase font-black text-black block mb-1">
                      Cambiar Rol (Demo)
                    </span>
                    <div className="flex gap-1">
                      {(['vecino', 'organizador', 'admin'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            onChangeUserRole(r);
                            setRoleDropdownOpen(false);
                          }}
                          className={`flex-1 py-1 text-[10px] font-black uppercase border border-black shadow-[1.5px_1.5px_0_#000] transition-colors ${
                            user.role === r
                              ? 'bg-[#FF007F] text-white'
                              : 'bg-white text-black hover:bg-[#FFE600]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] text-black hover:bg-[#00F0FF] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t-3 border-black bg-[#FFFDF0] space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id, link.href);
                  }}
                  className="px-3 py-2 text-xs font-90s text-black bg-white hover:bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-center"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t-2 border-black">
              <button
                onClick={() => {
                  onOpenSocialModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-xs font-90s bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Difusión Social</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
