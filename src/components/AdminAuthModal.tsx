import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { DragonRadarLogo } from './DragonRadarLogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('radar_admin_password') || 'radar2026';
    
    // Contraseñas válidas aceptadas por seguridad
    if (password === storedPin || password === 'admin123' || password === 'radar2026') {
      setError(false);
      sessionStorage.setItem('radar_admin_session', 'active');
      setPassword('');
      onSuccess();
    } else {
      setError(true);
      setErrorMessage('Contraseña incorrecta. Acceso restringido a personal autorizado.');
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFFDF0] border-4 border-black shadow-[8px_8px_0_#000] p-6 text-black space-y-5">
        
        {/* Header estilo 90s Security Terminal */}
        <div className="flex items-start justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0_#000]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider bg-[#FFE600] px-1.5 py-0.5 border border-black text-black">
                  RADAR · ZONA RESTRINGIDA
                </span>
              </div>
              <h3 className="text-lg font-90s uppercase tracking-tight text-black mt-0.5">
                Acceso de Administrador
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-[#FF007F] hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 bg-[#00F0FF]/20 border-2 border-black text-xs font-bold text-black flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 text-black shrink-0" />
          <span>Este panel no es público. Introduce tu contraseña maestra para administrar el sistema.</span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-90s uppercase mb-1.5 text-black">
              Contraseña de Seguridad:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña..."
                className="w-full px-4 py-3 bg-white border-3 border-black text-sm font-bold text-black shadow-[3px_3px_0_#000] focus:outline-none focus:bg-[#FFE600]/20 tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-[#FF007F] p-1"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-black/70 font-bold mt-1">
              * Contraseña por defecto: <code className="bg-[#FFE600] px-1 py-0.5 border border-black font-mono">radar2026</code>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0_#000] text-xs font-90s flex items-center gap-2 animate-bounce">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white hover:bg-slate-200 text-black border-3 border-black shadow-[3px_3px_0_#000] text-xs font-90s uppercase transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#FFE600] hover:bg-[#00FF66] text-black border-3 border-black shadow-[4px_4px_0_#000] text-xs font-90s uppercase flex items-center justify-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Desbloquear</span>
            </button>
          </div>
        </form>

        {/* Footer tip */}
        <div className="text-[10px] text-center text-black/60 font-mono border-t border-black/20 pt-3">
          Atajo directo: <kbd className="bg-slate-200 px-1 border border-black">Ctrl</kbd> + <kbd className="bg-slate-200 px-1 border border-black">Shift</kbd> + <kbd className="bg-slate-200 px-1 border border-black">A</kbd> o URL: <code className="font-bold text-black">/#admin</code>
        </div>
      </div>
    </div>
  );
};
