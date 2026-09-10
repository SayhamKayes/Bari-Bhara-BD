import React, { useState } from 'react';
import { Property, VisitRequest } from '../types';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Flame, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calculator, 
  Sparkles,
  Share2,
  Building,
  Layers,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  language: 'bn' | 'en';
  onScheduleVisit: (request: Omit<VisitRequest, 'id' | 'createdAt' | 'status'>) => void;
  onOpenChat: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  language,
  onScheduleVisit,
  onOpenChat
}) => {
  if (!property) return null;

  const isBn = language === 'bn';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Booking Form State
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM - 12:00 PM)');
  const [bookingMessage, setBookingMessage] = useState('');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantPhone || !preferredDate) return;

    onScheduleVisit({
      propertyId: property.id,
      propertyTitle: isBn ? property.titleBn : property.title,
      tenantName,
      tenantPhone,
      preferredDate,
      preferredTime,
      message: bookingMessage || (isBn ? 'আমি প্রোপার্টিটি স্বচক্ষে দেখতে আগ্রহী।' : 'I would like to visit the property in person.')
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    setBookingSubmitted(true);
    setTimeout(() => {
      setShowBookingForm(false);
      setBookingSubmitted(false);
    }, 2500);
  };

  const estimatedElectricity = 1500;
  const estimatedGasCost = property.gasType === 'TITAS_LINE' ? 1080 : 1500;
  const totalMonthlyCost = property.rentAmount + property.serviceCharge + estimatedGasCost + estimatedElectricity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="property-detail-modal"
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#E5E0D8]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE]">
              {property.propertyType === 'FLAT' ? (isBn ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Flat / Apartment') :
               property.propertyType === 'ROOM' ? (isBn ? 'সিঙ্গেল / মেস রুম' : 'Bachelor / Student Room') :
               (isBn ? 'বাণিজ্যিক দোকান / স্পেস' : 'Commercial Store / Shop')}
            </span>
            {property.isVerified && (
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FAEDCD] text-[#8C6D44] border border-[#D4A373]/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                {isBn ? 'যাচাইকৃত লিস্টিং' : 'Verified Property'}
              </span>
            )}
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 text-[#8F9E8B] hover:text-[#354231] hover:bg-[#F5F2EC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-white">
          
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-[#F5F2EC] border border-[#E5E0D8]">
              <img
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-[#354231]/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-xl font-medium">
                {activeImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#2D5A27] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Location Header */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A6D56] mb-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
              <span>{isBn ? property.addressBn : property.address}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#354231]">
              {isBn ? property.titleBn : property.title}
            </h1>
          </div>

          {/* Pricing Highlight & Advance */}
          <div className="bg-[#FDFBF7] border border-[#CCD5AE] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#5A6D56] font-bold uppercase tracking-wider">
                {isBn ? 'মাসিক নির্ধারিত ভাড়া' : 'Monthly Rent Rate'}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#2D5A27] flex items-baseline gap-1">
                <span>৳{formatBDT(property.rentAmount)}</span>
                <span className="text-sm font-normal text-[#5A6D56]">{isBn ? '/ প্রতি মাস' : '/ month'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E5E0D8] shadow-2xs">
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'অগ্রিম জামানত' : 'Advance Deposit'}</span>
                <span className="font-bold text-[#354231]">৳{formatBDT(property.advanceAmount)}</span>
              </div>
              <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E5E0D8] shadow-2xs">
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'সার্ভিস চার্জ' : 'Service Charge'}</span>
                <span className="font-bold text-[#354231]">৳{formatBDT(property.serviceCharge)}</span>
              </div>
              <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E5E0D8] shadow-2xs">
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'ভাড়া হবে' : 'Available From'}</span>
                <span className="font-bold text-[#2D5A27]">{isBn ? property.availableFromBn : property.availableFrom}</span>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div>
            <h3 className="text-xs font-bold text-[#354231] uppercase tracking-wider mb-3">
              {isBn ? 'প্রপার্টি স্পেসিফিকেশন' : 'Property Specifications'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {property.bedrooms !== undefined && (
                <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E0D8]">
                  <span className="text-[#5A6D56] block flex items-center gap-1 mb-1 font-medium">
                    <Bed className="w-3.5 h-3.5 text-[#8F9E8B]" />
                    {isBn ? 'বেডরুম' : 'Bedrooms'}
                  </span>
                  <span className="font-bold text-[#354231] text-sm">{property.bedrooms} টি</span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E0D8]">
                  <span className="text-[#5A6D56] block flex items-center gap-1 mb-1 font-medium">
                    <Bath className="w-3.5 h-3.5 text-[#8F9E8B]" />
                    {isBn ? 'বাথরুম' : 'Bathrooms'}
                  </span>
                  <span className="font-bold text-[#354231] text-sm">{property.bathrooms} টি</span>
                </div>
              )}
              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E0D8]">
                <span className="text-[#5A6D56] block flex items-center gap-1 mb-1 font-medium">
                  <Maximize2 className="w-3.5 h-3.5 text-[#8F9E8B]" />
                  {isBn ? 'আয়তন' : 'Size'}
                </span>
                <span className="font-bold text-[#354231] text-sm">{property.squareFeet} {isBn ? 'বর্গফুট' : 'sqft'}</span>
              </div>
              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E0D8]">
                <span className="text-[#5A6D56] block flex items-center gap-1 mb-1 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#8F9E8B]" />
                  {isBn ? 'ফ্লোর' : 'Floor Level'}
                </span>
                <span className="font-bold text-[#354231] text-sm">
                  {isBn ? `${property.floorNumber}ম তলা (মোট ${property.totalFloors} তলা)` : `${property.floorNumber}th of ${property.totalFloors}`}
                </span>
              </div>
              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E0D8] col-span-2 sm:col-span-2">
                <span className="text-[#5A6D56] block flex items-center gap-1 mb-1 font-medium">
                  <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
                  {isBn ? 'গ্যাস ইউটিলিটি' : 'Gas Utility Type'}
                </span>
                <span className="font-bold text-[#354231] text-sm">
                  {property.gasType === 'TITAS_LINE' ? (isBn ? 'তিতাস পাইপলাইন গ্যাস' : 'Titas Pipeline Gas') :
                   property.gasType === 'CYLINDER' ? (isBn ? 'এলপিজি সিলিন্ডার গ্যাস' : 'LPG Cylinder') : (isBn ? 'কোনো গ্যাস নেই (কমার্শিয়াল)' : 'No Gas Line')}
                </span>
              </div>
            </div>
          </div>

          {/* Amenities & Features */}
          <div>
            <h3 className="text-xs font-bold text-[#354231] uppercase tracking-wider mb-3">
              {isBn ? 'সুযোগ-সুবিধাসমূহ (Amenities)' : 'Amenities & Facilities'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-[#FDFBF7] hover:bg-[#F5F2EC] text-[#354231] text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold border border-[#E5E0D8] transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A27]" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-[#354231] uppercase tracking-wider mb-2">
              {isBn ? 'বিস্তারিত বর্ণনা' : 'Description'}
            </h3>
            <p className="text-sm text-[#5A6D56] leading-relaxed bg-[#FDFBF7] p-4 rounded-2xl border border-[#E5E0D8]">
              {isBn ? property.descriptionBn : property.description}
            </p>
          </div>

          {/* House Rules */}
          {property.houseRules && property.houseRules.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#354231] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#D4A373]" />
                {isBn ? 'বাড়িওয়ালার নিয়মাবলী (House Rules)' : 'House Rules'}
              </h3>
              <ul className="space-y-1.5 text-xs text-[#5A6D56]">
                {(isBn ? property.houseRulesBn : property.houseRules).map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]"></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monthly Budget Calculator for Tenant */}
          <div className="bg-[#354231] text-white p-5 rounded-2xl border border-[#2D5A27]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#FAEDCD]" />
                <h4 className="text-sm font-bold">{isBn ? 'ভাড়াটিয়ার আনুমানিক মাসিক বাজেট হিসাব' : 'Monthly Estimated Tenant Budget'}</h4>
              </div>
              <span className="text-[11px] bg-[#2D5A27] text-[#FAEDCD] px-2.5 py-0.5 rounded-lg font-bold border border-[#CCD5AE]/30">
                {isBn ? 'ঢাকা/লোকাল স্ট্যান্ডার্ড' : 'Local Benchmark'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#CCD5AE] mb-3 border-b border-[#2D5A27] pb-3">
              <div>
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'মূল ভাড়া' : 'Base Rent'}:</span>
                <span className="font-bold text-white">৳{formatBDT(property.rentAmount)}</span>
              </div>
              <div>
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'সার্ভিস চার্জ' : 'Service Charge'}:</span>
                <span className="font-bold text-white">৳{formatBDT(property.serviceCharge)}</span>
              </div>
              <div>
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'গ্যাস বিল (আনুমানিক)' : 'Est. Gas'}:</span>
                <span className="font-bold text-white">৳{formatBDT(estimatedGasCost)}</span>
              </div>
              <div>
                <span className="text-[#8F9E8B] block font-medium">{isBn ? 'বিদ্যুৎ (আনুমানিক)' : 'Est. Electric'}:</span>
                <span className="font-bold text-white">৳{formatBDT(estimatedElectricity)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#CCD5AE] font-medium">{isBn ? 'সর্বমোট আনুমানিক মাসিক ব্যয়:' : 'Total Estimated Monthly Expense:'}</span>
              <span className="text-lg font-black text-[#FAEDCD]">৳{formatBDT(totalMonthlyCost)}</span>
            </div>
          </div>

          {/* Landlord Contact & Action Card */}
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={property.landlordAvatar}
                alt={property.landlordName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#2D5A27]"
              />
              <div>
                <div className="text-xs text-[#5A6D56] font-medium">{isBn ? 'বাড়িওয়ালা / প্রপার্টি ওনার' : 'Property Landlord / Owner'}</div>
                <div className="font-bold text-[#354231] text-sm">{property.landlordName}</div>
                <div className="text-xs text-[#2D5A27] font-mono font-bold">{property.landlordPhone}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${property.landlordPhone}`}
                className="flex-1 sm:flex-initial bg-[#354231] hover:bg-[#23471E] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isBn ? 'কল করুন' : 'Call'}</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(property);
                }}
                className="flex-1 sm:flex-initial bg-white border border-[#CCD5AE] hover:border-[#2D5A27] hover:bg-[#E9EDC9]/40 text-[#354231] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span>{isBn ? 'মেসেজ দিন' : 'Chat'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Visit Booking Form Toggle */}
          <div className="border-t border-[#E5E0D8] pt-4">
            {!showBookingForm ? (
              <button
                id="btn-toggle-schedule"
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-[#2D5A27] hover:bg-[#23471E] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Calendar className="w-4 h-4 text-[#FAEDCD]" />
                <span>{isBn ? 'বাসা দেখতে যাওয়ার সময় নির্ধারণ করুন (Schedule a Visit)' : 'Schedule an In-Person Visit'}</span>
              </button>
            ) : (
              <form onSubmit={handleBookingSubmit} className="bg-[#FDFBF7] border border-[#CCD5AE] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#354231] text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#2D5A27]" />
                    <span>{isBn ? 'ভিজিট বুকিং ফর্ম পূরণ করুন' : 'Book a Property Visit'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="text-[#8F9E8B] hover:text-[#354231] text-xs font-semibold"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>

                {bookingSubmitted ? (
                  <div className="bg-[#2D5A27] text-white p-4 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-[#FAEDCD]" />
                    <span>{isBn ? 'বুকিং রিকোয়েস্ট সফলভাবে বাড়িওয়ালার কাছে পাঠানো হয়েছে!' : 'Visit Request sent to Landlord successfully!'}</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#354231] block mb-1">
                          {isBn ? 'আপনার নাম' : 'Your Name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                          placeholder={isBn ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                          className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#354231] block mb-1">
                          {isBn ? 'মোবাইল নাম্বার' : 'Mobile Number'} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={tenantPhone}
                          onChange={(e) => setTenantPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#354231] block mb-1">
                          {isBn ? 'পছন্দের তারিখ' : 'Preferred Date'} *
                        </label>
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#354231] block mb-1">
                          {isBn ? 'পছন্দের সময়' : 'Preferred Time Slot'}
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                        >
                          <option>{isBn ? 'সকাল (১০:০০ - ১২:০০)' : 'Morning (10:00 AM - 12:00 PM)'}</option>
                          <option>{isBn ? 'দুপুর (০২:০০ - ০৪:০০)' : 'Afternoon (02:00 PM - 04:00 PM)'}</option>
                          <option>{isBn ? 'সন্ধ্যা (০৫:০০ - ০৭:০০)' : 'Evening (05:00 PM - 07:00 PM)'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#354231] block mb-1">
                        {isBn ? 'বাড়িওয়ালার জন্য অতিরিক্ত বার্তা (ঐচ্ছিক)' : 'Message to Landlord (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder={isBn ? 'যেমন: আমরা ৩ জনের ফ্যামিলি নিয়ে আসতে চাই' : 'e.g. Family of 3 members looking to move next month'}
                        className="w-full bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#354231] focus:border-[#2D5A27] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#2D5A27] hover:bg-[#23471E] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FAEDCD]" />
                      <span>{isBn ? 'বুকিং রিকোয়েস্ট নিশ্চিত করুন' : 'Confirm Visit Schedule'}</span>
                    </button>
                  </>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
