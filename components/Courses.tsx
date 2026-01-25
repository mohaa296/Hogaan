
import React from 'react';
import { Student, Course } from '../types';

interface CoursesProps {
  student: Student;
  courses: Course[];
  onBack: () => void;
}

const Courses: React.FC<CoursesProps> = ({ student, courses, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Koorsooyinkaaga</h1>
              <p className="text-slate-500 font-medium">Ku soo dhawaaw, <span className="text-emerald-600 font-bold">{student.fullName}</span></p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <i className="fas fa-certificate"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status-ka</p>
              <p className="text-sm font-bold text-emerald-600">Arday firfircoon</p>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? courses.map((course) => (
            <div key={course.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col">
              {/* Thumbnail Section */}
              <div className="h-48 relative overflow-hidden bg-slate-200">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`${course.color} w-full h-full flex items-center justify-center`}>
                    <i className={`fas ${course.icon} text-6xl text-white/30`}></i>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {course.level}
                  </span>
                </div>
                {!course.thumbnail && (
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-2xl shadow-lg">
                    <i className={`fas ${course.icon} text-xl text-slate-900`}></i>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{course.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                       <i className="fas fa-user-tie text-[10px] text-slate-400"></i>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{course.teacher}</p>
                  </div>
                </div>

                {course.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Horumarka</span>
                    <span className="text-emerald-600">0%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `0%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center space-x-2">
                  <span>Biloow Barashada</span>
                  <i className="fas fa-play text-[10px]"></i>
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-book-open text-3xl text-slate-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Ma jiraan koorsooyin hadda diyaarka ah.</h3>
              <p className="text-slate-500 mt-2">Maamuluhu wali ma uusan soo gelin casharo cusub.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
