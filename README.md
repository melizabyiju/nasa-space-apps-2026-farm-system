# AGROVERSE – NASA Space Apps Challenge 2026
**Field Shift: Adapting Farms with NASA Data**

AGROVERSE is a complete, modern agricultural intelligence platform that helps farmers and agronomists make climate-informed crop rotation decisions by synthesizing genuine NASA Earth observations, local soil characteristics, crop agronomic requirements, and farmer preferences.

---

## 🌟 Key Features

1. **Live NASA Earth Observations Integration**:
   - **NASA POWER API (v2.0)**: Real-time & historical daily meteorology (T2M 2-meter temperature, PRECTOTCORR precipitation, RH2M relative humidity, ALLSKY_SFC_SW_DWN solar insolation, WS2M wind speed).
   - **NASA SMAP (Soil Moisture Active Passive)**: L4 surface (0-5 cm) and rootzone (0-100 cm) volumetric soil moisture monitoring.
   - **NASA ECOSTRESS**: Canopy evapotranspiration and Evaporative Stress Index (ESI) on the International Space Station.
   - **NASA MODIS**: Normalized Difference Vegetation Index (NDVI) and land surface temperature dynamics.
   - **NASA GPM**: Global Precipitation Measurement IMERG calibration.

2. **Transparent Crop Suitability Engine**:
   - Multi-factor heuristic scoring (0-100) combining thermal bands, rainfall requirements, soil pH & texture compatibility, and historical cropping cycles.
   - Evaluates cereals, legumes/pulses, oilseeds, plantation crops, and vegetables with full ICAR & Kerala Agricultural University (KAU) citations.

3. **Multi-Season Crop Rotation Recommendation Engine (Core Module)**:
   - Generates and compares 3 scientifically validated rotation strategies:
     - **Strategy 1**: Soil Regeneration & Biological Nitrogen Fixation (breaks weed/nematode lifecycles, adds 45-65 kg N/ha).
     - **Strategy 2**: Climate-Resilient & Water Conservation (saves over 1.2M liters water/ha via C4 cereals and oilseeds).
     - **Strategy 3**: High-Value Agro-Economic & Farm Diversity (combines staples with high-margin cash vegetables).
   - Multi-season timeline visualizations and 5-axis radar chart trade-off analysis.

4. **Climate Scenario Simulator**:
   - Test hypothetical climate anomalies: precipitation deficits (-50% to +50%) and temperature spikes (+0°C to +4°C).
   - Computes crop shift ledgers and recommended agronomic adaptation protocols.

5. **AI Agricultural Assistant**:
   - Grounded conversational assistant with zero hallucination, citing ICAR, KAU, and NASA datasets.

6. **Reports & Data Transparency**:
   - One-click downloadable CSV dossier exports for extension agents and field verification.
   - Full data catalog citing spatial resolutions, units, and collection frequencies.

7. **UI/UX Design**:
   - Inspired by modern SaaS design systems (FARMFLOW) with subtle 28% opacity landscape backgrounds, frosted-glass bento cards, and responsive sidebar navigation.

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI + Python)
```bash
cd backend
python -m pip install fastapi uvicorn httpx pandas numpy pydantic sqlalchemy pydantic-settings reportlab python-multipart
python main.py
```
Backend runs at `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`).

### 2. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🧪 Running the Backend Verification Test
```bash
cd backend
python -c "from main import app; from fastapi.testclient import TestClient; client = TestClient(app); print(client.get('/api/health').json())"
```
