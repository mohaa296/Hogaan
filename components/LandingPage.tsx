import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import heroHandshakeImg from '../src/assets/images/corporate_handshake_team_1781102049797.png';
import { Course } from '../types';
import { motion } from 'motion/react';

const slideUpVariant = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const zoomUpVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 25 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

const getCourseArticleData = (courseId: string, courseTitle: string, desc: string, language: string) => {
  const isSo = language === 'so';
  const isEn = language === 'en';

  // Fallbacks
  const fallback = {
    title: courseTitle,
    subtitle: isSo ? "Barashada xirfaddaan muhiimka ah" : isEn ? "Mastering this essential modern skill" : "ይህንን አስፈላጊ ችሎታ ማስተር",
    intro: desc || (isSo ? "Mustaqbalkaaga ku dhis koorsada barashada rasmiga ah ee HOGAAN." : "Build your future with official learning courses from HOGAAN."),
    aboutTitle: isSo ? "Sharaxaada Maqaalka Koorsada" : isEn ? "Course Article & Information" : "የኮርስ ማብራሪያ መጣጥፍ",
    aboutBody: isSo 
      ? `Koorsadan ${courseTitle} waxaa loogu talagalay in lagu siiyo xirfado aad u sarreeya oo wax ku ool ah. Waxaad ku baran doontaa casharro la taaban karo oo isugu jira aragti iyo ficil si aad ugu guuleysato mustaqbalka dhow.`
      : `This course, ${courseTitle}, is carefully designed to provide you with high-level, practical skills. You will study hands-on lessons blending theory and practice to ensure your career success.`,
    syllabusTitle: isSo ? "Manhajka & Cutubyada" : isEn ? "Curriculum & Syllabus Modules" : "ሲላበስ እና ምዕራፎች",
    modules: [
      { t: isSo ? "Bilowgii Hore & Aasaaska" : "Foundations & Basics", d: isSo ? "Fahamka aasaasiga ah iyo qalabka la isticmaalo" : "Understanding basic structures and tools" },
      { t: isSo ? "Heerka Dhexe & Casharada" : "Intermediate Practice", d: isSo ? "Mawaadiicda muhiimka ah iyo mashaariicda yaryar" : "Core topics and real-world micro-projects" },
      { t: isSo ? "Heerka Sare & Portfolio" : "Advanced Mastery & Portfolio", d: isSo ? "Dhisidda mashaariic waawayn iyo hubinta shaqada" : "Building complex files and validating works" }
    ],
    outcomesTitle: isSo ? "Maxaad ka faa'iidi doontaa?" : "What you will achieve",
    outcomes: [
      isSo ? "Xirfad heer caalami ah oo la aqoonsan yahay" : "Globally recognized modern skillset",
      isSo ? "Shahaado rasmi ah markaad dhameysato" : "Official digital certificate of assignment",
      isSo ? "Mashaariic u gaar ah portfolio-gaaga" : "Hands-on projects to showcase on portfolio",
      isSo ? "Gargaar dhanka shaqo raadinta ah" : "Job placement resources & freelance support"
    ],
    quickFacts: {
      duration: "8 Weeks (Toddobaad)",
      level: "Beginner - Advanced",
      hours: "100+ Hours",
      languageName: isSo ? "Somali & English" : "English / Local"
    }
  };

  if (courseId === 'c-video-editing' || courseId === 'p-video-editing') {
    return {
      title: isSo ? "Tifaftirka & Habaynta Muuqaalada (Video Editing)" : "Professional Video Editing Masterclass",
      subtitle: isSo ? "U beddel sawirada iyo clips-ka sheekooyin cajaa'ib ah" : "Transform raw clips into cinematic blockbusters",
      intro: isSo 
        ? "Muuqaalku waa aaladda ugu xooggan ee ay maanta shirkadaha iyo shakhsiyaadka caanka ah u isticmaalaan suuqgeynta iyo madadaalada. Koorsadan waxay fure u tahay inaad noqoto xirfadle sare."
        : "Video content dominates global media. This detailed article explores how learning video editing positions you for highly lucrative creative careers.",
      aboutTitle: isSo ? "Sharaxaada Maqaalka Koorsada" : "Deep-Dive Course Overview",
      aboutBody: isSo
        ? "Ku dhexgal aduunka hal-abuurka! Muqaalku waqtigaan waa aaladda ugu baahida badan. Casharadaan waxaad ku baran doontaa dhammaan siraha badalka, habaynta midabada, saamaynta gaarka ah (VFX), iyo isku-dubaridka codka heerka sare ah. Haddi aad rabto inaad noqoto freelancer madax-bannaan ama aad ka shaqeyso qaybaha warbaahinta, tani waa fursadaada dahabiga ah."
        : "Unleash your creative potential in high-quality film and video production. Throughout this curriculum, you will master cutting techniques, color correction/grading, visual effects (VFX) implementations, audio enhancements, and advanced motion graphics to command top dollar in the freelance and corporate market.",
      syllabusTitle: isSo ? "Qaybaha Manhajka Cutubyada" : "Syllabus Breakdown",
      modules: [
        { t: isSo ? "1. Horudhaca Adobe Premiere Pro" : "1. Introduction to Premiere Pro", d: isSo ? "Barashada interface-ka, goynta iyo habaynta timeline-ka" : "Working with the workspace, sequence presets, and basic cuts" },
        { t: isSo ? "2. Tafatidka Codka & Sound Design" : "2. Audio Engineering & Effects", d: isSo ? "Sifaynta codka, isku-xirka muusikada iyo muujinta dareenada" : "Noise reduction, equalizer configs, sound mixing, and sound design principles" },
        { t: isSo ? "3. Midabaynta Pro (Color Grading)" : "3. Cinematic Color Grading", d: isSo ? "Isticmaalka Lumetri Color si loo helo muuqaal shaneemo ah" : "Utilizing Lumetri color workspace, color matching, and LUT implementation" },
        { t: isSo ? "4. After Effects & VFX" : "4. Motion Graphics & Transitions", d: isSo ? "Barashada animation, keyframes, iyo saamaynta graphic-ga" : "Creating kinetic typography, camera tracking, and custom transitions" },
        { t: isSo ? "5. Dhisidda Portfolio & Shaqo Helidda" : "5. Freelancing & Career Placement", d: isSo ? "Sidee lacag looga sameeyaa Upwork iyo qaabaynta faylalkaada" : "Formulating a professional showreel and applying to global design agencies" }
      ],
      outcomesTitle: isSo ? "Maxaad ku Barandoontaa Koorsadaan?" : "What You Will Achieve",
      outcomes: [
        isSo ? "Maamulidda Premiere Pro iyo After Effects" : "Absolute mastery of Premiere Pro & After Effects",
        isSo ? "Jarista muuqaal qoraaleedka iyo short-clips" : "Editing high-impact marketing videos and social reels",
        isSo ? "Habaynta iyo badalka midabaynta heer shaneemo" : "Cinematic color matching and custom Lumetri adjustments",
        isSo ? "Samaynta shaqo xirfadeed (Showreel) si aad codsiyo u gudbiso" : "Creating a stellar personal showreel for remote client pitches"
      ],
      quickFacts: {
        duration: isSo ? "8 Toddobaad" : "8 Weeks of study",
        level: isSo ? "Bilow ilaa Sare" : "Beginner to Pro",
        hours: "120 Hours",
        languageName: isSo ? "Somali / English" : "Somali / English"
      }
    };
  }

  if (courseId === 'c-graphic-design' || courseId === 'p-graphic-design') {
    return {
      title: isSo ? "Naqshadaynta Garaafyada (Graphic Design)" : "Advanced Graphic Design Masterclass",
      subtitle: isSo ? "Abuur aqoonsi muuqaal oo saameyn leh" : "Design brand identities that captivate markets",
      intro: isSo 
        ? "Naqshadaynta garaafyadu waxay isku xirtaa fariinta iyo quruxda. Koorsookan wuxuu kuu sahlayaa inaad u shaqayso shirkadaha ugu waaweyn ama aad abuuri karto adeeg kuu gaar ah."
        : "Graphic design is the silent ambassador of any brand. This article explains how you will transition your graphic and visual design skills into a highly-paid professional role.",
      aboutTitle: isSo ? "Maqaalka iyo Sharaxaada" : "Deep-Dive Course Overview",
      aboutBody: isSo
        ? "Ku baro naqshadaynta xiga-sare ee calaamadaha, boorarka iyo muuqaalada adoo isticmaalaya Photoshop & Illustrator. Koorsadan waxaa loo naqshadeeyay si buuxda si aad ugu dhex milmto dunida naqshadda. Waxaad abuuraysaa sumado (branding), boorar xayeysiis ah, social media templates, iyo noocyo kala duwan oo naqshadaha xaddidan ah."
        : "This elite curriculum takes you from absolute ground zero to a refined designer. You will acquire core principles of design, typography, brand development, and interface layouts utilizing vector graphics. Harness the unlimited powers of Photoshop, Illustrator, and Figma to build real commercial assignments.",
      syllabusTitle: isSo ? "Qaybaha Manhajka Cutubyada" : "Syllabus Breakdown",
      modules: [
        { t: isSo ? "1. Aasaasiga iyo Shuruucda Naqshadaynta" : "1. Design Theory & Composition", d: isSo ? "Fahamka miisaanka midabka, typography iyo visual hierarchy" : "Mastering the rules of alignment, colors, hierarchy, and grid systems" },
        { t: isSo ? "2. Adobe Photoshop Mastering" : "2. Editing & Manipulation in Photoshop", d: isSo ? "Habaynta, jarista iyo is-beddelka sawirada heer sare" : "Working with masks, layers, non-destructive editing, and photo manipulation" },
        { t: isSo ? "3. Adobe Illustrator & Vector Art" : "3. Logo Design & Vector Graphics", d: isSo ? "Naqshadaynta logo-yada rasmiga ah iyo sawir gacmeedada digital-ka ah" : "Mastering the pen tool, typography layouts, pathfinders, and branding guides" },
        { t: isSo ? "4. UI/UX iyo Naqshadaynta Figma" : "4. Modern User Interface Design", d: isSo ? "Dhisidda screen-ada abka iyo shabakadaha" : "Wireframing, high-fidelity UI prototypes, and user experience basics in Figma" },
        { t: isSo ? "5. Portfolio & Suuqa Shaqada" : "5. Brand Portfolio & Freelance", d: isSo ? "Bandhiga shaqooyinka ugu muhiimsan si aad u hesho mushaar sare" : "Compiling assignments into Behance and establishing client funnels" }
      ],
      outcomesTitle: isSo ? "Maxaad ku Barandoontaa Koorsadaan?" : "What You Will Achieve",
      outcomes: [
        isSo ? "Faham buuxa oo ku saabsan aasaaska midabada iyo visual-ka" : "Complete functional knowledge of graphic theory",
        isSo ? "Xirfado sare oo Photoshop, Illustrator iyo Figma" : "Expertise inside Photoshop, Illustrator & Figma",
        isSo ? "Kartida abuurista Brand Identity buuxda oo shirkadeed" : "Ability to develop comprehensive brand identity guidelines",
        isSo ? "Dhisidda portfolio soo jiidasho leh oo Behance ah" : "An exceptional, client-winning Behance showcase portfolio"
      ],
      quickFacts: {
        duration: isSo ? "10 Toddobaad" : "10 Weeks total",
        level: isSo ? "Bilow ilaa Sare" : "Beginner to Intermediate",
        hours: "150 Hours",
        languageName: isSo ? "Somali / English" : "Somali / English"
      }
    };
  }

  if (courseId === 'c-web-dev' || courseId === 'p-web-dev') {
    return {
      title: isSo ? "Dhisidda Mareegaha Webka (Web Development)" : "Full-Stack Web Development Mastery",
      subtitle: isSo ? "Baro barmaamijyada ugu casrisan HTML, CSS, React iyo Node.js" : "Build modern, responsive full-stack applications",
      intro: isSo 
        ? "Tiknoolajiyadu waa mashiinka dhaqaajinaya dunida. Koorsadan waxay fure u tahay inaad noqoto injineer dhisa shabakado casri ah oo dunida laga isticmaalo."
        : "Software is eating the world. This extensive curriculum guides you on how to program from scratch to build stable full-stack web platforms.",
      aboutTitle: isSo ? "Warbixinta iyo Maqaalka Koorsada" : "Course Curriculum Deep-Dive",
      aboutBody: isSo
        ? "Mareegu waa xarunta ganacsiga digital-ka ah. Halkan waxaad ku baran doontaa sida loo dhiso mareego qurux badan oo responsive ah. casharadu waxay ka bilaabanayaan min aasaaska HTML5, CSS3 iyo JavaScript-ga runta ah, waxaadna u gudbi doontaa React JS (oo ah maktabadda webka ee Facebook hoggaamiso) iyo abuurista API-yada dambe adoo adeegsanaya Node.js iyo database."
        : "Web technology is the foundation of digital businesses. This intensive article describes how you will build clean full-stack assets. Starting with solid HTML5 semantics, layout patterns with Tailwind CSS, progressive programming with JavaScript ES6, interactive states in React, server management with Node.js and Express, and persistent database storage.",
      syllabusTitle: isSo ? "Qaybaha Manhajka Cutubyada" : "Syllabus Breakdown",
      modules: [
        { t: isSo ? "1. Luuqadaha Aasaasiga ah (HTML & CSS)" : "1. HTML, CSS & Modern Tailwind", d: isSo ? "Dhisidda qaab-dhismeedka iyo bilicda bog kasta oo web ah" : "Semantic markup, modern layout methods (Flexbox/Grid), and Tailwind CSS" },
        { t: isSo ? "2. JS Barnaamijaynta (JavaScript ES6)" : "2. Algorithmic JavaScript (ES6+)", d: isSo ? "Xakamaynta logic-ga bogga, arrays, functions, iyo falgalka macaamiisha" : "Core JS variables, array functions, manipulation of DOM, and asynchronous calls" },
        { t: isSo ? "3. React Framework & State" : "3. Frontend Architectures with React", d: isSo ? "Dhisidda qaybo isku xiran (Components) oo modular ah iyo React hooks" : "Single Page Applications, reusable interactive components, states, and hooks" },
        { t: isSo ? "4. Backend Server & APIs (Node/Express)" : "4. Server Engineering & REST APIs", d: isSo ? "Abuurista APIs, qaabeynta marinnada internet-ka iyo is-weydaarsiga xogta" : "Express server architectures, routing paradigms, middleware, and request handling" },
        { t: isSo ? "5. Databases & Cloud Deployment" : "5. Database Integrations & Cloud Access", d: isSo ? "Kaydinta xogta ardayda ama isticmaalayaasha iyo ku sii deynta internet-ka" : "Constructing dynamic persistent tables, hosting in Vercel/Render, and final reviews" }
      ],
      outcomesTitle: isSo ? "Maxaad ku Barandoontaa Koorsadaan?" : "What You Will Achieve",
      outcomes: [
        isSo ? "Aqoonta dhabta ah ee luuqadaha React, JS, iyo CSS" : "Proficient coding capability in React, JavaScript, and CSS",
        isSo ? "Dhisidda shabakado interactive ah oo isku-xidhan" : "Designing highly interactive and responsive web systems",
        isSo ? "Abuurista servers iyo APIs si xog loo gudbiyo" : "Deploying stable backend servers and restful endpoints",
        isSo ? "Ku daabicidda mashaariicdaada baraha cloud-ka" : "Publishing working live projects directly to modern cloud providers"
      ],
      quickFacts: {
        duration: isSo ? "12 Toddobaad" : "12 Weeks total",
        level: isSo ? "Bilow ilaa Sare" : "Beginner to Advanced",
        hours: "200 Hours",
        languageName: isSo ? "Somali / English" : "Somali / English"
      }
    };
  }

  if (courseId === 'c-digital-marketing' || courseId === 'p-digital-marketing') {
    return {
      title: isSo ? "Suuq-geynta Baraha Bulshada (Digital Marketing)" : "Modern Digital Marketing Strategy",
      subtitle: isSo ? "Sida ganacsi loo gaarsiiyo malaayiin macaamiil ah" : "Grow businesses exponentially using modern channels",
      intro: isSo 
        ? "Suuqgeyntu waa wadnaha ganacsi kasta. Adduunka maanta shaqooyinka laguma iibin karo suuqyada caadiga ah keliya, faahfaahintan waxay ku tusi doontaa sida loo sameeyo campaigns guulaysta."
        : "Without marketing, no business survives. Expand your range by implementing data-driven digital marketing tracks specified in this detailed article.",
      aboutTitle: isSo ? "Sharaxaada iyo Maqaalka Koorsada" : "Comprehensive Course Study",
      aboutBody: isSo
        ? "Barashada xayeysiisyada digital-ka ah waa midda maanta ugu faa'iidada basin ah. Casharadaan waxaad ku baran doontaa dhamaan siraha baraha bulshada sida Facebook, Instagram, iyo TikTok, sidoo kale sida loo isticmaalo Google Ads iyo farsamooyinka raadinta ee SEO (Search Engine Optimization) si ganacsi kasta loo gaarsiiyo malaayiin macaamiil ah."
        : "Transition your skills into a multi-channel growth engine. Acquire deep-level strategies for Social Media Marketing (SMM), Search Engine Optimization (SEO), Pay-Per-Click advertising networks like Meta Ads and Google Ads. Learn how to draft converting copywriter copies, track engagement through Google Analytics, and structure funnels that maximize conversion rates.",
      syllabusTitle: isSo ? "Qaybaha Manhajka Cutubyada" : "Syllabus Breakdown",
      modules: [
        { t: isSo ? "1. Qorshaha iyo Istaraatiijiyadda Guud" : "1. Introduction to Digital Strategy", d: isSo ? "Fahamka dhageystayaasha, falanqaynta tartamayaasha iyo abuurista funnel-ka" : "Target personas, behavioral analysis, and structural copywriting" },
        { t: isSo ? "2. Adobe Spark & Suuragalnimada Content-ka" : "2. Social Media Organic Growth", d: isSo ? "Samaynta qorshayaal maalinle ah oo leh sawirro heer sare ah iyadoo la isticmaalayo Canva" : "Creating viral organic posts, content calendars, and Canva design sets" },
        { t: isSo ? "3. Meta Business Suite & Xayeysiinta Paid-ka" : "3. Paid Traffic & Ads Optimization", d: isSo ? "Bilowga Meta Ads, doorashada bartilmaameedka (targeting) iyo miisaaniyada" : "Targeting demographics on Facebook/Instagram, testing creative variations, and calculating ROI" },
        { t: isSo ? "4. SEO & Google Ads" : "4. Google Ads & SEO Essentials", d: isSo ? "Dhisidda ereyada muhiimka ah (keywords) iyo kor u qaadista sumadda" : "Search marketing campaigns, SEO metadata on websites, and keyword lists" },
        { t: isSo ? "5. Falanqaynta Xogta (Analytics)" : "5. Web Analytics & Tracking", d: isSo ? "Fahamka Google Analytics si loo go'aamiyo dhibcaha u baahan hagaajinta" : "Deploying pixels, tracking bounce rates, and creating marketing reports" }
      ],
      outcomesTitle: isSo ? "Maxaad ku Barandoontaa Koorsadaan?" : "What You Will Achieve",
      outcomes: [
        isSo ? "Awoodda maareynta ololayaal xayeysiis kasta oo baraha bulshada ah" : "Ability to manage, scope, and target Meta business ads",
        isSo ? "Sameynta qoraalo suuq-geyn ah oo wax gada (Copywriting)" : "Drafting compelling copy that triggers user actions",
        isSo ? "Maqaalka iyo barashada falanqaynta Google Ads" : "Optimizing ad spending to minimize cost per acquisition",
        isSo ? "Kor u qaadista meheradaha maxaliga ah ee Jigjiga iyo agagaarka" : "Formulating comprehensive marketing campaign scopes for businesses"
      ],
      quickFacts: {
        duration: isSo ? "8 Toddobaad" : "8 Weeks of study",
        level: isSo ? "All Levels Welcome" : "All levels welcome",
        hours: "90 Hours",
        languageName: isSo ? "Somali / English" : "Somali / English"
      }
    };
  }

  return fallback;
};

