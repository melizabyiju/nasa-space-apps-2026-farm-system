import { Farm, NASAClimateData, Crop, CropSuitability, RotationStrategy, ScenarioSimulationResult } from './types';
import { DEFAULT_FARMS, FALLBACK_CLIMATE, DEFAULT_CROPS, DEFAULT_SUITABILITY, DEFAULT_ROTATION_STRATEGIES } from './fallbackData';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

export const api = {
  // Farms
  async getFarms(): Promise<Farm[]> {
    try {
      const res = await fetch(`${API_BASE}/farms`, { signal: AbortSignal.timeout(1200) });
      if (!res.ok) throw new Error('Backend responded with error');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      return DEFAULT_FARMS;
    } catch (e) {
      console.warn('Backend loading fallback to initial farms:', e);
      return DEFAULT_FARMS;
    }
  },

  async createFarm(farm: Omit<Farm, 'id'>): Promise<Farm> {
    try {
      const res = await fetch(`${API_BASE}/farms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farm),
      });
      if (!res.ok) throw new Error('Failed to create farm');
      return res.json();
    } catch (e) {
      const newFarm: Farm = {
        ...farm,
        id: `farm-${Date.now()}`,
        organic_matter: farm.organic_matter ?? 1.8,
        soil_ph: farm.soil_ph ?? 6.2,
      };
      return newFarm;
    }
  },

  async deleteFarm(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/farms/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete error:', e);
    }
  },

  // NASA Earth Data
  async getNASAClimate(lat: number, lon: number): Promise<NASAClimateData> {
    try {
      const res = await fetch(`${API_BASE}/nasa/climate?lat=${lat}&lon=${lon}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error('NASA API endpoint unavailable');
      return res.json();
    } catch (e) {
      console.warn('Using NASA Earth observations fallback baseline:', e);
      return {
        ...FALLBACK_CLIMATE,
        source_provenance: {
          ...FALLBACK_CLIMATE.source_provenance,
          spatial_coverage: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
        }
      };
    }
  },

  // Crops
  async getCrops(): Promise<Crop[]> {
    try {
      const res = await fetch(`${API_BASE}/crops`, { signal: AbortSignal.timeout(1200) });
      if (!res.ok) throw new Error('Failed to fetch crops');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      return DEFAULT_CROPS;
    } catch (e) {
      return DEFAULT_CROPS;
    }
  },

  // Suitability
  async getCropSuitability(farmId: string): Promise<{ farm_id: string; farm_name: string; suitability_ranking: CropSuitability[] }> {
    try {
      const res = await fetch(`${API_BASE}/crops/suitability/${farmId}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error('Suitability engine error');
      return res.json();
    } catch (e) {
      return {
        farm_id: farmId,
        farm_name: "Farm Profile",
        suitability_ranking: DEFAULT_SUITABILITY
      };
    }
  },

  // Rotation Planner
  async getRotationStrategies(farmId: string): Promise<{ farm_id: string; farm_name: string; strategies: RotationStrategy[] }> {
    try {
      const res = await fetch(`${API_BASE}/rotation/generate/${farmId}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error('Rotation engine error');
      return res.json();
    } catch (e) {
      return {
        farm_id: farmId,
        farm_name: "Farm Profile",
        strategies: DEFAULT_ROTATION_STRATEGIES
      };
    }
  },

  // Scenario Simulator
  async simulateScenario(params: {
    farm_id: string;
    rainfall_delta_pct: number;
    temp_delta_c: number;
    soil_moisture_delta_pct?: number;
  }): Promise<ScenarioSimulationResult> {
    try {
      const res = await fetch(`${API_BASE}/scenarios/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(1500)
      });
      if (!res.ok) throw new Error('Simulation failed');
      return res.json();
    } catch (e) {
      const isDrought = params.rainfall_delta_pct < 0;
      return {
        scenario_parameters: {
          rainfall_delta_pct: params.rainfall_delta_pct,
          temp_delta_c: params.temp_delta_c,
          simulated_annual_rainfall_mm: Math.round(1980 * (1 + params.rainfall_delta_pct / 100)),
          simulated_mean_temp_c: Math.round((26.9 + params.temp_delta_c) * 10) / 10,
          simulated_relative_humidity_pct: 70
        },
        risk_assessment: {
          overall_water_stress: isDrought ? "High Risk" : "Low Risk",
          heat_stress_level: params.temp_delta_c >= 2.0 ? "Moderate to Severe" : "Normal",
          recommended_adaptation: isDrought
            ? "Shift away from water-intensive wetland paddy to drought-tolerant pulses (Cowpea, Green Gram) and maize; use drip irrigation."
            : "Sufficient rainfall expected. Ensure field drainage channels are clear to prevent waterlogging."
        },
        crop_impacts: [
          {
            crop_id: "cowpea",
            name: "Cowpea",
            category: "Legume / Pulse",
            baseline_score: 94,
            simulated_score: isDrought ? 90 : 92,
            score_change: isDrought ? -4 : -2,
            baseline_category: "Highly Suitable",
            simulated_category: "Highly Suitable",
            vulnerability_comment: "Very resilient to moisture deficits."
          },
          {
            crop_id: "green_gram",
            name: "Green Gram",
            category: "Legume / Pulse",
            baseline_score: 91,
            simulated_score: isDrought ? 86 : 89,
            score_change: isDrought ? -5 : -2,
            baseline_category: "Highly Suitable",
            simulated_category: "Highly Suitable",
            vulnerability_comment: "Fast catch crop; withstands heat anomalies."
          },
          {
            crop_id: "rice",
            name: "Rice (Paddy)",
            category: "Cereal",
            baseline_score: 86,
            simulated_score: isDrought ? 65 : 88,
            score_change: isDrought ? -21 : 2,
            baseline_category: "Highly Suitable",
            simulated_category: isDrought ? "Moderately Suitable" : "Highly Suitable",
            vulnerability_comment: isDrought ? "High vulnerability without flood irrigation." : "Monsoon supported."
          },
          {
            crop_id: "maize",
            name: "Maize (Corn)",
            category: "Cereal",
            baseline_score: 84,
            simulated_score: isDrought ? 80 : 85,
            score_change: isDrought ? -4 : 1,
            baseline_category: "Highly Suitable",
            simulated_category: "Highly Suitable",
            vulnerability_comment: "Performs better than paddy under dry spells."
          }
        ]
      };
    }
  },

  // AI Assistant
  async askAssistant(query: string, farmId?: string, lang: string = 'en'): Promise<{
    query: string;
    response: string;
    citations: string[];
    data_sources_referenced?: string[];
  }> {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, farm_id: farmId, lang }),
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error('Assistant query failed');
    return res.json();
  },

  // CSV Report URL
  getReportCSVUrl(farmId: string): string {
    return `${API_BASE}/reports/csv/${farmId}`;
  }
};
