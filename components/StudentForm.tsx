
import React, { useState, useEffect } from 'react';
import { Gender, RegistrationType, Student, StudentStatus } from '../types';

interface StudentFormProps {
  onAdd: (student: Student) => void;
  isPublic?: boolean;
}

// Somalia and Ethiopia prioritized at the top of the list
const COUNTRIES = [
  "Somalia", "Ethiopia", "Djibouti", "Kenya", "Uganda", "Sudan", "Tanzania", 
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "South Africa", "South Korea", "South Sudan", "Spain", "Bank", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const StudentForm: React.FC<StudentFormProps> = ({ onAdd, isPublic = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: Gender.MALE,
    birthDate: '',
    address: '',
    country: 'Somalia',
    registrationType: RegistrationType.PAID,
    amount: '',
    currency: 'USD' as 'USD' | 'ETB'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logic to automatically switch currency based on the selected country
  useEffect(() => {
    if (formData.country === 'Ethiopia') {
      setFormData(prev => ({ ...prev, currency: 'ETB' }));
    } else if (formData.country === 'Somalia') {
      setFormData(prev => ({ ...prev, currency: 'USD' }));
    }
  }, [formData.country]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Magaca oo dhamaystiran waa khasab';
    if (!formData.email.trim()) newErrors.email = 'Email-ka waa khasab';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email-ku ma saxna';
    if (!formData.phone.trim()) newErrors.phone = 'Lambarka telefoonka waa khasab';
    if (!formData.birthDate) newErrors.birthDate = 'Taariikhda dhalashada waa khasab';
    if (!formData.address.trim()) newErrors.address = 'Cinwaanka waa khasab';
    if (!formData.country) newErrors.country = 'Fadlan dooro wadanka';
    
    if (formData.registrationType === RegistrationType.PAID && !formData.amount.trim()) {
      newErrors.amount = 'Fadlan gali cadadka lacagta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newStudent: Student = {
        ...formData,
        id: Math.random().toString(36).slice(2, 11),
        registrationDate: new Date().toLocaleDateString('so-SO'),
        amount: formData.registrationType === RegistrationType.PAID ? formData.amount : undefined,
        currency: formData.registrationType === RegistrationType.PAID ? formData.currency : undefined,
        status: StudentStatus.PENDING
      };
      
      onAdd(newStudent);
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        gender: Gender.MALE,
        birthDate: '',
        address: '',
        country: 'Somalia',
        registrationType: RegistrationType.PAID,
        amount: '',
        currency: 'USD'
      });
      setErrors({});
      setIsSubmitting(false);
      
      if (!isPublic) {
        alert('Codsiga waa la diray, wuxuu sugayaa in la aqbalo!');
      }
    }, 800);
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-slate-900 font-medium text-base placeholder:text-slate-400";
    const errorClass = errors[fieldName] 
      ? "border-red-500 focus:ring-red-100 bg-red-50" 
      : "border-slate-300 focus:ring-emerald-500 bg-white hover:border-slate-400";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${isPublic ? 'max-w-3xl mx-auto my-8' : ''}`}>
      <div className="bg-emerald-600 p-8 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
             <i className="fas fa-id-card text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold">{isPublic ? 'Codso Diwaangalin Cusub' : 'Foomka Diwaangalinta Cusub'}</h2>
        </div>
        <p className="text-emerald-100/80 text-sm font-medium">Macluumaadkaagu waa mid ammaan ah oo sir ah.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Registration Type Selector */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Nooca Diwaangalinta</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({...formData, registrationType: RegistrationType.PAID});
                setErrors({...errors, amount: ''});
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                formData.registrationType === RegistrationType.PAID
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg scale-[1.02]'
                  : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
              }`}
            >
              <i className="fas fa-money-bill-wave text-3xl mb-2"></i>
              <span className="font-black uppercase tracking-wider text-xs">Lacag ah</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({...formData, registrationType: RegistrationType.FREE});
                const newErrs = {...errors};
                delete newErrs.amount;
                setErrors(newErrs);
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                formData.registrationType === RegistrationType.FREE
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-[1.02]'
                  : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
              }`}
            >
              <i className="fas fa-gift text-3xl mb-2"></i>
              <span className="font-black uppercase tracking-wider text-xs">Free ah</span>
            </button>
          </div>
        </div>

        {/* Amount & Currency */}
        {formData.registrationType === RegistrationType.PAID && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Lacagta (Currency)</label>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, currency: 'USD'})}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${formData.currency === 'USD' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, currency: 'ETB'})}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${formData.currency === 'ETB' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    ETB (Br)
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Cadadka Lacagta</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${errors.amount ? 'text-red-500' : 'text-emerald-600'}`}>
                    {formData.currency === 'USD' ? '$' : 'Br'}
                  </span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border outline-none transition-all font-bold text-lg text-slate-900 ${
                      errors.amount 
                        ? 'border-red-400 focus:ring-red-100 bg-white' 
                        : 'border-slate-200 focus:ring-emerald-100 bg-white'
                    }`}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            {errors.amount && <p className="text-xs font-bold text-red-600 flex items-center px-1"><i className="fas fa-exclamation-circle mr-1"></i> {errors.amount}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Magaca oo dhamaystiran</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className={getInputClass('fullName')}
              placeholder="Axmed Maxamed Cali"
            />
            {errors.fullName && <p className="text-xs font-bold text-red-600">{errors.fullName}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Email-ka</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={getInputClass('email')}
              placeholder="student@example.com"
            />
            {errors.email && <p className="text-xs font-bold text-red-600">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Wadanka</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className={getInputClass('country')}
            >
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Telefoonka</label>
            <div className="relative">
              <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={`${getInputClass('phone')} pl-10`}
                placeholder="+252..."
              />
            </div>
            {errors.phone && <p className="text-xs font-bold text-red-600">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Taariikhda Dhalashada</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              className={getInputClass('birthDate')}
            />
            {errors.birthDate && <p className="text-xs font-bold text-red-600">{errors.birthDate}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Jinsiga</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
              className={getInputClass('gender')}
            >
              {Object.values(Gender).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-bold text-slate-700">Hoyga (Cinwaanka)</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className={getInputClass('address')}
              placeholder="Degmada, Xaafadda, Jidka..."
            />
            {errors.address && <p className="text-xs font-bold text-red-600">{errors.address}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>Dirayaa...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                <span>{isPublic ? 'Dir Codsiga Diwaangalinta' : 'Diiwaangali Hadda'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
