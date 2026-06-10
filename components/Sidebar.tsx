
import React from 'react';
import { StudentStatus, Student } from '../types';
import { useLanguage } from '../LanguageContext';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  students: Student[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, students }) => {
  const { language, t } = useLanguage();
  const pendingCount = students.filter(s => s.status === StudentStatus.PENDING).length;

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: 'fa-chart-pie' },
    { id: 'pending-list', label: t('pending_list'), icon: 'fa-clock', badge: pendingCount },
    { id: 'register', label: t('register'), icon: 'fa-user-plus' },
    { id: 'list', label: t('approved_students'), icon: 'fa-users' },
    { id: 'manage-courses', label: t('manage_courses'), icon: 'fa-layer-group' },
    { id: 'ai-insights', label: t('ai_insights'), icon: 'fa-robot' },
    { id: 'student-chat', label: language === 'so' ? 'Wada-hadalka (Chat)' : 'Student Chat', icon: 'fa-comments' },
    { id: 'languages', label: t('languages'), icon: 'fa-language' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-full fixed left-0 top-0 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-wider text-[#B932B8]">HOGAAN</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{t('maamulka')}</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              currentView === item.id 
                ? 'bg-[#B932B8] text-white shadow-lg shadow-purple-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
        
        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={() => setView('landing')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white hover:text-[#B932B8] transition-all"
            title="Safar Home"
          >
            <i className="fas fa-arrow-left w-5"></i>
            <span className="font-medium">{t('log_out')} (Dib u laabo)</span>
          </button>
        </div>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 p-2 bg-slate-800 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#B932B8] flex items-center justify-center text-xs font-bold">AD</div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{t('admin_user')}</p>
            <p className="text-xs text-slate-400">{t('main_admin')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
