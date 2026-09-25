import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { Search, MapPin, LocateFixed, Check, Navigation, Loader2, Building2 } from 'lucide-react';
import { LocationDetail } from '../types';

export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyBcMUQvXRGpikX8xDEd7d2vLG1xerXLd0k';

interface GoogleMapLocationPickerProps {
  initialLocation?: LocationDetail | null;
  onLocationSelected: (location: LocationDetail) => void;
  onClose?: () => void;
  embedded?: boolean;
}

const PRESET_STUDIOS = [
  {
    name: 'SPORTIVA SoHo Lab (New York)',
    address: '548 Broadway, New York, NY 10012',
    lat: 40.7223,
    lng: -73.9984,
  },
  {
    name: 'SPORTIVA Northwest Studio (Seattle)',
    address: '1410 4th Ave, Seattle, WA 98101',
    lat: 47.6080,
    lng: -122.3352,
  },
  {
    name: 'SPORTIVA Covent Garden (London)',
    address: '22 Floral Street, London WC2E 9DS, UK',
    lat: 51.5122,
    lng: -0.1233,
  },
];

// Inner controller component that uses useMap hook to manage camera and geocoding
const MapController: React.FC<{
  targetCoords: { lat: number; lng: number };
  onMapClick: (e: google.maps.MapMouseEvent) => void;
}> = ({ targetCoords, onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(targetCoords);
    }
  }, [map, targetCoords]);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', onMapClick);
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, onMapClick]);

  return null;
};

export const GoogleMapLocationPicker: React.FC<GoogleMapLocationPickerProps> = ({
  initialLocation,
  onLocationSelected,
  onClose,
  embedded = false,
}) => {
  const defaultCoords = initialLocation
    ? { lat: initialLocation.lat, lng: initialLocation.lng }
    : { lat: 40.7223, lng: -73.9984 }; // Default to New York SoHo Lab

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(defaultCoords);
  const [formattedAddress, setFormattedAddress] = useState<string>(
    initialLocation?.formattedAddress || '548 Broadway, New York, NY 10012'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | undefined>(
    initialLocation?.placeName || 'SPORTIVA SoHo Performance Lab'
  );
  const [sourceType, setSourceType] = useState<LocationDetail['source']>(
    initialLocation?.source || 'preset_studio'
  );
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Reverse geocode coordinate into human-readable address
  const reverseGeocode = useCallback((lat: number, lng: number, placeName?: string, source: LocationDetail['source'] = 'map_pin') => {
    if (!window.google?.maps?.Geocoder) return;

    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    setIsGeocoding(true);
    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        setIsGeocoding(false);
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          setFormattedAddress(results[0].formatted_address);
          setSelectedPlaceName(placeName || results[0].formatted_address.split(',')[0]);
          setSourceType(source);
        } else {
          setFormattedAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          setSelectedPlaceName(placeName || 'Pinned Location');
          setSourceType(source);
        }
      }
    );
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCurrentCoords({ lat, lng });
      reverseGeocode(lat, lng, 'Selected Map Location', 'map_pin');
    }
  }, [reverseGeocode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!geocoderRef.current && window.google?.maps?.Geocoder) {
      geocoderRef.current = new google.maps.Geocoder();
    }
    if (!geocoderRef.current) return;

    setIsGeocoding(true);
    geocoderRef.current.geocode({ address: searchQuery }, (results, status) => {
      setIsGeocoding(false);
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const loc = results[0].geometry.location;
        const lat = loc.lat();
        const lng = loc.lng();
        setCurrentCoords({ lat, lng });
        setFormattedAddress(results[0].formatted_address);
        setSelectedPlaceName(results[0].formatted_address.split(',')[0]);
        setSourceType('search');
      } else {
        alert('Location not found. Please try another address or landmark.');
      }
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoords({ lat, lng });
        reverseGeocode(lat, lng, 'Your Current Location', 'current_location');
      },
      () => {
        setIsLocating(false);
        alert('Could not retrieve your GPS location. Please allow location permissions or search for an address.');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectPresetStudio = (studio: typeof PRESET_STUDIOS[0]) => {
    setCurrentCoords({ lat: studio.lat, lng: studio.lng });
    setFormattedAddress(studio.address);
    setSelectedPlaceName(studio.name);
    setSourceType('preset_studio');
  };

  const handleConfirmLocation = () => {
    const detail: LocationDetail = {
      formattedAddress,
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      placeName: selectedPlaceName,
      source: sourceType,
    };
    onLocationSelected(detail);
    if (onClose) onClose();
  };

  return (
    <div className={`flex flex-col ${embedded ? 'w-full' : 'h-full max-h-[85vh]'}`}>
      {/* Top Search & Presets Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address, landmark, or zip code to pin..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isGeocoding}
            className="px-4 py-2 bg-[#0B2545] hover:bg-[#06182E] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            {isGeocoding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <span>Search Map</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-[#0B2545] border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            title="Locate my position via GPS"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#E31B23]" />
            ) : (
              <LocateFixed className="w-4 h-4 text-[#E31B23]" />
            )}
            <span className="hidden sm:inline">My GPS</span>
          </button>
        </form>

        {/* Quick Studio Presets */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wide flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#E31B23]" />
            <span>SPORTIVA Labs:</span>
          </span>
          {PRESET_STUDIOS.map((studio) => {
            const isSelected = selectedPlaceName === studio.name;
            return (
              <button
                key={studio.name}
                type="button"
                onClick={() => handleSelectPresetStudio(studio)}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 font-semibold ${
                  isSelected
                    ? 'bg-[#0B2545] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{studio.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Google Map Canvas */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 bg-slate-200 overflow-hidden">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={defaultCoords}
            defaultZoom={15}
            mapId="sportiva-location-picker"
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
          >
            {/* Map Click & Pan Controller */}
            <MapController targetCoords={currentCoords} onMapClick={handleMapClick} />

            {/* Custom High-Velocity Marker for Selected Position */}
            <AdvancedMarker position={currentCoords}>
              <div className="relative flex items-center justify-center -translate-y-1/2 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#0B2545] border-2 border-white shadow-xl flex items-center justify-center ring-4 ring-[#E31B23]/40 animate-bounce">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-6 whitespace-nowrap bg-[#0B2545] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase font-mono">
                  Selected Pin
                </div>
              </div>
            </AdvancedMarker>
          </Map>
        </APIProvider>

        {/* Map overlay helper notice */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-300 rounded px-2.5 py-1 text-[11px] font-semibold text-[#0B2545] shadow-xs flex items-center gap-1.5 pointer-events-none">
          <Navigation className="w-3.5 h-3.5 text-[#E31B23]" />
          <span>Click anywhere on the map to pin address</span>
        </div>
      </div>

      {/* Selected Address Preview & Confirmation Card */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto text-left">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
            <span>Target Location To Insert</span>
            <span className="text-slate-400 font-mono">
              ({currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)})
            </span>
          </div>
          <div className="text-sm font-bold text-[#0B2545] mt-0.5 max-w-lg line-clamp-1">
            {selectedPlaceName ? `${selectedPlaceName} — ` : ''}
            {formattedAddress}
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirmLocation}
            className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-black italic uppercase tracking-wider text-white bg-[#0B2545] hover:bg-[#06182E] active:scale-98 border-b-2 border-[#E31B23] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4 text-[#E31B23]" />
            <span>Insert Location Into Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};
