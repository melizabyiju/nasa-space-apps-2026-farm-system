import React, { useState } from 'react';
import { Farm } from '../types';
import { api } from '../api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AssistantViewProps {
  farm: Farm;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  sources?: string[];
}

export const AssistantView: React.FC<AssistantViewProps> = ({ farm }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello Kristin! I am your **AGROVERSE Agricultural Intelligence Assistant**. I have loaded real NASA Earth observations (temperature, precipitation, SMAP soil moisture) and soil characteristics for **${farm.name}**.\n\nYou can ask me why specific crop sequences are advised, how legumes replenish nitrogen after paddy, or compare water conservation strategies.`,
      citations: ['NASA POWER Agrometeorology', 'KAU Agronomic Guidelines 2024'],
      sources: ['NASA POWER', 'NASA SMAP', 'ICAR']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Why should I grow legumes after rice?",
    "Which rotation plan uses less water?",
    "How does rainfall affect this crop recommendation?",
    "What happens if rainfall decreases by 20%?"
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAssistant(q, farm.id);
      const botMsg: Message = {
        role: 'assistant',
        content: res.response,
        citations: res.citations,
        sources: res.data_sources_referenced
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error communicating with agricultural knowledge engine: ' + err
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Grounded AI Engine
            </span>
            <span className="text-xs text-neutral-500 font-medium">Farm-Aware • Hallucination Safeguarded</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            AI Agricultural Decision Assistant
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Query the underlying agronomic rules and NASA Earth observations behind every crop recommendation for <strong>{farm.name}</strong>.
          </p>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/80 hover:bg-white text-neutral-700 hover:text-emerald-950 border border-neutral-200/60 shadow-sm transition flex items-center gap-1.5"
          >
            <span>{sq}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="glass-card border border-white/80 shadow-xl rounded-3xl overflow-hidden flex flex-col h-[560px]">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                m.role === 'user' ? 'bg-neutral-800 text-white' : 'bg-emerald-800 text-white'
              }`}>
                {m.role === 'user' ? 'KP' : <Bot className="w-4 h-4 text-emerald-200" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white/90 text-neutral-800 border border-neutral-200/70 shadow-sm'
              }`}>
                <div className="whitespace-pre-line">{m.content}</div>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-700 block mb-1">Authoritative References:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {m.citations.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="p-4 rounded-2xl bg-white/90 border border-neutral-200/70 shadow-sm flex items-center gap-2 text-xs text-neutral-500">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Synthesizing NASA Earth observations and agronomic rules...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white/80 border-t border-neutral-200/70 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Ask about crop compatibility, water stress, or soil for ${farm.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
