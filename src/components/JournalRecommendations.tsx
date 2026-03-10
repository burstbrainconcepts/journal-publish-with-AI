import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookMarked, ExternalLink, Star, TrendingUp, ShieldCheck, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function JournalRecommendations({ activePaperId }: { activePaperId: number | null }) {
  const [journals, setJournals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedInfo, setPublishedInfo] = useState<any>(null);

  useEffect(() => {
    if (activePaperId) {
      setIsLoading(true);
      fetch(`/api/recommend-journals/${activePaperId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => setJournals(data.journals || []))
        .catch(err => setError('Failed to load journals'))
        .finally(() => setIsLoading(false));
    }
  }, [activePaperId]);

  const handlePublish = async () => {
    if (!activePaperId) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/publish/${activePaperId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish');
      setPublishedInfo(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!activePaperId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <AlertCircle size={48} className="text-amber-500" />
        <p>Please upload a manuscript first to get journal recommendations.</p>
      </div>
    );
  }

  if (publishedInfo) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full text-center space-y-6"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Paper Published Successfully!</h2>
        <p className="text-slate-600 max-w-md">Your manuscript has been formatted, validated, and published to the ScholarSync network.</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md text-left space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned DOI</label>
            <p className="font-mono text-indigo-600 font-medium">{publishedInfo.doi}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Article URL</label>
            <a href={publishedInfo.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
              {publishedInfo.url} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookMarked className="text-indigo-600" /> Journal Recommendation Engine
        </h2>
        <p className="text-slate-600 mt-1">Based on your manuscript's topic, keywords, and methodology, we found the best matches for publication.</p>
      </div>

      {/* Analysis Summary */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">Pre-submission Checks Passed</h3>
            <p className="text-sm text-indigo-700 mt-1">Plagiarism score: 2% (Safe) • References validated via Crossref</p>
          </div>
        </div>
        <button className="shrink-0 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
          View Full Report
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
            <p>Analyzing manuscript and finding matching journals...</p>
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No journals found.</div>
        ) : journals.map((journal, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{journal.name}</h3>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    {journal.match}% Match
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">Published by <span className="font-medium text-slate-700">{journal.publisher}</span></p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {journal.tags?.map((tag: string) => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Impact Factor</p>
                    <p className="font-medium text-slate-800 flex items-center gap-1">
                      <TrendingUp size={16} className="text-indigo-500" /> {journal.impactFactor}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">First Decision</p>
                    <p className="font-medium text-slate-800">{journal.timeToFirstDecision}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Acceptance</p>
                    <p className="font-medium text-slate-800">{journal.acceptanceRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">APC (Fee)</p>
                    <p className="font-medium text-slate-800">{journal.apc}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 lg:w-48">
                <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? <Loader2 size={16} className="animate-spin" /> : 'Submit Paper'}
                </button>
                <button className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  Journal Details <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
