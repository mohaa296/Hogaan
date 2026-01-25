
import React from 'react';

interface PublicSuccessProps {
  onBackHome: () => void;
}

const PublicSuccess: React.FC<PublicSuccessProps> = ({ onBackHome }) => {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-6xl text-emerald-600"></i>
          </div>
          <div className="absolute top-0 right-1/4 animate-bounce">
            <i className="fas fa-star text-yellow-400 text-xl"></i>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase">
            Waad Ku Mahadsantahay!
          </h2>
          <p className="text-xl font-bold text-emerald-700 leading-relaxed px-2">
            WAXAA SI GUU LEH LOO DIRAY DIWAAN GALINTAADA FADLAN SUG JAWAABTA
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-sm text-slate-500">
            Waxaan dib u eegi doonaa macluumaadkaaga, waxaana kugula soo xiriiri doonaa Email-ka ama Telefoonka aad noo reebtay.
          </p>
        </div>

        <button 
          onClick={onBackHome}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
        >
          <i className="fas fa-home"></i>
          <span>Ku Laabo Bogga Hore</span>
        </button>
      </div>
    </div>
  );
};

export default PublicSuccess;
