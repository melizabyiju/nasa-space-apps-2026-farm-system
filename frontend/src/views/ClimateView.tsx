import React, { useState } from 'react';
import { NASAClimateData, Farm } from '../types';
import { 
  Thermometer, 
  CloudRain, 
  Sun, 
  Wind, 
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
  Line 
} from 'recharts';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface ClimateViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
  lang: Language;
}

export const ClimateView: React.FC<ClimateViewProps> = ({ farm, climateData, lang }) => {
  const t = translations[lang];
  const summary = climateData?.summary;
  const recent = climateData?.recent_daily || [];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScientific, setShowScientific] = useState(false);

  const handleVoiceRead = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = lang === 'ml'
      ? `${farm.name}-ലെ കാലാവസ്ഥ. ഇന്നത്തെ താപനില ${summary?.current_temperature_c ?? 28} ഡിഗ്രി. വർഷത്തിൽ ശരാശരി ${summary?.annual_rainfall_mm ?? 1850} മില്ലിമീറ്റർ മഴ ലഭിക്കുന്നു. വിളവളർച്ചയ്ക്ക് അനുയോജ്യമായ അന്തരീക്ഷമാണിത്.`
      : `Weather summary for ${farm.name}. Current temperature is ${summary?.current_temperature_c ?? 28} degrees with annual rainfall of ${summary?.annual_rainfall_mm ?? 1850} millimeters. Conditions are favorable for crop growth.`;

    speakText(textToRead, lang);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Attribution Card */}
      <div className="glass-card p-6 border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100/90 px-2.5 py-0.5 rounded-full border border-blue-300">
              {lang === 'ml' ? 'നാസ കാലാവസ്ഥ വിവരങ്ങൾ' : 'NASA Weather Intelligence'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA POWER Satellite Point Climatology</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {lang === 'ml' ? `${farm.name}-ലെ കാലാവസ്ഥാ വിശകലനം` : `Weather & Climate Conditions: ${farm.name}`}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {lang === 'ml'
              ? 'നാസ ഉപഗ്രഹങ്ങൾ അളക്കുന്ന മഴ, ചൂട്, വായുവിലെ ഈർപ്പം, കാറ്റിന്റെ വേഗത എന്നിവ ലളിതമായി കാണാം.'
              : 'Direct measurements of temperature, rainfall, humidity, and sunlight captured by NASA satellites.'}
          </p>
        </div>

        <button
          onClick={handleVoiceRead}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
            isSpeaking
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-white hover:bg-blue-50 text-blue-900 border border-blue-300'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-700" />}
          <span>{isSpeaking ? t.stopAudio : t.readAloud}</span>
        </button>
      </div>

      {/* Atmospheric Indicators Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-white/80">
          <div className="flex items-center gap-2 text-neutral-600 text-xs font-bold uppercase">
            <Thermometer className="w-4 h-4 text-amber-500" />
            <span>{t.tempLabel}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2">
            {summary?.current_temperature_c ?? 27.5}°C
          </div>
          <div className="text-xs font-medium text-neutral-500 mt-1">
            Yearly Mean: {summary?.mean_temperature_c ?? 26.8}°C
          </div>
        </div>

        <div className="glass-card p-5 border border-white/80">
          <div className="flex items-center gap-2 text-neutral-600 text-xs font-bold uppercase">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span>{t.rainLabel}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-2">
            {summary?.annual_rainfall_mm ?? 1850} <span className="text-sm font-semibold text-neutral-500">mm</span>
          </div>
          <div className="text-xs font-medium text-blue-700 mt-1">
            NASA GPM Calibrated
          </div>
        </div>

        <div className="glass-card p-5 border border-white/80">
          <div className="flex items-center gap-2 text-neutral-600 text-xs font-bold uppercase">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Solar Energy</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2">
            {summary?.solar_radiation_mj ?? 19.4} <span className="text-xs font-medium text-neutral-500">MJ/m²</span>
          </div>
          <div className="text-xs font-medium text-emerald-700 mt-1">
            Sunlight: Plentiful
          </div>
        </div>

        <div className="glass-card p-5 border border-white/80">
          <div className="flex items-center gap-2 text-neutral-600 text-xs font-bold uppercase">
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>Wind Speed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2">
            {summary?.wind_speed_ms ?? 2.3} <span className="text-xs font-medium text-neutral-500">m/s</span>
          </div>
          <div className="text-xs font-medium text-neutral-500 mt-1">
            Gentle breeze
          </div>
        </div>
      </div>

      {/* Chart: Daily Temperature & Precipitation (Latest 30 Days) */}
      <div className="glass-card p-6 border border-white/80 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-neutral-900">
              {lang === 'ml' ? 'കഴിഞ്ഞ 30 ദിവസത്തെ മഴയും താപനിലയും' : 'Recent 30-Day Daily Rainfall & Temperature'}
            </h3>
            <p className="text-xs text-neutral-500">NASA POWER Daily Point Agrometeorology</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-blue-700">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> Rain (mm)
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Temp (°C)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recent} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(d) => d.slice(5)} />
              <YAxis yAxisId="rain" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis yAxisId="temp" orientation="right" domain={[18, 38]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar yAxisId="rain" dataKey="precipitation_mm" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Precipitation (mm)" />
              <Line yAxisId="temp" type="monotone" dataKey="temperature_c" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} name="Temperature (°C)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expandable Scientific Details */}
      <div className="glass-card p-5 border border-white/80">
        <button
          onClick={() => setShowScientific(!showScientific)}
          className="w-full flex items-center justify-between text-xs font-bold text-neutral-800 hover:text-emerald-900 transition"
        >
          <span>{showScientific ? t.closeDetails : t.scientificDetails}</span>
          {showScientific ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showScientific && (
          <div className="mt-4 pt-4 border-t border-neutral-200 text-xs text-neutral-700 space-y-2 animate-in fade-in">
            <p><strong>NASA POWER API:</strong> Latitude {farm.latitude.toFixed(4)}, Longitude {farm.longitude.toFixed(4)}. Daily solar, temperature, wind, and precipitation models derived from GEOS-5 FP-IT assimilated meteorological fields.</p>
            <p><strong>Observation Grid:</strong> 0.5° × 0.5° spatial resolution with 48-hour local SQLite caching.</p>
          </div>
        )}
      </div>
    </div>
  );
};
