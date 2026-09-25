import React, { useState } from 'react';
import { MapPin, Phone, Clock, Compass, CalendarCheck, Check, Navigation, ArrowRight } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { STORE_LOCATIONS } from '../data/mockData';
import { LocationDetail } from '../types';
import { GOOGLE_MAPS_API_KEY } from './GoogleMapLocationPicker';

interface StoreLocationsProps {
  onInsertStudioLocation?: (location: LocationDetail) => void;
}

const STUDIO_COORDS: Record<string, { lat: number; lng: number }> = {
  'New York': { lat: 40.7223, lng: -73.9984 },
  'Seattle': { lat: 47.6080, lng: -122.3352 },
  'London': { lat: 51.5122, lng: -0.1233 },
};

export const StoreLocations: React.FC<StoreLocationsProps> = ({
  onInsertStudioLocation,
}) => {
  const [selectedStudio, setSelectedStudio] = useState<string>('New York');
  const [bookedLocation, setBookedLocation] = useState<string | null>(null);

  const handleBookFitting = (cityName: string) => {
    setBookedLocation(cityName);
    setSelectedStudio(cityName);
    setTimeout(() => {
      setBookedLocation(null);
    }, 3500);
  };

  const handleInsertStudio = (cityName: string) => {
    const store = STORE_LOCATIONS.find((s) => s.city === cityName);
    const coords = STUDIO_COORDS[cityName] || { lat: 40.7223, lng: -73.9984 };
    if (store && onInsertStudioLocation) {
      onInsertStudioLocation({
        formattedAddress: store.address,
        lat: coords.lat,
        lng: coords.lng,
        placeName: store.name,
        source: 'preset_studio',
      });
    }
  };

  const activeCoords = STUDIO_COORDS[selectedStudio] || STUDIO_COORDS['New York'];

  return (
    <section id="locations-section" className="bg-white border-t-4 border-t-[#0B2545] border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8">
      {/* Title & Description */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-[#0B2545] text-xs font-mono uppercase tracking-wider mb-1 font-bold">
            <MapPin className="w-4 h-4 text-[#E31B23]" />
            <span>Interactive Google Maps Studio Locator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2545] font-display tracking-tight">
            SPORTIVA High-Velocity Fitting Studios
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Drop by for in-person size exchanges, treadmill gait testing, personalized sportswear fitting, or insert a studio directly into your order inquiry.
          </p>
        </div>
      </div>

      {bookedLocation && (
        <div className="p-3.5 bg-emerald-50 border-l-4 border-[#E31B23] border border-emerald-200 rounded-r-lg text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in duration-150 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Fitting session request logged for <strong>SPORTIVA {bookedLocation}</strong>. A studio gear concierge will contact you to confirm timing!
          </span>
        </div>
      )}

      {/* Embedded Google Map Showing SPORTIVA Labs */}
      <div className="rounded-xl overflow-hidden border border-slate-300 shadow-xs">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
            <Navigation className="w-4 h-4 text-[#E31B23]" />
            <span>SPORTIVA Global Studio Map: Active City — {selectedStudio}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {Object.keys(STUDIO_COORDS).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedStudio(city)}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                  selectedStudio === city
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-200">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              center={activeCoords}
              zoom={14}
              mapId="sportiva-studios-map"
              gestureHandling="cooperative"
              className="w-full h-full"
            >
              {Object.entries(STUDIO_COORDS).map(([city, coords]) => (
                <AdvancedMarker
                  key={city}
                  position={coords}
                  onClick={() => setSelectedStudio(city)}
                >
                  <div className="relative flex items-center justify-center -translate-y-1/2 cursor-pointer group">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform ${
                        selectedStudio === city
                          ? 'bg-[#E31B23] scale-110 ring-4 ring-[#0B2545]/40'
                          : 'bg-[#0B2545] hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-6 whitespace-nowrap bg-[#0B2545] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase font-mono">
                      SPORTIVA {city}
                    </div>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORE_LOCATIONS.map((loc) => {
          const isSelected = selectedStudio === loc.city;
          return (
            <div
              key={loc.city}
              className={`rounded-lg border p-5 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0B2545] ring-2 ring-[#E31B23] bg-slate-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#0B2545] font-bold">
                    {loc.city} Lab
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Open Today
                  </span>
                </div>

                <h3 className="font-extrabold text-[#0B2545] text-base mb-2">
                  {loc.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Compass className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${loc.phone}`}
                      className="hover:text-[#0B2545] font-bold transition-colors font-mono"
                    >
                      {loc.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{loc.hours}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-[#0B2545] uppercase tracking-wide mb-1.5">
                    Studio Amenities:
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
                    {loc.features.map((feat, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 font-medium">
                        {idx > 0 && <span aria-hidden="true" className="text-[#E31B23]">·</span>}
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                {onInsertStudioLocation && (
                  <button
                    type="button"
                    onClick={() => handleInsertStudio(loc.city)}
                    className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-white bg-[#0B2545] hover:bg-[#06182E] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                    <span>Insert This Location In Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleBookFitting(loc.city)}
                  className="w-full py-2 px-3 text-xs font-bold text-[#0B2545] hover:text-white bg-slate-100 hover:bg-[#0B2545] rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4 text-[#E31B23]" />
                  <span>Book Fitting Session</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
