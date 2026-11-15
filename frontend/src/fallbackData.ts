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

export const DEFAULT_CROPS: Crop[] = [
  {
    id: "rice",
    name: "Rice (Paddy)",
    scientific_name: "Oryza sativa",
    family: "Poaceae (Gramineae)",
    category: "Cereal",
    duration_days: "110-135",
    seasons: ["Kharif (Virippu)", "Rabi (Mundakan)", "Summer (Puncha)"],
    min_temp_c: 20.0,
    max_temp_c: 35.0,
    optimal_temp_c: [22.0, 32.0],
    annual_rainfall_mm: [1000, 2500],
    water_requirement_mm: 1200,
    water_demand_level: "High",
    suitable_soils: ["Clay", "Clay Loam", "Alluvial", "Silty Loam"],
    min_ph: 5.0,
    max_ph: 7.5,
    optimal_ph: [5.5, 6.8],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "High (80-100 kg/ha)",
      phosphorus: "Medium (40-50 kg/ha)",
      potassium: "Medium-High (40-60 kg/ha)"
    },
    rotation_compatibility: ["Cowpea", "Green Gram", "Black Gram", "Groundnut", "Sesame", "Vegetables"],
    rotation_benefits: "High yield staple, suppresses upland weeds when flooded, fits multi-cropping seasons.",
    rotation_risks: "Heavy water depletion, repeated mono-cropping causes root-knot nematodes and nitrogen depletion.",
    reference: "ICAR-NRRI Cereal Handbook; KAU Package of Practices: Crops 2024"
  },
  {
    id: "cowpea",
    name: "Cowpea",
    scientific_name: "Vigna unguiculata",
    family: "Fabaceae (Leguminosae)",
    category: "Legume / Pulse",
    duration_days: "65-75",
    seasons: ["Summer (Puncha)", "Post-Kharif", "Late Rabi"],
    min_temp_c: 18.0,
    max_temp_c: 36.0,
    optimal_temp_c: [22.0, 30.0],
    annual_rainfall_mm: [400, 900],
    water_requirement_mm: 350,
    water_demand_level: "Low",
    suitable_soils: ["Sandy Loam", "Loam", "Laterite", "Well-drained Alluvial"],
    min_ph: 5.5,
    max_ph: 7.2,
    optimal_ph: [5.8, 6.8],
    nitrogen_fixation: true,
    nitrogen_fixed_kg_ha: "30-50 kg/ha biological N2 fixation",
    nutrient_demand: {
      nitrogen: "Low (starter 15-20 kg/ha)",
      phosphorus: "Medium-High (40 kg/ha)",
      potassium: "Low-Medium (20 kg/ha)"
    },
    rotation_compatibility: ["Rice", "Maize", "Banana", "Vegetables", "Millets"],
    rotation_benefits: "Fixes atmospheric nitrogen, breaks cereal pest cycles, restores soil organic carbon and friability.",
    rotation_risks: "Susceptible to waterlogging during heavy monsoon rains.",
    reference: "ICAR-IIPR Kanpur, Kerala Agricultural University Pulse Crop Directives"
  },
  {
    id: "green_gram",
    name: "Green Gram (Moong)",
    scientific_name: "Vigna radiata",
    family: "Fabaceae (Leguminosae)",
    category: "Legume / Pulse",
    duration_days: "60-70",
    seasons: ["Summer", "Late Rabi", "Spring"],
    min_temp_c: 20.0,
    max_temp_c: 38.0,
    optimal_temp_c: [25.0, 32.0],
    annual_rainfall_mm: [500, 800],
    water_requirement_mm: 300,
    water_demand_level: "Low",
    suitable_soils: ["Loam", "Sandy Loam", "Laterite Loam"],
    min_ph: 6.0,
    max_ph: 7.5,
    optimal_ph: [6.2, 7.2],
    nitrogen_fixation: true,
    nitrogen_fixed_kg_ha: "35-45 kg/ha biological N2 fixation",
    nutrient_demand: {
      nitrogen: "Low (15 kg/ha)",
      phosphorus: "Medium (30-40 kg/ha)",
      potassium: "Low (20 kg/ha)"
    },
    rotation_compatibility: ["Rice", "Maize", "Groundnut", "Sorghum"],
    rotation_benefits: "Rapid catch crop, improves soil biology, reduces inorganic N fertilizer requirement for subsequent cereal.",
    rotation_risks: "Intolerant of waterlogging and heavy hail/rains during flowering.",
    reference: "ICAR-Indian Institute of Pulses Research, KAU POP 2024"
  },
  {
    id: "black_gram",
    name: "Black Gram (Urad)",
    scientific_name: "Vigna mungo",
    family: "Fabaceae (Leguminosae)",
    category: "Legume / Pulse",
    duration_days: "70-80",
    seasons: ["Rabi", "Summer"],
    min_temp_c: 20.0,
    max_temp_c: 35.0,
    optimal_temp_c: [24.0, 30.0],
    annual_rainfall_mm: [600, 900],
    water_requirement_mm: 350,
    water_demand_level: "Low",
    suitable_soils: ["Clay Loam", "Alluvial", "Heavy Loam"],
    min_ph: 5.8,
    max_ph: 7.5,
    optimal_ph: [6.0, 7.0],
    nitrogen_fixation: true,
    nitrogen_fixed_kg_ha: "30-40 kg/ha",
    nutrient_demand: {
      nitrogen: "Low (15 kg/ha)",
      phosphorus: "Medium (35 kg/ha)",
      potassium: "Low (20 kg/ha)"
    },
    rotation_compatibility: ["Rice", "Maize", "Cotton", "Millets"],
    rotation_benefits: "Excellent residual moisture feeder following wetland rice, strengthens soil aggregation.",
    rotation_risks: "Susceptible to yellow mosaic virus if pest pressure not managed.",
    reference: "ICAR-IIPR, Kerala Agri University Guidelines"
  },
  {
    id: "groundnut",
    name: "Groundnut (Peanut)",
    scientific_name: "Arachis hypogaea",
    family: "Fabaceae (Leguminosae)",
    category: "Oilseed / Legume",
    duration_days: "100-115",
    seasons: ["Kharif", "Rabi / Summer"],
    min_temp_c: 20.0,
    max_temp_c: 34.0,
    optimal_temp_c: [24.0, 30.0],
    annual_rainfall_mm: [500, 1000],
    water_requirement_mm: 500,
    water_demand_level: "Medium",
    suitable_soils: ["Sandy Loam", "Red Sandy", "Light Loam"],
    min_ph: 5.8,
    max_ph: 7.2,
    optimal_ph: [6.0, 6.8],
    nitrogen_fixation: true,
    nitrogen_fixed_kg_ha: "40-60 kg/ha",
    nutrient_demand: {
      nitrogen: "Low-Medium (20 kg/ha)",
      phosphorus: "High (50 kg/ha)",
      potassium: "Medium-High (50 kg/ha)"
    },
    rotation_compatibility: ["Rice", "Maize", "Pulses", "Millets"],
    rotation_benefits: "High economic value, builds deep root channels and fixes soil nitrogen.",
    rotation_risks: "Requires friable soil for peg penetration; cannot tolerate heavy clay or poor drainage.",
    reference: "ICAR-Directorate of Groundnut Research; KAU Agri Bulletins"
  },
  {
    id: "banana",
    name: "Banana (Nendran / Robusta)",
    scientific_name: "Musa acuminata",
    family: "Musaceae",
    category: "Fruit / Horticulture",
    duration_days: "290-330",
    seasons: ["Perennial / Annual Cycle (Aug-Sept or April-May)"],
    min_temp_c: 15.0,
    max_temp_c: 38.0,
    optimal_temp_c: [22.0, 30.0],
    annual_rainfall_mm: [1200, 2200],
    water_requirement_mm: 1600,
    water_demand_level: "High",
    suitable_soils: ["Clay Loam", "Alluvial", "Deep Loamy"],
    min_ph: 5.5,
    max_ph: 7.5,
    optimal_ph: [6.0, 7.0],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "High (200-250 g/plant)",
      phosphorus: "Medium (150 g/plant)",
      potassium: "Very High (300-400 g/plant)"
    },
    rotation_compatibility: ["Rice", "Cowpea intercrop", "Green manures", "Ginger"],
    rotation_benefits: "High commercial revenue, substantial biomass residue returned to soil after harvest.",
    rotation_risks: "Heavy nutrient and potassium depletion; leaves soil prone to Fusarium wilt without rotation.",
    reference: "ICAR-National Research Centre for Banana (NRCB); KAU Banana Guides"
  },
  {
    id: "pepper",
    name: "Black Pepper",
    scientific_name: "Piper nigrum",
    family: "Piperaceae",
    category: "Spice / Plantation",
    duration_days: "Perennial (Spike dev 180 days)",
    seasons: ["Monsoon / Pre-Monsoon Flowering"],
    min_temp_c: 18.0,
    max_temp_c: 35.0,
    optimal_temp_c: [20.0, 30.0],
    annual_rainfall_mm: [1500, 3000],
    water_requirement_mm: 1800,
    water_demand_level: "Medium-High",
    suitable_soils: ["Laterite", "Red Loam", "Humus-rich forest loams"],
    min_ph: 4.5,
    max_ph: 6.5,
    optimal_ph: [5.0, 6.0],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "Medium (100 g/vine)",
      phosphorus: "Medium (40 g/vine)",
      potassium: "High (140 g/vine)"
    },
    rotation_compatibility: ["Intercropped with Coconut, Arecanut, Coffee"],
    rotation_benefits: "High value spice export, thrives under agroforestry shade microclimates.",
    rotation_risks: "Highly vulnerable to Phytophthora foot rot in poorly drained waterlogged soils.",
    reference: "ICAR-Indian Institute of Spices Research (IISR) Kozhikode"
  },
  {
    id: "coconut",
    name: "Coconut Palm",
    scientific_name: "Cocos nucifera",
    family: "Arecaceae",
    category: "Plantation",
    duration_days: "Perennial (Lifespan 60+ yrs)",
    seasons: ["Year-round"],
    min_temp_c: 20.0,
    max_temp_c: 35.0,
    optimal_temp_c: [25.0, 32.0],
    annual_rainfall_mm: [1300, 2500],
    water_requirement_mm: 1300,
    water_demand_level: "Medium",
    suitable_soils: ["Coastal Sand", "Laterite", "Alluvial", "Red Sandy Loam"],
    min_ph: 5.2,
    max_ph: 8.0,
    optimal_ph: [5.5, 7.0],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "500 g/palm/yr",
      phosphorus: "320 g/palm/yr",
      potassium: "1200 g/palm/yr"
    },
    rotation_compatibility: ["Pepper", "Cocoa", "Banana", "Nutmeg", "Cowpea cover crops"],
    rotation_benefits: "Permits multi-tier cropping, provides year-round ground canopy.",
    rotation_risks: "Susceptible to root wilt disease and prolonged summer drought.",
    reference: "ICAR-Central Plantation Crops Research Institute (CPCRI) Kasaragod"
  },
  {
    id: "maize",
    name: "Maize (Corn)",
    scientific_name: "Zea mays",
    family: "Poaceae",
    category: "Cereal",
    duration_days: "90-110",
    seasons: ["Kharif", "Rabi"],
    min_temp_c: 16.0,
    max_temp_c: 36.0,
    optimal_temp_c: [21.0, 30.0],
    annual_rainfall_mm: [600, 1100],
    water_requirement_mm: 550,
    water_demand_level: "Medium",
    suitable_soils: ["Well-drained Loam", "Silt Loam", "Alluvial"],
    min_ph: 5.5,
    max_ph: 7.5,
    optimal_ph: [6.0, 7.0],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "High (120 kg/ha)",
      phosphorus: "Medium (60 kg/ha)",
      potassium: "Medium (40 kg/ha)"
    },
    rotation_compatibility: ["Legumes (Cowpea, Green Gram)", "Groundnut", "Mustard"],
    rotation_benefits: "High fodder and grain biomass, excellent break crop for wetland weeds.",
    rotation_risks: "Heavy nitrogen consumer; fall armyworm vigilance needed.",
    reference: "ICAR-Indian Institute of Maize Research (IIMR)"
  },
  {
    id: "rubber",
    name: "Natural Rubber",
    scientific_name: "Hevea brasiliensis",
    family: "Euphorbiaceae",
    category: "Plantation",
    duration_days: "Perennial (Tapping starts yr 7)",
    seasons: ["Year-round"],
    min_temp_c: 20.0,
    max_temp_c: 36.0,
    optimal_temp_c: [25.0, 32.0],
    annual_rainfall_mm: [2000, 3000],
    water_requirement_mm: 1800,
    water_demand_level: "Medium-High",
    suitable_soils: ["Deep Laterite", "Red Loam", "Well-drained hill soils"],
    min_ph: 4.5,
    max_ph: 6.0,
    optimal_ph: [4.8, 5.5],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "Medium (30-40 kg/ha)",
      phosphorus: "Medium (30-40 kg/ha)",
      potassium: "Medium (25-30 kg/ha)"
    },
    rotation_compatibility: ["Leguminous cover crops (Mucuna, Pueraria) during immature phase"],
    rotation_benefits: "High long term latex return, extensive root system controls hill erosion.",
    rotation_risks: "Vulnerable to leaf fall and abnormal latex drop during extreme rainfall fluctuations.",
    reference: "Rubber Research Institute of India (RRII) Kottayam"
  },
  {
    id: "vegetables_bhindi",
    name: "Okra (Bhindi)",
    scientific_name: "Abelmoschus esculentus",
    family: "Malvaceae",
    category: "Vegetables",
    duration_days: "75-90",
    seasons: ["Summer", "Kharif"],
    min_temp_c: 22.0,
    max_temp_c: 38.0,
    optimal_temp_c: [25.0, 32.0],
    annual_rainfall_mm: [600, 1000],
    water_requirement_mm: 450,
    water_demand_level: "Medium-Low",
    suitable_soils: ["Sandy Loam", "Clay Loam", "Rich Alluvial"],
    min_ph: 6.0,
    max_ph: 7.5,
    optimal_ph: [6.2, 6.8],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "Medium (60 kg/ha)",
      phosphorus: "Medium (50 kg/ha)",
      potassium: "Medium (50 kg/ha)"
    },
    rotation_compatibility: ["Legumes", "Rice", "Cereals"],
    rotation_benefits: "Fast-cash vegetable rotation, deep taproot aerates compacted subsoil.",
    rotation_risks: "Vulnerable to yellow vein mosaic virus and fruit borer.",
    reference: "ICAR-Indian Institute of Vegetable Research (IIVR); KAU Vegetable Package"
  },
  {
    id: "sesame",
    name: "Sesame (Gingelly)",
    scientific_name: "Sesamum indicum",
    family: "Pedaliaceae",
    category: "Oilseed",
    duration_days: "75-85",
    seasons: ["Summer / Late Rabi (Post-paddy)"],
    min_temp_c: 24.0,
    max_temp_c: 40.0,
    optimal_temp_c: [26.0, 33.0],
    annual_rainfall_mm: [450, 750],
    water_requirement_mm: 280,
    water_demand_level: "Very Low",
    suitable_soils: ["Sandy Loam", "Light Alluvial", "Residual Rice fallows"],
    min_ph: 5.5,
    max_ph: 7.5,
    optimal_ph: [6.0, 7.0],
    nitrogen_fixation: false,
    nutrient_demand: {
      nitrogen: "Low (30 kg/ha)",
      phosphorus: "Low (15 kg/ha)",
      potassium: "Low (15 kg/ha)"
    },
    rotation_compatibility: ["Rice", "Pulses", "Millets"],
    rotation_benefits: "Extreme drought tolerance, utilizes residual moisture in summer paddy fallow.",
    rotation_risks: "Cannot stand even 12 hours of stagnant water logging.",
    reference: "KAU Package of Practices: Oilseeds & Rice Fallows"
  }
];

