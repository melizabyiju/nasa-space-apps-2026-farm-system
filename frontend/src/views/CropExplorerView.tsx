import React, { useState } from 'react';
import { Crop } from '../types';
import { 
  Sprout, 
  Search, 
  Filter, 
  Droplet, 
  Thermometer, 
  Clock, 
  Layers, 
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CropExplorerViewProps {
  crops: Crop[];
}

export const CropExplorerView: React.FC<CropExplorerViewProps> = ({ crops }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(crops[0] || null);

  const categories = ['All', 'Cereal', 'Legume / Pulse', 'Oilseed', 'Fruit / Horticulture', 'Spice / Plantation', 'Vegetables'];

  const filtered = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(search.toLowerCase()) ||
                          crop.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
                          crop.family.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || crop.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title & Search Bar */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Crop Knowledge Explorer</h2>
          <p className="text-neutral-600 text-sm mt-1">
            Curated agronomic database tailored for Kerala & Indian agro-ecological zones (ICAR & KAU references).
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, family, botanical name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/90 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-900 text-white shadow-sm'
                : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-emerald-900 border border-neutral-200/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Crop List (Left) + Detail Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Crop Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filtered.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`glass-card p-4 border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-600/20'
                    : 'border-white/70 hover:border-emerald-300 hover:bg-white/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-900">{crop.name}</h4>
                      {crop.nitrogen_fixation && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                          N-Fixer
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 italic mt-0.5">{crop.scientific_name}</div>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                    {crop.category}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] text-neutral-600 border-t border-neutral-100 pt-2">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Duration:</span>
                    <span className="font-semibold text-neutral-800">{crop.duration_days}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Water Demand:</span>
                    <span className="font-semibold text-neutral-800">{crop.water_demand_level}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Optimal pH:</span>
                    <span className="font-semibold text-neutral-800">{crop.optimal_ph[0]} - {crop.optimal_ph[1]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Crop In-Depth Dossier (7 cols) */}
        {selectedCrop && (
          <div className="lg:col-span-7 glass-card p-6 border border-white/80 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-200/60 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  {selectedCrop.family}
                </span>
                <h3 className="text-2xl font-extrabold text-neutral-900 mt-2">{selectedCrop.name}</h3>
                <p className="text-xs text-neutral-500 italic mt-0.5">Scientific Name: {selectedCrop.scientific_name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-neutral-500 block">Crop Type</span>
                <span className="text-sm font-bold text-neutral-800">{selectedCrop.category}</span>
              </div>
            </div>

            {/* Core Growth Requirements Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" /> Duration
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-1">{selectedCrop.duration_days}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Optimal Temp
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-1">
                  {selectedCrop.optimal_temp_c[0]} - {selectedCrop.optimal_temp_c[1]}°C
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" /> Water Demand
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-1">{selectedCrop.water_demand_level}</div>
                <div className="text-[10px] text-neutral-500">~{selectedCrop.water_requirement_mm} mm</div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/50">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" /> Optimal pH
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-1">
                  {selectedCrop.optimal_ph[0]} - {selectedCrop.optimal_ph[1]}
                </div>
              </div>
            </div>

            {/* Seasons & Soil affinities */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/60 border border-neutral-200/50">
                <span className="font-bold text-neutral-800 block mb-1">Suitable Cropping Seasons:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCrop.seasons.map((s, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/60 border border-neutral-200/50">
                <span className="font-bold text-neutral-800 block mb-1">Soil Texture Affinities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCrop.suitable_soils.map((st, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200/60">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rotation Benefits & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70">
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Rotation Agronomic Benefits</span>
                </div>
                <p className="text-neutral-700 leading-relaxed">{selectedCrop.rotation_benefits}</p>
                {selectedCrop.nitrogen_fixed_kg_ha && (
                  <div className="mt-2 text-emerald-800 font-semibold text-[11px]">
                    🌱 Biological Fixation: {selectedCrop.nitrogen_fixed_kg_ha}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                <div className="flex items-center gap-1.5 text-amber-950 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Agronomic Risks & Vulnerabilities</span>
                </div>
                <p className="text-neutral-700 leading-relaxed">{selectedCrop.rotation_risks}</p>
              </div>
            </div>

            {/* Reference Citation */}
            <div className="pt-3 border-t border-neutral-200/60 flex items-center gap-2 text-[11px] text-neutral-500">
              <BookOpen className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>Reference Source: <strong className="text-neutral-700">{selectedCrop.reference}</strong></span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
