import React, { useState } from 'react';
import { User, Phone, Lock, Mail, Shield, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Role } from '../../types';

interface ProfileSettingsViewProps {
  currentUser: any;
  currentRole: Role;
  language: 'bn' | 'en';
  onUpdateProfile: (name: string, phone: string) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  currentUser,
  currentRole,
  language,
  onUpdateProfile
}) => {
  const isBn = language === 'bn';
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone_number || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [isResetting, setIsResetting] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    try {
      await onUpdateProfile(fullName, phoneNumber);
      setProfileMessage({ type: 'success', text: isBn ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে' : 'Profile updated successfully' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Error updating profile' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordMessage(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: isBn ? 'নতুন পাসওয়ার্ড মিলেনি' : 'New passwords do not match' });
      setIsSavingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      setPasswordMessage({ type: 'success', text: isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' : 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Error changing password' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setIsResetting(true);
    setPasswordMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(currentUser.email);
      if (error) throw error;
      setPasswordMessage({ type: 'success', text: isBn ? 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে' : 'Password reset link sent to your email' });
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Error sending reset link' });
    } finally {
      setIsResetting(false);
    }
  };

  const roleText = {
    'ADMIN': isBn ? 'অ্যাডমিন' : 'Admin',
    'LANDLORD': isBn ? 'বাড়িওয়ালা' : 'Landlord',
    'TENANT': isBn ? 'ভাড়াটিয়া' : 'Tenant'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isBn ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
        </h1>
        <p className="text-gray-500">
          {isBn ? 'আপনার ব্যক্তিগত তথ্য ও সিকিউরিটি পরিচালনা করুন' : 'Manage your personal information and security'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#E9EDC9]/50 rounded-lg text-[#2D5A27]">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {profileMessage && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                profileMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}>
                {profileMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'ইমেইল' : 'Email'} (Read Only)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl sm:text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                    placeholder="e.g. 01XXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'অ্যাকাউন্টের ধরন' : 'Account Type'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={roleText[currentRole]}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl sm:text-sm cursor-not-allowed font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="flex items-center gap-2 py-2 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#2D5A27] hover:bg-[#23471E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D5A27] transition-colors disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? '...' : (isBn ? 'সেভ করুন' : 'Save Changes')}
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {isBn ? 'সিকিউরিটি' : 'Security'}
              </h2>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={isResetting}
              className="text-sm font-medium text-[#2D5A27] hover:text-[#23471E] underline decoration-[#2D5A27]/30 hover:decoration-[#2D5A27]"
            >
              {isResetting ? '...' : (isBn ? 'পাসওয়ার্ড রিসেট মেইল পাঠান' : 'Send Reset Link')}
            </button>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {passwordMessage && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-[#2D5A27] focus:border-[#2D5A27] sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="flex items-center gap-2 py-2 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-70"
              >
                <Lock className="w-4 h-4" />
                {isSavingPassword ? '...' : (isBn ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Update Password')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
