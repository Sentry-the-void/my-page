import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { SportivaLogo } from './SportivaLogo';

interface FooterProps {
  onSelectCategory: (cat: 'order' | 'feedback' | 'general' | 'club') => void;
  onOpenOrderLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenOrderLookup,
}) => {
  return (
    <footer className="bg-[#06182E] text-slate-300 text-xs border-t-2 border-[#E31B23] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info with SPORTIVA Logo */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="mb-2">
              <SportivaLogo className="h-8 sm:h-9 w-auto" variant="light" showTagline />
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Engineering high-performance athletic apparel, seamless compression wear, and ultralight weather membranes for competition and endurance athletes worldwide.
            </p>
            <div className="pt-2 text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E31B23] shrink-0" />
              <span>Backed by the SPORTIVA 30-Day Sweat &amp; Velocity Guarantee</span>
            </div>
          </div>

          {/* Column 1: Client Services */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              <span>Athlete Care</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenOrderLookup}
                  className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>Track Active Order</span>
                  <ArrowUpRight className="w-3 h-3 text-[#E31B23]" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('order')}
                  className="hover:text-white transition-colors text-slate-300"
                >
                  Size Exchanges &amp; Returns
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('feedback')}
                  className="hover:text-white transition-colors text-slate-300"
                >
                  Wear-Test Feedback Lab
                </button>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-white transition-colors text-slate-300">
                  Warranty &amp; Seam Care
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Programs */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              <span>Squad &amp; Teams</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('club')}
                  className="hover:text-white transition-colors text-slate-300"
                >
                  Club Custom Kits
                </button>
              </li>
              <li>
                <a href="#locations-section" className="hover:text-white transition-colors text-slate-300">
                  Flagship Studios (NYC / SEA / LDN)
                </a>
              </li>
              <li>
                <span className="text-slate-400">Elite Athlete Sponsorships</span>
              </li>
              <li>
                <span className="text-slate-400">Retail Partner Inquiries</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Channels */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              <span>Direct Channels</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E31B23]" />
                <span className="font-mono">+1 (800) 546-3842</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>concierge@sportiva.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E31B23] shrink-0 mt-0.5" />
                <span>HQ: 548 Broadway, New York, NY</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} SPORTIVA ATHLETICS INC. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sweat-Test Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
