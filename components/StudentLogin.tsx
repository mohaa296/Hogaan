import React, { useState } from 'react';
import { Student, StudentStatus } from '../types';
import { useLanguage } from '../LanguageContext';

interface StudentLoginProps {
  students: Student[];
  onLoginSuccess: (student: Student) => void;
  onAdminLoginSuccess: () => void;
  onCancel: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({
  students,
  onLoginSuccess,
  onAdminLoginSuccess,
  onCancel
}) => {
  const { language, t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign-In Selector Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate short network delay
    setTimeout(() => {
      // Check Admin Bypass
      if (
        (identifier.trim().toLowerCase() === 'admin' || identifier.trim().toLowerCase() === 'admin@hogaan.com') && 
        password.trim() === 'admin'
      ) {
        setIsLoading(false);
        onAdminLoginSuccess();
        return;
      }

      // Check student list for approved matching email, phone or full name
      const student = students.find(
        (s) =>
          s.email.toLowerCase() === identifier.trim().toLowerCase() ||
          s.phone === identifier.trim() ||
          s.fullName.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (!student) {
        setError(
          language === 'so'
            ? 'Codsigaaga laguma helin nidaamka. Fadlan marka hore is-diwaangali ama hubi xogta aad gelisay.'
            : 'We couldn’t find this student account. Please make sure the email or phone is correct or register first.'
        );
        setIsLoading(false);
        return;
      }

      if (student.status === StudentStatus.PENDING) {
        setError(
          language === 'so'
            ? 'Codsigaaga wali wuu socdaa (Pending). Fadlan sug inta uu maamuluhu kaa aqbalayo!'
            : 'Your student application is currently pending approval. Please wait for official administrative verification.'
        );
        setIsLoading(false);
        return;
      }

      if (student.status === StudentStatus.REJECTED) {
        setError(
          language === 'so'
            ? 'Waan ka xunnahay, codsigan waa la diiday nidaamka.'
            : 'We regret to inform you that this application was rejected.'
        );
        setIsLoading(false);
        return;
      }

      // Password is simulated - allow any password to proceed in this frontend build
      if (password.length < 4) {
        setError(
          language === 'so'
            ? 'Erayga sirta ah (Password) waa inuu ka koobnaadaa ugu yaraan 4 xaraf!'
            : 'Password must be at least 4 characters long!'
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLoginSuccess(student);
    }, 850);
  };

  const handleGoogleSelect = (studentEmail: string) => {
    setError('');
    setShowGoogleModal(false);
    setIsLoading(true);

    setTimeout(() => {
      const student = students.find(s => s.email.toLowerCase() === studentEmail.toLowerCase());
      if (student) {
        if (student.status === StudentStatus.APPROVED) {
          onLoginSuccess(student);
        } else if (student.status === StudentStatus.PENDING) {
          setError(
            language === 'so'
              ? `Email-kaan Google (${studentEmail}) waxa uu ku jiraa nidaamka ee heerkiisu waa la-sugid (Pending).`
              : `Google Account (${studentEmail}) corresponds to a pending student registration.`
          );
        } else {
          setError(
            language === 'so'
              ? `Email-kaan Google (${studentEmail}) waa la diiday.`
              : `Google Account (${studentEmail}) registration was rejected.`
          );
        }
      } else {
        // If student does not exist, let's simulate creating a guest mock profile so they can enter
        // Or tell them to register
        setError(
          language === 'so'
            ? `Email-kaan Google (${studentEmail}) kama diiwaangashna nidaamka HOGAAN. Fadlan is-diiwaangali marka hore!`
            : `This Google account (${studentEmail}) is not registered yet. Please click SIGN UP or Register first!`
        );
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 md:p-8">
      {/* Background abstract decoration blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-300/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-[32px] border border-slate-200/80 shadow-2xl p-8 md:p-10 space-y-8 relative animate-in zoom-in-95 duration-200">
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 w-9 h-9 text-slate-400 hover:text-[#B932B8] hover:bg-slate-50 rounded-full flex items-center justify-center transition-all active:scale-90"
          title={language === 'so' ? 'Ku laabo' : 'Go back'}
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>

        {/* Logo and Header Details */}
        <div className="text-center space-y-2 pt-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-[#B932B8] mx-auto mb-3">
            <i className="fas fa-user-shield text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-[#10223d] tracking-tight">
            {language === 'so' ? 'Gali Koontadaada' : 'Sign In to Account'}
          </h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {language === 'so' ? 'Dugsiga Sare ee HOGAAN' : 'HOGAAN Academy Student Portal'}
          </p>
        </div>

        {/* Display System Error alerts */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-xs md:text-sm font-medium flex items-start space-x-2 animate-in fade-in duration-200">
            <i className="fas fa-exclamation-circle mt-0.5 text-xs text-red-500 shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Interactive Sign-In with Username or Email & Password */}
        <form onSubmit={handlePasswordLogin} className="space-y-5">
          {/* Input field: Username or Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              {language === 'so' ? 'Gmail ama Magaca' : 'Gmail or Username'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <i className="far fa-envelope text-xs"></i>
              </span>
              <input
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: student@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm font-medium border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-2xl text-slate-900"
              />
            </div>
            <p className="text-[9px] text-slate-400 font-medium">
              {language === 'so'
                ? '* Tusaale: Gali Gmail-ka aad isku qortay'
                : '* Note: Use your registered Gmail or Phone'}
            </p>
          </div>

          {/* Input field: Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                {language === 'so' ? 'Erayga Sirta ah (Password)' : 'Password'}
              </label>
              <span className="text-[9px] text-[#B932B8] font-bold cursor-pointer hover:underline">
                {language === 'so' ? 'Ma ilowday?' : 'Forgot?'}
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <i className="fas fa-lock text-xs"></i>
              </span>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm font-medium border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all rounded-2xl text-slate-900 font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-[#B932B8] outline-none"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
              </button>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">
              {language === 'so'
                ? '* Demo: Labada Admin waa admin/admin. Ardayda gali password kasta'
                : '* Sandbox: Admin is admin/admin. Students can enter any passcode'}
            </p>
          </div>

          {/* Submit standard Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 hover:bg-[#B932B8] text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl shadow-xl hover:shadow-[#B932B8]/20 transition-all active:scale-[0.98] duration-150 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch animate-spin"></i>
                <span>{language === 'so' ? 'HADAAD GALEESAA...' : 'VERIFYING...'}</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt text-xs"></i>
                <span>{language === 'so' ? 'GALI KOONTADA' : 'LOG IN'}</span>
              </>
            )}
          </button>
        </form>

        {/* Separation Segment with design clarity */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-wider">
            {language === 'so' ? 'Ama ku gal' : 'Or connect with'}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Highfidelity Sign In with "your Google account" */}
        <button
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-3.5 bg-white border-2 border-slate-200/80 hover:border-slate-350 hover:bg-slate-50 text-slate-700 text-xs md:text-sm font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 shadow-sm"
        >
          {/* Standard Google Multi-colored Logo G vector */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.99 1 12 1 7.37 1 3.4 3.65 1.48 7.5l3.97 3.08C6.39 7.42 9 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.54-1.14 2.85-2.4 3.71l3.73 2.89c2.18-2.01 3.7-4.98 3.7-8.75z"
            />
            <path
              fill="#FBBC05"
              d="M5.45 10.58c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29L1.48 3.5C.65 5.15.18 7.02.18 9s.47 3.85 1.3 5.5l3.97-3.08z"
            />
            <path
              fill="#34A853"
              d="M12 18.96c-3 0-5.61-2.38-6.55-5.54L1.48 16.5C3.4 20.35 7.37 23 12 23c2.99 0 5.86-.98 8.01-2.82l-3.73-2.89c-1.12.75-2.5 1.27-4.28 1.27z"
            />
          </svg>
          <span>{language === 'so' ? 'Ku gal barandada Google' : 'Sign in with Google Account'}</span>
        </button>

        {/* Back and Registration guidance */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-medium">
            {language === 'so' ? 'Arday cusub miyaad tahay?' : 'New to HOGAAN?'}
            <button
              onClick={() => onCancel()}
              className="text-[#B932B8] font-bold hover:underline ml-1 cursor-pointer outline-none"
            >
              {language === 'so' ? 'Is-diiwaangali hadda' : 'Sign up / Apply Now'}
            </button>
          </p>
        </div>
      </div>

      {/* Popover Card simulating Google Account Chooser */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.54-1.14 2.85-2.4 3.71l3.73 2.89c2.18-2.01 3.7-4.98 3.7-8.75z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c4.63 0 8.6-2.65 10.52-6.5l-3.97-3.08c-.94 3.16-3.55 5.54-6.55 5.54-3.55 0-6.55-2.38-7.5-5.54L.57 16.5C2.49 20.35 6.46 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.5 13.46c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29L.57 5.8C-.26 7.45-.73 9.32-.73 11.27s.47 3.82 1.3 5.47l3.93-3.082z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.04c1.66 0 3.2.53 4.38 1.63L19.65 2.4C16.89-.32 14.12-.96 11.12-.96 6.46-.96 2.49 1.69.57 5.54l3.93 3.082C5.45 6.46 8.45 4.04 12 4.04z"
                  />
                </svg>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest font-sans">Google Accounts</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Choose an account</h3>
              <p className="text-slate-400 text-xs">to continue to <span className="font-bold text-[#B932B8]">HOGAAN Digital</span></p>
            </div>

            {/* List of Simulated Google Accounts */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {/* Account 1: Developer Account */}
              <button
                onClick={() => handleGoogleSelect('maxmaadcabdi197@gmail.com')}
                className="w-full p-3.5 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-purple-200 text-sm font-black flex items-center justify-center">
                    M
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Maxmaadcabdi</p>
                    <p className="text-[10px] text-slate-400 truncate">maxmaadcabdi197@gmail.com</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#B932B8] text-right uppercase tracking-wider shrink-0">Developer</span>
              </button>

              {/* Account 2...N: Map existing student emails dynamically to select them directly! */}
              {students.slice(0, 3).map((stu, index) => (
                <button
                  key={stu.id}
                  onClick={() => handleGoogleSelect(stu.email)}
                  className="w-full p-3.5 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-[#B932B8] text-sm font-black flex items-center justify-center">
                      {stu.fullName[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate">{stu.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{stu.email}</p>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-[10px] text-slate-300 group-hover:text-[#B932B8] shrink-0"></i>
                </button>
              ))}

              {/* Option to login with another custom simulation account */}
              <button
                onClick={() => {
                  const emailInput = prompt("Gali Gmail-ka (Google Account Email):");
                  if (emailInput && emailInput.trim()) {
                    handleGoogleSelect(emailInput.trim());
                  }
                }}
                className="w-full p-3 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3.5 text-left transition-colors text-slate-600 hover:text-slate-900"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                  <i className="fas fa-user-plus text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-bold">{language === 'so' ? 'Adeegso koonto kale' : 'Use another account'}</p>
                </div>
              </button>
            </div>

            <p className="text-[9px] text-slate-400 leading-normal text-center">
              To continue, Google will share your name, email address, profile picture, and language preference with HOGAAN Digital Academy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;
