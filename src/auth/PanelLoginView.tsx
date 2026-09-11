import React, { useState } from 'react';
import { Role } from '../types';
import { Mail, Lock, Shield, User, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PanelLoginViewProps {
  panelType: Role;
  language: 'bn' | 'en';
  onLoginSuccess: (role: Role) => void;
}

export const PanelLoginView: React.FC<PanelLoginViewProps> = ({
  panelType,
  language,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const savedError = sessionStorage.getItem('panelAuthError');
    if (savedError) {
      setError(savedError);
      sessionStorage.removeItem('panelAuthError');
    }
  }, []);

  const isBn = language === 'bn';

  const config = {
    ADMIN: {
      titleEn: 'Admin Login Panel',
      titleBn: 'অ্যাডমিন লগইন প্যানেল',
      color: 'rose',
      icon: <Shield className="w-12 h-12 text-rose-500 mb-4" />
    },
    LANDLORD: {
      titleEn: 'Landlord Login Panel',
      titleBn: 'বাড়িওয়ালা লগইন প্যানেল',
      color: 'amber',
      icon: <Home className="w-12 h-12 text-amber-500 mb-4" />
    },
    TENANT: {
      titleEn: 'Tenant Login Panel',
      titleBn: 'ভাড়াটিয়া লগইন প্যানেল',
      color: 'emerald',
      icon: <User className="w-12 h-12 text-[#2D5A27] mb-4" />
    }
  };

  const currentConfig = config[panelType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      sessionStorage.setItem('isPanelLogin', 'true');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      let finalRole: Role = 'TENANT';
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
      const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

      if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        finalRole = 'ADMIN';
      } else if (data.session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        if (userData) {
          finalRole = userData.role as Role;
        }
      }

      if (finalRole !== panelType) {
        sessionStorage.setItem('panelAuthError', isBn 
          ? `এই প্যানেলে লগইন করার অনুমতি আপনার নেই। (আপনার বর্তমান রোল: ${finalRole})` 
          : `You are not authorized to login to this panel. (Your role: ${finalRole})`
        );
        await supabase.auth.signOut();
        sessionStorage.removeItem('isPanelLogin');
        return; // Important to return here so we don't call onLoginSuccess
      }

      sessionStorage.removeItem('isPanelLogin');
      onLoginSuccess(finalRole);

    } catch (err: any) {
      sessionStorage.removeItem('isPanelLogin');
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {currentConfig.icon}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isBn ? currentConfig.titleBn : currentConfig.titleEn}
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-medium border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isBn ? 'ইমেইল' : 'Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                placeholder={isBn ? 'আপনার ইমেইল' : 'Enter your email'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-colors disabled:opacity-70 ${
                panelType === 'ADMIN' ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500' :
                panelType === 'LANDLORD' ? 'bg-[#D4A373] hover:bg-[#C09262] focus:ring-[#D4A373]' :
                'bg-[#2D5A27] hover:bg-[#23471E] focus:ring-[#2D5A27]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {isLoading ? '...' : (isBn ? 'লগইন করুন' : 'Login securely')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
