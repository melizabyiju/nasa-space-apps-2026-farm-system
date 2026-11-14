import React, { useState, useEffect } from 'react';
import { Farm, CropSuitability } from '../types';
import { api } from '../api';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Layers, 
  HeartHandshake,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CropSuitabilityViewProps {
  farm: Farm;
}

export const CropSuitabilityView: React.FC<CropSuitabilityViewProps> = ({ farm }) => {
  const [rankings, setRankings] = useState<CropSuitability[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getCropSuitability(farm.id)
      .then((data) => {
        if (isMounted) {
          setRankings(data.suitability_ranking);
          if (data.suitability_ranking.length > 0) {
            setExpandedCropId(data.suitability_ranking[0].crop_id);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [farm.id]);

  const toggleExpand = (id: string) => {
    setExpandedCropId(expandedCropId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Heuristic Suitability Engine
            </span>
            <span className="text-xs text-neutral-500 font-medium">Factor-by-Factor Agronomic Weighting</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Crop Suitability Scoring for {farm.name}
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Synthesizing NASA atmospheric observations (temperature, precipitation), farm soil measurements (pH {farm.soil_ph ?? 'Unspecified'}, {farm.soil_type}), and rotation compatibility.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Evaluating NASA Earth observation criteria against crop profiles...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((item, idx) => {
            const isExpanded = expandedCropId === item.crop_id;
            const isTopMatch = idx < 3;

            return (
              <div
                key={item.crop_id}
                className={`glass-card p-5 border transition-all duration-200 ${
                  isTopMatch
                    ? 'border-emerald-300 bg-white/85 shadow-md'
                    : 'border-white/70 bg-white/70 hover:bg-white/80'
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(item.crop_id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                      item.score >= 80 
                        ? 'bg-emerald-800 text-emerald-100' 
                        : item.score >= 60 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-neutral-900">{item.crop_name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.score >= 80
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.score >= 60
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {item.suitability_category}
                        </span>
                        {item.nitrogen_fixation && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 hidden sm:inline">
                            Nitrogen Fixer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 italic mt-0.5">{item.scientific_name} • {item.family}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    {/* Score Bar */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-neutral-900">{item.score} / 100</div>
                        <div className="text-[10px] text-neutral-400 font-medium">Suitability Score</div>
                      </div>
                      <div className="w-16 bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.score >= 80 ? 'bg-emerald-600' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>

                    <button className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Factor-by-Factor Breakdown */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-neutral-200/60 space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Factor Evaluation & Scientific Rationale:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Factor 1: Temperature */}
                      <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                          <span className="flex items-center gap-1.5">
                            <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature
                          </span>
                          <span className="font-bold text-neutral-900">{item.factors.temperature?.score}/100</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">{item.factors.temperature?.reason}</p>
                      </div>

                      {/* Factor 2: Water */}
                      <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                          <span className="flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-blue-500" /> Water & Rain
                          </span>
                          <span className="font-bold text-neutral-900">{item.factors.water?.score}/100</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">{item.factors.water?.reason}</p>
                      </div>

                      {/* Factor 3: Soil */}
                      <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Soil & pH
                          </span>
                          <span className="font-bold text-neutral-900">{item.factors.soil?.score}/100</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">{item.factors.soil?.reason}</p>
                      </div>

                      {/* Factor 4: Alignment */}
                      <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                          <span className="flex items-center gap-1.5">
                            <HeartHandshake className="w-3.5 h-3.5 text-purple-600" /> Rotation Synergy
                          </span>
                          <span className="font-bold text-neutral-900">{item.factors.farmer_alignment?.score}/100</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">{item.factors.farmer_alignment?.reason}</p>
                      </div>
                    </div>

                    {/* Agronomic Citations */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-neutral-500">
                      <div>
                        <strong>Rotation Benefit:</strong> {item.benefits}
                      </div>
                      <div className="italic text-neutral-400">
                        Reference: {item.reference}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
