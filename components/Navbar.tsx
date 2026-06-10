import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, LanguageType } from '../LanguageContext';
import { Student } from '../types';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: 'landing' | 'public-register' | 'student-login' | 'dashboard' | 'courses') => void;
  onScrollToSection?: (sectionId: string) => void;
  activeStudent?: Student | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onSelectView, onScrollToSection, activeStudent, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (lang: LanguageType) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavItemClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      onSelectView('landing');
      // Delay slightly to allow landing view to mount
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const languagesList = [
    { code: 'so' as LanguageType, label: t('somali'), flag: '🇸🇴' },
    { code: 'en' as LanguageType, label: t('english'), flag: '🇬🇧' },
    { code: 'am' as LanguageType, label: t('amharic'), flag: '🇪🇹' }
  ];

  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* 2. Main Navigation Bar with deep navy-slate background and exact aesthetics */}
      <div className="w-full bg-[#10223d]/90 backdrop-blur-md border-b border-slate-800/60 text-white py-4 md:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Brand exactly as shown in screenshot */}
            <button 
              onClick={() => onSelectView('landing')} 
              className="flex items-center space-x-2.5 group text-left focus:outline-none"
            >
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <div className="absolute top-0.5 left-0.5 w-7 h-7 bg-purple-500 rounded-sm opacity-90 group-hover:scale-105 transition-transform duration-300"></div>
                <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-[#B932B8] rounded-sm transform border border-slate-950 flex items-center justify-center shadow-md">
                  <i className="fas fa-graduation-cap text-[10px] text-white"></i>
                </div>
              </div>
              <span className="text-xl md:text-2xl font-black tracking-wider text-[#B932B8] group-hover:brightness-110 transition-all">
                HOG<span className="text-white">AAN</span>
              </span>
            </button>

            {/* Desktop Navigation Link Menu */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button 
                onClick={() => handleNavItemClick('hero')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  currentView === 'landing' ? 'text-[#B932B8]' : 'text-slate-300 hover:text-[#B932B8]'
                }`}
              >
                {language === 'so' ? 'OY' : language === 'en' ? 'HOME' : 'መነሻ'}
              </button>
              
              <button 
                onClick={() => handleNavItemClick('about')}
                className="px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider text-slate-300 hover:text-[#B932B8] transition-all duration-200"
              >
                {language === 'so' ? 'NAGU SAABSAN' : language === 'en' ? 'ABOUT US' : 'ስለ እኛ'}
              </button>

              <button 
                onClick={() => handleNavItemClick('service')}
                className="px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider text-slate-300 hover:text-[#B932B8] transition-all duration-200"
              >
                {language === 'so' ? 'KADIMIYA' : language === 'en' ? 'FACULTY' : 'ፋኩልቲ'}
              </button>

              {/* "PAGES" Dropdown holding Language, Student portal and Admin links */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider text-slate-300 hover:text-[#B932B8] transition-all duration-200 flex items-center space-x-1.5 focus:outline-none ${
                    langDropdownOpen ? 'text-[#B932B8]' : ''
                  }`}
                >
                  <span>{language === 'so' ? 'BOGAGGA' : language === 'en' ? 'PAGES' : 'ገጾች'}</span>
                  <i className={`fas fa-chevron-down text-[9px] transition-transform duration-300 ${langDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {langDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-[#10223d] rounded-xl shadow-2xl border border-slate-755/80 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    <div className="px-4 py-1.5 border-b border-slate-800 mb-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                        {language === 'so' ? 'XULASHOOYINKA' : language === 'en' ? 'PORTALS & UTILITIES' : 'ፖርታሎች እና አገልግሎቶች'}
                      </span>
                    </div>
                    
                    {/* Student Login link */}
                    <button
                      onClick={() => {
                        setLangDropdownOpen(false);
                        onSelectView('student-login');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/40 hover:text-[#B932B8] transition-colors"
                    >
                      <i className="fas fa-user-lock text-[11px] text-amber-500 w-4"></i>
                      <span>{language === 'so' ? 'Giriibka Ardayga' : language === 'en' ? 'Student Portal' : 'የተማሪ መግቢያ'}</span>
                    </button>

                    {/* Admin Dashboard link */}
                    <button
                      onClick={() => {
                        setLangDropdownOpen(false);
                        onSelectView('dashboard');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800/40 hover:text-[#B932B8] transition-colors"
                    >
                      <i className="fas fa-columns text-[11px] text-amber-500 w-4"></i>
                      <span>{language === 'so' ? 'Xogta Maamulka' : language === 'en' ? 'Admin Dashboard' : 'አስተዳዳሪ ዳሽቦርድ'}</span>
                    </button>

                    <div className="px-4 py-1.5 border-t border-b border-slate-800 my-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                        {language === 'so' ? 'Ugu Beddel Luuqad' : language === 'en' ? 'Select Language' : 'ቋንቋ ቀይር'}
                      </span>
                    </div>

                    {languagesList.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold transition-colors hover:bg-slate-800/40 ${
                          language === lang.code ? 'text-[#B932B8] bg-slate-800/30' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        {language === lang.code && (
                          <i className="fas fa-check text-[9px] text-[#B932B8]"></i>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleNavItemClick('contact')}
                className="px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider text-slate-300 hover:text-[#B932B8] transition-all duration-200"
              >
                {language === 'so' ? 'LA XIRIIR' : language === 'en' ? 'CONTACT US' : 'ያግኙን'}
              </button>
            </nav>

             {/* Right Controls Action Button matching mock-up screen exactly */}
            <div className="hidden md:flex items-center space-x-4">
              {activeStudent ? (
                <>
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                    }}
                    className="text-xs font-black uppercase tracking-wider hover:text-red-400 text-slate-300 transition-all px-3 py-2"
                  >
                    {language === 'so' ? 'LOG OUT' : language === 'en' ? 'LOG OUT' : 'ውጣ'}
                  </button>

                  <button 
                    onClick={() => onSelectView('courses')}
                    className="bg-[#B932B8] hover:bg-[#a120a0] text-white px-6 py-3.5 rounded-sm text-xs font-black tracking-widest uppercase transition-all shadow-md transform active:scale-95 duration-150"
                  >
                    {language === 'so' ? 'MY ACCOUNT' : language === 'en' ? 'MY ACCOUNT' : 'የእኔ መለያ'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onSelectView('student-login')}
                    className={`text-xs font-black uppercase tracking-wider hover:text-[#B932B8] transition-all px-3 py-2 ${
                      currentView === 'student-login' ? 'text-[#B932B8]' : 'text-slate-300'
                    }`}
                  >
                    {language === 'so' ? 'LOGIN' : language === 'en' ? 'LOGIN' : 'ግባ'}
                  </button>

                  <button 
                    onClick={() => onSelectView('student-login')}
                    className="bg-[#B932B8] hover:bg-[#a120a0] text-white px-6 py-3.5 rounded-sm text-xs font-black tracking-widest uppercase transition-all shadow-md transform active:scale-95 duration-150"
                  >
                    {language === 'so' ? 'SIGN IN' : language === 'en' ? 'SIGN IN' : 'ይመዝገቡ'}
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu toggle bar */}
            <div className="flex items-center md:hidden space-x-3">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 px-3.5 rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/20 transition-all"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-base`}></i>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer menu list */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#10223d] p-6 space-y-4 animate-in slide-in-from-top duration-300 z-40 text-left text-white">
          <div className="space-y-1">
            <button 
              onClick={() => handleNavItemClick('hero')}
              className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-[#B932B8] flex items-center space-x-3"
            >
              <i className="fas fa-home text-slate-400 w-5"></i>
              <span>{t('menu_home')}</span>
            </button>
            <button 
              onClick={() => handleNavItemClick('about')}
              className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-[#B932B8] flex items-center space-x-3"
            >
              <i className="fas fa-info-circle text-slate-400 w-5"></i>
              <span>{t('menu_about')}</span>
            </button>
            <button 
              onClick={() => handleNavItemClick('service')}
              className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-[#B932B8] flex items-center space-x-3"
            >
              <i className="fas fa-book-open text-slate-400 w-5"></i>
              <span>{language === 'so' ? 'Koorsooyinka' : language === 'en' ? 'Faculty' : 'ኮርሶች'}</span>
            </button>
            <button 
              onClick={() => handleNavItemClick('contact')}
              className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-[#B932B8] flex items-center space-x-3"
            >
              <i className="fas fa-envelope text-slate-400 w-5"></i>
              <span>{t('menu_contact')}</span>
            </button>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-3 px-4">
              {language === 'so' ? 'BORTALADA' : language === 'en' ? 'PORTALS' : 'ጌቶች'}
            </p>
            <div className="grid grid-cols-2 gap-2 px-2 mb-4">
              {activeStudent ? (
                <>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSelectView('courses');
                    }}
                    className="py-2.5 rounded-lg bg-[#B932B8]/20 hover:bg-[#B932B8]/30 text-[#B932B8] text-xs font-black flex items-center justify-center space-x-2 border border-[#B932B8]/30 uppercase tracking-wider"
                  >
                    <i className="fas fa-user-circle"></i>
                    <span>{language === 'so' ? 'MY ACCOUNT' : 'MY ACCOUNT'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="py-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/30 text-red-400 text-xs font-black flex items-center justify-center space-x-2 border border-red-900/40 uppercase tracking-wider"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>{language === 'so' ? 'LOG OUT' : 'LOG OUT'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSelectView('student-login');
                    }}
                    className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 border border-white/10 uppercase tracking-wider"
                  >
                    <i className="fas fa-user-lock text-amber-500"></i>
                    <span>LOGIN</span>
                  </button>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSelectView('student-login');
                    }}
                    className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 border border-white/10 uppercase tracking-wider"
                  >
                    <i className="fas fa-sign-in-alt text-[#B932B8]"></i>
                    <span>SIGN IN</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-3 px-4">
              {t('menu_change_lang')}
            </p>
            <div className="grid grid-cols-3 gap-2 px-2">
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangSelect(lang.code)}
                  className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                    language === lang.code 
                      ? 'border-[#B932B8] bg-[#B932B8]/10 text-[#B932B8]' 
                      : 'border-slate-800 hover:border-slate-700 text-slate-350 bg-slate-900/30'
                  }`}
                >
                  <span className="text-lg mb-1">{lang.flag}</span>
                  <span className="text-[9px] font-black">{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

