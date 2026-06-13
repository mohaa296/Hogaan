
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
import StudentLogin from './components/StudentLogin';

const App: React.FC = () => {
  const { language, t } = useLanguage();
  const [state, setState] = useState<AppState>({
    students: [],
    courses: [],
    notifications: [],
    view: 'landing'
  });

  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [updateNotification, setUpdateNotification] = useState<{ version: string; msg: string; updatedAt?: string } | null>(null);
  const [initialVersionInfo, setInitialVersionInfo] = useState<{ version: string; sessionStart: string } | null>(null);
  const [showLaunchAlert, setShowLaunchAlert] = useState<boolean>(false);
  const [launchAlertData, setLaunchAlertData] = useState<{ version: string; msg: string; updatedAt?: string } | null>(null);

  const [activeStudent, setActiveStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('hogaan_active_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [lastRegisteredStudent, setLastRegisteredStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (activeStudent) {
      localStorage.setItem('hogaan_active_student', JSON.stringify(activeStudent));
    } else {
      localStorage.removeItem('hogaan_active_student');
    }
  }, [activeStudent]);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Fetch initial version info to detect changes during the session
    fetch("/api/version")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setInitialVersionInfo({
            version: data.version,
            sessionStart: data.sessionStart
          });

          // Show the update alert when opening the website
          const lastSeenVer = sessionStorage.getItem("hogaan_last_seen_ver");
          if (lastSeenVer !== data.version) {
            setLaunchAlertData({
              version: data.version,
              msg: data.msg || "Beautiful new optimized updates are ready on HOGAAN system."
            });
            setShowLaunchAlert(true);
          }
        }
      })
      .catch(err => console.error("Error loading version on mount:", err));

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

        if (payload.type === "site_updated") {
          const updateData = payload.data;
          setUpdateNotification({
            version: updateData.version,
            msg: updateData.msg || "Cusbooneysiin cusub ayaa diyaar ah! / New update is available now.",
            updatedAt: updateData.updatedAt
          });
        }

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

  // Periodically check for website modifications / server restarts
  useEffect(() => {
    if (!initialVersionInfo) return;

    const pollInterval = setInterval(() => {
      fetch("/api/version")
        .then(res => res.json())
        .then(data => {
          if (data) {
            // Check if server started a new session (rebuild/restart) or version was manually bumped
            if (data.version !== initialVersionInfo.version || data.sessionStart !== initialVersionInfo.sessionStart) {
              setUpdateNotification({
                version: data.version,
                msg: data.msg || "Cusbooneysiin cusub ayaa diyaar ah! / New update is available now.",
                updatedAt: data.updatedAt
              });
            }
          }
        })
        .catch(err => console.debug("Quiet checking for updates:", err));
    }, 15000); // Check every 15 seconds

    return () => clearInterval(pollInterval);
  }, [initialVersionInfo]);

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
    const initialStatus = isPublicMode ? StudentStatus.APPROVED : StudentStatus.PENDING;
    const studentWithStatus = { ...newStudent, status: initialStatus };
    
    fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentWithStatus)
    })
    .then(res => res.json())
    .then(realStudent => {
      if (isPublicMode) {
        setLastRegisteredStudent(realStudent);
        localStorage.setItem('hogaan_last_registered_email', realStudent.email);
        if (realStudent.phone) {
          localStorage.setItem('hogaan_last_registered_phone', realStudent.phone);
        }
      }
      setState(prev => ({
        ...prev,
        students: [...prev.students, realStudent],
        view: isPublicMode ? 'public-success' : 'pending-list'
      }));
    })
    .catch(err => {
      console.error("Error saving student to api:", err);
      if (isPublicMode) {
        setLastRegisteredStudent(studentWithStatus);
        localStorage.setItem('hogaan_last_registered_email', studentWithStatus.email);
        if (studentWithStatus.phone) {
          localStorage.setItem('hogaan_last_registered_phone', studentWithStatus.phone);
        }
      }
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
          <StudentLogin
            students={state.students}
            onLoginSuccess={(student) => {
              setActiveStudent(student);
              setState(prev => ({ ...prev, view: 'courses' }));
            }}
            onAdminLoginSuccess={() => {
              setState(prev => ({ ...prev, view: 'dashboard' }));
            }}
            onCancel={() => setView('landing')}
          />
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
        return (
          <PublicSuccess 
            student={lastRegisteredStudent}
            onBackHome={() => setView('landing')} 
            onAutoLogin={(student) => {
              setActiveStudent(student);
              setState(prev => ({ ...prev, view: 'courses' }));
            }}
          />
        );
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
      case 'public-chat':
        return (
          <div className="max-w-5xl mx-auto py-10 px-4 animate-in fade-in duration-300">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-black text-[#10223d]">{language === 'so' ? 'Qolka Wada-hadalka HOGAAN' : 'HOGAAN Public Chatroom'}</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">{language === 'so' ? 'Wada-hadalka rasmiga ah ee dugsiga HOGAAN - wuxuu u furan yahay ardayda diwaangashan' : 'Official chatroom of HOGAAN online system - open for registered students'}</p>
            </div>
            <StudentChat 
              activeUser={activeStudent ? { id: activeStudent.id, name: activeStudent.fullName, role: 'student' } : null} 
              onBack={() => setView('landing')}
              onRegisterRedirect={() => setView('public-register')}
            />
          </div>
        );
      case 'languages':
        return <LanguageManager />;
      default:
        return <LandingPage onSelectView={setView} courses={state.courses} />;
    }
  };

  const renderLaunchAlertModal = () => {
    if (!showLaunchAlert || !launchAlertData) return null;
    return (
      <div className="fixed inset-0 z-[200005] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden p-6 md:p-8 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-305">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B932B8] to-[#912090] text-white flex items-center justify-center shadow-lg shadow-[#B932B8]/30 animate-pulse">
            <i className="fas fa-rocket text-2xl"></i>
          </div>
          
          <div className="space-y-2">
            <span className="bg-[#B932B8]/10 text-[#B932B8] text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              System Update • {launchAlertData.version}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight pt-2">
              {language === 'so' ? 'CUSBOONEYSIIN CUSUB' : 'LATEST UPDATE IS AVAILABLE'}
            </h3>
            <p className="text-sm font-bold text-slate-500 leading-relaxed px-2">
              {language === 'so' 
                ? 'Cusbooneysiin cusub oo lagu sameeyay website-ka ayaa diyaar ah hadda! Fadlan guji badanka hoose si aad u hesho adeegyada ugu dambeeyay.' 
                : 'A brand new up-to-date version of the application is published now! Click the button below to update.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left w-full">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
              {language === 'so' ? 'Fariinta Isbedelada' : 'Release Notes'}
            </p>
            <p className="text-xs font-bold text-slate-650 leading-relaxed italic">
              "{launchAlertData.msg}"
            </p>
          </div>

          <div className="w-full flex flex-col space-y-3 pt-2">
            <button 
              onClick={() => {
                sessionStorage.setItem("hogaan_last_seen_ver", launchAlertData.version);
                window.location.reload();
              }}
              className="w-full py-4 bg-[#B932B8] hover:bg-[#a1209f] text-white text-xs font-black tracking-widest uppercase rounded-2xl shadow-lg shadow-[#B932B8]/20 transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
            >
              <i className="fas fa-sync-alt animate-spin"></i>
              <span>{language === 'so' ? 'CUSBOONEYSII HADDA (UPDATE NOW)' : 'UPDATE NOW'}</span>
            </button>
            
            <button 
              onClick={() => {
                sessionStorage.setItem("hogaan_last_seen_ver", launchAlertData.version);
                setShowLaunchAlert(false);
              }}
              className="w-full py-2.5 bg-transparent text-slate-400 hover:text-slate-650 text-xs font-black tracking-widest uppercase transition-all rounded-xl active:scale-98 cursor-pointer"
            >
              {language === 'so' ? 'XIR (DISMISS)' : 'DISMISS'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const isAdminView = ['dashboard', 'register', 'list', 'ai-insights', 'pending-list', 'manage-courses', 'languages', 'student-chat'].includes(state.view);

  if (!isAdminView) {
    return (
      <>
        {renderLaunchAlertModal()}
        {updateNotification && (
          <div className="fixed top-0 left-0 right-0 z-[100000] p-4 bg-slate-900 border-b border-[#B932B8]/40 shadow-2xl animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B932B8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B932B8]"></span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#B932B8]/20 flex items-center justify-center shrink-0 text-[#B932B8]">
                  <i className="fas fa-redo animate-spin text-base"></i>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#B932B8] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      NEW UPDATE AVAILABLE {updateNotification.version}
                    </span>
                    <p className="text-xs font-bold text-slate-300">
                      Cusbooneysiin cusub ayaa ku dhacday website-ka!
                    </p>
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    "{updateNotification.msg}"
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
                <button 
                  onClick={() => setUpdateNotification(null)} 
                  className="flex-1 md:flex-initial px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  Xir (Dismiss)
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="flex-1 md:flex-initial px-6 py-2.5 bg-[#B932B8] hover:bg-[#a1209f] text-white font-black text-xs rounded-xl transition-all shadow-lg cursor-pointer animate-pulse flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>CUSBOONEYSII (REFRESH)</span>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="min-h-screen bg-slate-50 flex flex-col relative">
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
            activeStudent={activeStudent}
            onLogout={() => {
              setActiveStudent(null);
              setView('landing');
            }}
          />
          <div className="flex-grow">
            {renderView()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {renderLaunchAlertModal()}
      {updateNotification && (
        <div className="fixed top-0 left-0 right-0 z-[100000] p-4 bg-slate-900 border-b border-[#B932B8]/40 shadow-2xl animate-in slide-in-from-top duration-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B932B8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B932B8]"></span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#B932B8]/20 flex items-center justify-center shrink-0 text-[#B932B8]">
                <i className="fas fa-redo animate-spin text-base"></i>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#B932B8] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    NEW UPDATE AVAILABLE {updateNotification.version}
                  </span>
                  <p className="text-xs font-bold text-slate-300">
                    Cusbooneysiin cusub ayaa ku dhacday website-ka!
                  </p>
                </div>
                <p className="text-sm font-bold text-white mt-1">
                  "{updateNotification.msg}"
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => setUpdateNotification(null)} 
                className="flex-1 md:flex-initial px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Xir (Dismiss)
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="flex-1 md:flex-initial px-6 py-2.5 bg-[#B932B8] hover:bg-[#a1209f] text-white font-black text-xs rounded-xl transition-all shadow-lg cursor-pointer animate-pulse flex items-center justify-center space-x-2"
              >
                <i className="fas fa-sync-alt"></i>
                <span>CUSBOONEYSII (REFRESH)</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
                className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-[#B932B8] hover:bg-slate-50 transition-colors flex items-center justify-center active:scale-95"
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
    </>
  );
};

export default App;