interface LandingPageProps {
  onSelectView: (view: 'public-register' | 'dashboard' | 'student-login') => void;
  courses: Course[];
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectView, courses }) => {
  const { language, t } = useLanguage();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('jigjiga');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setTimeout(() => {
      const el = document.getElementById('course-article-view');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  // Stats matching the Jobster mockup style
  const stats = {
    courses: 319,
    registrations: 265,
    graduates: 324
  };

  // Academic categories for the "Search by Category" section
  const categories = [
    { id: 'it', icon: 'fa-laptop-code', title: language === 'so' ? 'IT & Technology' : language === 'en' ? 'IT & Technology' : 'አይቲ እና ቴክኖሎጂ', count: 14 },
    { id: 'business', icon: 'fa-chart-pie', title: language === 'so' ? 'Ganacsi & Maamul' : language === 'en' ? 'Business & Commerce' : 'ቢዝነስ እና ማስተዳደር', count: 8 },
    { id: 'healthcare', icon: 'fa-stethoscope', title: language === 'so' ? 'Caafimaadka' : language === 'en' ? 'Healthcare & Medicine' : 'ጤና እና ህክምና', count: 11 },
    { id: 'languages', icon: 'fa-language', title: language === 'so' ? 'Luuqadaha' : language === 'en' ? 'Languages' : 'ቋንቋዎች', count: 6 },
    { id: 'humanities', icon: 'fa-users', title: language === 'so' ? 'Aadennimada' : language === 'en' ? 'Social Science' : 'ማህበራዊ ሳይንስ', count: 12 },
    { id: 'construction', icon: 'fa-drafting-compass', title: language === 'so' ? 'Injineernimada' : language === 'en' ? 'Engineering' : 'ምህንድስና', count: 9 }
  ];

  // Academics programs list mimicking "Featured Job Offers" in Jobster
  const featuredPrograms = [
    {
      id: 'p-web-dev',
      category: 'Software Engineering',
      title: 'Web Development Course',
      type: 'paid',
      price: '$15 / Course',
      location: 'Jigjiga Campus • Hybrid',
      instructor: 'Dr. Abdirahman Farah',
      date: 'June 18, 2026',
      tags: ['React', 'Node.js', 'Web Dev']
    },
    {
      id: 'p-graphic-design',
      category: 'Creative & Design',
      title: 'Graphic Design Course',
      type: 'paid',
      price: '$7 / Course',
      location: 'Jigjiga Campus • On-Site',
      instructor: 'Ustaad Zakaria Omar',
      date: 'June 20, 2026',
      tags: ['Photoshop', 'Illustrator', 'UI/UX']
    },
    {
      id: 'p-video-editing',
      category: 'Media Production',
      title: 'Video Editing Course',
      type: 'paid',
      price: '$10 / Course',
      location: 'Online • Remote',
      instructor: 'Eng. Hamza Salad',
      date: 'June 25, 2026',
      tags: ['Premiere Pro', 'After Effects', 'VFX']
    },
    {
      id: 'p-digital-marketing',
      category: 'Marketing & Business',
      title: 'Digital Marketing Course',
      type: 'paid',
      price: '$12 / Course',
      location: 'Jigjiga Campus • Hybrid',
      instructor: 'Sahra Mohamed Gure',
      date: 'July 01, 2026',
      tags: ['SEO', 'Social Media', 'ADS']
    }
  ];

  const handlePopularSearch = (track: string) => {
    setSearchTitle(track);
  };

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden bg-[#fafbfc]">
      
      {/* SECTION 1: HERO CONTAINER (Jobster Layout Styled) */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center px-4 md:px-8 py-12 md:py-20 overflow-hidden bg-[#10223d] text-white">
        
        {/* Full-width and Full-height background image displaying the corporate partnership */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background Image backdrop - Made much more visible (opacity-100), and aligned to show the girl and team on the right side with crystal clear definition */}
          <div 
            className="absolute inset-0 bg-cover bg-[position:85%_center] lg:bg-[position:right_20%_center] bg-no-repeat opacity-100 scale-100 transition-all duration-700"
            style={{ backgroundImage: `url(${heroHandshakeImg})` }}
          />
          {/* Left-aligned deep navy CAMPUSA vignette gradient overlays to guarantee pristine typography readability on the left while keeping the right side bright and clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#10223d] via-[#10223d]/90 via-[#10223d]/65 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#10223d]/80 via-transparent to-transparent"></div>
          
          {/* Subtle floating glow patterns inside background */}
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#B932B8]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-10 right-10 w-60 h-60 bg-[#3084FB]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Title & Search Filter System */}
          <motion.div 
            className="lg:col-span-7 space-y-8 text-left"
            variants={slideUpVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center space-x-2 bg-[#B932B8]/20 border border-[#B932B8]/30 rounded-full px-4 py-1.5 text-[#B932B8] font-bold text-xs animate-pulse">
              <i className="fas fa-graduation-cap"></i>
              <span>{language === 'so' ? 'Mustaqbalkaaga Halkan Ka Biloow' : language === 'en' ? 'Start Your Future Right Here' : 'የወደፊት ሕይወትዎን እዚህ ይጀምሩ'}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {language === 'so' ? (
                  <>
                    U hel <span className="text-[#B932B8]">koorsada ugu fiican</span> mustaqbalkaaga
                  </>
                ) : language === 'en' ? (
                  <>
                    Find the perfect <span className="text-[#B932B8]">academic path</span> for you
                  </>
                ) : (
                  <>
                    ለእርስዎ ትክክለኛውን <span className="text-[#B932B8]">የትምህርት መስመር</span> ያግኙ
                  </>
                )}
              </h1>
              <p className="text-sm md:text-base text-slate-200 max-w-xl leading-relaxed">
                {language === 'so' 
                  ? 'Kaga biir akadeemiyada HOGAAN si aad u dhisato xirfad caalami ah oo la jaanqaadaysa kobaca shaqo ee casriga ah.' 
                  : language === 'en'
                  ? 'Search and register through curated course tracks. Join thousands of certified graduates pursuing active careers.'
                  : 'የአካዳሚክ እድገትዎን እና የወደፊት የሙያ ስኬትዎን በትክክለኛ መረጃዎች የሚከታተሉበት ሆጋን ዲጂታል ትምህርት ቤት።'}
              </p>
            </div>

            {/* Quick Elegant Call To Action button pair instead of cluttered search */}
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onSelectView('public-register')}
                className="bg-[#B932B8] hover:bg-[#a120a0] text-white px-8 py-4 rounded-md font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl shrink-0 flex items-center space-x-3 active:scale-95 duration-150"
              >
                <span>{language === 'so' ? 'Is-diiwaangeli Hadda' : language === 'en' ? 'Register Now' : 'አሁን ይመዝገቡ'}</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </button>
              <button
                onClick={() => onSelectView('student-login')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest transition-all shrink-0 flex items-center space-x-2 active:scale-95"
              >
                <i className="fas fa-user-lock text-xs"></i>
                <span>{language === 'so' ? 'Giriibka Ardayga' : language === 'en' ? 'Student Portal' : 'የተማሪ መግቢያ'}</span>
              </button>
            </div>

            {/* Trusted partner logos mimicking Jobster footer logo banner */}
            <div className="pt-8 border-t border-slate-750 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {language === 'so' ? 'La shaqeeyayaasha:' : language === 'en' ? 'AFFILIATED PARTNERS:' : 'ቀጥተኛ ግንኙነቶች:'}
              </p>
              <div className="flex flex-wrap items-center gap-6 opacity-80 transition-all">
                <div className="flex items-center space-x-1.5 font-black text-slate-300 text-xs">
                  <i className="fas fa-school text-sm text-[#B932B8] mr-1.5"></i>
                  <span>JIGJIGA ACADEMY</span>
                </div>
                <div className="flex items-center space-x-1.5 font-black text-slate-300 text-xs">
                  <i className="fas fa-cloud text-sm text-sky-400 mr-1.5"></i>
                  <span>SOMALI CLOUD</span>
                </div>
                <div className="flex items-center space-x-1.5 font-black text-slate-400 text-xs">
                  <i className="fas fa-award text-sm text-[#B932B8] mr-1.5"></i>
                  <span>GOV EDUCATION</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Beautiful translucent overlay stats glass badges with no giant solid backing block to preserve the backdrop student visibility fully */}
          <motion.div 
            className="lg:col-span-5 relative w-full h-[540px] hidden lg:flex items-center justify-center"
            variants={zoomUpVariant}
            initial="hidden"
            animate="visible"
          >
            
            {/* Elegant outline display focus ring */}
            <div className="absolute inset-0 rounded-[40px] border border-white/5 bg-white/5 backdrop-blur-[2px] pointer-events-none p-8 flex items-center justify-center">
              <div className="w-full h-full border border-[#B932B8]/10 rounded-[30px] flex items-center justify-center">
                <i className="fas fa-expand text-white/5 text-9xl"></i>
              </div>
            </div>

            {/* Floating Widgets / Stats Badges matching Jobster */}
            {/* BADGE 1: Active Courses */}
            <div className="absolute left-[5%] top-[15%] bg-[#10223d]/85 backdrop-blur-md px-6 py-5 rounded-2xl shadow-2xl border border-white/10 z-30 flex items-center space-x-4 animate-pulse duration-[3000ms]">
              <div className="w-12 h-12 bg-[#B932B8]/15 text-[#B932B8] rounded-xl flex items-center justify-center">
                <i className="fas fa-book-open text-lg"></i>
              </div>
              <div>
                <h5 className="text-2xl font-black text-white leading-none">{stats.courses}</h5>
                <p className="text-[9px] font-black text-[#B932B8] uppercase tracking-widest mt-1.5">
                  {language === 'so' ? 'Koorsooyin Firfircoon' : language === 'en' ? 'Active Courses' : 'ገባሪ ትምህርቶች'}
                </p>
              </div>
            </div>

            {/* BADGE 2: Registered Students */}
            <div className="absolute right-[5%] top-[45%] bg-[#10223d]/85 backdrop-blur-md px-6 py-5 rounded-2xl shadow-2xl border border-white/10 z-30 flex items-center space-x-4">
              <div className="w-12 h-12 bg-sky-500/15 text-sky-400 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-lg"></i>
              </div>
              <div>
                <h5 className="text-2xl font-black text-white leading-none">{stats.registrations}0</h5>
                <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mt-1.5">
                  {language === 'so' ? 'Kuwa Diwaangashan' : language === 'en' ? 'Student Registrations' : 'የተመዘገቡ ተማሪዎች'}
                </p>
              </div>
            </div>

            {/* BADGE 3: Certified Alumni */}
            <div className="absolute left-[15%] bottom-[15%] bg-[#10223d]/85 backdrop-blur-md px-6 py-5 rounded-2xl shadow-2xl border border-white/10 z-30 flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-xl flex items-center justify-center">
                <i className="fas fa-graduation-cap text-lg"></i>
              </div>
              <div>
                <h5 className="text-2xl font-black text-white leading-none">{stats.graduates}</h5>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1.5">
                  {language === 'so' ? 'Aqoonyahan la Hubiyay' : language === 'en' ? 'Certified Alumni' : 'የተመረቁ ምሁራን'}
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* SECTION 2: BROWSE BY CATEGORY SECTION (Jobster Bento Layout) */}
      <section id="service" className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-12">
          <div className="space-y-2 text-left">
            <span className="text-xs font-black text-[#B932B8] bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
              {language === 'so' ? 'Qaybaha Cilmiyeed' : language === 'en' ? 'Search by Category' : 'በዘርፍ መለየት'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'so' ? 'Ku Baar Qaybaha Codsiyada' : language === 'en' ? 'Browse by Field of Study' : 'የጥናት ዘርፎችን ያስሱ'}
            </h2>
          </div>
          <button 
            onClick={() => onSelectView('public-register')}
            className="text-xs font-black text-[#3084FB] hover:text-[#B932B8] tracking-widest uppercase transition-colors flex items-center"
          >
            <span>{language === 'so' ? 'Dhammaan Qaybaha' : language === 'en' ? 'View All Categories' : 'ሁሉንም ዘርፎች ይመልከቱ'}</span>
            <i className="fas fa-chevron-right ml-2 text-[10px]"></i>
          </button>
        </div>

        {/* Bento/Categorization Grid (Replicating category tiles in layout mockup) */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              onClick={() => onSelectView('public-register')}
              variants={zoomUpVariant}
              className="group bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#3084FB] group-hover:text-white transition-all duration-300 group-hover:scale-110">
                <i className={`fas ${cat.icon} text-lg`}></i>
              </div>
              <h3 className="font-extrabold text-slate-850 text-sm tracking-wide mb-1 transition-colors group-hover:text-[#B932B8]">{cat.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest">
                {cat.count} {language === 'so' ? 'Koorso' : language === 'en' ? 'Programs' : 'ትምህርቶች'}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* SECTION 3: FEATURED PROGRAMS SECTION (Featured Job Offers Layout) */}
      <section className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-black text-[#3084FB] bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            {language === 'so' ? 'Barnaamijyada ugu Fiican' : language === 'en' ? 'Academic Program Listings' : 'ልዩ የትምህርት ዕድሎች'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {language === 'so' ? 'Koorsooyinka ugu Caansan (Live)' : language === 'en' ? 'Featured Academic Offers' : 'በቀጥታ የሚቀርቡ ልዩ ኮርሶች'}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-xs leading-relaxed">
            {language === 'so' 
              ? 'Hoos ka dooro barnaamijka ku habboon aqoontaada oo is-diiwaangali adoo marinaya foomka tooska ah.' 
              : language === 'en'
              ? 'Select and apply directly for immediate class assignments, standard curriculums, and certifications.'
              : 'ከሚከተሉት ተፈላጊ ኮርሶች ውስጥ ለእርስዎ የሚስማማውን መርጠው በቀጥታ መመዝገብ ይችላሉ።'}
          </p>
        </div>

        {/* 2-Column Program Card Grid mimicking Job-offers section in Jobster */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const hasThumbnail = !!course.thumbnail;
            const isSelected = selectedCourse?.id === course.id;
            return (
              <div 
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className={`group bg-white rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden cursor-pointer ${
                  isSelected 
                    ? 'ring-4 ring-[#B932B8]/30 border-[#B932B8] scale-[1.01]' 
                    : 'border-slate-200/60'
                }`}
              >
                {/* Active selection ribbon */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-[#B932B8] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest z-10 shadow-sm animate-pulse">
                    {language === 'so' ? 'Waa Laguu Doortay' : language === 'en' ? 'Viewing Article' : 'አሁን እያዩት ነው'}
                  </div>
                )}

                {/* Colored side indicator */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${course.color || 'bg-[#B932B8]'}`}></div>

                <div className="p-6 space-y-4">
                  {/* Header elements: Thumbnail or Icon placeholder */}
                  {hasThumbnail ? (
                    <div className="w-full h-40 rounded-2xl overflow-hidden relative bg-slate-100">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                        {course.level}
                      </span>
                    </div>
                  ) : (
                    <div className={`w-full h-16 rounded-2xl ${course.color || 'bg-purple-500'} flex items-center justify-between px-4 text-white shadow-sm`}>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md">
                        {course.level}
                      </span>
                      <i className={`fas ${course.icon || 'fa-book'} text-xl opacity-80`}></i>
                    </div>
                  )}

                  {/* Course Main Info */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-900 text-lg hover:text-[#3084FB] transition-colors leading-snug line-clamp-1" title={course.title}>
                      {course.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                      <i className="fas fa-map-marker-alt text-slate-350 shrink-0"></i>
                      <span>Jigjiga Campus • Hybrid</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-[#B932B8]">
                      <i className="fas fa-user-tie text-slate-350 shrink-0"></i>
                      <span>{course.teacher || 'TBD'}</span>
                    </div>
                    {course.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom control row */}
                <div className="mx-6 mb-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1.5 hover:text-[#B932B8] transition-colors">
                    <i className="fas fa-book-open text-[11px] text-[#B932B8]"></i>
                    <span className="underline decoration-[#B932B8]/40 decoration-2 underline-offset-4 font-black uppercase tracking-wider text-[9px]">
                      {language === 'so' ? 'Aqri Maqaalka' : language === 'en' ? 'Read Article' : 'መጣጥፍ አንብብ'}
                    </span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectView('public-register');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#B932B8] to-[#a120a0] text-white rounded-xl text-xs font-black transition-all flex items-center space-x-1 hover:shadow-md hover:brightness-105 active:scale-95 duration-100"
                  >
                    <span>{language === 'so' ? 'Diiwaangali' : language === 'en' ? 'Register' : 'ይመዝገቡ'}</span>
                    <i className="fas fa-arrow-right text-[9px] ml-1.5 animate-pulse"></i>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3.5: DETAILED COURSE ARTICLE SECTION WITH ORDER NOW */}
      {selectedCourse && (() => {
        const article = getCourseArticleData(selectedCourse.id, selectedCourse.title, selectedCourse.description || '', language);
        return (
          <section id="course-article-view" className="py-16 max-w-7xl mx-auto px-4 md:px-8 mt-12 bg-white border border-slate-100/90 rounded-[40px] shadow-sm relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#B932B8]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#3084FB]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <motion.div
              key={selectedCourse.id}
              initial="hidden"
              animate="visible"
              variants={zoomUpVariant}
              className="space-y-12 relative z-10"
            >
              {/* Top Banner layout */}
              <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-[#B932B8] bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest">
                      {selectedCourse.level || 'Beginner'}
                    </span>
                    <span className="text-[10px] font-black text-[#3084FB] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                      <i className="fas fa-clock"></i> {article.quickFacts.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tight leading-none">
                    {article.title}
                  </h2>
                  <p className="text-[#B932B8] text-xs font-bold leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>

                {/* Cover representation */}
                <div className="shrink-0 w-32 h-32 md:w-44 md:h-28 rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-50 relative">
                  {selectedCourse.thumbnail ? (
                    <img 
                      src={selectedCourse.thumbnail} 
                      alt={selectedCourse.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full ${selectedCourse.color || 'bg-gradient-to-r from-purple-500 to-indigo-500'} flex items-center justify-center text-white`}>
                      <i className={`fas ${selectedCourse.icon || 'fa-graduation-cap'} text-3xl opacity-75`}></i>
                    </div>
                  )}
                </div>
              </div>

              {/* 3-Column main body grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Columns (8/12) - Article Prose & Curriculum Map */}
                <div className="lg:col-span-8 space-y-10">
                  
                  {/* About article section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <i className="fas fa-file-alt text-[#3084FB]"></i>
                      {article.aboutTitle}
                    </h3>
                    <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-line bg-gradient-to-r from-slate-50/50 to-transparent p-5 rounded-2xl border-l-4 border-[#3084FB]">
                      {article.aboutBody}
                    </p>
                  </div>

                  {/* Course Curriculum & Syllabus Modules */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <i className="fas fa-list-ol text-[#B932B8]"></i>
                        {article.syllabusTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {language === 'so' ? 'Halkan ka dhuux manhajka iyo cutubyada rasmiga ah:' : 'Detailed step-by-step milestones to acquire complete master skill:'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {article.modules.map((mod, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100/80 bg-slate-50/30 hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B932B8] to-[#912090] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            0{idx + 1}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-850 text-xs text-slate-900">
                              {mod.t}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {mod.d}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Columns (4/12) - Quick facts & visual icons */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Quick Facts panel */}
                  <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100/90 space-y-6">
                    <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase">
                      {language === 'so' ? 'Macluumaad Kooban' : 'Course Overview Facts'}
                    </h4>

                    <div className="space-y-4">
                      {/* Fact 1 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                          <i className="fas fa-calendar-day text-xs"></i>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Muddada' : 'Duration'}</p>
                          <p className="text-xs font-black text-slate-800">{article.quickFacts.duration}</p>
                        </div>
                      </div>

                      {/* Fact 2 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3084FB] flex items-center justify-center shrink-0">
                          <i className="fas fa-layer-group text-xs"></i>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Heerka' : 'Academic Level'}</p>
                          <p className="text-xs font-black text-slate-800">{article.quickFacts.level}</p>
                        </div>
                      </div>

                      {/* Fact 3 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                          <i className="fas fa-hourglass-half text-xs"></i>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Saacadaha' : 'Total Hours'}</p>
                          <p className="text-xs font-black text-slate-800">{article.quickFacts.hours}</p>
                        </div>
                      </div>

                      {/* Fact 4 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#B932B8] flex items-center justify-center shrink-0">
                          <i className="fas fa-comments text-xs"></i>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{language === 'so' ? 'Luuqadda' : 'Instruction'}</p>
                          <p className="text-xs font-black text-slate-800">{article.quickFacts.languageName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Achievements */}
                  <div className="bg-[#B932B8]/5 rounded-3xl p-6 border border-[#B932B8]/10 space-y-4">
                    <h4 className="text-xs font-black text-[#B932B8] tracking-wider uppercase">
                      {article.outcomesTitle}
                    </h4>
                    <ul className="space-y-3">
                      {article.outcomes.map((out, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-655">
                          <i className="fas fa-check-circle text-emerald-500 shrink-0 mt-0.5 text-[13px]"></i>
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* SECTION BOTTOM: ORDER NOW (DIIWAANGALI HADDA) */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-6">
                <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#B932B8]/20 rounded-full blur-2xl"></div>

                <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
                  <h4 className="text-lg md:text-xl font-black text-white tracking-tight leading-snug">
                    {language === 'so' 
                      ? 'Diyaar ma u tahay inaad bilowdo koorsadaan?' 
                      : language === 'en' 
                      ? 'Ready to build high-end mastery in this program?'
                      : 'ይህንን ልዩ ስልጠና ለመጀመር ዝግጁ ነዎት?'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'so'
                      ? 'Is-diiwaangali maanta si aad u xaqiijiso booskaaga fasalka dambe ama hybrid-ka oo aad u barato manhajka qotada dheer ee aqoonsiga leh.'
                      : 'Enroll right now to lock in your curriculum resources, secure hybrid sessions, and study with dedicated field experts.'}
                  </p>
                </div>

                <div className="shrink-0 relative z-10">
                  <button
                    onClick={() => onSelectView('public-register')}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#B932B8] to-[#e83ce7] text-white hover:from-[#3084FB] hover:to-[#5ca0ff] rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-[#B932B8]/20 hover:shadow-[#3084FB]/20 flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-cart-arrow-down mr-1 animate-bounce"></i>
                    <span>{language === 'so' ? 'DIIWAANGALI HADDA (ORDER NOW)' : 'REGISTER NOW (ORDER NOW)'}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </section>
        );
      })()}

      {/* SECTION 4: ABOUT ACADEMY PRESTIGE */}
      <section id="about" className="py-12 bg-white rounded-[40px] px-6 border border-slate-100 max-w-7xl mx-auto shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative p-2 flex justify-center items-center">
            {/* Image mockup representations for About section */}
            <div className="relative w-full max-w-md h-80 bg-gradient-to-tr from-[#3084FB] to-[#B932B8] rounded-[32px] p-1.5 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-[26px] bg-slate-900 z-10 relative overflow-hidden flex flex-col justify-end p-8 text-left">
                <blockquote className="space-y-4">
                  <p className="text-white font-medium text-sm leading-relaxed italic">
                    "U diwaangalinta hogaan waxay iga siisay aqbalaad degdeg ah xarunta Jigjiga. Waxaan si toos ah u xaqiijiyay koorsooyinka rasmiga ah oo aan isku xiray macalimiinteyda."
                  </p>
                  <footer className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-black text-[#B932B8]">
                      A
                    </div>
                    <div>
                      <cite className="not-italic text-slate-200 font-bold text-xs block">Anas Mohamed</cite>
                      <cite className="not-italic text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Student In Business Finance</cite>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
            
            {/* Small floating card overlap */}
            <div className="absolute right-0 bottom-[-10px] bg-white border border-slate-100 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-[170px]">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-[#3084FB]">
                <i className="fas fa-globe text-sm"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-700 leading-none">100%</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital Flow</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <span className="text-xs font-black text-[#B932B8] bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
              {t('menu_about')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {language === 'so' ? 'Maareynta Waxbarasho ee HOGAAN' : language === 'en' ? 'Academic Integrity & Systems' : 'የአካዳሚክ አስተዳደር ስርዓት'}
            </h2>
            <p className="text-slate-500 leading-relaxed text-xs md:text-sm">
              {language === 'so' 
                ? 'HOGAAN waa akadeemiyad u heellan is-diiwaangelinta, xiriirka diiwaanka ardayda cusub, iyo abaabulka koorsooyinka rasmiga ah dalkeenna. Waxaan fududaynay in codsi kasta lagu oggolaado saacado kooban gudahood si ardayda loogu xiro fasalladooda mustaqbalka.'
                : language === 'en'
                ? 'HOGAAN is an educational management portal designed to host seamless student entries, map comprehensive course structures, and secure academic profiles across regions.'
                : 'ሆጋን ተማሪዎች በቀጥታ እንዲመዘገቡ፣ ኮርሶችን በአስተማማኝ ሁኔታ እንዲከታተሉ እና የትምህርት ደረጃቸውን እንዲቆጣጠሩ የሚያግዝ ዘመናዊ መድረክ ነው።'}
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-l-4 border-[#B932B8] pl-4 space-y-1">
                <h4 className="text-2xl font-black text-slate-800">100%</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  {language === 'so' ? 'Hufnaan buuxda' : language === 'en' ? 'Absolute Transparency' : 'ሙሉ ግልጽነት'}
                </p>
              </div>
              <div className="border-l-4 border-[#3084FB] pl-4 space-y-1">
                <h4 className="text-2xl font-black text-slate-800">Gemini</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  {language === 'so' ? 'Falanqaynta AI' : language === 'en' ? 'AI Analytical Forecasts' : 'የአይአይ ትንበያዎች'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4.5: STUDENT TESTIMONIALS & SUCCESS STORIES */}
      <section id="testimonials" className="py-16 bg-[#fafbfc] px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black text-[#B932B8] bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            {language === 'so' ? 'Fikradaha Ardayda' : language === 'en' ? 'Student Testimonials' : 'የተማሪዎች ምስክርነት'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            {language === 'so' 
              ? 'Waxa ay yiraahdaan ardayda qalin-jabisay' 
              : language === 'en' 
              ? 'What Our Outstanding Students Say' 
              : 'ተማሪዎቻችን ስለ እኛ ምን ይላሉ'}
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            {language === 'so'
              ? 'Ku biir boqolaal arday oo mustaqbalkooda ka dhisay HOGAAN. Waa kuwan sheekooyinka guusha qaarkood.'
              : language === 'en'
              ? 'Join hundreds of successful graduates who built their dreams with HOGAAN. Here are some of their true success stories.'
              : 'በሆጋን ህልማቸውን ያሳኩ በመቶዎች የሚቆጠሩ ስኬታማ ተማሪዎችን ይቀላቀሉ። የእነሱ የስኬት ታሪኮች ጥቂቶቹ እነሆ።'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              id: 1,
              name: "Leyla Abdullahi Gure",
              role: {
                so: "Software Engineering",
                en: "Software Engineering Student",
                am: "የሶፍትዌር መሃንዲስ ተማሪ"
              },
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250",
              rating: 5,
              text: {
                so: "Dugsiga HOGAAN wuxuu gabi ahaanba beddelay mustaqbalkayga! Waxaan halkan ku bartay React iyo Node.js, haddana waxaan u shaqeeyaa shirkad caalami ah anigoo jooga Jigjiga.",
                en: "HOGAAN completely transformed my future! I learned React and Node.js here, and now I work for an international company right from Jigjiga.",
                am: "የሆጋን ትምህርት ቤት የወደፊት ህይወቴን ሙሉ በሙሉ ቀይሮታል! እዚህ ሪአክት እና ኖድጄስን ተምሬ አሁን በቀጥታ ከጅጅጋ ሆኜ ለአለም አቀፍ ኩባንያ እሰራለሁ።"
              }
            },
            {
              id: 2,
              name: "Abdirahman Jamal",
              role: {
                so: "Digital Marketing",
                en: "Digital Marketing Student",
                am: "የዲጂታል ማርኬቲንግ ተማሪ"
              },
              image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250",
              rating: 5,
              text: {
                so: "Casharrada iyo macalimiinta waa kuwo heer sare ah. Shahaadada aan ka qaatay HOGAAN waxay ii fududaysay inaan helo mashaariic waaweyn oo madax-bannaan.",
                en: "The lectures and teachers are world-class. The certification I received from HOGAAN made it incredibly easy for me to secure high-paying freelance projects.",
                am: "ትምህርቶቹ እና መምህራኑ በጣም ምርጥ ናቸው። ከሆጋን ያገኘሁት የምስክር ወረቀት ከፍተኛ ክፍያ የሚከፈልባቸው የፍሪላንስ ስራዎችን ለማግኘት በጣም ረድቶኛል።"
              }
            },
            {
              id: 3,
              name: "Fariha Elias",
              role: {
                so: "Graphic Design",
                en: "Graphic Design Graduate",
                am: "የግራፊክ ዲዛይን ተመራቂ"
              },
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250&h=250",
              rating: 5,
              text: {
                so: "Aad baan ugu faraxsanahay inaan doortay HOGAAN. Waxaan si fudud u bartay naqshadaynta casriga ah ee UI/UX anigoo helaya taageero joogto ah oo ku filan.",
                en: "I am so happy I chose HOGAAN. I easily mastered modern UI/UX and graphic design while receiving continuous mentorship from the faculty.",
                am: "ሆጋንን በመምረጤ በጣም ደስተኛ ነኝ። ከፋኩልቲው የማያቋርጥ ድጋፍ እያገኘሁ ዘመናዊ UI/UX እና የግራፊክ ዲዛይን በቀላሉ ተምሬያለሁ።"
              }
            },
            {
              id: 4,
              name: "Yared Solomon",
              role: {
                so: "Web Development",
                en: "Web Development Graduate",
                am: "የዌብ ልማት ተመራቂ"
              },
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250",
              rating: 5,
              text: {
                so: "Nidaamka is-diiwaangelinta ee HOGAAN waa mid aad u degdeg ah, casharada online-ka iyo kuwa fool-ka-foolka ahna si fiican ayaa loo qaabeeyay dhab ahaan.",
                en: "The enrollment process at HOGAAN was seamless, and the hybrid combination of online and physical classes is superbly structured.",
                am: "የሆጋን የምዝገባ ሂደት በጣም ፈጣን ነበር፣ እና የኦንላይን እና የአካል ክፍሎች ጥምረት በጣም ጥሩ በሆነ ሁኔታ የተዋቀረ ነው።"
              }
            }
          ].map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden group"
            >
              {/* Corner premium accent gradient decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full group-hover:scale-110 transition-transform duration-300"></div>

              <div className="space-y-4 relative z-10">
                {/* Five star rating component */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-xs text-amber-400"></i>
                  ))}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed italic">
                  "{testimonial.text[language as 'so' | 'en' | 'am'] || testimonial.text.en}"
                </p>
              </div>

              {/* Student info slot */}
              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-50 relative z-10">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-md group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm leading-tight">
                    {testimonial.name}
                  </h4>
                  <span className="text-[10px] font-bold text-[#B932B8] uppercase tracking-wider block mt-0.5">
                    {testimonial.role[language as 'so' | 'en' | 'am'] || testimonial.role.en}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CONTACT HOGAAN OFFICE */}
      <section id="contact" className="py-12 bg-slate-900 text-white rounded-[40px] px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background custom decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B932B8]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3084FB]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left direct channel info details */}
          <div className="space-y-6 flex flex-col justify-center text-left">
            <span className="text-xs font-black text-[#3084FB] bg-[#3084FB]/15 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block self-start">
              {t('menu_contact')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {language === 'so' ? 'Nala soo xiriir hadda' : language === 'en' ? 'Contact HOGAAN Office' : 'አሁኑኑ ያግኙን'}
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {language === 'so'
                ? 'Haddii aad qabto wax su\'aalo ah oo la xiriira diiwaangelinta ama baahiyada guud ee barashada rasmiga ah, fadlan warqad noogu soo qor.'
                : language === 'en'
                ? 'Do you have questions regarding enrollment limits, specific custom curriculums, or regional registration? Get in touch with our staff.'
                : 'ስለ ምዝገባዎ፣ ስለሚከታተሏቸው ክፍሎች እንዲሁም ማወቅ የሚፈልጉትን ማንኛውንም ጥያቄ እዚህ በመሙላት ያነጋግሩን።'}
            </p>

            {/* Jigjiga specific details requested by user */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-3 text-xs">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[#3084FB]">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span>Ethiopia, Jigjiga</span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[#B932B8]">
                  <i className="fas fa-envelope"></i>
                </div>
                <span>maxmaadcabdi197@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[#3084FB]">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <span>+251906567134 / +251723723088</span>
              </div>
            </div>
          </div>

          {/* Form container card inline */}
          <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 text-3xl">
                  <i className="fas fa-paper-plane animate-bounce"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('success_header')}</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {language === 'so'
                      ? 'Fariintaada waa la diray. Kooxdayada waxay kuula soo xiriiri doonaan si ku habboon.'
                      : language === 'en'
                      ? 'Your message was successfully received. Our support team will respond shortly.'
                      : 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል። አስተዳዳሪዎቻችን በቅርቡ ያነጋግሩዎታል።'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'so' ? 'Magacaaga' : language === 'en' ? 'Your Name' : 'ስምዎ'}
                  </label>
                  <input
                    required
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-[#3084FB] transition-colors text-xs"
                    placeholder="Abdi Farah / Almaz Kebede"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'so' ? 'Email-kaga' : language === 'en' ? 'Your Email' : 'ኢሜይል'}
                  </label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-[#3084FB] transition-colors text-xs"
                    placeholder="student@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'so' ? 'Fariinta' : language === 'en' ? 'Message' : 'መልዕክት'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-[#3084FB] transition-colors text-xs resize-none"
                    placeholder="..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3084FB] hover:bg-[#1a6ee1] font-black hover:bg-emerald-700 text-white rounded-xl py-3.5 mt-2 transition-transform duration-100 active:scale-95 shadow-lg shadow-sky-950 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-paper-plane text-xs"></i>
                  <span>{language === 'so' ? 'Dir Fariinta' : language === 'en' ? 'Send Message' : 'መልዕክት ላክ'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      <footer className="pt-8 text-center text-slate-450 text-xs">
        <p>© {new Date().getFullYear()} HOGAAN - {t('app_name')}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
