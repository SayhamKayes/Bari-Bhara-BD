import React, { useState } from 'react';
import { Property, VisitRequest, User } from '../../types';
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
  Users,
  ShieldAlert,
  Upload,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LandlordViewProps {
  properties: Property[];
  visitRequests: VisitRequest[];
  onOpenAddModal: () => void;
  onToggleRentedStatus: (propertyId: string) => void;
  onAcceptVisitRequest: (requestId: string) => void;
  onDeclineVisitRequest: (requestId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  language: 'bn' | 'en';
  onSelectProperty: (property: Property) => void;
  currentUser: User | null;
  onVerificationSubmit: () => void;
  onEditProperty: (property: Property) => void;
}

export const LandlordView: React.FC<LandlordViewProps> = ({
  properties,
  visitRequests,
  onOpenAddModal,
  onToggleRentedStatus,
  onAcceptVisitRequest,
  onDeclineVisitRequest,
  onDeleteProperty,
  language,
  onSelectProperty,
  currentUser,
  onVerificationSubmit,
  onEditProperty
}) => {
  const isBn = language === 'bn';
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);
  const [isUploadingNid, setIsUploadingNid] = useState(false);
  const [nidError, setNidError] = useState('');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const activeCount = properties.filter(p => p.status === 'ACTIVE').length;
  const pendingCount = properties.filter(p => p.status === 'PENDING').length;
  const rentedCount = properties.filter(p => p.status === 'RENTED').length;

  const handleNidSubmit = async () => {
    if (!nidFront || !nidBack || !currentUser) return;
    setIsUploadingNid(true);
    setNidError('');
    try {
      const frontExt = nidFront.name.split('.').pop();
      const backExt = nidBack.name.split('.').pop();
      const frontPath = `${currentUser.id}/front_${Date.now()}.${frontExt}`;
      const backPath = `${currentUser.id}/back_${Date.now()}.${backExt}`;

      const [frontRes, backRes] = await Promise.all([
        supabase.storage.from('verification-documents').upload(frontPath, nidFront),
        supabase.storage.from('verification-documents').upload(backPath, nidBack)
      ]);

      if (frontRes.error) throw frontRes.error;
      if (backRes.error) throw backRes.error;

      const { data: frontUrlData } = supabase.storage.from('verification-documents').getPublicUrl(frontPath);
      const { data: backUrlData } = supabase.storage.from('verification-documents').getPublicUrl(backPath);

      const { error: updateError } = await supabase.from('users').update({
        nid_front_url: frontUrlData.publicUrl,
        nid_back_url: backUrlData.publicUrl
      }).eq('id', currentUser.id);

      if (updateError) throw updateError;
      
      onVerificationSubmit();
      setNidFront(null);
      setNidBack(null);
    } catch (err: any) {
      setNidError(err.message || 'Failed to upload NID');
    } finally {
      setIsUploadingNid(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Verification Banner */}
      {currentUser && !currentUser.is_verified && (
        <div className="bg-[#FFF8E6] border border-[#F4E1A1] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-[#D4A373] shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#8C6D44] mb-1">
                {isBn ? 'অ্যাকাউন্ট ভেরিফিকেশন প্রয়োজন' : 'Account Verification Required'}
              </h3>
              <p className="text-[#5A6D56] text-sm mb-4">
                {isBn 
                  ? 'আপনার প্রপার্টিতে "Verified Landlord" ব্যাজ পেতে এবং ভাড়াটিয়াদের আস্থা অর্জন করতে আপনার জাতীয় পরিচয়পত্র (NID) আপলোড করুন। এটি সম্পূর্ণ সুরক্ষিত এবং শুধুমাত্র অ্যাডমিনদের কাছে দৃশ্যমান।' 
                  : 'Upload your National Identity Card (NID) to get the "Verified Landlord" badge and earn tenant trust. This is fully secure and only visible to admins.'}
              </p>
              
              {currentUser.nid_front_url ? (
                <div className="flex items-center gap-2 text-sm font-bold text-[#8C6D44] bg-[#F4E1A1]/30 p-3 rounded-xl border border-[#F4E1A1]">
                  <Clock className="w-4 h-4" />
                  {isBn ? 'আপনার NID রিভিউয়ের জন্য অপেক্ষমান রয়েছে। অ্যাডমিন প্যানেল থেকে খুব শীঘ্রই এটি যাচাই করা হবে।' : 'Your NID is under review. An admin will verify it shortly.'}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-[#F4E1A1] space-y-4 max-w-xl">
                  {nidError && <div className="text-red-500 text-xs font-bold">{nidError}</div>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#354231] mb-1.5">{isBn ? 'NID এর সামনের ছবি' : 'NID Front Image'}</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setNidFront(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-[#5A6D56] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#E9EDC9] file:text-[#2D5A27] hover:file:bg-[#CCD5AE] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#354231] mb-1.5">{isBn ? 'NID এর পেছনের ছবি' : 'NID Back Image'}</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setNidBack(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-[#5A6D56] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#E9EDC9] file:text-[#2D5A27] hover:file:bg-[#CCD5AE] transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleNidSubmit}
                    disabled={!nidFront || !nidBack || isUploadingNid}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 bg-[#D4A373] text-white rounded-xl text-sm font-bold hover:bg-[#C29362] transition-colors disabled:opacity-50"
                  >
                    {isUploadingNid ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isBn ? 'সাবমিট করুন' : 'Submit NID'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentUser?.is_verified && (
        <div className="bg-[#E9EDC9] border border-[#CCD5AE] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#2D5A27]" />
          <span className="text-[#2D5A27] font-bold text-sm">
            {isBn ? 'অভিনন্দন! আপনি একজন ভেরিফায়েড বাড়িওয়ালা।' : 'Congratulations! You are a verified landlord.'}
          </span>
        </div>
      )}
      
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
                      prop.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      'bg-[#F5F2EC] text-[#5A6D56] border border-[#E5E0D8]'
                    }`}>
                      {prop.status === 'ACTIVE' ? (isBn ? 'সক্রিয় (খালি)' : 'Active') :
                       prop.status === 'PENDING' ? (isBn ? 'অনুমোদনের অপেক্ষায়' : 'Pending Approval') :
                       prop.status === 'REJECTED' ? (isBn ? 'বাতিলকৃত' : 'Rejected') :
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
                <div className="flex gap-1">
                  <button
                    onClick={() => onDeleteProperty(prop.id)}
                    className="text-rose-500 hover:text-rose-700 bg-rose-50 px-2 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    {isBn ? 'ডিলিট' : 'Delete'}
                  </button>
                  <button
                    onClick={() => onEditProperty(prop)}
                    className="text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors"
                  >
                    {isBn ? 'এডিট' : 'Edit'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="text-[#2D5A27] hover:text-[#D4A373] font-bold"
                  >
                    {isBn ? 'বিস্তারিত' : 'View'}
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
                      ? (isBn ? 'খালি করুন' : 'Mark Available')
                      : (isBn ? 'ভাড়া হয়েছে' : 'Mark Rented')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
