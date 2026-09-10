import React from 'react';
import { Property, VisitRequest } from '../types';
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Phone, 
  MessageSquare, 
  AlertCircle,
  Eye,
  Check,
  X,
  MapPin,
  Flame,
  Home,
  Store,
  Users
} from 'lucide-react';

interface LandlordViewProps {
  properties: Property[];
  visitRequests: VisitRequest[];
  onOpenAddModal: () => void;
  onToggleRentedStatus: (propertyId: string) => void;
  onAcceptVisitRequest: (requestId: string) => void;
  onDeclineVisitRequest: (requestId: string) => void;
  language: 'bn' | 'en';
  onSelectProperty: (property: Property) => void;
}

export const LandlordView: React.FC<LandlordViewProps> = ({
  properties,
  visitRequests,
  onOpenAddModal,
  onToggleRentedStatus,
  onAcceptVisitRequest,
  onDeclineVisitRequest,
  language,
  onSelectProperty
}) => {
  const isBn = language === 'bn';

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const activeCount = properties.filter(p => p.status === 'ACTIVE').length;
  const pendingCount = properties.filter(p => p.status === 'PENDING').length;
  const rentedCount = properties.filter(p => p.status === 'RENTED').length;

  return (
    <div className="space-y-8">
      
      {/* Landlord Header Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-[#396D32]">
        <div>
          <div className="text-xs bg-[#23471E] text-[#FAEDCD] px-3 py-1 rounded-full inline-block font-semibold mb-2 border border-[#396D32]">
            {isBn ? 'বাড়িওয়ালা / মালিক ড্যাশবোর্ড' : 'Landlord / Property Owner Hub'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isBn ? 'আপনার বাসা, মেস ও দোকানের বিজ্ঞাপন নিয়ন্ত্রণ করুন' : 'Manage Your Properties & Tenant Inquiries'}
          </h1>
          <p className="text-[#E9EDC9] text-xs sm:text-sm mt-1">
            {isBn 
              ? 'নতুন প্রপার্টি লিস্টিং দিন, ভাড়াটিয়াদের ভিজিট বুকিং গ্রহণ করুন এবং রেন্ট স্ট্যাটাস আপডেট করুন।' 
              : 'List new units, manage tenant viewings, and toggle rental availability in real time.'}
          </p>
        </div>

        <button
          id="landlord-add-btn"
          onClick={onOpenAddModal}
          className="bg-[#D4A373] hover:bg-[#C09262] text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm transition-all shrink-0 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{isBn ? 'নতুন বিজ্ঞাপন দিন' : 'Add New Property'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs">
          <span className="text-xs text-[#5A6D56] font-medium block mb-1">{isBn ? 'মোট বিজ্ঞাপিত প্রপার্টি' : 'Total Listings'}</span>
          <span className="text-2xl font-black text-[#354231]">{properties.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#CCD5AE] bg-[#E9EDC9]/30 shadow-2xs">
          <span className="text-xs text-[#2D5A27] font-bold block mb-1">{isBn ? 'সক্রিয় ও খালি রয়েছে' : 'Active & Available'}</span>
          <span className="text-2xl font-black text-[#2D5A27]">{activeCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/50 bg-[#FAEDCD]/30 shadow-2xs">
          <span className="text-xs text-[#8C6D44] font-bold block mb-1">{isBn ? 'অ্যাডমিন অনুমোদনের অপেক্ষায়' : 'Pending Verification'}</span>
          <span className="text-2xl font-black text-[#D4A373]">{pendingCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] bg-[#F5F2EC] shadow-2xs">
          <span className="text-xs text-[#5A6D56] font-medium block mb-1">{isBn ? 'ভাড়া হয়ে গেছে' : 'Rented Out'}</span>
          <span className="text-2xl font-black text-[#5A6D56]">{rentedCount}</span>
        </div>
      </div>

      {/* Section 1: Tenant Visit Inquiries */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#354231] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2D5A27]" />
              <span>{isBn ? 'ভাড়াটিয়াদের ভিজিট বুকিং ও আবেদন' : 'Tenant Visit Inquiries'}</span>
            </h2>
            <p className="text-xs text-[#5A6D56]">
              {isBn ? 'ভাড়াটিয়ারা বাসা সরাসরি দেখতে আসার সময় নির্ধারণ করেছে' : 'Prospective tenants requesting property viewing dates'}
            </p>
          </div>
          <span className="text-xs bg-[#E9EDC9] text-[#2D5A27] font-bold px-3 py-1 rounded-full border border-[#CCD5AE]">
            {visitRequests.length} {isBn ? 'টি রিকোয়েস্ট' : 'requests'}
          </span>
        </div>

        {visitRequests.length > 0 ? (
          <div className="space-y-3">
            {visitRequests.map((req) => (
              <div 
                key={req.id}
                className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#354231]">{req.tenantName}</span>
                    <a
                      href={`tel:${req.tenantPhone}`}
                      className="text-xs text-[#2D5A27] font-mono font-bold flex items-center gap-1 bg-[#E9EDC9] border border-[#CCD5AE] px-2.5 py-0.5 rounded-lg hover:bg-[#CCD5AE] transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      {req.tenantPhone}
                    </a>
                  </div>

                  <div className="text-xs font-semibold text-[#5A6D56]">
                    {isBn ? 'প্রপার্টি:' : 'Property:'} <span className="text-[#354231] font-bold">{req.propertyTitle}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6D56]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8F9E8B]" />
                      {req.preferredDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8F9E8B]" />
                      {req.preferredTime}
                    </span>
                  </div>

                  {req.message && (
                    <p className="text-xs text-[#5A6D56] italic bg-white p-2.5 rounded-xl border border-[#E5E0D8]">
                      "{req.message}"
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2">
                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => onAcceptVisitRequest(req.id)}
                        className="bg-[#2D5A27] hover:bg-[#23471E] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isBn ? 'গ্রহণ করুন' : 'Accept'}</span>
                      </button>
                      <button
                        onClick={() => onDeclineVisitRequest(req.id)}
                        className="bg-[#F5F2EC] hover:bg-stone-200 text-[#5A6D56] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 border border-[#E5E0D8]"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isBn ? 'বাতিল' : 'Decline'}</span>
                      </button>
                    </>
                  ) : req.status === 'ACCEPTED' ? (
                    <span className="bg-[#E9EDC9] text-[#2D5A27] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 border border-[#CCD5AE]">
                      <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                      {isBn ? 'অনুমোদিত হয়েছে' : 'Accepted'}
                    </span>
                  ) : (
                    <span className="bg-[#F5F2EC] text-[#5A6D56] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
                      {isBn ? 'প্রত্যাখ্যাত' : 'Declined'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#8F9E8B] text-xs">
            {isBn ? 'বর্তমানে কোনো নতুন ভিজিট রিকোয়েস্ট নেই।' : 'No visit requests yet.'}
          </div>
        )}
      </div>

      {/* Section 2: Landlord's Listed Properties */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#354231] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2D5A27]" />
              <span>{isBn ? 'আমার বিজ্ঞাপিত প্রপার্টি তালিকা' : 'My Listed Properties'}</span>
            </h2>
            <p className="text-xs text-[#5A6D56]">
              {isBn ? 'আপনার মালিকানাধীন বাসা, রুম ও দোকান স্পেস' : 'Flats, rooms, and commercial units uploaded by you'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-[#CCD5AE] transition-colors"
            >
              <div className="flex gap-3">
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-[#E5E0D8]"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      prop.status === 'ACTIVE' ? 'bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE]' :
                      prop.status === 'PENDING' ? 'bg-[#FAEDCD] text-[#8C6D44] border border-[#D4A373]/40' :
                      'bg-[#F5F2EC] text-[#5A6D56] border border-[#E5E0D8]'
                    }`}>
                      {prop.status === 'ACTIVE' ? (isBn ? 'সক্রিয় (খালি)' : 'Active') :
                       prop.status === 'PENDING' ? (isBn ? 'অনুমোদনের অপেক্ষায়' : 'Pending Approval') :
                       (isBn ? 'ভাড়া সম্পন্ন' : 'Rented')}
                    </span>
                    <span className="text-xs font-black text-[#2D5A27]">
                      ৳{formatBDT(prop.rentAmount)}/mo
                    </span>
                  </div>

                  <h4 
                    onClick={() => onSelectProperty(prop)}
                    className="font-bold text-xs text-[#354231] line-clamp-1 cursor-pointer hover:text-[#2D5A27]"
                  >
                    {isBn ? prop.titleBn : prop.title}
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] text-[#5A6D56]">
                    <MapPin className="w-3 h-3 text-[#D4A373] shrink-0" />
                    <span className="truncate">{prop.area}, {prop.city}</span>
                  </div>

                  <div className="text-[11px] text-[#8F9E8B] flex items-center gap-2">
                    <span>{prop.squareFeet} {isBn ? 'বর্গফুট' : 'sqft'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3 text-[#CCD5AE]" />
                      {prop.viewsCount} {isBn ? 'ভিউ' : 'views'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-2 text-xs">
                <button
                  onClick={() => onSelectProperty(prop)}
                  className="text-[#2D5A27] hover:text-[#D4A373] font-bold"
                >
                  {isBn ? 'বিস্তারিত দেখুন' : 'View Full Details'}
                </button>

                <button
                  onClick={() => onToggleRentedStatus(prop.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    prop.status === 'RENTED'
                      ? 'bg-[#2D5A27] text-white'
                      : 'bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE] hover:bg-[#CCD5AE]'
                  }`}
                >
                  {prop.status === 'RENTED' 
                    ? (isBn ? 'আবার খালি করুন (Mark Active)' : 'Mark Available')
                    : (isBn ? 'ভাড়া হয়ে গেছে (Mark Rented)' : 'Mark as Rented')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
