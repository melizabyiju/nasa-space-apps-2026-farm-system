import React, { useState } from 'react';
import { Farm } from '../types';
import { api } from '../api';
import { getLocalAIResponse } from '../aiEngine';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Satellite,
  Leaf
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
  dataSources?: string[];
}

export const AssistantView: React.FC<AssistantViewProps> = ({ farm, lang }) => {
  const t = translations[lang];

  const defaultWelcome = lang === 'ml'
    ? `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ **അഗ്രോവേഴ്സ് (AGROVERSE) കാർഷിക ശാസ്ത്ര സഹായിയാണ്**. **${farm.name}**-ലെ മണ്ണ് വിവരങ്ങളും (${farm.soil_type}, pH ${farm.soil_ph}) നാസ (NASA) ഉപഗ്രഹ കാലാവസ്ഥാ വിവരങ്ങളും അടിസ്ഥാനമാക്കി കൃത്യമായ കാർഷിക നിർദ്ദേശങ്ങൾ നൽകാൻ ഞാൻ തയ്യാറാണ്.\n\nതാഴെ നൽകിയിരിക്കുന്ന ചോദ്യങ്ങളിൽ ക്ലിക്ക് ചെയ്യുകയോ അല്ലെങ്കിൽ നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുകയോ സംസാരിക്കുകയോ ചെയ്യാം.`
    : `Hello! I am your **AGROVERSE Agricultural AI Assistant & Agronomist**. I have synthesized real NASA Earth observations and soil characteristics (${farm.soil_type}, pH ${farm.soil_ph}) for **${farm.name}**.\n\nYou can speak or type any question regarding crop rotation, biological nitrogen fixation, fertilizer doses, pest control, or drought resilience.`;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: defaultWelcome,
      citations: [
        'NASA POWER Agroclimatology (v2.0)',
        'NASA SMAP Level-4 Global Root Zone Soil Moisture',
        'Kerala Agricultural University (KAU) Package of Practices 2024',
        'ICAR - Indian Institute of Pulses Research (IIPR)'
      ],
      dataSources: ['NASA POWER', 'NASA SMAP', 'ICAR', 'KAU']
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = lang === 'ml' ? [
    { id: 'all', label: 'എല്ലാം' },
    { id: 'rotation', label: 'വിളഭ്രമണം & പയർ' },
    { id: 'water', label: 'മഴക്കുറവ് & ജലസേചനം' },
    { id: 'soil', label: 'മണ്ണും കുമ്മായവും' },
    { id: 'pests', label: 'കീട-രോഗ നിയന്ത്രണം' },
    { id: 'crops', label: 'വാഴ & പച്ചക്കറി' }
  ] : [
    { id: 'all', label: 'All Queries' },
    { id: 'rotation', label: 'Crop Rotation & Legumes' },
    { id: 'water', label: 'Drought & Water Saving' },
    { id: 'soil', label: 'Soil Health & Lime' },
    { id: 'pests', label: 'Pest & Disease IPM' },
    { id: 'crops', label: 'Banana & Cash Crops' }
  ];

  const categorizedQuestions: Record<string, { en: string; ml: string }[]> = {
    rotation: [
      { en: "Why should I grow cowpea after rice?", ml: "നെല്ല് കൊയ്തയുടൻ പയർ നടുന്നത് എന്തുകൊണ്ട് നല്ലതാണ്?" },
      { en: "How much nitrogen do legumes fix in soil?", ml: "പയർവർഗ്ഗങ്ങൾ മണ്ണിൽ എത്രത്തോളം നൈട്രജൻ നിക്ഷേപിക്കുന്നു?" }
    ],
    water: [
      { en: "Which rotation plan uses less water during drought?", ml: "കുറഞ്ഞ വെള്ളത്തിൽ ചെയ്യാൻ പറ്റിയ കൃഷി ഏതാണ്?" },
      { en: "What should I do if rainfall decreases by 20%?", ml: "മഴ 20% കുറഞ്ഞാൽ ഞാൻ എന്ത് വിള മാറ്റണം?" }
    ],
    soil: [
      { en: "How much agricultural lime should I apply for laterite soil?", ml: "ലാറ്ററൈറ്റ് മണ്ണിൽ എത്ര അളവിൽ കുമ്മായം പ്രയോഗിക്കണം?" },
      { en: "What is the optimal N-P-K fertilizer split dose?", ml: "ശരിയായ N-P-K രാസവള ഗഡുക്കൾ എങ്ങനെ നൽകണം?" }
    ],
    pests: [
      { en: "How to prepare organic neem-garlic emulsion for pests?", ml: "ജൈവ കീടനിയന്ത്രണത്തിന് വേപ്പെണ്ണ മിശ്രിതം എങ്ങനെ തയ്യാറാക്കാം?" },
      { en: "How to prevent fungal blast and rot in wet conditions?", ml: "ഈർപ്പമുള്ള കാലാവസ്ഥയിൽ കുമിൾ രോഗങ്ങളെ എങ്ങനെ തടയാം?" }
    ],
    crops: [
      { en: "What are the pit and fertilizer requirements for Nendran banana?", ml: "നേന്ത്രവാഴയ്ക്ക് കുഴിയെടുക്കലും അടിവളവും എങ്ങനെ ചെയ്യണം?" },
      { en: "Which high-value crops best fit my farm soil and climate?", ml: "എന്റെ മണ്ണിനും കാലാവസ്ഥയ്ക്കും അനുയോജ്യമായ വിളകൾ ഏതാണ്?" }
    ]
  };

  const getFilteredQuestions = () => {
    if (selectedCategory === 'all') {
      return Object.values(categorizedQuestions).flatMap(list => list.map(q => lang === 'ml' ? q.ml : q.en));
    }
    return (categorizedQuestions[selectedCategory] || []).map(q => lang === 'ml' ? q.ml : q.en);
  };

  // Speech Recognition (Web Speech API)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'ml' ? 'നിങ്ങളുടെ ബ്രൗസറിൽ ശബ്ദ തിരിച്ചറിയൽ ലഭ്യമല്ല. ദയവായി ടൈപ്പ് ചെയ്യുക.' : 'Speech recognition is not supported in this browser. Please type your question.');
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
      let res;
      try {
        res = await api.askAssistant(q, farm.id);
      } catch {
        // Fallback to high-precision local agronomic intelligence engine
        res = getLocalAIResponse(q, farm, lang);
      }

      const botMsg: Message = {
        role: 'assistant',
        content: res.response,
        citations: res.citations,
        dataSources: res.data_sources_referenced
      };
      setMessages(prev => [...prev, botMsg]);

      // Auto-read response for farmer accessibility
      speakText(res.response, lang);
      setIsSpeaking(true);
    } catch {
      const fallback = getLocalAIResponse(q, farm, lang);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallback.response,
        citations: fallback.citations,
        dataSources: fallback.data_sources_referenced
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    stopSpeech();
    setIsSpeaking(false);
    setMessages([
      {
        role: 'assistant',
        content: defaultWelcome,
        citations: [
          'NASA POWER Agroclimatology (v2.0)',
          'NASA SMAP Level-4 Global Root Zone Soil Moisture',
          'Kerala Agricultural University (KAU) Package of Practices 2024'
        ]
      }
    ]);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner / Context Card */}
      <div className="glass-card p-5 sm:p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              {lang === 'ml' ? 'അഗ്രോവേഴ്സ് കാർഷിക AI സഹായി' : 'AGROVERSE Agricultural AI'}
            </span>
            <span className="text-[11px] text-emerald-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-neutral-200 font-semibold flex items-center gap-1">
              <Satellite className="w-3 h-3 text-sky-600" />
              NASA Earth Observations Linked
            </span>
            <span className="text-[11px] text-neutral-600 bg-white/80 px-2.5 py-0.5 rounded-full border border-neutral-200 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              ICAR-KAU Science Grounded
            </span>
          </div>

          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            {t.assistantTitle}
          </h2>
          <p className="text-neutral-700 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            {t.assistantDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {isSpeaking && (
            <button
              onClick={() => { stopSpeech(); setIsSpeaking(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t.stopAudio}</span>
            </button>
          )}

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-300 text-xs font-semibold shadow-xs transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'പുതിയ സംഭാഷണം' : 'Reset Chat'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Suggested Prompts */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                selectedCategory === c.id
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-neutral-900 border-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {getFilteredQuestions().slice(0, 4).map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/90 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-900 border border-neutral-300 hover:border-emerald-300 shadow-xs transition flex items-center gap-1.5 text-left"
            >
              <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{sq}</span>
              <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-card border border-white/80 shadow-xl rounded-3xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                m.role === 'user' ? 'bg-neutral-800 text-white' : 'bg-emerald-800 text-white'
              }`}>
                {m.role === 'user' ? 'U' : <Bot className="w-4 h-4 text-emerald-200" />}
              </div>

              <div className={`relative group p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white/95 text-neutral-800 border border-neutral-200/90 shadow-xs'
              }`}>
                {/* Copy Button for Assistant Message */}
                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.content, idx)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition opacity-0 group-hover:opacity-100"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}

                <div className="whitespace-pre-line font-normal">{m.content}</div>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-200/70 text-[11px] text-neutral-600 font-medium">
                    <span className="font-bold text-emerald-950 block mb-1">
                      {lang === 'ml' ? 'ശാസ്ത്രീയ ഉറവിടങ്ങൾ (Verified References):' : 'Scientific References & Datasets:'}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-neutral-700">
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
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span>
                  {lang === 'ml' 
                    ? 'നാസ ഉപഗ്രഹ വിവരങ്ങളും കാർഷിക ഗവേഷണങ്ങളും പരിശോധിക്കുന്നു...' 
                    : 'Synthesizing NASA Earth observations & agricultural science...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Voice & Text Input Bar */}
        <div className="p-4 bg-white/95 border-t border-neutral-200 flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-xl border font-bold transition shadow-xs flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
            }`}
            title={lang === 'ml' ? 'ശബ്ദത്തിലൂടെ സംസാരിക്കുക' : 'Speak your question'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={isListening ? t.listening : (lang === 'ml' ? 'കാർഷിക സംശയങ്ങൾ ചോദിക്കാം...' : t.askPlaceholder)}
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
