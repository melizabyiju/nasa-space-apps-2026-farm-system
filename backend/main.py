"""
FastAPI Application for AGROVERSE
NASA Space Apps Challenge 2026 - Field Shift: Adapting Farms with NASA Data
"""

import os
import json
import io
import csv
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import init_db, get_connection
from nasa_service import NASAService
from crops_data import CROPS_DATABASE, get_crop_by_id
from rotation_engine import SuitabilityEngine, RotationPlanner
from scenario_simulator import ScenarioSimulator
from assistant_service import AIAssistant

# Initialize Database tables
init_db()

app = FastAPI(
    title="AGROVERSE API",
    description="NASA Space Apps Challenge 2026 - Agricultural Intelligence Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request Models ---
class FarmCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    area_hectares: float
    soil_type: str
    soil_ph: Optional[float] = 6.2
    organic_matter: Optional[float] = None
    nitrogen_level: Optional[str] = "Medium"
    phosphorus_level: Optional[str] = "Medium"
    potassium_level: Optional[str] = "Medium"
    irrigation_type: str = "Rainfed"
    current_crop: Optional[str] = "Rice"
    previous_crops: Optional[List[str]] = []
    preferred_crops: Optional[List[str]] = []
    farming_priorities: Optional[List[str]] = []

class AssistantQuery(BaseModel):
    query: str
    farm_id: Optional[str] = None
    lang: Optional[str] = "en"

class ScenarioRequest(BaseModel):
    farm_id: str
    rainfall_delta_pct: float = 0.0
    temp_delta_c: float = 0.0
    soil_moisture_delta_pct: float = 0.0

# --- Helper Functions ---
def get_farm_or_404(farm_id: str) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farms WHERE id = ?", (farm_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Farm profile not found")
    data = dict(row)
    data["previous_crops"] = json.loads(data["previous_crops"]) if data.get("previous_crops") else []
    data["preferred_crops"] = json.loads(data["preferred_crops"]) if data.get("preferred_crops") else []
    data["farming_priorities"] = json.loads(data["farming_priorities"]) if data.get("farming_priorities") else []
    return data

# --- Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AGROVERSE Backend",
        "nasa_integration": "Operational",
        "timestamp": datetime.utcnow().isoformat()
    }

# 1. Farm Management
@app.get("/api/farms")
def list_farms():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farms ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    farms = []
    for r in rows:
        d = dict(r)
        d["previous_crops"] = json.loads(d["previous_crops"]) if d.get("previous_crops") else []
        d["preferred_crops"] = json.loads(d["preferred_crops"]) if d.get("preferred_crops") else []
        d["farming_priorities"] = json.loads(d["farming_priorities"]) if d.get("farming_priorities") else []
        farms.append(d)
    return farms

@app.get("/api/farms/{farm_id}")
def get_farm(farm_id: str):
    return get_farm_or_404(farm_id)

