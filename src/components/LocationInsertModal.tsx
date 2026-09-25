import React from 'react';
import { X, MapPin } from 'lucide-react';
import { GoogleMapLocationPicker } from './GoogleMapLocationPicker';
import { LocationDetail } from '../types';

interface LocationInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected: (location: LocationDetail) => void;
  initialLocation?: LocationDetail | null;
  title?: string;
  subtitle?: string;
}

export const LocationInsertModal: React.FC<LocationInsertModalProps> = ({
  isOpen,
  onClose,
  onLocationSelected,
  initialLocation,
  title = 'Pinpoint & Insert Location via Google Map',
  subtitle = 'Click on the map, search by address, or select your nearest SPORTIVA Fitting Lab to insert into your support inquiry.',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border-t-4 border-t-[#E31B23] border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#E31B23]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B2545] font-display tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Google Map Component */}
        <div className="flex-1 overflow-y-auto">
          <GoogleMapLocationPicker
            initialLocation={initialLocation}
            onLocationSelected={onLocationSelected}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
