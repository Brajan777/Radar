import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Send, 
  Cpu, 
  CheckCircle, 
  MessageSquare
} from 'lucide-react';
import { AiSubagent, UserProfile } from '../types';

interface SubagentsHubProps {
  subagents: AiSubagent[];
  user: UserProfile;
}

export const SubagentsHub: React.FC<SubagentsHubProps> = ({ subagents, user }) => {
  const [activeAgentId, setActiveAgentId] = useState<string>('agent-analyst');
  const [conciergeQuestion, setConciergeQuestion] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: `¡Hola ${user.name}! Soy el Subagente Concierge Comunitario de Villa Nueva. Conozco todos los eventos familiares de este mes, parqueos, accesibilidad y rutas. ¿Qué te gustaría consultar hoy?`,
      time: '17:00'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Moderation tester state
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isTestingMod, setIsTestingMod] = useState(false);

  const handleAskConcierge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeQuestion.trim()) return;

    const q = conciergeQuestion;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLog((prev) => [...prev, { sender: 'user', text: q, time: now }]);
    setConciergeQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/subagents/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, userZona: user.zona }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatLog((prev) => [
          ...prev,
          { sender: 'agent', text: data.answer || '¡Con gusto te ayudamos!', time: now }
        ]);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `En Villa Nueva te recomendamos el Festival del Chuchito en el Parque Central (con rampas accesibles y parqueo sobre la 3a calle) y la Ciclovía Nocturna en El Frutal. ¡Actividades 100% familiares y gratuitas!`,
          time: now
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestModeration = async () => {
    if (!testText.trim()) return;
    setIsTestingMod(true);
    try {
      const res = await fetch('/api/subagents/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText, authorName: 'Prueba Vecinal' }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTestingMod(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subagents Command Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
          <Bot className="w-4 h-4 text-amber-700" />
          <span>Inteligencia Artificial Municipal Autónoma</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-display">
          Centro de Subagentes IA de Villa Nueva
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Ecosistema de agentes dedicados a cuidar el ambiente familiar, optimizar convocatorias y responder preguntas ciudadanas en tiempo real.
        </p>
      </div>

      {/* Subagents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {subagents.map((ag) => {
          const isSelected = ag.id === activeAgentId;
          const icon = 
            ag.id === 'agent-guardian' ? <ShieldCheck className="w-5 h-5 text-emerald-700" /> :
            ag.id === 'agent-curator' ? <Sparkles className="w-5 h-5 text-amber-700" /> :
            <Activity className="w-5 h-5 text-sky-700" />;

          return (
            <div
              key={ag.id}
              onClick={() => setActiveAgentId(ag.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-amber-50/50 border-amber-400 shadow-sm'
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    {icon}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Activo
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif-display">
                    {ag.name}
                  </h3>
                  <span className="text-xs text-amber-800 font-semibold block">
                    {ag.title}
                  </span>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {ag.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Acciones ejecutadas:</span>
                  <span className="font-bold text-stone-900">{ag.processedCount}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Modelo de IA:</span>
                  <span className="font-mono text-stone-700 font-semibold">{ag.model}</span>
                </div>
                <div className="text-[11px] text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  "{ag.lastAction}"
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Testing Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Citizen Concierge Chat */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 flex flex-col h-[520px] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif-display">
                  Asistente Virtual & Concierge de Villa Nueva
                </h3>
                <span className="text-[10px] text-stone-500">
                  Pregúntale sobre rutas, eventos para niños o parqueos
                </span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-100">
              EN VIVO
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col text-xs max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-800 text-white font-medium rounded-tr-none'
                      : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.sender === 'user' ? 'Tú' : 'Concierge Radar'} · {msg.time}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Consultando la base municipal...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAskConcierge} className="pt-3 border-t border-stone-100 flex items-center gap-2">
            <input
              type="text"
              value={conciergeQuestion}
              onChange={(e) => setConciergeQuestion(e.target.value)}
              placeholder="¿Qué actividades hay este fin de semana para niños pequeños?"
              className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors shrink-0"
            >
              Preguntar
            </button>
          </form>
        </div>

        {/* Right: Moderation Simulator */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif-display">
                Diagnóstico del Guardián Comunitario
              </h3>
              <span className="text-[10px] text-stone-500">
                Prueba el filtro de convivencia familiar y cordialidad
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <label className="text-stone-700 font-semibold block">
              Texto para analizar:
            </label>
            <textarea
              rows={3}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Escribe un comentario para someterlo a moderación..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-600"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTestText('¡Excelente feria en el Parque Central! Mis hijos se divirtieron mucho en los juegos.')}
                className="text-[10px] text-stone-500 hover:text-amber-800 underline"
              >
                Cargar ejemplo cordial
              </button>
              <span className="text-stone-300">·</span>
              <button
                type="button"
                onClick={() => setTestText('Esto es una estafa y pésima organización, quiero pelear.')}
                className="text-[10px] text-stone-500 hover:text-rose-700 underline"
              >
                Cargar ejemplo sensible
              </button>
            </div>

            <button
              onClick={handleTestModeration}
              disabled={isTestingMod}
              className="w-full py-2.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Cpu className={`w-3.5 h-3.5 ${isTestingMod ? 'animate-spin' : ''}`} />
              <span>{isTestingMod ? 'Analizando con IA...' : 'Ejecutar Diagnóstico en Vivo'}</span>
            </button>
          </div>

          {testResult && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">Resultado del Guardián:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  testResult.status === 'safe'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {testResult.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>Índice Familiar:</span>
                <span className="font-bold text-amber-800">{testResult.familyScore}/100</span>
              </div>
              <p className="text-stone-700 text-[11px] leading-relaxed pt-2 border-t border-stone-200">
                {testResult.analysisNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
