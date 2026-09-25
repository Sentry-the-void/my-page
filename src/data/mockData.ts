import { TrackableOrder, ContactFormData } from '../types';

export const SAMPLE_ORDERS: Record<string, TrackableOrder> = {
  'SPT-84210': {
    orderNumber: 'SPT-84210',
    customerName: 'Marcus Vance',
    orderDate: 'September 22, 2026',
    status: 'In Transit',
    carrier: 'FedEx Athletic Express',
    trackingNumber: '7829-4410-9921',
    estimatedDelivery: 'September 26, 2026',
    items: [
      {
        name: 'SPORTIVA Velocity-X Ultralight Running Jacket',
        sku: 'SPTV-JKT-042',
        size: 'Medium (M)',
        color: 'Navy & Racing Red Accent',
        price: 185,
      },
      {
        name: 'SPORTIVA Pro-Circuit Compression 7" Shorts',
        sku: 'SPTV-SH-108',
        size: 'Medium (M)',
        color: 'Midnight Athletic Navy',
        price: 88,
      },
    ],
  },
  'SPT-72911': {
    orderNumber: 'SPT-72911',
    customerName: 'Elena Rostova',
    orderDate: 'September 18, 2026',
    status: 'Delivered',
    carrier: 'DHL Global Sports Priority',
    trackingNumber: '9923-1102-5544',
    estimatedDelivery: 'September 21, 2026 (Delivered)',
    items: [
      {
        name: 'SPORTIVA AeroMesh Seamless Training Long Sleeve',
        sku: 'SPTV-LS-301',
        size: 'Small (S)',
        color: 'Racing Crimson Red',
        price: 94,
      },
    ],
  },
  'SPT-90432': {
    orderNumber: 'SPT-90432',
    customerName: 'Derrick Chen',
    orderDate: 'September 24, 2026',
    status: 'Processing',
    carrier: 'USPS Priority Sport',
    trackingNumber: '9400-1118-9922',
    estimatedDelivery: 'September 28, 2026',
    items: [
      {
        name: 'SPORTIVA Apex Carbon-Infused Marathon Singlet',
        sku: 'SPTV-SNG-202',
        size: 'Large (L)',
        color: 'Navy Speed Stripe',
        price: 75,
      },
    ],
  },
  // Backward compatibility alias for demo
  'KNT-84210': {
    orderNumber: 'SPT-84210',
    customerName: 'Marcus Vance',
    orderDate: 'September 22, 2026',
    status: 'In Transit',
    carrier: 'FedEx Athletic Express',
    trackingNumber: '7829-4410-9921',
    estimatedDelivery: 'September 26, 2026',
    items: [
      {
        name: 'SPORTIVA Velocity-X Ultralight Running Jacket',
        sku: 'SPTV-JKT-042',
        size: 'Medium (M)',
        color: 'Navy & Racing Red Accent',
        price: 185,
      },
    ],
  },
};

export const SAMPLE_ORDER_FORM: Partial<ContactFormData> = {
  fullName: 'Marcus Vance',
  email: 'marcus.vance@sportivaclub.org',
  phone: '+1 (555) 392-8814',
  preferredContact: 'email',
  category: 'order',
  orderNumber: 'SPT-84210',
  orderDate: '2026-09-22',
  orderIssue: 'return_exchange',
  apparelItemName: 'SPORTIVA Velocity-X Ultralight Running Jacket',
  desiredResolution: 'exchange_size',
  subject: 'Exchange size from Medium to Large for SPORTIVA Velocity-X Jacket',
  message: 'Received my SPORTIVA shipment yesterday. The dynamic fit, taped windproofing, and signature red speed trims look incredible on the road, but the athletic shoulder taper feels slightly snug for long tempo workouts. I would love to exchange the Medium for a Large in the same Navy & Racing Red colorway.',
  urgent: false,
  newsletterOptIn: true,
};

