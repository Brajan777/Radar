import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  Compass, 
  MapPin, 
  Car,
  Clock
} from 'lucide-react';
import { DragonRadarLogo } from './DragonRadarLogo';
import { UserProfile } from '../types';

interface FloatingConciergeProps {
  user: UserProfile;
}

export const FloatingConcierge: React.FC<FloatingConciergeProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: `¡Hola ${user.name}! Soy tu Concierge Ciudadano de Radar Sur. Conozco las actividades de Villa Nueva, San Miguel Petapa y Villa Canales, accesos viales de las 3 PMT y parqueos. ¿En qué te ayudo hoy?`,
      time: '12:00'
    }
  ]);

  const quickPrompts = [
    '¿Qué planes familiares hay este fin de semana?',
    '¿Cómo llegar al Festival de la Piña en Villa Canales?',
    '¿Dónde hay parqueo seguro para el Festival del Mango en Petapa?',
    '¿Qué actividades deportivas o ciclovías son 100% gratis?'
  ];

  const handleAsk = async (textToSend: string) => {
    const q = textToSend.trim();
    if (!q) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLog((prev) => [...prev, { sender: 'user', text: q, time: now }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/subagents/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: q, 
          userZona: user.zona, 
          userMunicipio: user.municipio || 'Villa Nueva' 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatLog((prev) => [
          ...prev,
          { sender: 'agent', text: data.answer || '¡Con gusto te asesoramos!', time: now }
        ]);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Te recomendamos el Festival del Chuchito en Villa Nueva, el Festival del Mango en San Miguel Petapa y la Gran Feria de la Piña en Villa Canales. Además, las 3 PMT mantienen operativos viales en Bulevar El Frutal, CA-9 y VAS para que llegues seguro.`,
          time: now
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-[#FFE600] hover:bg-[#FF007F] hover:text-white text-black px-4 py-3 border-3 border-black shadow-[5px_5px_0_#000] hover-lift transition-bounce animate-float-slow flex items-center gap-2.5 font-90s text-xs cursor-pointer group"
          title="Pregúntale al Concierge Ciudadano de Radar Sur"
        >
          <DragonRadarLogo size="sm" />
          <span className="uppercase tracking-wider">CONCIERGE SUR IA</span>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF007F] border border-black" />
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0_#000] flex flex-col max-h-[85vh] sm:max-h-[580px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#FFE600] border-b-3 border-black p-3.5 flex items-center justify-between text-black shrink-0">
            <div className="flex items-center gap-2">
              <DragonRadarLogo size="sm" />
              <div>
                <h3 className="font-90s text-xs uppercase leading-tight">
                  Concierge Ciudadano del Sur
                </h3>
                <span className="text-[10px] font-bold text-black/80 block">
                  Villa Nueva · Petapa · Villa Canales
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2.5 bg-white border-b-2 border-black flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleAsk(p)}
                className="px-2.5 py-1 text-[10px] font-bold text-black bg-[#FFFDF0] hover:bg-[#00F0FF] border border-black whitespace-nowrap shadow-[1px_1px_0_#000] transition-colors cursor-pointer shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#FFFDF0] text-xs">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 max-w-[85%] border-2 border-black font-medium leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00F0FF] text-black shadow-[3px_3px_0_#000]'
                      : 'bg-white text-black shadow-[3px_3px_0_#FFE600]'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] font-mono text-black/60 mt-0.5 px-1 font-bold">
                  {msg.time}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-black font-90s text-xs p-2 bg-white border border-black shadow-[2px_2px_0_#000] w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#FF007F]" />
                <span>Consultando agenda del Sur...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="p-3 bg-white border-t-3 border-black flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pregunta por parqueos, ferias, rutas..."
              className="flex-1 px-3 py-2 text-xs bg-[#FFFDF0] border-2 border-black font-bold text-black placeholder-black/50 focus:outline-none shadow-[2px_2px_0_#000]"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="p-2.5 bg-[#FF007F] hover:bg-[#FFE600] hover:text-black text-white border-2 border-black shadow-[2px_2px_0_#000] disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
