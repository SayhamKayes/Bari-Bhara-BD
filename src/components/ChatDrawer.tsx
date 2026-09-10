import React, { useState } from 'react';
import { Property, ChatMessage, Role } from '../types';
import { X, Send, MessageCircle, CheckCheck, User, ShieldCheck } from 'lucide-react';

interface ChatDrawerProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
  currentRole: Role;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  property,
  isOpen,
  onClose,
  language,
  currentRole
}) => {
  if (!isOpen || !property) return null;

  const isBn = language === 'bn';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      propertyId: property.id,
      senderRole: 'LANDLORD',
      senderName: property.landlordName,
      text: isBn 
        ? `আসসালামু আলাইকুম! "${property.titleBn}" সম্পর্কে কোনো প্রশ্ন থাকলে জানান।` 
        : `Assalamu Alaikum! Feel free to ask any questions about "${property.title}".`,
      timestamp: '10:15 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      propertyId: property.id,
      senderRole: currentRole === 'LANDLORD' ? 'LANDLORD' : 'TENANT',
      senderName: currentRole === 'LANDLORD' ? property.landlordName : 'Tanvir Ahmed (Tenant)',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate auto-reply from Landlord if current role is Tenant
    if (currentRole === 'TENANT') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          propertyId: property.id,
          senderRole: 'LANDLORD',
          senderName: property.landlordName,
          text: isBn
            ? 'ধন্যবাদ! বাসাটি এখনও খালি রয়েছে। আপনি চাইলে যে কোনো দিন সকাল ১০টা থেকে বিকাল ৫টার মধ্যে সরাসরি এসে দেখে যেতে পারেন।'
            : 'Thank you! The unit is currently vacant. You are welcome to visit anytime between 10 AM and 5 PM.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div 
        id="chat-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E0D8] animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={property.landlordAvatar}
              alt={property.landlordName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#2D5A27]"
            />
            <div>
              <div className="font-bold text-sm text-[#354231] flex items-center gap-1">
                <span>{property.landlordName}</span>
                {property.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27]" />}
              </div>
              <p className="text-[11px] text-[#5A6D56] line-clamp-1">
                {isBn ? property.titleBn : property.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8F9E8B] hover:text-[#354231] hover:bg-[#F5F2EC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Indicator Pill */}
        <div className="bg-[#E9EDC9]/60 border-b border-[#CCD5AE] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#2D5A27]">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse"></span>
            {isBn ? 'সরাসরি বাড়িওয়ালা লাইভ চ্যাট' : 'Direct Landlord Live Chat'}
          </span>
          <span className="text-[#5A6D56] font-mono font-bold">{property.landlordPhone}</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
          {messages.map(msg => {
            const isMe = (currentRole === 'LANDLORD' && msg.senderRole === 'LANDLORD') ||
                         (currentRole !== 'LANDLORD' && msg.senderRole === 'TENANT');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-[#8F9E8B] mb-0.5 px-1 font-medium">
                  {msg.senderName} • {msg.timestamp}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#2D5A27] text-white rounded-br-none'
                      : 'bg-white text-[#354231] border border-[#E5E0D8] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E0D8] bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isBn ? 'বার্তা লিখুন (যেমন: কবে থেকে বাসা খালি হবে?)...' : 'Type a message...'}
            className="flex-1 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl px-3.5 py-2.5 text-xs text-[#354231] focus:border-[#2D5A27] outline-none placeholder:text-[#8F9E8B]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#2D5A27] disabled:opacity-40 hover:bg-[#23471E] text-white p-2.5 rounded-xl transition-all shadow-2xs active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
