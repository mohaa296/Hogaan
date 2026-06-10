
import React from 'react';
import { Student, RegistrationType, StudentStatus, AppNotification } from '../types';
import { useLanguage } from '../LanguageContext';

interface DashboardProps {
  students: Student[];
  notifications: AppNotification[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, notifications }) => {
  const { t } = useLanguage();
  const approvedStudents = students.filter(s => s.status === StudentStatus.APPROVED);
  const pendingCount = students.filter(s => s.status === StudentStatus.PENDING).length;

  const totalUSD = approvedStudents.reduce((sum, s) => {
    if (s.registrationType === RegistrationType.PAID && s.currency === 'USD' && s.amount) {
      return sum + parseFloat(s.amount);
    }
    return sum;
  }, 0);

  const totalETB = approvedStudents.reduce((sum, s) => {
    if (s.registrationType === RegistrationType.PAID && s.currency === 'ETB' && s.amount) {
      return sum + parseFloat(s.amount);
    }
    return sum;
  }, 0);

  const stats = [
    { label: t('approved_students'), value: approvedStudents.length, icon: 'fa-users', color: 'bg-slate-800' },
    { label: t('pending_list'), value: pendingCount, icon: 'fa-clock', color: 'bg-orange-500' },
    { 
      label: t('currency') === 'Nooca Lacagta' ? 'Dakhliga (USD)' : t('currency') === 'Currency' ? 'Income (USD)' : 'ገቢ (USD)', 
      value: `$${totalUSD.toLocaleString()}`, 
      icon: 'fa-dollar-sign', 
      color: 'bg-emerald-600' 
    },
    { 
      label: t('currency') === 'Nooca Lacagta' ? 'Dakhliga (ETB)' : t('currency') === 'Currency' ? 'Income (ETB)' : 'ገቢ (ETB)', 
      value: `${totalETB.toLocaleString()} Br`, 
      icon: 'fa-money-bill-alt', 
      color: 'bg-blue-600' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('system_overview')}</h2>
          <p className="text-slate-500">
            {t('dashboard') === 'Xogta Guud' 
              ? 'Maamul codsiyada oo hubi kobaca waxbarashada.' 
              : t('dashboard') === 'Dashboard' 
              ? 'Manage applications and track educational growth.' 
              : 'ማመልከቻዎችን ያስተዳድሩ እና የትምህርት እድገትን ይከታተሉ።'}
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {t('dashboard') === 'Xogta Guud' 
              ? 'Nidaamka waa Online' 
              : t('dashboard') === 'Dashboard' 
              ? 'System is Online' 
              : 'ስርዓቱ በመስመር ላይ ነው'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Approved Students */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">
              {t('dashboard') === 'Xogta Guud' 
                ? 'Ardaydii u dambaysay (Approved)' 
                : t('dashboard') === 'Dashboard' 
                ? 'Recently Approved Students' 
                : 'በቅርቡ የጸደቁ ተማሪዎች'}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
              {t('dashboard') === 'Xogta Guud' 
                ? 'Dhawaan' 
                : t('dashboard') === 'Dashboard' 
                ? 'Recent' 
                : 'በቅርብ ጊዜ'}
            </span>
          </div>
          <div className="space-y-4">
            {approvedStudents.slice(-5).reverse().map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    s.registrationType === RegistrationType.PAID ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {s.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.fullName}</p>
                    <p className="text-xs text-slate-400">{s.country} • {s.registrationType === RegistrationType.PAID ? t('paid') : t('free')}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-medium text-slate-400">{s.registrationDate}</p>
                   {s.amount && <p className="text-xs font-bold text-emerald-600">{s.currency === 'USD' ? '$' : ''}{s.amount}{s.currency === 'ETB' ? ' ETB' : ''}</p>}
                </div>
              </div>
            ))}
            {approvedStudents.length === 0 && (
              <div className="text-center py-10">
                <i className="fas fa-user-clock text-4xl text-slate-200 mb-2"></i>
                <p className="text-slate-400">
                  {t('dashboard') === 'Xogta Guud' 
                    ? 'Arday wali lama aqbalin.' 
                    : t('dashboard') === 'Dashboard' 
                    ? 'No approved students yet.' 
                    : 'እስካሁን የጸደቀ ተማሪ የለም።'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Messaging Log */}
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-bold text-lg flex items-center">
              <i className="fas fa-paper-plane mr-2 text-emerald-400"></i>
              {t('recent_notifications')}
            </h3>
          </div>
          <div className="flex-1 space-y-4 relative z-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {notifications.length > 0 ? notifications.map((notif) => (
              <div key={notif.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Success</span>
                  <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                   "{notif.message}"
                </p>
              </div>
            )) : (
              <div className="text-center py-10 opacity-40">
                <i className="fas fa-comment-slash text-4xl mb-4"></i>
                <p className="text-sm">
                  {t('dashboard') === 'Xogta Guud' 
                    ? 'Ma jiraan fariimo wali la diray.' 
                    : t('dashboard') === 'Dashboard' 
                    ? 'No messages sent yet.' 
                    : 'እስካሁን የተላከ መልዕክት የለም።'}
                </p>
              </div>
            )}
          </div>
          <i className="fas fa-satellite absolute -bottom-4 -right-4 text-9xl text-white/5 -rotate-12"></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
