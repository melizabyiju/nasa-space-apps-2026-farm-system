import React, { useState, useEffect } from 'react';
import { Farm, RotationStrategy } from '../types';
import { api } from '../api';
import { 
  RotateCcw, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Layers, 
  Scale,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

interface RotationPlannerViewProps {
  farm: Farm;
  onNavigateToSimulator: () => void;
}

export const RotationPlannerView: React.FC<RotationPlannerViewProps> = ({ farm, onNavigateToSimulator }) => {
  const [strategies, setStrategies] = useState<RotationStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('strat-soil-regeneration');
  const [compareMode, setCompareMode] = useState(false);

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
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [farm.id]);

  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];

  // Radar chart transformation
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
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
              Core Module • Multi-Season Sequence Engine
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA Earth Observations × Agronomic Rules</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Crop Rotation Strategy Generator
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Comparing 3 scientifically formulated multi-season rotation sequences for <strong>{farm.name}</strong> to safeguard soil health, minimize water demand, and disrupt pathogen lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm ${
              compareMode
                ? 'bg-emerald-900 text-white'
                : 'bg-white/80 hover:bg-white text-neutral-700 border border-neutral-300'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{compareMode ? 'Single Plan View' : 'Compare 3 Strategies'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Generating multi-season sequences based on NASA climate data...</p>
        </div>
      ) : compareMode ? (
        /* COMPARISON MODE (Section 11 Requirement) */
        <div className="space-y-6">
          {/* Radar Chart Multi-Plan Tradeoff */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 glass-card p-6 border border-white/70 shadow-md">
              <h3 className="font-bold text-base text-neutral-900 mb-1">Multidimensional Strategy Trade-Offs</h3>
              <p className="text-xs text-neutral-500 mb-4">Radar comparison across 5 agronomic pillars (0-100 scale)</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#374151' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Radar name="Soil Regeneration" dataKey="SoilPlan" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                    <Radar name="Climate & Water" dataKey="ClimatePlan" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Commercial Diversity" dataKey="CommercialPlan" stroke="#d97706" fill="#f59e0b" fillOpacity={0.25} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategy Trade-offs Summary Table */}
            <div className="lg:col-span-6 glass-card p-6 border border-white/70 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-neutral-900 mb-1">Scientific Trade-off Synthesis</h3>
                <p className="text-xs text-neutral-500 mb-4">No single plan is declared an absolute winner; evaluate by farm goals:</p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                    <strong className="text-emerald-950 block">Strategy 1: Soil Regeneration</strong>
                    <p className="text-neutral-700 mt-0.5">
                      Fixes 45-65 kg N/ha via Cowpea/Moong. Best if farm soil exhibits low organic carbon or after long continuous paddy.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/70">
                    <strong className="text-blue-950 block">Strategy 2: Climate & Water Conservation</strong>
                    <p className="text-neutral-700 mt-0.5">
                      Conserves ~40% water (Maize-Groundnut-Sesame). Essential if monsoon precipitation arrives late or is deficient.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <strong className="text-amber-950 block">Strategy 3: Commercial & Agro-Economic</strong>
                    <p className="text-neutral-700 mt-0.5">
                      Integrates cash vegetables (Okra) for weekly farm cash flow between cereal and legume seasons.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToSimulator}
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-300" />
                <span>Stress-Test in Climate Scenario Simulator</span>
              </button>
            </div>
          </div>

          {/* 3 Columns Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {strategies.map((strat, i) => (
              <div key={strat.id} className="glass-card p-5 border border-white/80 shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Option {i + 1}
                  </span>
                  <h4 className="font-bold text-base text-neutral-900">{strat.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1 mb-4">{strat.tagline}</p>

                  <div className="space-y-2 text-xs border-t border-neutral-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Water Footprint:</span>
                      <span className="font-bold text-blue-700">{strat.water_footprint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Estimated N Fixed:</span>
                      <span className="font-bold text-emerald-700">{strat.estimated_n_fixed_kg_ha}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Duration:</span>
                      <span className="font-semibold text-neutral-800">{strat.rotation_length}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-neutral-700 block mb-2">Crop Sequence:</span>
                    <div className="space-y-1.5">
                      {strat.timeline.map((step, sIdx) => (
                        <div key={sIdx} className="p-2 rounded-lg bg-white/70 border border-neutral-200/50 text-xs flex items-center justify-between">
                          <span className="font-bold text-emerald-950">{step.crop}</span>
                          <span className="text-[10px] text-neutral-500">{step.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedStrategyId(strat.id);
                    setCompareMode(false);
                  }}
                  className="w-full mt-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition"
                >
                  View In-Depth Timeline
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SINGLE DETAILED PLAN VIEW */
        <div className="space-y-6">
          {/* Strategy Tabs */}
          <div className="flex flex-wrap gap-3">
            {strategies.map((strat, idx) => (
              <button
                key={strat.id}
                onClick={() => setSelectedStrategyId(strat.id)}
                className={`px-4 py-3 rounded-2xl text-left transition-all duration-200 flex-1 min-w-[240px] border ${
                  selectedStrategyId === strat.id
                    ? 'glass-card bg-white shadow-md border-emerald-600 ring-2 ring-emerald-600/20'
                    : 'glass-card bg-white/60 hover:bg-white/80 border-white/60'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Strategy {idx + 1}</div>
                <div className="font-bold text-sm text-neutral-900 truncate mt-0.5">{strat.title}</div>
                <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                  <span>{strat.water_footprint}</span>
                  <span>•</span>
                  <span>{strat.estimated_n_fixed_kg_ha}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Strategy Detail Header */}
          {selectedStrategy && (
            <div className="glass-card p-6 border border-white/80 shadow-lg space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                    {selectedStrategy.primary_focus}
                  </span>
                  <h3 className="text-2xl font-extrabold text-neutral-900 mt-2">{selectedStrategy.title}</h3>
                  <p className="text-neutral-600 text-sm mt-1">{selectedStrategy.tagline}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50 text-center">
                    <span className="text-neutral-400 block text-[10px]">Water Demand</span>
                    <span className="text-blue-700 font-bold">{selectedStrategy.water_footprint}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50 text-center">
                    <span className="text-neutral-400 block text-[10px]">Biological N₂</span>
                    <span className="text-emerald-700 font-bold">{selectedStrategy.estimated_n_fixed_kg_ha}</span>
                  </div>
                </div>
              </div>

              {/* TIMELINE VISUALIZATION (Requirement 9) */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Multi-Season Sequence & Crop Rotation Timeline</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {selectedStrategy.timeline.map((stage, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-white/80 border border-neutral-200/70 shadow-sm relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            Stage {idx + 1}
                          </span>
                          <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {stage.duration}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-neutral-500">{stage.season}</div>
                        <div className="text-xl font-extrabold text-neutral-900 mt-1">{stage.crop}</div>
                        <div className="text-xs text-neutral-400 italic mb-3">Family: {stage.family}</div>

                        <p className="text-xs text-neutral-700 mb-2 leading-relaxed">
                          <strong>Role:</strong> {stage.role}
                        </p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          <strong>Soil Impact:</strong> {stage.soil_impact}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Water Demand:</span>
                        <span className="font-bold text-blue-800">{stage.water_demand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advantages and Limitations Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> Agronomic Advantages
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {selectedStrategy.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" /> Agronomic Considerations & Caveats
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {selectedStrategy.limitations.map((lim, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-700 font-bold">•</span>
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Scientific Rationale Footnote */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-600">
                <span className="font-bold text-neutral-800">Scientific Rationale: </span>
                {selectedStrategy.scientific_rationale}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
