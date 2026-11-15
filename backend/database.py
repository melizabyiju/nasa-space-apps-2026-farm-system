import os
import json
import sqlite3
from typing import List, Optional, Dict, Any
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sky2soil.db")
# Migrate legacy db name if needed
_legacy_db = os.path.join(os.path.dirname(__file__), "agroverse.db")
if os.path.exists(_legacy_db) and not os.path.exists(DB_PATH):
    import shutil
    shutil.copyfile(_legacy_db, DB_PATH)

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Farms table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS farms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        area_hectares REAL NOT NULL,
        soil_type TEXT NOT NULL,
        soil_ph REAL,
        organic_matter REAL,
        nitrogen_level TEXT,
        phosphorus_level TEXT,
        potassium_level TEXT,
        irrigation_type TEXT NOT NULL,
        current_crop TEXT,
        previous_crops TEXT,
        preferred_crops TEXT,
        farming_priorities TEXT,
        created_at TEXT NOT NULL
    )
    """)
    
    # NASA Cache table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nasa_cache (
        cache_key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        cached_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
    )
    """)
    
    # Chat history / assistance log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assistant_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farm_id TEXT,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        initials TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        farm_name TEXT,
        is_default INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Seed default user if empty
    cursor.execute("SELECT COUNT(*) as count FROM users")
    if cursor.fetchone()["count"] == 0:
        cursor.execute("""
        INSERT INTO users (id, name, role, initials, email, phone, farm_name, is_default, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "default-kristin",
            "Kristin P.",
            "Farmer / Agronomist",
            "KP",
            "kristin.p@sky2soil.farm",
            "+91 98470 12345",
            "Wayanad Highland Agrofarm",
            1,
            datetime.utcnow().isoformat()
        ))
    
    # Seed default farm if empty
    cursor.execute("SELECT COUNT(*) as count FROM farms")
    if cursor.fetchone()["count"] == 0:
        cursor.execute("""
        INSERT INTO farms (
            id, name, location, latitude, longitude, area_hectares,
            soil_type, soil_ph, organic_matter, nitrogen_level, phosphorus_level, potassium_level,
            irrigation_type, current_crop, previous_crops, preferred_crops, farming_priorities, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            "farm-kerala-001",
            "Wayanad Highland Agrofarm",
            "Wayanad, Kerala, India",
            11.6854,
            76.1320,
            3.5,
            "Laterite / Red Sandy Loam",
            5.8,
            1.8,
            "Medium",
            "Low",
            "Medium",
            "Drip & Rainfed",
            "Rice (Paddy)",
            json.dumps(["Rice", "Cowpea", "Sesame"]),
            json.dumps(["Rice", "Banana", "Pepper", "Cowpea", "Green Gram"]),
            json.dumps(["Soil Health", "Water Conservation", "Climate Resilience"]),
            datetime.utcnow().isoformat()
        ))
        
        cursor.execute("""
        INSERT INTO farms (
            id, name, location, latitude, longitude, area_hectares,
            soil_type, soil_ph, organic_matter, nitrogen_level, phosphorus_level, potassium_level,
            irrigation_type, current_crop, previous_crops, preferred_crops, farming_priorities, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            "farm-kerala-002",
            "Palakkad Valley Farmstead",
            "Palakkad, Kerala, India",
            10.7867,
            76.6548,
            5.2,
            "Alluvial / Clay Loam",
            6.4,
            2.1,
            "High",
            "Medium",
            "High",
            "Canal & Sprinkler",
            "Rice (Paddy)",
            json.dumps(["Rice", "Black Gram"]),
            json.dumps(["Rice", "Maize", "Groundnut", "Pulses"]),
            json.dumps(["Profitability", "Soil Health"]),
            datetime.utcnow().isoformat()
        ))
        
    conn.commit()
    conn.close()
