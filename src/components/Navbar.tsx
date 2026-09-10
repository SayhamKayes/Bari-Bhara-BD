import React from 'react';
import { Role } from '../types';
import { Building2, Home, ShieldCheck, BookOpen, PlusCircle, Globe, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeTab: 'browse' | 'landlord' | 'admin' | 'guide' | 'my-requests';
  onTabChange: (tab: 'browse' | 'landlord' | 'admin' | 'guide' | 'my-requests') => void;
  language: 'bn' | 'en';
  onLanguageToggle: () => void;
  onOpenAddModal: () => void;
  pendingAdminCount: number;
  visitRequestsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  language,
  onLanguageToggle,
  onOpenAddModal,
  pendingAdminCount,
  visitRequestsCount
}) => {
  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 bg-[#2D5A27] text-white shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-[#23471E] text-[#E9EDC9] text-xs py-1 px-4 text-center flex items-center justify-center gap-2 font-medium border-b border-[#396D32]">
        <Sparkles className="w-3.5 h-3.5 text-[#D4A373] animate-pulse" />
        <span>
          {isBn
            ? '🇧🇩 বাংলাদেশে ফ্ল্যাট, স্টুডেন্ট মেস ও বাণিজ্যিক দোকান ভাড়ার আধুনিক প্ল্যাটফর্ম • PostgreSQL & Django 4.2'
            : '🇧🇩 Modern Rental Housing & Commercial Store Discovery for Bangladesh'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => onTabChange('browse')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-full bg-[#D4A373] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              ব
            </div>
            <div>
              <div className="font-bold text-lg leading-none text-white flex items-center gap-1.5">
                <span className="tracking-tight">{isBn ? 'বাসা খোঁজা' : 'Basa Khoja'}</span>
                <span className="text-[10px] bg-[#E9EDC9] text-[#2D5A27] font-extrabold px-1.5 py-0.5 rounded">
                  RentBD
                </span>
              </div>
              <p className="text-[11px] text-[#CCD5AE] font-medium mt-0.5">
                {isBn ? 'ফ্ল্যাট • মেস রুম • বাণিজ্যিক দোকান' : 'Flat • Student Room • Store'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-browse"
              onClick={() => onTabChange('browse')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-[#E9EDC9] text-[#2D5A27] font-bold shadow-xs'
                  : 'text-white/90 hover:text-white hover:bg-[#23471E]'
              }`}
            >
              <Home className="w-4 h-4" />
              {isBn ? 'বাসা ও দোকান খুঁজুন' : 'Browse Listings'}
            </button>

            {currentRole === 'LANDLORD' && (
              <button
                id="nav-tab-landlord"
                onClick={() => onTabChange('landlord')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'landlord'
                    ? 'bg-[#E9EDC9] text-[#2D5A27] font-bold shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-[#23471E]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {isBn ? 'মালিক ড্যাশবোর্ড' : 'Owner Dashboard'}
                {visitRequestsCount > 0 && (
                  <span className="bg-[#D4A373] text-white text-xs px-1.5 py-0.2 rounded-full font-bold">
                    {visitRequestsCount}
                  </span>
                )}
              </button>
            )}

            {currentRole === 'ADMIN' && (
              <button
                id="nav-tab-admin"
                onClick={() => onTabChange('admin')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-[#E9EDC9] text-[#2D5A27] font-bold shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-[#23471E]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
                {pendingAdminCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">
                    {pendingAdminCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="nav-tab-guide"
              onClick={() => onTabChange('guide')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-[#D4A373] text-white font-bold shadow-xs'
                  : 'text-[#E9EDC9] hover:bg-[#23471E] hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#FAEDCD]" />
              {isBn ? '📘 ডেভেলপমেন্ট গাইড' : '📘 Roadmap Guide'}
            </button>
          </nav>

          {/* Action Center: Role Selector & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Toggle */}
            <button
              id="btn-toggle-lang"
              onClick={onLanguageToggle}
              className="p-2 text-white/90 hover:text-white hover:bg-[#23471E] rounded-xl text-xs font-semibold flex items-center gap-1 border border-[#396D32]"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-[#23471E] p-1 rounded-2xl border border-[#396D32] text-xs">
              <button
                id="role-btn-tenant"
                onClick={() => {
                  onRoleChange('TENANT');
                  if (activeTab === 'admin' || activeTab === 'landlord') onTabChange('browse');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                  currentRole === 'TENANT'
                    ? 'bg-[#E9EDC9] text-[#2D5A27] shadow-xs font-bold'
                    : 'text-[#CCD5AE] hover:text-white'
                }`}
              >
                {isBn ? 'ভাড়াটিয়া' : 'Tenant'}
              </button>
              <button
                id="role-btn-landlord"
                onClick={() => {
                  onRoleChange('LANDLORD');
                  onTabChange('landlord');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                  currentRole === 'LANDLORD'
                    ? 'bg-[#D4A373] text-white shadow-xs font-bold'
                    : 'text-[#CCD5AE] hover:text-white'
                }`}
              >
                {isBn ? 'বাড়িওয়ালা' : 'Owner'}
              </button>
              <button
                id="role-btn-admin"
                onClick={() => {
                  onRoleChange('ADMIN');
                  onTabChange('admin');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                  currentRole === 'ADMIN'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-[#CCD5AE] hover:text-white'
                }`}
              >
                {isBn ? 'অ্যাডমিন' : 'Admin'}
              </button>
            </div>

            {/* Post Property Quick Button for Landlords */}
            {currentRole === 'LANDLORD' && (
              <button
                id="btn-post-property"
                onClick={onOpenAddModal}
                className="bg-[#D4A373] hover:bg-[#C09262] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{isBn ? 'বিজ্ঞাপন দিন' : 'Upload Details'}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
