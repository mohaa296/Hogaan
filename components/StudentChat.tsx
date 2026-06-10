import React, { useState, useEffect, useRef } from 'react';
import { Student, ChatMessage } from '../types';
import { useLanguage } from '../LanguageContext';

interface StudentChatProps {
  activeUser: { name: string; id: string; role: 'student' | 'admin' } | null;
  onBack?: () => void;
  onRegisterRedirect?: () => void;
}

const StudentChat: React.FC<StudentChatProps> = ({ activeUser, onBack, onRegisterRedirect }) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Public Verification & Registration state
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [lookupValue, setLookupValue] = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState<{ id: string; name: string; role: 'student' } | null>(null);
  const [lookupError, setLookupError] = useState('');
  
  // Image Upload state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current active chat user context
  const currentUser = activeUser || verifiedStudent;

  // Fetch initial chats and registered students list
  useEffect(() => {
    fetch("/api/chats")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch(err => console.error("Error loading chats:", err));

    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllStudents(data);
        }
      })
      .catch(err => console.error("Error loading students list:", err));

    // Retrieve verified student from local storage if available
    const savedVerified = localStorage.getItem('hogaan_chat_verified_student');
    if (savedVerified) {
      try {
        setVerifiedStudent(JSON.parse(savedVerified));
      } catch (e) {
        console.error("Error parsing saved verified student:", e);
      }
    }
  }, []);

  // Set up SSE Event Source for live wada-hadal
  useEffect(() => {
    const eventSource = new EventSource("/api/updates/stream");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "new_chat_message") {
          const newMsg: ChatMessage = payload.data;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      } catch (err) {
        console.error("SSE Chat Update Error:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message dispatch
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || !currentUser) return;

    setIsSending(true);

    const messagePayload = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText.trim(),
      imageUrl: selectedImage || undefined
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
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsSending(false);
    })
    .catch(err => {
      console.error("Error broadcasting chat message:", err);
      setIsSending(false);
    });
  };

  // Student Email/Phone verification checker
  const handleVerifyJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const val = lookupValue.trim().toLowerCase();
    if (!val) return;

    // Search inside the students database by matching email or phone number
    const found = allStudents.find(
      s => s.email.toLowerCase() === val || s.phone.trim() === val
    );

    if (found) {
      const userObj = {
        id: found.id,
        name: found.fullName,
        role: 'student' as const
      };
      setVerifiedStudent(userObj);
      localStorage.setItem('hogaan_chat_verified_student', JSON.stringify(userObj));
      setLookupValue('');
    } else {
      setLookupError(
        language === 'so' 
          ? 'Waan ka xunnahay, ma helin arday u diwaangashan Email-kan ama Talefankan. Fadlan marka hore is-diwaangeli!'
          : 'Sorry, no registered student was found with this Email or Phone number. Please register first!'
      );
    }
  };

  const handleLogoutVerified = () => {
    setVerifiedStudent(null);
    localStorage.removeItem('hogaan_chat_verified_student');
  };

  // Image Selection reader
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (optional, limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(
          language === 'so'
            ? 'Sawirku aad ayuu u weyn yahay! Fadlan dooro sawir ka yar 2MB.'
            : 'Image is too large! Please select an image under 2MB.'
        );
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="student-chat-root" className="max-w-4xl mx-auto h-[620px] flex flex-col bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300 relative">
      {/* Header bar */}
      <div className="px-6 py-5 bg-[#10223d] text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white active:scale-90"
              title="Back"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
          )}
          <div className="text-left">
            <h2 className="text-base md:text-lg font-black tracking-tight flex items-center space-x-2">
              <span>{language === 'so' ? 'Wada-hadalka Dugsiga' : 'Hogaan Community Chat'}</span>
              <span className="inline-flex w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" title="Live"></span>
            </h2>
            <p className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">
              {language === 'so' ? 'Wada-hadal furan oo dadweynaha diiwaangashan' : 'Public group for verified students'}
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="font-bold opacity-90 truncate max-w-[100px]" title={currentUser.name}>
              {currentUser.name}
            </span>
            <span className="bg-[#B932B8] text-[9.5px] px-2 py-0.5 rounded-md font-black uppercase">
              {currentUser.role === 'admin' 
                ? (language === 'so' ? 'MAAMULE' : 'ADMIN') 
                : (language === 'so' ? 'ARDAY' : 'STUDENT')}
            </span>
            {!activeUser && verifiedStudent && (
              <button 
                onClick={handleLogoutVerified}
                className="ml-1 text-slate-400 hover:text-white transition-all text-[10px]"
                title={language === 'so' ? 'Beddel ciwaanka' : 'Change student'}
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main chat messages box */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = currentUser && msg.senderId === currentUser.id;
            const isAdmin = msg.senderRole === 'admin';

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end animate-in slide-in-from-right-3' : 'mr-auto items-start animate-in slide-in-from-left-3'}`}
              >
                {/* Sender Tag */}
                {!isMe && (
                  <span className="text-[10px] text-slate-500 font-bold mb-1 ml-1.5 flex items-center space-x-1.5">
                    <span className="text-slate-800 font-black">{msg.senderName}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm ${isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-purple-100 text-purple-750 border border-purple-150'}`}>
                      {isAdmin 
                        ? (language === 'so' ? 'Maamule' : 'Admin') 
                        : (language === 'so' ? 'Arday' : 'Student')}
                    </span>
                  </span>
                )}

                {/* Message Bubble container */}
                <div className={`p-4 rounded-[22px] shadow-sm relative text-xs md:text-sm leading-relaxed text-left ${
                  isMe 
                    ? 'bg-[#B932B8] text-white rounded-tr-sm font-medium' 
                    : 'bg-white text-slate-800 border border-slate-200/60 rounded-tl-sm'
                }`}>
                  {/* Embedded image rendering if exists */}
                  {msg.imageUrl && (
                    <div className="mb-2 max-w-sm rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared image" 
                        referrerPolicy="no-referrer"
                        className="max-h-60 object-contain mx-auto transition-transform hover:scale-102 cursor-pointer"
                        onClick={() => setModalImageUrl(msg.imageUrl || null)}
                      />
                    </div>
                  )}
                  {msg.text && <p className="whitespace-pre-wrap font-sans font-medium">{msg.text}</p>}
                </div>

                {/* Date / Timestamp */}
                <span className="text-[9px] text-slate-400 mt-1 px-1.5 font-bold font-mono">
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
            <h4 className="font-black text-slate-800 text-sm">{language === 'so' ? 'Wali wax wada-hadal ah ma jiraan.' : 'No messages yet.'}</h4>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed font-semibold">
              {language === 'so' ? 'Noqo qofka ugu horeeya ee fariin ama sawir halkan la wadaaga ardayda kale!' : 'Be the first one to write a message or share a photo!'}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controller or join gate */}
      <div className="p-4 border-t border-slate-200 bg-white relative">
        {/* If user is not yet recognized as a registered student, show public lookup barrier */}
        {!currentUser ? (
          <div className="p-2 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide">
                {language === 'so' ? '🔐 Gali Email / Tel-kaaga Diiwaangashan' : '🔐 Verify Registered Email / Phone'}
              </h3>
              <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                {language === 'so' 
                  ? 'Qolka wada-hadalku waa mid furan (Public) laakiin waxaa ku wada hadli kara oo kaliya ardayda HOGAAN u diwaangashan. Fadlan ku xaqiiji email-kaaga hoos.'
                  : 'The chat is public but restricted to registered students of HOGAAN. Verify your registered details below to join.'}
              </p>
            </div>

            <form onSubmit={handleVerifyJoin} className="max-w-md mx-auto flex gap-2">
              <input 
                type="text" 
                required
                value={lookupValue}
                onChange={(e) => {
                  setLookupValue(e.target.value);
                  setLookupError('');
                }}
                placeholder={language === 'so' ? "Email ama Talefankaaga..." : "Enter your email or phone..."}
                className="flex-grow px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold border border-slate-200 focus:ring-1 focus:ring-[#B932B8] rounded-xl outline-none transition-all text-slate-900"
              />
              <button 
                type="submit"
                className="bg-slate-950 hover:bg-[#B932B8] text-xs font-black text-white px-5 py-3 rounded-xl transition-all active:scale-95 shrink-0 uppercase tracking-widest"
              >
                {language === 'so' ? 'Xaqiiji' : 'Verify'}
              </button>
            </form>

            {lookupError && (
              <p className="text-[10px] text-red-500 font-extrabold max-w-sm mx-auto">{lookupError}</p>
            )}

            <div className="border-t border-slate-100 pt-3 flex items-center justify-center space-x-2">
              <span className="text-[10px] text-slate-405 font-bold">
                {language === 'so' ? 'Miyadan wali is diwaangelin?' : 'Not registered yet?'}
              </span>
              <button 
                onClick={() => {
                  if (onRegisterRedirect) {
                    onRegisterRedirect();
                  } else {
                    alert(language === 'so' ? 'Fadlan ku dhufo badhanka diiwaangalinta ee looga talagay bogga weyn.' : 'Please register via the main registration portal.');
                  }
                }}
                className="text-[#B932B8] hover:text-[#a120a0] text-[10px] font-black uppercase tracking-wide underline"
              >
                {language === 'so' ? 'Is-diwaangeli Hadda 🚀' : 'Register Here 🚀'}
              </button>
            </div>
          </div>
        ) : (
          /* Image sending controls and active form block */
          <div className="space-y-3">
            {/* Display preview thumbnail if an image is selected */}
            {selectedImage && (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 animate-in slide-in-from-bottom-2 duration-200 max-w-md">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-300 relative">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-[#B932B8] uppercase">{language === 'so' ? 'Sawir baa ku lifaaqan' : 'Image attachment ready'}</p>
                  <p className="text-[9px] text-slate-400 font-bold">{language === 'so' ? 'Waxuu la raacayaa fariintaada' : 'Will be sent with your message'}</p>
                </div>
                <button 
                  type="button"
                  onClick={clearSelectedImage}
                  className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-xs transition-all active:scale-90"
                  title="Remove image"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              {/* Image selector hidden input */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" 
              />
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all active:scale-95 shrink-0 ${
                  selectedImage ? 'bg-[#B932B8]/10 text-[#B932B8] border-[#B932B8]' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                }`}
                title={language === 'so' ? 'Sariiro / Lifaaq sawir' : 'Attach image'}
              >
                <i className="fas fa-camera text-base"></i>
              </button>

              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={language === 'so' ? "Halkan ku qor fariintaada ama sawir soo lifaaq..." : "Type here to chat or attach a photo..."}
                className="flex-grow px-5 py-3.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs md:text-sm font-medium border border-slate-200 focus:ring-1 focus:ring-[#B932B8] rounded-xl outline-none transition-all text-slate-900"
              />

              <button 
                type="submit"
                disabled={isSending || (!inputText.trim() && !selectedImage)}
                className="w-12 h-12 rounded-xl bg-[#B932B8] hover:bg-[#a120a0] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0"
              >
                {isSending ? (
                  <i className="fas fa-spinner animate-spin text-sm"></i>
                ) : (
                  <i className="fas fa-paper-plane text-sm"></i>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Magnificent Image zoom modal overlay */}
      {modalImageUrl && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setModalImageUrl(null)}
        >
          <div className="absolute top-6 right-6 flex items-center space-x-3">
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = modalImageUrl;
                link.download = 'hogaan-shared-image.png';
                link.click();
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
              title="Download image"
            >
              <i className="fas fa-download"></i>
            </button>
            <button 
              onClick={() => setModalImageUrl(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
              title="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl relative" onClick={e => e.stopPropagation()}>
            <img 
              src={modalImageUrl} 
              alt="Magnified look" 
              referrerPolicy="no-referrer"
              className="mx-auto max-w-full max-h-[85vh] object-contain shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentChat;