export const SAMPLE_FEEDBACK_FORM: Partial<ContactFormData> = {
  fullName: 'Elena Rostova',
  email: 'elena.rostova@marathontraining.io',
  phone: '+1 (555) 782-9011',
  preferredContact: 'email',
  category: 'feedback',
  feedbackArea: 'fabric_breathability',
  rating: 5,
  fitPerception: 'true_to_size',
  wouldRecommend: 'yes',
  orderNumber: 'SPT-72911',
  orderDate: '2026-09-18',
  orderIssue: 'return_exchange',
  apparelItemName: 'SPORTIVA AeroMesh Seamless Training Long Sleeve',
  desiredResolution: 'agent_guidance',
  subject: 'SPORTIVA Wear-Test Review after 42km marathon simulation',
  message: 'Field-tested the AeroMesh Seamless top across humid 25°C conditions and 42km of elevation. Heat dispersion and moisture evacuation are top tier — zero chafing along bonded flatlock seams. The aerodynamic cut stays sleek without billowing. Suggestion: add an integrated watch window on the left sleeve cuff for GPS racing watches.',
  urgent: false,
  newsletterOptIn: true,
};

export interface FAQItem {
  id: string;
  question: string;
  category: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    id: 'sweat-test',
    question: 'What is the SPORTIVA 30-Day Velocity & Sweat Test Guarantee?',
    category: 'Returns & Exchanges',
    answer: 'We want every athlete to push our technical apparel on the road, track, and gym. If your SPORTIVA gear does not exceed your expectations within 30 days of delivery, return or exchange it for a full refund or store credit with zero return shipping fees — even if worn and washed.',
  },
  {
    id: 'sizing-fit',
    question: 'How does SPORTIVA athletic apparel fit compared to standard casual wear?',
    category: 'Fit & Technical Sizing',
    answer: 'SPORTIVA garments feature an anatomical athletic cut engineered with slight forward-leaning articulation to eliminate excess drag during sprint and endurance motion. If you prefer a looser or layering fit over base layers, we recommend ordering one size up.',
  },
  {
    id: 'technical-warranty',
    question: 'What is covered under the SPORTIVA 2-Year Seam & Hardware Warranty?',
    category: 'Durability & Materials',
    answer: 'Every SPORTIVA item is backed by a 24-month warranty against fabric delamination, bonded seam splitting, laser-cut ventilation failures, and zipper track faults. Natural abrasions from heavy race contact can also be assessed by our gear repair concierge.',
  },
  {
    id: 'wash-care',
    question: 'How should I wash SPORTIVA hydrophobic and compression garments?',
    category: 'Care Instructions',
    answer: 'Machine wash cold (30°C / 86°F) on gentle cycle with mild sports detergent. Never use fabric softeners or chlorine bleach, as softeners coat technical capillary filaments and impair moisture transport. Hang dry in shade or tumble dry low.',
  },
  {
    id: 'club-orders',
    question: 'Does SPORTIVA offer custom team kits, track club orders, and bulk programs?',
    category: 'Club & Team Programs',
    answer: 'Yes. SPORTIVA partners with track clubs, marathon teams, cycling collectives, and collegiate squads worldwide. Team orders start at 15 units with tiered athletic pricing, custom heat-transfer club insignias, and dedicated sample sizing packs.',
  },
];

export interface StoreLocation {
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
}

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    city: 'New York',
    name: 'SPORTIVA SoHo Performance Lab',
    address: '548 Broadway, New York, NY 10012',
    phone: '+1 (212) 555-0182',
    hours: 'Mon – Sat: 10:00 – 20:00 · Sun: 11:00 – 18:00 EST',
    features: ['High-Velocity Treadmill Lab', '3D Biomechanical Gait Scan', 'Instant Size Exchange'],
  },
  {
    city: 'Seattle',
    name: 'SPORTIVA Northwest Trail Studio',
    address: '1410 4th Ave, Seattle, WA 98101',
    phone: '+1 (206) 555-0199',
    hours: 'Mon – Sat: 10:00 – 19:00 · Sun: 11:00 – 17:00 PST',
    features: ['Rain Simulation Chamber', 'Technical Apparel Alterations', 'Club Hub'],
  },
  {
    city: 'London',
    name: 'SPORTIVA Covent Garden Flagship',
    address: '22 Floral Street, London WC2E 9DS, UK',
    phone: '+44 20 7946 0912',
    hours: 'Mon – Sat: 10:00 – 19:30 · Sun: 12:00 – 18:00 GMT',
    features: ['Marathon Kit Sizing Concierge', 'Custom Team Consultation', 'Express Pick-Up'],
  },
];
