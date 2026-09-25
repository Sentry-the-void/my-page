import React, { useState, useRef, useEffect } from 'react';
import {
  Package,
  Sparkles,
  Users,
  HelpCircle,
  UploadCloud,
  FileCheck,
  X,
  AlertCircle,
  Star,
  Send,
  Loader2,
  Check,
  RefreshCw,
  Info,
  Zap,
  MapPin,
} from 'lucide-react';
import {
  ContactFormData,
  FormErrors,
  InquiryCategory,
  SubmittedTicket,
  TrackableOrder,
  LocationDetail,
} from '../types';
import { SAMPLE_ORDER_FORM, SAMPLE_FEEDBACK_FORM } from '../data/mockData';
import { LocationInsertModal } from './LocationInsertModal';

interface ContactFormProps {
  onSuccessfulSubmit: (ticket: SubmittedTicket) => void;
  initialOrderToAttach?: TrackableOrder | null;
  onClearAttachedOrder?: () => void;
  selectedCategoryProp?: InquiryCategory;
  initialLocationProp?: LocationDetail | null;
}

const INITIAL_FORM: ContactFormData = {
  fullName: '',
  email: '',
  phone: '',
  preferredContact: 'email',
  category: 'order',
  subject: '',
  message: '',
  urgent: false,
  newsletterOptIn: false,
  attachedFileName: undefined,
  attachedFileSize: undefined,

  // Order Inquiries
  orderNumber: '',
  orderDate: '',
  orderIssue: 'return_exchange',
  apparelItemName: '',
  desiredResolution: 'exchange_size',

  // Feedback fields
  feedbackArea: 'sizing_fit',
  rating: 0,
  fitPerception: 'true_to_size',
  wouldRecommend: 'yes',
};

