import React from 'react';
import { Farm, NASAClimateData } from '../types';
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Sun, 
  Wind, 
  TrendingUp, 
  Compass, 
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sprout
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line 
} from 'recharts';

interface OverviewViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ farm, climateData, onNavigate }) => {
  const summary = climateData?.summary;
  const obs = climateData?.earth_observations;

  const dailyData = climateData?.recent_daily || [];
  const monthlyData = climateData?.monthly_trends || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner matching Farmflow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card border border-white/70 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Field Shift Intelligence
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA Space Apps Challenge 2026</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Welcome to {farm.name}
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-2xl font-medium">
            Active monitoring at <span className="font-semibold text-emerald-900">{farm.location}</span> ({farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E). 
            Synthesizing satellite observations from NASA POWER, SMAP, ECOSTRESS, and MODIS.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('rotation')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4 text-emerald-300" />
            <span>Plan Rotation Strategies</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FARMFLOW-Style Asymmetrical Metric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* Card 1: Ambient Weather & Temperature (4 cols) */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between border border-white/70 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-sm">NASA Atmospheric State</span>
            </div>
            <button 
              onClick={() => onNavigate('climate')}
              className="p-1 rounded-full hover:bg-white/60 text-neutral-400 hover:text-neutral-700 transition"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="my-6 flex items-baseline justify-between">
            <div>
              <div className="text-5xl font-extrabold text-neutral-900 tracking-tight">
                {summary?.current_temperature_c ?? 27.5}°C
              </div>
              <div className="text-xs font-semibold text-neutral-500 mt-1 flex items-center gap-1.5">
                <span>Annual Mean: {summary?.mean_temperature_c ?? 26.8}°C</span>
                <span className="w-1 h-1 rounded-full bg-neutral-400" />
                <span className="text-emerald-700">NASA POWER LARC</span>
              </div>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 rounded-xl bg-amber-100/90 text-amber-900 font-bold text-xs border border-amber-300/80">
                {summary?.current_temperature_c && summary.current_temperature_c > 30 ? 'Elevated Heat' : 'Temperate Band'}
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-white/70 border border-neutral-200/50 text-center">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase">Humidity</div>
              <div className="text-sm font-bold text-neutral-800">{summary?.current_humidity_pct ?? 78}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-neutral-200/50 text-center">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase">Precip</div>
              <div className="text-sm font-bold text-blue-700">{summary?.current_rainfall_mm ?? 3.2} mm</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-neutral-200/50 text-center">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase">Wind</div>
              <div className="text-sm font-bold text-neutral-800">{summary?.wind_speed_ms ?? 2.4} m/s</div>
            </div>
          </div>
        </div>

        {/* Card 2: Soil Moisture & Rootzone Status (4 cols) */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between border border-white/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-sm">NASA SMAP Soil Moisture</span>
            </div>
            <button 
              onClick={() => onNavigate('soil')}
              className="p-1 rounded-full hover:bg-white/60 text-neutral-400 hover:text-neutral-700 transition"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold text-neutral-900">
                {obs?.smap.soil_moisture_pct ?? 62}%
              </span>
              <span className="text-xs font-semibold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200">
                {obs?.smap.status_label ?? 'Adequate Soil Moisture'}
              </span>
            </div>

            {/* Progress Bar styled like Farmflow */}
            <div className="w-full bg-neutral-200/70 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-blue-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(15, obs?.smap.soil_moisture_pct ?? 62))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500 font-medium mt-1.5">
              <span>Surface SM: {obs?.smap.surface_sm_m3m3 ?? 0.28} m³/m³</span>
              <span>Rootzone: {obs?.smap.rootzone_sm_m3m3 ?? 0.31} m³/m³</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-950">Soil Type: {farm.soil_type}</div>
              <div className="text-[11px] text-emerald-800">pH {farm.soil_ph ?? 'Unspecified'} • {farm.irrigation_type}</div>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          </div>
        </div>

        {/* Card 3: Evapotranspiration & Vegetation Health (4 cols) */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between border border-white/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-sm">NASA ECOSTRESS & MODIS</span>
            </div>
            <button 
              onClick={() => onNavigate('soil')}
              className="p-1 rounded-full hover:bg-white/60 text-neutral-400 hover:text-neutral-700 transition"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="p-3 rounded-2xl bg-white/70 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500">ECOSTRESS ET</div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-1">
                {obs?.ecostress.evapotranspiration_mm_day ?? 3.8}
                <span className="text-xs font-medium text-neutral-500 ml-1">mm/d</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                Stress: {obs?.ecostress.water_stress_index ?? 0.35} (Low)
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500">MODIS NDVI</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                {obs?.modis.ndvi ?? 0.72}
              </div>
              <div className="text-[10px] text-neutral-600 font-medium mt-0.5 truncate">
                {obs?.modis.canopy_vigor ?? 'Vigorous Greenery'}
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-600 bg-white/60 p-2.5 rounded-xl border border-neutral-200/50">
            <span className="font-bold text-neutral-900">Current Field Status: </span>
            Growing <span className="font-bold text-emerald-900">{farm.current_crop}</span>. Prioritized for climate-informed rotation.
          </div>
        </div>

      </div>

      {/* Second Row: Historical Trends Chart & Rotation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Monthly Rainfall & Temperature Trend (8 cols) */}
        <div className="lg:col-span-8 glass-card p-6 border border-white/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-neutral-900">NASA POWER Historical Monthly Climate Trends</h3>
              <p className="text-xs text-neutral-500">Precipitation volume (mm) and average temperature (°C) cycle</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-neutral-600">Rainfall (mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-neutral-600">Avg Temp (°C)</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis yAxisId="right" orientation="right" domain={[15, 38]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="rainfall_mm" stroke="#2563eb" fillOpacity={1} fill="url(#rainfallGradient)" name="Rainfall (mm)" />
                <Line yAxisId="right" type="monotone" dataKey="avg_temp_c" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} name="Temp (°C)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Next Steps & Climate Risk (4 cols) */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between border border-white/70">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-neutral-900">Recommended Farm Actions</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/75 border border-neutral-200/60 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                  <span>Introduce Post-Rice Legumes</span>
                  <span className="text-emerald-700 font-bold">+45 kg N</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Plant Cowpea or Green Gram to fix atmospheric nitrogen and loosen puddled hardpan.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/75 border border-neutral-200/60 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                  <span>Soil Moisture Preparedness</span>
                  <span className="text-amber-700 font-bold">NASA SMAP</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Rootzone moisture is sufficient today ({obs?.smap.rootzone_sm_m3m3 ?? 0.31} m³/m³). Schedule drip for dry summer spells.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/75 border border-neutral-200/60 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                  <span>Run Scenario Simulator</span>
                  <span className="text-blue-700 font-bold">Hypothetical</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Test farm resilience against a 20% rainfall deficit or 2°C temperature spike.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('simulator')}
            className="w-full mt-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-semibold text-xs transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>Launch Climate Simulator</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
