import { Farm, NASAClimateData, Crop, CropSuitability, RotationStrategy, ScenarioSimulationResult } from './types';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  // Farms
  async getFarms(): Promise<Farm[]> {
    const res = await fetch(`${API_BASE}/farms`);
    if (!res.ok) throw new Error('Failed to fetch farms');
    return res.json();
  },

  async createFarm(farm: Omit<Farm, 'id'>): Promise<Farm> {
    const res = await fetch(`${API_BASE}/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farm),
    });
    if (!res.ok) throw new Error('Failed to create farm');
    return res.json();
  },

  async deleteFarm(id: string): Promise<void> {
    await fetch(`${API_BASE}/farms/${id}`, { method: 'DELETE' });
  },

  // NASA Earth Data
  async getNASAClimate(lat: number, lon: number): Promise<NASAClimateData> {
    const res = await fetch(`${API_BASE}/nasa/climate?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Failed to retrieve NASA climate observations');
    return res.json();
  },

  // Crops
  async getCrops(): Promise<Crop[]> {
    const res = await fetch(`${API_BASE}/crops`);
    if (!res.ok) throw new Error('Failed to fetch crop database');
    return res.json();
  },

  // Suitability
  async getCropSuitability(farmId: string): Promise<{ farm_id: string; farm_name: string; suitability_ranking: CropSuitability[] }> {
    const res = await fetch(`${API_BASE}/crops/suitability/${farmId}`);
    if (!res.ok) throw new Error('Failed to calculate crop suitability');
    return res.json();
  },

  // Rotation Planner
  async getRotationStrategies(farmId: string): Promise<{ farm_id: string; farm_name: string; strategies: RotationStrategy[] }> {
    const res = await fetch(`${API_BASE}/rotation/generate/${farmId}`);
    if (!res.ok) throw new Error('Failed to generate rotation strategies');
    return res.json();
  },

  // Scenario Simulator
  async simulateScenario(params: {
    farm_id: string;
    rainfall_delta_pct: number;
    temp_delta_c: number;
    soil_moisture_delta_pct?: number;
  }): Promise<ScenarioSimulationResult> {
    const res = await fetch(`${API_BASE}/scenarios/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to simulate scenario');
    return res.json();
  },

  // AI Assistant
  async askAssistant(query: string, farmId?: string): Promise<{
    query: string;
    response: string;
    citations: string[];
    data_sources_referenced: string[];
  }> {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, farm_id: farmId }),
    });
    if (!res.ok) throw new Error('Assistant query failed');
    return res.json();
  },

  // CSV Report URL
  getReportCSVUrl(farmId: string): string {
    return `${API_BASE}/reports/csv/${farmId}`;
  }
};
