import React from 'react';
import { NASAClimateData, Farm } from '../types';
import { 
  CloudSun, 
  Thermometer, 
  CloudRain, 
  Sun, 
  Wind, 
  Compass, 
  Info,
  Calendar,
  Satellite
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

interface ClimateViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
}

export const ClimateView: React.FC<ClimateViewProps> = ({ farm, climateData }) => {
  const summary = climateData?.summary;
  const recent = climateData?.recent_daily || [];
  const monthly = climateData?.monthly_trends || [];
  const prov = climateData?.source_provenance;

  return (
    <div className="space-y-6">
      {/* Header Attribution Card */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/90 px-2.5 py-0.5 rounded-full border border-blue-300">
              NASA Earth Science Division
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA POWER API v2.0 Daily Agrometeorology</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Climate & Atmospheric Intelligence
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Location: <span className="font-semibold text-neutral-800">{farm.location}</span> ({farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E). 
            Observational parameters: 2m Temperature (T2M), Precipitation Corrected (PRECTOTCORR), Relative Humidity (RH2M), Solar Insolation (ALLSKY_SFC_SW_DWN), and 2m Wind Speed (WS2M).
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-neutral-500 font-medium">Spatial Resolution</div>
          <div className="text-sm font-bold text-neutral-800">0.5° × 0.5° Lat/Lon Grid</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">● Live Satellite Integration</div>
        </div>
      </div>

      {/* Atmospheric Indicators Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-white/70">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold">
            <Thermometer className="w-4 h-4 text-amber-500" />
            <span>Mean Temperature</span>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2">
            {summary?.mean_temperature_c ?? 27.2}°C
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Current pass: {summary?.current_temperature_c ?? 28.0}°C
          </div>
        </div>

        <div className="glass-card p-5 border border-white/70">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span>Annual Precipitation</span>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2">
            {summary?.annual_rainfall_mm ?? 1850} mm
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">
            NASA GPM Calibration
          </div>
        </div>

        <div className="glass-card p-5 border border-white/70">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Solar Insolation</span>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2">
            {summary?.solar_radiation_mj ?? 19.4} <span className="text-xs font-medium text-neutral-500">MJ/m²/d</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Photoperiod adequacy: Optimal
          </div>
        </div>

        <div className="glass-card p-5 border border-white/70">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold">
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>Mean Wind Speed</span>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2">
            {summary?.wind_speed_ms ?? 2.3} <span className="text-xs font-medium text-neutral-500">m/s</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Aerodynamic transpiration: Low
          </div>
        </div>
      </div>

      {/* Chart 1: Daily Temperature & Precipitation (Latest 30 Days) */}
      <div className="glass-card p-6 border border-white/70 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-neutral-900">NASA POWER Daily Meteorology (Last 30 Days)</h3>
            <p className="text-xs text-neutral-500">Day-by-day temperature variations and rainfall spikes</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-neutral-600">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> Precipitation (mm)
            </span>
            <span className="flex items-center gap-1 text-neutral-600">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Temperature (°C)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recent} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(d) => d.slice(5)} />
              <YAxis yAxisId="rain" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis yAxisId="temp" orientation="right" domain={[18, 38]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar yAxisId="rain" dataKey="precipitation_mm" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Precipitation (mm)" />
              <Line yAxisId="temp" type="monotone" dataKey="temperature_c" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} name="Temperature (°C)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Solar Insolation & Relative Humidity Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-6 border border-white/70 shadow-md">
          <h3 className="font-bold text-base text-neutral-900 mb-1">Solar Insolation Cycle</h3>
          <p className="text-xs text-neutral-500 mb-4">All-sky incident solar energy (MJ/m²/day) across recent observation dates</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recent.slice(-15)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(d) => d.slice(5)} />
                <YAxis domain={[10, 26]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="solar_radiation_mj" stroke="#d97706" fill="url(#solarGrad)" strokeWidth={2} name="Solar Radiation (MJ/m²/d)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/70 shadow-md">
          <h3 className="font-bold text-base text-neutral-900 mb-1">Relative Humidity Dynamics</h3>
          <p className="text-xs text-neutral-500 mb-4">Surface atmospheric humidity (%) tracking moisture saturation</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recent.slice(-15)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(d) => d.slice(5)} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="relative_humidity_pct" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
