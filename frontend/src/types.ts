export interface Farm {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  area_hectares: number;
  soil_type: string;
  soil_ph: number | null;
  organic_matter: number | null;
  nitrogen_level: string;
  phosphorus_level: string;
  potassium_level: string;
  irrigation_type: string;
  current_crop: string;
  previous_crops: string[];
  preferred_crops: string[];
  farming_priorities: string[];
  created_at?: string;
}

export interface NASAClimateData {
  source_provenance: {
    dataset: string;
    provider: string;
    resolution: string;
    spatial_coverage: string;
    units: string;
    status: string;
    verified_operational: boolean;
  };
  summary: {
    latest_date: string;
    current_temperature_c: number;
    current_humidity_pct: number;
    current_rainfall_mm: number;
    annual_rainfall_mm: number;
    mean_temperature_c: number;
    solar_radiation_mj: number;
    wind_speed_ms: number;
  };
  earth_observations: {
    smap: {
      dataset: string;
      surface_sm_m3m3: number;
      rootzone_sm_m3m3: number;
      soil_moisture_pct: number;
      status_label: string;
    };
    ecostress: {
      dataset: string;
      evapotranspiration_mm_day: number;
      water_stress_index: number;
      status_label: string;
    };
    modis: {
      dataset: string;
      ndvi: number;
      canopy_vigor: string;
      land_surface_temp_c: number;
    };
    gpm: {
      dataset: string;
      precipitation_regime: string;
      "30day_cumulative_mm": number;
    };
  };
  recent_daily: Array<{
    date: string;
    temperature_c: number;
    precipitation_mm: number;
    relative_humidity_pct: number;
    solar_radiation_mj: number;
    wind_speed_ms: number;
  }>;
  monthly_trends: Array<{
    month: string;
    rainfall_mm: number;
    avg_temp_c: number;
    avg_rh_pct: number;
    avg_solar_mj: number;
  }>;
}

export interface Crop {
  id: string;
  name: string;
  scientific_name: string;
  family: string;
  category: string;
  duration_days: string;
  seasons: string[];
  min_temp_c: number;
  max_temp_c: number;
  optimal_temp_c: [number, number];
  annual_rainfall_mm: [number, number];
  water_requirement_mm: number;
  water_demand_level: string;
  suitable_soils: string[];
  min_ph: number;
  max_ph: number;
  optimal_ph: [number, number];
  nitrogen_fixation: boolean;
  nitrogen_fixed_kg_ha?: string;
  nutrient_demand: Record<string, string>;
  rotation_compatibility: string[];
  rotation_benefits: string;
  rotation_risks: string;
  reference: string;
}

export interface SuitabilityFactor {
  score: number;
  weight: number;
  reason: string;
}

export interface CropSuitability {
  crop_id: string;
  crop_name: string;
  scientific_name: string;
  family: string;
  category_type: string;
  score: number;
  suitability_category: string;
  factors: Record<string, SuitabilityFactor>;
  water_demand: string;
  duration: string;
  benefits: string;
  risks: string;
  nitrogen_fixation: boolean;
  reference: string;
}

export interface RotationStrategy {
  id: string;
  title: string;
  tagline: string;
  primary_focus: string;
  rotation_length: string;
  estimated_n_fixed_kg_ha: string;
  water_footprint: string;
  radar_metrics: {
    soil_health: number;
    water_conservation: number;
    climate_resilience: number;
    economic_profitability: number;
    farmer_preference: number;
  };
  timeline: Array<{
    season: string;
    crop: string;
    family: string;
    duration: string;
    role: string;
    soil_impact: string;
    water_demand: string;
  }>;
  advantages: string[];
  limitations: string[];
  scientific_rationale: string;
}

export interface ScenarioSimulationResult {
  scenario_parameters: {
    rainfall_delta_pct: number;
    temp_delta_c: number;
    simulated_annual_rainfall_mm: number;
    simulated_mean_temp_c: number;
    simulated_relative_humidity_pct: number;
  };
  risk_assessment: {
    overall_water_stress: string;
    heat_stress_level: string;
    recommended_adaptation: string;
  };
  crop_impacts: Array<{
    crop_id: string;
    name: string;
    category: string;
    baseline_score: number;
    simulated_score: number;
    score_change: number;
    baseline_category: string;
    simulated_category: string;
    vulnerability_comment: string;
  }>;
}
