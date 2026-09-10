import React, { useState } from 'react';
import { Property, PropertyType, TargetCategory, GasType } from '../types';
import { 
  X, 
  Building2, 
  Home, 
  Store, 
  Users, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Check, 
  Flame,
  Camera,
  Layers,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BANGLADESH_DIVISIONS, DHAKA_AREAS } from '../data/mockProperties';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
  language: 'bn' | 'en';
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  language
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  const [propertyType, setPropertyType] = useState<PropertyType>('FLAT');
  const [category, setCategory] = useState<TargetCategory>('FAMILY');
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('Dhanmondi');
  const [address, setAddress] = useState('');
  const [addressBn, setAddressBn] = useState('');
  const [rentAmount, setRentAmount] = useState<number>(25000);
  const [advanceAmount, setAdvanceAmount] = useState<number>(50000);
  const [serviceCharge, setServiceCharge] = useState<number>(3000);
  const [gasType, setGasType] = useState<GasType>('TITAS_LINE');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [squareFeet, setSquareFeet] = useState<number>(1200);
  const [floorNumber, setFloorNumber] = useState<number>(4);
  const [totalFloors, setTotalFloors] = useState<number>(6);
  const [availableFrom, setAvailableFrom] = useState('1st Next Month');
  const [availableFromBn, setAvailableFromBn] = useState('১লা আগামী মাস');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift', '24/7 Guard', 'WASA Water', 'Generator Backup'
  ]);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80');

  const ALL_AMENITIES = [
    'Lift',
    'Generator Backup',
    '24/7 Guard',
    'CCTV Security',
    'Car Parking',
    'Bike Parking',
    'WASA Water Line',
    'High Speed WiFi',
    'Rooftop Garden',
    'Commercial Power Meter',
    'Meal / Mess Cook',
    'Fire Safety'
  ];

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: title || (propertyType === 'FLAT' ? `${bedrooms}-Bed Flat in ${area}` : propertyType === 'ROOM' ? `Bachelor Room in ${area}` : `Commercial Space in ${area}`),
      titleBn: titleBn || (propertyType === 'FLAT' ? `${area}তে ${bedrooms} বেডের আধুনিক ফ্ল্যাট` : propertyType === 'ROOM' ? `${area}তে ব্যাচেলর/স্টুডেন্ট রুম` : `${area}তে বাণিজ্যিক দোকান স্পেস`),
      propertyType,
      category,
      division,
      city,
      area,
      address: address || `${area}, ${city}`,
      addressBn: addressBn || `${area}, ${city}`,
      rentAmount: Number(rentAmount),
      advanceAmount: Number(advanceAmount),
      serviceCharge: Number(serviceCharge),
      gasType,
      bedrooms: propertyType === 'STORE' ? undefined : Number(bedrooms),
      bathrooms: propertyType === 'STORE' ? undefined : Number(bathrooms),
      squareFeet: Number(squareFeet),
      floorNumber: Number(floorNumber),
      totalFloors: Number(totalFloors),
      amenities: selectedAmenities,
      images: [imageUrl],
      availableFrom,
      availableFromBn,
      landlordId: 'landlord-current',
      landlordName: 'Self Listed Landlord',
      landlordPhone: '+880 1712-345678',
      landlordAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      isVerified: false,
      status: 'PENDING', // Will require Admin approval in system
      viewsCount: 1,
      houseRules: ['On-time rent payment', 'Maintain cleanliness'],
      houseRulesBn: ['সময়মত ভাড়া পরিশোধ করতে হবে', 'পরিচ্ছন্নতা বজায় রাখতে হবে'],
      description: description || 'Well maintained property in prime location with all basic utilities.',
      descriptionBn: descriptionBn || 'মনোরম পরিবেশে অবস্থিত আধুনিক সুযোগ-সুবিধাসম্পন্ন প্রপার্টি।',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddProperty(newProperty);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="add-property-modal"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#E5E0D8]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#354231]">
                {isBn ? 'নতুন বাড়ি/রুম/দোকানের বিজ্ঞাপন দিন' : 'List a New Property / Store'}
              </h2>
              <p className="text-xs text-[#5A6D56]">
                {isBn ? 'বাড়িওয়ালা বা মালিক হিসেবে আপনার প্রপার্টির তথ্য দিন' : 'Provide your rental details for tenant discovery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8F9E8B] hover:text-[#354231] hover:bg-[#F5F2EC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 bg-white">
          
          {/* Step 1: Property Type & Target Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block">
              {isBn ? '১. প্রপার্টি টাইপ নির্বাচন করুন' : '1. Select Property Type'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPropertyType('FLAT');
                  setCategory('FAMILY');
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center sm:items-start gap-1 transition-all ${
                  propertyType === 'FLAT'
                    ? 'border-[#2D5A27] bg-[#E9EDC9]/50 text-[#2D5A27] ring-2 ring-[#CCD5AE]'
                    : 'border-[#E5E0D8] hover:border-[#CCD5AE] text-[#5A6D56]'
                }`}
              >
                <Home className="w-5 h-5 text-[#2D5A27]" />
                <span className="font-bold text-xs sm:text-sm">{isBn ? 'ফ্ল্যাট / বাসা' : 'Flat / House'}</span>
                <span className="text-[10px] text-[#8F9E8B] hidden sm:inline">{isBn ? 'পরিবার বা বড় গ্রুপ' : 'Full apartment'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPropertyType('ROOM');
                  setCategory('BACHELOR_STUDENT');
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center sm:items-start gap-1 transition-all ${
                  propertyType === 'ROOM'
                    ? 'border-[#D4A373] bg-[#FAEDCD]/50 text-[#8C6D44] ring-2 ring-[#D4A373]/30'
                    : 'border-[#E5E0D8] hover:border-[#CCD5AE] text-[#5A6D56]'
                }`}
              >
                <Users className="w-5 h-5 text-[#D4A373]" />
                <span className="font-bold text-xs sm:text-sm">{isBn ? 'রুম / মেস' : 'Single Room'}</span>
                <span className="text-[10px] text-[#8F9E8B] hidden sm:inline">{isBn ? 'ছাত্র/ব্যাচেলর মেস' : 'Student/bachelor'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPropertyType('STORE');
                  setCategory('COMMERCIAL');
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center sm:items-start gap-1 transition-all ${
                  propertyType === 'STORE'
                    ? 'border-[#354231] bg-[#F5F2EC] text-[#354231] ring-2 ring-[#E5E0D8]'
                    : 'border-[#E5E0D8] hover:border-[#CCD5AE] text-[#5A6D56]'
                }`}
              >
                <Store className="w-5 h-5 text-[#354231]" />
                <span className="font-bold text-xs sm:text-sm">{isBn ? 'বাণিজ্যিক দোকান' : 'Store / Shop'}</span>
                <span className="text-[10px] text-[#8F9E8B] hidden sm:inline">{isBn ? 'মুদি/শোরুম/অফিস' : 'Retail/Grocery'}</span>
              </button>
            </div>
          </div>

          {/* Target Category Pill */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block">
              {isBn ? 'ভাড়াটিয়ার ক্যাটাগরি' : 'Tenant Target Audience'}
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCategory('FAMILY')}
                className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                  category === 'FAMILY' ? 'bg-[#2D5A27] text-white border-[#2D5A27]' : 'bg-[#FDFBF7] text-[#5A6D56] border-[#E5E0D8]'
                }`}
              >
                {isBn ? 'ফ্যামিলি (পরিবার)' : 'Family'}
              </button>
              <button
                type="button"
                onClick={() => setCategory('BACHELOR_STUDENT')}
                className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                  category === 'BACHELOR_STUDENT' ? 'bg-[#2D5A27] text-white border-[#2D5A27]' : 'bg-[#FDFBF7] text-[#5A6D56] border-[#E5E0D8]'
                }`}
              >
                {isBn ? 'ছাত্র / ব্যাচেলর মেস' : 'Male Student/Bachelor'}
              </button>
              <button
                type="button"
                onClick={() => setCategory('FEMALE_STUDENT')}
                className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                  category === 'FEMALE_STUDENT' ? 'bg-[#2D5A27] text-white border-[#2D5A27]' : 'bg-[#FDFBF7] text-[#5A6D56] border-[#E5E0D8]'
                }`}
              >
                {isBn ? 'ছাত্রী / কর্মজীবী মহিলা' : 'Female Student/Hostel'}
              </button>
              <button
                type="button"
                onClick={() => setCategory('COMMERCIAL')}
                className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                  category === 'COMMERCIAL' ? 'bg-[#2D5A27] text-white border-[#2D5A27]' : 'bg-[#FDFBF7] text-[#5A6D56] border-[#E5E0D8]'
                }`}
              >
                {isBn ? 'বাণিজ্যিক / দোকান / শোরুম' : 'Commercial / Store'}
              </button>
            </div>
          </div>

          {/* Step 2: Location & Address */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block">
              {isBn ? '২. অবস্থান ও ঠিকানা' : '2. Location & Address'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#5A6D56] block mb-1 font-medium">{isBn ? 'বিভাগ' : 'Division'}</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                >
                  {BANGLADESH_DIVISIONS.filter(d => d !== 'All Divisions').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#5A6D56] block mb-1 font-medium">{isBn ? 'এলাকা (Area)' : 'Area'}</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Dhanmondi / Mirpur / GEC"
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#5A6D56] block mb-1 font-medium">{isBn ? 'ভাড়া কার্যকর হবে' : 'Available From'}</label>
                <input
                  type="text"
                  value={availableFromBn}
                  onChange={(e) => setAvailableFromBn(e.target.value)}
                  placeholder="১লা আগামী মাস / অবিলম্বে"
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#5A6D56] block mb-1 font-medium">{isBn ? 'পূর্ণ ঠিকানা (বাড়ি নং, রোড নং)' : 'Full Address'}</label>
              <input
                type="text"
                required
                value={addressBn}
                onChange={(e) => setAddressBn(e.target.value)}
                placeholder="বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা"
                className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
              />
            </div>
          </div>

          {/* Step 3: Pricing in BDT */}
          <div className="space-y-3 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E5E0D8]">
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block">
              {isBn ? '৩. ভাড়া ও আর্থিক তথ্য (টাকায়)' : '3. Pricing & Financials (BDT)'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#354231] font-semibold block mb-1">{isBn ? 'মাসিক ভাড়া (৳)' : 'Monthly Rent (৳)'} *</label>
                <input
                  type="number"
                  required
                  value={rentAmount}
                  onChange={(e) => setRentAmount(Number(e.target.value))}
                  className="w-full bg-white border border-[#CCD5AE] rounded-xl px-3 py-2 text-xs font-bold text-[#2D5A27] focus:border-[#2D5A27] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#5A6D56] font-semibold block mb-1">{isBn ? 'অগ্রিম জামানত (৳)' : 'Advance Deposit (৳)'}</label>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs font-bold text-[#354231] focus:border-[#2D5A27] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#5A6D56] font-semibold block mb-1">{isBn ? 'সার্ভিস চার্জ (৳)' : 'Service Charge (৳)'}</label>
                <input
                  type="number"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs font-bold text-[#354231] focus:border-[#2D5A27] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Specs & Gas Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block">
              {isBn ? '৪. আকার ও ইউটিলিটি' : '4. Specifications & Utilities'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {propertyType !== 'STORE' && (
                <>
                  <div>
                    <label className="text-xs text-[#5A6D56] block mb-1">{isBn ? 'বেডরুম' : 'Bedrooms'}</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#5A6D56] block mb-1">{isBn ? 'বাথরুম' : 'Bathrooms'}</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231]"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-xs text-[#5A6D56] block mb-1">{isBn ? 'আয়তন (বর্গফুট)' : 'Sq. Feet'}</label>
                <input
                  type="number"
                  required
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231]"
                />
              </div>
              <div>
                <label className="text-xs text-[#5A6D56] block mb-1">{isBn ? 'ফ্লোর নং' : 'Floor No'}</label>
                <input
                  type="number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#5A6D56] block mb-1">{isBn ? 'গ্যাস সংযোগ' : 'Gas Utility'}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGasType('TITAS_LINE')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    gasType === 'TITAS_LINE' ? 'border-[#2D5A27] bg-[#E9EDC9] text-[#2D5A27]' : 'border-[#E5E0D8] text-[#5A6D56] bg-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {isBn ? 'তিতাস লাইন গ্যাস' : 'Titas Gas'}
                </button>
                <button
                  type="button"
                  onClick={() => setGasType('CYLINDER')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    gasType === 'CYLINDER' ? 'border-[#D4A373] bg-[#FAEDCD] text-[#8C6D44]' : 'border-[#E5E0D8] text-[#5A6D56] bg-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {isBn ? 'সিলিন্ডার গ্যাস' : 'Cylinder'}
                </button>
                <button
                  type="button"
                  onClick={() => setGasType('NONE')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    gasType === 'NONE' ? 'border-[#354231] bg-[#F5F2EC] text-[#354231]' : 'border-[#E5E0D8] text-[#5A6D56] bg-white'
                  }`}
                >
                  {isBn ? 'গ্যাস নেই' : 'No Gas'}
                </button>
              </div>
            </div>
          </div>

          {/* Amenities Multi Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block">
              {isBn ? '৫. সুযোগ-সুবিধাসমূহ নির্বাচন করুন' : '5. Amenities & Facilities'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_AMENITIES.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleToggleAmenity(amenity)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? 'border-[#2D5A27] bg-[#E9EDC9] text-[#2D5A27] font-bold'
                      : 'border-[#E5E0D8] text-[#5A6D56] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <span>{amenity}</span>
                  {selectedAmenities.includes(amenity) && <Check className="w-3.5 h-3.5 text-[#2D5A27]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#354231] uppercase tracking-wider block mb-1">
              {isBn ? '৬. বিস্তারিত বিবরণ ও নিয়মাবলী' : '6. Description & Rules'}
            </label>
            <textarea
              rows={3}
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder={isBn ? 'যেমন: বাসাটির দক্ষিণমুখী বারান্দা রয়েছে, ২৪ ঘণ্টা পানি ও নিরাপত্তা ব্যবস্থা আছে...' : 'Details about the flat/room/store...'}
              className="w-full bg-white border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E5E0D8] text-[#5A6D56] text-xs font-bold hover:bg-[#F5F2EC] transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#23471E] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FAEDCD]" />
              <span>{isBn ? 'বিজ্ঞাপন প্রকাশ করুন (Submit Listing)' : 'Publish Listing'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