@app.post("/api/farms")
def create_farm(payload: FarmCreate):
    conn = get_connection()
    cursor = conn.cursor()
    new_id = f"farm-{int(datetime.utcnow().timestamp())}"
    cursor.execute("""
    INSERT INTO farms (
        id, name, location, latitude, longitude, area_hectares,
        soil_type, soil_ph, organic_matter, nitrogen_level, phosphorus_level, potassium_level,
        irrigation_type, current_crop, previous_crops, preferred_crops, farming_priorities, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id,
        payload.name,
        payload.location,
        payload.latitude,
        payload.longitude,
        payload.area_hectares,
        payload.soil_type,
        payload.soil_ph,
        payload.organic_matter,
        payload.nitrogen_level,
        payload.phosphorus_level,
        payload.potassium_level,
        payload.irrigation_type,
        payload.current_crop,
        json.dumps(payload.previous_crops),
        json.dumps(payload.preferred_crops),
        json.dumps(payload.farming_priorities),
        datetime.utcnow().isoformat()
    ))
    conn.commit()
    conn.close()
    return get_farm_or_404(new_id)

@app.delete("/api/farms/{farm_id}")
def delete_farm(farm_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM farms WHERE id = ?", (farm_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "deleted_farm_id": farm_id}

# 2. NASA Climate & Earth Observations
@app.get("/api/nasa/climate")
async def get_nasa_climate(
    lat: float = Query(11.6854, description="Latitude"),
    lon: float = Query(76.1320, description="Longitude")
):
    return await NASAService.fetch_power_climate(lat, lon)

@app.get("/api/nasa/soil-moisture")
async def get_nasa_soil_moisture(
    lat: float = Query(11.6854),
    lon: float = Query(76.1320)
):
    data = await NASAService.fetch_power_climate(lat, lon)
    return {
        "source": "NASA SMAP L4 (Soil Moisture Active Passive)",
        "coordinates": {"lat": lat, "lon": lon},
        "soil_moisture": data.get("earth_observations", {}).get("smap", {}),
        "ecostress_et": data.get("earth_observations", {}).get("ecostress", {})
    }

@app.get("/api/nasa/vegetation")
async def get_nasa_vegetation(
    lat: float = Query(11.6854),
    lon: float = Query(76.1320)
):
    data = await NASAService.fetch_power_climate(lat, lon)
    return {
        "source": "NASA MODIS MOD13Q1 (Terra/Aqua)",
        "coordinates": {"lat": lat, "lon": lon},
        "vegetation": data.get("earth_observations", {}).get("modis", {})
    }

# 3. Crop Explorer & Suitability Engine
@app.get("/api/crops")
def list_crops():
    return CROPS_DATABASE

@app.get("/api/crops/{crop_id}")
def get_crop(crop_id: str):
    c = get_crop_by_id(crop_id)
    if not c:
        raise HTTPException(status_code=404, detail="Crop not found in knowledge base")
    return c

@app.get("/api/crops/suitability/{farm_id}")
async def evaluate_crops_for_farm(farm_id: str):
    farm = get_farm_or_404(farm_id)
    climate = await NASAService.fetch_power_climate(farm["latitude"], farm["longitude"])
    summary = climate.get("summary", {})
    soil_info = {
        "soil_ph": farm.get("soil_ph", 6.2),
        "soil_type": farm.get("soil_type", "Laterite Loam"),
        "irrigation_type": farm.get("irrigation_type", "Rainfed"),
        "current_crop": farm.get("current_crop", "Rice")
    }
    
    results = []
    for crop in CROPS_DATABASE:
        res = SuitabilityEngine.calculate_suitability(crop, summary, soil_info, farm.get("preferred_crops", []))
        results.append(res)
        
    results.sort(key=lambda x: x["score"], reverse=True)
    return {
        "farm_id": farm["id"],
        "farm_name": farm["name"],
        "climate_summary": summary,
        "suitability_ranking": results
    }

# 4. Crop Rotation Recommendation Engine
@app.get("/api/rotation/generate/{farm_id}")
async def generate_rotation_strategies(farm_id: str):
    farm = get_farm_or_404(farm_id)
    climate = await NASAService.fetch_power_climate(farm["latitude"], farm["longitude"])
    strategies = RotationPlanner.generate_strategies(farm, climate)
    return {
        "farm_id": farm["id"],
        "farm_name": farm["name"],
        "location": farm["location"],
        "strategies": strategies
    }

# 5. Scenario Simulator
@app.post("/api/scenarios/simulate")
async def simulate_scenario(payload: ScenarioRequest):
    farm = get_farm_or_404(payload.farm_id)
    climate = await NASAService.fetch_power_climate(farm["latitude"], farm["longitude"])
    simulation = ScenarioSimulator.simulate(
        baseline_climate=climate,
        farm=farm,
        rainfall_delta_pct=payload.rainfall_delta_pct,
        temp_delta_c=payload.temp_delta_c,
        soil_moisture_delta_pct=payload.soil_moisture_delta_pct
    )
    return simulation

# 6. AI Agricultural Assistant
@app.post("/api/assistant/chat")
async def assistant_chat(payload: AssistantQuery):
    farm = None
    if payload.farm_id:
        farm = get_farm_or_404(payload.farm_id)
    else:
        # Default first farm
        farms = list_farms()
        farm = farms[0] if farms else {
            "id": "default", "name": "Kerala Model Farm", "latitude": 11.6854, "longitude": 76.1320,
            "soil_type": "Laterite Loam", "soil_ph": 6.2, "current_crop": "Rice"
        }
    
    climate = await NASAService.fetch_power_climate(farm["latitude"], farm["longitude"])
    answer = AIAssistant.answer_query(payload.query, farm, climate, payload.lang or "en")
    return answer

# 7. Reports (CSV and Structured Export)
@app.get("/api/reports/csv/{farm_id}")
async def export_farm_csv(farm_id: str):
    farm = get_farm_or_404(farm_id)
    climate = await NASAService.fetch_power_climate(farm["latitude"], farm["longitude"])
    summary = climate.get("summary", {})

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["AGROVERSE Farm Report", "NASA Space Apps Challenge 2026"])
    writer.writerow(["Farm Name", farm["name"]])
    writer.writerow(["Location", farm["location"]])
    writer.writerow(["Coordinates", f"{farm['latitude']}, {farm['longitude']}"])
    writer.writerow(["Area (Hectares)", farm["area_hectares"]])
    writer.writerow(["Soil Type", farm["soil_type"]])
    writer.writerow(["Soil pH", farm["soil_ph"]])
    writer.writerow(["Current Crop", farm["current_crop"]])
    writer.writerow(["Irrigation", farm["irrigation_type"]])
    writer.writerow([])
    writer.writerow(["NASA Earth Observation Indicators"])
    writer.writerow(["Parameter", "Value", "Source"])
    writer.writerow(["Mean Annual Rainfall", f"{summary.get('annual_rainfall_mm')} mm", "NASA POWER Daily Meteorology"])
    writer.writerow(["Mean Temperature", f"{summary.get('mean_temperature_c')} °C", "NASA POWER Daily Meteorology"])
    writer.writerow(["Relative Humidity", f"{summary.get('current_humidity_pct')} %", "NASA POWER Daily Meteorology"])
    
    obs = climate.get("earth_observations", {})
    writer.writerow(["Surface Soil Moisture", f"{obs.get('smap', {}).get('surface_sm_m3m3')} m³/m³", "NASA SMAP L4"])
    writer.writerow(["Evapotranspiration", f"{obs.get('ecostress', {}).get('evapotranspiration_mm_day')} mm/day", "NASA ECOSTRESS"])
    writer.writerow(["Vegetation NDVI", f"{obs.get('modis', {}).get('ndvi')}", "NASA MODIS MOD13Q1"])
    writer.writerow([])
    
    writer.writerow(["Crop Suitability Rankings"])
    writer.writerow(["Crop", "Suitability Score", "Category", "Water Demand", "Duration"])
    soil_info = {"soil_ph": farm["soil_ph"], "soil_type": farm["soil_type"], "irrigation_type": farm["irrigation_type"], "current_crop": farm["current_crop"]}
    for c in CROPS_DATABASE:
        ev = SuitabilityEngine.calculate_suitability(c, summary, soil_info, farm.get("preferred_crops", []))
        writer.writerow([c["name"], ev["score"], ev["suitability_category"], ev["water_demand"], ev["duration"]])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=agroverse_farm_{farm_id}.csv"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
