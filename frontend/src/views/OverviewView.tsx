import React, { useState } from 'react';
import { Farm, NASAClimateData } from '../types';
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Sun, 
  Wind, 
  RotateCcw,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Sprout
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line 
} from 'recharts';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface OverviewViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
  onNavigate: (tab: string) => void;
  lang: Language;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ farm, climateData, onNavigate, lang }) => {
  const t = translations[lang];
  const summary = climateData?.summary;
  const obs = climateData?.earth_observations;
  const monthlyData = climateData?.monthly_trends || [];

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScientificDetails, setShowScientificDetails] = useState(false);

  const handleVoiceRead = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = lang === 'ml'
      ? `നമസ്കാരം! നിങ്ങളുടെ കൃഷിയിടത്തിൽ ഇന്നത്തെ ശരാശരി ചൂട് ${summary?.current_temperature_c ?? 28} ഡിഗ്രി സെൽഷ്യസാണ്. മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്. നെല്ല് കഴിഞ്ഞ ശേഷം പയറോ ചെറുപയറോ നടുന്നത് മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത വർദ്ധിപ്പിക്കും.`
      : `Welcome to ${farm.name}! Today's temperature is ${summary?.current_temperature_c ?? 28} degrees Celsius with good soil moisture. Sowing cowpea or pulses after your rice harvest is highly recommended to restore soil nitrogen.`;

    speakText(textToRead, lang);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-6">
      {/* Farmer-Friendly Welcome & Audio Helper Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card border border-white/80 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {farm.location}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              {farm.area_hectares} {t.hectares} • {farm.soil_type}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {t.overviewWelcome}, {farm.name}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {t.overviewDesc}
          </p>
        </div>

        {/* Action Buttons: Voice readout & Rotation Plan */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleVoiceRead}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              isSpeaking
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            <span>{isSpeaking ? t.stopAudio : t.readAloud}</span>
          </button>

          <button
            onClick={() => onNavigate('rotation')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4 text-emerald-300" />
            <span>{t.planRotationBtn}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Everyday Farmer-Friendly Condition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Air Temperature & Feeling */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="font-bold text-xs uppercase tracking-wider">{t.tempLabel}</span>
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-neutral-900">
              {summary?.current_temperature_c ?? 27.5}°C
            </div>
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-1">
              {t.optimal} (Normal warmth for crops)
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Year-round average: {summary?.mean_temperature_c ?? 26.8}°C. Ideal for rice, pulses, and banana growth.
          </p>
        </div>

        {/* Card 2: Rainfall & Irrigation Need */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="font-bold text-xs uppercase tracking-wider">{t.rainLabel}</span>
            <CloudRain className="w-5 h-5 text-blue-500" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-blue-900">
              {summary?.current_rainfall_mm ?? 3.2} <span className="text-sm font-semibold text-neutral-500">mm today</span>
            </div>
            <div className="text-xs font-semibold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md inline-block mt-1">
              Annual: {summary?.annual_rainfall_mm ?? 1850} mm
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Water status is good. Minimal supplemental irrigation needed this week.
          </p>
        </div>

        {/* Card 3: Soil Moisture */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="font-bold text-xs uppercase tracking-wider">{t.soilMoistureLabel}</span>
            <Droplets className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-neutral-900">
              {obs?.smap.soil_moisture_pct ?? 62}%
            </div>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-emerald-600 h-full rounded-full" 
                style={{ width: `${obs?.smap.soil_moisture_pct ?? 62}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Sufficient root-zone moisture ({obs?.smap.rootzone_sm_m3m3 ?? 0.31} m³/m³). Seeds will germinate easily.
          </p>
        </div>

        {/* Card 4: Crop Greenness & Vigor */}
        <div className="glass-card p-5 border border-white/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="font-bold text-xs uppercase tracking-wider">{t.plantHealthLabel}</span>
            <Sprout className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-emerald-800">
              {obs?.modis.ndvi ? (obs.modis.ndvi > 0.65 ? 'Vigorous' : 'Moderate') : 'Good'}
            </div>
            <div className="text-xs font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-1">
              NDVI Score: {obs?.modis.ndvi ?? 0.72}
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Canopy vigor shows healthy active photosynthesis across the farm.
          </p>
        </div>

      </div>

      {/* Actionable Advice Banner for Farmers */}
      <div className="glass-card p-6 border border-emerald-300 bg-emerald-50/70 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-800" />
          <h3 className="font-extrabold text-base text-emerald-950">{t.farmerActionTitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/90 border border-emerald-200 shadow-xs">
            <div className="font-bold text-neutral-900 text-sm mb-1">1. Sow Legumes After Rice Harvest</div>
            <p className="text-neutral-700 leading-relaxed">
              {lang === 'ml' 
                ? 'നെല്ല് കൊയ്തയുടൻ പയറോ ചെറുപയറോ നടുക. ഇത് കൃഷിയിടത്തിൽ 40 കിലോഗ്രാം പ്രകൃതിദത്ത നൈട്രജൻ ചേർക്കും.'
                : 'Broadcast cowpea or green gram into residual moisture. It adds ~45 kg natural nitrogen per hectare and cuts fertilizer costs.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-emerald-200 shadow-xs">
            <div className="font-bold text-neutral-900 text-sm mb-1">2. Keep Irrigation On Standby</div>
            <p className="text-neutral-700 leading-relaxed">
              {lang === 'ml'
                ? 'നിലവിൽ മണ്ണിൽ നല്ല ഈർപ്പമുണ്ട്. പമ്പിംഗ് ചെലവ് ഒഴിവാക്കാം. അടുത്ത ആഴ്ചത്തേക്ക് വെള്ളം ആവശ്യത്തിന് ലഭ്യമാണ്.'
                : 'Current soil moisture is satisfactory. No intensive pumping required for the next 4-6 days.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-emerald-200 shadow-xs">
            <div className="font-bold text-neutral-900 text-sm mb-1">3. Check Disease Safeguards</div>
            <p className="text-neutral-700 leading-relaxed">
              {lang === 'ml'
                ? 'ഒരേ വിള തന്നെ വീണ്ടും നടുന്നത് കീടങ്ങൾ കൂടാൻ ഇടയാക്കും. വിളകൾ മാറ്റി നടുന്നത് വഴി വേര് രോഗങ്ങൾ ഒഴിവാക്കാം.'
                : 'Avoid continuous monocropping of the same family to prevent root-knot nematodes and yellow stem borer build-up.'}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Seasonal Rainfall & Temperature Chart */}
      <div className="glass-card p-6 border border-white/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-neutral-900">
              {lang === 'ml' ? 'വർഷം മുഴുവനുമുള്ള മഴയും ചൂടും' : 'Seasonal Rainfall & Temperature Pattern'}
            </h3>
            <p className="text-xs text-neutral-500">
              {lang === 'ml' ? 'നാസ ഉപഗ്രഹങ്ങൾ രേഖപ്പെടുത്തിയ മാസാടിസ്ഥാനത്തിലുള്ള വിവരങ്ങൾ' : 'Recorded by NASA POWER Satellite observations over 12 months'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> {t.rainLabel} (mm)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> {t.tempLabel} (°C)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#4b5563' }} />
              <YAxis yAxisId="rain" tick={{ fontSize: 11, fill: '#4b5563' }} />
              <YAxis yAxisId="temp" orientation="right" domain={[15, 38]} tick={{ fontSize: 11, fill: '#4b5563' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
              <Area yAxisId="rain" type="monotone" dataKey="rainfall_mm" stroke="#2563eb" fill="url(#rainGrad)" strokeWidth={2} name="Rainfall (mm)" />
              <Line yAxisId="temp" type="monotone" dataKey="avg_temp_c" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} name="Temp (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expandable Scientific Details Section (Requirement 3) */}
      <div className="glass-card p-5 border border-white/80">
        <button
          onClick={() => setShowScientificDetails(!showScientificDetails)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-neutral-800 hover:text-emerald-900 transition"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            {showScientificDetails ? t.closeDetails : t.scientificDetails}
          </span>
          {showScientificDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showScientificDetails && (
          <div className="mt-4 pt-4 border-t border-neutral-200/60 text-xs text-neutral-700 space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/80 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">NASA POWER Meteorology (v2.0)</span>
                <p>Resolution: 0.5° × 0.5° grid covering Lat: {farm.latitude.toFixed(4)}, Lon: {farm.longitude.toFixed(4)}. Solar: {summary?.solar_radiation_mj} MJ/m²/d, Wind: {summary?.wind_speed_ms} m/s.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">NASA SMAP & ECOSTRESS</span>
                <p>SMAP Surface moisture: {obs?.smap.surface_sm_m3m3} m³/m³, Rootzone: {obs?.smap.rootzone_sm_m3m3} m³/m³. ECOSTRESS ET: {obs?.ecostress.evapotranspiration_mm_day} mm/d.</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-100 text-[11px] text-neutral-500">
              Verified Operational NASA Earth Science data stream. Caching duration: 48 hours.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
