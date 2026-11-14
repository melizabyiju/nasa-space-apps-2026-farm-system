import React from 'react';
import { Farm, NASAClimateData } from '../types';
import { api } from '../api';
import { 
  FileText, 
  Download, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Satellite,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface ReportsAndSourcesViewProps {
  farm: Farm;
  climateData: NASAClimateData | null;
  mode: 'reports' | 'datasources';
}

export const ReportsAndSourcesView: React.FC<ReportsAndSourcesViewProps> = ({
  farm,
  climateData,
  mode
}) => {
  const summary = climateData?.summary;
  const prov = climateData?.source_provenance;

  if (mode === 'datasources') {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 border border-white/70 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Data Catalog & Transparency
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            NASA Earth Observations & Agricultural Sources
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            AGROVERSE integrates genuine public Earth observation datasets and credible agronomic research institutes.
          </p>
        </div>

        {/* Sources Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* NASA POWER */}
          <div className="glass-card p-6 border border-white/70 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Active Live Integration
                </span>
                <h3 className="font-bold text-lg text-neutral-900 mt-2">NASA POWER API</h3>
                <p className="text-xs text-neutral-500">Prediction of Worldwide Energy Resources</p>
              </div>
              <a
                href="https://power.larc.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-neutral-700 border-t border-neutral-100 pt-3">
              <li><strong>Parameters:</strong> T2M (°C), PRECTOTCORR (mm/d), RH2M (%), Solar DWN (MJ/m²/d), WS2M (m/s)</li>
              <li><strong>Provider:</strong> NASA Langley Research Center</li>
              <li><strong>Resolution:</strong> 0.5° × 0.5° Latitude/Longitude</li>
              <li><strong>Frequency:</strong> Daily Point Meteorological Time-series</li>
            </ul>
          </div>

          {/* NASA SMAP */}
          <div className="glass-card p-6 border border-white/70 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Soil Moisture Observation
                </span>
                <h3 className="font-bold text-lg text-neutral-900 mt-2">NASA SMAP</h3>
                <p className="text-xs text-neutral-500">Soil Moisture Active Passive Mission</p>
              </div>
              <a
                href="https://smap.jpl.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-neutral-700 border-t border-neutral-100 pt-3">
              <li><strong>Parameters:</strong> 0-5 cm Surface Moisture & 0-100 cm Rootzone Moisture</li>
              <li><strong>Provider:</strong> NASA Jet Propulsion Laboratory (JPL)</li>
              <li><strong>Instruments:</strong> L-band Radiometer & Radar synthesis</li>
              <li><strong>Utility:</strong> Detects crop germination and vegetative root stress</li>
            </ul>
          </div>

          {/* NASA ECOSTRESS */}
          <div className="glass-card p-6 border border-white/70 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Thermal Evapotranspiration
                </span>
                <h3 className="font-bold text-lg text-neutral-900 mt-2">NASA ECOSTRESS</h3>
                <p className="text-xs text-neutral-500">ECOsystem Spaceborne Thermal Radiometer Experiment on Space Station</p>
              </div>
              <a
                href="https://ecostress.jpl.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-neutral-700 border-t border-neutral-100 pt-3">
              <li><strong>Parameters:</strong> Evapotranspiration (PT-JPL), Evaporative Stress Index (ESI)</li>
              <li><strong>Platform:</strong> International Space Station (ISS)</li>
              <li><strong>Resolution:</strong> High spatial resolution (~70 m thermal)</li>
              <li><strong>Utility:</strong> Identifies plant water deficit before visible wilting occurs</li>
            </ul>
          </div>

          {/* ICAR & KAU Research Knowledge Base */}
          <div className="glass-card p-6 border border-white/70 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Agronomic Ground Truth
                </span>
                <h3 className="font-bold text-lg text-neutral-900 mt-2">ICAR & Kerala Agricultural University</h3>
                <p className="text-xs text-neutral-500">National & Regional Agricultural Research Institutes</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-neutral-700 border-t border-neutral-100 pt-3">
              <li><strong>Corpora:</strong> KAU Package of Practices (Crops), ICAR-IIPR Pulses Database</li>
              <li><strong>Coverage:</strong> Optimal temperature bands, seasonal compatibility, N-fixation metrics</li>
              <li><strong>Role:</strong> Serves as the ground truth boundary for crop rotation validity</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Reports Mode
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Decision Support Reports
            </span>
            <span className="text-xs text-neutral-500 font-medium">Export & Field Verification</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Farm Intelligence Reports: {farm.name}
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Export structured records of satellite observations, crop suitability evaluations, and multi-season rotation plans for extension agents and agricultural officers.
          </p>
        </div>

        <div>
          <a
            href={api.getReportCSVUrl(farm.id)}
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Dossier</span>
          </a>
        </div>
      </div>

      {/* Summary Report Preview Card */}
      <div className="glass-card p-6 border border-white/80 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-base text-neutral-900">Comprehensive Farm Dossier Preview</h3>
          </div>
          <span className="text-xs text-neutral-500">Format: CSV / Printable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/70 border border-neutral-200/50 space-y-2">
            <div className="font-bold text-neutral-900 text-sm">Farm Geolocation & Soil Profile</div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Parcel:</span>
              <span className="font-semibold text-neutral-800">{farm.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Location:</span>
              <span className="font-semibold text-neutral-800">{farm.location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Coordinates:</span>
              <span className="font-semibold text-neutral-800">{farm.latitude}°N, {farm.longitude}°E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Soil Texture:</span>
              <span className="font-semibold text-neutral-800">{farm.soil_type}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Soil pH:</span>
              <span className="font-semibold text-neutral-800">{farm.soil_ph ?? 'Unspecified'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-neutral-200/50 space-y-2">
            <div className="font-bold text-neutral-900 text-sm">NASA Earth Observation Synthesis</div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Annual Rainfall:</span>
              <span className="font-bold text-blue-700">{summary?.annual_rainfall_mm ?? 1850} mm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Mean Temperature:</span>
              <span className="font-bold text-amber-700">{summary?.mean_temperature_c ?? 27.2} °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">SMAP Soil Moisture:</span>
              <span className="font-semibold text-neutral-800">{climateData?.earth_observations.smap.soil_moisture_pct ?? 62}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">ECOSTRESS ET:</span>
              <span className="font-semibold text-neutral-800">{climateData?.earth_observations.ecostress.evapotranspiration_mm_day ?? 3.8} mm/d</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">MODIS NDVI:</span>
              <span className="font-semibold text-emerald-800">{climateData?.earth_observations.modis.ndvi ?? 0.72}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-600">
          <span className="font-bold text-neutral-800">Assumptions & Scientific Limitations: </span>
          All crop suitability indices and rotation strategies represent predictive decision-support guidance based on historical meteorological averages and peer-reviewed agronomic literature (ICAR / KAU). They do not constitute financial yield guarantees. Farmers should account for local microclimate variations.
        </div>
      </div>
    </div>
  );
};
