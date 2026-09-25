import React from 'react';
import { PackageSearch, ShoppingBag } from 'lucide-react';
import { SportivaLogo } from './SportivaLogo';

interface HeaderProps {
  onOpenOrderLookup: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderLookup,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: SPORTIVA Logo Brand Zone fitting the user's uploaded logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('contact');
            }}
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            aria-label="SPORTIVA Sports Apparel Home"
          >
            <SportivaLogo className="h-8 sm:h-10 w-auto" variant="color" />
          </a>

          {/* Zone 2: Clean text navigation links with dynamic red active accent */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold tracking-wide">
            <button
              type="button"
              onClick={() => onTabChange('contact')}
              className={`transition-all py-1 relative ${
                activeTab === 'contact'
                  ? 'text-[#0B2545] font-bold'
                  : 'text-slate-600 hover:text-[#0B2545]'
              }`}
            >
              Contact &amp; Inquiries
              {activeTab === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31B23]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('faq')}
              className={`transition-all py-1 relative ${
                activeTab === 'faq'
                  ? 'text-[#0B2545] font-bold'
                  : 'text-slate-600 hover:text-[#0B2545]'
              }`}
            >
              Apparel FAQ
              {activeTab === 'faq' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31B23]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('locations')}
              className={`transition-all py-1 relative ${
                activeTab === 'locations'
                  ? 'text-[#0B2545] font-bold'
                  : 'text-slate-600 hover:text-[#0B2545]'
              }`}
            >
              Fitting Studios
              {activeTab === 'locations' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31B23]" />
              )}
            </button>
            <a
              href="#guarantee"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('faq');
              }}
              className="text-slate-600 hover:text-[#0B2545] transition-colors py-1 flex items-center gap-1.5"
            >
              <span>Sweat &amp; Velocity Guarantee</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenOrderLookup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0B2545] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Track your SPORTIVA athletic gear shipment"
            >
              <PackageSearch className="w-4 h-4 text-[#E31B23]" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert('Your SPORTIVA shopping bag is currently empty. Start an inquiry below if you need item assistance!');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0B2545] hover:bg-[#06182E] active:scale-98 rounded-lg transition-all whitespace-nowrap shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Bag (0)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
