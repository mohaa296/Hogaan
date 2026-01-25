
import React from 'react';

interface LandingPageProps {
  onSelectView: (view: 'public-register' | 'dashboard' | 'student-login') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectView }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-6xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-block p-4 bg-emerald-100 rounded-3xl mb-4">
            <i className="fas fa-graduation-cap text-5xl text-emerald-600"></i>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">
            HOG<span className="text-emerald-600">AAN</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ku soo dhawaaw nidaamka casriga ah ee diwaangalinta iyo maamulka ardayda. Hogaami mustaqbalkaaga waxbarasho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Student Registration Card */}
          <button 
            onClick={() => onSelectView('public-register')}
            className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-emerald-500 text-left flex flex-col h-full"
          >
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-user-graduate text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Is-diiwaangali</h3>
            <p className="text-slate-500 mb-8 flex-grow text-sm">Haddii aad tahay arday cusub oo raba inuu ku soo biiro dugsiga, halkan ka buuxi foomka diwaangalinta.</p>
            <div className="flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
              <span>Biloow Hadda</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </button>

          {/* Student Courses Card */}
          <button 
            onClick={() => onSelectView('student-login')}
            className="group bg-emerald-600 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full text-white"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-book-reader text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-3">Gali Koorsooyinka</h3>
            <p className="text-emerald-100 mb-8 flex-grow text-sm">Haddii aad tahay arday hore oo la aqbalay, halkan ka gal qaybta koorsooyinkaaga iyo casharadaada.</p>
            <div className="flex items-center font-bold group-hover:translate-x-2 transition-transform">
              <span>Fura Koorsooyinka</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </button>

          {/* Admin Dashboard Card */}
          <button 
            onClick={() => onSelectView('dashboard')}
            className="group bg-slate-900 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full"
          >
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-user-shield text-2xl text-emerald-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Maamulka</h3>
            <p className="text-slate-400 mb-8 flex-grow text-sm">Halkan waxaa loogu talagalay maamulka si ay u hubiyaan codsiyada iyo xogta guud ee ardayda.</p>
            <div className="flex items-center text-emerald-400 font-bold group-hover:translate-x-2 transition-transform">
              <span>Gali Dashboard</span>
              <i className="fas fa-lock ml-2"></i>
            </div>
          </button>
        </div>

        <div className="pt-12 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} HOGAAN - Nidaamka Maamulka Waxbarashada</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
