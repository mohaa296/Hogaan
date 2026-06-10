import React from 'react';
import { useLanguage, LanguageType } from '../LanguageContext';

const LanguageManager: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const locales: { code: LanguageType; name: string; localName: string; flag: string; desc: string }[] = [
    {
      code: 'so',
      name: 'Somali',
      localName: 'Soomaali',
      flag: '🇸🇴',
      desc: 'Ku isticmaal nidaamka afka hooyo ee Soomaaliga.'
    },
    {
      code: 'en',
      name: 'English',
      localName: 'English',
      flag: '🇬🇧',
      desc: 'Use the system in standard English language.'
    },
    {
      code: 'am',
      name: 'Amharic',
      localName: 'አማርኛ',
      flag: '🇪🇹',
      desc: 'ስርዓቱን በዓማርኛ ቋንቋ ይጠቀሙ።'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-1">
      {/* Title Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('choose_app_language')}
        </h2>
        <p className="text-slate-500 max-w-xl">
          {t('select_language_desc')}
        </p>
      </div>

      {/* Language Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locales.map((locale) => {
          const isSelected = language === locale.code;
          return (
            <button
              key={locale.code}
              onClick={() => setLanguage(locale.code)}
              className={`group relative text-left bg-white p-8 rounded-3xl shadow-md border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-emerald-500 ring-4 ring-emerald-50'
                  : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {locale.flag}
                </span>
                {isSelected ? (
                  <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs animate-in zoom-in duration-300">
                    <i className="fas fa-check"></i>
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors"></span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 flex items-baseline space-x-2">
                  <span>{locale.localName}</span>
                  {locale.name !== locale.localName && (
                    <span className="text-xs text-slate-400 font-medium font-sans">({locale.name})</span>
                  )}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
                  {locale.desc}
                </p>
              </div>

              {/* Decorative Accent on select */}
              {isSelected && (
                <div className="absolute inset-x-8 bottom-0 h-1 bg-emerald-500 rounded-t-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Real-time System Update Info Card */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-start space-x-4">
        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
          <i className="fas fa-magic text-xl"></i>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-900 text-base">
            {t('language_updated')}
          </h4>
          <p className="text-sm text-emerald-700/80 leading-relaxed">
            {language === 'so'
              ? 'Nidaamka wuxuu hadda si buuxda u qaatay af Soomaaliga. Dhammaan boggaga, foomamka iyo badhamada si toos ah ayay isu bedeleen.'
              : language === 'en'
              ? 'The system has fully successfully loaded the English locale. All interfaces, tables, and settings have adjusted instantly.'
              : 'ስርዓቱ በአሁኑ ጊዜ ሙሉ በሙሉ ወደ አማርኛ ቋንቋ ተቀይሯል። ሁሉም ቅጾች፣ ሰንጠረዦችና መቼቶች ወዲያውኑ ተስተካክለዋል።'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageManager;
