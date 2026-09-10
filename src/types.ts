export type Role = 'TENANT' | 'LANDLORD' | 'ADMIN';

export type PropertyType = 'FLAT' | 'ROOM' | 'STORE';

export type TargetCategory = 'FAMILY' | 'BACHELOR_STUDENT' | 'FEMALE_STUDENT' | 'COMMERCIAL' | 'ANY';

export type GasType = 'TITAS_LINE' | 'CYLINDER' | 'NONE';

export interface User {
  id: string;
  role: Role;
  full_name: string;
  phone_number: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  nid_front_url: string | null;
  nid_back_url: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  titleBn: string;
  propertyType: PropertyType;
  category: TargetCategory;
  division: string;
  city: string;
  area: string;
  address: string;
  addressBn: string;
  rentAmount: number;
  advanceAmount: number;
  serviceCharge: number;
  gasType: GasType;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  squareFeet: number;
  floorNumber: number;
  totalFloors: number;
  amenities: string[];
  images: string[];
  availableFrom: string;
  availableFromBn: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  landlordAvatar: string;
  isLandlordVerified: boolean;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING' | 'RENTED' | 'REJECTED';
  viewsCount: number;
  houseRules: string[];
  houseRulesBn: string[];
  description: string;
  descriptionBn: string;
  createdAt: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantPhone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  propertyId: string;
  senderId: string;
  senderRole: 'TENANT' | 'LANDLORD';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface FilterState {
  searchQuery: string;
  propertyType: PropertyType | 'ALL';
  category: TargetCategory | 'ALL';
  city: string;
  area: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'ALL';
  gasType: GasType | 'ALL';
  amenities: string[];
}
