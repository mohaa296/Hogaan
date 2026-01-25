
import React, { useState, useRef } from 'react';
import { Course } from '../types';

interface CourseManagerProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

const ICONS = ['fa-book', 'fa-laptop-code', 'fa-calculator', 'fa-language', 'fa-brain', 'fa-microscope', 'fa-palette', 'fa-music'];
const COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-slate-700'];

const CourseManager: React.FC<CourseManagerProps> = ({ courses, onAddCourse, onDeleteCourse }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    teacher: '',
    description: '',
    level: 'Bilow (Level 1)',
    icon: ICONS[0],
    color: COLORS[0]
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Sawirka wuxuu ka weyn yahay 2MB, fadlan mid ka yar isticmaal.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.teacher) return;

    const newCourse: Course = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      thumbnail: thumbnailPreview || undefined,
      createdAt: new Date().toLocaleDateString('so-SO')
    };

    onAddCourse(newCourse);
    
    // Reset form
    setFormData({
      title: '',
      teacher: '',
      description: '',
      level: 'Bilow (Level 1)',
      icon: ICONS[0],
      color: COLORS[0]
    });
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
          <i className="fas fa-plus-circle text-emerald-500 mr-3"></i>
          Ku Dar Koorso Cusub
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sawirka Koorsada (Thumbnail)</label>
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all overflow-hidden relative"
             >
               {thumbnailPreview ? (
                 <>
                   <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm">Beddel Sawirka</p>
                   </div>
                 </>
               ) : (
                 <>
                   <i className="fas fa-image text-3xl text-slate-300 mb-2"></i>
                   <p className="text-slate-400 text-sm font-medium">Riix si aad u soo geliso sawir</p>
                   <p className="text-slate-300 text-[10px] mt-1">Cabirka lagu taliyay: 1280x720 (Max 2MB)</p>
                 </>
               )}
               <input 
                 type="file" 
                 ref={fileInputRef}
                 onChange={handleImageChange}
                 accept="image/*" 
                 className="hidden" 
               />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Magaca Koorsada</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Tusaale: Xisaabta Ganacsiga"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Macallinka</label>
            <input
              type="text"
              required
              value={formData.teacher}
              onChange={(e) => setFormData({...formData, teacher: e.target.value})}
              placeholder="Tusaale: Dr. Axmed Cali"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Heerka (Level)</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-900"
            >
              <option>Bilow (Level 1)</option>
              <option>Dhexe (Level 2)</option>
              <option>Sare (Advanced)</option>
              <option>Mastery</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Icon-ka & Midabka (Haddii sawir la waayo)</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({...formData, color: c})}
                  className={`w-8 h-8 rounded-full ${c} border-4 transition-all ${formData.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sharaxaadda Koorsada</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Maxaa lagu baranayaa koorsadan..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-900"
            />
          </div>
          <div className="md:col-span-2 pt-4">
            <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
              Keydi Koorsada Hadda
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Koorsooyinka Diyaarka ah ({courses.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.length > 0 ? courses.map(course => (
            <div key={course.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-16 h-12 rounded-lg object-cover" />
                ) : (
                  <div className={`${course.color} w-16 h-12 rounded-lg flex items-center justify-center text-white text-lg`}>
                    <i className={`fas ${course.icon}`}></i>
                  </div>
                )}
                <div className="max-w-[150px] md:max-w-xs">
                  <h4 className="font-bold text-slate-900 truncate">{course.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{course.teacher} • {course.level}</p>
                </div>
              </div>
              <button 
                onClick={() => onDeleteCourse(course.id)}
                className="w-10 h-10 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shrink-0"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )) : (
            <div className="md:col-span-2 py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
               <i className="fas fa-folder-open text-4xl text-slate-200 mb-2"></i>
               <p className="text-slate-400 font-medium">Ma jiraan koorsooyin la galiyay wali.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManager;
