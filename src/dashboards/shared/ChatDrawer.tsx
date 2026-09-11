import React, { useState, useEffect, useRef } from 'react';
import { Property, ChatMessage, Role } from '../../types';
import { X, Send, MessageCircle, CheckCheck, User, ShieldCheck } from 'lucide-react';
import { supabase, mapDbChatMessageToFrontend } from '../../lib/supabase';

interface ChatDrawerProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
  currentRole: Role;
  currentUserId: string | null;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  property,
  isOpen,
  onClose,
  language,
  currentRole,
  currentUserId
}) => {
  if (!isOpen || !property) return null;

  const isBn = language === 'bn';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`*, users!chat_messages_sender_id_fkey(full_name)`)
        .eq('property_id', property.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data.map(m => mapDbChatMessageToFrontend(m, property.landlordId)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && property) {
      fetchMessages();

      const channel = supabase
        .channel(`public:chat_messages:property_id=eq.${property.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `property_id=eq.${property.id}`
          },
          async (payload) => {
            // Fetch sender details manually for the new message
            const { data: userData } = await supabase
              .from('users')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();

            const newDbMsg = { ...payload.new, users: userData };
            setMessages(prev => [...prev, mapDbChatMessageToFrontend(newDbMsg, property.landlordId)]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, property]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId) return;

    const messageToSend = inputText.trim();
    setInputText('');

    // Determine receiver
    // If sender is tenant, receiver is landlord
    // If sender is landlord, we don't strictly know which tenant they are talking to in this simple UI unless we keep track of the chat session.
    // For now, if landlord replies, we'll just set receiver_id to the last tenant who messaged, or just fail gracefully if no tenant.
    let receiverId = property.landlordId;
    if (currentRole === 'LANDLORD') {
      const lastTenantMsg = messages.slice().reverse().find(m => m.senderRole === 'TENANT');
      if (lastTenantMsg) {
        receiverId = lastTenantMsg.senderId;
      } else {
        // Can't reply if no tenant has messaged yet in this simplified flow
        console.error("Landlord cannot initiate chat without a tenant");
        return;
      }
    }

    try {
      await supabase.from('chat_messages').insert({
        property_id: property.id,
        sender_id: currentUserId,
        receiver_id: receiverId,
        text: messageToSend
      });
    } catch (err) {
      console.error(err);
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
          {isLoading ? (
            <div className="flex justify-center py-4">
              <span className="w-5 h-5 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#8F9E8B]">
              {isBn ? 'কোনো মেসেজ নেই। চ্যাট শুরু করুন!' : 'No messages yet. Start the conversation!'}
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderId === currentUserId;

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
            })
          )}
          <div ref={messagesEndRef} />
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
