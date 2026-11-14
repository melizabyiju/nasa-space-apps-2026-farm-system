import React, { useState } from 'react';
import { Farm, ScenarioSimulationResult } from '../types';
import { api } from '../api';
import { 
  SlidersHorizontal, 
  Play, 
  AlertTriangle, 
  RotateCcw, 
  Thermometer, 
  CloudRain, 
  Droplet, 
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

interface SimulatorViewProps {
  farm: Farm;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ farm }) => {
  const [rainDelta, setRainDelta] = useState<number>(-20); // -20% rainfall
  const [tempDelta, setTempDelta] = useState<number>(1.5); // +1.5°C
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const data = await api.simulateScenario({
        farm_id: farm.id,
        rainfall_delta_pct: rainDelta,
        temp_delta_c: tempDelta,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('Simulation error: ' + e);
    } finally {
      setLoading(false);
    }
  };

  // Run on first load if no result
  React.useEffect(() => {
    runSimulation();
  }, [farm.id]);

  // Chart data: compare baseline vs simulated scores
  const chartData = (result?.crop_impacts || []).slice(0, 7).map(c => ({
    name: c.name,
    Baseline: c.baseline_score,
    Simulated: c.simulated_score,
    Change: c.score_change
  }));

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card p-6 border border-white/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-300">
              Diagnostic Sandbox
            </span>
            <span className="text-xs text-neutral-500 font-medium">NASA Climate Perturbation Testing</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Climate Scenario & Stress Simulator
          </h2>
          <p className="text-neutral-600 text-sm mt-1 max-w-3xl">
            Stress-test farm resilience by simulating hypothetical weather deviations (monsoon deficits, heat anomalies, or extreme rainfall) against genuine NASA Earth baselines.
          </p>
        </div>
      </div>

      {/* Simulator Control Dashboard */}
      <div className="glass-card p-6 border border-white/70 shadow-md">
        <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-800" />
          <span>Perturbation Controls & Boundary Conditions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rainfall Slider */}
          <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" /> Rainfall Perturbation
              </span>
              <span className={`text-sm font-extrabold ${rainDelta < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {rainDelta > 0 ? `+${rainDelta}%` : `${rainDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={rainDelta}
              onChange={(e) => setRainDelta(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-medium mt-1">
              <span>-50% (Severe Drought)</span>
              <span>Baseline (0%)</span>
              <span>+50% (Excess Monsoon)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" /> Mean Temperature Delta
              </span>
              <span className="text-sm font-extrabold text-amber-600">
                +{tempDelta}°C
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4.0"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-medium mt-1">
              <span>+0°C (Current)</span>
              <span>+2°C (Moderate Warming)</span>
              <span>+4°C (Severe Anomaly)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={runSimulation}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Simulating Impact...' : 'Recalculate Scenario'}</span>
          </button>
        </div>
      </div>

      {/* Simulation Results Bento */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Risk & Adaptation Assessment Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 border border-white/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Water Stress Index
              </span>
              <div className="text-2xl font-extrabold text-neutral-900">
                {result.risk_assessment.overall_water_stress} Risk
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Simulated rain: {result.scenario_parameters.simulated_annual_rainfall_mm} mm
              </div>
            </div>

            <div className="glass-card p-5 border border-white/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Thermal Stress Rating
              </span>
              <div className="text-2xl font-extrabold text-neutral-900">
                {result.risk_assessment.heat_stress_level} Stress
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Simulated mean temp: {result.scenario_parameters.simulated_mean_temp_c}°C
              </div>
            </div>

            <div className="glass-card p-5 border border-white/70 md:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Agronomic Adaptation Advice
              </span>
              <p className="text-xs text-neutral-700 leading-snug font-medium">
                {result.risk_assessment.recommended_adaptation}
              </p>
            </div>
          </div>

          {/* Comparison Bar Chart: Baseline vs Simulated */}
          <div className="glass-card p-6 border border-white/70 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-neutral-900">Crop Suitability Impact (Baseline vs Scenario)</h3>
                <p className="text-xs text-neutral-500">Shows how suitability scores adjust under the configured conditions</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <span className="w-3 h-3 rounded bg-neutral-400" /> Baseline Score
                </span>
                <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <span className="w-3 h-3 rounded bg-emerald-600" /> Simulated Score
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4b5563' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#4b5563' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="Baseline" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Impact Table */}
          <div className="glass-card p-6 border border-white/70 shadow-md overflow-x-auto">
            <h3 className="font-bold text-base text-neutral-900 mb-3">Crop Shift Ledger</h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Crop Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Baseline</th>
                  <th className="py-2.5 px-3">Simulated</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3">Evaluation Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {result.crop_impacts.map((c) => (
                  <tr key={c.crop_id} className="hover:bg-white/60 transition">
                    <td className="py-2 px-3 font-bold text-neutral-900">{c.name}</td>
                    <td className="py-2 px-3 text-neutral-500">{c.category}</td>
                    <td className="py-2 px-3 text-neutral-700 font-semibold">{c.baseline_score}</td>
                    <td className="py-2 px-3 font-bold text-neutral-900">{c.simulated_score}</td>
                    <td className="py-2 px-3 font-bold">
                      {c.score_change > 0 ? (
                        <span className="text-emerald-700 flex items-center gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" /> +{c.score_change}
                        </span>
                      ) : c.score_change < 0 ? (
                        <span className="text-red-600 flex items-center gap-0.5">
                          <TrendingDown className="w-3.5 h-3.5" /> {c.score_change}
                        </span>
                      ) : (
                        <span className="text-neutral-400">0</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-neutral-600 text-[11px]">{c.vulnerability_comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
