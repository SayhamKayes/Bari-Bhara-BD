import React from 'react';
import { Property } from '../types';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Flame, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  Eye,
  Store,
  Home,
  Users,
  MessageCircle,
  Phone
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  language: 'bn' | 'en';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  language,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onOpenChat
}) => {
  const isBn = language === 'bn';

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const getPropertyTypeBadge = () => {
    switch (property.propertyType) {
      case 'FLAT':
        return {
          label: isBn ? 'ফ্যামিলি ফ্ল্যাট' : 'Family Flat',
          bg: 'bg-[#E9EDC9] text-[#2D5A27] border-[#CCD5AE]',
          icon: <Home className="w-3.5 h-3.5 text-[#2D5A27]" />
        };
      case 'ROOM':
        return {
          label: isBn ? 'স্টুডেন্ট / মেস রুম' : 'Bachelor / Student Room',
          bg: 'bg-[#FAEDCD] text-[#8C6D44] border-[#D4A373]/40',
          icon: <Users className="w-3.5 h-3.5 text-[#8C6D44]" />
        };
      case 'STORE':
        return {
          label: isBn ? 'বাণিজ্যিক দোকান / স্টোর' : 'Commercial Store / Shop',
          bg: 'bg-[#F5F2EC] text-[#5A6D56] border-[#CCD5AE]',
          icon: <Store className="w-3.5 h-3.5 text-[#5A6D56]" />
        };
    }
  };

  const typeBadge = getPropertyTypeBadge();

  return (
    <div 
      id={`property-card-${property.id}`}
      className="bg-white rounded-3xl border border-[#E5E0D8] hover:border-[#CCD5AE] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-[#F5F2EC] cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 shadow-2xs ${typeBadge.bg}`}>
            {typeBadge.icon}
            {typeBadge.label}
          </span>
          {property.isVerified && (
            <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-[#2D5A27] text-[#FAEDCD] flex items-center gap-1 shadow-xs border border-[#396D32]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
              {isBn ? 'ভেরিফাইড' : 'Verified'}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          id={`fav-btn-${property.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all shadow-xs ${
            isFavorite 
              ? 'bg-rose-500 text-white' 
              : 'bg-white/90 text-[#354231] hover:bg-white hover:text-rose-500'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Available Date Overlay Badge */}
        <div className="absolute bottom-3 left-3 bg-[#23471E]/80 backdrop-blur-xs text-[#FAEDCD] text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-medium border border-[#396D32]/50">
          <Calendar className="w-3 h-3 text-[#D4A373]" />
          <span>{isBn ? `ভাড়া হবে: ${property.availableFromBn}` : `Available: ${property.availableFrom}`}</span>
        </div>

        {/* Views Count */}
        <div className="absolute bottom-3 right-3 bg-[#23471E]/80 backdrop-blur-xs text-[#E9EDC9] text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 border border-[#396D32]/50">
          <Eye className="w-3 h-3 text-[#CCD5AE]" />
          <span>{property.viewsCount}</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Location & Title */}
        <div className="mb-2">
          <div className="flex items-center gap-1 text-xs text-[#5A6D56] mb-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
            <span className="truncate">{property.area}, {property.city}</span>
          </div>
          <h3 
            onClick={() => onSelectProperty(property)}
            className="font-bold text-[#354231] line-clamp-1 group-hover:text-[#2D5A27] cursor-pointer text-base transition-colors"
          >
            {isBn ? property.titleBn : property.title}
          </h3>
        </div>

        {/* Key Features Pill Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#E5E0D8] my-2 text-[#5A6D56] text-xs">
          {property.propertyType !== 'STORE' ? (
            <>
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-[#8F9E8B]" />
                <span className="font-medium text-[#354231]">{property.bedrooms} {isBn ? 'বেড' : 'Bed'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-[#8F9E8B]" />
                <span className="font-medium text-[#354231]">{property.bathrooms} {isBn ? 'বাথ' : 'Bath'}</span>
              </div>
            </>
          ) : (
            <div className="col-span-2 flex items-center gap-1.5 text-[#2D5A27] font-semibold">
              <Store className="w-4 h-4 text-[#D4A373]" />
              <span>{isBn ? 'কমার্শিয়াল স্পেস' : 'Commercial Space'}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-[#8F9E8B]" />
            <span className="font-medium text-[#354231]">{property.squareFeet} {isBn ? 'বর্গফুট' : 'sqft'}</span>
          </div>
        </div>

        {/* Gas & Utilities Badge */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          {property.gasType === 'TITAS_LINE' && (
            <span className="bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE] px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold text-[11px]">
              <Flame className="w-3 h-3 text-[#2D5A27]" />
              {isBn ? 'তিতাস লাইন গ্যাস' : 'Titas Line Gas'}
            </span>
          )}
          {property.gasType === 'CYLINDER' && (
            <span className="bg-[#FAEDCD] text-[#8C6D44] border border-[#D4A373]/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold text-[11px]">
              <Flame className="w-3 h-3 text-[#D4A373]" />
              {isBn ? 'সিলিন্ডার গ্যাস' : 'LPG Cylinder'}
            </span>
          )}
          {property.floorNumber && (
            <span className="text-[#8F9E8B] text-xs">
              {isBn ? `${property.floorNumber}ম তলা` : `${property.floorNumber}th Floor`}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-[#8F9E8B] font-semibold uppercase tracking-wider">
              {isBn ? 'মাসিক ভাড়া' : 'Monthly Rent'}
            </div>
            <div className="text-lg font-black text-[#2D5A27] flex items-baseline gap-0.5">
              <span>৳{formatBDT(property.rentAmount)}</span>
              <span className="text-xs font-normal text-[#5A6D56]">{isBn ? '/মাস' : '/mo'}</span>
            </div>
            {property.serviceCharge > 0 && (
              <div className="text-[10px] text-[#8F9E8B]">
                +৳{formatBDT(property.serviceCharge)} {isBn ? 'সার্ভিস চার্জ' : 'service'}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`chat-btn-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(property);
              }}
              className="p-2.5 rounded-xl border border-[#E5E0D8] text-[#5A6D56] hover:text-[#2D5A27] hover:border-[#CCD5AE] hover:bg-[#F5F2EC] transition-colors"
              title={isBn ? 'মালিককে মেসেজ দিন' : 'Message Landlord'}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              id={`details-btn-${property.id}`}
              onClick={() => onSelectProperty(property)}
              className="bg-[#D4A373] hover:bg-[#C09262] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95"
            >
              {isBn ? 'বিস্তারিত দেখুন' : 'View Details'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
