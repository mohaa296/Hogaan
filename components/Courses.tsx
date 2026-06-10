import React, { useState } from 'react';
import { Student, Course } from '../types';
import StudentChat from './StudentChat';
import { useLanguage } from '../LanguageContext';

interface CoursesProps {
  student: Student;
  courses: Course[];
  onBack: () => void;
}

const profileTrans = {
  so: {
    personal_info: "Faahfaahinta Shaqsiyadeed",
    full_name: "Magaca oo Buuxa",
    email: "Email-ka",
    phone: "Taleefanka",
    gender: "Jinsiga",
    birth_date: "Taariikhda Dhalashada",
    address: "Ciwaanka",
    country: "Dalka",
    reg_details: "Xogta Is-diiwaangalinta",
    reg_date: "Taariikhda Diwaangalinta",
    reg_type: "Qaabka Isdiwaangalinta",
    status: "Heerka Codsiga",
    amount: "Kharashka Dhiganaha",
    student_id: "ID-ga Ardayga",
    active_admitted: "Arday La Aqbalay oo Firfircoon",
    badge_tooltip: "Waxaad tahay arday si buuxda loogu kalsoon yahay oo nidaamka ku jira.",
    id_card_title: "KAADHKAA AQOONSIGA ARDAYGA",
    print_card: "Daabac Kaadhka Aqoonsiga",
    academic_status: "Xaaladda Waxbarasho",
    active_year: "Sannad-dugsiyeedka: 2026/2027",
    male: "Lab",
    female: "Dhadig",
    paid: "Lacag ah",
    free: "Free ah",
    copied: "La koobiyeeyay ID-ga!",
    download_desc: "Kaadhkani waa aqoonsiga rasmiga ah ee dugsiga HOGAAN."
  },
  en: {
    personal_info: "Personal Information",
    full_name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    gender: "Gender",
    birth_date: "Date of Birth",
    address: "Address",
    country: "Country",
    reg_details: "Enrollment & Fee Details",
    reg_date: "Registration Date",
    reg_type: "Registration Type",
    status: "Application Status",
    amount: "Amount Played",
    student_id: "Student ID Code",
    active_admitted: "Approved Active Student",
    badge_tooltip: "You are a verified, official student in our learning system.",
    id_card_title: "STUDENT IDENTIFICATION CARD",
    print_card: "Print ID Card",
    academic_status: "Academic Status",
    active_year: "Academic Year: 2026/2027",
    male: "Male",
    female: "Female",
    paid: "Paid",
    free: "Free",
    copied: "ID Copied!",
    download_desc: "This card is the official student identification for HOGAAN."
  },
  am: {
    personal_info: "የግል መረጃ",
    full_name: "ሙሉ ስም",
    email: "ኢሜይል",
    phone: "ስልክ ቁጥር",
    gender: "ጾታ",
    birth_date: "የልደት ቀን",
    address: "አድራሻ",
    country: "ሀገር",
    reg_details: "የምዝገባና የክፍያ ዝርዝሮች",
    reg_date: "የምዝገባ ቀን",
    reg_type: "የምዝገባ ዓይነት",
    status: "የማመልከቻ ሁኔታ",
    amount: "የተከፈለ መጠን",
    student_id: "የተማሪ መታወቂያ",
    active_admitted: "የተረጋገጠ ንቁ ተማሪ",
    badge_tooltip: "በእኛ የትምህርት ስርዓት ውስጥ የተረጋገጠ ኦፊሴላዊ ተማሪ ነዎት።",
    id_card_title: "የተማሪ መታወቂያ ካርድ",
    print_card: "መታወቂያ ካርድ አትም",
    academic_status: "የትምህርት ሁኔታ",
    active_year: "የትምህርት ዘመን: 2026/2027",
    male: "ወንድ",
    female: "ሴት",
    paid: "በክፍያ",
    free: "በነጻ",
    copied: "መታወቂያው ተገልብጧል!",
    download_desc: "ይህ ካርድ የሆጋን ትምህርት ቤት ኦፊሴላዊ መታወቂያ ነው።"
  }
};

