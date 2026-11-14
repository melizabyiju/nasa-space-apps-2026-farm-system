import React, { useState } from 'react';
import { Farm } from '../types';
import { api } from '../api';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface AssistantViewProps {
  farm: Farm;
  lang: Language;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export const AssistantView: React.FC<AssistantViewProps> = ({ farm, lang }) => {
  const t = translations[lang];

  const defaultWelcome = lang === 'ml'
    ? `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ **അഗ്രോവേഴ്സ് കാർഷിക സഹായിയാണ്**. ${farm.name}-ലെ നാസ ഉപഗ്രഹ വിവരങ്ങളും മണ്ണിന്റെ അവസ്ഥയും പരിശോധിക്കാൻ ഞാൻ സജ്ജമാണ്.\n\nഏത് വിളയാണ് ഇപ്പോൾ നടേണ്ടത്, നെല്ല് കഴിഞ്ഞാൽ പയർ നടുന്നത് എന്തുകൊണ്ട് നല്ലതാണ് തുടങ്ങിയ സംശയങ്ങൾ ചോദിക്കാം.`
    : `Hello Kristin! I am your **AGROVERSE Agricultural Voice & AI Assistant**. I have loaded real NASA Earth observations and soil characteristics for **${farm.name}**.\n\nYou can speak or type any question about crop suitability, soil moisture, or fertilizer savings.`;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: defaultWelcome,
      citations: ['NASA POWER Daily Observations', 'Kerala Agricultural University Guidelines 2024']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sampleQuestions = lang === 'ml' ? [
    "നെല്ല് കൊയ്തയുടൻ പയർ നടുന്നത് എന്തുകൊണ്ട് നല്ലതാണ്?",
    "കുറഞ്ഞ വെള്ളത്തിൽ ചെയ്യാൻ പറ്റിയ കൃഷി ഏതാണ്?",
    "മഴ 20% കുറഞ്ഞാൽ ഞാൻ എന്ത് വിള മാറ്റണം?",
    "ഇന്നത്തെ കാലാവസ്ഥയിൽ വളപ്രയോഗം നടത്താമോ?"
  ] : [
    "Why should I grow cowpea after rice?",
    "Which rotation plan uses less water?",
    "What happens if rainfall decreases by 20%?",
    "What crops best fit laterite soil?"
  ];

  // Speech Recognition (Web Speech API)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ml' ? 'ml-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

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
        citations: res.citations
      };
      setMessages(prev => [...prev, botMsg]);

      // Auto-read response for farmer accessibility
      speakText(res.response, lang);
      setIsSpeaking(true);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error: ' + err
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {lang === 'ml' ? 'ശബ്ദ സംശയ സഹായി' : 'Voice-Enabled AI Assistant'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">Farm-Aware • NASA Data Linked</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {t.assistantTitle}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {t.assistantDesc}
          </p>
        </div>

        {isSpeaking && (
          <button
            onClick={() => { stopSpeech(); setIsSpeaking(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md animate-pulse"
          >
            <VolumeX className="w-4 h-4" />
            <span>{t.stopAudio}</span>
          </button>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/90 hover:bg-white text-neutral-800 hover:text-emerald-950 border border-neutral-300 shadow-xs transition flex items-center gap-1.5"
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
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                m.role === 'user' ? 'bg-neutral-800 text-white' : 'bg-emerald-800 text-white'
              }`}>
                {m.role === 'user' ? 'KP' : <Bot className="w-4 h-4 text-emerald-200" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white/95 text-neutral-800 border border-neutral-200 shadow-xs'
              }`}>
                <div className="whitespace-pre-line">{m.content}</div>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-500 font-medium">
                    <span className="font-bold text-neutral-700 block mb-0.5">Verified References:</span>
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
              <div className="w-8 h-8 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="p-4 rounded-2xl bg-white/95 border border-neutral-200 shadow-xs flex items-center gap-2 text-xs text-neutral-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Checking NASA satellite data & agricultural research...</span>
              </div>
            </div>
          )}
        </div>

        {/* Voice & Text Input Bar */}
        <div className="p-4 bg-white/95 border-t border-neutral-200 flex items-center gap-3">
          {/* Microphone button for Voice input */}
          <button
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-xl border font-bold transition shadow-xs flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
            }`}
            title={t.startVoice}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={isListening ? t.listening : t.askPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm bg-white"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>{t.sendBtn}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
