import { createClient } from '@supabase/supabase-js';
import { Property, VisitRequest, ChatMessage } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export const mapDbPropertyToFrontend = (dbProp: any): Property => {
  return {
    id: dbProp.id,
    title: dbProp.title,
    titleBn: dbProp.title, 
    propertyType: dbProp.property_type,
    category: dbProp.target_category,
    division: dbProp.division,
    city: dbProp.city,
    area: dbProp.area,
    address: dbProp.address,
    addressBn: dbProp.address,
    rentAmount: Number(dbProp.monthly_rent),
    advanceAmount: Number(dbProp.advance_deposit || 0),
    serviceCharge: Number(dbProp.service_charge || 0),
    gasType: dbProp.gas_type,
    bedrooms: dbProp.bedrooms,
    bathrooms: dbProp.bathrooms,
    squareFeet: dbProp.square_feet,
    floorNumber: dbProp.floor_number,
    totalFloors: dbProp.total_floors,
    amenities: dbProp.amenities || [],
    images: dbProp.images && dbProp.images.length > 0 ? dbProp.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'],
    availableFrom: dbProp.available_from || 'Contact for details',
    availableFromBn: dbProp.available_from || 'যোগাযোগ করুন',
    landlordId: dbProp.landlord_id,
    landlordName: dbProp.users?.full_name || 'Unknown',
    landlordPhone: dbProp.users?.phone_number || '',
    landlordAvatar: dbProp.users?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isLandlordVerified: dbProp.users?.is_verified || false,
    isVerified: dbProp.is_verified,
    status: dbProp.status,
    viewsCount: dbProp.views_count,
    houseRules: dbProp.house_rules || [],
    houseRulesBn: dbProp.house_rules || [],
    description: dbProp.description || '',
    descriptionBn: dbProp.description || '',
    createdAt: dbProp.created_at,
  };
};

export const mapDbVisitRequestToFrontend = (dbReq: any): VisitRequest => {
  return {
    id: dbReq.id,
    propertyId: dbReq.property_id,
    propertyTitle: dbReq.properties?.title || 'Unknown Property',
    tenantName: dbReq.users?.full_name || 'Unknown Tenant',
    tenantPhone: dbReq.users?.phone_number || '',
    preferredDate: dbReq.preferred_date,
    preferredTime: dbReq.preferred_time,
    message: dbReq.message,
    status: dbReq.status,
    createdAt: dbReq.created_at,
  };
};

export const mapDbChatMessageToFrontend = (dbMsg: any, currentPropertyLandlordId: string): ChatMessage => {
  const isLandlord = dbMsg.sender_id === currentPropertyLandlordId;
  const time = new Date(dbMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    id: dbMsg.id,
    propertyId: dbMsg.property_id,
    senderId: dbMsg.sender_id,
    senderRole: isLandlord ? 'LANDLORD' : 'TENANT',
    senderName: dbMsg.users?.full_name || 'Unknown',
    text: dbMsg.text,
    timestamp: time,
  };
};
