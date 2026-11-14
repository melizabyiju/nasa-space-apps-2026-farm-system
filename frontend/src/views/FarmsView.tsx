import React, { useState } from 'react';
import { Farm } from '../types';
import { api } from '../api';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight,
  Crosshair,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { translations, Language } from '../translations';
import { LocationSelector } from '../components/LocationSelector';

interface FarmsViewProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  onRefreshFarms: () => void;
  lang: Language;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  farms,
  selectedFarm,
  onSelectFarm,
  onRefreshFarms,
  lang,
}) => {
  const t = translations[lang];
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Wayanad, Kerala, India');
  const [latitude, setLatitude] = useState(11.6854);
  const [longitude, setLongitude] = useState(76.1320);
  const [areaHectares, setAreaHectares] = useState(2.5);
  const [soilType, setSoilType] = useState('Laterite Loam');
  const [soilPh, setSoilPh] = useState<number | ''>(6.0);
  const [irrigationType, setIrrigationType] = useState('Drip & Canal');
  const [currentCrop, setCurrentCrop] = useState('Rice (Paddy)');
  const [preferredCrops, setPreferredCrops] = useState('Rice, Cowpea, Green Gram, Banana');
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const handleLocationConfirmed = (data: {
    lat: number;
    lng: number;
    locationName: string;
    details: { village?: string; district?: string; state?: string; country?: string };
  }) => {
    setLatitude(data.lat);
    setLongitude(data.lng);
    setLocation(data.locationName);
    setIsLocationConfirmed(true);
  };

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createFarm({
        name,
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        area_hectares: Number(areaHectares),
        soil_type: soilType,
        soil_ph: soilPh === '' ? null : Number(soilPh),
        organic_matter: 1.8,
        nitrogen_level: 'Medium',
        phosphorus_level: 'Medium',
        potassium_level: 'Medium',
        irrigation_type: irrigationType,
        current_crop: currentCrop,
        previous_crops: [currentCrop],
        preferred_crops: preferredCrops.split(',').map(s => s.trim()).filter(Boolean),
        farming_priorities: ['Soil Health', 'Water Conservation', 'Climate Resilience']
      });
      setShowAddModal(false);
      onRefreshFarms();
      setName('');
      setIsLocationConfirmed(false);
    } catch (err) {
      alert('Error creating farm: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this farm profile?')) {
      await api.deleteFarm(id);
      onRefreshFarms();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border border-white/80 shadow-md">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            {lang === 'ml' ? 'നിങ്ങളുടെ കൃഷിയിടങ്ങൾ' : 'My Registered Farms'}
          </h2>
          <p className="text-neutral-700 text-sm mt-1 font-medium">
            {lang === 'ml' 
              ? 'കൃഷിയിടം തെരഞ്ഞെടുക്കുമ്പോൾ നാസ ഉപഗ്രഹങ്ങൾ തത്സമയം കാലാവസ്ഥാ വിവരങ്ങൾ നൽകും.'
              : 'Select your farm to activate instant NASA satellite climate and soil monitoring.'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setIsLocationConfirmed(false);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ml' ? 'പുതിയ കൃഷിയിടം ചേർക്കുക' : 'Add New Farm'}</span>
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {farms.map((farm) => {
          const isSelected = selectedFarm?.id === farm.id;
          return (
            <div
              key={farm.id}
              onClick={() => onSelectFarm(farm)}
              className={`glass-card p-6 flex flex-col justify-between border cursor-pointer transition-all duration-200 relative group hover:shadow-xl ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md bg-white/95'
                  : 'border-white/80 hover:border-emerald-300 hover:bg-white/90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {farm.area_hectares} {t.hectares}
                    </span>
                    <h3 className="text-xl font-extrabold text-neutral-900 mt-2">{farm.name}</h3>
                    <p className="text-xs text-neutral-600 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {farm.location}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(farm.id, e)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Remove farm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-xs font-medium">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">{t.coordinates}:</span>
                    <span className="font-bold text-neutral-800">{farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">{t.soilType}:</span>
                    <span className="font-bold text-neutral-800">{farm.soil_type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">{t.irrigation}:</span>
                    <span className="font-bold text-neutral-800">{farm.irrigation_type}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">{t.currentCrop}:</span>
                    <span className="font-extrabold text-emerald-900">{farm.current_crop}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-200 flex items-center justify-between">
                {isSelected ? (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {lang === 'ml' ? 'നിലവിൽ തിരഞ്ഞെടുത്തു' : 'Currently Active'}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-neutral-600 group-hover:text-emerald-800 flex items-center gap-1">
                    {lang === 'ml' ? 'ഇത് തിരഞ്ഞെടുക്കുക' : 'Select Farm'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-[11px] text-neutral-400 font-semibold">NASA Tracked</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farm Modal with Interactive Location Selector */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="glass-card bg-white max-w-2xl w-full p-6 border border-neutral-200 shadow-2xl rounded-3xl max-h-[92vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-neutral-900 mb-1">
              {lang === 'ml' ? 'പുതിയ കൃഷിയിടം രജിസ്റ്റർ ചെയ്യുക' : 'Register New Farm'}
            </h3>
            <p className="text-xs text-neutral-500 mb-4 font-medium">
              Use GPS or search to set your coordinates. NASA Earth observation data will connect automatically.
            </p>

            <form onSubmit={handleCreateFarm} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-neutral-800 mb-1 font-extrabold">Farm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wayanad Green Valley Farm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white text-xs sm:text-sm font-semibold text-neutral-800"
                />
              </div>

              {/* LOCATION SELECTOR SECTION ("Use My Current Location", Map, Reverse Geocoding) */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-300 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-900 font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'ml' ? 'കൃഷിയിടത്തിന്റെ സ്ഥാനം നിർണ്ണയിക്കുക' : 'Farm Location & GPS Coordinates'} *</span>
                  </label>
                  {isLocationConfirmed && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lang === 'ml' ? 'സ്ഥിരീകരിച്ചു' : 'Location Confirmed'}
                    </span>
                  )}
                </div>

                <LocationSelector
                  initialLat={latitude}
                  initialLng={longitude}
                  onLocationConfirmed={handleLocationConfirmed}
                  lang={lang}
                />

                {/* Displayed readouts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Latitude:</span>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white font-bold text-neutral-800 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Longitude:</span>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white font-bold text-neutral-800 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Area ({t.hectares}):</span>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={areaHectares}
                      onChange={(e) => setAreaHectares(Number(e.target.value))}
                      className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white font-bold text-neutral-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Soil & Water parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-800 mb-1 font-extrabold">Soil Classification *</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white font-semibold text-neutral-800 text-xs sm:text-sm"
                  >
                    <option value="Laterite Loam">Laterite Loam (ചെങ്കൽ മണ്ണ്)</option>
                    <option value="Red Sandy Loam">Red Sandy Loam (ചെമ്മണ്ണ്)</option>
                    <option value="Alluvial / Clay Loam">Alluvial / Clay Loam (എക്കൽ മണ്ണ്)</option>
                    <option value="Coastal Sandy">Coastal Sandy (തീരദേശ മണൽ)</option>
                    <option value="Clay / Heavy Loam">Clay / Heavy Loam (കരിമണ്ണ്)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-800 mb-1 font-extrabold">Irrigation Access *</label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white font-semibold text-neutral-800 text-xs sm:text-sm"
                  >
                    <option value="Drip & Canal">Drip & Canal</option>
                    <option value="Rainfed (Monsoon Only)">Rainfed (Monsoon Only)</option>
                    <option value="Sprinkler & Borewell">Sprinkler & Borewell</option>
                    <option value="Canal & Flood">Canal & Flood</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-800 mb-1 font-extrabold">Current Crop</label>
                  <input
                    type="text"
                    value={currentCrop}
                    onChange={(e) => setCurrentCrop(e.target.value)}
                    placeholder="e.g. Rice (Paddy)"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white font-semibold text-neutral-800 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-800 mb-1 font-extrabold">Preferred Crops (Comma-separated)</label>
                  <input
                    type="text"
                    value={preferredCrops}
                    onChange={(e) => setPreferredCrops(e.target.value)}
                    placeholder="e.g. Rice, Cowpea, Green Gram, Banana"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white font-semibold text-neutral-800 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold shadow-md disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Registering...' : (lang === 'ml' ? 'കൃഷിയിടം സേവ് ചെയ്യുക' : 'Save Farm Profile')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
