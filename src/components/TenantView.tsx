import React from 'react';
import { Property, FilterState, PropertyType, TargetCategory, GasType } from '../types';
import { PropertyCard } from './PropertyCard';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Home, 
  Users, 
  Store, 
  Flame, 
  RotateCcw,
  Sparkles,
  Building,
  Check
} from 'lucide-react';
import { BANGLADESH_DIVISIONS } from '../data/mockProperties';

interface TenantViewProps {
  properties: Property[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  language: 'bn' | 'en';
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
}

export const TenantView: React.FC<TenantViewProps> = ({
  properties,
  filters,
  onFilterChange,
  onResetFilters,
  language,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onOpenChat
}) => {
  const isBn = language === 'bn';

  // Filtered properties
  const filteredList = properties.filter(prop => {
    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q) || prop.titleBn.toLowerCase().includes(q);
      const matchArea = prop.area.toLowerCase().includes(q) || prop.address.toLowerCase().includes(q);
      if (!matchTitle && !matchArea) return false;
    }

    // Property Type
    if (filters.propertyType !== 'ALL' && prop.propertyType !== filters.propertyType) {
      return false;
    }

    // Target Category
    if (filters.category !== 'ALL' && prop.category !== filters.category) {
      return false;
    }

    // City / Division
    if (filters.city !== 'All Divisions' && prop.division !== filters.city) {
      return false;
    }

    // Price
    if (prop.rentAmount < filters.minPrice || prop.rentAmount > filters.maxPrice) {
      return false;
    }

    // Bedrooms
    if (filters.bedrooms !== 'ALL' && prop.bedrooms !== filters.bedrooms) {
      return false;
    }

    // Gas Type
    if (filters.gasType !== 'ALL' && prop.gasType !== filters.gasType) {
      return false;
    }

    // Status: only show ACTIVE or PENDING if looking
    return prop.status === 'ACTIVE';
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Search & Category Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#396D32] relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9EDC9]/20 border border-[#CCD5AE]/40 text-[#FAEDCD] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{isBn ? 'সরাসরি বাড়িওয়ালা থেকে ভাড়া নিন • কোনো দালাল নেই' : 'Rent Directly from Landlords • No Brokerage'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isBn 
              ? 'আপনার পছন্দের ফ্ল্যাট, মেস রুম কিংবা বাণিজ্যিক দোকান খুঁজুন' 
              : 'Find Your Next Flat, Student Room or Commercial Store in BD'}
          </h1>
          
