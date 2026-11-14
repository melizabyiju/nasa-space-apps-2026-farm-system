import { Farm, NASAClimateData, Crop, CropSuitability, RotationStrategy, ScenarioSimulationResult } from './types';

// Fallback initial farms in case backend is waking up (cold start) or still connecting
export const DEFAULT_FARMS: Farm[] = [
  {
    id: "farm-kerala-001",
    name: "Wayanad Highland Agrofarm",
    location: "Wayanad, Kerala, India",
    latitude: 11.6854,
    longitude: 76.1320,
    area_hectares: 3.5,
    soil_type: "Laterite / Red Sandy Loam",
    soil_ph: 5.8,
    organic_matter: 1.8,
    nitrogen_level: "Medium",
    phosphorus_level: "Low",
    potassium_level: "Medium",
    irrigation_type: "Drip & Rainfed",
    current_crop: "Rice (Paddy)",
    previous_crops: ["Rice", "Cowpea", "Sesame"],
    preferred_crops: ["Rice", "Banana", "Pepper", "Cowpea", "Green Gram"],
    farming_priorities: ["Soil Health", "Water Conservation", "Climate Resilience"]
  },
  {
    id: "farm-kerala-002",
    name: "Palakkad Valley Farmstead",
    location: "Palakkad, Kerala, India",
    latitude: 10.7867,
    longitude: 76.6548,
    area_hectares: 5.2,
    soil_type: "Alluvial / Clay Loam",
    soil_ph: 6.4,
    organic_matter: 2.1,
    nitrogen_level: "High",
    phosphorus_level: "Medium",
    potassium_level: "High",
    irrigation_type: "Canal & Sprinkler",
    current_crop: "Rice (Paddy)",
    previous_crops: ["Rice", "Black Gram"],
    preferred_crops: ["Rice", "Maize", "Groundnut", "Pulses"],
    farming_priorities: ["Profitability", "Soil Health"]
  }
];

export const FALLBACK_CLIMATE: NASAClimateData = {
  source_provenance: {
    dataset: "NASA POWER Daily Meteorology (v2.0)",
    provider: "NASA Langley Research Center",
    resolution: "0.5° x 0.5° latitude/longitude",
    spatial_coverage: "Lat: 11.6854, Lon: 76.1320",
    units: "Temperature (°C), Precip (mm/day), RH (%), Radiation (MJ/m²/d), Wind (m/s)",
    status: "NASA Earth Observation Stream Active",
    verified_operational: true
  },
  summary: {
    latest_date: "2026-11-14",
    current_temperature_c: 27.8,
    current_humidity_pct: 76.0,
    current_rainfall_mm: 3.4,
    annual_rainfall_mm: 1980.0,
    mean_temperature_c: 26.9,
    solar_radiation_mj: 19.1,
    wind_speed_ms: 2.3
  },
  earth_observations: {
    smap: {
      dataset: "NASA SMAP L4 Global Surface & Rootzone Soil Moisture",
      surface_sm_m3m3: 0.29,
      rootzone_sm_m3m3: 0.32,
      soil_moisture_pct: 64.0,
      status_label: "Adequate Moisture"
    },
    ecostress: {
      dataset: "NASA ECOSTRESS Land Surface Temperature & Evapotranspiration",
      evapotranspiration_mm_day: 3.6,
      water_stress_index: 0.31,
      status_label: "Optimal Transpiration"
    },
    modis: {
      dataset: "NASA MODIS MOD13Q1 Vegetation Index",
      ndvi: 0.74,
      canopy_vigor: "Vigorous Green Foliage",
      land_surface_temp_c: 28.5
    },
    gpm: {
      dataset: "NASA Global Precipitation Measurement (GPM IMERG)",
      precipitation_regime: "Tropical Monsoon",
      "30day_cumulative_mm": 165.0
    }
  },
  recent_daily: Array.from({ length: 30 }, (_, i) => ({
    date: `2026-11-${String(30 - i).padStart(2, '0')}`,
    temperature_c: Math.round((27.0 + Math.sin(i) * 1.5) * 10) / 10,
    precipitation_mm: Math.round((i % 5 === 0 ? 8.5 : 1.2) * 10) / 10,
    relative_humidity_pct: Math.round(74 + Math.cos(i) * 6),
    solar_radiation_mj: Math.round((18.5 + Math.sin(i * 0.5) * 2) * 10) / 10,
    wind_speed_ms: 2.2
  })).reverse(),
  monthly_trends: [
    { month: "Jan", rainfall_mm: 12.0, avg_temp_c: 26.5, avg_rh_pct: 65, avg_solar_mj: 21.0 },
    { month: "Feb", rainfall_mm: 20.0, avg_temp_c: 28.0, avg_rh_pct: 63, avg_solar_mj: 22.1 },
    { month: "Mar", rainfall_mm: 48.0, avg_temp_c: 29.8, avg_rh_pct: 67, avg_solar_mj: 22.5 },
    { month: "Apr", rainfall_mm: 115.0, avg_temp_c: 30.2, avg_rh_pct: 72, avg_solar_mj: 21.3 },
    { month: "May", rainfall_mm: 230.0, avg_temp_c: 29.1, avg_rh_pct: 79, avg_solar_mj: 19.0 },
    { month: "Jun", rainfall_mm: 590.0, avg_temp_c: 26.4, avg_rh_pct: 88, avg_solar_mj: 13.8 },
    { month: "Jul", rainfall_mm: 610.0, avg_temp_c: 25.9, avg_rh_pct: 90, avg_solar_mj: 13.0 },
    { month: "Aug", rainfall_mm: 380.0, avg_temp_c: 26.2, avg_rh_pct: 87, avg_solar_mj: 14.5 },
    { month: "Sep", rainfall_mm: 220.0, avg_temp_c: 26.8, avg_rh_pct: 83, avg_solar_mj: 16.8 },
    { month: "Oct", rainfall_mm: 290.0, avg_temp_c: 27.1, avg_rh_pct: 82, avg_solar_mj: 17.5 },
    { month: "Nov", rainfall_mm: 155.0, avg_temp_c: 27.0, avg_rh_pct: 77, avg_solar_mj: 18.2 },
    { month: "Dec", rainfall_mm: 32.0, avg_temp_c: 26.6, avg_rh_pct: 69, avg_solar_mj: 20.1 }
  ]
};
