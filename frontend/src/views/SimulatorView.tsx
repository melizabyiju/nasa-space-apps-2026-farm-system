import React, { useState } from 'react';
import { Farm, ScenarioSimulationResult } from '../types';
import { api } from '../api';
import { 
  SlidersHorizontal, 
  Play, 
  Thermometer, 
  CloudRain, 
  TrendingDown, 
  TrendingUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface SimulatorViewProps {
  farm: Farm;
  lang: Language;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ farm, lang }) => {
  const t = translations[lang];
  const [rainDelta, setRainDelta] = useState<number>(-20); // -20% rainfall
  const [tempDelta, setTempDelta] = useState<number>(1.5); // +1.5°C
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const data = await api.simulateScenario({
        farm_id: farm.id,
        rainfall_delta_pct: rainDelta,
        temp_delta_c: tempDelta,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('Simulation error: ' + e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    runSimulation();
  }, [farm.id]);

  const handleVoiceRead = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = lang === 'ml'
      ? `കാലാവസ്ഥ പരീക്ഷണ ഫലം. മഴ ${Math.abs(rainDelta)} ശതമാനം കുറഞ്ഞാൽ നെല്ലിന് വെള്ളം കുറവായിരിക്കും. പയറുവർഗ്ഗങ്ങളും ചോളവും കൃഷി ചെയ്യുന്നതാണ് കൂടുതൽ സുരക്ഷിതം.`
      : `Weather scenario test: With a ${Math.abs(rainDelta)} percent rainfall drop, shifting from wetland rice to drought-resilient legumes and maize is advised.`;

    speakText(textToRead, lang);
    setIsSpeaking(true);
  };

  const chartData = (result?.crop_impacts || []).slice(0, 7).map(c => ({
    name: c.name,
    Baseline: c.baseline_score,
    Simulated: c.simulated_score,
  }));

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-300">
              {lang === 'ml' ? 'കാലാവസ്ഥ പരീക്ഷണ ശാല' : 'Weather Resilience Sandbox'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA Climate Perturbation Testing</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {t.simulatorTitle}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {t.simulatorDesc}
          </p>
        </div>

        <button
          onClick={handleVoiceRead}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
            isSpeaking
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-300'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-700" />}
          <span>{isSpeaking ? t.stopAudio : t.readAloud}</span>
        </button>
      </div>

      {/* Simulator Control Sliders */}
      <div className="glass-card p-6 border border-white/80 shadow-md">
        <h3 className="text-base font-extrabold text-neutral-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-800" />
          <span>{lang === 'ml' ? 'കാലാവസ്ഥ മാറ്റങ്ങൾ തെരഞ്ഞെടുക്കുക' : 'Adjust Weather Sliders'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rainfall Slider */}
          <div className="p-4 rounded-2xl bg-white/90 border border-neutral-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" /> {t.rainSlider}
              </span>
              <span className={`text-base font-extrabold ${rainDelta < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {rainDelta > 0 ? `+${rainDelta}%` : `${rainDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={rainDelta}
              onChange={(e) => setRainDelta(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 font-bold mt-1.5">
              <span>-50% (വരൾച്ച / Drought)</span>
              <span>സാധാരണ (Normal)</span>
              <span>+50% (കനത്ത മഴ / Heavy Rain)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="p-4 rounded-2xl bg-white/90 border border-neutral-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" /> {t.tempSlider}
              </span>
              <span className="text-base font-extrabold text-amber-600">
                +{tempDelta}°C
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4.0"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-2"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 font-bold mt-1.5">
              <span>+0°C (ഇന്നത്തെ ചൂട്)</span>
              <span>+2°C (കൂടിയ ചൂട്)</span>
              <span>+4°C (കഠിനമായ വേനൽ)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={runSimulation}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Calculating...' : t.runTestBtn}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300">
            <div className="font-extrabold text-emerald-950 text-sm mb-1">
              🌱 {lang === 'ml' ? 'കർഷകർക്കുള്ള മുൻകരുതൽ ഉപദേശം' : 'Recommended Adaptation for Farmers'}:
            </div>
            <p className="text-xs text-neutral-800 font-medium leading-relaxed">
              {result.risk_assessment.recommended_adaptation}
            </p>
          </div>

          <div className="glass-card p-6 border border-white/80 shadow-md">
            <h3 className="font-extrabold text-base text-neutral-900 mb-3">
              {lang === 'ml' ? 'വിളകളുടെ പ്രതിരോധ ശേഷി' : 'Crop Resilience Under This Weather'}
            </h3>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4b5563' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#4b5563' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="Baseline" fill="#9ca3af" name="Normal Weather" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#059669" name="Tested Weather" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
