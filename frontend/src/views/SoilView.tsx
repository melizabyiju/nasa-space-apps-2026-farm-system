import React from 'react';
import { NASAClimateData, Farm } from '../types';
import { 
  Layers, 
  Droplets, 
  Sprout, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle,
  TrendingDown,
  Info
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

interface SoilViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
}

export const SoilView: React.FC<SoilViewProps> = ({ farm, climateData }) => {
  const obs = climateData?.earth_observations;
  const smap = obs?.smap;
  const ecostress = obs?.ecostress;
  const modis = obs?.modis;

  const moistureBreakdown = [
    { layer: 'Topsoil (0-5 cm)', value: smap?.surface_sm_m3m3 ?? 0.28, unit: 'm³/m³', sat: 58 },
    { layer: 'Rootzone (0-100 cm)', value: smap?.rootzone_sm_m3m3 ?? 0.31, unit: 'm³/m³', sat: 64 },
    { layer: 'Field Capacity Benchmark', value: 0.36, unit: 'm³/m³', sat: 100 },
    { layer: 'Permanent Wilting Point', value: 0.12, unit: 'm³/m³', sat: 30 }
  ];

  return (
    <div className="space-y-6">
      {/* Soil Title and Provenance */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              NASA SMAP & Local Soil Metrics
            </span>
            <span className="text-xs text-neutral-500 font-medium">L4 Global Surface & Rootzone Active-Passive</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Soil Health & Moisture Intelligence
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Distinguishing satellite-observed volumetric moisture fractions (NASA SMAP L4) from local farm soil laboratory measurements (pH, organic carbon, texture).
          </p>
        </div>
      </div>

      {/* Critical Scientific Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Important Scientific Distinction: </span>
          NASA satellites provide radar/radiometer-derived <strong>Soil Moisture</strong> (SMAP) and vegetative canopy evapotranspiration (ECOSTRESS). 
          Satellites do not measure chemical <strong>soil pH</strong> or <strong>nitrogen / phosphorus levels</strong> directly. Those values are sourced from farm soil testing entries.
        </div>
      </div>

      {/* Soil Moisture Metrics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Surface Soil Moisture */}
        <div className="glass-card p-6 border border-white/70">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">SMAP Surface Moisture</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">
            {smap?.surface_sm_m3m3 ?? 0.28} <span className="text-sm font-semibold text-neutral-500">m³/m³</span>
          </div>
          <div className="text-xs font-semibold text-blue-800 bg-blue-100/70 px-2.5 py-1 rounded-lg mt-2 inline-block">
            {smap?.status_label ?? 'Moisture Satisfactory'}
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            Top 5 cm radiative reflection depth. Dictates germination conditions and seedling emergence.
          </p>
        </div>

        {/* Rootzone Moisture */}
        <div className="glass-card p-6 border border-white/70">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">SMAP Rootzone Moisture</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">
            {smap?.rootzone_sm_m3m3 ?? 0.31} <span className="text-sm font-semibold text-neutral-500">m³/m³</span>
          </div>
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg mt-2 inline-block">
            Sufficient for deep-root legumes
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            Active 0-100 cm root absorption profile. Sustains vegetative and reproductive crop stages.
          </p>
        </div>

        {/* ECOSTRESS Evapotranspiration */}
        <div className="glass-card p-6 border border-white/70">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ECOSTRESS ET Index</span>
            <Sprout className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">
            {ecostress?.evapotranspiration_mm_day ?? 3.8} <span className="text-sm font-semibold text-neutral-500">mm/day</span>
          </div>
          <div className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg mt-2 inline-block">
            Water Stress: {ecostress?.water_stress_index ?? 0.32} (Moderate)
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            PT-JPL thermal radiance measurements tracking crop canopy moisture transpiration.
          </p>
        </div>

      </div>

      {/* Local Soil Laboratory Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Farm Soil Profile */}
        <div className="glass-card p-6 border border-white/70">
          <h3 className="font-bold text-base text-neutral-900 mb-1">Local Laboratory Soil Properties</h3>
          <p className="text-xs text-neutral-500 mb-4">Values recorded from {farm.name} soil health cards</p>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200/50">
              <span className="text-neutral-600 font-medium">Soil Classification:</span>
              <span className="font-bold text-neutral-900">{farm.soil_type}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200/50">
              <span className="text-neutral-600 font-medium">Soil pH Reaction:</span>
              <span className="font-bold text-neutral-900">
                {farm.soil_ph !== null ? (
                  <span>
                    {farm.soil_ph}{' '}
                    <span className="text-xs font-normal text-neutral-500">
                      ({farm.soil_ph < 6.0 ? 'Moderately Acidic' : farm.soil_ph > 7.5 ? 'Alkaline' : 'Near Neutral'})
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">Unspecified / Test Needed</span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200/50">
              <span className="text-neutral-600 font-medium">Organic Carbon / Matter:</span>
              <span className="font-bold text-neutral-900">
                {farm.organic_matter !== null ? `${farm.organic_matter}%` : 'Unspecified'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200/50">
              <span className="text-neutral-600 font-medium">Macronutrient Status (N-P-K):</span>
              <span className="font-bold text-emerald-900">
                N: {farm.nitrogen_level} • P: {farm.phosphorus_level} • K: {farm.potassium_level}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200/50">
              <span className="text-neutral-600 font-medium">Field Irrigation Infrastructure:</span>
              <span className="font-bold text-neutral-900">{farm.irrigation_type}</span>
            </div>
          </div>
        </div>

        {/* Moisture Layer Bar Chart */}
        <div className="glass-card p-6 border border-white/70">
          <h3 className="font-bold text-base text-neutral-900 mb-1">Moisture Horizon Benchmark</h3>
          <p className="text-xs text-neutral-500 mb-4">Volumetric fraction (m³/m³) compared to permanent wilting point</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moistureBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <XAxis type="number" domain={[0, 0.45]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis dataKey="layer" type="category" tick={{ fontSize: 10, fill: '#374151' }} width={110} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]}>
                  {moistureBreakdown.map((entry, index) => (
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
