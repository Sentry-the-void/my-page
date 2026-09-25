import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { FAQS } from '../data/mockData';

interface FaqSectionProps {
  onDirectToInquiry: (category: 'order' | 'feedback' | 'general' | 'club') => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onDirectToInquiry }) => {
  const [openId, setOpenId] = useState<string | null>('sweat-test');
  const [searchFilter, setSearchFilter] = useState('');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section id="faq-section" className="bg-white border-t-4 border-t-[#0B2545] border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-[#0B2545] text-xs font-mono uppercase tracking-wider mb-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
            <span>SPORTIVA Technical Gear Knowledge Base</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2545] font-display tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official guidelines on the 30-day velocity guarantee, bonded seam warranty, and athletic sizing specs.
          </p>
        </div>

        {/* Filter input */}
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search return policies, sizing..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
          />
        </div>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left group gap-4 py-1"
                >
                  <div className="pr-4">
                    <span className="text-[11px] font-mono uppercase text-[#E31B23] font-bold block mb-0.5">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0B2545] group-hover:text-[#E31B23] transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E31B23]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 border-l-2 border-[#E31B23] pl-3 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No matching SPORTIVA questions found for "{searchFilter}".
          </div>
        )}
      </div>

      {/* Bottom CTA for assistance */}
      <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#0B2545]">
            Have a technical gear question not answered here?
          </div>
          <div className="text-xs text-slate-600">
            Our activewear concierges can verify chest/waist measurements and fabric weights.
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDirectToInquiry('order')}
          className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-[#0B2545] text-white rounded-lg hover:bg-[#06182E] border-b-2 border-[#E31B23] transition-all shrink-0"
        >
          Message Concierge Team
        </button>
      </div>
    </section>
  );
};
