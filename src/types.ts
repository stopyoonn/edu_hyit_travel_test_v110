export type ActiveTab = 'home' | 'transit' | 'itinerary' | 'plan' | 'saved';

export interface TransitOption {
  id: string;
  type: 'train' | 'flight' | 'taxi' | 'bus';
  carrier: string;
  code: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureStation: string;
  arrivalStation: string;
  price: number;
  priceKrw?: number;
  localPrice?: number;
  localCurrency?: string;
  currency: string;
  seatClass: string;
  tag?: string;
  tagType?: 'primary' | 'secondary' | 'outline';
  direct?: boolean;
  refundable?: boolean;
  wifi?: boolean;
  quietCar?: boolean;
  liveStatus: {
    delayMin?: number;
    statusText: string;
    congestion?: string;
    lastUpdated?: string;
  };
}

export interface TransitStatus {
  mode?: string;
  statusText: string;
  congestionLevel?: number;
}

export interface ItineraryStop {
  order: string;
  arrivalTime: string;
  name: string;
  durationEstimate: string;
  imageUrl: string;
  quote?: string;
  transitStatus?: TransitStatus;
  locationTag?: string;
}

export interface ItineraryData {
  title: string;
  dayIndex?: number;
  themeScore: number;
  optimized: boolean;
  insight: string;
  stops: ItineraryStop[];
}

export interface CollectionItem {
  id: string;
  title: string;
  destinationsCount: string;
  imageUrl: string;
  location: string;
  description: string;
  photographer?: string;
}

export interface SavedItinerary {
  id: string;
  title: string;
  duration: string;
  theme: string;
  type: 'train' | 'flight' | 'bus';
  origin: string;
  destination: string;
}

export interface ImageModalData {
  imageUrl: string;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  tag?: string;
}
