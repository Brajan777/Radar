import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  AlertCircle,
  Wand2,
  Zap
} from 'lucide-react';
import { EventItem, EventCategory, VillaNuevaZona, UserProfile } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface ProposeEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSubmitEvent: (newEvent: EventItem) => void;
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

const CATEGORIES: EventCategory[] = [
  'Familiar',
  'Cultural',
  'Deportivo',
  'Gastronómico',
  'Juventud y Arte',
  'Ferias y Mercados',
  'Ecológico',
];

export const ProposeEventModal: React.FC<ProposeEventModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmitEvent,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Familiar');
  const [zona, setZona] = useState<VillaNuevaZona>('Zona 1 - Centro Histórico');
  const [date, setDate] = useState('2026-11-05');
  const [time, setTime] = useState('09:00 AM - 02:00 PM');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('Gratis');
  const [capacity, setCapacity] = useState(300);
  const [amenitiesInput, setAmenitiesInput] = useState('Seguridad PMT, Área Familiar, Puntos de Agua');
  const [eventImage, setEventImage] = useState<string>('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // AI Subagent Curate states
  const [isCurating, setIsCurating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any | null>(null);

  const handleGenerateImageWithNanoBanana = async () => {
    setIsGeneratingImg(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${title || 'Feria comunitaria'} en ${zona}, Villa Nueva`,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setEventImage(data.imageUrl);
      }
    } catch (err) {
      console.warn('Image generation error:', err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleCurateWithAi = async () => {
    if (!title.trim() && !description.trim()) {
      alert('Escribe al menos un título o descripción tentativa para que el Subagente Curador pueda optimizarlo.');
      return;
    }

    setIsCurating(true);
    try {
      const res = await fetch('/api/subagents/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          zona,
          roughDescription: description,
        }),
      });
      const data = await res.json();
      if (data.enhancedTitle) setTitle(data.enhancedTitle);
      if (data.engagingDescription) setDescription(data.engagingDescription);
      if (data.recommendedCategory) setCategory(data.recommendedCategory);
      setAiSuggestions(data);
    } catch (err) {
      console.warn('Curator error:', err);
    } finally {
      setIsCurating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const amenitiesList = amenitiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Default coordinates based on zona
    let lat = 14.5262;
    let lng = -90.5878;
    if (zona.includes('Frutal')) { lat = 14.5098; lng = -90.5694; }
    else if (zona.includes('Santa Clara')) { lat = 14.5360; lng = -90.5750; }
    else if (zona.includes('Naciones Unidas')) { lat = 14.4842; lng = -90.5985; }
    else if (zona.includes('Ciudad Real')) { lat = 14.5610; lng = -90.5615; }

    const newEvent: EventItem = {
      id: `ev-user-${Date.now()}`,
      title,
      category,
      zona,
      date,
      time,
      locationName,
      coordinates: { lat, lng },
      description,
      shortSummary: description.substring(0, 110) + '...',
      organizer: {
        name: user.name,
        role: user.role === 'admin' ? 'Coordinador Municipal' : 'Vecino Proponente',
        verified: user.role === 'admin',
        type: user.role === 'admin' ? 'Alcaldía Villa Nueva' : 'Colectivo Vecinal',
      },
      targetAudience: 'Familias y vecinos de Villa Nueva',
      cost,
      capacity: Number(capacity) || 200,
      rsvpCount: 1,
      isFeatured: false,
      status: user.role === 'admin' ? 'Aprobado' : 'En Revisión',
      tags: [category, 'Comunidad', 'VillaNueva'],
      amenities: amenitiesList.length > 0 ? amenitiesList : ['Seguridad PMT', 'Área Familiar'],
      gradientTheme: 'from-amber-600 via-orange-600 to-rose-700',
      accentColor: '#f59e0b',
      iconName: 'Sparkles',
      imageUrl: eventImage,
    };

    onSubmitEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#FFE600] border-b-4 border-black flex items-center justify-between text-black">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-90s uppercase tracking-wider text-[#FF007F] mb-1">
              <DragonRadarLogo size="sm" />
              <span>★ CONVOCATORIA DE ACTIVIDADES · RADAR ★</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-90s text-black uppercase leading-tight">
              Proponer Nueva Actividad o Evento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:text-white bg-white hover:bg-[#FF007F] border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 font-black" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto text-xs font-bold">
          {/* Subagent Optimization Trigger Bar */}
          <div className="p-3.5 bg-[#00F0FF] border-3 border-black shadow-[3px_3px_0_#000] flex flex-col sm:flex-row items-center justify-between gap-3 text-black">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#FF007F] shrink-0" />
              <div>
                <span className="font-90s uppercase block text-xs">Curador IA 90s Activo</span>
                <span className="text-[11px] font-bold">
                  ¿Tienes una idea inicial? Haz clic para que la IA optimice el título y la logística.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCurateWithAi}
              disabled={isCurating}
              className="px-3.5 py-2 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s border-2 border-black shadow-[2px_2px_0_#000] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isCurating ? 'animate-spin' : ''}`} />
              <span>{isCurating ? 'Curando...' : 'OPTIMIZAR CON IA'}</span>
            </button>
          </div>

          {aiSuggestions?.logisticsTips && (
            <div className="p-3 bg-white border-2 border-black text-black text-[11px] shadow-[2px_2px_0_#000]">
              <span className="font-90s text-[#FF007F] block mb-0.5 uppercase">Consejos Logísticos:</span>
              <p>{aiSuggestions.logisticsTips}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="text-black font-90s uppercase block">Título del Evento *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Gran Concurso de Barriletes Gigantes en Bárcena"
              className="w-full px-3.5 py-2.5 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
            />
          </div>

          {/* Category & Zona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Categoría *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 text-xs text-black font-black bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Zona de Villa Nueva *</label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value as VillaNuevaZona)}
                className="w-full px-3 py-2 text-xs text-black font-black bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
              >
                {ZONAS_LIST.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Fecha *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Horario *</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM - 01:00 PM"
                className="w-full px-3 py-2 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Costo de Entrada</label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Gratis o Q10"
                className="w-full px-3 py-2 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-1">
            <label className="text-black font-90s uppercase block">Lugar o Referencia Exacta *</label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ej: Canchas Municipales de Bárcena, a 2 cuadras de la estación"
              className="w-full px-3.5 py-2.5 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-black font-90s uppercase block">Descripción Detallada *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica las actividades familiares, comida, música y parqueos disponibles..."
              className="w-full px-3.5 py-2 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none"
            />
          </div>

          {/* Amenities & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Servicios (separados por coma)</label>
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                className="w-full px-3 py-2 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-black font-90s uppercase block">Capacidad estimada</label>
              <input
                type="number"
                min="20"
                max="10000"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs text-black font-bold bg-white border-2 border-black shadow-[2px_2px_0_#000]"
              />
            </div>
          </div>

          {/* Image preview */}
          <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0_#000] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-90s text-black uppercase block text-xs">Foto del Evento</span>
                <span className="text-[10px] text-black/70">Fotografía para la ficha y el flyer de redes</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateImageWithNanoBanana}
                disabled={isGeneratingImg}
                className="px-3 py-1 bg-[#00F0FF] hover:bg-[#FFE600] text-black font-90s border border-black text-xs flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingImg ? 'animate-spin' : ''}`} />
                <span>{isGeneratingImg ? 'Generando...' : 'Generar Imagen'}</span>
              </button>
            </div>
            {eventImage && (
              <div className="h-28 w-full border-2 border-black overflow-hidden relative">
                <img
                  src={eventImage}
                  alt="Vista previa"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t-3 border-black flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-90s text-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
            >
              PUBLICAR EVENTO ★
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