export const ContactForm: React.FC<ContactFormProps> = ({
  onSuccessfulSubmit,
  initialOrderToAttach,
  onClearAttachedOrder,
  selectedCategoryProp,
  initialLocationProp,
}) => {
  const [formData, setFormData] = useState<ContactFormData>(() => {
    if (initialOrderToAttach) {
      return {
        ...INITIAL_FORM,
        category: 'order',
        orderNumber: initialOrderToAttach.orderNumber,
        fullName: initialOrderToAttach.customerName,
        apparelItemName: initialOrderToAttach.items.map((i) => i.name).join(', '),
        subject: `Assistance regarding order ${initialOrderToAttach.orderNumber}`,
        location: initialLocationProp || undefined,
      };
    }
    if (selectedCategoryProp) {
      return {
        ...INITIAL_FORM,
        category: selectedCategoryProp,
        location: initialLocationProp || undefined,
      };
    }
    return {
      ...INITIAL_FORM,
      location: initialLocationProp || undefined,
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if props change
  useEffect(() => {
    if (initialOrderToAttach) {
      setFormData((prev) => ({
        ...prev,
        category: 'order',
        orderNumber: initialOrderToAttach.orderNumber,
        fullName: prev.fullName || initialOrderToAttach.customerName,
        apparelItemName: initialOrderToAttach.items.map((i) => i.name).join(', '),
        subject: prev.subject || `Inquiry for Order ${initialOrderToAttach.orderNumber}`,
      }));
    }
  }, [initialOrderToAttach]);

  useEffect(() => {
    if (selectedCategoryProp) {
      setFormData((prev) => ({ ...prev, category: selectedCategoryProp }));
    }
  }, [selectedCategoryProp]);

  useEffect(() => {
    if (initialLocationProp) {
      setFormData((prev) => ({ ...prev, location: initialLocationProp }));
    }
  }, [initialLocationProp]);

  // Validation function
  const validateField = (name: keyof ContactFormData, value: unknown): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Full name is required (min 2 characters).';
        }
        return undefined;

      case 'email': {
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'Email address is required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please provide a valid email format (e.g. runner@sportiva.com).';
        }
        return undefined;
      }

      case 'phone': {
        if (value && typeof value === 'string' && value.trim()) {
          const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
          if (!phoneRegex.test(value.trim())) {
            return 'Please enter a valid phone number (or leave blank).';
          }
        }
        return undefined;
      }

      case 'orderNumber':
        if (formData.category === 'order') {
          if (!value || typeof value !== 'string' || value.trim().length < 4) {
            return 'Please enter a valid SPORTIVA order number (e.g. SPT-84210).';
          }
        }
        return undefined;

      case 'rating':
        if (formData.category === 'feedback') {
          if (!value || typeof value !== 'number' || value < 1) {
            return 'Please select a performance rating (1 to 5 stars).';
          }
        }
        return undefined;

      case 'subject':
        if (!value || typeof value !== 'string' || value.trim().length < 4) {
          return 'Subject is required (minimum 4 characters).';
        }
        return undefined;

      case 'message':
        if (!value || typeof value !== 'string' || value.trim().length < 15) {
          return 'Please provide a detailed message (minimum 15 characters).';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    const fieldsToValidate: (keyof ContactFormData)[] = [
      'fullName',
      'email',
      'phone',
      'subject',
      'message',
    ];

    if (formData.category === 'order') {
      fieldsToValidate.push('orderNumber');
    }
    if (formData.category === 'feedback') {
      fieldsToValidate.push('rating');
    }

    fieldsToValidate.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) {
        newErrors[field as keyof FormErrors] = err;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (touched[name]) {
      const fieldError = validateField(
        name as keyof ContactFormData,
        type === 'checkbox' ? checked : value
      );
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(
      name as keyof ContactFormData,
      type === 'checkbox' ? checked : value
    );
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleCategorySwitch = (category: InquiryCategory) => {
    setFormData((prev) => ({ ...prev, category }));
    setErrors((prev) => {
      const updated = { ...prev };
      if (category !== 'order') delete updated.orderNumber;
      if (category !== 'feedback') delete updated.rating;
      return updated;
    });
  };

  const handleQuickFillOrderSample = () => {
    setFormData((prev) => ({
      ...prev,
      ...SAMPLE_ORDER_FORM,
    } as ContactFormData));
    setErrors({});
    setTouched({});
  };

  const handleQuickFillFeedbackSample = () => {
    setFormData((prev) => ({
      ...prev,
      ...SAMPLE_FEEDBACK_FORM,
    } as ContactFormData));
    setErrors({});
    setTouched({});
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setTouched({});
    if (onClearAttachedOrder) onClearAttachedOrder();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        attachedFile: 'File exceeds 10MB limit. Please upload a smaller photo or document.',
      }));
      return;
    }
    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFormData((prev) => ({
      ...prev,
      attachedFileName: file.name,
      attachedFileSize: sizeFormatted,
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.attachedFile;
      return copy;
    });
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      attachedFileName: undefined,
      attachedFileSize: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const touchedObj: Record<string, boolean> = {
      fullName: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    };
    if (formData.category === 'order') touchedObj.orderNumber = true;
    if (formData.category === 'feedback') touchedObj.rating = true;
    setTouched(touchedObj);

    if (!validateAll()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomTicketNum = Math.floor(100000 + Math.random() * 900000);
      const ticketId = `SPT-${randomTicketNum}`;

      const assignedTeam =
        formData.category === 'order'
          ? 'SPORTIVA Velocity Logistics & Fit Desk'
          : formData.category === 'feedback'
          ? 'SPORTIVA Technical Materials & Wear-Test Lab'
          : formData.category === 'club'
          ? 'SPORTIVA Custom Racing Kits Division'
          : 'SPORTIVA Athlete Concierge';

      const estimatedResolutionHours = formData.urgent
        ? 1
        : formData.category === 'order'
        ? 2
        : 4;

      const ticket: SubmittedTicket = {
        ticketId,
        submittedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        data: formData,
        estimatedResolutionHours,
        assignedTeam,
      };

      setIsSubmitting(false);
      onSuccessfulSubmit(ticket);
    }, 700);
  };

  const ratingDescriptions = [
    'Subpar / Defective item',
    'Below athletic standards',
    'Meets basic expectations',
    'High performance & durable',
    'Elite competition grade',
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Form Top Header & Category Selector */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0B2545]">
              <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
              <span>SPORTIVA Athlete Concierge</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2545] font-display tracking-tight mt-0.5">
              Submit an Order Inquiry or Feedback
            </h2>
          </div>

          {/* Quick Demo Pre-Fillers */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleQuickFillOrderSample}
              className="text-xs font-bold text-[#0B2545] bg-white hover:bg-slate-100 border border-slate-200 hover:border-[#0B2545] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Auto-fill with sample exchange request"
            >
              Fill Sample: Exchange
            </button>
            <button
              type="button"
              onClick={handleQuickFillFeedbackSample}
              className="text-xs font-bold text-[#0B2545] bg-white hover:bg-slate-100 border border-slate-200 hover:border-[#0B2545] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Auto-fill with wear-test feedback"
            >
              Fill Sample: Feedback
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-medium text-slate-500 hover:text-[#0B2545] p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              title="Reset fields"
              aria-label="Reset form"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs Styled to fit SPORTIVA Logo Navy & Red */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Inquiry Classification
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleCategorySwitch('order')}
              className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                formData.category === 'order'
                  ? 'border-[#0B2545] bg-[#0B2545] text-white shadow-sm ring-2 ring-[#E31B23]'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Package className={`w-4 h-4 ${formData.category === 'order' ? 'text-[#E31B23]' : 'text-slate-600'}`} />
                {formData.category === 'order' && <Check className="w-3.5 h-3.5 text-[#E31B23]" />}
              </div>
              <div className="text-xs font-bold leading-snug">Order &amp; Shipping</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  formData.category === 'order' ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Exchanges, returns, delivery
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('feedback')}
              className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                formData.category === 'feedback'
                  ? 'border-[#0B2545] bg-[#0B2545] text-white shadow-sm ring-2 ring-[#E31B23]'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Sparkles className={`w-4 h-4 ${formData.category === 'feedback' ? 'text-[#E31B23]' : 'text-slate-600'}`} />
                {formData.category === 'feedback' && <Check className="w-3.5 h-3.5 text-[#E31B23]" />}
              </div>
              <div className="text-xs font-bold leading-snug">Product Feedback</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  formData.category === 'feedback' ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Wear-tests, fit, aerodynamics
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('club')}
              className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                formData.category === 'club'
                  ? 'border-[#0B2545] bg-[#0B2545] text-white shadow-sm ring-2 ring-[#E31B23]'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Users className={`w-4 h-4 ${formData.category === 'club' ? 'text-[#E31B23]' : 'text-slate-600'}`} />
                {formData.category === 'club' && <Check className="w-3.5 h-3.5 text-[#E31B23]" />}
              </div>
              <div className="text-xs font-bold leading-snug">Club &amp; Bulk Gear</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  formData.category === 'club' ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Custom kits, teams, wholesale
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('general')}
              className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                formData.category === 'general'
                  ? 'border-[#0B2545] bg-[#0B2545] text-white shadow-sm ring-2 ring-[#E31B23]'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <HelpCircle className={`w-4 h-4 ${formData.category === 'general' ? 'text-[#E31B23]' : 'text-slate-600'}`} />
                {formData.category === 'general' && <Check className="w-3.5 h-3.5 text-[#E31B23]" />}
              </div>
              <div className="text-xs font-bold leading-snug">General Concierge</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  formData.category === 'general' ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Fitting labs, warranty, care
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-6">
        {/* Attached Order Banner */}
        {initialOrderToAttach && (
          <div className="bg-slate-50 border-l-4 border-[#E31B23] border border-slate-200 rounded-r-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#E31B23] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#0B2545]">
                  Attached SPORTIVA Order: {initialOrderToAttach.orderNumber}
                </span>{' '}
                <span className="text-slate-600">
                  ({initialOrderToAttach.status} · {initialOrderToAttach.items.length} items)
                </span>
              </div>
            </div>
            {onClearAttachedOrder && (
              <button
                type="button"
                onClick={onClearAttachedOrder}
                className="text-xs text-[#E31B23] hover:underline font-bold"
              >
                Detach
              </button>
            )}
          </div>
        )}

        {/* Global Error Banner */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <div
            role="alert"
            className="p-4 bg-red-50 border-l-4 border-[#E31B23] border border-red-200 rounded-r-lg text-xs text-red-900 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Please check the highlighted fields below:</div>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-red-800">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SECTION 1: Personal & Contact Details */}
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-[#0B2545] font-bold mb-3 flex items-center gap-1.5">
            <span>01. Athlete &amp; Contact Details</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-800 mb-1">
                Full Name <span className="text-[#E31B23]">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Marcus Vance"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2545] ${
                  errors.fullName
                    ? 'border-[#E31B23] bg-red-50/40'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-800 mb-1">
                Email Address <span className="text-[#E31B23]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="runner@sportiva.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2545] ${
                  errors.email
                    ? 'border-[#E31B23] bg-red-50/40'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-800 mb-1">
                Phone Number <span className="text-slate-400 font-normal">(Optional for SMS tracking)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+1 (555) 000-0000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2545] ${
                  errors.phone
                    ? 'border-[#E31B23] bg-red-50/40'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="preferredContact" className="block text-xs font-bold text-slate-800 mb-1">
                Preferred Response Channel
              </label>
              <select
                id="preferredContact"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-800"
              >
                <option value="email">Email Concierge (Fastest, with full documentation)</option>
                <option value="phone">Direct Phone Call (Mon–Sat 7am–7pm EST)</option>
                <option value="sms">SMS Text Alert for Real-Time Updates</option>
              </select>
            </div>
          </div>

          {/* GOOGLE MAP LOCATION INSERTION FIELD */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E31B23]" />
                <span>Delivery Address / Return Pickup / Preferred Fitting Location</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                Google Maps Verified
              </span>
            </div>

            {formData.location ? (
              <div className="p-3.5 bg-slate-50 border-l-4 border-l-[#E31B23] border border-slate-200 rounded-r-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <MapPin className="w-4 h-4 text-[#E31B23]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0B2545] flex items-center gap-2">
                      <span>{formData.location.placeName || 'Pinned Location'}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-medium">
                        {formData.location.source.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      {formData.location.formattedAddress}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Lat: {formData.location.lat.toFixed(5)}, Lng: {formData.location.lng.toFixed(5)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold text-[#0B2545] bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-xs"
                  >
                    Change on Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, location: undefined }))}
                    className="p-1.5 text-slate-400 hover:text-[#E31B23] hover:bg-slate-200 rounded-lg transition-colors"
                    title="Remove pinned location"
                    aria-label="Remove pinned location"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#0B2545] bg-slate-50/70 hover:bg-slate-100/90 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4 text-[#E31B23]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2545] group-hover:text-[#E31B23] transition-colors">
                      Click to Pin / Insert Location via Google Map
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Search any address, click on map to pinpoint, or select a SPORTIVA Flagship Fitting Lab
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#0B2545] group-hover:text-[#E31B23] transition-colors shrink-0">
                  <span>Open Interactive Map</span>
                  <span>→</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* SECTION 2A: ORDER INQUIRIES */}
        {formData.category === 'order' && (
          <div className="pt-4 border-t border-slate-200 bg-slate-50/60 p-4 sm:p-5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-mono tracking-wider text-[#0B2545] font-bold flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#E31B23]" />
                <span>02. Order Details &amp; Desired Resolution</span>
              </h3>
              <span className="text-[11px] text-slate-600 font-medium">
                SPORTIVA 30-Day Sweat &amp; Velocity Guarantee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="orderNumber" className="block text-xs font-bold text-slate-800 mb-1">
                  Order Number <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. SPT-84210"
                  aria-invalid={!!errors.orderNumber}
                  aria-describedby={errors.orderNumber ? 'orderNumber-error' : undefined}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0B2545] ${
                    errors.orderNumber
                      ? 'border-[#E31B23] bg-red-50/40'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                />
                {errors.orderNumber ? (
                  <p id="orderNumber-error" className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                    {errors.orderNumber}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 font-mono">
                    Format: SPT-XXXXX from confirmation email.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="orderDate" className="block text-xs font-bold text-slate-800 mb-1">
                  Order / Delivery Date
                </label>
                <input
                  type="date"
                  id="orderDate"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                />
              </div>

              <div>
                <label htmlFor="orderIssue" className="block text-xs font-bold text-slate-800 mb-1">
                  Nature of Order Issue
                </label>
                <select
                  id="orderIssue"
                  name="orderIssue"
                  value={formData.orderIssue}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-800"
                >
                  <option value="return_exchange">Return / Size Exchange (Sweat-Test)</option>
                  <option value="shipping_delay">Shipping Status / Package In Transit</option>
                  <option value="defective_gear">Seam Delamination / Hardware Defect (2-Yr Warranty)</option>
                  <option value="wrong_item">Received Incorrect Color / Item</option>
                  <option value="size_adjustment">Fit Consultation &amp; Adjustment</option>
                  <option value="order_cancellation">Cancel Order / Modify Address</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="apparelItemName" className="block text-xs font-bold text-slate-800 mb-1">
                  Apparel Name / SKU Description
                </label>
                <input
                  type="text"
                  id="apparelItemName"
                  name="apparelItemName"
                  value={formData.apparelItemName}
                  onChange={handleChange}
                  placeholder="e.g. SPORTIVA Velocity-X Running Jacket (Navy & Red - M)"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                />
              </div>

              <div>
                <label htmlFor="desiredResolution" className="block text-xs font-bold text-slate-800 mb-1">
                  Desired Resolution
                </label>
                <select
                  id="desiredResolution"
                  name="desiredResolution"
                  value={formData.desiredResolution}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-800"
                >
                  <option value="exchange_size">Exchange for Different Size/Color</option>
                  <option value="store_credit_bonus">Store Credit (+10% Bonus Athlete Credit)</option>
                  <option value="refund_original">Refund to Original Payment Method</option>
                  <option value="warranty_repair">Warranty Replacement / Repair</option>
                  <option value="agent_guidance">Speak with Apparel Fit Specialist</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2B: PRODUCT FEEDBACK */}
        {formData.category === 'feedback' && (
          <div className="pt-4 border-t border-slate-200 bg-slate-50/60 p-4 sm:p-5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-mono tracking-wider text-[#0B2545] font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E31B23]" />
                <span>02. Product Performance &amp; Fit Assessment</span>
              </h3>
              <span className="text-[11px] text-slate-600 font-medium">
                SPORTIVA Technical R&amp;D
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Overall Performance Rating <span className="text-[#E31B23]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating !== null ? hoverRating : formData.rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, rating: star }));
                            setTouched((prev) => ({ ...prev, rating: true }));
                            setErrors((prev) => ({ ...prev, rating: undefined }));
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 rounded hover:bg-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                          aria-label={`${star} Star rating`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isActive
                                ? 'text-[#E31B23] fill-[#E31B23]'
                                : 'text-slate-300 fill-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-semibold text-slate-800 ml-2">
                    {formData.rating > 0
                      ? ratingDescriptions[formData.rating - 1]
                      : hoverRating
                      ? ratingDescriptions[hoverRating - 1]
                      : 'Select 1–5 stars'}
                  </span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                    {errors.rating}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label htmlFor="feedbackArea" className="block text-xs font-bold text-slate-800 mb-1">
                    Feedback Focus Area
                  </label>
                  <select
                    id="feedbackArea"
                    name="feedbackArea"
                    value={formData.feedbackArea}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-800"
                  >
                    <option value="sizing_fit">Sizing &amp; Anatomical Cut</option>
                    <option value="fabric_breathability">Moisture Transport &amp; Evaporation</option>
                    <option value="durability_stitching">Bonded Seams &amp; Abrasion Resistance</option>
                    <option value="waterproofing_weather">Weatherproof Membrane &amp; DWR</option>
                    <option value="website_service">Store Navigation &amp; Packaging</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fitPerception" className="block text-xs font-bold text-slate-800 mb-1">
                    Fit Precision
                  </label>
                  <select
                    id="fitPerception"
                    name="fitPerception"
                    value={formData.fitPerception}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-800"
                  >
                    <option value="runs_small">Runs Small (Athletic Compression / Race Fit)</option>
                    <option value="true_to_size">True to Athletic Size</option>
                    <option value="runs_large">Runs Large (Relaxed / Layering Fit)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="wouldRecommend" className="block text-xs font-bold text-slate-800 mb-1">
                    Recommend to Fellow Athletes?
                  </label>
                  <select
                    id="wouldRecommend"
                    name="wouldRecommend"
                    value={formData.wouldRecommend}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-800"
                  >
                    <option value="yes">Yes, Definitely</option>
                    <option value="neutral">Neutral / Depends on Workout</option>
                    <option value="no">Would not recommend</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2C: CLUB / BULK ORDERS */}
        {formData.category === 'club' && (
          <div className="p-4 bg-slate-50 border-l-4 border-[#0B2545] border border-slate-200 rounded-r-lg text-xs text-slate-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#0B2545] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#0B2545] mb-0.5">
                SPORTIVA Club &amp; Marathon Team Program
              </div>
              <p className="text-slate-700 leading-relaxed">
                We outfit running clubs, university squads, and endurance collectives with a minimum order quantity of 15 pieces. Please specify your squad size, target race date, and kit requirements (e.g. singlets, windbreakers, tights) in the message section below.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 3: Subject & Detailed Message */}
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-[#0B2545] font-bold mb-3">
            03. Message &amp; Documentation
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-xs font-bold text-slate-800 mb-1">
                Subject Line <span className="text-[#E31B23]">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Exchange size for SPORTIVA Velocity Jacket or Question on Marathon Singlet"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2545] ${
                  errors.subject
                    ? 'border-[#E31B23] bg-red-50/40'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.subject && (
                <p id="subject-error" className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="message" className="text-xs font-bold text-slate-800">
                  Detailed Message / Feedback <span className="text-[#E31B23]">*</span>
                </label>
                <span
                  className={`text-[11px] tabular-nums font-mono font-bold ${
                    formData.message.length >= 15 ? 'text-slate-500' : 'text-[#E31B23]'
                  }`}
                >
                  {formData.message.length} / min 15 chars
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={
                  formData.category === 'feedback'
                    ? 'Share your experience testing this SPORTIVA gear in workouts, comments on breathability, fit during motion, seam comfort, or design recommendations...'
                    : formData.category === 'order'
                    ? 'Describe your exchange request, tracking question, or issue with your SPORTIVA order. Include details such as desired replacement size or return reason...'
                    : 'Please detail your inquiry, club specifications, or question for our athletic concierge team...'
                }
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2545] resize-y leading-relaxed ${
                  errors.message
                    ? 'border-[#E31B23] bg-red-50/40'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                  {errors.message}
                </p>
              )}
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Attachment / Defect Photo / Packing Slip{' '}
                <span className="text-slate-400 font-normal">(Optional, max 10MB)</span>
              </label>

              {formData.attachedFileName ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2.5 text-xs text-slate-800">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-semibold">{formData.attachedFileName}</span>
                      <span className="text-slate-500 ml-2 font-mono text-[11px]">
                        ({formData.attachedFileSize})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-slate-400 hover:text-[#E31B23] p-1 rounded transition-colors"
                    aria-label="Remove attached file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#0B2545] bg-slate-100/50'
                      : 'border-slate-200 hover:border-slate-400 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#0B2545]">
                    Click to attach or drag &amp; drop file here
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Helpful for warranty claims (photo of seam/zipper) or exchange receipts. PNG, JPG, or PDF.
                  </div>
                </div>
              )}
              {errors.attachedFile && (
                <p className="mt-1 text-[11px] text-[#E31B23] font-semibold">
                  {errors.attachedFile}
                </p>
              )}
            </div>

            {/* Checkboxes: Urgent & Newsletter */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200/70 transition-colors">
                <input
                  type="checkbox"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#E31B23] focus:ring-[#0B2545]"
                />
                <span className="text-xs text-slate-800 leading-snug">
                  <strong className="text-[#0B2545]">Priority Race / Event Dispatch:</strong> This inquiry relates to an imminent competition, marathon race date, or departure within 48 hours.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer px-2">
                <input
                  type="checkbox"
                  name="newsletterOptIn"
                  checked={formData.newsletterOptIn}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545]"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  Enroll me in the SPORTIVA Wear-Tester Community for early access to experimental prototypes and technical athlete research.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Button & Trust Guarantee */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500 text-center sm:text-left flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Encrypted transmission · Response guaranteed within 2 hours</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-black italic uppercase tracking-wider text-white bg-[#0B2545] hover:bg-[#06182E] active:scale-98 border-b-4 border-[#E31B23] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-md shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E31B23]" />
                <span>Transmitting Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#E31B23]" />
                <span>Transmit To Concierge</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive Google Map Location Insert Dialog */}
      <LocationInsertModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelected={(loc) => {
          setFormData((prev) => ({ ...prev, location: loc }));
          setIsLocationModalOpen(false);
        }}
        initialLocation={formData.location}
      />
    </div>
  );
};
