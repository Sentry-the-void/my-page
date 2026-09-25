import React, { useState } from 'react';
import { X, Search, AlertCircle, ArrowRight, Truck } from 'lucide-react';
import { SAMPLE_ORDERS } from '../data/mockData';
import { TrackableOrder } from '../types';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrderForInquiry: (order: TrackableOrder) => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectOrderForInquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderResult, setOrderResult] = useState<TrackableOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (queryOverride?: string) => {
    const q = (queryOverride || searchQuery).trim().toUpperCase();
    if (!q) {
      setErrorMsg('Please enter an order number (e.g. SPT-84210).');
      return;
    }
    setErrorMsg('');
    setHasSearched(true);

    const found = SAMPLE_ORDERS[q];
    if (found) {
      setOrderResult(found);
    } else {
      setOrderResult(null);
    }
  };

  const handleQuickFill = (orderCode: string) => {
    setSearchQuery(orderCode);
    handleSearch(orderCode);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border-t-4 border-t-[#E31B23] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-[#E31B23]" />
            <h2 className="text-base font-extrabold text-[#0B2545] font-display tracking-tight">
              SPORTIVA Gear Dispatch &amp; Tracking Lookup
            </h2>
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

        {/* Content */}
        <div className="p-6">
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Enter your <strong>SPORTIVA</strong> apparel order number to inspect delivery progress, technical garment details, or attach directly to an exchange request.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. SPT-84210"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#06182E] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
            >
              Lookup
            </button>
          </form>

          {/* Preset order numbers helper */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Sample Active Orders:</span>
            {['SPT-84210', 'SPT-72911', 'SPT-90432'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleQuickFill(code)}
                className="font-mono text-[#0B2545] bg-slate-100 hover:bg-slate-200 hover:text-[#E31B23] px-2 py-0.5 rounded transition-colors text-xs font-bold"
              >
                {code}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-[#E31B23] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Search Result */}
          {hasSearched && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              {orderResult ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Order Ref</span>
                        <div className="text-sm font-black text-[#0B2545] font-mono">
                          {orderResult.orderNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-500 font-bold">Status</span>
                        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                          {orderResult.status}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Athlete:</span>
                        <span className="font-bold text-slate-900">{orderResult.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span>{orderResult.orderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carrier &amp; Tracking:</span>
                        <span className="font-mono font-medium text-slate-900">{orderResult.carrier} ({orderResult.trackingNumber})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Timeline:</span>
                        <span className="font-bold text-[#0B2545]">{orderResult.estimatedDelivery}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="text-[11px] font-bold text-[#0B2545] mb-1.5 uppercase tracking-wide">
                        SPORTIVA Items in this dispatch:
                      </div>
                      <div className="space-y-1.5">
                        {orderResult.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs flex items-center justify-between bg-white p-2 rounded border border-slate-200"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <div className="text-slate-500 text-[11px]">
                                Size: {item.size} · {item.color} · SKU: {item.sku}
                              </div>
                            </div>
                            <div className="font-bold text-[#0B2545] tabular-nums">
                              ${item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectOrderForInquiry(orderResult);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-[#0B2545] hover:bg-[#06182E] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Attach Order to Contact Form for Help</span>
                    <ArrowRight className="w-4 h-4 text-[#E31B23]" />
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Order record not found:</span> Ensure your order code includes the prefix (e.g. <code>SPT-84210</code>). You can still proceed with manual entry on the contact form!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
