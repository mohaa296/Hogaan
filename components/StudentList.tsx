
import React, { useState } from 'react';
import { Student, RegistrationType, StudentStatus } from '../types';

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Show only APPROVED students in the main list
  const approvedStudents = students.filter(s => s.status === StudentStatus.APPROVED);

  const filteredStudents = approvedStudents.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ardayda La Aqbalay</h2>
          <p className="text-slate-500">Wadarta: {approvedStudents.length} Arday</p>
        </div>
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Raadi arday..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-80 rounded-full border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Magaca</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Nooca / Cadadka</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Wadanka</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Telefoonka</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Jinsiga</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Taariikhda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{student.fullName}</div>
                    <div className="text-xs text-slate-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase w-fit mb-1 ${
                        student.registrationType === RegistrationType.PAID
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
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
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                       <i className="fas fa-globe-africa text-slate-400 text-xs"></i>
                       <span className="text-sm font-medium text-slate-700">{student.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.gender === 'Lab' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {student.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.registrationDate}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <i className="fas fa-users-slash text-4xl mb-2 block"></i>
                    Ma jiraan arday la aqbalay weli.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
