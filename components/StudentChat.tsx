import React, { useState, useEffect, useRef } from 'react';
import { Student, ChatMessage } from '../types';
import { useLanguage } from '../LanguageContext';

interface StudentChatProps {
  activeUser: { name: string; id: string; role: 'student' | 'admin' } | null;
  onBack?: () => void;
}

const StudentChat: React.FC<StudentChatProps> = ({ activeUser, onBack }) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customName, setCustomName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current user context
  const currentUser = activeUser || (customName.trim() ? {
    id: 'guest-' + customName.trim().toLowerCase().replace(/\s+/g, '-'),
    name: customName.trim(),
    role: 'student' as const
  } : null);

  // Fetch initial chats
  useEffect(() => {
    fetch("/api/chats")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch(err => console.error("Error loading index chats:", err));

    // Save/retrieve guest custom name if they set one
    const savedGuestName = localStorage.getItem('hogaan_chat_guest_name');
    if (savedGuestName) {
      setCustomName(savedGuestName);
    }
  }, []);

  // Listen for real-time chat messages via the shared updates SSE stream or a dedicated EventSource
  useEffect(() => {
    const eventSource = new EventSource("/api/updates/stream");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "new_chat_message") {
          const newMsg: ChatMessage = payload.data;
          setMessages(prev => {
            // Guard against duplicate messages (idempotent check)
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      } catch (err) {
        console.error("SSE Chat Error:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    setIsSending(true);

    const messagePayload = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText.trim()
    };

    fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messagePayload)
    })
    .then(res => res.json())
    .then(savedMsg => {
      setMessages(prev => {
        if (prev.some(m => m.id === savedMsg.id)) return prev;
        return [...prev, savedMsg];
      });
      setInputText('');
      setIsSending(false);
    })
    .catch(err => {
      console.error("Error broadcasting chat message:", err);
      setIsSending(false);
    });
  };

  const saveGuestNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      localStorage.setItem('hogaan_chat_guest_name', customName.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-[32px] border border-slate-200/80 shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="px-6 py-5 bg-[#10223d] text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white active:scale-90"
              title="Daboor"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
          )}
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center space-x-2">
              <span>{language === 'so' ? 'Qolka Wada-hadalka' : language === 'en' ? 'Community Chatroom' : 'የውይይት መድረክ'}</span>
              <span className="inline-flex w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ml-2" title="Live"></span>
            </h2>
            <p className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">
              {language === 'so' ? 'Lahaanshaha Ardayda Dugsiga HOGAAN' : 'Live interaction with students & admins'}
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="font-bold opacity-90">{currentUser.name}</span>
            <span className="bg-[#B932B8] text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase">
              {currentUser.role === 'admin' 
                ? (language === 'so' ? 'MAAMULE' : 'ADMIN') 
                : (language === 'so' ? 'ARDAY' : 'STUDENT')}
            </span>
          </div>
        )}
      </div>

      {/* Main chat window area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = currentUser && msg.senderId === currentUser.id;
            const isAdmin = msg.senderRole === 'admin';

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end animate-in slide-in-from-right-3' : 'mr-auto items-start animate-in slide-in-from-left-3'}`}
              >
                {/* Sender Name tag outside bubble */}
                {!isMe && (
                  <span className="text-[10px] text-slate-500 font-bold mb-1 ml-1.5 flex items-center space-x-1">
                    <span className="text-slate-800 font-black">{msg.senderName}</span>
                    <span className={`text-[8px] font-black uppercase px-1 rounded-sm ${isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                      {isAdmin 
                        ? (language === 'so' ? 'Maamule' : 'Admin') 
                        : (language === 'so' ? 'Arday' : 'Student')}
                    </span>
                  </span>
                )}

                {/* Message Bubble itself */}
                <div className={`p-4 rounded-[22px] shadow-sm relative text-xs md:text-sm leading-relaxed ${
                  isMe 
                    ? 'bg-[#B932B8] text-white rounded-tr-sm font-medium' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Timestamp underneath */}
                <span className="text-[9px] text-slate-400 mt-1 px-1.5 font-semibold">
                  {msg.timestamp}
                </span>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
              <i className="fas fa-comments text-3xl"></i>
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">Ma jiraan wada hadalo hadda.</h4>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">Noqo qofka ugu horeeya ee halkan fariin ku dhaafa ama kula hadla ardayda kale!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area or Join requirements */}
      <div className="p-4 border-t border-slate-200/70 bg-white">
        {!currentUser ? (
          <form onSubmit={saveGuestNameSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-xs font-bold text-slate-500 shrink-0">
              {language === 'so' ? 'Gali magacaaga si aad ugu biirto kooxda chats:' : 'Enter your name to join student chat:'}
            </p>
            <div className="flex-1 flex gap-2 w-full">
              <input 
                type="text" 
                required
                placeholder={language === 'so' ? "Tusaale: Maxamed Cali..." : "Your name..."}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="flex-grow px-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-medium border border-slate-200 focus:ring-1 focus:ring-[#B932B8] rounded-xl outline-none transition-all text-slate-900"
              />
              <button 
                type="submit"
                className="bg-[#B932B8] hover:bg-[#a120a0] text-xs font-black text-white px-4 py-2 rounded-xl transition-colors shrink-0 uppercase tracking-wider"
              >
                {language === 'so' ? 'Ku biir' : 'Join'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input 
              type="text" 
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'so' ? "Halkan ku qor fariintaada..." : "Type here to chat..."}
              className="flex-grow px-5 py-3.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs md:text-sm font-medium border border-slate-200 focus:ring-1 focus:ring-[#B932B8] rounded-xl outline-none transition-all text-slate-900"
            />
            <button 
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="w-12 h-12 rounded-xl bg-[#B932B8] hover:bg-[#a120a0] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSending ? (
                <i className="fas fa-spinner animate-spin text-sm"></i>
              ) : (
                <i className="fas fa-paper-plane text-sm"></i>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentChat;