          <p className="text-[#E9EDC9]/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {isBn
              ? 'ঢাকা, চট্টগ্রাম, সিলেট সহ সারা বাংলাদেশের ফ্যামিলি ফ্ল্যাট, ব্যাচেলর মেস, ছাত্রী হোস্টেল ও দোকান ভাড়ার রিয়েলটাইম প্ল্যাটফর্ম।'
              : 'Real-time rental discovery for family apartments, student mess, female hostels, and retail stores across Bangladesh.'}
          </p>

          {/* Quick Search Input with Natural Tones Search Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8F9E8B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder={isBn ? 'এলাকা বা বাসার নাম লিখুন (যেমন: ধানমন্ডি, মিরপুর ১০, উত্তরা)...' : 'Search area or keyword (e.g. Dhanmondi, Mirpur 10, Uttara)...'}
                className="w-full bg-white text-[#354231] placeholder:text-stone-400 pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D4A373] shadow-sm border border-[#E5E0D8]"
              />
            </div>
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="bg-[#23471E] text-[#FAEDCD] border border-[#396D32] rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              {BANGLADESH_DIVISIONS.map(div => (
                <option key={div} value={div} className="bg-[#2D5A27] text-white">
                  {div}
                </option>
              ))}
            </select>
            <button
              onClick={() => onFilterChange({ searchQuery: filters.searchQuery })}
              className="bg-[#D4A373] hover:bg-[#C09262] text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'অনুসন্ধান' : 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none">
          <Building className="w-80 h-80 text-[#CCD5AE]" />
        </div>
      </div>

      {/* Quick Filters Pill Bar (Natural Tones Archetype) */}
      <div className="bg-[#E9EDC9] p-4 rounded-2xl border border-[#CCD5AE] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#2D5A27] uppercase tracking-wider">
            {isBn ? 'দ্রুত ফিল্টার:' : 'Quick Filters:'}
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onFilterChange({ category: filters.category === 'BACHELOR_STUDENT' ? 'ALL' : 'BACHELOR_STUDENT' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.category === 'BACHELOR_STUDENT'
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-white text-[#354231] border-[#A9B28A] hover:bg-[#FAEDCD]'
              }`}
            >
              {isBn ? '👨‍🎓 ব্যাচেলর/ছাত্র মেস' : 'Students'}
            </button>
            <button
              onClick={() => onFilterChange({ category: filters.category === 'FAMILY' ? 'ALL' : 'FAMILY' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.category === 'FAMILY'
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-white text-[#354231] border-[#A9B28A] hover:bg-[#FAEDCD]'
              }`}
            >
              {isBn ? '👨‍👩‍👧 ফ্যামিলি বাসা' : 'Family'}
            </button>
            <button
              onClick={() => onFilterChange({ propertyType: filters.propertyType === 'STORE' ? 'ALL' : 'STORE' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.propertyType === 'STORE'
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-white text-[#354231] border-[#A9B28A] hover:bg-[#FAEDCD]'
              }`}
            >
              {isBn ? '🏪 দোকান / কমার্শিয়াল' : 'Store/Shop'}
            </button>
            <button
              onClick={() => onFilterChange({ city: 'Dhaka' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.city === 'Dhaka'
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-white text-[#354231] border-[#A9B28A] hover:bg-[#FAEDCD]'
              }`}
            >
              ঢাকা (Dhaka)
            </button>
            <button
              onClick={() => onFilterChange({ city: 'Chattogram' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.city === 'Chattogram'
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-white text-[#354231] border-[#A9B28A] hover:bg-[#FAEDCD]'
              }`}
            >
              চট্টগ্রাম (Chittagong)
            </button>
          </div>
        </div>

        {/* Gas & Utility Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={filters.gasType}
            onChange={(e) => onFilterChange({ gasType: e.target.value as GasType | 'ALL' })}
            className="bg-white border border-[#A9B28A] text-[#354231] px-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none"
          >
            <option value="ALL">{isBn ? 'সব গ্যাস সংযোগ' : 'All Gas Types'}</option>
            <option value="TITAS_LINE">{isBn ? 'তিতাস লাইন গ্যাস' : 'Titas Line'}</option>
            <option value="CYLINDER">{isBn ? 'সিলিন্ডার গ্যাস' : 'LPG Cylinder'}</option>
          </select>

          <button
            onClick={onResetFilters}
            className="p-1.5 bg-white text-[#5A6D56] hover:text-[#2D5A27] border border-[#A9B28A] hover:bg-[#FAEDCD] rounded-xl transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Property Type Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E0D8] shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => onFilterChange({ propertyType: 'ALL' })}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filters.propertyType === 'ALL'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5A6D56] hover:bg-[#F5F2EC] hover:text-[#354231]'
            }`}
          >
            {isBn ? 'সব ক্যাটাগরি' : 'All Listings'} ({properties.filter(p => p.status === 'ACTIVE').length})
          </button>

          <button
            onClick={() => onFilterChange({ propertyType: 'FLAT' })}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              filters.propertyType === 'FLAT'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5A6D56] hover:bg-[#F5F2EC] hover:text-[#354231]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফ্যামিলি ফ্ল্যাট' : 'Flats'}</span>
          </button>

          <button
            onClick={() => onFilterChange({ propertyType: 'ROOM' })}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              filters.propertyType === 'ROOM'
                ? 'bg-[#D4A373] text-white shadow-xs'
                : 'text-[#5A6D56] hover:bg-[#F5F2EC] hover:text-[#354231]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isBn ? 'মেস / সিঙ্গেল রুম' : 'Student Rooms'}</span>
          </button>

          <button
            onClick={() => onFilterChange({ propertyType: 'STORE' })}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              filters.propertyType === 'STORE'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] hover:bg-[#F5F2EC] hover:text-[#354231]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{isBn ? 'বাণিজ্যিক দোকান' : 'Store / Commercial'}</span>
          </button>
        </div>

        <div className="text-xs text-[#5A6D56] font-medium px-2">
          {isBn ? `বাজেট: ৳${filters.minPrice.toLocaleString()} - ৳${filters.maxPrice.toLocaleString()}` : `Budget: ৳${filters.minPrice.toLocaleString()} - ৳${filters.maxPrice.toLocaleString()}`}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-[#354231] flex items-center gap-2">
            <span>{isBn ? 'উপলব্ধ প্রপার্টি তালিকা' : 'Available Properties'}</span>
            <span className="text-xs bg-[#E9EDC9] text-[#2D5A27] font-bold px-2.5 py-0.5 rounded-full border border-[#CCD5AE]">
              {filteredList.length} {isBn ? 'টি পাওয়া গেছে' : 'found'}
            </span>
          </h2>
        </div>
      </div>

      {/* Grid of Properties */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(prop => (
            <PropertyCard
              key={prop.id}
              property={prop}
              language={language}
              isFavorite={favorites.includes(prop.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectProperty={onSelectProperty}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F5F2EC] text-[#8F9E8B] mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#354231]">
              {isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Properties Found'}
            </h3>
            <p className="text-xs text-[#5A6D56] max-w-md mx-auto">
              {isBn
                ? 'আপনার সার্চ ফিল্টারের সাথে মিলে এমন কোনো বাসা বা দোকান বর্তমানে খালি নেই। ফিল্টার রিসেট করে আবার চেষ্টা করুন।'
                : 'Try adjusting your search query, area selection or price filter.'}
            </p>
          </div>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-[#2D5A27] text-white rounded-xl text-xs font-bold hover:bg-[#23471E] transition-colors"
          >
            {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Landlord CTA Banner */}
      <div className="bg-[#2D5A27] rounded-3xl p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md border border-[#396D32]">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold">{isBn ? 'আপনি কি একজন প্রপার্টি মালিক বা বাড়িওয়ালা?' : 'Are you a Property Landlord?'}</h3>
          <p className="text-sm text-[#E9EDC9]">
            {isBn ? 'আজই কোনো ব্রোকার ছাড়া আপনার বাসা বা দোকান ভাড়ার বিজ্ঞাপন দিন।' : 'List your flat or commercial store directly to verified tenants.'}
          </p>
        </div>
        <button
          onClick={() => {
            const btn = document.getElementById('role-btn-landlord');
            if (btn) btn.click();
          }}
          className="bg-white text-[#2D5A27] px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#FAEDCD] shadow-sm transition-colors shrink-0"
        >
          {isBn ? 'বিজ্ঞাপন আপলোড করুন' : 'Upload Details'}
        </button>
      </div>

    </div>
  );
};
