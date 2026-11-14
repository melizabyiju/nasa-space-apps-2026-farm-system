"""
Climate Scenario Simulator Engine
Simulates realistic shifts in NASA-observed agro-climatic conditions:
- Reduced rainfall (-10% to -50%)
- Increased temperature (+1.0°C to +4.0°C)
- Decreased soil moisture
- Extreme rainfall / excess monsoon (+20% to +50%)
Recalculates suitability and rotation resiliency indices.
"""

from typing import Dict, Any, List
from crops_data import CROPS_DATABASE
from rotation_engine import SuitabilityEngine

class ScenarioSimulator:
    @classmethod
    def simulate(
        cls,
        baseline_climate: Dict[str, Any],
        farm: Dict[str, Any],
        rainfall_delta_pct: float = 0.0,
        temp_delta_c: float = 0.0,
        soil_moisture_delta_pct: float = 0.0
    ) -> Dict[str, Any]:
        """
        Applies hypothetical perturbations to baseline NASA Earth observations and
        recomputes crop suitability & water vulnerability metrics.
        """
        base_summary = baseline_climate.get("summary", {})
        base_rain = base_summary.get("annual_rainfall_mm", 1800.0)
        base_temp = base_summary.get("mean_temperature_c", 27.2)
        base_humidity = base_summary.get("current_humidity_pct", 75.0)

        # Perturbed climatic parameters
        sim_rain = max(100.0, round(base_rain * (1.0 + (rainfall_delta_pct / 100.0)), 1))
        sim_temp = round(base_temp + temp_delta_c, 1)
        sim_humidity = max(20.0, min(98.0, round(base_humidity * (1.0 - (temp_delta_c * 0.03)), 1)))

        sim_climate_summary = {
            "annual_rainfall_mm": sim_rain,
            "mean_temperature_c": sim_temp,
            "current_humidity_pct": sim_humidity,
            "is_simulation": True
        }

        soil_info = {
            "soil_ph": farm.get("soil_ph", 6.2),
            "soil_type": farm.get("soil_type", "Laterite Loam"),
            "irrigation_type": farm.get("irrigation_type", "Rainfed"),
            "current_crop": farm.get("current_crop", "Rice")
        }

        # Calculate impact on crops
        crop_comparisons = []
        for crop in CROPS_DATABASE:
            base_eval = SuitabilityEngine.calculate_suitability(crop, base_summary, soil_info)
            sim_eval = SuitabilityEngine.calculate_suitability(crop, sim_climate_summary, soil_info)

            score_diff = sim_eval["score"] - base_eval["score"]
            crop_comparisons.append({
                "crop_id": crop["id"],
                "name": crop["name"],
                "category": crop["category"],
                "baseline_score": base_eval["score"],
                "simulated_score": sim_eval["score"],
                "score_change": score_diff,
                "baseline_category": base_eval["suitability_category"],
                "simulated_category": sim_eval["suitability_category"],
                "vulnerability_comment": (
                    "Highly sensitive to water deficit" if score_diff <= -15 else
                    "Resilient or benefited under this scenario" if score_diff >= 0 else
                    "Mild stress observed"
                )
            })

        # Sort by simulated score descending
        crop_comparisons.sort(key=lambda x: x["simulated_score"], reverse=True)

        # Agro-ecological risk assessment under simulation
        overall_water_stress = "High" if rainfall_delta_pct <= -25 or sim_rain < 900 else ("Moderate" if rainfall_delta_pct < 0 else "Low")
        heat_stress_level = "Severe" if temp_delta_c >= 3.0 or sim_temp > 32.0 else ("Moderate" if temp_delta_c >= 1.5 else "Normal")

        return {
            "scenario_parameters": {
                "rainfall_delta_pct": rainfall_delta_pct,
                "temp_delta_c": temp_delta_c,
                "simulated_annual_rainfall_mm": sim_rain,
                "simulated_mean_temp_c": sim_temp,
                "simulated_relative_humidity_pct": sim_humidity
            },
            "risk_assessment": {
                "overall_water_stress": overall_water_stress,
                "heat_stress_level": heat_stress_level,
                "recommended_adaptation": (
                    "Shift towards drought-hardy legumes (Cowpea, Green Gram) and C4 cereals (Maize/Millets); implement micro-drip irrigation."
                    if rainfall_delta_pct < -15 or temp_delta_c >= 2.0 else
                    "Maintain standard rotation with monitored pest vigilance for elevated rainfall humidity."
                    if rainfall_delta_pct > 15 else
                    "Current baseline crop rotation remains stable under modest variability."
                )
            },
            "crop_impacts": crop_comparisons
        }
