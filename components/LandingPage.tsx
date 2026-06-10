import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import heroHandshakeImg from '../src/assets/images/corporate_handshake_team_1781102049797.png';
import { Course } from '../types';

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
          <div className="lg:col-span-7 space-y-8 text-left">
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
          </div>

          {/* Right Column: Beautiful translucent overlay stats glass badges with no giant solid backing block to preserve the backdrop student visibility fully */}
          <div className="lg:col-span-5 relative w-full h-[540px] hidden lg:flex items-center justify-center">
            
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

          </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => onSelectView('public-register')}
              className="group bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#3084FB] group-hover:text-white transition-all duration-300 group-hover:scale-110">
                <i className={`fas ${cat.icon} text-lg`}></i>
              </div>
              <h3 className="font-extrabold text-slate-850 text-sm tracking-wide mb-1 transition-colors group-hover:text-[#B932B8]">{cat.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest">
                {cat.count} {language === 'so' ? 'Koorso' : language === 'en' ? 'Programs' : 'ትምህርቶች'}
              </p>
            </button>
          ))}
        </div>
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
            return (
              <div 
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden"
              >
                {/* Colored side indicator */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${course.color || 'bg-[#B932B8]'}`}></div>

                <div className="p-6 space-y-4">
                  {/* Header elements: Thumbnail or Icon placeholder */}
                  {hasThumbnail ? (
                    <div className="w-full h-40 rounded-2xl overflow-hidden relative bg-slate-100">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
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
                  <span className="text-[10px] font-bold text-slate-400">
                    <i className="far fa-calendar-alt mr-1"></i>
                    {course.createdAt || "June 18, 2026"}
                  </span>

                  <button
                    onClick={() => onSelectView('public-register')}
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