const Courses: React.FC<CoursesProps> = ({ student, courses, onBack }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab ] = useState<'courses' | 'chat' | 'profile'>('courses');
  const [copied, setCopied] = useState(false);

  // Helper translations context fallback
  const p = profileTrans[language] || profileTrans['so'];

  // User initials for avatar representation
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 print:p-0 print:bg-white">
      <div className="max-w-6xl mx-auto space-y-10 print:space-y-0">
        {/* Header - Hidden during print */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
          <div className="flex items-center space-x-4 animate-in slide-in-from-left-4 duration-300">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-[#B932B8] hover:text-white transition-all active:scale-90 duration-150" title="Go Back">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {language === 'so' ? 'Koorsooyinkaaga' : language === 'en' ? 'Your Courses' : 'የእርስዎ ኮርሶች'}
              </h1>
              <p className="text-slate-500 font-medium">Ku soo dhawaaw, <span className="text-[#B932B8] font-bold">{student.fullName}</span></p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-[#B932B8]">
              <i className="fas fa-certificate text-sm"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status-ka</p>
              <p className="text-sm font-bold text-[#B932B8]">
                {language === 'so' ? 'Arday Firfircoon' : language === 'en' ? 'Active Student' : 'ንቁ ተማሪ'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection Switcher - Hidden during print */}
        <div className="flex space-x-6 border-b border-slate-200 pb-1 print:hidden">
          <button 
            id="tab-courses-btn"
            onClick={() => setActiveTab('courses')}
            className={`pb-3.5 text-xs md:text-sm font-black uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'courses' ? 'border-[#B932B8] text-[#B932B8]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-graduation-cap"></i>
            <span>
              {language === 'so' ? 'Koorsooyinka' : language === 'en' ? 'Courses' : 'ኮርሶች'}
            </span>
          </button>
          <button 
            id="tab-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`pb-3.5 text-xs md:text-sm font-black uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 relative ${
              activeTab === 'chat' ? 'border-[#B932B8] text-[#B932B8]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-comments"></i>
            <span>
              {language === 'so' ? 'Wada-hadalka' : language === 'en' ? 'Chat Group' : 'የውይይት መድረክ'}
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute -top-1 right-0"></span>
          </button>
          <button 
            id="tab-profile-btn"
            onClick={() => setActiveTab('profile')}
            className={`pb-3.5 text-xs md:text-sm font-black uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'profile' ? 'border-[#B932B8] text-[#B932B8]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-user-circle"></i>
            <span>
              {language === 'so' ? 'Profile-kayga' : language === 'en' ? 'My Profile' : 'መገለጫዬ'}
            </span>
          </button>
        </div>

        {activeTab === 'courses' && (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:hidden">
            {courses.length > 0 ? courses.map((course) => (
              <div key={course.id} id={`course-card-${course.id}`} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col">
                {/* Thumbnail Section */}
                <div className="h-48 relative overflow-hidden bg-slate-200">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`${course.color} w-full h-full flex items-center justify-center`}>
                      <i className={`fas ${course.icon} text-6xl text-white/30`}></i>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                      {course.level}
                    </span>
                  </div>
                  {!course.thumbnail && (
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-2xl shadow-lg">
                      <i className={`fas ${course.icon} text-xl text-slate-900`}></i>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-grow space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#B932B8] transition-colors">{course.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <i className="fas fa-user-tie text-[10px] text-slate-400"></i>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{course.teacher}</p>
                    </div>
                  </div>

                  {course.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  )}

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-wider">Horumarka</span>
                      <span className="text-[#B932B8]">0%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#B932B8] rounded-full transition-all duration-1000" 
                        style={{ width: `0%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-[#B932B8] transition-all active:scale-95 flex items-center justify-center space-x-2">
                    <span>Biloow Barashada</span>
                    <i className="fas fa-play text-[10px]"></i>
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-book-open text-3xl text-slate-300"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Ma jiraan koorsooyin hadda diyaarka ah.</h3>
                <p className="text-slate-500 mt-2">Maamuluhu wali ma uusan soo gelin casharo cusub.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          /* Student Chat room view */
          <div className="print:hidden">
            <StudentChat activeUser={{ id: student.id, name: student.fullName, role: 'student' }} />
          </div>
        )}

        {activeTab === 'profile' && (
          /* Student Profile View - Supports Printing */
          <div id="student-profile-view" className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Left Column: Personal and Registration Details */}
            <div className="lg:col-span-7 space-y-8 print:hidden">
              {/* Card 1: Personal Information */}
              <div id="personal-info-card" className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-[#B932B8]/10 flex items-center justify-center text-[#B932B8]">
                    <i className="fas fa-user text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{p.personal_info}</h3>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{language === 'so' ? 'Xogta Guud ee Ardayga' : 'General Student Records'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.full_name}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-id-card text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{student.fullName}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.email}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-envelope text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{student.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.phone}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-phone text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 font-mono">{student.phone}</p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.gender}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-venus-mars text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800">
                        {student.gender === 'Lab' || student.gender === 'Labood' ? p.male : p.female}
                      </p>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.birth_date}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-calendar-alt text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 font-mono">{student.birthDate || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Country & Address */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.address} / {p.country}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-map-marker-alt text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 truncate">
                        {student.address ? `${student.address}, ${student.country || ''}` : student.country || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Enrollment & Registration Details */}
              <div id="enrollment-info-card" className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-[#10223d]/10 flex items-center justify-center text-[#10223d]">
                    <i className="fas fa-money-check-alt text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{p.reg_details}</h3>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{language === 'so' ? 'Hubinta Khidmadaha iyo Taariikhda' : 'Status confirmation and history'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Registration Date */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.reg_date}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-calendar-check text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 font-mono">
                        {student.registrationDate ? new Date(student.registrationDate).toLocaleDateString(language === 'so' ? 'so-SO' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Enrollment Status */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.status}</span>
                    <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-4 py-3.5 rounded-2xl text-emerald-800">
                      <i className="fas fa-check-circle text-emerald-500 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-black uppercase tracking-wider">{student.status}</p>
                    </div>
                  </div>

                  {/* Registration Type */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.reg_type}</span>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-4 py-3.5 rounded-2xl">
                      <i className="fas fa-tags text-slate-400 text-xs shrink-0"></i>
                      <p className="text-xs md:text-sm font-bold text-slate-800 uppercase">
                        {student.registrationType === 'Lacag ah' ? p.paid : p.free}
                      </p>
                    </div>
                  </div>

                  {/* Paid Amount */}
                  {student.registrationType === 'Lacag ah' && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{p.amount}</span>
                      <div className="flex items-center space-x-2 bg-amber-50/50 border border-amber-100 px-4 py-3.5 rounded-2xl text-amber-900">
                        <i className="fas fa-hand-holding-usd text-amber-500 text-xs shrink-0"></i>
                        <p className="text-xs md:text-sm font-black font-mono">
                          {student.amount || '0'} {student.currency || 'USD'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: High fidelity holographic Student ID Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-6">
              
              {/* The high-fidelity holographic ID card mockup */}
              <div 
                id="digital-id-card-element" 
                className="w-full max-w-[380px] h-[520px] rounded-[32px] bg-gradient-to-br from-[#10223d] via-[#1b3a66] to-[#B932B8] text-white p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 border-white/20 select-none transform hover:scale-[1.02] transition-all duration-300 print:shadow-none print:border-black print:text-black print:bg-none print:max-w-[420px]"
              >
                {/* Visual Glassmorphism overlay lines */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                
                {/* Header of Card */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#B932B8] flex items-center justify-center text-white text-xs font-black shadow-inner">
                      H
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-widest text-white">HOGAAN</h4>
                      <p className="text-[8px] text-purple-200/80 font-bold uppercase tracking-widest">Digital Academy</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse"></span>
                    VERIFIED
                  </span>
                </div>

                {/* Body section: Personal Portrait / Avatar representation & basic details */}
                <div className="flex flex-col items-center justify-center my-6 relative z-10 space-y-4">
                  {/* Portrait Avatar Frame */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border-[3px] border-white/25 flex items-center justify-center text-3xl font-black text-white shadow-xl relative overflow-hidden">
                      {getInitials(student.fullName)}
                    </div>
                    {/* Hologram micro-chip badge */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-md bg-gradient-to-tr from-amber-400 to-yellow-300 border border-amber-600 flex items-center justify-center shadow-md">
                      <i className="fas fa-microchip text-[10px] text-amber-900 animate-pulse"></i>
                    </div>
                  </div>

                  {/* Student Name */}
                  <div className="text-center">
                    <h2 className="text-lg font-black tracking-tight drop-shadow">{student.fullName}</h2>
                    <p className="text-[10px] text-purple-200/80 font-bold uppercase tracking-wider">{p.active_admitted}</p>
                  </div>
                </div>

                {/* Card Fields Block */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-4 relative z-10 text-xs">
                  <div>
                    <span className="text-[8px] text-purple-200/60 font-black uppercase tracking-widest block mb-0.5">{p.student_id}</span>
                    <button 
                      onClick={() => copyToClipboard(student.id)}
                      className="font-mono font-bold hover:text-purple-200 flex items-center space-x-1 outline-none relative hover:underline cursor-pointer"
                      title="Garaac si aad u koobiyeeso"
                    >
                      <span>{student.id.toUpperCase()}</span>
                      <i className="far fa-copy text-[10px] opacity-70"></i>
                      {copied && (
                        <span className="absolute -top-6 left-0 bg-black text-white px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider shadow">
                          {p.copied}
                        </span>
                      )}
                    </button>
                  </div>
                  <div>
                    <span className="text-[8px] text-purple-200/60 font-black uppercase tracking-widest block mb-0.5">{p.academic_status}</span>
                    <span className="font-bold text-[#32ffa5] uppercase tracking-wider">ACTIVE</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-purple-200/60 font-black uppercase tracking-widest block mb-0.5">{p.reg_type}</span>
                    <span className="font-bold uppercase">{student.registrationType === 'Lacag ah' ? p.paid : p.free}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-purple-200/60 font-black uppercase tracking-widest block mb-0.5">{language === 'so' ? 'MUDDADA' : 'DATE RANGE'}</span>
                    <span className="font-bold uppercase tracking-wide">2026 / 2027</span>
                  </div>
                </div>

                {/* Footer of Card: stylized Barcode + logo and desc */}
                <div className="flex items-center justify-between pt-4 relative z-10">
                  <div className="text-left">
                    <p className="text-[7px] text-purple-100/70 leading-normal max-w-[180px]">
                      {p.download_desc}
                    </p>
                  </div>
                  {/* CSS Simulation of beautiful Barcode */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex space-x-[2px] h-7 bg-white p-1 rounded-sm overflow-hidden" title="BARCODE">
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                      <div className="w-[2px] bg-slate-900 h-full"></div>
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                      <div className="w-[3px] bg-slate-900 h-full"></div>
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                      <div className="w-[2px] bg-slate-900 h-full"></div>
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                      <div className="w-[3px] bg-slate-900 h-full"></div>
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                      <div className="w-[4px] bg-slate-900 h-full"></div>
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                      <div className="w-[2px] bg-slate-900 h-full"></div>
                      <div className="w-[1px] bg-slate-900 h-full"></div>
                    </div>
                    <span className="text-[7px] font-mono tracking-wider text-purple-100/60">HGN-{student.id.substr(0, 5).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Print Action / Action triggers */}
              <button 
                onClick={handlePrint}
                className="print:hidden w-full max-w-[380px] py-4 rounded-2xl bg-[#10223d] hover:bg-[#1b3a66] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
              >
                <i className="fas fa-print"></i>
                <span>{p.print_card}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
