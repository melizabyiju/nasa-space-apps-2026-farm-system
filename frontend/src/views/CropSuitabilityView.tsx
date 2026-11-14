import React, { useState, useEffect } from 'react';
import { Farm, CropSuitability } from '../types';
import { api } from '../api';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Volume2,
  VolumeX,
  Sparkles,
  Droplets,
  Thermometer,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { getCropImage } from '../cropImages';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface CropSuitabilityViewProps {
  farm: Farm;
  lang: Language;
}

export const CropSuitabilityView: React.FC<CropSuitabilityViewProps> = ({ farm, lang }) => {
  const t = translations[lang];
  const [rankings, setRankings] = useState<CropSuitability[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [farm.id]);

  const toggleExpand = (id: string) => {
    setExpandedCropId(expandedCropId === id ? null : id);
  };

  const handleVoiceRead = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const topCrops = rankings.slice(0, 3).map(r => r.crop_name).join(', ');
    const textToRead = lang === 'ml'
      ? `${farm.name}-ൽ കൃഷി ചെയ്യാൻ ഏറ്റവും അനുയോജ്യമായ വിളകൾ ${topCrops} എന്നിവയാണ്. ഇവ നിങ്ങളുടെ മണ്ണിന്റെ ഗുണത്തോടും ഇന്നത്തെ കാലാവസ്ഥയോടും നന്നായി പൊരുത്തപ്പെടുന്നു.`
      : `Based on NASA climate data and your soil type, the top recommended crops for ${farm.name} are ${topCrops}.`;

    speakText(textToRead, lang);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {lang === 'ml' ? 'വിള അനുയോജ്യത' : 'Field Suitability Engine'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">{farm.soil_type} • pH {farm.soil_ph ?? '6.2'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {lang === 'ml' ? `${farm.name}-ൽ ഏതൊക്കെ വിളകൾ നടാം?` : `What Can You Grow on ${farm.name}?`}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {lang === 'ml'
              ? 'നാസ ഉപഗ്രഹ കാലാവസ്ഥയും നിങ്ങളുടെ കൃഷിയിടത്തിലെ മണ്ണും ഒത്തുനോക്കി നൽകുന്ന ലളിതമായ സ്കോർ.'
              : 'Clear 0–100 scores showing which crops match your local temperature, rain, and soil.'}
          </p>
        </div>

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
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Comparing NASA climate numbers with crop requirements...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((item, idx) => {
            const isExpanded = expandedCropId === item.crop_id;
            const isTop = idx < 3;
            const imgSrc = getCropImage(item.crop_id);

            return (
              <div
                key={item.crop_id}
                className={`glass-card p-4 sm:p-5 border transition-all duration-200 ${
                  isTop
                    ? 'border-emerald-300 bg-white/90 shadow-md'
                    : 'border-white/80 bg-white/75 hover:bg-white/85'
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(item.crop_id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Crop Photo */}
                    <img
                      src={imgSrc}
                      alt={item.crop_name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-xs border border-neutral-200 shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center ${
                          idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-neutral-200 text-neutral-800' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          #{idx + 1}
                        </span>
                        <h3 className="font-extrabold text-base sm:text-lg text-neutral-900">{item.crop_name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.score >= 80
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.score >= 60
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {item.score >= 80 ? t.optimal : item.score >= 60 ? t.moderate : t.stress}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 font-medium">{item.benefits}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0 pl-16 sm:pl-0">
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-extrabold text-neutral-900">{item.score} / 100</div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Suitability</div>
                    </div>

                    <button className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-200/60 space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <span className="font-bold text-neutral-700 flex items-center gap-1 mb-0.5">
                          <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature: {item.factors.temperature?.score}%
                        </span>
                        <p className="text-neutral-600 text-[11px]">{item.factors.temperature?.reason}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <span className="font-bold text-neutral-700 flex items-center gap-1 mb-0.5">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" /> Water Match: {item.factors.water?.score}%
                        </span>
                        <p className="text-neutral-600 text-[11px]">{item.factors.water?.reason}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <span className="font-bold text-neutral-700 flex items-center gap-1 mb-0.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" /> Soil Synergy: {item.factors.soil?.score}%
                        </span>
                        <p className="text-neutral-600 text-[11px]">{item.factors.soil?.reason}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <span className="font-bold text-neutral-700 flex items-center gap-1 mb-0.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-purple-600" /> Rotation Fit: {item.factors.farmer_alignment?.score}%
                        </span>
                        <p className="text-neutral-600 text-[11px]">{item.factors.farmer_alignment?.reason}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-500 pt-1">
                      Scientific Reference: <strong>{item.reference}</strong>
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
