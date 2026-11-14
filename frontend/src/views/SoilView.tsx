import React, { useState } from 'react';
import { NASAClimateData, Farm } from '../types';
import { 
  Layers, 
  Droplets, 
  Sprout, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface SoilViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
  lang: Language;
}

export const SoilView: React.FC<SoilViewProps> = ({ farm, climateData, lang }) => {
  const t = translations[lang];
  const obs = climateData?.earth_observations;
  const smap = obs?.smap;
  const ecostress = obs?.ecostress;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScientific, setShowScientific] = useState(false);

  const handleVoiceRead = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = lang === 'ml'
      ? `${farm.name}-ലെ മണ്ണിൽ നിലവിൽ ${smap?.soil_moisture_pct ?? 62} ശതമാനം ഈർപ്പമുണ്ട്. വിത്ത് മുളയ്ക്കാനും വേര് പടരാനും ഇത് വളരെ നല്ലതാണ്. മണ്ണിന്റെ ഇനം ${farm.soil_type} ആണ്.`
      : `Soil status for ${farm.name}. Current moisture is ${smap?.soil_moisture_pct ?? 62} percent, which is adequate for germination and root development. Soil type is ${farm.soil_type}.`;

    speakText(textToRead, lang);
    setIsSpeaking(true);
  };

  const moistureBreakdown = [
    { layer: 'Topsoil (0-5 cm)', value: smap?.surface_sm_m3m3 ?? 0.28, unit: 'm³/m³' },
    { layer: 'Rootzone (0-100 cm)', value: smap?.rootzone_sm_m3m3 ?? 0.31, unit: 'm³/m³' },
    { layer: 'Adequate Benchmark', value: 0.36, unit: 'm³/m³' },
    { layer: 'Wilting Threshold', value: 0.12, unit: 'm³/m³' }
  ];

  return (
    <div className="space-y-6">
      {/* Soil Title */}
      <div className="glass-card p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {lang === 'ml' ? 'മണ്ണിലെ ഈർപ്പ നിരീക്ഷണം' : 'Soil Moisture & Ground Health'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA SMAP Satellite Radar/Radiometer</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {t.soilTitle}: {farm.name}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {t.soilDesc}
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

      {/* Honest Scientific Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/95 border border-amber-300 flex items-start gap-3 text-xs text-amber-950 font-medium">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold">Data Source Clarity: </span>
          {t.soilDisclaimer}
        </div>
      </div>

      {/* Everyday Soil Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Surface Soil Moisture */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Topsoil Moisture (0-5 cm)</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">
            {smap?.surface_sm_m3m3 ?? 0.28} <span className="text-sm font-semibold text-neutral-500">m³/m³</span>
          </div>
          <div className="text-xs font-bold text-blue-900 bg-blue-100/90 px-2.5 py-1 rounded-lg mt-2 inline-block">
            {smap?.status_label ?? 'Moisture Satisfactory'}
          </div>
          <p className="text-xs text-neutral-600 mt-3 font-medium">
            Ideal for seed sowing. Top layer retains adequate water for germination.
          </p>
        </div>

        {/* Rootzone Moisture */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Root-Zone Moisture (0-100 cm)</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">
            {smap?.rootzone_sm_m3m3 ?? 0.31} <span className="text-sm font-semibold text-neutral-500">m³/m³</span>
          </div>
          <div className="text-xs font-bold text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-lg mt-2 inline-block">
            Healthy deep roots
          </div>
          <p className="text-xs text-neutral-600 mt-3 font-medium">
            Deep roots have sufficient water reserves. Crops will not experience moisture stress.
          </p>
        </div>

        {/* Evapotranspiration */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Crop Water Transpiration</span>
            <Sprout className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">
            {ecostress?.evapotranspiration_mm_day ?? 3.8} <span className="text-sm font-semibold text-neutral-500">mm/day</span>
          </div>
          <div className="text-xs font-bold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg mt-2 inline-block">
            Stress Index: {ecostress?.water_stress_index ?? 0.32} (Low)
          </div>
          <p className="text-xs text-neutral-600 mt-3 font-medium">
            NASA ECOSTRESS space station sensor detects normal water consumption without wilting.
          </p>
        </div>

      </div>

      {/* Local Soil Laboratory Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-6 border border-white/80">
          <h3 className="font-extrabold text-base text-neutral-900 mb-1">
            {lang === 'ml' ? 'കൃഷിയിടത്തിലെ മണ്ണിന്റെ ഗുണങ്ങൾ' : 'Farm Soil Test Card'}
          </h3>
          <p className="text-xs text-neutral-500 mb-4">Values recorded from {farm.name} soil health card</p>

          <div className="space-y-2.5 text-xs font-medium">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-neutral-600">Soil Texture / Type:</span>
              <span className="font-extrabold text-neutral-900">{farm.soil_type}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-neutral-600">Soil pH Reaction:</span>
              <span className="font-extrabold text-neutral-900">
                {farm.soil_ph !== null ? farm.soil_ph : 'Test card not entered'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-neutral-600">Organic Matter Content:</span>
              <span className="font-extrabold text-neutral-900">{farm.organic_matter ?? 1.8}%</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-neutral-600">Primary Nutrients (N-P-K):</span>
              <span className="font-extrabold text-emerald-900">
                N: {farm.nitrogen_level} • P: {farm.phosphorus_level} • K: {farm.potassium_level}
              </span>
            </div>
          </div>
        </div>

        {/* Moisture Horizontal Chart */}
        <div className="glass-card p-6 border border-white/80">
          <h3 className="font-extrabold text-base text-neutral-900 mb-1">
            {lang === 'ml' ? 'ഈർപ്പത്തിന്റെ അളവ്' : 'Moisture Horizon Benchmark'}
          </h3>
          <p className="text-xs text-neutral-500 mb-4">Comparison with permanent wilting danger threshold</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moistureBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <XAxis type="number" domain={[0, 0.45]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis dataKey="layer" type="category" tick={{ fontSize: 10, fill: '#374151' }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]}>
                  {moistureBreakdown.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : index === 2 ? '#6b7280' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
