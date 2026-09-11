import React, { useState } from 'react';
import { Property, User } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Building2, 
  DollarSign, 
  Sparkles,
  Search,
  Check,
  X,
  FileCheck,
  Flame,
  MapPin,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminViewProps {
  properties: Property[];
  pendingVerifications: User[];
  onApproveProperty: (id: string) => void;
  onRejectProperty: (id: string) => void;
  onToggleVerification: (id: string) => void;
  onApproveLandlord: (userId: string) => void;
  language: 'bn' | 'en';
  onSelectProperty: (property: Property) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  properties,
  pendingVerifications,
  onApproveProperty,
  onRejectProperty,
  onToggleVerification,
  onApproveLandlord,
  language,
  onSelectProperty
}) => {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'properties' | 'landlords'>('properties');

  const pendingListings = properties.filter(p => p.status === 'PENDING');
  const activeListings = properties.filter(p => p.status === 'ACTIVE');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const handleApprove = (id: string) => {
    onApproveProperty(id);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Header */}
      <div className="bg-[#233520] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-[#344830]">
        <div>
          <div className="text-xs bg-[#D4A373]/20 text-[#FAEDCD] border border-[#D4A373]/40 px-3 py-1 rounded-full inline-block font-semibold mb-2">
            {isBn ? '🛡️ সিস্টেম অ্যাডমিন কন্ট্রোল সেন্টার' : '🛡️ Super Admin Control Center'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isBn ? 'বাড়িভাড়া বিডি সার্বিক প্ল্যাটফর্ম ব্যবস্থাপনা' : 'Basa Khoja BD Platform Moderation'}
          </h1>
          <p className="text-[#CCD5AE] text-xs sm:text-sm mt-1">
            {isBn 
              ? 'নতুন প্রপার্টি লিস্টিং যাচাইকরণ, ভুয়া লিস্টিং ফিল্টারিং এবং বাড়িওয়ালাদের NID ভেরিফিকেশন ম্যানেজ করুন।' 
              : 'Review submitted property listings, moderate scam reports, and verify Landlord NID credentials.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1A2818] px-4 py-2.5 rounded-2xl border border-[#344830] text-xs text-[#E9EDC9]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373] animate-pulse"></span>
          <span>{isBn ? 'সিস্টেম রিয়েল-টাইম সিঙ্ক সক্রিয়' : 'Real-time Sync Active'}</span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs">
          <span className="text-xs text-[#5A6D56] font-medium block mb-1">{isBn ? 'মোট বিজ্ঞাপিত প্রপার্টি' : 'Total Listings'}</span>
          <span className="text-2xl font-black text-[#354231]">{properties.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/40 bg-[#FAEDCD]/30 shadow-2xs">
          <span className="text-xs text-[#8C6D44] font-bold block mb-1">{isBn ? 'অনুমোদনের অপেক্ষায় (Pending)' : 'Pending Review'}</span>
          <span className="text-2xl font-black text-[#D4A373]">{pendingListings.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#CCD5AE] bg-[#E9EDC9]/30 shadow-2xs">
          <span className="text-xs text-[#2D5A27] font-bold block mb-1">{isBn ? 'যাচাইকৃত (Verified)' : 'Verified Units'}</span>
          <span className="text-2xl font-black text-[#2D5A27]">{properties.filter(p => p.isVerified).length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] bg-[#F5F2EC] shadow-2xs">
          <span className="text-xs text-[#5A6D56] font-medium block mb-1">{isBn ? 'সক্রিয় ভাড়াটিয়া ট্রাফিক' : 'Live User Traffic'}</span>
          <span className="text-2xl font-black text-[#354231]">1,420+</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E0D8] mb-6 mt-8">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'properties' 
              ? 'border-[#2D5A27] text-[#2D5A27]' 
              : 'border-transparent text-[#8F9E8B] hover:text-[#5A6D56]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {isBn ? 'প্রপার্টি ভেরিফিকেশন' : 'Property Approvals'}
        </button>
        <button
          onClick={() => setActiveTab('landlords')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'landlords' 
              ? 'border-[#2D5A27] text-[#2D5A27]' 
              : 'border-transparent text-[#8F9E8B] hover:text-[#5A6D56]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          {isBn ? 'বাড়িওয়ালা ভেরিফিকেশন' : 'Landlord Verifications'}
          {pendingVerifications.length > 0 && (
            <span className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingVerifications.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'properties' ? (
        <div className="space-y-8">
          {/* Section 1: Pending Approvals Queue */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#354231] flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#2D5A27]" />
                  <span>{isBn ? 'নতুন লিস্টিং যাচাই ও অনুমোদন কিউ (Pending Approvals)' : 'Pending Property Verification Queue'}</span>
                </h2>
                <p className="text-xs text-[#5A6D56]">
                  {isBn ? 'বাড়িওয়ালাদের দেওয়া প্রপার্টির ছবি, ঠিকানা ও ভাড়া সঠিক কিনা যাচাই করে অনুমোদন দিন' : 'Review listing details, location, and authentic photos before going live'}
                </p>
              </div>
              <span className="text-xs bg-[#FAEDCD] text-[#8C6D44] border border-[#D4A373]/40 font-bold px-3 py-1 rounded-full">
                {pendingListings.length} {isBn ? 'টি অপেক্ষমান' : 'pending'}
              </span>
            </div>

            {pendingListings.length > 0 ? (
              <div className="space-y-4">
                {pendingListings.map(prop => (
                  <div
                    key={prop.id}
                    className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:border-[#CCD5AE] transition-colors"
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="w-28 h-24 rounded-2xl object-cover shrink-0 border border-[#E5E0D8]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAEDCD] text-[#8C6D44] border border-[#D4A373]/30 uppercase">
                            {prop.propertyType}
                          </span>
                          <span className="text-xs font-black text-[#2D5A27]">
                            ৳{formatBDT(prop.rentAmount)}/মাস
                          </span>
                        </div>

                        <h4 
                          onClick={() => onSelectProperty(prop)}
                          className="font-bold text-sm text-[#354231] cursor-pointer hover:text-[#2D5A27]"
                        >
                          {isBn ? prop.titleBn : prop.title}
                        </h4>

                        <div className="flex items-center gap-1 text-xs text-[#5A6D56]">
                          <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{prop.addressBn || prop.address}</span>
                        </div>

                        <div className="text-xs text-[#5A6D56] font-medium">
                          {isBn ? 'মালিক:' : 'Landlord:'} {prop.landlordName} ({prop.landlordPhone})
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="px-3.5 py-2 rounded-xl border border-[#E5E0D8] hover:bg-[#F5F2EC] text-[#5A6D56] text-xs font-semibold"
                      >
                        {isBn ? 'পর্যবেক্ষণ' : 'Preview'}
                      </button>
                      <button
                        onClick={() => handleApprove(prop.id)}
                        className="bg-[#2D5A27] hover:bg-[#23471E] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isBn ? 'অনুমোদন ও ভেরিফাই' : 'Approve & Verify'}</span>
                      </button>
                      <button
                        onClick={() => onRejectProperty(prop.id)}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>{isBn ? 'বাতিল' : 'Reject'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-[#5A6D56] text-xs bg-[#FDFBF7] rounded-2xl border border-dashed border-[#CCD5AE]">
                <CheckCircle2 className="w-8 h-8 text-[#2D5A27] mx-auto mb-2 opacity-80" />
                <p className="font-bold text-[#354231]">{isBn ? 'সব লিস্টিং অনুমোদিত হয়েছে!' : 'All listings are approved & verified.'}</p>
                <p className="text-[#8F9E8B]">{isBn ? 'বর্তমানে অনুমোদনের অপেক্ষায় কোনো প্রপার্টি নেই।' : 'No pending property submissions in the moderation queue.'}</p>
              </div>
            )}
          </div>

          {/* Section 2: All Active Listings Control */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#354231] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2D5A27]" />
                  <span>{isBn ? 'সক্রিয় প্ল্যাটফর্ম প্রপার্টি ও ভেরিফিকেশন ব্যাজ' : 'All Platform Properties & Verification Status'}</span>
                </h2>
                <p className="text-xs text-[#5A6D56]">
                  {isBn ? 'যেকোনো প্রপার্টির ভেরিফাইড ট্রাস্ট ব্যাজ অন বা অফ করুন' : 'Toggle trust badges and monitor live rentals'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E0D8] text-[#5A6D56] font-semibold bg-[#F5F2EC]">
                    <th className="p-3">{isBn ? 'প্রপার্টি' : 'Property'}</th>
                    <th className="p-3">{isBn ? 'টাইপ' : 'Type'}</th>
                    <th className="p-3">{isBn ? 'এলাকা' : 'Area'}</th>
                    <th className="p-3">{isBn ? 'ভাড়া' : 'Rent'}</th>
                    <th className="p-3">{isBn ? 'মালিক' : 'Landlord'}</th>
                    <th className="p-3">{isBn ? 'ভেরিফাইড ব্যাজ' : 'Verification'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-[#FDFBF7]">
                      <td className="p-3 font-semibold text-[#354231] flex items-center gap-2">
                        <img src={p.images[0]} alt="thumb" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover border border-[#E5E0D8]" />
                        <span className="truncate max-w-[200px]">{isBn ? p.titleBn : p.title}</span>
                      </td>
                      <td className="p-3 text-[#5A6D56]">{p.propertyType}</td>
                      <td className="p-3 text-[#5A6D56]">{p.area}</td>
                      <td className="p-3 font-bold text-[#2D5A27]">৳{formatBDT(p.rentAmount)}</td>
                      <td className="p-3 text-[#5A6D56]">{p.landlordName}</td>
                      <td className="p-3">
                        <button
                          onClick={() => onToggleVerification(p.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                            p.isVerified
                              ? 'bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE]'
                              : 'bg-[#F5F2EC] text-[#8F9E8B] hover:bg-stone-200 border border-[#E5E0D8]'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{p.isVerified ? (isBn ? 'ভেরিফাইড ✓' : 'Verified ✓') : (isBn ? 'আন-ভেরিফাইড' : 'Unverified')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#354231] mb-6 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#D4A373]" />
            {isBn ? 'অপেক্ষমান বাড়িওয়ালা ভেরিফিকেশন' : 'Pending Landlord Verifications'}
          </h2>

          {pendingVerifications.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-12 h-12 text-[#CCD5AE] mx-auto mb-3" />
              <p className="text-[#5A6D56] font-medium">{isBn ? 'কোনো নতুন ভেরিফিকেশন রিকোয়েস্ট নেই।' : 'No pending verification requests.'}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingVerifications.map(user => (
                <div key={user.id} className="border border-[#E5E0D8] bg-[#FDFBF7] p-5 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#354231]">{user.full_name}</h3>
                        <p className="text-sm text-[#5A6D56] font-mono mt-1">{user.phone_number}</p>
                      </div>
                      <button
                        onClick={() => onApproveLandlord(user.id)}
                        className="bg-[#2D5A27] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#23471E] transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isBn ? 'ভেরিফাই করুন' : 'Verify Landlord'}
                      </button>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-[#8C6D44] uppercase">{isBn ? 'NID সামনের অংশ' : 'NID Front'}</p>
                        <img src={user.nid_front_url} alt="NID Front" className="w-full h-40 object-cover rounded-xl border-2 border-[#E9EDC9]" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-[#8C6D44] uppercase">{isBn ? 'NID পেছনের অংশ' : 'NID Back'}</p>
                        <img src={user.nid_back_url} alt="NID Back" className="w-full h-40 object-cover rounded-xl border-2 border-[#E9EDC9]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
