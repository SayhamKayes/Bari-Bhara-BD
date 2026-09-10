import React, { useState } from 'react';
import { Role } from '../../types';
import { supabase } from '../../lib/supabase';
import { X, User, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: Role) => void;
  language: 'bn' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('TENANT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        if (password !== confirmPassword) {
          throw new Error(isBn ? 'পাসওয়ার্ড মিলেনি' : 'Passwords do not match');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: selectedRole,
            }
          }
        });
        if (error) throw error;
        // Mocking the success state temporarily as they might need to confirm email
        onLogin(selectedRole);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin(selectedRole);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Tabs */}
        <div className="flex border-b border-gray-200 relative">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${
              activeTab === 'login' 
                ? 'bg-[#2D5A27] text-white' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {isBn ? 'লগইন' : 'Login'}
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              if (selectedRole === 'ADMIN') setSelectedRole('TENANT');
            }}
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${
              activeTab === 'signup' 
                ? 'bg-[#2D5A27] text-white' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {isBn ? 'সাইন আপ' : 'Sign Up'}
          </button>
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {isBn ? 'অ্যাকাউন্টের ধরন নির্বাচন করুন:' : 'Select Account Type:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('TENANT')}
                className={`py-2 px-3 rounded-xl border-2 font-semibold transition-all ${
                  selectedRole === 'TENANT'
                    ? 'border-[#2D5A27] bg-[#E9EDC9] text-[#2D5A27]'
                    : 'border-gray-200 text-gray-500 hover:border-[#2D5A27]/50'
                }`}
              >
                {isBn ? 'ভাড়াটিয়া' : 'Tenant'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('LANDLORD')}
                className={`py-2 px-3 rounded-xl border-2 font-semibold transition-all ${
                  selectedRole === 'LANDLORD'
                    ? 'border-[#D4A373] bg-[#FAEDCD] text-[#D4A373]'
                    : 'border-gray-200 text-gray-500 hover:border-[#D4A373]/50'
                }`}
              >
                {isBn ? 'বাড়িওয়ালা' : 'Landlord'}
              </button>
              {activeTab === 'login' && (
                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`col-span-2 py-2 px-3 rounded-xl border-2 font-semibold transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'border-rose-500 bg-rose-50 text-rose-600'
                      : 'border-gray-200 text-gray-500 hover:border-rose-300'
                  }`}
                >
                  {isBn ? 'অ্যাডমিন' : 'Admin'}
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">


            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-medium mb-4 border border-rose-200">
                {error}
              </div>
            )}

            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'পুরো নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                    placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your name'}
                  />
                </div>
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                  placeholder={isBn ? 'ইমেইল' : 'Email'}
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'কনফার্ম পাসওয়ার্ড' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#2D5A27] hover:bg-[#23471E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D5A27] transition-colors disabled:opacity-70"
              >
                {isLoading ? '...' : (activeTab === 'login' 
                  ? (isBn ? 'লগইন করুন' : 'Login')
                  : (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
