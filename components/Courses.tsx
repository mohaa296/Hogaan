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
  const [activeTab, setActiveTab ] = useState<'courses' | 'chat' | 'profile' | 'verify'>('courses');
  const [copied, setCopied] = useState(false);

  // Verification Form states
  const [verifyName, setVerifyName] = useState(student.fullName || '');
  const [verifyPhone, setVerifyPhone] = useState(student.phone || '');
  const [verifyCity, setVerifyCity] = useState(student.address || '');
  const [verifyCountry, setVerifyCountry] = useState(student.country || 'Somalia');
  const [verifyIdType, setVerifyIdType] = useState<'' | 'National ID' | 'Passport' | 'Government ID'>('');
  const [verifyIdNumber, setVerifyIdNumber] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isVerifyingSubmitted, setIsVerifyingSubmitted] = useState(false);
  const [isVerifyingLoading, setIsVerifyingLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Player & Interactive View States
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [playerTab, setPlayerTab] = useState<'summary' | 'qa' | 'resources'>('summary');
  
  // Custom Questions submitted in active course player
  const [questionsByCourse, setQuestionsByCourse] = useState<Record<string, { id: string; user: string; text: string; time: string; answer?: string }[]>>({
    "c-video-editing": [
      { id: "q1", user: "Maxamed Cali", text: "Adobe Premiere Pro ma ku shaqayn karaa computer 8GB RAM ah?", time: "2 maalin ka hor", answer: "Haa, wuu ku shaqayn karaa laakiin waxa fiican inaad isticmaasho proxies si uusan u gaabin computerkaaga inta aad edit-ka ku guda jirto." }
    ],
    "c-graphic-design": [
      { id: "q2", user: "Fartuun Axmed", text: "Ma heli karnaa Photoshop bilaash ah oo aan ku shaqaysano?", time: "Hadda", answer: "Dugsigu wuxuu ardayda la wadaagayaa link-yo aad ka heli kartaan Creative Cloud oo tijaabo ah ama xubinnimo arday oo dhimis leh. Fiiri qaybta Kheyraadka!" }
    ]
  });
  const [newQuestionText, setNewQuestionText] = useState("");

  const lessonsMap: Record<string, { title: string; duration: string; summary: string; materials: { name: string; size: string }[] }[]> = {
    "c-video-editing": [
      { 
        title: "Qaybta 1aad: Hordhaca Premiere Pro & Interface-ka", 
        duration: "12:45", 
        summary: "Casharkaan waxaad ku baran doontaa qaabka loo furo barnaamijka Adobe Premiere Pro, deegaanka shaqada (workspace), xulashada habboon ee settings-ka mashruuca cusub iyo soo dhoofinta clips-ka rasmiga ah si habaysan.",
        materials: [
          { name: "Premiere_Intro_CheatSheet.pdf", size: "1.4 MB" },
          { name: "Practice_Raw_Footage.zip", size: "142 MB" }
        ]
      },
      { 
        title: "Qaybta 2aad: Timeline-ka & Furaha Goynta Muuqaalada", 
        duration: "18:20", 
        summary: "Baro qaabka ugu habboon ee loo jaro lana isugu geeyo clip-yada iyadoo la joogtaynayo laxanka muhiimka ah. Waxaan sidoo kale ku baran doonaa shortcuts-ka adduunka badbaadiya ee goynta degdegga ah.",
        materials: [
          { name: "Timeline_Shortcuts_Guide.pdf", size: "850 KB" }
        ]
      },
      { 
        title: "Qaybta 3aad: Habaynta Midabada (Color Correction & Grading)", 
        duration: "14:15", 
        summary: "Baro aasaaska Lumetri Color Panel. Sida loo saxo iftiinka (exposure), caddaan-la'aanta (white balance), iyo saamaynta moodka midabaysan (cinematic grading) si muuqaalku ugu muuqdo heersare.",
        materials: [
          { name: "Hogaan_Cinematic_LUTs.cube", size: "4.2 MB" },
          { name: "Color_Grading_Syllabus.pdf", size: "2.1 MB" }
        ]
      },
      { 
        title: "Qaybta 4aad: VFX Transitions & Habaynta Maqalka", 
        duration: "16:35", 
        summary: "Baro ku darista transitions oo nadiif ah, mihnado sound effects ah oo kor u qaadaya tayada, iyo sidayada u nadiifin lahayn guuxa dambe (noise reduction) adoo adeegsanaya Essential Sound.",
        materials: [
          { name: "Background_Sfx_Pack.zip", size: "48 MB" }
        ]
      },
      { 
        title: "Qaybta 5aad: Keydinta & Dhoofinta (Export for TikTok & YouTube)", 
        duration: "10:50", 
        summary: "Baro dhoofinta muuqaalada adigoo isticmaalaya presets sax ah sida H.264, bitrates-ka saxda ah ee baraha bulshada ee dammaanad qaadaya in tayadu aysan ka lumin clip-ka dhamaadka.",
        materials: [
          { name: "Optimal_Export_Settings.pdf", size: "620 KB" }
        ]
      }
    ],
    "c-graphic-design": [
      { 
        title: "Qaybta 1aad: Aasaaska Naqshadaynta (Typography & Colors)", 
        duration: "14:10", 
        summary: "Baro doorashada midabada ku habboon mashruucaaga, sarraynta qoraalka (typography hierarchy), iyo xeerarka ugu muhiimsan ee naqshadaynta indhaha soo jiidata.",
        materials: [
          { name: "Color_Harmonies_Cheatsheet.pdf", size: "1.8 MB" }
        ]
      },
      { 
        title: "Qaybta 2aad: Adobe Photoshop Layers & Selection Mastery", 
        duration: "19:30", 
        summary: "Casharkaan waxaa lagugu bari doonaa sida loo adeegsado layers-ka qaabka professional-ka ah, adeegsiga mask-ka si aad u badasho asalka muuqaalada adoon duminta clips-ka dhabta ah.",
        materials: [
          { name: "Photoshop_Keyboard_Map.pdf", size: "1.1 MB" },
          { name: "Background_Removal_Assigment.zip", size: "15 MB" }
        ]
      },
      { 
        title: "Qaybta 3aad: Vector Art weynayn adoo adeegsanaya Illustrator", 
        duration: "22:15", 
        summary: "Baro gundhiga Adobe Illustrator, sida loo naqshadeeyo astaamo vector ah oo gabi ahaanba nadiif ah iyadoo la isticmaalayo Pen Tool, Shape Builder iyo Pathfinder.",
        materials: [
          { name: "Pen_Tool_Practice_Canvas.ai", size: "8.5 MB" }
        ]
      },
      { 
        title: "Qaybta 4aad: Naqshadaynta Boorarka iyo Social Media Templates", 
        duration: "15:40", 
        summary: "Baro sida loo abuuro xayeysiisyo baraha bulshada oo dhiiri-geliya macaamiisha inay ku soo galaan meheradda ama ay wax iibsadaan, iyadoo la ilaalinayo astaanta rasmiga ah.",
        materials: [
          { name: "Editable_Social_Media_Kit.psd", size: "38 MB" }
        ]
      },
      { 
        title: "Qaybta 5aad: Sida Loo Diyaariyo Naqshada si loo Daabaco", 
        duration: "11:25", 
        summary: "Baro farqiga u dhexeeya RGB iyo CMYK iyo qaabka loo kaydiyo faylasha habboon ee mashiinka daabacaadda rasmiga ah si midabadu u soo baxaan si sax ah.",
        materials: [
          { name: "Print_Checklist_Guide.pdf", size: "1.2 MB" }
        ]
      }
    ],
    "c-web-dev": [
      { 
        title: "Qaybta 1aad: Baro HTML5 & Hab-dhismeedka Websaydka", 
        duration: "15:50", 
        summary: "Baro aasaaska HTML, xeerarka sallaxa ah (semantig tags), qaab u dhisidda qayb kasta oo shabakadda ka mid ah sida header, section, iyo footer.",
        materials: [
          { name: "HTML5_Essentials_CheatSheet.png", size: "520 KB" }
        ]
      },
      { 
        title: "Qaybta 2aad: Naqshadaynta CSS3 & Tailwind CSS Magic", 
        duration: "21:10", 
        summary: "Ku habayso midabada, meelaynta iyo margins-ka shabakadaada adigoo isticmaalaya Tailwind CSS. Baro flexbox, grid, iyo sidii aad bogga uga dhigi lahayd mid ka jawaaba shaashadaha kala duwan.",
        materials: [
          { name: "Tailwind_Responsive_CheatSheet.pdf", size: "1.4 MB" }
        ]
      },
      { 
        title: "Qaybta 3aad: JavaScript Aasaasiga ah (Variables & Events)", 
        duration: "18:30", 
        summary: "Baro sida shabakadaada looga dhigo mid dareenta falalka isticmaalaha. Waxaan baranaynaa variable-yada, loops, functions, iyo manipulating DOM si loo abuuro interactions xiiso leh.",
        materials: [
          { name: "JS_Basics_Notes.txt", size: "12 KB" }
        ]
      },
      { 
        title: "Qaybta 4aad: React.js Component Lifecycle & State", 
        duration: "24:45", 
        summary: "Baro sababta React u yahay boqorka dhismaha web-yada. Waxaan baran doonaa dhismaha components-ka, wareejinta props-ka, iyo sida `useState` u bedesho waxa ka muuqda shaashada.",
        materials: [
          { name: "My_First_React_App.zip", size: "1.8 MB" }
        ]
      },
      { 
        title: "Qaybta 5aad: Dajinta Mashruuca (Deployment) ee bogga tooska ah", 
        duration: "13:20", 
        summary: "Baro nidaamka tooska ah ee aad ku geynayso mashaariicdaada shabakadda internetka dhabta ah adoo adeegsanaya Vercel iyo GitHub, si qof walba u arko xirfadaada.",
        materials: [
          { name: "Deployment_Command_Guide.pdf", size: "350 KB" }
        ]
      }
    ],
    "c-digital-marketing": [
      { 
        title: "Qaybta 1aad: Suuqgeynta Dijitaalka ah (Introduction)", 
        duration: "11:40", 
        summary: "Baro mabaadii'da aasaasiga ah ee suuqgeynta dijitaalka ah. Sida loo fahmo hab-dhaqanka macaamiisha internet-ka isticmaala iyo dhisidda istiraatiijiyad guuleysata.",
        materials: [
          { name: "Digital_Marketing_CheatSheet.pdf", size: "900 KB" }
        ]
      },
      { 
        title: "Qaybta 2aad: Facebook iyo Instagram Ads Strategy", 
        duration: "17:50", 
        summary: "Baro sida loo isticmaalo Meta Ads Manager si toos ah. Habaynta Pixel, dhisidda custom audiences, iyo xeeladaha targeting ee keenaya sales dhab ah.",
        materials: [
          { name: "Meta_Ads_Guide_2026.pdf", size: "3.5 MB" }
        ]
      },
      { 
        title: "Qaybta 3aad: SEO & Sida looga muuqdo google had iyo goor", 
        duration: "13:10", 
        summary: "Wax ka baro on-page iyo off-page SEO, sida qoraalada loogu sameeyo keywords wax ku ool ah, si website-kaagu ugu soo baxo safka hore ee natiijooyinka raadinta google.",
        materials: [
          { name: "SEO_Checklist_Handbook.pdf", size: "1.7 MB" }
        ]
      },
      { 
        title: "Qaybta 4aad: Copywriting & Copy oo iibinaya dhab ahaan", 
        duration: "16:20", 
        summary: "Baro naqshadaynta qoraalada xayeysiisyada ee soo reeba xiiso iyo dareen iibsi oo dhab ah, adoo isticmaalaya qaab dhismeedka caanka ah ee AIDA.",
        materials: [
          { name: "High_Converting_Copy_Samples.pdf", size: "820 KB" }
        ]
      },
      { 
        title: "Qaybta 5aad: Personal Branding & Ku dhisida Portfolio", 
        duration: "12:45", 
        summary: "Baro siday habboon ee shirkadaha ama macaamiisha dalka gudahiisa iyo dibadiisa aad ugu helayso adigoo dhisaya magac professional ah ee LinkedIn iyo baraha bulshada.",
        materials: [
          { name: "Branding_Planner_Weekly.pdf", size: "450 KB" }
        ]
      }
    ]
  };

  const getLessonsList = (courseId: string, courseTitle: string) => {
    return lessonsMap[courseId] || [
      { 
        title: `Qaybta 1aad: Hordhaca ${courseTitle}`, 
        duration: "15:00", 
        summary: `Gundhiga guud ee ku saabsan koorsada ${courseTitle}. Casharka dhexdiisa waxaan ku faahfaahin doonaa mawaadiicda muhiimka ah ee barashadan dhabta ah.`,
        materials: [{ name: "Handbook_Lesson_1.pdf", size: "1.2 MB" }]
      },
      { 
        title: `Qaybta 2aad: Tababarka Tooska ah ee ${courseTitle}`, 
        duration: "18:30", 
        summary: `Halkan waxaan si toos u samayn doonaa tusaale hawleed lagu sharaxayo casharka la bartay ee ku saabsan ${courseTitle}.`,
        materials: [{ name: "Exercise_Files.zip", size: "8.5 MB" }]
      },
      { 
        title: `Qaybta 3aad: Mashaariicda & Qiimaynta Caalamiga ah`, 
        duration: "12:40", 
        summary: `Casharka ugu dambeeya iyo mashaariicda gacanqabsiga ee layliga loogu talagalay si weyn ugu qayb qaadanaya xaqiijinta xirfadaada rasmiga ah.`,
        materials: [{ name: "Project_Syllabus.pdf", size: "1.4 MB" }]
      }
    ];
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !selectedCourse) return;
    
    const cId = selectedCourse.id;
    const newQ = {
      id: "q_user_" + Date.now(),
      user: student.fullName,
      text: newQuestionText.trim(),
      time: "Hadda",
      answer: "Waad ku mahadsan tahay su'aashaada! Macalinku dhawaan ayuu kuugu soo jawaabi doonaa halkan."
    };

    setQuestionsByCourse(prev => ({
      ...prev,
      [cId]: [newQ, ...(prev[cId] || [])]
    }));
    setNewQuestionText("");
  };

  // Timer simulation when video is playing
  React.useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

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
          <div className={`flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl shadow-sm border transition-all duration-300 ${isVerified ? 'border-amber-300 bg-amber-500/5' : 'border-slate-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isVerified ? 'bg-amber-500/10 text-amber-600 animate-pulse' : 'bg-purple-500/10 text-[#B932B8]'}`}>
              <i className={`fas ${isVerified ? 'fa-award text-base' : 'fa-certificate text-sm'}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status-ka</p>
              <p className={`text-sm font-bold transition-colors duration-300 ${isVerified ? 'text-amber-600' : 'text-[#B932B8]'}`}>
                {isVerified 
                  ? (language === 'so' ? 'MEMBER FIRFIRCOON' : 'VERIFIED MEMBER')
                  : (language === 'so' ? 'Arday Firfircoon' : language === 'en' ? 'Active Student' : 'ንቁ ተማሪ')}
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
          <button 
            id="tab-verify-btn"
            onClick={() => setActiveTab('verify')}
            className={`pb-3.5 text-xs md:text-sm font-black uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 relative ${
              activeTab === 'verify' ? 'border-[#B932B8] text-[#B932B8]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-user-check"></i>
            <span>
              {language === 'so' ? 'Xaqiiji Koontada' : 'Verify Account'}
            </span>
            {!isVerified && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-slate-50"></span>
            )}
          </button>
        </div>

        {activeTab === 'courses' && (
          <div className="animate-in fade-in duration-300">
            {selectedCourse ? (
              /* MAGNIFICENT INTERACTIVE COURSE PLAYER MODE */
              <div className="space-y-8">
                {/* Back Link & Info Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedCourse(null);
                        setIsVideoPlaying(false);
                        setVideoProgress(0);
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-[#B932B8] hover:text-white transition-all text-slate-800 text-xs font-black uppercase tracking-widest rounded-xl active:scale-95 flex items-center space-x-2"
                    >
                      <i className="fas fa-arrow-left"></i>
                      <span>Ku laabo Koorsooyinka</span>
                    </button>
                    <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <span>{selectedCourse.title}</span>
                        <span className="text-[9px] bg-[#B932B8]/10 text-[#B932B8] px-2 py-0.5 rounded-md">{selectedCourse.level}</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">Macallin: <span className="font-bold text-[#B932B8]">{selectedCourse.teacher}</span></p>
                    </div>
                  </div>

                  {isVerified && (
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-md">
                      <i className="fas fa-crown"></i>
                      <span>VERIFIED VIP PASS ACTIVE</span>
                    </span>
                  )}
                </div>

                {/* Main Player Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Player View and Tabs */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* The Interactive Video Box */}
                    <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-900 shadow-2xl overflow-hidden group">
                      {/* Video Player Wallpaper Backdrop */}
                      {selectedCourse.thumbnail ? (
                        <img 
                          src={selectedCourse.thumbnail} 
                          alt="Video Cover" 
                          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm brightness-50"
                        />
                      ) : (
                        <div className={`absolute inset-0 w-full h-full ${selectedCourse.color} opacity-10 blur-md`}></div>
                      )}

                      {/* Display overlay centered depending on play state */}
                      {isVideoPlaying ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                          {/* Pulsing Visual Waveform */}
                          <div className="flex items-end justify-center space-x-1.5 h-16">
                            <span className="w-1.5 bg-[#B932B8] rounded z-10 animate-[pulse_1.2s_infinite]"></span>
                            <span className="w-1.5 bg-[#B932B8] rounded z-10 animate-[pulse_0.8s_infinite] delay-100" style={{ height: '70%' }}></span>
                            <span className="w-1.5 bg-purple-500 rounded z-10 animate-[pulse_1.5s_infinite] delay-200" style={{ height: '100%' }}></span>
                            <span className="w-1.5 bg-[#B932B8] rounded z-10 animate-[pulse_1s_infinite] delay-300" style={{ height: '40%' }}></span>
                            <span className="w-1.5 bg-pink-500 rounded z-10 animate-[pulse_1.3s_infinite] delay-150" style={{ height: '80%' }}></span>
                          </div>
                          
                          <div className="text-center space-y-1 z-10">
                            <h4 className="text-white text-xs md:text-sm font-black uppercase tracking-wider">Muuqaalka Waa Toos (Streaming Lesson Video)</h4>
                            <p className="text-purple-300/80 text-[10px] font-mono leading-none">CASHARKII {activeLessonIndex + 1}AAD OO SOCDA...</p>
                          </div>

                          {/* Interactive Pause Overlay Button */}
                          <button 
                            onClick={() => setIsVideoPlaying(false)}
                            className="absolute inset-0 w-full h-full bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <span className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center text-xl shadow-2xl transform active:scale-90 transition-transform">
                              <i className="fas fa-pause"></i>
                            </span>
                          </button>
                        </div>
                      ) : (
                        /* Big Play Trigger Overlay */
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-6 text-center z-10 backdrop-blur-sm bg-black/40">
                          <button 
                            onClick={() => setIsVideoPlaying(true)}
                            className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B932B8] to-purple-500 hover:from-purple-600 hover:to-pink-500 text-white flex items-center justify-center text-2xl shadow-2xl relative border-4 border-white/20 hover:scale-110 active:scale-90 duration-300 group"
                          >
                            <i className="fas fa-play ml-1"></i>
                            {/* radar pulsing rings */}
                            <span className="absolute -inset-2 rounded-full border border-purple-400/50 animate-ping"></span>
                          </button>

                          <div className="max-w-md space-y-2">
                            <span className="bg-purple-500/20 text-purple-200 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/30">
                              Casharka {activeLessonIndex + 1}aad ({getLessonsList(selectedCourse.id, selectedCourse.title)[activeLessonIndex]?.duration})
                            </span>
                            <h3 className="text-white font-black text-sm md:text-base leading-snug">
                              {getLessonsList(selectedCourse.id, selectedCourse.title)[activeLessonIndex]?.title}
                            </h3>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              Guji badhanka dhexda ku yaal si aad u bilowdo ama u sii wadato casharka rasmiga ah.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Video Player Control bar at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col space-y-2 z-20">
                        {/* Custom Seek Bar */}
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const width = rect.width;
                          setVideoProgress(Math.floor((clickX / width) * 100));
                        }}>
                          <div 
                            className="h-full bg-gradient-to-r from-[#B932B8] to-pink-500 rounded-full transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          ></div>
                        </div>

                        {/* Player Elements Row */}
                        <div className="flex items-center justify-between text-white text-xs">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-sm"
                            >
                              <i className={`fas ${isVideoPlaying ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
                            </button>
                            <span className="font-mono text-[11px] text-slate-300">
                              0:{videoProgress < 10 ? '0' + videoProgress : videoProgress} / {getLessonsList(selectedCourse.id, selectedCourse.title)[activeLessonIndex]?.duration || "15:00"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-slate-300">
                            {/* Volume */}
                            <button className="hover:text-white transition-all">
                              <i className="fas fa-volume-up"></i>
                            </button>
                            <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden relative hidden sm:block">
                              <div className="absolute left-0 top-0 bottom-0 w-4/5 bg-white"></div>
                            </div>
                            {/* HD Selector */}
                            <span className="text-[10px] font-extrabold uppercase bg-white/20 px-1.5 py-0.5 rounded border border-white/25">1080p HD</span>
                            {/* Fullscreen icon */}
                            <button className="hover:text-white transition-all" onClick={() => alert("Waqtiga tijaabada, fullscreen waxaa badelay video laboratoriga tayada sare leh!")}>
                              <i className="fas fa-expand"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Tabs Switcher */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="flex border-b border-slate-150">
                        {[
                          { id: 'summary', name: 'Sifada Casharka', icon: 'fa-align-left' },
                          { id: 'qa', name: 'Su’aalo & Jawaabo', icon: 'fa-question-circle' },
                          { id: 'resources', name: 'Kheyraadka (Files)', icon: 'fa-download' }
                        ].map((tb) => (
                          <button
                            key={tb.id}
                            onClick={() => setPlayerTab(tb.id as any)}
                            className={`flex-1 py-4 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all flex items-center justify-center space-x-2 ${
                              playerTab === tb.id ? 'border-[#B932B8] text-[#B932B8] bg-slate-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <i className={`fas ${tb.icon}`}></i>
                            <span className="hidden sm:inline">{tb.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-6">
                        {/* Tab 1: Lesson Overview */}
                        {playerTab === 'summary' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <h4 className="font-black text-slate-950 text-base">Xogta Casharkan:</h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-5 rounded-2xl border border-slate-100">
                              {getLessonsList(selectedCourse.id, selectedCourse.title)[activeLessonIndex]?.summary}
                            </p>
                            <div className="pt-2">
                              <div className="flex items-center space-x-3 text-xs bg-purple-500/5 p-4 rounded-xl border border-purple-200/50">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-[#B932B8]">
                                  <i className="fas fa-info-circle"></i>
                                </div>
                                <p className="text-slate-550 font-medium">Fadlan dhagayso casharka oo dhammaystiran si aad u fahamto layliska qoran iyo tababarka dhabta ah.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Tab 2: Q&A Forum */}
                        {playerTab === 'qa' && (
                          <div className="space-y-6 animate-in fade-in duration-200">
                            <h4 className="font-black text-slate-950 text-base">Weydii Macallinka Su'aal:</h4>
                            
                            <form onSubmit={handlePostQuestion} className="flex gap-3">
                              <input 
                                required
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                type="text" 
                                placeholder="Ku qor halkan su'aashaada ku saabsan casharkan..."
                                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all text-slate-900 font-medium font-sans"
                              />
                              <button
                                type="submit"
                                className="px-5 bg-slate-950 hover:bg-[#B932B8] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shrink-0"
                              >
                                Dir
                              </button>
                            </form>

                            {/* Questions list */}
                            <div className="space-y-4 border-t border-slate-100 pt-5">
                              {(questionsByCourse[selectedCourse.id] || []).length > 0 ? (
                                (questionsByCourse[selectedCourse.id] || []).map((q) => (
                                  <div key={q.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                      <span className="text-[#B932B8] uppercase">{q.user}</span>
                                      <span>{q.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-800 font-bold">{q.text}</p>
                                    {q.answer && (
                                      <div className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-start space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-[8px] font-bold uppercase shrink-0">M</div>
                                        <div>
                                          <p className="text-[10px] font-black text-[#B932B8] uppercase leading-none">Macallinka Dugsiga</p>
                                          <p className="text-[11px] text-slate-500 font-bold mt-1 leading-normal">{q.answer}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-slate-400 text-xs font-bold space-y-2">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                    <i className="far fa-comments text-lg"></i>
                                  </div>
                                  <p>Wali wax su'aalo ah laguma soo qorin casharkan. Noqo qofka ugu horeeya!</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tab 3: Downloads & Resources */}
                        {playerTab === 'resources' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <h4 className="font-black text-slate-950 text-base">Faylasha Casharka ee Diyaarka ah:</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(getLessonsList(selectedCourse.id, selectedCourse.title)[activeLessonIndex]?.materials || []).map((mat, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-[#B932B8] transition-all group">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#B932B8]">
                                      <i className="fas fa-file-pdf text-lg"></i>
                                    </div>
                                    <div className="text-left">
                                      <p className="text-xs font-bold text-slate-900 max-w-[140px] truncate">{mat.name}</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">{mat.size}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => alert(`Faylka ${mat.name} waxaa si toos ah loogu shubayaa aaladdaada mar dhow!`)}
                                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#B932B8] hover:text-white flex items-center justify-center text-slate-500 text-xs transition-all active:scale-90"
                                    title="Soo download garee"
                                  >
                                    <i className="fas fa-download"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Complete Lesson Outlines */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center justify-between">
                          <span>Syllabus-ka Casharada</span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-mono font-bold">
                            {getLessonsList(selectedCourse.id, selectedCourse.title).length} Cashar
                          </span>
                        </h4>
                      </div>

                      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {getLessonsList(selectedCourse.id, selectedCourse.title).map((les, idx) => {
                          const isActive = idx === activeLessonIndex;
                          const isVisitedBefore = idx < activeLessonIndex;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveLessonIndex(idx);
                                setIsVideoPlaying(false);
                                setVideoProgress(0);
                              }}
                              className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all duration-200 group ${
                                isActive 
                                  ? 'bg-[#B932B8] text-white border-transparent shadow-lg shadow-[#B932B8]/15 hover:shadow-xl' 
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-900'
                              }`}
                            >
                              <div className="flex items-start space-x-3 max-w-[85%]">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                  isActive 
                                    ? 'bg-white text-[#B932B8]' 
                                    : isVisitedBefore 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {isVisitedBefore ? <i className="fas fa-check"></i> : idx + 1}
                                </span>
                                <div>
                                  <p className={`text-[11px] font-black line-clamp-2 ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                    {les.title}
                                  </p>
                                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isActive ? 'text-purple-200' : 'text-slate-400'}`}>
                                    Muddada: {les.duration}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="shrink-0">
                                <i className={`fas ${
                                  isActive 
                                    ? 'fa-play-circle text-lg text-white' 
                                    : 'fa-lock-open text-xs text-slate-300'
                                }`}></i>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fast Academic Support Banner */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 rounded-3xl text-white border border-white/5 relative overflow-hidden text-center space-y-4">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#B932B8]/30 blur-2xl rounded-full pointer-events-none"></div>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#B932B8] mx-auto text-xl">
                        <i className="fas fa-headset animate-bounce"></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#B932B8]">Miyey Wax Kaaga Murgsan Yihiin?</h4>
                        <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                          Waxaad si toos ah ula xidhiidhi kartaa macallimiinta iyo ardayda kale adoo isticmaalaya tab-ka Wada-hadalka ee dugsiga.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('chat')}
                        className="w-full py-3 bg-[#B932B8] hover:bg-[#a120a0] rounded-xl text-white font-black text-[10px] uppercase tracking-wider transition-all"
                      >
                        Tag Qolka Wada-hadalka
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* REGULAR COURSES LIST - CATALOG WITH ALL COURSES AVAILABLE ON WEBSITE */
              <div>
                {/* Search / Filter bar to customize lookup */}
                <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-3 mb-1 md:mb-0">
                    <div className="w-10 h-10 rounded-xl bg-[#B932B8]/10 text-[#B932B8] flex items-center justify-center">
                      <i className="fas fa-layer-group"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Dhamaan Koorsooyinka website-ka</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mt-0.5">XUBIN AH / SELECTION OF ALL REGISTERED CURRICULUMS</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-900 text-white font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {courses.length} Koorso Ayaa Diyaar Ah
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:hidden">
                  {courses.length > 0 ? courses.map((course) => (
                    <div 
                      key={course.id} 
                      id={`course-card-${course.id}`} 
                      className="group bg-white rounded-[32px] shadow-sm hover:shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300 flex flex-col relative"
                    >
                      {/* Active level label on top of cover */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
                          {course.level}
                        </span>
                      </div>

                      {/* Thumbnail Cover Section */}
                      <div className="h-48 relative overflow-hidden bg-slate-155">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`${course.color || 'bg-[#B932B8]'} w-full h-full flex items-center justify-center relative`}>
                            <i className={`fas ${course.icon || 'fa-graduation-cap'} text-6xl text-white/20`}></i>
                          </div>
                        )}
                        {!course.thumbnail && (
                          <div className="absolute bottom-4 left-4 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100">
                            <i className={`fas ${course.icon || 'fa-book-open'} text-lg text-slate-950`}></i>
                          </div>
                        )}
                      </div>
                      
                      {/* Course Body Contents */}
                      <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-5">
                        <div className="space-y-3 text-left">
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-slate-950 group-hover:text-[#B932B8] transition-colors line-clamp-1 leading-tight">{course.title}</h3>
                            <div className="flex items-center space-x-2 mt-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                <i className="fas fa-user-tie text-[10px] text-slate-500"></i>
                              </div>
                              <p className="text-[11px] text-slate-500 font-bold">{course.teacher}</p>
                            </div>
                          </div>

                          {course.description && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-semibold">
                              {course.description}
                            </p>
                          )}
                        </div>

                        {/* Progress bar simulation & interaction */}
                        <div className="space-y-2 text-left pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase">
                            <span className="text-slate-400 tracking-wider">Horumarkaaga</span>
                            <span className="text-[#B932B8]">0% Dhammaystiran</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#B932B8] to-pink-500 rounded-full transition-all duration-1000" 
                              style={{ width: `0%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Trigger Learning Overlay */}
                        <button 
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveLessonIndex(0);
                            setIsVideoPlaying(false);
                            setVideoProgress(0);
                          }}
                          className="w-full py-4 rounded-xl bg-slate-900 border border-transparent hover:bg-[#B932B8] text-white font-black text-xs tracking-widest uppercase hover:shadow-[#B932B8]/20 hover:shadow-lg transition-all active:scale-95 duration-100 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Biloow Barashada</span>
                          <i className="fas fa-play text-[9px] ml-1"></i>
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-slate-100">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <i className="fas fa-book-open text-3xl"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">Ma jiraan koorsooyin hadda diyaarka ah.</h3>
                      <p className="text-slate-500 mt-2">Maamuluhu wali ma uusan soo gelin casharo cusub.</p>
                    </div>
                  )}
                </div>
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
            {/* Verification Banner Action Block */}
            <div className={`col-span-full ${isVerified ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-emerald-500/20 text-emerald-950' : 'bg-gradient-to-r from-amber-500/10 via-[#B932B8]/10 to-[#10223d]/5 border-amber-500/20 text-slate-900'} p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden animate-in slide-in-from-top-4 print:hidden`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  <i className={`fas ${isVerified ? 'fa-shield-check text-xl' : 'fa-user-clock text-xl'} `}></i>
                </div>
                <div>
                  <h4 className="font-black text-sm md:text-base tracking-tight uppercase flex items-center gap-1.5">
                    {isVerified ? 'Hambalyo! Koontadaada waa la hubiyay' : 'XAQIIJI KOONTADAADA (VERIFY YOUR ACCOUNT)'}
                    {isVerified && <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-widest">ACTIVE</span>}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                    {isVerified 
                      ? 'Waxaad si guul leh u xaqiijisay document-yadaada aqoonsiga rasmiga ah ee dugsiga HOGAAN. Mahadsanid!'
                      : 'Fadlan ku dar aqoonsigaaga (National ID, Passport ama kale) si kor loogu qaado badbaadada koontadaada ee nidaamka.'}
                  </p>
                </div>
              </div>
              {!isVerified && (
                <button 
                  onClick={() => setActiveTab('verify')}
                  className="px-6 py-3 bg-[#B932B8] hover:bg-[#a120a0] text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 shrink-0"
                >
                  Hubi Hadda (Verify Now)
                </button>
              )}
            </div>

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
                  <span className={`${isVerified ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black border border-yellow-200 shadow-lg shadow-amber-500/20' : 'bg-emerald-500 text-white'} text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isVerified ? 'bg-slate-950' : 'bg-white'} animate-pulse`}></span>
                    {isVerified ? 'GOLD VERIFIED' : 'VERIFIED'}
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

        {activeTab === 'verify' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[32px] border border-slate-250 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Success Celebration View */}
            {isVerified ? (
              <div className="p-8 md:p-12 text-center space-y-8 relative overflow-hidden bg-gradient-to-b from-[#10223d] to-slate-950 text-white min-h-[500px] flex flex-col justify-center items-center">
                {/* Visual asset/neon blurs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B932B8]/25 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-10 w-64 h-64 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Animated Gold Trophy Badge */}
                <div className="relative flex justify-center py-2 animate-bounce">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 flex items-center justify-center text-slate-950 text-4xl shadow-2xl relative border-4 border-yellow-250">
                    <i className="fas fa-award"></i>
                    {/* Small pulsing radar ring */}
                    <span className="absolute -inset-2 rounded-full border border-amber-400/50 animate-ping"></span>
                  </div>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                  <span className="text-amber-400 text-xs font-black uppercase tracking-widest bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
                    XAQQIJIYAY / FULLY VERIFIED MEMBESHIP
                  </span>
                  
                  {/* Confirmatory Highlight Box */}
                  <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 space-y-4 hover:border-amber-400/20 transition-all duration-300">
                    <h2 className="text-base md:text-lg font-black tracking-tight text-white leading-relaxed">
                      HAMBALYO HADA WAXAAD TAHAY XUBIN FIRFIRCOON KU RAAXAYSO KOORSOOYINKA HOGAAN MAHADSANID
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      CONGRATULATIONS! YOUR ACCOUNT STATUS HAS BEEN OFFICIALLY PROMOTED TO FULL LEVEL MEMBERSHIP. YOU NOW HAVE PERMANENT ACTIVE PASS ON ALL REVELANT STUDY RESOURCES.
                    </p>
                  </div>
                </div>

                {/* Simulated dynamic submitted reference card summary */}
                <div className="w-full max-w-md bg-white/5 border border-white/5 rounded-2xl p-4 text-left grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Magaca</span>
                    <span className="font-bold text-slate-200">{verifyName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Dalka</span>
                    <span className="font-bold text-slate-200">{verifyCountry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Taleefanka</span>
                    <span className="font-bold text-slate-200 font-mono">{verifyPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Aqoonsiga</span>
                    <span className="font-bold text-amber-400 uppercase">{verifyIdType || 'National ID'} ({verifyIdNumber})</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="w-full bg-[#B932B8] hover:bg-[#a120a0] py-4 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all hover:shadow-[#B932B8]/20 shadow-xl active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-graduation-cap"></i>
                    <span>Ku laabo Koorsooyinka</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full bg-slate-900 border border-white/15 hover:bg-slate-800 text-slate-300 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-id-card"></i>
                    <span>Arag Kaadhka Aqoonsiga</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Verification Requirement Page */
              <div className="p-8 md:p-10 space-y-8">
                {/* Header Information area */}
                <div className="flex items-start space-x-4 border-b border-slate-100 pb-6">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl text-[#B932B8] flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950 tracking-tight">Codsiga Xaqiijinta Aqoonsiga</h3>
                    <p className="text-xs text-slate-550 leading-relaxed mt-1">
                      Fadlan ku buuxi xogta saxda ah ee hoose oo ku lifaaq sawirka aqoonsigaaga (National ID, Passport) si aad toos ugu hesho aqoonsi heerkiisu sarreeyo oo aad u hesho kaadhka rasmiga ah.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!verifyIdType) {
                      alert(language === 'so' ? 'Fadlan dooro nooca aqoonsiga marka hore!' : 'Please select your identity card type first!');
                      return;
                    }
                    setIsVerifyingLoading(true);

                    // Simulated secure network identification verification step
                    setTimeout(() => {
                      setIsVerifyingLoading(false);
                      setIsVerified(true);
                      setIsVerifyingSubmitted(true);
                    }, 1200);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input: Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Magacaaga oo Guuxa (Full Name)
                      </label>
                      <input
                        required
                        type="text"
                        value={verifyName}
                        onChange={(e) => setVerifyName(e.target.value)}
                        placeholder="Gali magacaaga oo saddexan"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm font-semibold border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-xl text-slate-900"
                      />
                    </div>

                    {/* Input: Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Taleefankaaga (Phone Number)
                      </label>
                      <input
                        required
                        type="text"
                        value={verifyPhone}
                        onChange={(e) => setVerifyPhone(e.target.value)}
                        placeholder="Ex: +252 61xxxxxxx"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm font-mono border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-xl text-slate-900"
                      />
                    </div>

                    {/* Input: Address location */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Goobtaada / Magaalada (City / Location)
                      </label>
                      <input
                        required
                        type="text"
                        value={verifyCity}
                        onChange={(e) => setVerifyCity(e.target.value)}
                        placeholder="Ex: Mogadishu, Somalia"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm font-semibold border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-xl text-slate-900"
                      />
                    </div>

                    {/* Selector: Country (All Countries) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Wadanka (Select Country)
                      </label>
                      <select
                        required
                        value={verifyCountry}
                        onChange={(e) => setVerifyCountry(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm font-bold border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-xl text-slate-900"
                      >
                        {[
                          "Somalia",
                          "Ethiopia",
                          "Kenya",
                          "Djibouti",
                          "Yemen",
                          "Saudi Arabia",
                          "Qatar",
                          "United Arab Emirates",
                          "Turkey",
                          "Oman",
                          "Kuwait",
                          "United States",
                          "United Kingdom",
                          "Canada",
                          "Sweden",
                          "Norway",
                          "Germany",
                          "Malaysia",
                          "Egypt",
                          "Sudan",
                          "South Sudan",
                          "Uganda",
                          "Tanzania",
                          "Eritrea",
                          "Somaliland",
                          "Puntland"
                        ].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Input Selector: Government Document ID Select */}
                  <div className="space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 transition-all duration-300">
                    <label className="text-xs font-black text-[#10223d] uppercase tracking-widest block">
                      Dooro Kadhadhka Sharciga ee aad haysato (Government Document ID)
                    </label>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Dooro mid ka mid ah dukumiintiyadan hoose si aad u dhammaystirto xogtaada.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        { type: 'National ID', label: 'National ID', icon: 'fa-id-card' },
                        { type: 'Passport', label: 'Passport', icon: 'fa-passport' },
                        { type: 'Government ID', label: 'Sharci Kale', icon: 'fa-file-invoice' }
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setVerifyIdType(item.type as any)}
                          className={`p-4 border-2 rounded-xl text-center flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                            verifyIdType === item.type
                              ? 'border-[#B932B8] bg-[#B932B8]/5 text-[#B932B8]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-500 bg-white'
                          }`}
                        >
                          <i className={`fas ${item.icon} text-lg`}></i>
                          <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic ID Form elements rendering after Document type is selected */}
                  {verifyIdType && (
                    <div className="space-y-6 bg-[#B932B8]/5 border border-[#B932B8]/10 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center space-x-2 text-[#B932B8] font-bold border-b border-[#B932B8]/10 pb-3">
                        <i className="fas fa-camera"></i>
                        <h4 className="text-xs uppercase font-extrabold tracking-widest">
                          Dhammayştir lifaaqyada: {verifyIdType}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {/* Input ID Certificate Number */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-[#B932B8] uppercase tracking-widest block">
                            Lambarka ID Qaran / Passport (ID or Document Number)
                          </label>
                          <input
                            required
                            type="text"
                            value={verifyIdNumber}
                            onChange={(e) => setVerifyIdNumber(e.target.value)}
                            placeholder="Ex: SOM-892302-N3"
                            className="w-full px-4 py-3 bg-white text-xs md:text-sm font-mono font-bold border border-purple-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-xl text-slate-900"
                          />
                        </div>

                        {/* File inputs Zone for Front and Back side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Front image upload block */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-extrabold text-[#B932B8] uppercase tracking-widest">Sawirka Hore ee ID-ga (Front Cover File)</span>
                            <div 
                              onClick={() => document.getElementById('front-file-elem')?.click()}
                              className="border-2 border-dashed border-purple-200 hover:border-[#B932B8] bg-white h-40 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all relative overflow-hidden group"
                            >
                              {frontImage ? (
                                <>
                                  <img src={frontImage} alt="Front ID Preview" className="w-full h-full object-cover rounded-xl" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                    <i className="fas fa-edit"></i> Bedel Sawirka
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-[#B932B8] mb-2">
                                    <i className="fas fa-id-card-alt text-base"></i>
                                  </div>
                                  <p className="text-[11px] text-[#B932B8] font-black uppercase">SAWIRKA HORE</p>
                                  <p className="text-[10px] text-slate-400 mt-1">Guji si aad u soo geliso</p>
                                </>
                              )}
                              <input
                                required={!frontImage}
                                id="front-file-elem"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setFrontImage(reader.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </div>
                          </div>

                          {/* Back image upload block */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-extrabold text-[#B932B8] uppercase tracking-widest">Sawirka Gadaal ee ID-ga (Back Cover File)</span>
                            <div 
                              onClick={() => document.getElementById('back-file-elem')?.click()}
                              className="border-2 border-dashed border-purple-200 hover:border-[#B932B8] bg-white h-40 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all relative overflow-hidden group"
                            >
                              {backImage ? (
                                <>
                                  <img src={backImage} alt="Back ID Preview" className="w-full h-full object-cover rounded-xl" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                    <i className="fas fa-edit"></i> Bedel Sawirka
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-[#B932B8] mb-2">
                                    <i className="fas fa-id-card-alt text-base transform rotate-180"></i>
                                  </div>
                                  <p className="text-[11px] text-[#B932B8] font-black uppercase">SAWIRKA GADAAL</p>
                                  <p className="text-[10px] text-slate-400 mt-1">Guji si aad u soo geliso</p>
                                </>
                              )}
                              <input
                                required={!backImage}
                                id="back-file-elem"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setBackImage(reader.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submission triggers */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-605 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                    >
                      Kansal
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingLoading}
                      className="px-8 py-4 bg-slate-900 hover:bg-[#B932B8] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all active:scale-95 duration-100 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isVerifyingLoading ? (
                        <>
                          <i className="fas fa-circle-notch animate-spin text-white"></i>
                          <span>XAQQIIJINAYA...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shield-alt text-xxs"></i>
                          <span>DIR CODSIGA XAQIIJINTA</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
