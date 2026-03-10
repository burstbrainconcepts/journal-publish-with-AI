import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wand2, Check, X, ArrowRightLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function WritingAssistant({ activePaperId }: { activePaperId: number | null }) {
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [textChunk, setTextChunk] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activePaperId) {
      setIsLoading(true);
      fetch(`/api/enhance/${activePaperId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.suggestions || []);
          setTextChunk(data.textChunk || '');
          if (data.suggestions?.length > 0) setActiveSuggestion(0);
        })
        .catch(err => setError('Failed to load suggestions'))
        .finally(() => setIsLoading(false));
    }
  }, [activePaperId]);

  if (!activePaperId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <AlertCircle size={48} className="text-amber-500" />
        <p>Please upload a manuscript first to use the Writing Assistant.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Wand2 className="text-indigo-600" /> AI Academic Writing Enhancement
        </h2>
        <p className="text-slate-600 mt-1">Elevate your manuscript's clarity, tone, and structure to meet top-tier journal standards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Document View */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-medium text-slate-800">Manuscript Editor</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles size={16} className="text-amber-500" />
              <span>{suggestions.length} Suggestions found</span>
            </div>
          </div>
          <div className="p-8 overflow-y-auto font-serif text-lg leading-relaxed text-slate-700 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
                <p>Analyzing manuscript text...</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                {textChunk}
              </div>
            )}
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <div className="bg-slate-900 rounded-2xl shadow-xl flex flex-col overflow-hidden text-slate-300">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" />
              AI Suggestions
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                No suggestions found or analysis failed.
              </div>
            ) : suggestions.map((sug, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveSuggestion(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all
                  ${activeSuggestion === idx 
                    ? 'bg-slate-800 border-indigo-500 shadow-lg' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}
                `}
              >
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                  {sug.type}
                </div>
                
                <div className="space-y-3">
                  <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-lg text-sm text-rose-200/80 line-through decoration-rose-500/50">
                    {sug.original}
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRightLeft size={16} className="text-slate-600 rotate-90" />
                  </div>
                  
                  <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-lg text-sm text-emerald-100">
                    {sug.improved}
                  </div>
                </div>

                {activeSuggestion === idx && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-slate-700"
                  >
                    <p className="text-xs text-slate-400 mb-4">{sug.explanation}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                        <Check size={16} /> Accept
                      </button>
                      <button className="px-3 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
