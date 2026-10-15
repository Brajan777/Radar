import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Filter, 
  Ticket, 
  Download, 
  Share2,
  ExternalLink,
  Flame
} from 'lucide-react';
import { EventItem } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface InteractiveCalendarProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onQuickRsvp: (event: EventItem) => void;
  onOpenShareModal?: (event: EventItem) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events,
  onSelectEvent,
  onQuickRsvp,
  onOpenShareModal,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 14)); // October 2026
  const [selectedDay, setSelectedDay] = useState<number>(18);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const filteredEvents = events.filter((ev) => {
    const evDate = new Date(ev.date + 'T00:00:00');
    const matchesMonth = evDate.getFullYear() === year && evDate.getMonth() === month;
    const matchesCat = filterCategory === 'all' || ev.category === filterCategory;
    return matchesMonth && matchesCat;
  });

  const getEventsForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const mStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const targetDateStr = `${year}-${mStr}-${dayStr}`;
    return filteredEvents.filter((ev) => ev.date === targetDateStr);
  };

  const selectedDayEvents = getEventsForDay(selectedDay);

  const generateIcsFile = (event: EventItem) => {
    const cleanDate = event.date.replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Radar//Eventos//ES
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.locationName}, ${event.zona}, Villa Nueva, Guatemala
DTSTART:${cleanDate}T150000Z
DTEND:${cleanDate}T230000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="calendario" className="space-y-6">
      {/* Calendar Header with 90s Styling */}
      <div className="bg-[#FFE600] border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-90s text-black uppercase tracking-wider mb-1">
            <DragonRadarLogo size="sm" />
            <span>AGENDA DE ACTIVIDADES · RADAR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-90s text-black uppercase leading-tight">
            Calendario Interactivo de Actividades
          </h2>
          <p className="text-xs sm:text-sm text-black font-bold">
            Selecciona el día para ver actividades con enlaces directos a Google Maps y Waze.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-90s transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#FF007F] text-white' : 'text-black hover:bg-[#FFE600]'
              }`}
            >
              MES
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 text-xs font-90s transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-[#FF007F] text-white' : 'text-black hover:bg-[#FFE600]'
              }`}
            >
              LISTA
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border-2 border-black p-1 shadow-[2px_2px_0_#000]">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-[#00F0FF] text-black border border-transparent hover:border-black transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 font-black" />
            </button>
            <span className="px-3 text-xs font-90s text-black min-w-28 text-center uppercase">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-[#00F0FF] text-black border border-transparent hover:border-black transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 font-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-90s text-black shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#FF007F]" /> FILTRAR:
        </span>
        {['all', 'Familiar', 'Gastronómico', 'Deportivo', 'Cultural', 'Juventud y Arte', 'Ecológico'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-90s whitespace-nowrap border-2 border-black shadow-[2px_2px_0_#000] shrink-0 transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-[#FF007F] text-white hover:bg-black'
                : 'bg-white text-black hover:bg-[#FFE600]'
            }`}
          >
            {cat === 'all' ? 'TODOS' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Grid Container */}
          <div className="lg:col-span-8 bg-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0_#000] space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center font-90s text-xs text-black border-b-3 border-black pb-3">
              <span className="bg-[#FFE600] py-1 border border-black">DOM</span>
              <span className="bg-slate-100 py-1 border border-black">LUN</span>
              <span className="bg-slate-100 py-1 border border-black">MAR</span>
              <span className="bg-slate-100 py-1 border border-black">MIÉ</span>
              <span className="bg-slate-100 py-1 border border-black">JUE</span>
              <span className="bg-slate-100 py-1 border border-black">VIE</span>
              <span className="bg-[#00F0FF] py-1 border border-black">SÁB</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20 border-2 border-dashed border-black/20 bg-slate-50" />
              ))}

              {/* Days of current month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDay === day;
                const hasEvents = dayEvents.length > 0;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`h-16 sm:h-20 p-2 border-2 border-black flex flex-col justify-between text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF007F] text-white shadow-[4px_4px_0_#000] -translate-y-0.5'
                        : hasEvents
                        ? 'bg-[#CCFF00] hover:bg-[#FFE600] text-black shadow-[2px_2px_0_#000]'
                        : 'bg-white hover:bg-[#FFFDF0] text-black shadow-[1.5px_1.5px_0_#000]'
                    }`}
                  >
                    <span className={`text-xs font-90s ${isSelected ? 'text-white' : 'text-black'}`}>
                      {day}
                    </span>

                    {hasEvents && (
                      <div className="space-y-0.5">
                        <div className="flex gap-1 flex-wrap">
                          {dayEvents.map((ev) => (
                            <span
                              key={ev.id}
                              className={`w-2 h-2 rounded-full border border-black ${isSelected ? 'bg-[#FFE600]' : 'bg-[#FF007F]'}`}
                              title={ev.title}
                            />
                          ))}
                        </div>
                        <span className={`text-[9px] font-90s truncate block ${isSelected ? 'text-white' : 'text-black'}`}>
                          {dayEvents[0].title}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Agenda Drawer */}
          <div className="lg:col-span-4 bg-[#FFFDF0] border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <div>
                <span className="text-[10px] font-90s uppercase tracking-wider text-[#FF007F] bg-white px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0_#000]">
                  ★ DÍA SELECCIONADO
                </span>
                <h3 className="text-xl font-90s text-black uppercase mt-1">
                  {selectedDay} de {monthNames[month]} {year}
                </h3>
              </div>
              <span className="text-xs font-90s px-2.5 py-1 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0_#000]">
                {selectedDayEvents.length} EVENTOS
              </span>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 bg-white border-3 border-black hover:bg-[#FFE600]/30 space-y-2 transition-all shadow-[3px_3px_0_#000]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-90s uppercase px-2 py-0.5 bg-[#00F0FF] text-black border border-black">
                        {ev.category}
                      </span>
                      <span className="text-xs font-90s text-[#FF007F]">
                        {ev.cost}
                      </span>
                    </div>

                    <h4 
                      onClick={() => onSelectEvent(ev)}
                      className="text-sm font-90s text-black hover:text-[#FF007F] cursor-pointer uppercase leading-tight"
                    >
                      {ev.title}
                    </h4>

                    <div className="text-[11px] font-bold text-black flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      <span>{ev.time} · {ev.zona.split(' - ')[0]}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t-2 border-black">
                      <button
                        onClick={() => onSelectEvent(ev)}
                        className="flex-1 py-1.5 text-[11px] font-90s bg-[#00F0FF] hover:bg-[#FFE600] text-black border border-black shadow-[2px_2px_0_#000] cursor-pointer"
                      >
                        DETALLES
                      </button>
                      <button
                        onClick={() => onQuickRsvp(ev)}
                        className="flex-1 py-1.5 text-[11px] font-90s bg-[#FF007F] hover:bg-black text-white border border-black shadow-[2px_2px_0_#000] cursor-pointer"
                      >
                        PASE
                      </button>
                      <button
                        onClick={() => generateIcsFile(ev)}
                        title="Guardar en tu calendario"
                        className="p-1.5 bg-white hover:bg-[#CCFF00] text-black border border-black shadow-[2px_2px_0_#000] cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border-2 border-dashed border-black space-y-2">
                <CalendarIcon className="w-8 h-8 text-black/40 mx-auto" />
                <p className="text-xs font-90s text-black uppercase">
                  No hay eventos programados para este día
                </p>
                <p className="text-[11px] text-black font-medium">
                  Prueba seleccionando otro día con puntos de colores.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Agenda View */
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((ev) => (
              <div 
                key={ev.id}
                className="p-4 bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0_#000] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-90s uppercase bg-[#FFE600] px-2 py-0.5 border border-black">
                      {ev.date}
                    </span>
                    <span className="text-xs font-90s text-[#FF007F]">{ev.cost}</span>
                  </div>
                  <h4 className="text-base font-90s text-black uppercase leading-tight">
                    {ev.title}
                  </h4>
                  <p className="text-xs font-medium text-black line-clamp-2">
                    {ev.shortSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t-2 border-black">
                  <button
                    onClick={() => onSelectEvent(ev)}
                    className="flex-1 py-1.5 text-xs font-90s bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0_#000]"
                  >
                    VER DETALLES
                  </button>
                  <button
                    onClick={() => onQuickRsvp(ev)}
                    className="flex-1 py-1.5 text-xs font-90s bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0_#000]"
                  >
                    PASE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
