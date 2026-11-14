import React, { useState } from 'react';
import { Crop } from '../types';
import { 
  Sprout, 
  Search, 
  Clock, 
  Droplet, 
  Thermometer, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getCropImage } from '../cropImages';
import { translations, Language } from '../translations';
import { speakText, stopSpeech } from '../voiceUtils';

interface CropExplorerViewProps {
  crops: Crop[];
  lang: Language;
}

export const CropExplorerView: React.FC<CropExplorerViewProps> = ({ crops, lang }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(crops[0] || null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScientific, setShowScientific] = useState(false);

  const categories = ['All', 'Cereal', 'Legume / Pulse', 'Oilseed', 'Fruit / Horticulture', 'Spice / Plantation', 'Vegetables'];

  const filtered = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(search.toLowerCase()) ||
                          crop.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
                          crop.family.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || crop.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleVoiceRead = (crop: Crop) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = lang === 'ml'
      ? `${crop.name}. ഇത് വളരാൻ ${crop.duration_days} ദിവസം വേണം. ${crop.rotation_benefits}`
      : `${crop.name}. Growing period is ${crop.duration_days}. Benefits: ${crop.rotation_benefits}`;

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
              {lang === 'ml' ? 'വിള വിജ്ഞാന സഹായി' : 'Visual Crop Handbook'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">ICAR & Kerala Agri University (KAU)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {lang === 'ml' ? 'കേരളത്തിന് അനുയോജ്യമായ വിളകൾ' : 'Crop Explorer & Reference Guide'}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 max-w-2xl font-medium">
            {lang === 'ml' 
              ? 'വിളകളുടെ ചിത്രങ്ങളും വളർച്ചാ കാലയളവും വെള്ളത്തിന്റെ ആവശ്യകതയും എളുപ്പത്തിൽ മനസിലാക്കാം.'
              : 'Visual guides with authentic photographs, growth durations, water requirements, and rotational benefits.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'ml' ? 'വിളയുടെ പേര് തിരയുക...' : 'Search crop name, pulse, cereal...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/95 border border-neutral-300 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              selectedCategory === cat
                ? 'bg-emerald-900 text-white'
                : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-emerald-900 border border-neutral-300/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Crop List (Left) + Detail Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Crop Cards */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[720px] overflow-y-auto pr-1">
          {filtered.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
            const imgSrc = getCropImage(crop.id);

            return (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`glass-card p-3.5 border cursor-pointer transition-all duration-200 flex gap-3.5 items-center ${
                  isSelected
                    ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-600/30'
                    : 'border-white/80 hover:border-emerald-300 hover:bg-white/95'
                }`}
              >
                {/* Crop Photo Thumbnail */}
                <img
                  src={imgSrc}
                  alt={crop.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/crops/rice.jpg';
                  }}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-xs border border-neutral-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 truncate">{crop.name}</h4>
                    <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md shrink-0">
                      {crop.category}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 italic truncate mt-0.5">{crop.scientific_name}</p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-700 font-semibold">
                    <span>⏳ {crop.duration_days}</span>
                    <span>💧 {crop.water_demand_level}</span>
                    {crop.nitrogen_fixation && (
                      <span className="text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">N-Fixer</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Crop Deep Dossier */}
        {selectedCrop && (
          <div className="lg:col-span-7 glass-card p-6 border border-white/80 shadow-lg space-y-5">
            {/* Header with Photo Banner */}
            <div className="relative rounded-2xl overflow-hidden h-48 border border-neutral-200/80 shadow-xs">
              <img
                src={getCropImage(selectedCrop.id)}
                alt={selectedCrop.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/crops/rice.jpg';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-emerald-700/90 text-emerald-100 px-2.5 py-0.5 rounded-full">
                      {selectedCrop.family}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 drop-shadow-sm">
                      {selectedCrop.name}
                    </h3>
                    <p className="text-xs text-neutral-200 italic">{selectedCrop.scientific_name}</p>
                  </div>

                  <button
                    onClick={() => handleVoiceRead(selectedCrop)}
                    className="p-3 rounded-2xl bg-white/90 hover:bg-white text-emerald-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    title={t.readAloud}
                  >
                    <Volume2 className="w-4 h-4 text-emerald-800" />
                    <span className="hidden sm:inline">{t.readAloud}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Practical Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/90 border border-neutral-200 text-center">
                <div className="text-[10px] font-bold text-neutral-500 uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-600" /> Duration
                </div>
                <div className="text-sm font-extrabold text-neutral-900 mt-1">{selectedCrop.duration_days}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/90 border border-neutral-200 text-center">
                <div className="text-[10px] font-bold text-neutral-500 uppercase flex items-center justify-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Optimal Temp
                </div>
                <div className="text-sm font-extrabold text-neutral-900 mt-1">
                  {selectedCrop.optimal_temp_c[0]} - {selectedCrop.optimal_temp_c[1]}°C
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/90 border border-neutral-200 text-center">
                <div className="text-[10px] font-bold text-neutral-500 uppercase flex items-center justify-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" /> Water Demand
                </div>
                <div className="text-sm font-extrabold text-neutral-900 mt-1">{selectedCrop.water_demand_level}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/90 border border-neutral-200 text-center">
                <div className="text-[10px] font-bold text-neutral-500 uppercase flex items-center justify-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" /> Soil pH Range
                </div>
                <div className="text-sm font-extrabold text-neutral-900 mt-1">
                  {selectedCrop.optimal_ph[0]} - {selectedCrop.optimal_ph[1]}
                </div>
              </div>
            </div>

            {/* Rotation Benefits for Farmers */}
            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300">
              <div className="flex items-center gap-1.5 text-emerald-950 font-extrabold text-sm mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ml' ? 'ഈ വിള കൃഷി ചെയ്താലുള്ള നേട്ടങ്ങൾ' : 'Farmer Benefits & Soil Value'}</span>
              </div>
              <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                {selectedCrop.rotation_benefits}
              </p>
              {selectedCrop.nitrogen_fixed_kg_ha && (
                <div className="mt-2 text-xs font-bold text-emerald-900 bg-white/80 p-2 rounded-lg border border-emerald-200 inline-block">
                  🌱 {selectedCrop.nitrogen_fixed_kg_ha}
                </div>
              )}
            </div>

            {/* Precautions & Risks */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300">
              <div className="flex items-center gap-1.5 text-amber-950 font-extrabold text-sm mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>{lang === 'ml' ? 'ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ' : 'Precautions & Water Warnings'}</span>
              </div>
              <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                {selectedCrop.rotation_risks}
              </p>
            </div>

            {/* Scientific details expander */}
            <div>
              <button
                onClick={() => setShowScientific(!showScientific)}
                className="text-xs font-bold text-neutral-600 hover:text-emerald-900 flex items-center gap-1 transition"
              >
                <span>{showScientific ? t.closeDetails : t.scientificDetails}</span>
                {showScientific ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showScientific && (
                <div className="mt-3 p-3.5 rounded-xl bg-white/90 border border-neutral-200 text-xs text-neutral-600 space-y-1.5 animate-in fade-in">
                  <div><strong>Suitable Soils:</strong> {selectedCrop.suitable_soils.join(', ')}</div>
                  <div><strong>Seasons:</strong> {selectedCrop.seasons.join(', ')}</div>
                  <div><strong>Total Crop Water Requirement:</strong> ~{selectedCrop.water_requirement_mm} mm</div>
                  <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                    Source: {selectedCrop.reference}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
