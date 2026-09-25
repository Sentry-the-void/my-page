export type InquiryCategory = 'order' | 'feedback' | 'general' | 'club';

export type ContactPreference = 'email' | 'phone' | 'sms';

export type OrderIssueType = 
  | 'return_exchange'
  | 'shipping_delay'
  | 'defective_gear'
  | 'wrong_item'
  | 'size_adjustment'
  | 'order_cancellation';

export type DesiredResolution = 
  | 'exchange_size'
  | 'refund_original'
  | 'store_credit_bonus'
  | 'warranty_repair'
  | 'agent_guidance';

export type FeedbackArea = 
  | 'sizing_fit'
  | 'fabric_breathability'
  | 'durability_stitching'
  | 'waterproofing_weather'
  | 'website_service';

export interface LocationDetail {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeName?: string;
  source: 'map_pin' | 'search' | 'current_location' | 'preset_studio';
}

export interface ContactFormData {
  // Common details
  fullName: string;
  email: string;
  phone: string;
  preferredContact: ContactPreference;
  category: InquiryCategory;
  subject: string;
  message: string;
  urgent: boolean;
  newsletterOptIn: boolean;
  attachedFileName?: string;
  attachedFileSize?: string;

  // Inserted Google Map Location
  location?: LocationDetail;

  // Order Inquiries
  orderNumber: string;
  orderDate: string;
  orderIssue: OrderIssueType;
  apparelItemName: string;
  desiredResolution: DesiredResolution;

  // Feedback fields
  feedbackArea: FeedbackArea;
  rating: number; // 1 to 5
  fitPerception: 'runs_small' | 'true_to_size' | 'runs_large';
  wouldRecommend: 'yes' | 'neutral' | 'no';
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  orderNumber?: string;
  rating?: string;
  attachedFile?: string;
  location?: string;
}

export interface SubmittedTicket {
  ticketId: string;
  submittedAt: string;
  data: ContactFormData;
  estimatedResolutionHours: number;
  assignedTeam: string;
}

export interface TrackableOrder {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: 'In Transit' | 'Delivered' | 'Processing' | 'Out for Delivery';
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    sku: string;
    size: string;
    color: string;
    price: number;
  }>;
}
