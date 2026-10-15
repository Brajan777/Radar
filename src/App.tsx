import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EVENTS, 
  INITIAL_SUBAGENTS, 
  INITIAL_USER, 
  INITIAL_METRICS,
  INITIAL_ADS,
  VILLA_NUEVA_CENTER
} from './data/initialData';
import { EventItem, UserProfile, PlatformMetrics, AiSubagent, EntrepreneurAd } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { EntrepreneurAdsSection } from './components/EntrepreneurAdsSection';
import { SocialPromotionHub } from './components/SocialPromotionHub';
import { EventCard } from './components/EventCard';
import { InteractiveCalendar } from './components/InteractiveCalendar';
import { SubagentsHub } from './components/SubagentsHub';
import { AdminPanel } from './components/AdminPanel';
import { PlatformStats } from './components/PlatformStats';
import { EventModal } from './components/EventModal';
import { ProposeEventModal } from './components/ProposeEventModal';
import { UserAuthModal } from './components/UserAuthModal';
import { SocialShareModal } from './components/SocialShareModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { DragonRadarLogo } from './components/DragonRadarLogo';
import { triggerBrowserPushNotification, calculateDistanceKm, LatLng } from './utils/geo';
import { 
  Filter, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Radio, 
  Check, 
  Bell, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Grid,
  CalendarDays,
  LayoutDashboard,
  Compass, 
  ArrowUp, 
  Navigation,
  Store,
  Lock,
  LogOut
} from 'lucide-react';

