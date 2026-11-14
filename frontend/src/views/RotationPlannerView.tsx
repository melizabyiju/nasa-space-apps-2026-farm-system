import React, { useState, useEffect } from 'react';
import { Farm, RotationStrategy } from '../types';
import { api } from '../api';
import { 
  RotateCcw, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Scale, 
  Calendar, 
  AlertTriangle, 
  ChevronRight,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface RotationPlannerViewProps {
  farm: Farm;
  onNavigateToSimulator: () => void;
  lang: Language;
}

export const RotationPlannerView: React.FC<RotationPlannerViewProps> = ({ 
  farm, 
  onNavigateToSimulator,
  lang 
}) => {
  const t = translations[lang];
  const [strategies, setStrategies] = useState<RotationStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('strat-soil-regeneration');
  const [compareMode, setCompareMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getRotationStrategies(farm.id)
      .then((data) => {
        if (isMounted) {
          setStrategies(data.strategies);
          if (data.strategies.length > 0) {
            setSelectedStrategyId(data.strategies[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [farm.id]);

  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];

  const handleVoiceRead = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = lang === 'ml'
      ? `${farm.name}-നായി തയ്യാറാക്കിയ വിള പരിക്രമണ പദ്ധതികൾ. പദ്ധതി 1: നെല്ലിനു ശേഷം പയറോ ചെറുപയറോ കൃഷി ചെയ്യുന്നത് വഴി മണ്ണിൽ സ്വാഭാവിക നൈട്രജൻ ലഭിക്കും. യൂറിയ വളം കുറയ്ക്കാം.`
      : `Crop rotation plans for ${farm.name}. Plan 1 focuses on soil health by following rice with cowpea to fix free natural nitrogen.`;

    speakText(textToRead, lang);
    setIsSpeaking(true);
  };

  const radarData = [
    { subject: 'Soil Health', fullMark: 100 },
    { subject: 'Water Conserve', fullMark: 100 },
    { subject: 'Climate Resil.', fullMark: 100 },
    { subject: 'Profitability', fullMark: 100 },
    { subject: 'Farmer Pref.', fullMark: 100 },
  ].map((metric) => {
    const keyMap: Record<string, keyof RotationStrategy['radar_metrics']> = {
      'Soil Health': 'soil_health',
      'Water Conserve': 'water_conservation',
      'Climate Resil.': 'climate_resilience',
      'Profitability': 'economic_profitability',
      'Farmer Pref.': 'farmer_preference',
    };
    const key = keyMap[metric.subject];
    return {
      subject: metric.subject,
      SoilPlan: strategies[0]?.radar_metrics[key] || 0,
      ClimatePlan: strategies[1]?.radar_metrics[key] || 0,
      CommercialPlan: strategies[2]?.radar_metrics[key] || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
              {lang === 'ml' ? 'പ്രധാന പദ്ധതി' : 'Core Recommendation'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">Kerala Agri University Directives</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {t.rotationTitle}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {t.rotationDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleVoiceRead}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
              isSpeaking
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            <span>{isSpeaking ? t.stopAudio : t.readAloud}</span>
          </button>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              compareMode
                ? 'bg-emerald-900 text-white'
                : 'bg-white hover:bg-white text-neutral-800 border border-neutral-300'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{compareMode ? t.singlePlan : t.comparePlans}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Generating multi-season sequences based on NASA climate data...</p>
        </div>
      ) : compareMode ? (
        /* COMPARISON MODE */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 glass-card p-6 border border-white/80 shadow-md">
              <h3 className="font-extrabold text-base text-neutral-900 mb-1">
                {lang === 'ml' ? '3 പദ്ധതികളുടെ താരതമ്യം' : 'Trade-Off Comparison (Radar)'}
              </h3>
              <p className="text-xs text-neutral-500 mb-4">Comparing soil benefits, water conservation, and income potential</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#374151' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Radar name="Soil Healing" dataKey="SoilPlan" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                    <Radar name="Water Saving" dataKey="ClimatePlan" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Cash Vegetables" dataKey="CommercialPlan" stroke="#d97706" fill="#f59e0b" fillOpacity={0.25} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 glass-card p-6 border border-white/80 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 mb-2">
                  {lang === 'ml' ? 'ഏതാണ് നിങ്ങളുടെ കൃഷിയിടത്തിന് അനുയോജ്യം?' : 'Which Plan Fits Your Goal?'}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-300">
                    <strong className="text-emerald-950 text-sm block">1. Soil Healing & Nitrogen (ശുപാർശ ചെയ്യുന്നത്)</strong>
                    <p className="text-neutral-700 mt-1 font-medium">
                      Best if you want to restore soil fertility, cut down synthetic urea expenses, and break continuous rice weed cycles.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-300">
                    <strong className="text-blue-950 text-sm block">2. Save Water & Drought Defense</strong>
                    <p className="text-neutral-700 mt-1 font-medium">
                      Saves 40% water by switching to drought-hardy maize, groundnut, and sesame if summer rainfall is low.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300">
                    <strong className="text-amber-950 text-sm block">3. Commercial Diversity (Cash Vegetables)</strong>
                    <p className="text-neutral-700 mt-1 font-medium">
                      Introduces quick Okra and cucurbits for steady weekly market revenue between staple crops.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToSimulator}
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-300" />
                <span>{t.testWeatherBtn}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SINGLE DETAILED PLAN VIEW */
        <div className="space-y-6">
          {/* Strategy Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {strategies.map((strat, idx) => (
              <button
                key={strat.id}
                onClick={() => setSelectedStrategyId(strat.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border ${
                  selectedStrategyId === strat.id
                    ? 'glass-card bg-white shadow-md border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'glass-card bg-white/75 hover:bg-white/90 border-white/70'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                  {lang === 'ml' ? `പദ്ധതി ${idx + 1}` : `Plan Option ${idx + 1}`}
                </div>
                <div className="font-extrabold text-sm text-neutral-900 mt-1">{strat.title}</div>
                <div className="text-xs text-neutral-600 mt-1.5 flex items-center gap-2 font-medium">
                  <span>💧 {strat.water_footprint}</span>
                  <span>•</span>
                  <span>🌱 {strat.estimated_n_fixed_kg_ha}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Strategy In-depth Timeline */}
          {selectedStrategy && (
            <div className="glass-card p-6 border border-white/80 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {selectedStrategy.primary_focus}
                  </span>
                  <h3 className="text-2xl font-extrabold text-neutral-900 mt-1.5">{selectedStrategy.title}</h3>
                  <p className="text-neutral-700 text-sm mt-0.5 font-medium">{selectedStrategy.tagline}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="p-3 rounded-xl bg-white/90 border border-neutral-200 text-center">
                    <span className="text-neutral-400 block text-[10px]">Water Needed</span>
                    <span className="text-blue-800 text-sm">{selectedStrategy.water_footprint}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-neutral-200 text-center">
                    <span className="text-neutral-400 block text-[10px]">Natural N₂</span>
                    <span className="text-emerald-800 text-sm">{selectedStrategy.estimated_n_fixed_kg_ha}</span>
                  </div>
                </div>
              </div>

              {/* TIMELINE VISUALIZATION */}
              <div>
                <h4 className="font-extrabold text-base text-neutral-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-800" />
                  <span>{lang === 'ml' ? 'വിള പരിക്രമണ ഘട്ടങ്ങൾ' : 'Multi-Season Sequence & Crop Rotation Timeline'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedStrategy.timeline.map((stage, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-white/95 border border-neutral-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Stage {idx + 1}
                          </span>
                          <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {stage.duration}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-neutral-500">{stage.season}</div>
                        <div className="text-xl font-extrabold text-neutral-900 mt-1">{stage.crop}</div>
                        <div className="text-xs text-neutral-400 italic mb-2.5">Botanical Family: {stage.family}</div>

                        <p className="text-xs text-neutral-800 leading-relaxed font-medium mb-2">
                          <strong>Purpose:</strong> {stage.role}
                        </p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          <strong>Soil Impact:</strong> {stage.soil_impact}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-neutral-500">Water Demand:</span>
                        <span className="text-blue-800">{stage.water_demand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advantages and Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300">
                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'ml' ? 'കർഷക നേട്ടങ്ങൾ' : 'Key Agronomic Advantages'}</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-800 font-medium">
                    {selectedStrategy.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300">
                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-amber-950 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>{lang === 'ml' ? 'ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ' : 'Important Farm Caveats'}</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-800 font-medium">
                    {selectedStrategy.limitations.map((lim, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-700 font-bold">•</span>
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