export const DEFAULT_SUITABILITY: CropSuitability[] = [
  {
    crop_id: "cowpea",
    crop_name: "Cowpea",
    scientific_name: "Vigna unguiculata",
    family: "Fabaceae",
    category_type: "Legume / Pulse",
    score: 94,
    suitability_category: "Highly Suitable",
    factors: {
      temperature: { score: 96, weight: 0.25, reason: "Optimal thermal growth band (22-30°C)." },
      water: { score: 92, weight: 0.25, reason: "Low water requirement; thrives on residual post-monsoon moisture." },
      soil: { score: 94, weight: 0.25, reason: "Well adapted to laterite and red sandy loam soils." },
      farmer_alignment: { score: 95, weight: 0.25, reason: "Restores soil health and nitrogen after rice harvest." }
    },
    water_demand: "Low",
    duration: "65-75 days",
    benefits: "Fixes 35-50 kg/ha atmospheric nitrogen; reduces next season urea requirements.",
    risks: "Sensitive to prolonged waterlogging.",
    nitrogen_fixation: true,
    reference: "KAU Package of Practices: Crops"
  },
  {
    crop_id: "green_gram",
    crop_name: "Green Gram (Moong)",
    scientific_name: "Vigna radiata",
    family: "Fabaceae",
    category_type: "Legume / Pulse",
    score: 91,
    suitability_category: "Highly Suitable",
    factors: {
      temperature: { score: 94, weight: 0.25, reason: "Heat tolerant; excellent summer catch crop." },
      water: { score: 90, weight: 0.25, reason: "Low water footprint (~300 mm)." },
      soil: { score: 90, weight: 0.25, reason: "Builds microbial organic carbon." },
      farmer_alignment: { score: 90, weight: 0.25, reason: "Quick 65-day cash return." }
    },
    water_demand: "Low",
    duration: "60-70 days",
    benefits: "Fast vegetative turnaround, improves soil aeration.",
    risks: "Avoid heavy rain during pod maturation.",
    nitrogen_fixation: true,
    reference: "ICAR-IIPR Kanpur"
  },
  {
    crop_id: "rice",
    crop_name: "Rice (Paddy)",
    scientific_name: "Oryza sativa",
    family: "Poaceae",
    category_type: "Cereal",
    score: 86,
    suitability_category: "Highly Suitable",
    factors: {
      temperature: { score: 95, weight: 0.25, reason: "Temperature aligns with monsoon vegetative phase." },
      water: { score: 85, weight: 0.25, reason: "High water requirement supported by seasonal rainfall." },
      soil: { score: 88, weight: 0.25, reason: "Thrives in alluvial and loam soils." },
      farmer_alignment: { score: 76, weight: 0.25, reason: "Currently cultivated; requires legume rotation to prevent soil exhaustion." }
    },
    water_demand: "High",
    duration: "115-130 days",
    benefits: "Primary staple harvest; suppresses terrestrial weeds.",
    risks: "Continuous mono-cropping leads to pest persistence.",
    nitrogen_fixation: false,
    reference: "KAU Cereal Agronomy"
  },
  {
    crop_id: "maize",
    crop_name: "Maize (Corn)",
    scientific_name: "Zea mays",
    family: "Poaceae",
    category_type: "Cereal",
    score: 84,
    suitability_category: "Highly Suitable",
    factors: {
      temperature: { score: 90, weight: 0.25, reason: "Photosynthetically efficient C4 crop." },
      water: { score: 88, weight: 0.25, reason: "Requires 550 mm water (saves 50% over wetland paddy)." },
      soil: { score: 82, weight: 0.25, reason: "Prefers well-drained loam." },
      farmer_alignment: { score: 76, weight: 0.25, reason: "Good alternative cereal during drought-risk years." }
    },
    water_demand: "Medium",
    duration: "90-110 days",
    benefits: "High grain and fodder value; leaves loose soil structure.",
    risks: "Scout for fall armyworm.",
    nitrogen_fixation: false,
    reference: "ICAR-IIMR"
  },
  {
    crop_id: "vegetables_bhindi",
    crop_name: "Okra (Bhindi)",
    scientific_name: "Abelmoschus esculentus",
    family: "Malvaceae",
    category_type: "Vegetables",
    score: 82,
    suitability_category: "Highly Suitable",
    factors: {
      temperature: { score: 88, weight: 0.25, reason: "Thrives in warm tropical weather." },
      water: { score: 84, weight: 0.25, reason: "Moderate water requirement with drip." },
      soil: { score: 80, weight: 0.25, reason: "Requires good drainage." },
      farmer_alignment: { score: 76, weight: 0.25, reason: "Weekly cash revenue." }
    },
    water_demand: "Medium-Low",
    duration: "75-90 days",
    benefits: "Weekly picking; breaks cereal disease cycles.",
    risks: "Requires regular harvesting.",
    nitrogen_fixation: false,
    reference: "KAU Vegetable Handbook"
  }
];

