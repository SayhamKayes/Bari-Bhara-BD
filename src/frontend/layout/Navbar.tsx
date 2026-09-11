import React from 'react';
import { Role } from '../../types';
import { Building2, Home, ShieldCheck, BookOpen, PlusCircle, Globe, Sparkles, UserCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  language: 'bn' | 'en';
  onLanguageToggle: () => void;
  onOpenAddModal: () => void;
  pendingAdminCount: number;
  visitRequestsCount: number;
  isAuthenticated: boolean;
  currentUser?: any;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageToggle,
  onOpenAddModal,
  pendingAdminCount,
  visitRequestsCount,
  isAuthenticated,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const isBn = language === 'bn';
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to determine active tab based on pathname
  const getActiveTab = () => {
    if (location.pathname === '/landlord') return 'landlord';
    if (location.pathname === '/tenant') return 'my-dashboard';
    if (location.pathname === '/admin') return 'admin';
    if (location.pathname === '/guide') return 'guide';
    return 'browse';
  };
  
  const activeTab = getActiveTab();

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
            onClick={() => navigate('/')}
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

          {/* Action Center: Controls */}
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

            {/* User Profile & Logout - Only show if authenticated */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-[#23471E] hover:bg-[#1E3E1A] p-1.5 pr-3 rounded-full border border-[#396D32] transition-colors focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#E9EDC9] flex items-center justify-center text-[#2D5A27] font-bold text-xs shrink-0 overflow-hidden">
                      {currentUser?.avatar_url ? (
                        <img src={currentUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : <UserCheck className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-white max-w-[100px] truncate">
                      {currentUser?.full_name || (isBn ? 'ইউজার' : 'User')}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E5E0D8] py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-[#E5E0D8] mb-1">
                          <p className="text-xs font-bold text-[#354231] truncate">{currentUser?.full_name}</p>
                          <p className="text-[10px] text-[#5A6D56] uppercase mt-0.5">{currentRole}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (currentRole === 'ADMIN') navigate('/admin');
                            else if (currentRole === 'LANDLORD') navigate('/landlord');
                            else navigate('/tenant');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-[#354231] hover:bg-[#F5F2EC] transition-colors"
                        >
                          {isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-xs font-medium text-[#354231] hover:bg-[#F5F2EC] transition-colors"
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/profile');
                          }}
                        >
                          {isBn ? 'প্রোফাইল / সেটিংস' : 'Profile / Settings'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-rose-500/20 text-[#E9EDC9] hover:text-rose-400 border border-transparent hover:border-rose-500/50 transition-all"
                  title="Logout"
                >
                  {isBn ? 'লগআউট' : 'Logout'}
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-[#D4A373] hover:bg-[#C09262] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isBn ? 'অ্যাকাউন্ট' : 'Account'}</span>
              </button>
            )}

            {/* Post Property Quick Button for Landlords */}
            {isAuthenticated && currentRole === 'LANDLORD' && (
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
