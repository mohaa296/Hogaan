
import React, { useState, useEffect } from 'react';
import { getStudentInsights } from '../services/geminiService';
import { Student } from '../types';

interface AIInsightsProps {
  students: Student[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ students }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsights = async () => {
    if (students.length === 0) {
      setInsight("Ma jiraan arday la diwaangaliyay oo aan xog ka soo saarno.");
      return;
    }
    setLoading(true);
    const result = await getStudentInsights(students);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white flex items-center space-x-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <i className="fas fa-brain text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold">HOGAAN Smart Analytics</h2>
            <p className="text-slate-400">Xogtaada oo AI loo adeegsaday</p>
          </div>
        </div>
        
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Gemini ayaa falanqaynaysa xogta ardayda...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {insight || "Riix badanka hoose si aad u cusboonaysiiso falanqaynta."}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <i className="fas fa-sync-alt"></i>
              <span>Cusboonaysii Falanqaynta</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start space-x-3">
          <i className="fas fa-lightbulb text-emerald-600 mt-1"></i>
          <p className="text-sm text-emerald-800">AI waxay kaa caawinaysaa inaad ogaato isbadalka tirada ardayda waqti ka waqti.</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
          <i className="fas fa-chart-line text-blue-600 mt-1"></i>
          <p className="text-sm text-blue-800">Waxaad si fudud ku ogaan kartaa fasalka ugu ardayda badan si aad u qorshayso kuraasta.</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start space-x-3">
          <i className="fas fa-shield-alt text-purple-600 mt-1"></i>
          <p className="text-sm text-purple-800">Dhammaan xogtaadu waa mid amaan ah oo sir ah.</p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
