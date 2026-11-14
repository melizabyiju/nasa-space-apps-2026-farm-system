import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Crosshair, 
  Search, 
  MapPin, 
  Check, 
  Loader2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

// Fix Leaflet default marker icon path issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom farmer-friendly green icon
const greenMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationSelectorProps {
  initialLat: number;
  initialLng: number;
  onLocationConfirmed: (data: {
    lat: number;
    lng: number;
    locationName: string;
    details: {
      village?: string;
      district?: string;
      state?: string;
      country?: string;
    };
  }) => void;
  lang?: 'en' | 'ml';
}

// Map updater helper component
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  initialLat,
  initialLng,
  onLocationConfirmed,
  lang = 'en',
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [locationName, setLocationName] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<{
    village?: string;
    district?: string;
    state?: string;
    country?: string;
  }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);

  // Reverse geocode lat/lng to get village, district, state, country via OpenStreetMap Nominatim
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsReverseGeocoding(true);
    setStatusMessage(null);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': lang === 'ml' ? 'ml,en' : 'en' },
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const village = addr.village || addr.suburb || addr.town || addr.hamlet || addr.neighbourhood || '';
        const district = addr.county || addr.state_district || addr.city || '';
        const state = addr.state || '';
        const country = addr.country || '';

        const parts = [village, district, state, country].filter(Boolean);
        const formatted = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(',') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setLocationName(formatted);
        setLocationDetails({ village, district, state, country });
        setStatusMessage({
          type: 'success',
          text: lang === 'ml' ? 'സ്ഥലം വിജയകരമായി കണ്ടെത്തി.' : 'Location successfully identified.',
        });
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      setLocationName(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Initial reverse geocode on mount
  useEffect(() => {
    reverseGeocode(initialLat, initialLng);
  }, []);

  // Browser Geolocation API ("Use My Current Location")
  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setStatusMessage({
        type: 'error',
        text: lang === 'ml' 
          ? 'നിങ്ങളുടെ ഉപകരണത്തിൽ ജിപിഎസ് ലഭ്യമല്ല. മാപ്പിൽ ക്ലിക്ക് ചെയ്ത് സ്ഥലം തിരഞ്ഞെടുക്കാം.' 
          : 'Geolocation is not supported by your browser. Please click on the map to set location.',
      });
      return;
    }

    setIsGeolocating(true);
    setStatusMessage({
      type: 'info',
      text: lang === 'ml' ? 'നിങ്ങളുടെ കൃഷിയിടത്തിന്റെ ജിപിഎസ് കണ്ടെത്തുന്നു...' : 'Acquiring GPS coordinates from your device...',
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = Number(pos.coords.latitude.toFixed(4));
        const currentLng = Number(pos.coords.longitude.toFixed(4));
        setLat(currentLat);
        setLng(currentLng);
        setIsGeolocating(false);
        reverseGeocode(currentLat, currentLng);
      },
      (err) => {
        setIsGeolocating(false);
        let errorMsg = lang === 'ml' ? 'ലൊക്കേഷൻ കണ്ടെത്താനായില്ല.' : 'Could not detect location.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = lang === 'ml'
            ? 'ലൊക്കേഷൻ അനുമതി നിരസിച്ചു. ബ്രൗസറിൽ ലൊക്കേഷൻ അനുവദിക്കുക അല്ലെങ്കിൽ മാപ്പിൽ ക്ലിക്ക് ചെയ്യുക.'
            : 'Location permission denied. Please allow GPS access in your browser or select on map.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = lang === 'ml'
            ? 'ജിപിഎസ് സിഗ്നൽ ലഭ്യമല്ല. ദയവായി മാപ്പിൽ സ്ഥലം തിരഞ്ഞെടുക്കുക.'
            : 'GPS signal unavailable. Please use the search bar or click on the map.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = lang === 'ml'
            ? 'ജിപിഎസ് കണ്ടെത്താൻ സമയമെടുത്തു. വീണ്ടും ശ്രമിക്കുക.'
            : 'GPS detection timed out. Please try again or search manually.';
        }
        setStatusMessage({ type: 'error', text: errorMsg });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Manual location search via Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusMessage(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const newLat = Number(parseFloat(item.lat).toFixed(4));
          const newLng = Number(parseFloat(item.lon).toFixed(4));
          setLat(newLat);
          setLng(newLng);
          reverseGeocode(newLat, newLng);
        } else {
          setStatusMessage({
            type: 'error',
            text: lang === 'ml' ? 'സ്ഥലം കണ്ടെത്താനായില്ല. മറ്റൊരു പേര് നൽകുക.' : 'Place not found. Try searching a nearby town or district.',
          });
        }
      }
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Drag marker event
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          const roundedLat = Number(newPos.lat.toFixed(4));
          const roundedLng = Number(newPos.lng.toFixed(4));
          setLat(roundedLat);
          setLng(roundedLng);
          reverseGeocode(roundedLat, roundedLng);
        }
      },
    }),
    []
  );

  const handleMapClick = (clickLat: number, clickLng: number) => {
    const roundedLat = Number(clickLat.toFixed(4));
    const roundedLng = Number(clickLng.toFixed(4));
    setLat(roundedLat);
    setLng(roundedLng);
    reverseGeocode(roundedLat, roundedLng);
  };

  const handleConfirm = () => {
    onLocationConfirmed({
      lat,
      lng,
      locationName,
      details: locationDetails,
    });
  };

  return (
    <div className="space-y-3.5">
      {/* Action Row: Use Current Location & Manual Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Use My Current Location GPS Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isGeolocating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
        >
          {isGeolocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
              <span>{lang === 'ml' ? 'ജിപിഎസ് പരിശോധിക്കുന്നു...' : 'Detecting GPS Location...'}</span>
            </>
          ) : (
            <>
              <Crosshair className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ml' ? 'എന്റെ ഇപ്പോഴത്തെ ലൊക്കേഷൻ ഉപയോഗിക്കുക' : 'Use My Current Location'}</span>
            </>
          )}
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'ml' ? 'സ്ഥലം തിരയുക (ഉദാ: പാലക്കാട്)...' : 'Search village, town, or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs transition disabled:opacity-40 shrink-0"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (lang === 'ml' ? 'തിരയുക' : 'Search')}
          </button>
        </form>
      </div>

      {/* Status or Error Banner */}
      {statusMessage && (
        <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          statusMessage.type === 'error'
            ? 'bg-red-50 text-red-900 border border-red-200'
            : statusMessage.type === 'info'
            ? 'bg-blue-50 text-blue-900 border border-blue-200'
            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
        }`}>
          {statusMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Interactive Map with Movable Marker */}
      <div className="rounded-2xl overflow-hidden border border-neutral-300 shadow-inner relative h-56 sm:h-64 w-full z-0">
        <MapContainer
          center={[lat, lng]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[lat, lng]}
            ref={markerRef}
            icon={greenMarkerIcon}
          >
            <Popup>
              <div className="text-xs p-1">
                <strong>{locationName || 'Farm Location'}</strong>
                <div className="text-neutral-500 mt-0.5">
                  {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  {lang === 'ml' ? 'മാർക്കർ മാറ്റി സ്ഥാപിക്കാം' : 'Drag marker to refine exact field position'}
                </div>
              </div>
            </Popup>
          </Marker>
          <RecenterMap lat={lat} lng={lng} />
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>

        {/* Map overlay hint */}
        <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-neutral-700 shadow-xs border border-neutral-200 pointer-events-none">
          {lang === 'ml' ? 'മാപ്പിൽ ക്ലിക്ക് ചെയ്തും മാർക്കർ നീക്കിയും സ്ഥലം തിരഞ്ഞെടുക്കാം' : 'Click map or drag marker to reposition'}
        </div>
      </div>

      {/* Detected Location Card & Confirm Button */}
      <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              {lang === 'ml' ? 'കണ്ടെത്തിയ സ്ഥലം' : 'Detected Farm Address'}
            </span>
            <div className="font-extrabold text-sm text-neutral-900 mt-1 truncate">
              {isReverseGeocoding ? (
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {lang === 'ml' ? 'വിലാസം കണ്ടെത്തുന്നു...' : 'Resolving village & district...'}
                </span>
              ) : (
                locationName || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`
              )}
            </div>

            {/* Geographic Breakdown Pill Row */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-neutral-600 font-medium">
              {locationDetails.village && (
                <span className="bg-neutral-100 px-2 py-0.5 rounded">
                  Village/Town: <strong>{locationDetails.village}</strong>
                </span>
              )}
              {locationDetails.district && (
                <span className="bg-neutral-100 px-2 py-0.5 rounded">
                  District: <strong>{locationDetails.district}</strong>
                </span>
              )}
              {locationDetails.state && (
                <span className="bg-neutral-100 px-2 py-0.5 rounded">
                  State: <strong>{locationDetails.state}</strong>
                </span>
              )}
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                GPS: {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
              </span>
            </div>
          </div>

          {/* Confirm Location Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="self-center px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ml' ? 'സ്ഥലം സ്ഥിരീകരിക്കുക' : 'Confirm Location'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
