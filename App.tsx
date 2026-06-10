
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
import LanguageManager from './components/LanguageManager';
import StudentChat from './components/StudentChat';
import { useLanguage } from './LanguageContext';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const { language, t } = useLanguage();
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
    
    let initialStudents = savedStudents ? JSON.parse(savedStudents) : [];
    let initialNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    let initialCourses = savedCourses ? JSON.parse(savedCourses) : [];

    setState(prev => ({ 
      ...prev, 
      students: initialStudents,
      notifications: initialNotifs,
      courses: initialCourses
    }));

    // Fetch global shared courses from server
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setState(prev => ({ ...prev, courses: data }));
          localStorage.setItem('hogaan_courses', JSON.stringify(data));
        }
      })
      .catch(err => console.error("Error loading courses:", err));

    // Fetch global shared students from server
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setState(prev => ({ ...prev, students: data }));
          localStorage.setItem('hogaan_students', JSON.stringify(data));
        }
      })
      .catch(err => console.error("Error loading students:", err));

    // Fetch global notifications from server
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setState(prev => ({ ...prev, notifications: data }));
          localStorage.setItem('hogaan_notifications', JSON.stringify(data));
        }
      })
      .catch(err => console.error("Error loading notifications:", err));
  }, []);

  // Real-time server updates subscriber (Server-Sent Events)
  useEffect(() => {
    const eventSource = new EventSource("/api/updates/stream");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log("Real-time update received:", payload);

        if (payload.type === "course_added") {
          const newCourse: Course = payload.data;
          setState(prev => {
            if (prev.courses.some(c => c.id === newCourse.id)) return prev;
            return { ...prev, courses: [...prev.courses, newCourse] };
          });

          // Trigger a beautiful automatic system notification
          const newNotif: AppNotification = {
            id: Math.random().toString(36).substr(2, 9),
            studentId: "system",
            studentName: "SYSTEM",
            message: `KOOS CUSUB: Waxaa la soo kordhiyay koorsada cusub ee "${newCourse.title}"!`,
            timestamp: new Date().toLocaleTimeString("so-SO"),
            type: "info"
          };
          showToast(newNotif);
        }

        if (payload.type === "course_deleted") {
          const { id } = payload.data;
          setState(prev => ({
            ...prev,
            courses: prev.courses.filter(c => c.id !== id)
          }));
        }

        if (payload.type === "student_registered") {
          const newStudent: Student = payload.data;
          setState(prev => {
            if (prev.students.some(s => s.id === newStudent.id)) return prev;
            return { ...prev, students: [...prev.students, newStudent] };
          });

          const newNotif: AppNotification = {
            id: Math.random().toString(36).substr(2, 9),
            studentId: newStudent.id,
            studentName: newStudent.fullName,
            message: `ARDA CUSUB: ${newStudent.fullName} ayaa iska qoray koorsada "${newStudent.email}"!`,
            timestamp: new Date().toLocaleTimeString("so-SO"),
            type: "info"
          };
          showToast(newNotif);
        }

        if (payload.type === "student_approved") {
          const { student, notification } = payload.data;
          setState(prev => {
            const updated = prev.students.map(s => s.id === student.id ? { ...s, status: student.status } : s);
            return {
              ...prev,
              students: updated,
              notifications: notification ? [notification, ...prev.notifications].slice(0, 20) : prev.notifications
            };
          });

          if (notification) {
            showToast(notification);
          }
        }

        if (payload.type === "student_rejected") {
          const { student } = payload.data;
          setState(prev => {
            const updated = prev.students.map(s => s.id === student.id ? { ...s, status: student.status } : s);
            return { ...prev, students: updated };
          });
        }
      } catch (err) {
        console.error("Error handling real-time push update:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE stream closed or retrying connection...", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (state.students.length > 0) {
      localStorage.setItem('hogaan_students', JSON.stringify(state.students));
    }
    if (state.notifications.length > 0) {
      localStorage.setItem('hogaan_notifications', JSON.stringify(state.notifications));
    }
    if (state.courses.length > 0) {
      localStorage.setItem('hogaan_courses', JSON.stringify(state.courses));
    }
  }, [state.students, state.notifications, state.courses]);

  const addStudent = (newStudent: Student) => {
    const isPublicMode = state.view === 'public-register';
    const studentWithStatus = { ...newStudent, status: StudentStatus.PENDING };
    
    fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentWithStatus)
    })
    .then(res => res.json())
    .then(realStudent => {
      setState(prev => ({
        ...prev,
        students: [...prev.students, realStudent],
        view: isPublicMode ? 'public-success' : 'pending-list'
      }));
    })
    .catch(err => {
      console.error("Error saving student to api:", err);
      setState(prev => ({
        ...prev,
        students: [...prev.students, studentWithStatus],
        view: isPublicMode ? 'public-success' : 'pending-list'
      }));
    });
  };

  const addCourse = (course: Course) => {
    fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course)
    })
    .then(res => res.json())
    .then(newC => {
      setState(prev => ({
        ...prev,
        courses: [...prev.courses, newC]
      }));
    })
    .catch(err => {
      console.error("Error adding course to server:", err);
      setState(prev => ({
        ...prev,
        courses: [...prev.courses, course]
      }));
    });
  };

  const deleteCourse = (id: string) => {
    if (window.confirm(t('confirm_delete_course'))) {
      fetch(`/api/courses/${id}`, { method: "DELETE" })
      .then(() => {
        setState(prev => ({
          ...prev,
          courses: prev.courses.filter(c => c.id !== id)
        }));
      })
      .catch(err => {
        console.error("Error deleting course from server:", err);
        setState(prev => ({
          ...prev,
          courses: prev.courses.filter(c => c.id !== id)
        }));
      });
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

    fetch(`/api/students/${id}/approve`, { method: "POST" })
    .then(res => res.json())
    .then(() => {
      fetch("/api/students")
        .then(r => r.json())
        .then(sData => {
          fetch("/api/notifications")
            .then(rn => rn.json())
            .then(nData => {
              setState(prev => ({
                ...prev,
                students: sData,
                notifications: nData
              }));
              const newNotif: AppNotification = {
                id: Math.random().toString(36).substr(2, 9),
                studentId: student.id,
                studentName: student.fullName,
                message: `Fariin hambalyo ah ayaa loo diray ${student.fullName} (${student.phone}).`,
                timestamp: new Date().toLocaleTimeString('so-SO'),
                type: 'success'
              };
              showToast(newNotif);
            });
        });
    })
    .catch(err => {
      console.error("Error approving student on server:", err);
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
    });
  };

  const rejectStudent = (id: string) => {
    if (window.confirm(t('confirm_reject'))) {
      fetch(`/api/students/${id}/reject`, { method: "POST" })
      .then(() => {
        setState(prev => ({
          ...prev,
          students: prev.students.map(s => s.id === id ? { ...s, status: StudentStatus.REJECTED } : s)
        }));
      })
      .catch(err => {
        console.error("Error rejecting student:", err);
        setState(prev => ({
          ...prev,
          students: prev.students.map(s => s.id === id ? { ...s, status: StudentStatus.REJECTED } : s)
        }));
      });
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
      setLoginError(t('student_not_found'));
    } else if (student.status === StudentStatus.PENDING) {
      setLoginError(t('student_pending'));
    } else if (student.status === StudentStatus.REJECTED) {
      setLoginError(t('student_rejected'));
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
        return <LandingPage onSelectView={setView} courses={state.courses} />;
      case 'student-login':
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 space-y-8 relative animate-in zoom-in duration-300">
              {/* Absolutly Positioned Back Icon */}
              <button 
                onClick={() => setView('landing')} 
                className="absolute top-6 left-6 w-9 h-9 text-slate-400 hover:text-[#B932B8] hover:bg-slate-50 rounded-full flex items-center justify-center transition-all active:scale-90"
                title={t('back_home')}
              >
                <i className="fas fa-arrow-left text-base"></i>
              </button>

              <div className="text-center space-y-2 pt-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-[#B932B8] mx-auto mb-4 animate-bounce">
                  <i className="fas fa-user-lock text-2xl"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{t('student_auth')}</h2>
                <p className="text-slate-500 text-sm">{t('student_auth_desc')}</p>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('email_phone')}</label>
                  <input
                    required
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B932B8] focus:border-transparent outline-none transition-all font-medium text-slate-900"
                  />
                </div>
                {loginError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-xs font-bold flex items-start space-x-2">
                    <i className="fas fa-exclamation-circle mt-0.5"></i>
                    <span>{loginError}</span>
                  </div>
                )}
                <button type="submit" className="w-full py-4 rounded-xl bg-[#B932B8] text-white font-black uppercase tracking-widest text-sm hover:bg-[#a120a0] shadow-lg shadow-purple-600/20 transition-all active:scale-95 duration-150">
                  {t('gali_koorsooyinka')}
                </button>
              </form>

              <button onClick={() => setView('landing')} className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[#B932B8] transition-colors flex items-center justify-center space-x-2 active:scale-95">
                <i className="fas fa-long-arrow-alt-left text-sm"></i>
                <span>{t('back_home')}</span>
              </button>
            </div>
          </div>
        );
      case 'courses':
        return activeStudent ? <Courses student={activeStudent} courses={state.courses} onBack={() => setView('landing')} /> : <LandingPage onSelectView={setView} courses={state.courses} />;
      case 'public-register':
        return (
          <div className="min-h-screen bg-slate-50 pt-10 px-4">
             <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
               <button onClick={() => setView('landing')} className="text-slate-600 hover:text-[#B932B8] flex items-center space-x-2.5 font-bold transition-colors active:scale-95">
                 <i className="fas fa-arrow-left text-sm"></i>
                 <span>{t('go_back')}</span>
               </button>
               <h1 className="text-2xl font-black text-[#B932B8] tracking-wider">HOGAAN</h1>
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
      case 'student-chat':
        return (
          <div className="max-w-5xl mx-auto py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-[#10223d]">{language === 'so' ? 'Qolka Wada-hadalka ee Wadaagga ah' : 'Community Chatroom'}</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">{language === 'so' ? 'Halkan waxaad kula xiriiri kartaa dhamaan ardayda kale iyo maamulka si toos ah.' : 'Engage with students and other staff members in real-time.'}</p>
            </div>
            <StudentChat 
              activeUser={activeStudent ? { id: activeStudent.id, name: activeStudent.fullName, role: 'student' } : { id: 'admin', name: t('admin_user') || 'Main Admin', role: 'admin' }} 
              onBack={() => setView('dashboard')}
            />
          </div>
        );
      case 'languages':
        return <LanguageManager />;
      default:
        return <LandingPage onSelectView={setView} courses={state.courses} />;
    }
  };

  const isAdminView = ['dashboard', 'register', 'list', 'ai-insights', 'pending-list', 'manage-courses', 'languages', 'student-chat'].includes(state.view);

  if (!isAdminView) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar 
          currentView={state.view} 
          onSelectView={(v) => {
            if (v === 'landing') {
              setView('landing');
            } else {
              setView(v as any);
            }
          }} 
          onScrollToSection={(sectionId) => {
            if (state.view !== 'landing') {
              setState(prev => ({ ...prev, view: 'landing' }));
              setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 150);
            } else {
              const element = document.getElementById(sectionId);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        />
        <div className="flex-grow">
          {renderView()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed top-6 right-6 z-[9999] flex flex-col space-y-4 max-w-sm w-full">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-l-4 border-[#B932B8] flex items-start space-x-4 animate-in slide-in-from-right-full duration-300">
            <div className="bg-[#B932B8]/20 p-2 rounded-lg">
              <i className="fas fa-paper-plane text-[#B932B8]"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#B932B8] uppercase tracking-wider">Fariin la diray!</p>
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
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setView('landing')} 
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-[#B932B8] hover:bg-slate-50 transition-colors flex items-center justify-center active:scale-90"
              title={t('back_home')}
            >
              <i className="fas fa-arrow-left text-base"></i>
            </button>
            <h1 className="text-xl font-bold text-[#B932B8]">HOGAAN</h1>
          </div>
          <div className="flex space-x-1 overflow-x-auto pb-1">
            <button onClick={() => setView('dashboard')} className={`p-2 rounded-lg shrink-0 ${state.view === 'dashboard' ? 'bg-purple-100/50 text-[#B932B8]' : 'text-slate-400'}`}>
              <i className="fas fa-chart-pie font-bold"></i>
            </button>
            <button onClick={() => setView('pending-list')} className={`p-2 rounded-lg shrink-0 relative ${state.view === 'pending-list' ? 'bg-purple-100/50 text-[#B932B8]' : 'text-slate-400'}`}>
              <i className="fas fa-clock font-bold"></i>
              {state.students.filter(s => s.status === StudentStatus.PENDING).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button onClick={() => setView('manage-courses')} className={`p-2 rounded-lg shrink-0 ${state.view === 'manage-courses' ? 'bg-purple-100/50 text-[#B932B8]' : 'text-slate-400'}`}>
              <i className="fas fa-layer-group font-bold"></i>
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg shrink-0 ${state.view === 'list' ? 'bg-purple-100/50 text-[#B932B8]' : 'text-slate-400'}`}>
              <i className="fas fa-users font-bold"></i>
            </button>
            <button onClick={() => setView('student-chat')} className={`p-2 rounded-lg shrink-0 ${state.view === 'student-chat' ? 'bg-purple-100/50 text-[#B932B8]' : 'text-slate-400'}`}>
              <i className="fas fa-comments font-bold"></i>
            </button>
            <button onClick={() => setView('languages')} className={`p-2 rounded-lg shrink-0 ${state.view === 'languages' ? 'bg-purple-100/50 text-[#B932B8]' : 'text-slate-400'}`}>
              <i className="fas fa-language font-bold"></i>
            </button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderView()}
        </div>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm pb-10">
          <p>© {new Date().getFullYear()} HOGAAN Student Management System. {t('all_rights_reserved')}</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