export const DEFAULT_ROTATION_STRATEGIES: RotationStrategy[] = [
  {
    id: "strat-soil-regeneration",
    title: "Plan 1: Soil Healing & Biological Nitrogen Fixation",
    tagline: "Restores soil organic carbon, fixes atmospheric nitrogen, and interrupts weed/nematode cycles.",
    primary_focus: "Soil Health & Nutrient Replenishment",
    rotation_length: "3 Seasons (12-14 Months)",
    estimated_n_fixed_kg_ha: "45-65 kg/ha",
    water_footprint: "Moderate (1,550 mm total)",
    radar_metrics: {
      soil_health: 95,
      water_conservation: 80,
      climate_resilience: 88,
      economic_profitability: 74,
      farmer_preference: 82
    },
    timeline: [
      {
        season: "Season 1 (Kharif / Monsoon: Jun - Oct)",
        crop: "Rice (Paddy)",
        family: "Poaceae",
        duration: "120 days",
        role: "Primary staple production, leverages heavy monsoon rain.",
        soil_impact: "Consumes available soil N, suppresses terrestrial weeds.",
        water_demand: "High (Puddled wetland)"
      },
      {
        season: "Season 2 (Rabi / Winter: Nov - Jan)",
        crop: "Cowpea",
        family: "Fabaceae",
        duration: "70 days",
        role: "Pulse cash crop & biological nitrogen fixer.",
        soil_impact: "Fixes 35-50 kg/ha N via rhizobia nodules; builds root-zone microbial flora.",
        water_demand: "Low (Utilizes residual post-paddy moisture)"
      },
      {
        season: "Season 3 (Summer / Fallow: Feb - Apr)",
        crop: "Green Gram (Moong) / Green Manure",
        family: "Fabaceae",
        duration: "65 days",
        role: "Rapid catch crop, incorporated into soil before next monsoon.",
        soil_impact: "Provides fresh biomass, elevating organic carbon.",
        water_demand: "Very Low (Deep taproot drought tolerance)"
      }
    ],
    advantages: [
      "Reduces synthetic nitrogen fertilizer requirements by 35-40%.",
      "Deep root penetration of cowpea breaks up the hardpan created by puddled rice.",
      "Disrupts rice yellow stem borer lifecycles."
    ],
    limitations: [
      "Requires good field drainage after rice harvest to prevent seed rot."
    ],
    scientific_rationale: "Supported by ICAR-IIPR and Kerala Agri University studies proving cereal-pulse sequencing enhances subsequent paddy yield by 18-22%."
  },
  {
    id: "strat-climate-water",
    title: "Plan 2: Climate-Resilient & Water Conservation Strategy",
    tagline: "Engineered for rainfall deficits, high temperatures, and drought mitigation.",
    primary_focus: "Water Conservation & Drought Defense",
    rotation_length: "3 Seasons (11-13 Months)",
    estimated_n_fixed_kg_ha: "30-40 kg/ha",
    water_footprint: "Low (1,150 mm total - 40% reduction)",
    radar_metrics: {
      soil_health: 82,
      water_conservation: 96,
      climate_resilience: 94,
      economic_profitability: 78,
      farmer_preference: 76
    },
    timeline: [
      {
        season: "Season 1 (Kharif / Monsoon: Jun - Sep)",
        crop: "Maize (Direct Seeded) or Upland Rice",
        family: "Poaceae",
        duration: "100 days",
        role: "Moderate water cereal replacing flood-puddled paddy.",
        soil_impact: "Conserves topsoil structure, prevents anaerobic compaction.",
        water_demand: "Medium (550 mm vs 1200 mm for wetland rice)"
      },
      {
        season: "Season 2 (Rabi: Oct - Jan)",
        crop: "Groundnut (Peanut)",
        family: "Fabaceae",
        duration: "105 days",
        role: "High-value drought-tolerant oilseed and soil stabilizer.",
        soil_impact: "Fixes 40 kg/ha N, leaf mulch suppresses soil evaporation.",
        water_demand: "Low-Medium (Drip or light furrow irrigation)"
      },
      {
        season: "Season 3 (Summer: Feb - Apr)",
        crop: "Sesame (Gingelly)",
        family: "Pedaliaceae",
        duration: "80 days",
        role: "Extreme drought-hardy oilseed.",
        soil_impact: "Scavenges subsoil moisture; minimal nutrient mining.",
        water_demand: "Very Low (Only 250-280 mm total crop cycle)"
      }
    ],
    advantages: [
      "Saves over 1.2 million liters of water per hectare compared to double-rice systems.",
      "High tolerance to delayed monsoon onset.",
      "Diversifies farm income across grains, cooking oils, and protein."
    ],
    limitations: [
      "Groundnut requires friable well-drained soil for peg development."
    ],
    scientific_rationale: "NASA ECOSTRESS and SMAP data show elevated evapotranspiration and soil moisture deficits during pre-monsoon heat; substituting sesame and groundnut buffers against seasonal ground water table drops."
  },
  {
    id: "strat-economic-diversity",
    title: "Plan 3: High-Value Agro-Economic & Cash Vegetables",
    tagline: "Maximizes net farmer revenue per hectare while upholding biological diversity safeguards.",
    primary_focus: "Commercial Profitability & Crop Diversification",
    rotation_length: "Annual Cycle (12 Months)",
    estimated_n_fixed_kg_ha: "25-35 kg/ha",
    water_footprint: "Medium-High (1,850 mm total)",
    radar_metrics: {
      soil_health: 80,
      water_conservation: 72,
      climate_resilience: 84,
      economic_profitability: 96,
      farmer_preference: 92
    },
    timeline: [
      {
        season: "Season 1 (Monsoon: Jun - Oct)",
        crop: "Rice (Paddy)",
        family: "Poaceae",
        duration: "125 days",
        role: "High-value staple grain harvest.",
        soil_impact: "Suppresses troublesome broadleaf weeds.",
        water_demand: "High (Monsoon supported)"
      },
      {
        season: "Season 2 (Post-Monsoon: Nov - Jan)",
        crop: "Okra (Bhindi) / Cucurbit Vegetables",
        family: "Malvaceae",
        duration: "80 days",
        role: "Weekly cash turnaround at local farm markets.",
        soil_impact: "Extracts intermediate layer nutrients.",
        water_demand: "Medium (Controlled drip system)"
      },
      {
        season: "Season 3 (Summer: Feb - May)",
        crop: "Cowpea (Pulse)",
        family: "Fabaceae",
        duration: "75 days",
        role: "Restores soil health depleted by vegetable harvest.",
        soil_impact: "Inoculates soil with beneficial rhizobacteria before monsoon.",
        water_demand: "Low"
      }
    ],
    advantages: [
      "Provides steady weekly income from vegetable picking alongside grain bulk sales.",
      "Rotates across 3 distinct botanical families to break soil pathogens."
    ],
    limitations: [
      "Higher labor requirement for vegetable harvesting."
    ],
    scientific_rationale: "Tri-family rotation (Cereal - Vegetable - Pulse) is documented by FAO and KAU to suppress nematodes and maintain healthy soil."
  }
];
