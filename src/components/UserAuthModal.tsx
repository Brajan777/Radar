import React, { useState } from 'react';
import { 
  X, 
  User, 
  Ticket, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  Check, 
  QrCode,
  Calendar,
  Zap
} from 'lucide-react';
import { UserProfile, EventItem, VillaNuevaZona } from '../types';
import { DragonRadarLogo } from './DragonRadarLogo';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  events: EventItem[];
  onUpdateUser: (updatedUser: UserProfile) => void;
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

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  events,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'tickets' | 'settings'>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [zona, setZona] = useState<VillaNuevaZona>(user.zona);
  const [role, setRole] = useState<'vecino' | 'organizador' | 'admin'>(user.role);
  const [notifRadius, setNotifRadius] = useState<number>(user.notificationRadiusKm);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      zona,
      role,
      notificationRadiusKm: notifRadius,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden my-6">
        {/* Header in 90s Electric Yellow */}
        <div className="p-4 sm:p-5 bg-[#FFE600] border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-cover border-2 border-black shadow-[2px_2px_0_#000]"
            />
            <div>
              <h3 className="text-base sm:text-lg font-90s text-black uppercase leading-tight">
                {user.name}
              </h3>
              <span className="text-xs font-bold text-black uppercase">
                Rol: {user.role} · {user.zona.split(' - ')[0]}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-black hover:text-white bg-white hover:bg-[#FF007F] border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 font-black" />
          </button>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center border-b-3 border-black bg-white px-3 text-xs font-90s overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 transition-colors uppercase border-b-4 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#FF007F] text-[#FF007F] bg-[#FFE600]/30'
                : 'border-transparent text-black hover:text-[#FF007F]'
            }`}
          >
            Mi Perfil & Rol
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3 px-3 transition-colors uppercase border-b-4 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tickets'
                ? 'border-[#00F0FF] text-black bg-[#00F0FF]/20'
                : 'border-transparent text-black hover:text-[#00F0FF]'
            }`}
          >
            <span>Mis Pases</span>
            <span className="px-1.5 py-0.2 bg-[#FF007F] text-white border border-black text-[10px]">
              {user.rsvps.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 transition-colors uppercase border-b-4 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#CCFF00] text-black bg-[#CCFF00]/30'
                : 'border-transparent text-black hover:text-black'
            }`}
          >
            Alertas Radar
          </button>
        </div>

        {/* Tab 1: Profile & Role Simulation */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs font-bold">
            {savedSuccess && (
              <div className="p-3 bg-[#CCFF00] border-2 border-black text-black flex items-center gap-2 shadow-[3px_3px_0_#000]">
                <Check className="w-4 h-4 text-black font-black" />
                <span className="font-90s uppercase">¡Perfil guardado con éxito!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-black uppercase font-90s block">Nombre Completo:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border-2 border-black text-black font-bold shadow-[2px_2px_0_#000] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-black uppercase font-90s block">Correo Electrónico:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border-2 border-black text-black font-bold shadow-[2px_2px_0_#000] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-black uppercase font-90s block">Zona Habitual en Villa Nueva:</label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value as VillaNuevaZona)}
                className="w-full px-3 py-2.5 bg-white border-2 border-black text-black font-black shadow-[2px_2px_0_#000] focus:outline-none"
              >
                {ZONAS_LIST.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-black uppercase font-90s block">Rol en la Plataforma:</label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['vecino', 'organizador', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 border-2 border-black text-center font-90s uppercase transition-all cursor-pointer ${
                      role === r
                        ? 'bg-[#FF007F] text-white shadow-[3px_3px_0_#000] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-[#FFE600] shadow-[2px_2px_0_#000]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 font-90s text-white bg-[#FF007F] hover:bg-black border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                GUARDAR PERFIL ★
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: My Tickets */}
        {activeTab === 'tickets' && (
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
            {user.rsvps.length > 0 ? (
              user.rsvps.map((rsvp) => {
                const ev = events.find((e) => e.id === rsvp.eventId);
                return (
                  <div
                    key={rsvp.ticketCode}
                    className="p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="font-90s text-black text-sm block uppercase">
                        {ev?.title || 'Evento de Villa Nueva'}
                      </span>
                      <div className="flex items-center gap-2 text-black font-bold text-[11px]">
                        <span>{ev?.date}</span>
                        <span>·</span>
                        <span>{rsvp.numPeople} persona(s)</span>
                      </div>
                      <span className="font-mono bg-[#FFE600] px-2 py-0.5 border border-black font-black text-black inline-block mt-1">
                        Código: {rsvp.ticketCode}
                      </span>
                    </div>

                    <div className="w-14 h-14 bg-white border-2 border-black p-1 flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000]">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-black font-90s uppercase">
                Aún no has reservado ningún pase familiar. ¡Explora los eventos y reserva gratis!
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Notification Settings */}
        {activeTab === 'settings' && (
          <div className="p-6 space-y-4 text-xs font-bold">
            <div>
              <span className="font-90s text-black text-sm block mb-1 uppercase">
                Geocerca Radar de Alertas
              </span>
              <p className="text-black font-medium leading-relaxed">
                Recibe notificaciones automáticas cuando se detecten actividades familiares cerca de tu ubicación.
              </p>
            </div>

            <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] space-y-3">
              <div className="flex items-center justify-between font-90s">
                <span className="text-black">RADIO DE ALERTA:</span>
                <span className="bg-[#FFE600] px-2 py-0.5 border border-black text-black text-sm">{notifRadius} KM</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={notifRadius}
                onChange={(e) => setNotifRadius(Number(e.target.value))}
                className="w-full accent-[#FF007F]"
              />
              <div className="flex justify-between text-[10px] font-90s text-black">
                <span>1 KM (A pie)</span>
                <span>5 KM (Vecindario)</span>
                <span>15 KM (Todo el Municipio)</span>
              </div>
            </div>

            <button
              onClick={() => {
                onUpdateUser({ ...user, notificationRadiusKm: notifRadius });
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }}
              className="w-full py-3 font-90s text-black bg-[#CCFF00] hover:bg-[#FFE600] border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer"
            >
              GUARDAR PREFERENCIAS ★
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
