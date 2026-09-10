import React, { useState, useEffect } from 'react';
import { Role, Property, FilterState, VisitRequest } from './types';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TenantView } from './components/TenantView';
import { LandlordView } from './components/LandlordView';
import { AdminView } from './components/AdminView';
import { GuideView } from './components/GuideView';
import { TenantDashboardView } from './components/TenantDashboardView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AdvertisementSlider } from './components/AdvertisementSlider';
import { supabase, mapDbPropertyToFrontend, mapDbVisitRequestToFrontend } from './lib/supabase';
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
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<Role>('TENANT');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUserId(session.user.id);
        fetchUserRole(session.user.id);
      } else {
        setIsLoadingAuth(false);
        setCurrentRole('TENANT');
        setCurrentUserId(null);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUserId(session.user.id);
        fetchUserRole(session.user.id);
      } else {
        setIsAuthenticated(false);
        setCurrentRole('TENANT');
        setCurrentUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setCurrentRole(data.role as Role);
        setCurrentUser(data);
        if (data.role === 'TENANT') {
          fetchFavorites(userId);
        }
        if (data.role === 'ADMIN') {
          fetchPendingVerifications();
        }
      }
    } catch (err) {
      console.error('Error fetching role:', err);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_verified', false)
        .not('nid_front_url', 'is', null);
      if (!error && data) {
        setPendingVerifications(data);
      }
    } catch (err) {}
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);
      if (!error && data) {
        setFavorites(data.map(f => f.property_id));
      }
    } catch (err) {}
  };

  // Application Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select(`*, users!properties_landlord_id_fkey(full_name, phone_number, avatar_url, is_verified)`)
        .order('created_at', { ascending: false });
      
      if (!propError && propData) {
        setProperties(propData.map(mapDbPropertyToFrontend));
      }

      // Also fetch visit requests
      const { data: reqData, error: reqError } = await supabase
        .from('visit_requests')
        .select(`*, properties(title), users!visit_requests_tenant_id_fkey(full_name, phone_number)`)
        .order('created_at', { ascending: false });
      
      if (!reqError && reqData) {
        setVisitRequests(reqData.map(mapDbVisitRequestToFrontend));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentRole]);

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
  const handleToggleFavorite = async (id: string) => {
    if (!currentUserId) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(f => f !== id));
      await supabase.from('favorites').delete().match({ user_id: currentUserId, property_id: id });
    } else {
      setFavorites(prev => [...prev, id]);
      await supabase.from('favorites').insert({ user_id: currentUserId, property_id: id });
    }
  };

  const handleUpdateProfile = async (name: string, phone: string) => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: name, phone_number: phone })
        .eq('id', currentUserId);
        
      if (!error) {
        setCurrentUser(prev => ({ ...prev, full_name: name, phone_number: phone }));
      }
    } catch (err) {}
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

  const handleAddProperty = async (newProp: Property) => {
    // We will do the insert directly in AddPropertyModal, 
    // here we just refresh the data
    fetchData();
  };

  const handleApproveProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'ACTIVE', is_verified: true })
        .eq('id', id);
      if (!error) fetchData();
    } catch (err) {}
  };

  const handleApproveLandlord = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId);
      if (!error) fetchPendingVerifications();
    } catch (err) {}
  };

  const handleRejectProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'REJECTED' })
        .eq('id', id);
      if (!error) fetchData();
    } catch (err) {}
  };

  const handleToggleVerification = async (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_verified: !prop.isVerified })
        .eq('id', id);
      if (!error) fetchData();
    } catch (err) {}
  };

  const handleToggleRentedStatus = async (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    try {
      const nextStatus = prop.status === 'RENTED' ? 'ACTIVE' : 'RENTED';
      const { error } = await supabase
        .from('properties')
        .update({ status: nextStatus })
        .eq('id', id);
      if (!error) fetchData();
    } catch (err) {}
  };

  const handleScheduleVisit = async (requestData: Omit<VisitRequest, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        setIsAuthModalOpen(true);
        return;
      }
      
      const { error } = await supabase
        .from('visit_requests')
        .insert({
          property_id: requestData.propertyId,
          tenant_id: sessionData.session.user.id,
          preferred_date: requestData.preferredDate,
          preferred_time: requestData.preferredTime,
          message: requestData.message,
          status: 'PENDING'
        });
        
      if (!error) fetchData();
    } catch (err) {}
  };

  const handleAcceptVisitRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('visit_requests')
        .update({ status: 'ACCEPTED' })
        .eq('id', requestId);
      if (!error) fetchData();
    } catch (err) {}
  };

  const handleDeclineVisitRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('visit_requests')
        .update({ status: 'DECLINED' })
        .eq('id', requestId);
      if (!error) fetchData();
    } catch (err) {}
  };

  const pendingAdminCount = properties.filter(p => p.status === 'PENDING').length;
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#354231] flex flex-col font-sans selection:bg-[#CCD5AE]">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        language={language}
        onLanguageToggle={() => setLanguage(l => (l === 'bn' ? 'en' : 'bn'))}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        pendingAdminCount={pendingAdminCount}
        visitRequestsCount={visitRequests.filter(r => r.status === 'PENDING').length}
        isAuthenticated={isAuthenticated}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={async () => {
          await supabase.auth.signOut();
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={
            <>
              <AdvertisementSlider language={language} />
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
            </>
          } />

          <Route path="/landlord" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoadingAuth={isLoadingAuth} currentRole={currentRole} allowedRoles={['LANDLORD', 'ADMIN']}>
              <LandlordView
                properties={properties.filter(p => p.landlordId === currentUserId)}
                visitRequests={visitRequests}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onToggleRentedStatus={handleToggleRentedStatus}
                onAcceptVisitRequest={handleAcceptVisitRequest}
                onDeclineVisitRequest={handleDeclineVisitRequest}
                language={language}
                onSelectProperty={setSelectedProperty}
                currentUser={currentUser}
                onVerificationSubmit={() => fetchUserRole(currentUserId!)}
              />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoadingAuth={isLoadingAuth} currentRole={currentRole} allowedRoles={['ADMIN']}>
              <AdminView
                properties={properties}
                pendingVerifications={pendingVerifications}
                onApproveProperty={handleApproveProperty}
                onRejectProperty={handleRejectProperty}
                onToggleVerification={handleToggleVerification}
                onApproveLandlord={handleApproveLandlord}
                language={language}
                onSelectProperty={setSelectedProperty}
              />
            </ProtectedRoute>
          } />

          <Route path="/tenant" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoadingAuth={isLoadingAuth} currentRole={currentRole} allowedRoles={['TENANT', 'ADMIN', 'LANDLORD']}>
              <TenantDashboardView
                currentUser={currentUser}
                visitRequests={visitRequests}
                properties={properties}
                favorites={favorites}
                language={language}
                onRemoveFavorite={handleToggleFavorite}
                onSelectProperty={setSelectedProperty}
                onUpdateProfile={handleUpdateProfile}
              />
            </ProtectedRoute>
          } />

          <Route path="/guide" element={<GuideView language={language} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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
        currentUserId={currentUserId}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onLogin={(role) => {
          setIsAuthenticated(true);
          setCurrentRole(role);
          setIsAuthModalOpen(false);
          if (role === 'ADMIN') navigate('/admin');
          else if (role === 'LANDLORD') navigate('/landlord');
          else navigate('/tenant');
        }}
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
              onClick={() => navigate('/guide')}
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

const ProtectedRoute = ({ 
  isAuthenticated, 
  isLoadingAuth,
  currentRole, 
  allowedRoles, 
  children 
}: { 
  isAuthenticated: boolean; 
  isLoadingAuth: boolean;
  currentRole: Role; 
  allowedRoles: Role[]; 
  children: React.ReactNode;
}) => {
  if (isLoadingAuth) return <div className="flex h-[50vh] items-center justify-center text-[#5A6D56]">Loading authentication...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;
  if (!allowedRoles.includes(currentRole)) return <Navigate to="/" />;
  return <>{children}</>;
};
