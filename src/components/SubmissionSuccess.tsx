import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Download, ArrowLeft, Clock, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { SubmittedTicket } from '../types';
import { SportivaLogo } from './SportivaLogo';

interface SubmissionSuccessProps {
  ticket: SubmittedTicket;
  onReset: () => void;
  onViewFaq: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  ticket,
  onReset,
  onViewFaq,
}) => {
  const [copied, setCopied] = useState(false);
  const { data, ticketId, submittedAt, estimatedResolutionHours, assignedTeam } = ticket;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReceipt = () => {
    const textContent = `
==================================================
SPORTIVA ATHLETICS - ATHLETE SUPPORT TICKET
==================================================
Ticket Reference: ${ticketId}
Submitted: ${submittedAt}
Estimated Response: Within ${estimatedResolutionHours} hours
Assigned Unit: ${assignedTeam}

ATHLETE DETAILS
--------------------------------------------------
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Preferred Contact: ${data.preferredContact.toUpperCase()}
Priority: ${data.urgent ? 'HIGH (Imminent Race / Event Timeline)' : 'Standard'}
${data.location ? `Google Map Location: ${data.location.placeName ? `${data.location.placeName} - ` : ''}${data.location.formattedAddress} [Lat: ${data.location.lat}, Lng: ${data.location.lng}]` : ''}

INQUIRY DETAILS
--------------------------------------------------
Category: ${data.category.toUpperCase()}
Subject: ${data.subject}

${data.category === 'order' ? `
ORDER INFORMATION
Order Number: ${data.orderNumber}
Order Date: ${data.orderDate || 'N/A'}
Item Name: ${data.apparelItemName || 'General package'}
Issue Type: ${data.orderIssue}
Desired Resolution: ${data.desiredResolution}
` : ''}

${data.category === 'feedback' ? `
SPORTIVA PRODUCT ASSESSMENT
Feedback Focus: ${data.feedbackArea}
Rating: ${data.rating} / 5 Stars
Fit Perception: ${data.fitPerception}
Recommendation: ${data.wouldRecommend}
` : ''}

ATHLETE MESSAGE
--------------------------------------------------
${data.message}

${data.attachedFileName ? `Attachment: ${data.attachedFileName} (${data.attachedFileSize})` : 'Attachment: None'}

--------------------------------------------------
SPORTIVA Performance Wear Concierge:
support@sportiva.com | +1 (800) 546-3842
Fitting Labs in New York, Seattle & London.
==================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPORTIVA-Ticket-${ticketId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border-t-4 border-t-[#E31B23] border border-slate-200 rounded-xl shadow-sm p-6 sm:p-10 max-w-3xl mx-auto my-6 animate-in fade-in-50 duration-300">
      {/* Top Success Banner with SPORTIVA Logo */}
      <div className="text-center pb-8 border-b border-slate-100">
        <div className="flex justify-center mb-5">
          <SportivaLogo className="h-9 w-auto" variant="color" />
        </div>

        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="text-xs uppercase font-mono tracking-widest text-[#E31B23] font-bold mb-1">
          Transmission Confirmed
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-display tracking-tight">
          Your Inquiry Has Been Logged
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
          Thank you, <strong className="text-slate-900">{data.fullName}</strong>. A confirmation receipt has been dispatched to{' '}
          <strong className="text-slate-900">{data.email}</strong>.
        </p>

        {/* Ticket Bar */}
        <div className="mt-5 inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg">
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
              SPORTIVA Support Reference Code
            </div>
            <div className="font-mono text-base font-black text-[#0B2545] tracking-tight">
              {ticketId}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyTicket}
            className="p-2 text-slate-600 hover:text-[#0B2545] hover:bg-slate-200 rounded-md transition-colors text-xs flex items-center gap-1 font-bold"
            title="Copy reference ticket"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-xs font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#E31B23]" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="py-6 space-y-5 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Clock className="w-4 h-4 text-[#E31B23]" />
              <span className="font-bold uppercase tracking-wider text-slate-700">Estimated Turnaround</span>
            </div>
            <div className="font-black text-[#0B2545] text-base">
              Within {estimatedResolutionHours} Hours
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {data.urgent
                ? 'High Priority Flag: Imminent Race / Competition Timeline.'
                : 'Processed through SPORTIVA athlete priority queue.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-[#0B2545]" />
              <span className="font-bold uppercase tracking-wider text-slate-700">Assigned Department</span>
            </div>
            <div className="font-black text-[#0B2545] text-base">
              {assignedTeam}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct sportswear specialists reviewing your gear notes.
            </p>
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="text-xs uppercase font-mono tracking-wider text-[#0B2545] font-bold mb-3 flex items-center justify-between">
            <span>Inquiry Overview</span>
            <span className="text-[10px] text-slate-400 font-mono">ENCRYPTED</span>
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div>
              <dt className="text-slate-500">Inquiry Classification:</dt>
              <dd className="font-bold text-[#0B2545] uppercase">
                {data.category === 'order'
                  ? 'Order & Shipping Support'
                  : data.category === 'feedback'
                  ? 'Product Feedback & Wear-Test'
                  : data.category === 'club'
                  ? 'Club & Bulk Team Order'
                  : 'General Concierge'}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">Preferred Channel:</dt>
              <dd className="font-bold text-slate-900 uppercase">
                {data.preferredContact} ({data.email})
              </dd>
            </div>

            {data.category === 'order' && (
              <>
                <div>
                  <dt className="text-slate-500">Order Reference:</dt>
                  <dd className="font-mono font-bold text-[#0B2545]">{data.orderNumber}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Requested Outcome:</dt>
                  <dd className="font-bold text-slate-900 capitalize">
                    {data.desiredResolution.replace('_', ' ')}
                  </dd>
                </div>
              </>
            )}

            {data.category === 'feedback' && (
              <>
                <div>
                  <dt className="text-slate-500">Performance Rating:</dt>
                  <dd className="font-bold text-[#E31B23]">
                    {'★'.repeat(data.rating)}{'☆'.repeat(5 - data.rating)} ({data.rating}/5)
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Fit Impression:</dt>
                  <dd className="font-bold text-slate-900 capitalize">
                    {data.fitPerception.replace('_', ' ')}
                  </dd>
                </div>
              </>
            )}

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <dt className="text-slate-500 mb-0.5">Subject:</dt>
              <dd className="font-bold text-[#0B2545]">{data.subject}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-slate-500 mb-0.5">Your Message:</dt>
              <dd className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 italic leading-relaxed">
                "{data.message}"
              </dd>
            </div>

            {data.location && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <dt className="text-slate-500 mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>Inserted Location (Google Maps):</span>
                </dt>
                <dd className="text-xs font-bold text-[#0B2545] bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span>{data.location.placeName ? `${data.location.placeName} — ` : ''}</span>
                  <span>{data.location.formattedAddress}</span>
                  <div className="text-[10px] text-slate-400 font-mono font-normal mt-0.5">
                    Coordinates: {data.location.lat.toFixed(5)}, {data.location.lng.toFixed(5)} ({data.location.source.replace('_', ' ')})
                  </div>
                </dd>
              </div>
            )}

            {data.attachedFileName && (
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Attached File:</dt>
                <dd className="font-semibold text-slate-800">
                  {data.attachedFileName} ({data.attachedFileSize})
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-[#0B2545] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#E31B23]" />
          <span>Submit Another Message</span>
        </button>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onViewFaq}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#0B2545] hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#0B2545]" />
            <span>Apparel FAQs</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0B2545] hover:bg-[#06182E] rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#E31B23]" />
            <span>Download Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
