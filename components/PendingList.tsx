
import React, { useState } from 'react';
import { Student, StudentStatus, RegistrationType } from '../types';

interface PendingListProps {
  students: Student[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingList: React.FC<PendingListProps> = ({ students, onApprove, onReject }) => {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const pendingStudents = students.filter(s => s.status === StudentStatus.PENDING);

  const handleApprove = (id: string) => {
    setApprovingId(id);
    // Simulate "Sending message to student" delay
    setTimeout(() => {
      onApprove(id);
      setApprovingId(null);
      setSelectedStudent(null);
    }, 1800);
  };

  const handleReject = (id: string) => {
    onReject(id);
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Codsiyada Cusub (Pending)</h2>
          <p className="text-slate-500">Wadarta: {pendingStudents.length} arday oo sugaya in la hubiyo</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ardayga</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Nooca / Cadadka</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Telefoonka</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Tallaabo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingStudents.length > 0 ? pendingStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => setSelectedStudent(student)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <i className="fas fa-user text-sm"></i>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{student.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase">{student.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase w-fit mb-1 ${
                        student.registrationType === RegistrationType.PAID
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {student.registrationType}
                      </span>
                      {student.amount && (
                        <span className="text-sm font-bold text-slate-700">
                          {student.currency === 'USD' ? '$' : ''}{student.amount}{student.currency === 'ETB' ? ' ETB' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{student.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                        className="bg-slate-900 text-white text-[10px] font-black uppercase py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                      >
                        Fiiri Foomka
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-inbox text-2xl opacity-20"></i>
                    </div>
                    <p className="font-bold text-slate-300">Ma jiraan codsiyo cusub hadda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal (Foomka Aqbalka/Diidmada) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !approvingId && setSelectedStudent(null)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/20">
                    {selectedStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{selectedStudent.registrationType} Application</p>
                  </div>
                </div>
                {!approvingId && (
                  <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white transition-colors">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email-ka</p>
                  <p className="text-slate-800 font-medium">{selectedStudent.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefoonka</p>
                  <p className="text-slate-800 font-medium">{selectedStudent.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wadanka</p>
                  <p className="text-slate-800 font-medium">{selectedStudent.country}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jinsiga</p>
                  <p className="text-slate-800 font-medium">{selectedStudent.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taariikhda Dhalashada</p>
                  <p className="text-slate-800 font-medium">{selectedStudent.birthDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cadadka Lacagta</p>
                  <p className="text-emerald-600 font-bold">
                    {selectedStudent.amount ? `${selectedStudent.currency === 'USD' ? '$' : ''}${selectedStudent.amount}${selectedStudent.currency === 'ETB' ? ' ETB' : ''}` : 'FREE'}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoyga (Address)</p>
                  <p className="text-slate-800 font-medium">{selectedStudent.address}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
                <button
                  disabled={!!approvingId}
                  onClick={() => handleApprove(selectedStudent.id)}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all flex items-center justify-center shadow-lg active:scale-95 ${
                    approvingId === selectedStudent.id 
                      ? 'bg-slate-100 text-slate-400' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                  }`}
                >
                  {approvingId === selectedStudent.id ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-3"></i>
                      Loo Dirayaa Fariinta...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-3"></i>
                      Aqbal Codsiga
                    </>
                  )}
                </button>
                <button
                  disabled={!!approvingId}
                  onClick={() => handleReject(selectedStudent.id)}
                  className="px-8 py-4 rounded-2xl bg-red-50 text-red-600 font-black uppercase text-sm tracking-widest hover:bg-red-100 transition-all active:scale-95"
                >
                  <i className="fas fa-times-circle mr-3"></i>
                  Diid Codsiga
                </button>
              </div>
              
              {approvingId === selectedStudent.id && (
                <p className="text-center mt-4 text-xs font-bold text-emerald-600 animate-pulse">
                  Fariin hambalyo ah ayaa hadda loo dirayaa {selectedStudent.phone}...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingList;
