/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SupportChannelsBanner } from './components/SupportChannelsBanner';
import { ContactForm } from './components/ContactForm';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { OrderLookupModal } from './components/OrderLookupModal';
import { FaqSection } from './components/FaqSection';
import { StoreLocations } from './components/StoreLocations';
import { Footer } from './components/Footer';
import { InquiryCategory, SubmittedTicket, TrackableOrder, LocationDetail } from './types';
import { Package, Sparkles, Shield, Clock, Search, MapPin, Zap } from 'lucide-react';
import { LocationInsertModal } from './components/LocationInsertModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'locations'>('contact');
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>('order');
  const [activeTicket, setActiveTicket] = useState<SubmittedTicket | null>(null);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [attachedOrder, setAttachedOrder] = useState<TrackableOrder | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationDetail | null>(null);
  const [isGlobalLocationModalOpen, setIsGlobalLocationModalOpen] = useState(false);

  const handleSuccessfulSubmit = (ticket: SubmittedTicket) => {
    setActiveTicket(ticket);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAfterSubmit = () => {
    setActiveTicket(null);
    setAttachedOrder(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromBanner = (cat: InquiryCategory) => {
    setSelectedCategory(cat);
    setActiveTicket(null);
    setActiveTab('contact');
    const formEl = document.getElementById('contact-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSelectedFromLookup = (order: TrackableOrder) => {
    setAttachedOrder(order);
    setSelectedCategory('order');
    setActiveTicket(null);
    setActiveTab('contact');
    const formEl = document.getElementById('contact-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B2545] selection:bg-[#0B2545] selection:text-white">
      {/* Top Banner Notice with Racing Red & Navy Speed Styling */}
      <div className="bg-[#06182E] text-slate-200 text-xs py-2.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-bold text-white tracking-wide uppercase font-mono">
          <Zap className="w-3.5 h-3.5 text-[#E31B23]" />
          <span>SPORTIVA 30-DAY VELOCITY GUARANTEE:</span>
        </span>
        <span className="text-slate-300">
          Field-test on track, trail, or treadmill. Free size exchanges &amp; returns within 30 days.
        </span>
      </div>

      {/* Header conforming to Top Bar Contract with SPORTIVA logo */}
      <Header
        onOpenOrderLookup={() => setIsLookupModalOpen(true)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab as 'contact' | 'faq' | 'locations');
          if (tab === 'contact') {
            setActiveTicket(null);
          }
        }}
      />

      {/* Support Channels Banner */}
      <SupportChannelsBanner onSelectInquiryType={handleSelectCategoryFromBanner} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section Designed specifically to fit the SPORTIVA Logo */}
        <div className="mb-10 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs border-l-4 border-l-[#E31B23]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0B2545] font-bold mb-3">
                  <span className="px-2 py-0.5 bg-red-100 text-[#E31B23] rounded font-mono font-bold text-[10px]">
                    OFFICIAL ATHLETE CARE
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600 font-medium">Velocity Concierge Live</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-display tracking-tight leading-[1.1] text-balance">
                  Engineered For Velocity. <br />
                  <span className="text-[#E31B23]">Supported With Precision.</span>
                </h1>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Whether you require an immediate size exchange under our 30-Day Sweat &amp; Velocity Guarantee, shipment dispatch status, custom club team kits, or wear-test feedback directly to our product designers — our sports apparel concierge is at your service.
                </p>
              </div>

              {/* Athletic Proof Metrics */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 flex items-center gap-1 mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#E31B23]" />
                    <span className="font-semibold text-slate-700">Concierge Response</span>
                  </div>
                  <div className="font-black text-[#0B2545] font-mono text-base sm:text-lg tabular-nums">
                    &lt; 2 Hours
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 flex items-center gap-1 mb-0.5">
                    <Shield className="w-3.5 h-3.5 text-[#0B2545]" />
                    <span className="font-semibold text-slate-700">Sweat-Test Trial</span>
                  </div>
                  <div className="font-black text-[#0B2545] font-mono text-base sm:text-lg tabular-nums">
                    30 Days
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                    <span className="font-semibold text-slate-700">Fitting Studios</span>
                  </div>
                  <div className="font-black text-[#0B2545] font-mono text-base sm:text-lg tabular-nums">
                    NYC · SEA · LDN
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#06182E] overflow-hidden">
              <img
                src="/src/assets/images/sportiva_hero_athletics_1790344201274.jpg"
                alt="SPORTIVA high-performance technical sports apparel"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06182E]/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#06182E]/70" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#E31B23] font-bold block">
                  Field Tested &amp; Certified
                </span>
                <span className="font-extrabold text-sm text-white">
                  SPORTIVA Velocity-X Compression &amp; Aero Systems
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-8 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('contact');
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'contact'
                  ? 'bg-[#0B2545] text-white shadow-sm ring-1 ring-[#E31B23]'
                  : 'bg-white text-slate-700 hover:text-[#0B2545] border border-slate-200'
              }`}
            >
              <Package className="w-4 h-4 text-[#E31B23]" />
              <span>Full Contact &amp; Inquiry Form</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'faq'
                  ? 'bg-[#0B2545] text-white shadow-sm ring-1 ring-[#E31B23]'
                  : 'bg-white text-slate-700 hover:text-[#0B2545] border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#E31B23]" />
              <span>Apparel FAQ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('locations')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'locations'
                  ? 'bg-[#0B2545] text-white shadow-sm ring-1 ring-[#E31B23]'
                  : 'bg-white text-slate-700 hover:text-[#0B2545] border border-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#E31B23]" />
              <span>Fitting Studios</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGlobalLocationModalOpen(true)}
              className="text-xs font-bold text-[#0B2545] hover:text-[#E31B23] bg-white hover:bg-slate-100 border border-slate-300 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Pin delivery or fitting location on Google Map"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>Insert Location (Map)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLookupModalOpen(true)}
              className="text-xs font-bold text-[#0B2545] hover:text-[#E31B23] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>Fast-Track Order Lookup</span>
            </button>
          </div>
        </div>

        {/* View Switching */}
        {activeTab === 'contact' && (
          <div id="contact-form-section">
            {activeTicket ? (
              <SubmissionSuccess
                ticket={activeTicket}
                onReset={handleResetAfterSubmit}
                onViewFaq={() => setActiveTab('faq')}
              />
            ) : (
              <ContactForm
                onSuccessfulSubmit={handleSuccessfulSubmit}
                initialOrderToAttach={attachedOrder}
                onClearAttachedOrder={() => setAttachedOrder(null)}
                selectedCategoryProp={selectedCategory}
                initialLocationProp={selectedLocation}
              />
            )}
          </div>
        )}

        {activeTab === 'faq' && (
          <FaqSection
            onDirectToInquiry={(category) => {
              setSelectedCategory(category);
              setActiveTab('contact');
              setActiveTicket(null);
            }}
          />
        )}

        {activeTab === 'locations' && (
          <StoreLocations
            onInsertStudioLocation={(loc) => {
              setSelectedLocation(loc);
              setActiveTab('contact');
              setActiveTicket(null);
              const formEl = document.getElementById('contact-form-section');
              if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}
      </main>

      {/* Global Location Insert Modal */}
      <LocationInsertModal
        isOpen={isGlobalLocationModalOpen}
        onClose={() => setIsGlobalLocationModalOpen(false)}
        onLocationSelected={(loc) => {
          setSelectedLocation(loc);
          setIsGlobalLocationModalOpen(false);
          setActiveTab('contact');
          const formEl = document.getElementById('contact-form-section');
          if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        initialLocation={selectedLocation}
      />

      {/* Order Lookup Modal Dialog */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        onSelectOrderForInquiry={handleOrderSelectedFromLookup}
      />

      {/* Sportswear Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('contact');
          setActiveTicket(null);
          const formEl = document.getElementById('contact-form-section');
          if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenOrderLookup={() => setIsLookupModalOpen(true)}
      />
    </div>
  );
}
