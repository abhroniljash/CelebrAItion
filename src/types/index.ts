export type EventType = 
  | 'wedding' 
  | 'birthday' 
  | 'community' 
  | 'corporate' 
  | 'anniversary' 
  | 'baby_shower' 
  | 'festival'
  | 'party';

export type CurrencySymbol = '$' | '€' | '£' | '₹' | 'A$' | 'C$' | '¥';

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string; // e.g. "Primary Accent", "Soft Background", "Neutral", etc.
}

export interface BudgetItem {
  id: string;
  category: 
    | 'Venue & Rentals'
    | 'Catering & Beverages'
    | 'Photography & Videography'
    | 'Decor, Florals & Lighting'
    | 'Entertainment, Music & AV'
    | 'Attire, Beauty & Rings'
    | 'Invitations, Favors & Signage'
    | 'Permits, Insurance & Logistics'
    | 'Contingency & Emergency Reserve';
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: 'planned' | 'deposit_paid' | 'paid' | 'pending';
  priority: 'essential' | 'recommended' | 'optional';
  notes?: string;
  vendorId?: string;
}

export type TimelinePhase = 
  | 'planning_early' // 6-12 months / early
  | 'planning_mid'   // 2-6 months
  | 'planning_late'  // 2-4 weeks
  | 'week_of'        // Week of event
  | 'day_of'         // Day of event (minute-by-minute)
  | 'post_event';    // Wrap-up & thank yous

export interface TimelineItem {
  id: string;
  phase: TimelinePhase;
  timeLabel: string; // e.g. "6 Months Out", "10:00 AM", "06:30 PM"
  title: string;
  description: string;
  category: string;
  completed: boolean;
  assignedTo?: string;
  isKeyMilestone?: boolean;
}

export type VendorStatus = 'researching' | 'contacted' | 'shortlisted' | 'contract_pending' | 'booked' | 'declined';

export interface VendorItem {
  id: string;
  category: 
    | 'Venue'
    | 'Catering & Bar'
    | 'Photography'
    | 'Videography'
    | 'Florist & Decor'
    | 'DJ & Live Band'
    | 'Cake & Desserts'
    | 'Rentals & Furniture'
    | 'Invitations & Paper'
    | 'Security & Permits'
    | 'Transportation';
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  quoteAmount?: number;
  depositPaid?: number;
  status: VendorStatus;
  rating?: number; // 1-5
  notes?: string;
  keyQuestionsToAsk: string[];
}

export interface IdeaItem {
  id: string;
  category: 'theme' | 'decor' | 'food_drinks' | 'entertainment' | 'favors' | 'interactive' | 'sustainability';
  title: string;
  description: string;
  tags: string[];
  costImpact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'moderate' | 'involved';
  bookmarked: boolean;
  aiSuggestedReason?: string;
}

export type RsvpStatus = 'attending' | 'declined' | 'pending';

export interface GuestItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  partySize: number;
  status: RsvpStatus;
  dietaryRestrictions?: string;
  groupTag?: string; // e.g., "Family", "VIP", "Neighborhood", "College Friends"
  tableNumber?: string;
  notes?: string;
}

export interface EventPlan {
  id: string;
  title: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencySymbol;
  vibe: string;
  themeDescription: string;
  colorPalette: ColorSwatch[];
  dressCode?: string;
  budgetItems: BudgetItem[];
  timelineItems: TimelineItem[];
  vendors: VendorItem[];
  ideas: IdeaItem[];
  guests: GuestItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionSuggestions?: {
    label: string;
    actionType: 'add_expense' | 'add_timeline' | 'add_vendor' | 'add_idea' | 'copy_text';
    payload?: any;
  }[];
}

export interface AppSettings {
  geminiApiKey: string;
  preferredCurrency: CurrencySymbol;
  theme: 'light' | 'dark' | 'system';
  useAiSimulationFallback: boolean;
}
