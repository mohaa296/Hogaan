import React, { useEffect, useState } from 'react';
import { Student } from '../types';
import { useLanguage } from '../LanguageContext';

interface PublicSuccessProps {
  student: Student | null;
  onBackHome: () => void;
  onAutoLogin: (student: Student) => void;
}

const PublicSuccess: React.FC<PublicSuccessProps> = ({ student, onBackHome, onAutoLogin }) => {
  const { language } = useLanguage();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    // Start interval countdown
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (student) {
            onAutoLogin(student);
          } else {
            onBackHome();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [student, onAutoLogin, onBackHome]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Visual neon ambient blur glows */}
      <div className="absolute -top-12 -left-12 w-96 h-96 bg-[#B932B8]/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-3xl p-8 md:p-10 text-center space-y-8 animate-in zoom-in-95 duration-300">
        {/* Animated Loading Ring & Countdown */}
        <div className="relative flex justify-center py-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Pulsing Backglow */}
            <div className={`absolute inset-0 rounded-full bg-[#B932B8]/10 animate-ping duration-1000`}></div>
            
            {/* Rotating border animation */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-white/10"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-[#B932B8]"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={314.16}
                strokeDashoffset={314.16 - (314.16 * secondsLeft) / 5}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            
            {/* Center Digit */}
            <span className="absolute text-5xl font-black text-white font-mono drop-shadow animate-pulse">
              {secondsLeft}
            </span>
          </div>
        </div>

        {/* Dynamic Titles */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            DIWAAN-GALINTAADA WAA LA ANSixiYAY!
          </h2>

          <div className="bg-[#B932B8]/10 text-white rounded-2xl py-4 px-6 border border-[#B932B8]/20 animate-pulse duration-1000">
            <p className="text-lg md:text-xl font-black tracking-wider uppercase">
              FADLAN SUG {secondsLeft} ILBIRIQSI
            </p>
            <p className="text-[10px] text-purple-200/80 mt-1 font-bold uppercase tracking-wider">
              {language === 'so' ? 'Koontadaada ayaa si toos ah loo furayaa' : 'YOUR ACCOUNT IS BEING OPENED AUTOMATICALLY'}
            </p>
          </div>
        </div>

        {/* Student Quick Credentials summary */}
        {student && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ardayga</span>
              <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">{student.id.toUpperCase()}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-white truncate">{student.fullName}</p>
              <p className="text-[11px] text-slate-400 truncate">{student.email}</p>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-slate-400 font-medium">Heerka Waxbarasho</span>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md">
                ACTIVE
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Direct Bypassing Enter Button */}
          {student && (
            <button
              onClick={() => onAutoLogin(student)}
              className="w-full bg-[#B932B8] hover:bg-[#a120a0] text-white font-black py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-lg tracking-widest uppercase text-xs"
            >
              <span>Gali Maanta (Direct)</span>
              <i className="fas fa-chevron-right text-[10px]"></i>
            </button>
          )}

          <button
            onClick={onBackHome}
            className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-slate-350 font-bold py-3.5 rounded-xl transition-all active:scale-95 text-xs tracking-wider"
          >
            {language === 'so' ? 'Ku laabo Bogga Hore' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicSuccess;
