import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, Share, PlusSquare } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    // Check if dismissed before in this session
    const isDismissed = sessionStorage.getItem('radar_pwa_dismissed') === 'true';
    if (isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Detect Android / Chrome install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS and not standalone mode, show subtle reminder
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isIosDevice && !isStandalone) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosTip(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('radar_pwa_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#00F0FF] border-b-3 border-black text-black px-3 py-2.5 text-xs font-black shadow-[0_3px_0_#000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="leading-tight">
            <strong>Instala Radar Sur en tu pantalla:</strong> Accede a eventos y cupones al instante sin descargar apps pesadas.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black font-90s text-[11px] border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>INSTALAR APP</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-black hover:bg-black/10 rounded cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Instructions Tooltip Modal */}
      {showIosTip && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-5 max-w-sm w-full space-y-4 shadow-[6px_6px_0_#FFE600]">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h4 className="font-90s text-sm text-black uppercase">Instalar en tu iPhone</h4>
              <button onClick={() => setShowIosTip(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-bold text-black">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#FFE600] border border-black flex items-center justify-center text-[11px] font-black shrink-0">1</span>
                <span>Toca el botón <Share className="inline w-3.5 h-3.5 text-[#00F0FF] mx-1" /> <strong>Compartir</strong> en la barra inferior de Safari.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#00F0FF] border border-black flex items-center justify-center text-[11px] font-black shrink-0">2</span>
                <span>Desliza hacia abajo y selecciona <PlusSquare className="inline w-3.5 h-3.5 text-[#FF007F] mx-1" /> <strong>"Agregar a pantalla de inicio"</strong>.</span>
              </p>
            </div>
            <button
              onClick={() => setShowIosTip(false)}
              className="w-full py-2 bg-[#FFE600] font-90s text-xs border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer uppercase"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
