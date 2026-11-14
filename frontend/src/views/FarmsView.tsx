import React, { useState } from 'react';
import { Farm } from '../types';
import { api } from '../api';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Layers, 
  Droplet, 
  Sprout, 
  Check, 
  ShieldAlert,
  Compass,
  ArrowRight
} from 'lucide-react';

interface FarmsViewProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  onRefreshFarms: () => void;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  farms,
  selectedFarm,
  onSelectFarm,
  onRefreshFarms,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(11.6854);
  const [longitude, setLongitude] = useState(76.1320);
  const [areaHectares, setAreaHectares] = useState(2.5);
  const [soilType, setSoilType] = useState('Laterite Loam');
  const [soilPh, setSoilPh] = useState<number | ''>(6.0);
  const [organicMatter, setOrganicMatter] = useState<number | ''>(1.8);
  const [irrigationType, setIrrigationType] = useState('Drip & Canal');
  const [currentCrop, setCurrentCrop] = useState('Rice (Paddy)');
  const [preferredCrops, setPreferredCrops] = useState('Rice, Cowpea, Green Gram, Banana');

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
        organic_matter: organicMatter === '' ? null : Number(organicMatter),
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
      // Reset
      setName('');
      setLocation('');
    } catch (err) {
      alert('Error creating farm: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this farm profile?')) {
      await api.deleteFarm(id);
      onRefreshFarms();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border border-white/70 shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Farm Profiles Management</h2>
          <p className="text-neutral-600 text-sm mt-1">
            Configure geographic coordinates to automatically retrieve NASA Earth observation data for your parcels.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
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
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-lg bg-white/90'
                  : 'border-white/70 hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                      {farm.area_hectares} Hectares
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-2">{farm.name}</h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {farm.location}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(farm.id, e)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Delete farm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Bento */}
                <div className="mt-4 pt-4 border-t border-neutral-200/60 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Coordinates:</span>
                    <span className="font-semibold text-neutral-800">
                      {farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Soil Type:</span>
                    <span className="font-semibold text-neutral-800">{farm.soil_type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Soil pH:</span>
                    <span className="font-semibold text-neutral-800">
                      {farm.soil_ph !== null ? farm.soil_ph : <span className="text-amber-600 font-normal">Missing (Unmeasured)</span>}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Irrigation:</span>
                    <span className="font-semibold text-neutral-800">{farm.irrigation_type}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Current Crop:</span>
                    <span className="font-bold text-emerald-800">{farm.current_crop}</span>
                  </div>
                </div>

                {/* Preferred crops pills */}
                {farm.preferred_crops && farm.preferred_crops.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[10px] font-semibold uppercase text-neutral-400 mb-1.5">Preferred Crops:</div>
                    <div className="flex flex-wrap gap-1">
                      {farm.preferred_crops.map((pc, i) => (
                        <span key={i} className="text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                          {pc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-200/50 flex items-center justify-between">
                {isSelected ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Currently Selected
                  </span>
                ) : (
                  <span className="text-xs font-medium text-neutral-500 group-hover:text-emerald-700 flex items-center gap-1">
                    Select for Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-[11px] text-neutral-400">NASA Grid: Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card bg-white/95 max-w-lg w-full p-6 border border-white/80 shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-900 mb-1">Register New Farm</h3>
            <p className="text-xs text-neutral-500 mb-5">
              Enter farm properties. NASA Earth data will be automatically retrieved for coordinates.
            </p>

            <form onSubmit={handleCreateFarm} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Farm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malabar Spice Garden"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Location / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kozhikode, Kerala, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 mb-1 font-semibold">Latitude (°N) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 mb-1 font-semibold">Longitude (°E) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 mb-1 font-semibold">Area (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 mb-1 font-semibold">Soil Type *</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Laterite Loam">Laterite Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Alluvial / Clay Loam">Alluvial / Clay Loam</option>
                    <option value="Coastal Sandy">Coastal Sandy</option>
                    <option value="Clay / Heavy Loam">Clay / Heavy Loam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 mb-1 font-semibold">
                    Soil pH (Leave empty if unknown)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.2"
                    value={soilPh}
                    onChange={(e) => setSoilPh(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 mb-1 font-semibold">Irrigation Availability</label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Drip & Canal">Drip & Canal</option>
                    <option value="Rainfed (No Irrigation)">Rainfed (No Irrigation)</option>
                    <option value="Borewell Sprinkler">Borewell Sprinkler</option>
                    <option value="Canal Flood">Canal Flood</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Current Crop</label>
                <input
                  type="text"
                  placeholder="e.g. Rice (Paddy)"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Preferred Crops (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Rice, Cowpea, Green Gram, Banana"
                  value={preferredCrops}
                  onChange={(e) => setPreferredCrops(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Save Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
