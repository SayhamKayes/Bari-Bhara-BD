import React, { useState } from 'react';
import { Role, Property, FilterState, VisitRequest } from './types';
import { INITIAL_PROPERTIES } from './data/mockProperties';
import { Navbar } from './components/Navbar';
import { TenantView } from './components/TenantView';
import { LandlordView } from './components/LandlordView';
import { AdminView } from './components/AdminView';
import { GuideView } from './components/GuideView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { ChatDrawer } from './components/ChatDrawer';
import { 
  Building2, 
  Heart, 
  Sparkles, 
  HelpCircle, 
  CheckCircle,
  PhoneCall,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('TENANT');
  const [activeTab, setActiveTab] = useState<'browse' | 'landlord' | 'admin' | 'guide' | 'my-requests'>('browse');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Application Data State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [favorites, setFavorites] = useState<string[]>(['prop-1']);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([
    {
      id: 'req-1',
      propertyId: 'prop-1',
      propertyTitle: 'Spacious 3-Bed Family Flat in Dhanmondi',
      tenantName: 'Sabbir Hossain',
      tenantPhone: '+880 1718-990011',
      preferredDate: '2026-08-28',
      preferredTime: 'Afternoon (02:00 PM - 04:00 PM)',
      message: 'আমরা ৩ জনের ফ্যামিলি। বাসাটি সরাসরি দেখতে আসতে চাই।',
      status: 'PENDING',
      createdAt: '2026-08-23'
    }
  ]);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    propertyType: 'ALL',
    category: 'ALL',
    city: 'All Divisions',
    area: '',
    minPrice: 0,
    maxPrice: 200000,
    bedrooms: 'ALL',
    gasType: 'ALL',
    amenities: []
  });

  // Modal States
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [chatProperty, setChatProperty] = useState<Property | null>(null);

  // Actions
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      propertyType: 'ALL',
      category: 'ALL',
      city: 'All Divisions',
      area: '',
      minPrice: 0,
      maxPrice: 200000,
      bedrooms: 'ALL',
      gasType: 'ALL',
      amenities: []
    });
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
  };

  const handleApproveProperty = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'ACTIVE', isVerified: true } : p))
    );
  };

  const handleRejectProperty = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'REJECTED' } : p))
    );
  };

  const handleToggleVerification = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
  };

  const handleToggleRentedStatus = (id: string) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'RENTED' ? 'ACTIVE' : 'RENTED';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleScheduleVisit = (requestData: Omit<VisitRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: VisitRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVisitRequests(prev => [newReq, ...prev]);
  };

  const handleAcceptVisitRequest = (requestId: string) => {
    setVisitRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'ACCEPTED' } : r))
    );
  };

  const handleDeclineVisitRequest = (requestId: string) => {
    setVisitRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'DECLINED' } : r))
    );
  };

  const pendingAdminCount = properties.filter(p => p.status === 'PENDING').length;
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#354231] flex flex-col font-sans selection:bg-[#CCD5AE]">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onLanguageToggle={() => setLanguage(l => (l === 'bn' ? 'en' : 'bn'))}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        pendingAdminCount={pendingAdminCount}
        visitRequestsCount={visitRequests.filter(r => r.status === 'PENDING').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'browse' && (
          <TenantView
            properties={properties}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            language={language}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={setSelectedProperty}
            onOpenChat={(prop) => setChatProperty(prop)}
          />
        )}

        {activeTab === 'landlord' && (
          <LandlordView
            properties={properties}
            visitRequests={visitRequests}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onToggleRentedStatus={handleToggleRentedStatus}
            onAcceptVisitRequest={handleAcceptVisitRequest}
            onDeclineVisitRequest={handleDeclineVisitRequest}
            language={language}
            onSelectProperty={setSelectedProperty}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            properties={properties}
            onApproveProperty={handleApproveProperty}
            onRejectProperty={handleRejectProperty}
            onToggleVerification={handleToggleVerification}
            language={language}
            onSelectProperty={setSelectedProperty}
          />
        )}

        {activeTab === 'guide' && (
          <GuideView language={language} />
        )}
      </main>

      {/* Modals & Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        language={language}
        onScheduleVisit={handleScheduleVisit}
        onOpenChat={(prop) => {
          setSelectedProperty(null);
          setChatProperty(prop);
        }}
      />

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProperty={handleAddProperty}
        language={language}
      />

      <ChatDrawer
        property={chatProperty}
        isOpen={!!chatProperty}
        onClose={() => setChatProperty(null)}
        language={language}
        currentRole={currentRole}
      />

      {/* Footer */}
      <footer className="bg-[#F5F2EC] border-t border-[#E5E0D8] py-6 px-4 text-xs text-[#5A6D56] mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-[#2D5A27] text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <div className="w-5 h-5 bg-[#D4A373] text-white rounded-full flex items-center justify-center font-bold text-xs">ব</div>
              <span>বাসা খোঁজা • বাড়িভাড়া বিডি (Basa Khoja RentBD)</span>
            </div>
            <p className="mt-1 text-[#5A6D56]">
              {isBn 
                ? 'বাংলাদেশের জন্য নিরাপদ, দালালমুক্ত ও রিয়েল-টাইম বাসা/দোকান ভাড়ার আধুনিক প্ল্যাটফর্ম।' 
                : 'Modern, real-time rental property discovery platform tailored for Bangladesh.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#8F9E8B] bg-[#E9EDC9]/50 border border-[#CCD5AE] px-3 py-1 rounded-full">
              PostgreSQL • Django 4.2 API • Channels
            </span>
            <button 
              onClick={() => setActiveTab('guide')}
              className="text-[#2D5A27] hover:text-[#D4A373] font-bold flex items-center gap-1 transition-colors"
            >
              <span>{isBn ? '📘 ফুল-স্ট্যাক রোডম্যাপ' : '📘 Full-Stack Roadmap'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
