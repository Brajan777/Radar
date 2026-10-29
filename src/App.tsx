import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { 
  INITIAL_EVENTS, 
  INITIAL_SUBAGENTS, 
  INITIAL_USER, 
  INITIAL_METRICS,
  INITIAL_ADS,
  RADAR_SUR_CENTER,
  VILLA_NUEVA_CENTER
} from './data/initialData';
import { EventItem, UserProfile, PlatformMetrics, AiSubagent, EntrepreneurAd } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EntrepreneurAdsSection } from './components/EntrepreneurAdsSection';
import { EventCard } from './components/EventCard';
import { PlatformStats } from './components/PlatformStats';
import { DragonRadarLogo } from './components/DragonRadarLogo';
import { WhatsAppCommunityBar, FloatingWhatsAppButton } from './components/WhatsAppCommunityBar';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { triggerBrowserPushNotification, calculateDistanceKm, LatLng } from './utils/geo';
import { 
  saveEntrepreneurToSupabase, 
  fetchEntrepreneursFromSupabase, 
  updateEntrepreneurStatusInSupabase, 
  deleteEntrepreneurFromSupabase,
  getSupabaseConfig 
} from './lib/supabase';
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
  LogOut,
  Ticket,
  Flame,
  Utensils,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  LocateFixed
} from 'lucide-react';

// Code-Splitting con React.lazy para optimizar la velocidad y el bundle inicial en móviles
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const BusinessPortal = React.lazy(() => import('./components/BusinessPortal').then(m => ({ default: m.BusinessPortal })));
const InteractiveCalendar = React.lazy(() => import('./components/InteractiveCalendar').then(m => ({ default: m.InteractiveCalendar })));
const EventModal = React.lazy(() => import('./components/EventModal').then(m => ({ default: m.EventModal })));
const ProposeEventModal = React.lazy(() => import('./components/ProposeEventModal').then(m => ({ default: m.ProposeEventModal })));
const UserAuthModal = React.lazy(() => import('./components/UserAuthModal').then(m => ({ default: m.UserAuthModal })));
const SocialShareModal = React.lazy(() => import('./components/SocialShareModal').then(m => ({ default: m.SocialShareModal })));
const AdminAuthModal = React.lazy(() => import('./components/AdminAuthModal').then(m => ({ default: m.AdminAuthModal })));
const FloatingConcierge = React.lazy(() => import('./components/FloatingConcierge').then(m => ({ default: m.FloatingConcierge })));

