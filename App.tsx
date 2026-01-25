
import React, { useState, useEffect } from 'react';
import { AppState, Student, StudentStatus, AppNotification, Course } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import PendingList from './components/PendingList';
import AIInsights from './components/AIInsights';
import LandingPage from './components/LandingPage';
import PublicSuccess from './components/PublicSuccess';
import Courses from './components/Courses';
import CourseManager from './components/CourseManager';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    students: [],
    courses: [],
    notifications: [],
    view: 'landing'
  });

  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedStudents = localStorage.getItem('hogaan_students');
    const savedNotifs = localStorage.getItem('hogaan_notifications');
    const savedCourses = localStorage.getItem('hogaan_courses');
    
    setState(prev => ({ 
      ...prev, 
      students: savedStudents ? JSON.parse(savedStudents) : [],
      notifications: savedNotifs ? JSON.parse(savedNotifs) : [],
      courses: savedCourses ? JSON.parse(savedCourses) : []
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('hogaan_students', JSON.stringify(state.students));
    localStorage.setItem('hogaan_notifications', JSON.stringify(state.notifications));
    localStorage.setItem('hogaan_courses', JSON.stringify(state.courses));
  }, [state.students, state.notifications, state.courses]);

  const addStudent = (newStudent: Student) => {
    const isPublicMode = state.view === 'public-register';
    const studentWithStatus = { ...newStudent, status: StudentStatus.PENDING };
    
    setState(prev => ({
      ...prev,
      students: [...prev.students, studentWithStatus],
      view: isPublicMode ? 'public-success' : 'pending-list'
    }));
  };

  const addCourse = (course: Course) => {
    setState(prev => ({
      ...prev,
      courses: [...prev.courses, course]
    }));
  };

  const deleteCourse = (id: string) => {
    if (window.confirm("Ma hubtaa inaad rabto inaad tirtirto koorsadan?")) {
      setState(prev => ({
        ...prev,
        courses: prev.courses.filter(c => c.id !== id)
      }));
    }
  };

  const showToast = (notif: AppNotification) => {
    setToasts(prev => [...prev, notif]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== notif.id));
    }, 5000);
  };

  const approveStudent = (id: string) => {
    const student = state.students.find(s => s.id === id);
    if (!student) return;

    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.fullName,
      message: `Fariin hambalyo ah ayaa loo diray ${student.fullName} (${student.phone}).`,
      timestamp: new Date().toLocaleTimeString('so-SO'),
      type: 'success'
    };

    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, status: StudentStatus.APPROVED } : s),
      notifications: [newNotif, ...prev.notifications].slice(0, 20)
    }));

    showToast(newNotif);
  };

  const rejectStudent = (id: string) => {
    if (window.confirm("Ma hubtaa inaad rabto inaad diido codsigan?")) {
      setState(prev => ({
        ...prev,
        students: prev.students.map(s => s.id === id ? { ...s, status: StudentStatus.REJECTED } : s)
      }));
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const student = state.students.find(s => 
      s.email.toLowerCase() === loginIdentifier.toLowerCase() || 
      s.phone === loginIdentifier
    );

    if (!student) {
      setLoginError('Waan ka xunnahay, ardaygan laguma hayo nidaamka. Fadlan is-diwaangali.');
    } else if (student.status === StudentStatus.PENDING) {
      setLoginError('Codsigaaga wali waa la sugayaa (Pending). Fadlan sug ilaa lagaa aqbalayo.');
    } else if (student.status === StudentStatus.REJECTED) {
      setLoginError('Waan ka xunnahay, codsigaaga waa la diiday.');
    } else {
      setActiveStudent(student);
      setState(prev => ({ ...prev, view: 'courses' }));
    }
  };

  const setView = (view: AppState['view']) => {
    setState(prev => ({ ...prev, view }));
    setLoginError('');
    setLoginIdentifier('');
  };

  const renderView = () => {
    switch (state.view) {
      case 'landing':
        return <LandingPage onSelectView={setView} />;
      case 'student-login':
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 space-y-8 animate-in zoom-in duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <i className="fas fa-user-lock text-2xl"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-900">Aqoonsiga Ardayga</h2>
                <p className="text-slate-500 text-sm">Gali Email-kaaga ama Telefoonkaaga si aad u gasho koorsooyinka.</p>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email / Telefoon</label>
                  <input
                    required
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-900"
                  />
                </div>
                {loginError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-xs font-bold flex items-start space-x-2">
                    <i className="fas fa-exclamation-circle mt-0.5"></i>
                    <span>{loginError}</span>
                  </div>
                )}
                <button type="submit" className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95">
                  Gali Koorsooyinka
                </button>
              </form>

              <button onClick={() => setView('landing')} className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">
                Ku laabo bogga hore
              </button>
            </div>
          </div>
        );
      case 'courses':
        return activeStudent ? <Courses student={activeStudent} courses={state.courses} onBack={() => setView('landing')} /> : <LandingPage onSelectView={setView} />;
      case 'public-register':
        return (
          <div className="min-h-screen bg-slate-50 pt-10 px-4">
             <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
               <button onClick={() => setView('landing')} className="text-slate-600 hover:text-emerald-600 flex items-center space-x-2 font-semibold transition-colors">
                 <i className="fas fa-arrow-left"></i>
                 <span>Ku Laabo Bogga Hore</span>
               </button>
               <h1 className="text-2xl font-black text-slate-900">HOGAAN</h1>
             </div>
             <StudentForm onAdd={addStudent} isPublic />
          </div>
        );
      case 'public-success':
        return <PublicSuccess onBackHome={() => setView('landing')} />;
      case 'dashboard':
        return <Dashboard students={state.students} notifications={state.notifications} />;
      case 'register':
        return <StudentForm onAdd={addStudent} />;
      case 'pending-list':
        return <PendingList students={state.students} onApprove={approveStudent} onReject={rejectStudent} />;
      case 'list':
        return <StudentList students={state.students} />;
      case 'manage-courses':
        return <CourseManager courses={state.courses} onAddCourse={addCourse} onDeleteCourse={deleteCourse} />;
      case 'ai-insights':
        return <AIInsights students={state.students} />;
      default:
        return <LandingPage onSelectView={setView} />;
    }
  };

  const isAdminView = ['dashboard', 'register', 'list', 'ai-insights', 'pending-list', 'manage-courses'].includes(state.view);

  if (!isAdminView) {
    return (
      <div className="min-h-screen bg-slate-50">
        {renderView()}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed top-6 right-6 z-[9999] flex flex-col space-y-4 max-w-sm w-full">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-l-4 border-emerald-500 flex items-start space-x-4 animate-in slide-in-from-right-full duration-300">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <i className="fas fa-paper-plane text-emerald-400"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Fariin la diray!</p>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">{toast.message}</p>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-500 hover:text-white transition-colors">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        ))}
      </div>

      <Sidebar currentView={state.view} setView={setView} students={state.students} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10 transition-all duration-300">
        <div className="md:hidden flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-emerald-600">HOGAAN</h1>
          <div className="flex space-x-1 overflow-x-auto pb-1">
            <button onClick={() => setView('dashboard')} className={`p-2 rounded-lg shrink-0 ${state.view === 'dashboard' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>
              <i className="fas fa-chart-pie"></i>
            </button>
            <button onClick={() => setView('pending-list')} className={`p-2 rounded-lg shrink-0 relative ${state.view === 'pending-list' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>
              <i className="fas fa-clock"></i>
              {state.students.filter(s => s.status === StudentStatus.PENDING).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button onClick={() => setView('manage-courses')} className={`p-2 rounded-lg shrink-0 ${state.view === 'manage-courses' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>
              <i className="fas fa-layer-group"></i>
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg shrink-0 ${state.view === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>
              <i className="fas fa-users"></i>
            </button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderView()}
        </div>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm pb-10">
          <p>© {new Date().getFullYear()} HOGAAN Student Management System. Dhammaan xuquuqdu waa dhowran tahay.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