export default function App() {
  // Persistence in localStorage
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('vn_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vn_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [entrepreneurAds, setEntrepreneurAds] = useState<EntrepreneurAd[]>(() => {
    const saved = localStorage.getItem('vn_ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [subagents, setSubagents] = useState<AiSubagent[]>(INITIAL_SUBAGENTS);
  const [metrics, setMetrics] = useState<PlatformMetrics>(INITIAL_METRICS);

  // User coordinates in Villa Nueva
  const [userCoords, setUserCoords] = useState<LatLng>(VILLA_NUEVA_CENTER);
  const [isGeoActive, setIsGeoActive] = useState(false);

  // Navigation state: website mode vs admin dedicated view
  const [currentView, setCurrentView] = useState<'website' | 'admin' | 'subagents'>('website');
  const [currentTab, setCurrentTab] = useState<string>('inicio');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZona, setSelectedZona] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'radar' | 'municipal'>('all');
  const [eventDisplayMode, setEventDisplayMode] = useState<'grid' | 'calendar'>('grid');

  // Modals
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [selectedShareEvent, setSelectedShareEvent] = useState<EventItem | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Función de control de acceso a Admin con contraseña
  const requestAdminAccess = () => {
    const isSessionActive = sessionStorage.getItem('radar_admin_session') === 'active';
    if (isSessionActive) {
      setCurrentView('admin');
      showToast('Sesión de administrador activa.');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    setCurrentView('admin');
    setUser(prev => ({ ...prev, role: 'admin' }));
    showToast('¡Acceso concedido al Panel de Administración!');
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('radar_admin_session');
    setCurrentView('website');
    setUser(prev => ({ ...prev, role: 'vecino' }));
    window.location.hash = '';
    showToast('Sesión de administrador cerrada con éxito.');
  };

  // Detección de ruta secreta (#admin, /admin, ?admin) y atajo de teclado Ctrl+Shift+A
  useEffect(() => {
    const evaluateAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || path === '/admin' || search.includes('admin=true')) {
        requestAdminAccess();
      }
    };

    evaluateAdminRoute();
    window.addEventListener('hashchange', evaluateAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo secreto: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        requestAdminAccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', evaluateAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vn_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('vn_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vn_ads', JSON.stringify(entrepreneurAds));
  }, [entrepreneurAds]);

  // Try fetching actual device GPS silently on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsGeoActive(true);
        },
        () => {
          setUserCoords(VILLA_NUEVA_CENTER);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const scrollToSection = (sectionId: string) => {
    setCurrentView('website');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesZona = selectedZona === 'all' || ev.zona === selectedZona;
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSource = 
      selectedSourceType === 'all' || 
      (selectedSourceType === 'radar' && (ev.sourceType === 'radar' || ev.organizer.type === 'Radar Villa Nueva (Exclusivo)')) ||
      (selectedSourceType === 'municipal' && (ev.sourceType === 'municipal' || ev.organizer.type === 'Alcaldía Villa Nueva'));

    return matchesSearch && matchesZona && matchesCategory && matchesSource;
  });

  const handleAddEntrepreneurAd = (newAd: EntrepreneurAd) => {
    setEntrepreneurAds(prev => [newAd, ...prev]);
    showToast(`¡Solicitud para "${newAd.businessName}" enviada con éxito! Folio: #${newAd.id.toUpperCase()}`);
  };

  const handleUpdateEntrepreneurAd = (updatedAd: EntrepreneurAd) => {
    setEntrepreneurAds(prev => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
  };

  const handleDeleteEntrepreneurAd = (adId: string) => {
    setEntrepreneurAds(prev => prev.filter(ad => ad.id !== adId));
  };

  // Handle RSVP
  const handleRsvp = (event: EventItem) => {
    const isAlreadyRsvp = user.rsvps.some(r => r.eventId === event.id);

    if (isAlreadyRsvp) {
      showToast(`Ya tienes tu pase reservado para "${event.title}". Revisa tu perfil.`);
      return;
    }

    const ticketCode = `RADAR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    // Update event counter
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, rsvpCount: e.rsvpCount + 1 } : e));

    // Update user profile
    setUser(prev => ({
      ...prev,
      rsvps: [
        ...prev.rsvps,
        {
          eventId: event.id,
          ticketCode,
          numPeople: 2,
          qrSimulated: ticketCode,
          registeredAt: new Date().toLocaleDateString('es-GT'),
        }
      ]
    }));

    // Update platform metrics
    setMetrics(prev => ({
      ...prev,
      totalRsvps: prev.totalRsvps + 1,
    }));

    showToast(`¡Pase confirmado para ${event.title}! Código: ${ticketCode}`);
    
    // Trigger push notification confirmation
    triggerBrowserPushNotification(
      '¡Pase Familiar Confirmado! 🎉',
      `Te esperamos en ${event.title} el ${event.date}. Código: ${ticketCode}`
    );
  };

  // Handle Proposing New Event
  const handleProposeEvent = (newEvent: EventItem) => {
    setEvents(prev => [newEvent, ...prev]);
    setIsProposeModalOpen(false);
    showToast(`¡Tu evento "${newEvent.title}" ha sido enviado y detectado en el radar!`);
  };

  // Admin Event Deletion / Update
  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Evento eliminado del radar municipal.');
  };

  const handleUpdateEvent = (updated: EventItem) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    showToast(`Evento "${updated.title}" actualizado con éxito.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF0] text-black font-sans selection:bg-[#FFE600] selection:text-black">
      
      {/* Toast Notification in 90s Pop Style */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFE600] text-black px-5 py-3.5 border-3 border-black shadow-[6px_6px_0_#000] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 text-xs sm:text-sm font-90s">
          <DragonRadarLogo size="sm" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header: Radar Villa Nueva */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('website');
            scrollToSection(tab);
          }
        }}
        user={user}
        onChangeUserRole={(newRole) => {
          setUser(prev => ({ ...prev, role: newRole }));
          showToast(`Rol cambiado a: ${newRole.toUpperCase()}`);
        }}
        onOpenProposeModal={() => setIsProposeModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdmin={requestAdminAccess}
        onOpenSocialModal={() => scrollToSection('redes-sociales')}
        unreadNotificationsCount={1}
      />

      {/* VIEW 1: Dedicated Admin Panel Workspace */}
      {currentView === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFE600] border-4 border-black p-5 shadow-[6px_6px_0_#000]">
            <div className="flex items-center gap-3">
              <DragonRadarLogo size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-90s text-black uppercase leading-tight">
                    Panel de Control & Admin
                  </h1>
                  <span className="px-2 py-0.5 bg-[#FF007F] text-white text-[10px] font-black uppercase border border-black shadow-[1.5px_1.5px_0_#000]">
                    Protegido
                  </span>
                </div>
                <p className="text-xs font-bold text-black">
                  Gestión integral de actividades, solicitudes de emprendedores y fotos en Radar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setCurrentView('website')}
                className="px-4 py-2.5 text-xs font-90s text-black bg-white hover:bg-[#00F0FF] border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>VER WEB PÚBLICA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogoutAdmin}
                className="px-4 py-2.5 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>CERRAR SESIÓN</span>
              </button>
            </div>
          </div>

          <AdminPanel
            events={events}
            currentUser={user}
            entrepreneurAds={entrepreneurAds}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onCreateEvent={handleProposeEvent}
            onUpdateAd={handleUpdateEntrepreneurAd}
            onDeleteAd={handleDeleteEntrepreneurAd}
          />
        </div>
      )}

      {/* VIEW 2: The Complete Living Website Landing & Exploration Experience */}
      {currentView === 'website' && (
        <main className="flex-1">
          {/* Section 1: Hero Section */}
          <HeroSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedZona={selectedZona}
            onZonaChange={setSelectedZona}
            onOpenCalendar={() => scrollToSection('calendario')}
            onOpenPropose={() => setIsProposeModalOpen(true)}
            onOpenShareModal={() => scrollToSection('redes-sociales')}
            onScrollToExplanation={() => scrollToSection('como-funciona')}
            onScrollToEvents={() => scrollToSection('eventos')}
            onScrollToSocial={() => scrollToSection('redes-sociales')}
            userCoords={userCoords}
            isGeoActive={isGeoActive}
            totalEventsCount={events.length}
          />

          {/* Section 2: Visual Explanation of Purpose ("¿Cómo funciona el Radar?") */}
          <HowItWorksSection
            onExploreEvents={() => scrollToSection('eventos')}
            onOpenShareModal={() => scrollToSection('redes-sociales')}
            onOpenPropose={() => setIsProposeModalOpen(true)}
          />

          {/* Section 3: Featured Events & Activity Showcase in 90s Pop Style */}
          <section id="eventos" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header and View Switcher */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-3 rotate-[-1deg]">
                  <DragonRadarLogo size="sm" />
                  <span>★ CATÁLOGO · RADAR ★</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
                  Actividades Detectadas en Radar
                </h2>
                <p className="mt-2 text-black text-sm sm:text-base font-bold">
                  Explora las actividades familiares, gastronómicas y deportivas en tu colonia con enlaces directos para llegar en Google Maps o Waze.
                </p>
              </div>

              {/* View Switch Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-white border-3 border-black shadow-[4px_4px_0_#000] shrink-0 text-xs font-90s">
                <button
                  onClick={() => setEventDisplayMode('grid')}
                  className={`px-4 py-2 border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    eventDisplayMode === 'grid'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0_#000]'
                      : 'border-transparent text-black hover:bg-slate-100'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>CUADRÍCULA</span>
                </button>
                <button
                  onClick={() => setEventDisplayMode('calendar')}
                  className={`px-4 py-2 border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    eventDisplayMode === 'calendar'
                      ? 'bg-[#FF007F] text-white border-black shadow-[2px_2px_0_#000]'
                      : 'border-transparent text-black hover:bg-slate-100'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>CALENDARIO</span>
                </button>
              </div>
            </div>

            {/* Source Switcher: Radar vs Municipal */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t-3 border-black">
              <span className="text-xs font-90s uppercase text-black mr-1 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-[#FF007F]" /> FUENTE:
              </span>
              {[
                { id: 'all', label: 'TODOS LOS EVENTOS' },
                { id: 'radar', label: '★ EXCLUSIVOS RADAR' },
                { id: 'municipal', label: '🏛️ MUNICIPALES OFICIALES' },
              ].map((src) => {
                const isActive = selectedSourceType === src.id;
                return (
                  <button
                    key={src.id}
                    onClick={() => setSelectedSourceType(src.id as any)}
                    className={`px-3.5 py-1.5 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? src.id === 'radar' 
                          ? 'bg-[#FF007F] text-white shadow-[3px_3px_0_#000] -translate-y-0.5'
                          : 'bg-[#00F0FF] text-black shadow-[3px_3px_0_#000] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-[#FFE600] shadow-[1.5px_1.5px_0_#000]'
                    }`}
                  >
                    {src.label}
                  </button>
                );
              })}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-90s uppercase text-black mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#00F0FF]" /> CATEGORÍA:
              </span>
              {[
                { id: 'all', label: 'TODAS LAS SEÑALES' },
                { id: 'Familiar', label: 'FAMILIARES' },
                { id: 'Gastronómico', label: 'GASTRONOMÍA' },
                { id: 'Deportivo', label: 'DEPORTES' },
                { id: 'Juventud y Arte', label: 'JUVENTUD & ARTE' },
                { id: 'Cultural', label: 'CULTURA' },
                { id: 'Ecológico', label: 'ECOLÓGICO' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#FFE600] text-black shadow-[3px_3px_0_#000] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-slate-100 shadow-[1.5px_1.5px_0_#000]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-View: Grid View (Default) */}
            {eventDisplayMode === 'grid' && (
              <>
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        userCoords={userCoords}
                        onSelect={(ev) => setSelectedEventModal(ev)}
                        onRsvp={handleRsvp}
                        onShare={(ev) => setSelectedShareEvent(ev)}
                        isSaved={user.savedEvents.includes(event.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white border-4 border-black space-y-4 max-w-md mx-auto shadow-[6px_6px_0_#000]">
                    <DragonRadarLogo size="lg" className="mx-auto" />
                    <h3 className="text-lg font-90s text-black uppercase">
                      Sin señales detectadas con estos filtros
                    </h3>
                    <p className="text-xs text-black font-bold">
                      Prueba seleccionando "Todos los Eventos" o "Todas las Zonas".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedZona('all');
                        setSelectedCategory('all');
                        setSelectedSourceType('all');
                      }}
                      className="px-5 py-2.5 text-xs font-90s bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer"
                    >
                      RESTABLECER FILTROS
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Sub-View: Calendar View */}
            {eventDisplayMode === 'calendar' && (
              <InteractiveCalendar
                events={filteredEvents}
                onSelectEvent={(ev) => setSelectedEventModal(ev)}
                onQuickRsvp={handleRsvp}
                onOpenShareModal={(ev) => setSelectedShareEvent(ev)}
              />
            )}
          </section>

          {/* Section 4: Entrepreneur Ads & Commercial Showcase ("Radar Emprendedores") */}
          <EntrepreneurAdsSection
            ads={entrepreneurAds}
            events={events}
            onSubmitAd={handleAddEntrepreneurAd}
            onSelectEvent={(ev) => setSelectedEventModal(ev)}
          />

          {/* Section 5: Social Promotion Studio */}
          <SocialPromotionHub
            events={events}
            onOpenEventModal={(ev) => setSelectedEventModal(ev)}
          />

          {/* Section 5: Full Interactive Calendar Section */}
          <section id="calendario" className="py-14 sm:py-20 bg-white border-b-4 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-3 rotate-[-1deg]">
                  <CalendarDays className="w-3.5 h-3.5 text-black" />
                  <span>PLANIFICACIÓN MENSUAL</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
                  Calendario de Actividades en Villa Nueva
                </h2>
                <p className="mt-2 text-black text-sm sm:text-base font-bold">
                  Navega por días y fines de semana para planificar tus salidas en familia.
                </p>
              </div>

              <InteractiveCalendar
                events={events}
                onSelectEvent={(ev) => setSelectedEventModal(ev)}
                onQuickRsvp={handleRsvp}
                onOpenShareModal={(ev) => setSelectedShareEvent(ev)}
              />
            </div>
          </section>

          {/* Section 6: Platform Statistics & Civic Impact */}
          <section id="estadisticas" className="py-14 sm:py-20 bg-[#FFFDF0] bg-grid-90s border-b-4 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00F0FF] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-3 rotate-[-1deg]">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>TRANSPARENCIA & PARTICIPACIÓN</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
                  Impacto en Números
                </h2>
                <p className="mt-2 text-black text-sm sm:text-base font-bold">
                  Datos en tiempo real sobre la afluencia familiar proyectada y participación en las 12 zonas de Villa Nueva.
                </p>
              </div>

              <PlatformStats
                metrics={metrics}
                events={events}
              />
            </div>
          </section>
        </main>
      )}

      {/* Retro Footer */}
      <footer className="bg-black text-white py-14 border-t-4 border-[#FFE600] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Col 1: Brand & Dragon Radar Motif */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <DragonRadarLogo size="md" />
                <div>
                  <span className="text-xl font-90s text-[#FFE600] block tracking-wide">
                    RADAR
                  </span>
                  <span className="text-[10px] uppercase font-90s tracking-wider text-[#00F0FF] block">
                    PLATAFORMA OFICIAL DE EVENTOS
                  </span>
                </div>
              </div>
              <p className="text-white/80 font-medium leading-relaxed text-xs sm:text-sm max-w-sm">
                Promoviendo eventos familiares, culturales y gastronómicos en las 12 zonas de Villa Nueva, Guatemala. Rutas directas a Google Maps y Waze, y espacio publicitario para emprendedores locales.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://whatsapp.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-[#25D366] text-black border-2 border-black font-90s shadow-[2px_2px_0_#FFE600] hover:bg-white transition-colors"
                  title="WhatsApp Comunitario"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <button
                  onClick={() => scrollToSection('redes-sociales')}
                  className="px-3.5 py-1.5 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s border-2 border-black shadow-[2px_2px_0_#FFF] transition-all text-xs cursor-pointer"
                >
                  DIFUSIÓN SOCIAL ★
                </button>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-90s uppercase tracking-wider text-[#FFE600]">
                ★ NAVEGACIÓN
              </h4>
              <ul className="space-y-2 text-white/80 font-bold">
                <li><a href="#inicio" onClick={() => scrollToSection('inicio')} className="hover:text-[#FFE600] transition-colors">Inicio</a></li>
                <li><a href="#como-funciona" onClick={() => scrollToSection('como-funciona')} className="hover:text-[#FFE600] transition-colors">¿Cómo Funciona?</a></li>
                <li><a href="#eventos" onClick={() => scrollToSection('eventos')} className="hover:text-[#FFE600] transition-colors">Eventos en Radar</a></li>
                <li><a href="#emprendedores" onClick={() => scrollToSection('emprendedores')} className="hover:text-[#FF007F] text-[#CCFF00] transition-colors">Emprendedores & Ads</a></li>
                <li><a href="#calendario" onClick={() => scrollToSection('calendario')} className="hover:text-[#FFE600] transition-colors">Calendario Mensual</a></li>
                <li><a href="#redes-sociales" onClick={() => scrollToSection('redes-sociales')} className="hover:text-[#FFE600] transition-colors">Estudio Social</a></li>
                <li><a href="#estadisticas" onClick={() => scrollToSection('estadisticas')} className="hover:text-[#FFE600] transition-colors">Impacto & Estadísticas</a></li>
              </ul>
            </div>

            {/* Col 3: Emergency & PMT in 90s style */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-90s uppercase tracking-wider text-[#00F0FF]">
                ★ EMERGENCIAS & PMT
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0_#FF007F] space-y-1">
                  <div className="font-90s text-xs flex items-center justify-between">
                    <span>POLICÍA MUNICIPAL TRÁNSITO (PMT)</span>
                    <span className="bg-black text-[#FFE600] px-1.5 py-0.5 text-sm">1531</span>
                  </div>
                  <p className="text-[11px] font-bold">
                    Asistencia vial y parqueos en actividades masivas de Villa Nueva.
                  </p>
                </div>

                <div className="p-3 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#00F0FF] space-y-1">
                  <div className="font-90s text-xs flex items-center justify-between">
                    <span>BOMBEROS VOLUNTARIOS 29 CÍA.</span>
                    <span className="bg-black text-white px-1.5 py-0.5 text-sm">122</span>
                  </div>
                  <p className="text-[11px] font-bold">
                    Cobertura preventiva para festivales y carreras deportivas.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Credits */}
          <div className="pt-6 border-t-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/70 font-bold">
            <div className="flex items-center gap-2">
              <DragonRadarLogo size="sm" />
              <span>© 2026 Radar · Villa Nueva, Guatemala.</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsProposeModalOpen(true)}
                className="hover:text-[#FFE600] transition-colors cursor-pointer"
              >
                Proponer Evento
              </button>
              <span>·</span>
              <a href="#inicio" onClick={() => scrollToSection('inicio')} className="hover:text-[#FF007F] transition-colors flex items-center gap-1">
                <span>Subir al inicio</span>
                <ArrowUp className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedEventModal && (
        <EventModal
          event={selectedEventModal}
          isOpen={!!selectedEventModal}
          userCoords={userCoords}
          user={user}
          onClose={() => setSelectedEventModal(null)}
          onConfirmRsvp={(eventId, count) => {
            const ev = events.find(e => e.id === eventId);
            if (ev) handleRsvp(ev);
          }}
          onOpenShare={(ev: EventItem) => {
            setSelectedEventModal(null);
            setSelectedShareEvent(ev);
          }}
        />
      )}

      {selectedShareEvent && (
        <SocialShareModal
          event={selectedShareEvent}
          isOpen={!!selectedShareEvent}
          onClose={() => setSelectedShareEvent(null)}
        />
      )}

      {isProposeModalOpen && (
        <ProposeEventModal
          isOpen={isProposeModalOpen}
          onClose={() => setIsProposeModalOpen(false)}
          onSubmitEvent={handleProposeEvent}
          user={user}
        />
      )}

      {isProfileModalOpen && (
        <UserAuthModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdateUser={setUser}
          events={events}
        />
      )}

      {/* Secret Password-Protected Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => {
          setIsAdminAuthModalOpen(false);
          if (window.location.hash.toLowerCase() === '#admin') {
            window.location.hash = '';
          }
        }}
        onSuccess={handleAdminAuthSuccess}
      />

    </div>
  );
}
