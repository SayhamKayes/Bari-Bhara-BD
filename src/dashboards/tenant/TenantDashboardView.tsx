import React, { useState } from 'react';
import { Property, VisitRequest } from '../../types';
import { PropertyCard } from '../../frontend/components/PropertyCard';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Clock3, 
  Heart 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TenantDashboardViewProps {
  currentUser: any;
  visitRequests: VisitRequest[];
  properties: Property[];
  favorites: string[];
  language: 'bn' | 'en';
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onUpdateProfile: (name: string, phone: string) => void;
  onCancelVisitRequest: (requestId: string) => void;
}

export const TenantDashboardView: React.FC<TenantDashboardViewProps> = ({
  currentUser,
  visitRequests,
  properties,
  favorites,
  language,
  onRemoveFavorite,
  onSelectProperty,
  onUpdateProfile,
  onCancelVisitRequest
}) => {
  const isBn = language === 'bn';
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone_number || '');
  const [activeTab, setActiveTab] = useState<'requests' | 'favorites'>('requests');

  const myRequests = visitRequests.filter(req => req.tenantId === currentUser?.id);
  const favoriteProperties = properties.filter(prop => favorites.includes(prop.id));

  const handleSaveProfile = () => {
    onUpdateProfile(name, phone);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="flex items-center gap-1 text-[#2D5A27] bg-[#E9EDC9] px-2 py-1 rounded-full text-[10px] font-bold"><CheckCircle className="w-3 h-3" /> {isBn ? 'গৃহীত' : 'Accepted'}</span>;
      case 'DECLINED':
        return <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full text-[10px] font-bold"><XCircle className="w-3 h-3" /> {isBn ? 'বাতিল' : 'Declined'}</span>;
      default:
        return <span className="flex items-center gap-1 text-[#8C6D44] bg-[#FAEDCD] px-2 py-1 rounded-full text-[10px] font-bold"><Clock3 className="w-3 h-3" /> {isBn ? 'অপেক্ষমান' : 'Pending'}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E5E0D8]">
        <h2 className="text-xl font-bold text-[#354231] mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-[#8F9E8B]" />
          {isBn ? 'আমার প্রোফাইল' : 'My Profile'}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-[#F5F2EC] rounded-full flex items-center justify-center border-4 border-[#E9EDC9] shrink-0">
            <User className="w-10 h-10 text-[#8F9E8B]" />
          </div>
          
          <div className="flex-1 w-full space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#354231] uppercase mb-1 block">
                    {isBn ? 'নাম' : 'Name'}
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#FDFBF7] border border-[#CCD5AE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#354231] uppercase mb-1 block">
                    {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-[#FDFBF7] border border-[#CCD5AE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-[#2D5A27] text-white rounded-xl text-sm font-bold hover:bg-[#23471F] transition-colors"
                  >
                    {isBn ? 'সেভ করুন' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-[#F5F2EC] text-[#5A6D56] rounded-xl text-sm font-bold hover:bg-[#E5E0D8] transition-colors"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-black text-[#354231]">{currentUser?.full_name || 'Tenant Name'}</h3>
                <p className="text-[#5A6D56] text-sm flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" /> {currentUser?.phone_number || (isBn ? 'নম্বর দেয়া নেই' : 'Not provided')}
                </p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-5 py-1.5 border border-[#CCD5AE] text-[#2D5A27] rounded-xl text-xs font-bold hover:bg-[#FDFBF7] transition-colors"
                >
                  {isBn ? 'প্রোফাইল আপডেট করুন' : 'Edit Profile'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E0D8] mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'requests' 
              ? 'border-[#2D5A27] text-[#2D5A27]' 
              : 'border-transparent text-[#8F9E8B] hover:text-[#5A6D56]'
          }`}
        >
          {isBn ? 'আমার ভিজিট রিকোয়েস্ট' : 'My Visit Requests'}
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'favorites' 
              ? 'border-[#2D5A27] text-[#2D5A27]' 
              : 'border-transparent text-[#8F9E8B] hover:text-[#5A6D56]'
          }`}
        >
          <Heart className="w-4 h-4" />
          {isBn ? 'সংরক্ষিত প্রপার্টি' : 'Saved Properties'}
        </button>
      </div>

      {/* Requests Content */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E0D8]">
              <Calendar className="w-12 h-12 text-[#CCD5AE] mx-auto mb-3" />
              <p className="text-[#5A6D56] font-medium">{isBn ? 'আপনি এখনো কোনো ভিজিট রিকোয়েস্ট পাঠাননি।' : 'You have not sent any visit requests yet.'}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {myRequests.map(req => {
                const prop = properties.find(p => p.id === req.propertyId);
                return (
                  <div key={req.id} className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#354231] text-sm truncate pr-2">
                          {prop ? (isBn ? prop.titleBn || prop.title : prop.title) : 'Unknown Property'}
                        </h4>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(req.status)}
                          {req.status === 'PENDING' && (
                            <button
                              onClick={() => onCancelVisitRequest(req.id)}
                              className="text-[10px] font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 transition-colors"
                            >
                              {isBn ? 'বাতিল করুন' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#5A6D56] flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8F9E8B]" /> {prop?.area}, {prop?.city}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-[#5A6D56] bg-[#FDFBF7] p-2 rounded-lg mt-3 border border-[#E5E0D8]">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {req.preferredDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {req.preferredTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Favorites Content */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E0D8]">
              <Heart className="w-12 h-12 text-[#CCD5AE] mx-auto mb-3" />
              <p className="text-[#5A6D56] font-medium">{isBn ? 'আপনার কোনো সংরক্ষিত প্রপার্টি নেই।' : 'You have no saved properties.'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map(property => (
                <div key={property.id} className="relative">
                  <PropertyCard
                    property={property}
                    language={language}
                    onClick={() => onSelectProperty(property)}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(property.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm z-10 hover:bg-white"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
