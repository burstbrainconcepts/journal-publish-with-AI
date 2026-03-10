import React from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle, AlertCircle, Clock, ArrowRight, UploadCloud, BookOpen } from 'lucide-react';
import { Tab } from '../App';

export default function DashboardOverview({ onNavigate, profile, setActivePaperId }: { onNavigate: (tab: Tab) => void, profile: any, setActivePaperId: (id: number) => void }) {
  const papers = profile?.papers || [];
  
  const stats = [
    { label: 'Total Papers', value: papers.length.toString(), icon: <FileText className="text-blue-500" size={24} /> },
    { label: 'Published', value: papers.filter((p: any) => p.status === 'published').length.toString(), icon: <CheckCircle className="text-emerald-500" size={24} /> },
    { label: 'In Progress', value: papers.filter((p: any) => p.status !== 'published').length.toString(), icon: <AlertCircle className="text-amber-500" size={24} /> },
    { label: 'Citations', value: profile?.profile?.metrics?.citations?.toString() || '0', icon: <Clock className="text-indigo-500" size={24} /> },
  ];

  const handlePaperClick = (id: number) => {
    setActivePaperId(id);
    onNavigate('formatting');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, {profile?.profile?.name || 'Researcher'}</h2>
          <p className="text-slate-600 max-w-2xl">
            You have {papers.filter((p: any) => p.status !== 'published').length} papers in progress. Upload a new manuscript to start the AI-assisted publishing pipeline.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('upload')}
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <UploadCloud size={20} />
          New Manuscript
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Papers */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Recent Manuscripts</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {papers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No manuscripts uploaded yet.</div>
          ) : papers.map((paper: any) => (
            <div key={paper.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-medium text-slate-900">{paper.title}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                    ${paper.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      'bg-blue-50 text-blue-700 border-blue-200'}
                  `}>
                    {paper.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Clock size={14} /> Created {new Date(paper.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <button 
                onClick={() => handlePaperClick(paper.id)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Continue editing"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
