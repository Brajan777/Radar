import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  Share2,
  ExternalLink,
  Flame,
  Star
} from 'lucide-react';
import { EventItem } from '../types';
import { formatDistance, LatLng, calculateDistanceKm } from '../utils/geo';
import { DragonRadarLogo } from './DragonRadarLogo';

interface EventCardProps {
  event: EventItem;
  userCoords: LatLng;
  onSelect: (event: EventItem) => void;
  onRsvp: (event: EventItem) => void;
  onShare?: (event: EventItem) => void;
  isSaved?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  userCoords,
  onSelect,
  onRsvp,
  onShare,
}) => {
  const [imgError, setImgError] = useState(false);
  const distanceKm = calculateDistanceKm(userCoords, event.coordinates);
  const occupancyPercent = Math.min(100, Math.round((event.rsvpCount / event.capacity) * 100));

  const googleMapsUrl = event.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`;
  const isRadarEvent = event.sourceType === 'radar' || event.organizer.type === 'Radar Villa Nueva (Exclusivo)';

  return (
    <div className="neo-card flex flex-col justify-between overflow-hidden group">
      {/* Photo Banner with 90s Retro Overlays */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden border-b-3 border-black bg-black">
        {event.imageUrl && !imgError ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#FFE600] flex items-center justify-center font-90s text-xl text-black">
            RADAR
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Header Tags */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_#000] text-[10px] font-90s uppercase">
            <span>{event.category}</span>
            <span>·</span>
            <span>{event.zona.split(' - ')[0]}</span>
          </div>

          <span className="px-2.5 py-0.5 text-xs font-90s bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0_#000]">
            {event.cost}
          </span>
        </div>

        {/* Source Badge */}
        <div className="absolute top-10 left-2.5 z-10">
          {isRadarEvent ? (
            <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0_#000] rotate-[-2deg] inline-block">
              ★ EXCLUSIVO RADAR
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-90s uppercase bg-white text-black border-2 border-black shadow-[2px_2px_0_#000] inline-block">
              🏛 MUNICIPAL
            </span>
          )}
        </div>

        {/* Bottom Distance & Occupancy */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between z-10 text-white">
          <div className="flex items-center gap-1.5 bg-black text-[#CCFF00] border border-white px-2 py-0.5 text-[11px] font-90s">
            <DragonRadarLogo size="sm" />
            <span>{formatDistance(distanceKm)}</span>
          </div>
          <span className="text-[10px] font-90s bg-[#FF007F] text-white border border-black px-2 py-0.5">
            {occupancyPercent}% AFORO
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div className="space-y-2">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs font-black text-black">
            <span className="flex items-center gap-1 bg-[#FFE600] px-1.5 py-0.5 border border-black">
              <Calendar className="w-3.5 h-3.5" />
              {event.date}
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 border border-black">
              <Clock className="w-3.5 h-3.5 text-black" />
              {event.time}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(event)}
            className="text-base sm:text-lg font-90s text-black hover:text-[#FF007F] transition-colors cursor-pointer leading-snug line-clamp-2 uppercase"
          >
            {event.title}
          </h3>

          {/* Short Summary */}
          <p className="text-xs text-black/80 font-medium leading-relaxed line-clamp-2">
            {event.shortSummary}
          </p>

          {/* Location & Maps Button */}
          <div className="flex items-center justify-between text-xs pt-2 border-t-2 border-black">
            <div className="text-black font-bold flex items-center gap-1.5 truncate max-w-[190px]">
              <MapPin className="w-3.5 h-3.5 text-[#FF007F] shrink-0" />
              <span className="truncate">{event.locationName}</span>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-90s text-black bg-[#CCFF00] hover:bg-[#FFE600] border border-black px-2 py-1 shadow-[2px_2px_0_#000] flex items-center gap-1 transition-all shrink-0"
              title="Abrir ubicación en Google Maps"
            >
              <span>MAPS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Capacity Bar & 90s CTAs */}
        <div className="space-y-3 pt-2 border-t-2 border-black">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-black text-black">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-black" /> Asistentes:
              </span>
              <span className="bg-[#FFE600] px-1 border border-black">
                {event.rsvpCount} / {event.capacity}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 border border-black overflow-hidden">
              <div 
                className="bg-[#FF007F] h-full transition-all duration-300"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1">
            {event.amenities.slice(0, 3).map((a) => (
              <span 
                key={a}
                className="text-[9px] font-bold text-black bg-[#FFFDF0] px-1.5 py-0.5 border border-black"
              >
                ★ {a}
              </span>
            ))}
          </div>

          {/* Action CTAs in 90s style */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onSelect(event)}
              className="flex-1 py-2 text-xs font-90s text-black bg-[#00F0FF] hover:bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all text-center cursor-pointer"
            >
              DETALLES ★
            </button>
            <button
              onClick={() => onRsvp(event)}
              className="flex-1 py-2 text-xs font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>PASE GRATIS</span>
            </button>
            {onShare && (
              <button
                onClick={() => onShare(event)}
                className="p-2 text-black bg-white hover:bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                title="Difundir en WhatsApp y Redes"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
