import React from 'react';
import { PhoneCall, MessageSquareText, ShieldCheck, Clock, Zap } from 'lucide-react';

interface SupportChannelsBannerProps {
  onSelectInquiryType: (category: 'order' | 'feedback' | 'general' | 'club') => void;
}

export const SupportChannelsBanner: React.FC<SupportChannelsBannerProps> = ({
  onSelectInquiryType,
}) => {
  return (
    <section className="bg-[#0B2545] text-white py-9 px-4 sm:px-6 lg:px-8 border-b-2 border-[#E31B23] shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm divide-y md:divide-y-0 md:divide-x divide-slate-700/60">
          {/* Channel 1 */}
          <div className="pt-4 md:pt-0 md:pr-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <Clock className="w-4 h-4 text-[#E31B23]" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-200 font-mono">
                  Concierge Dispatch
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-1 font-display">
                Under 2 Hours Turnaround
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Dedicated activewear fit &amp; dispatch team on duty 7 days a week. Priority expedited routing for upcoming race dates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectInquiryType('order')}
              className="mt-4 text-xs font-bold text-white hover:text-[#E31B23] text-left transition-colors flex items-center gap-1.5 group"
            >
              <span>Order &amp; Tracking Inquiries</span>
              <span className="group-hover:translate-x-1 transition-transform text-[#E31B23]">→</span>
            </button>
          </div>

          {/* Channel 2 */}
          <div className="pt-4 md:pt-0 md:px-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#E31B23]" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-200 font-mono">
                  Sweat &amp; Velocity Guarantee
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-1 font-display">
                30-Day Wear-Test Trial
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Train in it, sweat in it, wash it. If the ergonomic cut or fabric doesn't excel, return or exchange with prepaid shipping.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectInquiryType('order')}
              className="mt-4 text-xs font-bold text-white hover:text-[#E31B23] text-left transition-colors flex items-center gap-1.5 group"
            >
              <span>Start Size Exchange</span>
              <span className="group-hover:translate-x-1 transition-transform text-[#E31B23]">→</span>
            </button>
          </div>

          {/* Channel 3 */}
          <div className="pt-4 md:pt-0 md:px-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <MessageSquareText className="w-4 h-4 text-[#E31B23]" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-200 font-mono">
                  SPORTIVA R&amp;D Lab
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-1 font-display">
                Direct to Design Team
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Your wear-test notes, seam durability reports, and fit feedback go straight to our technical product development crew.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectInquiryType('feedback')}
              className="mt-4 text-xs font-bold text-white hover:text-[#E31B23] text-left transition-colors flex items-center gap-1.5 group"
            >
              <span>Submit Performance Feedback</span>
              <span className="group-hover:translate-x-1 transition-transform text-[#E31B23]">→</span>
            </button>
          </div>

          {/* Channel 4 */}
          <div className="pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <PhoneCall className="w-4 h-4 text-[#E31B23]" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-200 font-mono">
                  Athlete Hotline
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-1 font-mono tracking-tight">
                +1 (800) 546-3842
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Mon – Sat: 7:00 – 19:00 EST. In-person fitting appointments at SoHo, Seattle &amp; London labs.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>Priority Race-Day Dispatch Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
