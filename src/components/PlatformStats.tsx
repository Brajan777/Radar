import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Download, 
  Sparkles,
  Zap,
  Flame,
  Star
} from 'lucide-react';
import { PlatformMetrics, EventItem } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface PlatformStatsProps {
  metrics: PlatformMetrics;
  events: EventItem[];
}

export const PlatformStats: React.FC<PlatformStatsProps> = ({ metrics, events }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvpCount, 0);
  const overallOccupancy = Math.round((totalRsvps / totalCapacity) * 100);

  const handleExportCSV = () => {
    const csvRows = [
      ['Zona', 'Asistentes_Confirmados', 'Porcentaje'],
      ...metrics.topZonas.map((z) => [z.zona, z.count, `${z.percentage}%`]),
      [],
      ['Dia', 'Asistencia_Proyectada'],
      ...metrics.weeklyAttendanceForecast.map((d) => [d.day, d.predictedAttendance]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_estadisticas_radar_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 90s Scoreboard Header */}
      <div className="bg-[#FFE600] border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-90s uppercase text-black mb-1">
            <DragonRadarLogo size="sm" />
            <span>★ PANEL DE ESTADÍSTICAS · RADAR ★</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-90s text-black uppercase leading-tight">
            Estadísticas & Asistencia en Vivo
          </h2>
          <p className="text-xs sm:text-sm text-black font-bold">
            Monitoreo en tiempo real de participación ciudadana y aforo en eventos.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadSuccess ? '¡CSV DESCARGADO!' : 'EXPORTAR REPORTE CSV'}</span>
        </button>
      </div>

      {/* Top 4 Key Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border-3 border-black shadow-[5px_5px_0_#000] space-y-1">
          <div className="flex items-center justify-between text-black text-xs font-90s uppercase">
            <span>Vecinos Activos</span>
            <Users className="w-4 h-4 text-[#FF007F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-90s text-black">
            {metrics.activeNeighbors.toLocaleString()}
          </div>
          <span className="text-[11px] bg-[#CCFF00] px-1.5 py-0.5 border border-black font-90s text-black inline-block">
            +18.4% ESTE MES
          </span>
        </div>

        <div className="p-5 bg-[#00F0FF] border-3 border-black shadow-[5px_5px_0_#000] space-y-1">
          <div className="flex items-center justify-between text-black text-xs font-90s uppercase">
            <span>Pases Emitidos</span>
            <Calendar className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl sm:text-3xl font-90s text-black">
            {totalRsvps.toLocaleString()}
          </div>
          <span className="text-[11px] bg-white px-1.5 py-0.5 border border-black font-90s text-black inline-block">
            {overallOccupancy}% AFORO
          </span>
        </div>

        <div className="p-5 bg-[#FF007F] text-white border-3 border-black shadow-[5px_5px_0_#000] space-y-1">
          <div className="flex items-center justify-between text-white text-xs font-90s uppercase">
            <span>Zonas Monitoreadas</span>
            <ShieldCheck className="w-4 h-4 text-[#FFE600]" />
          </div>
          <div className="text-2xl sm:text-3xl font-90s text-white">
            12 / 12
          </div>
          <span className="text-[11px] bg-[#FFE600] text-black px-1.5 py-0.5 border border-black font-90s inline-block">
            100% COBERTURA
          </span>
        </div>

        <div className="p-5 bg-[#CCFF00] border-3 border-black shadow-[5px_5px_0_#000] space-y-1">
          <div className="flex items-center justify-between text-black text-xs font-90s uppercase">
            <span>Puntos GPS & PMT</span>
            <Clock className="w-4 h-4 text-[#FF007F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-90s text-black">
            {events.length}
          </div>
          <span className="text-[11px] bg-white text-black px-1.5 py-0.5 border border-black font-90s inline-block">
            MAPS & WAZE ACTIVOS
          </span>
        </div>
      </div>

      {/* Breakdown Charts: Top Zonas & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Zonas Bar Visual */}
        <div className="lg:col-span-7 bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h3 className="text-sm font-90s text-black uppercase">
              ★ Participación por Zonas de Villa Nueva
            </h3>
            <span className="text-[11px] font-bold text-black bg-[#FFE600] px-2 py-0.5 border border-black">
              Top Activas
            </span>
          </div>

          <div className="space-y-3">
            {metrics.topZonas.map((item, idx) => {
              const barColors = ['bg-[#FF007F]', 'bg-[#00F0FF]', 'bg-[#FFE600]', 'bg-[#CCFF00]'];
              const currentColor = barColors[idx % barColors.length];
              return (
                <div key={item.zona} className="space-y-1">
                  <div className="flex justify-between text-xs font-90s text-black">
                    <span>{item.zona}</span>
                    <span>{item.count} asistentes ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 border-2 border-black h-4 overflow-hidden">
                    <div 
                      className={`${currentColor} h-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forecast Visual */}
        <div className="lg:col-span-5 bg-[#FFFDF0] border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h3 className="text-sm font-90s text-black uppercase">
              ★ Proyección de Fin de Semana
            </h3>
            <span className="text-[11px] font-bold bg-[#00F0FF] px-2 py-0.5 border border-black">
              Estimación
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 items-end h-44 pt-4 border-b-2 border-black">
            {metrics.weeklyAttendanceForecast.map((day) => {
              const maxAttendance = 1800;
              const heightPercent = Math.min(100, Math.round((day.predictedAttendance / maxAttendance) * 100));
              return (
                <div key={day.day} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-90s text-black">{day.predictedAttendance}</span>
                  <div 
                    className="w-full bg-[#FF007F] border-2 border-black transition-all hover:bg-[#FFE600]"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-90s text-black">{day.day}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-black font-medium text-center">
            Proyección calculada según RSVPs confirmados y datos históricos de la municipalidad.
          </p>
        </div>
      </div>
    </div>
  );
};