export default function App() {
  // Estados directos en memoria (sin localStorage para garantizar siempre los datos más recientes en Vercel)
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [entrepreneurAds, setEntrepreneurAds] = useState<EntrepreneurAd[]>(INITIAL_ADS);

  const [subagents, setSubagents] = useState<AiSubagent[]>(INITIAL_SUBAGENTS);
  const [metrics, setMetrics] = useState<PlatformMetrics>(INITIAL_METRICS);

  // User coordinates centered in Radar Sur hub (El Frutal / Álamos)
  const [userCoords, setUserCoords] = useState<LatLng>(RADAR_SUR_CENTER);
  const [isGeoActive, setIsGeoActive] = useState(false);

  // Navigation state: website mode vs admin dedicated view vs business portal
  const [currentView, setCurrentView] = useState<'website' | 'admin' | 'subagents' | 'business-portal'>('website');
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('inicio');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('all');
  const [selectedZona, setSelectedZona] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'radar' | 'municipal'>('all');
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [eventDisplayMode, setEventDisplayMode] = useState<'grid' | 'calendar'>('grid');

  // Estados de optimización de rendimiento, orden por proximidad y filtros colapsables
  const [sortByProximity, setSortByProximity] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showWhatsAppCommunityBar, setShowWhatsAppCommunityBar] = useState(true);

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

  // Detección de rutas (#admin, #negocio, #portal) y atajo de teclado Ctrl+Shift+A
  useEffect(() => {
    const evaluateRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || path === '/admin' || search.includes('admin=true')) {
        requestAdminAccess();
      } else if (
        hash === '#negocio' || 
        hash === '#portal' || 
        hash === '#negocios' || 
        hash === '#business' || 
        path === '/portal' || 
        path === '/negocio'
      ) {
        setCurrentView('business-portal');
      }
    };

    evaluateRoute();
    window.addEventListener('hashchange', evaluateRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo secreto: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        requestAdminAccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', evaluateRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Limpieza defensiva de cualquier clave antigua guardada previamente en navegadores
  useEffect(() => {
    try {
      localStorage.removeItem('vn_events');
      localStorage.removeItem('vn_ads');
      localStorage.removeItem('vn_user');
      localStorage.removeItem('radar_sur_events');
      localStorage.removeItem('radar_sur_ads');
      localStorage.removeItem('radar_sur_user');
      localStorage.removeItem('radar_sur_migrated_v2');
    } catch {
      // Ignorar si el entorno bloquea storage
    }
  }, []);

  // Try fetching actual device GPS silently on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsGeoActive(true);
        },
        () => {
          setUserCoords(RADAR_SUR_CENTER);
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

  // Filter events across the 3 Municipalities & Moments
  const filteredEvents = events.filter((ev) => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.municipio && ev.municipio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMunicipio = selectedMunicipio === 'all' || ev.municipio === selectedMunicipio;
    const matchesZona = selectedZona === 'all' || ev.zona === selectedZona;
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSource = 
      selectedSourceType === 'all' || 
      (selectedSourceType === 'radar' && (ev.sourceType === 'radar' || ev.organizer?.type?.includes('Radar'))) ||
      (selectedSourceType === 'municipal' && (ev.sourceType === 'municipal' || ev.organizer?.type?.includes('Alcaldía')));

    let matchesQuick = true;
    if (quickFilter === 'today') {
      // Coincidencias con hoy o fechas activas de la temporada
      const todayIso = new Date().toISOString().split('T')[0];
      matchesQuick = ev.date === todayIso || ['2026-10-23', '2026-10-24', '2026-10-25', '2026-10-28', '2026-10-31', '2026-11-01'].includes(ev.date);
    } else if (quickFilter === 'eat_now') {
      matchesQuick = ev.category === 'Gastronómico' || ev.tags.some(t => 
        t.toLowerCase().includes('gastro') || 
        t.toLowerCase().includes('comida') || 
        t.toLowerCase().includes('chuchito') || 
        t.toLowerCase().includes('fiambre') || 
        t.toLowerCase().includes('sabor')
      );
    } else if (quickFilter === 'free') {
      matchesQuick = ev.cost.toLowerCase().includes('gratis') || ev.cost.toLowerCase().includes('libre');
    } else if (quickFilter === 'sports') {
      matchesQuick = ev.category === 'Deportivo' || ev.tags.some(t => t.toLowerCase().includes('bici') || t.toLowerCase().includes('fútbol'));
    } else if (quickFilter === 'gastro') {
      matchesQuick = ev.category === 'Gastronómico' || ev.tags.some(t => t.toLowerCase().includes('gastronomía') || t.toLowerCase().includes('chuchito') || t.toLowerCase().includes('piña') || t.toLowerCase().includes('mango'));
    } else if (quickFilter === 'weekend') {
      matchesQuick = ['2026-10-23', '2026-10-24', '2026-10-25'].includes(ev.date);
    }

    return matchesSearch && matchesMunicipio && matchesZona && matchesCategory && matchesSource && matchesQuick;
  });

  // Toggle de ordenamiento 1-toque por proximidad GPS
  const toggleProximitySort = () => {
    if (!sortByProximity) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setIsGeoActive(true);
            setSortByProximity(true);
            showToast('📍 ¡Ordenado por cercanía a tu ubicación GPS actual!');
          },
          () => {
            setSortByProximity(true);
            showToast('📍 Ordenado por cercanía al centro neurálgico del Sur.');
          },
          { timeout: 6000 }
        );
      } else {
        setSortByProximity(true);
      }
    } else {
      setSortByProximity(false);
      showToast('Orden estándar restaurado.');
    }
  };

  // Eventos ordenados en memoria para máximo rendimiento
  const displayEvents = useMemo(() => {
    if (!sortByProximity) return filteredEvents;
    return [...filteredEvents].sort((a, b) => {
      const distA = calculateDistanceKm(userCoords, a.coordinates);
      const distB = calculateDistanceKm(userCoords, b.coordinates);
      return distA - distB;
    });
  }, [filteredEvents, sortByProximity, userCoords]);

  // Sincronización automática de emprendedores registrados en Supabase
  useEffect(() => {
    let isMounted = true;
    const syncFromSupabase = async () => {
      try {
        const { success, ads } = await fetchEntrepreneursFromSupabase();
        if (isMounted && success && ads.length > 0) {
          setEntrepreneurAds(prev => {
            const map = new Map<string, EntrepreneurAd>();
            prev.forEach(ad => map.set(ad.id, ad));
            ads.forEach(ad => map.set(ad.id, ad));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Sincronización con Supabase no completada:', err);
      }
    };
    syncFromSupabase();
    return () => { isMounted = false; };
  }, []);

  const handleSyncSupabase = async () => {
    try {
      const { success, ads, error } = await fetchEntrepreneursFromSupabase();
      if (success) {
        if (ads.length > 0) {
          setEntrepreneurAds(prev => {
            const map = new Map<string, EntrepreneurAd>();
            prev.forEach(ad => map.set(ad.id, ad));
            ads.forEach(ad => map.set(ad.id, ad));
            return Array.from(map.values());
          });
        }
        showToast(`⚡ ¡Sincronizado con Supabase! ${ads.length} solicitudes activas.`);
      } else {
        showToast(`Aviso Supabase: ${error || 'Verifica tus credenciales en el panel.'}`);
      }
    } catch (err: any) {
      showToast(`Error de conexión con Supabase: ${err?.message || 'Revisa tu conexión'}`);
    }
  };

  const handleAddEntrepreneurAd = async (newAd: EntrepreneurAd) => {
    // 1. Actualización optimista inmediata en memoria
    setEntrepreneurAds(prev => [newAd, ...prev]);

    // 2. Persistencia en Supabase
    try {
      const result = await saveEntrepreneurToSupabase(newAd);
      if (result.isStoredInSupabase) {
        showToast(`⚡ ¡Guardado en Supabase! Solicitud de "${newAd.businessName}" registrada (Folio: #${newAd.id.toUpperCase()})`);
      } else {
        showToast(`¡Solicitud para "${newAd.businessName}" registrada! Folio: #${newAd.id.toUpperCase()}`);
      }
    } catch {
      showToast(`¡Solicitud para "${newAd.businessName}" registrada con éxito!`);
    }
  };

  const handleUpdateEntrepreneurAd = async (updatedAd: EntrepreneurAd) => {
    setEntrepreneurAds(prev => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
    try {
      await updateEntrepreneurStatusInSupabase(updatedAd.id, updatedAd.status, updatedAd.verifiedBadge);
    } catch (err) {
      console.warn('No se pudo actualizar estado en Supabase:', err);
    }
  };

  const handleDeleteEntrepreneurAd = async (adId: string) => {
    setEntrepreneurAds(prev => prev.filter(ad => ad.id !== adId));
    try {
      await deleteEntrepreneurFromSupabase(adId);
    } catch (err) {
      console.warn('No se pudo eliminar en Supabase:', err);
    }
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

      {/* PWA Smart Install Banner */}
      <PwaInstallBanner />

      {/* Global Navigation Header: Radar Sur */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'admin') {
            setCurrentView('admin');
          } else if (tab === 'calendario') {
            setEventDisplayMode('calendar');
            scrollToSection('eventos');
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
        onOpenSocialModal={() => scrollToSection('eventos')}
        unreadNotificationsCount={1}
      />

      {/* WhatsApp Community VIP Callout Bar (High Conversion) */}
      {showWhatsAppCommunityBar && currentView === 'website' && (
        <WhatsAppCommunityBar onDismiss={() => setShowWhatsAppCommunityBar(false)} />
      )}

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

          <Suspense fallback={
            <div className="p-12 text-center bg-white border-4 border-black font-90s text-black text-sm shadow-[4px_4px_0_#000]">
              <DragonRadarLogo size="md" className="mx-auto mb-2" />
              <span>CARGANDO PANEL DE ADMINISTRACIÓN...</span>
            </div>
          }>
            <AdminPanel
              events={events}
              currentUser={user}
              entrepreneurAds={entrepreneurAds}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onCreateEvent={handleProposeEvent}
              onUpdateAd={handleUpdateEntrepreneurAd}
              onDeleteAd={handleDeleteEntrepreneurAd}
              onSyncSupabase={handleSyncSupabase}
              onOpenBusinessPortal={(bId) => {
                setActiveBusinessId(bId);
                setCurrentView('business-portal');
                window.location.hash = '#negocio';
              }}
            />
          </Suspense>
        </div>
      )}

      {/* VIEW 2: Dedicated Business Portal Workspace for Entrepreneurs & Coupons */}
      {currentView === 'business-portal' && (
        <Suspense fallback={
          <div className="p-12 text-center bg-white border-4 border-black font-90s text-black text-sm shadow-[4px_4px_0_#000] max-w-lg mx-auto my-12">
            <DragonRadarLogo size="md" className="mx-auto mb-2" />
            <span>CARGANDO PORTAL DE NEGOCIOS...</span>
          </div>
        }>
          <BusinessPortal
            businessAds={entrepreneurAds}
            activeBusinessId={activeBusinessId}
            events={events}
            onSelectBusiness={(id) => setActiveBusinessId(id)}
            onUpdateBusiness={handleUpdateEntrepreneurAd}
            onExitPortal={() => {
              setCurrentView('website');
              window.location.hash = '';
            }}
            onGoToRegister={() => {
              setCurrentView('website');
              window.location.hash = '#emprendedores';
              scrollToSection('emprendedores');
            }}
          />
        </Suspense>
      )}

      {/* VIEW 3: The Complete Living Website Landing & Exploration Experience */}
      {currentView === 'website' && (
        <main className="flex-1">
          {/* Section 1: Hero Section */}
          <HeroSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMunicipio={selectedMunicipio}
            onMunicipioChange={setSelectedMunicipio}
            selectedZona={selectedZona}
            onZonaChange={setSelectedZona}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            onOpenCalendar={() => {
              setEventDisplayMode('calendar');
              scrollToSection('eventos');
            }}
            onOpenPropose={() => setIsProposeModalOpen(true)}
            onOpenShareModal={() => scrollToSection('eventos')}
            onScrollToExplanation={() => scrollToSection('eventos')}
            onScrollToEvents={() => scrollToSection('eventos')}
            onScrollToSocial={() => scrollToSection('eventos')}
            userCoords={userCoords}
            isGeoActive={isGeoActive}
            totalEventsCount={events.length}
          />

          {/* Section 2: Featured Events & Activity Showcase in 90s Pop Style */}
          <section id="eventos" className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
            {/* Header and View Switcher */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-2 rotate-[-1deg]">
                  <DragonRadarLogo size="sm" />
                  <span>★ AGENDA SUR · 3 MUNICIPIOS ★</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
                  Actividades Detectadas en Radar Sur
                </h2>
                <p className="mt-1 text-black text-xs sm:text-base font-bold">
                  Encuentra planes familiares, gastronomía y eventos en Villa Nueva, San Miguel Petapa y Villa Canales con rutas directas en Maps/Waze.
                </p>
              </div>

              {/* View Switch Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-white border-3 border-black shadow-[4px_4px_0_#000] shrink-0 text-xs font-90s self-start md:self-auto">
                <button
                  onClick={() => setEventDisplayMode('grid')}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
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
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
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

            {/* Fast 1-Touch Impulse Bar & Proximity Sorting (Mobile-Optimized) */}
            <div className="p-3 sm:p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] space-y-3">
              
              {/* Row 1: Fast Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[11px] font-90s text-black uppercase shrink-0 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#FF007F]" /> RÁPIDOS:
                </span>

                <button
                  onClick={() => setQuickFilter(quickFilter === 'today' ? 'all' : 'today')}
                  className={`px-3 py-1.5 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    quickFilter === 'today'
                      ? 'bg-[#FF007F] text-white shadow-[2px_2px_0_#000] -translate-y-0.5'
                      : 'bg-white text-black hover:bg-[#FFE600]'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>🔥 HOY EN EL SUR</span>
                </button>

                <button
                  onClick={() => setQuickFilter(quickFilter === 'eat_now' ? 'all' : 'eat_now')}
                  className={`px-3 py-1.5 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    quickFilter === 'eat_now'
                      ? 'bg-[#CCFF00] text-black shadow-[2px_2px_0_#000] -translate-y-0.5'
                      : 'bg-white text-black hover:bg-[#CCFF00]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5 text-black" />
                  <span>🍴 COMER AHORA</span>
                </button>

                <button
                  onClick={toggleProximitySort}
                  className={`px-3 py-1.5 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    sortByProximity
                      ? 'bg-[#00F0FF] text-black shadow-[2px_2px_0_#000] -translate-y-0.5'
                      : 'bg-white text-black hover:bg-[#00F0FF]'
                  }`}
                  title="Ordenar por proximidad física a tu ubicación GPS"
                >
                  <LocateFixed className="w-3.5 h-3.5 text-black" />
                  <span>📍 {sortByProximity ? 'CERCA DE MÍ (ACTIVO)' : 'CERCA DE MÍ'}</span>
                </button>

                <button
                  onClick={() => setQuickFilter(quickFilter === 'free' ? 'all' : 'free')}
                  className={`px-3 py-1.5 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer ${
                    quickFilter === 'free'
                      ? 'bg-[#FFE600] text-black shadow-[2px_2px_0_#000] -translate-y-0.5'
                      : 'bg-white text-black hover:bg-[#FFE600]'
                  }`}
                >
                  <span>GRATIS</span>
                </button>

                <button
                  onClick={() => setQuickFilter(quickFilter === 'weekend' ? 'all' : 'weekend')}
                  className={`px-3 py-1.5 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer ${
                    quickFilter === 'weekend'
                      ? 'bg-black text-[#FFE600] shadow-[2px_2px_0_#000] -translate-y-0.5'
                      : 'bg-white text-black hover:bg-slate-100'
                  }`}
                >
                  <span>ESTE FINDE</span>
                </button>
              </div>

              {/* Row 2: Municipality Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t-2 border-black/15">
                <span className="text-[11px] font-90s uppercase text-black mr-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF007F]" /> MUNICIPIO:
                </span>
                {[
                  { id: 'all', label: '★ TODO EL SUR' },
                  { id: 'Villa Nueva', label: 'VILLA NUEVA' },
                  { id: 'San Miguel Petapa', label: 'PETAPA' },
                  { id: 'Villa Canales', label: 'VILLA CANALES' },
                ].map((muni) => {
                  const isActive = selectedMunicipio === muni.id;
                  return (
                    <button
                      key={muni.id}
                      onClick={() => {
                        setSelectedMunicipio(muni.id);
                        setSelectedZona('all');
                      }}
                      className={`px-3 py-1 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-black text-[#FFE600] shadow-[2px_2px_0_#000] -translate-y-0.5'
                          : 'bg-white text-black hover:bg-[#FFE600]'
                      }`}
                    >
                      {muni.label}
                    </button>
                  );
                })}

                {/* Collapsible Toggle Button for Advanced Filters */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`ml-auto px-3 py-1 text-xs font-90s border-2 border-black transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    showAdvancedFilters || selectedCategory !== 'all' || selectedSourceType !== 'all' || selectedZona !== 'all'
                      ? 'bg-[#FFE600] text-black shadow-[2px_2px_0_#000]'
                      : 'bg-slate-100 text-black hover:bg-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>FILTROS AVANZADOS</span>
                  {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Collapsible Advanced Filters Drawer */}
              {showAdvancedFilters && (
                <div className="pt-3 border-t-2 border-black/20 space-y-3 bg-[#FFFDF0] p-3 border-2 border-black mt-2">
                  {/* Category Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-90s uppercase text-black mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-[#00F0FF]" /> CATEGORÍA:
                    </span>
                    {[
                      { id: 'all', label: 'TODAS' },
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
                          className={`px-2.5 py-0.5 text-[11px] font-90s border border-black cursor-pointer ${
                            isActive ? 'bg-[#FFE600] text-black shadow-[1px_1px_0_#000]' : 'bg-white text-black hover:bg-slate-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Source Switcher */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-90s uppercase text-black mr-1 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-[#FF007F]" /> FUENTE:
                    </span>
                    {[
                      { id: 'all', label: 'TODAS LAS FUENTES' },
                      { id: 'radar', label: '★ EXCLUSIVOS RADAR' },
                      { id: 'municipal', label: '🏛️ ALCALDÍAS MUNICIPALES' },
                    ].map((src) => {
                      const isActive = selectedSourceType === src.id;
                      return (
                        <button
                          key={src.id}
                          onClick={() => setSelectedSourceType(src.id as any)}
                          className={`px-2.5 py-0.5 text-[11px] font-90s border border-black cursor-pointer ${
                            isActive ? 'bg-[#00F0FF] text-black shadow-[1px_1px_0_#000]' : 'bg-white text-black hover:bg-slate-100'
                          }`}
                        >
                          {src.label}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedSourceType('all');
                        setSelectedZona('all');
                        setSearchQuery('');
                      }}
                      className="ml-auto text-[10px] font-90s text-red-600 underline cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Sub-View: Grid View (Default) */}
            {eventDisplayMode === 'grid' && (
              <>
                {displayEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {displayEvents.map((event) => (
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
                  <div className="p-10 text-center bg-white border-4 border-black space-y-4 max-w-md mx-auto shadow-[6px_6px_0_#000]">
                    <DragonRadarLogo size="lg" className="mx-auto" />
                    <h3 className="text-base sm:text-lg font-90s text-black uppercase">
                      Sin actividades detectadas
                    </h3>
                    <p className="text-xs text-black font-bold">
                      Prueba seleccionando "Todo el Sur" o desactivando filtros activos.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedMunicipio('all');
                        setSelectedZona('all');
                        setSelectedCategory('all');
                        setSelectedSourceType('all');
                        setQuickFilter('all');
                        setSortByProximity(false);
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
              <Suspense fallback={
                <div className="p-12 text-center bg-white border-4 border-black font-90s text-black text-sm">
                  CARGANDO CALENDARIO...
                </div>
              }>
                <InteractiveCalendar
                  events={displayEvents}
                  onSelectEvent={(ev) => setSelectedEventModal(ev)}
                  onQuickRsvp={handleRsvp}
                  onOpenShareModal={(ev) => setSelectedShareEvent(ev)}
                />
              </Suspense>
            )}
          </section>

          {/* Section 3: Entrepreneur Ads & Commercial Showcase ("Radar Emprendedores") */}
          <EntrepreneurAdsSection
            ads={entrepreneurAds}
            events={events}
            onSubmitAd={handleAddEntrepreneurAd}
            onSelectEvent={(ev) => setSelectedEventModal(ev)}
            onOpenBusinessPortal={() => {
              setCurrentView('business-portal');
              window.location.hash = '#negocio';
            }}
          />

          {/* Section 4: Platform Statistics & Civic Impact */}
          <section id="estadisticas" className="py-12 sm:py-16 bg-[#FFFDF0] bg-grid-90s border-b-4 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00F0FF] border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s text-black mb-2 rotate-[-1deg]">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>TRANSPARENCIA & PARTICIPACIÓN SUR</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-90s text-black uppercase tracking-tight leading-tight">
                  Impacto en Números
                </h2>
                <p className="mt-1 text-black text-xs sm:text-base font-bold">
                  Datos en tiempo real sobre la afluencia familiar proyectada y participación ciudadana en Villa Nueva, San Miguel Petapa y Villa Canales.
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
                    RADAR SUR
                  </span>
                  <span className="text-[10px] uppercase font-90s tracking-wider text-[#00F0FF] block">
                    ALIANZA INTERMUNICIPAL · 3 MUNICIPIOS
                  </span>
                </div>
              </div>
              <p className="text-white/80 font-medium leading-relaxed text-xs sm:text-sm max-w-sm">
                Promoviendo eventos familiares, culturales, deportivos y gastronómicos en Villa Nueva, San Miguel Petapa y Villa Canales. Rutas directas en Google Maps y Waze, cupones QR y vitrina comercial para emprendedores del sur.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://whatsapp.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-[#25D366] text-black border-2 border-black font-90s shadow-[2px_2px_0_#FFE600] hover:bg-white transition-colors"
                  title="WhatsApp Comunitario Radar Sur"
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
                <li><a href="#eventos" onClick={() => scrollToSection('eventos')} className="hover:text-[#FFE600] transition-colors">Eventos en Radar</a></li>
                <li><a href="#emprendedores" onClick={() => scrollToSection('emprendedores')} className="hover:text-[#FF007F] text-[#CCFF00] transition-colors">Emprendedores & Cupones QR</a></li>
                <li>
                  <button 
                    onClick={() => {
                      setEventDisplayMode('calendar');
                      scrollToSection('eventos');
                    }} 
                    className="hover:text-[#FFE600] transition-colors text-left cursor-pointer"
                  >
                    Calendario Mensual
                  </button>
                </li>
                <li><a href="#estadisticas" onClick={() => scrollToSection('estadisticas')} className="hover:text-[#FFE600] transition-colors">Impacto & Estadísticas</a></li>
                <li>
                  <button 
                    onClick={requestAdminAccess} 
                    className="hover:text-[#00F0FF] text-[#00F0FF] transition-colors text-left cursor-pointer"
                  >
                    Panel Admin (Redes & Eventos)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Emergency & PMT in 90s style */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-90s uppercase tracking-wider text-[#00F0FF]">
                ★ EMERGENCIAS & PMT (3 MUNICIPIOS)
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0_#FF007F] space-y-1">
                  <div className="font-90s text-[11px] flex items-center justify-between">
                    <span>PMT VILLA NUEVA</span>
                    <span className="bg-black text-[#FFE600] px-1.5 py-0.5 text-xs">1531</span>
                  </div>
                  <p className="text-[10px] font-bold">
                    Asistencia vial y parqueos en CA-9 y Bulevar Los Reformadores.
                  </p>
                </div>

                <div className="p-2.5 bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0_#000] space-y-1">
                  <div className="font-90s text-[11px] flex items-center justify-between">
                    <span>PMT SAN MIGUEL PETAPA</span>
                    <span className="bg-black text-[#00F0FF] px-1.5 py-0.5 text-xs">1550</span>
                  </div>
                  <p className="text-[10px] font-bold">
                    Control de tránsito en Bulevar El Frutal, Álamos y Villa Hermosa.
                  </p>
                </div>

                <div className="p-2.5 bg-[#CCFF00] text-black border-2 border-black shadow-[3px_3px_0_#000] space-y-1">
                  <div className="font-90s text-[11px] flex items-center justify-between">
                    <span>PMT VILLA CANALES</span>
                    <span className="bg-black text-[#CCFF00] px-1.5 py-0.5 text-xs">1545</span>
                  </div>
                  <p className="text-[10px] font-bold">
                    Vigilancia en Boca del Monte, Centro y carretera a Santa Elena Barillas.
                  </p>
                </div>

                <div className="p-2.5 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#00F0FF] space-y-1">
                  <div className="font-90s text-[11px] flex items-center justify-between">
                    <span>BOMBEROS VOLUNTARIOS (SUR)</span>
                    <span className="bg-black text-white px-1.5 py-0.5 text-xs">122</span>
                  </div>
                  <p className="text-[10px] font-bold">
                    29 Cía. Villa Nueva, Petapa y Villa Canales. Cobertura preventiva 24/7.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Credits */}
          <div className="pt-6 border-t-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/70 font-bold">
            <div className="flex items-center gap-2">
              <DragonRadarLogo size="sm" />
              <span>© 2026 RADAR SUR · Villa Nueva · San Miguel Petapa · Villa Canales, Guatemala.</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button 
                onClick={() => {
                  setCurrentView('business-portal');
                  window.location.hash = '#negocio';
                }}
                className="hover:text-[#CCFF00] text-[#00F0FF] font-90s flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Acceso exclusivo para dueños de negocios para canjear cupones"
              >
                <Store className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>Portal de Negocios & Cupones</span>
              </button>
              <span>·</span>
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

      {/* Modals & Overlays envueltos en Suspense para carga diferida ultrarrápida */}
      <Suspense fallback={null}>
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

        {/* Floating Interactive AI Concierge Widget */}
        <FloatingConcierge user={user} />
      </Suspense>

      {/* Floating High-Converting WhatsApp VIP Button */}
      {currentView === 'website' && <FloatingWhatsAppButton />}

    </div>
  );
}
