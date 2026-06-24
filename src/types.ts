export interface Accommodation {
  id: string;
  name: string;
  type: 'Chambre d\'hôte' | 'Gîte d\'étape';
  city: string;
  region: string;
  priceAriary: number;
  priceEuro: number;
  photo: string;
  description: string;
  amenities: string[];
  whatsappNumber: string;
  capacity: string;
  locationDetails: string;
  isFeatured?: boolean;
}

export type AccommodationTypeFilter = 'all' | 'chambre' | 'gite';

export interface FilterState {
  searchQuery: string;
  type: AccommodationTypeFilter;
  region: string;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'name';
}
