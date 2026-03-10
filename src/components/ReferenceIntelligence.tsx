import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Library, CheckCircle, XCircle, AlertTriangle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

export default function ReferenceIntelligence({ activePaperId }: { activePaperId: number | null }) {
  const [references, setReferences] = useState<any[]>([]);
  const [inTextCitations, setInTextCitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activePaperId) {
      setIsLoading(true);
      fetch(`/api/references/${activePaperId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setReferences(data.references || []);
          setInTextCitations(data.inTextCitations || []);
        })
        .catch(err => setError('Failed to validate references'))
        .finally(() => setIsLoading(false));
    }
  }, [activePaperId]);

  if (!activePaperId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <AlertCircle size={48} className="text-amber-500" />
        <p>Please upload a manuscript first to validate references.</p>
      </div>
    );
  }

  const verifiedCount = references.filter(r => r.status === 'verified').length;
  const issueCount = references.length - verifiedCount;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Library className="text-indigo-600" /> Reference Intelligence System
        </h2>
        <p className="text-slate-600 mt-1">Automatically verify citations against Crossref and detect missing DOIs or formatting errors.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
          <p>Verifying references with Crossref API...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-200">
          {error}
        </div>
      ) : (
        <div className="flex-1 overflow-auto space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <Library size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Processed</p>
                <p className="text-2xl font-bold text-slate-800">{references.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Verified</p>
                <p className="text-2xl font-bold text-slate-800">{verifiedCount}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Issues Found</p>
                <p className="text-2xl font-bold text-slate-800">{issueCount}</p>
              </div>
            </div>
          </div>

          {/* Reference List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-medium text-slate-800">Validation Results</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {references.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No references found to validate.</div>
              ) : references.map((ref, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      {ref.status === 'verified' ? (
                        <CheckCircle className="text-emerald-500" size={20} />
                      ) : ref.status === 'not_found' ? (
                        <AlertTriangle className="text-amber-500" size={20} />
                      ) : (
                        <XCircle className="text-rose-500" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm mb-2">{ref.original}</p>
                      
                      {ref.status === 'verified' && (
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-slate-500 text-xs uppercase font-semibold">Matched Title</span>
                              <p className="text-slate-700 font-medium truncate">{ref.title}</p>
                            </div>
                            <div>
                              <span className="text-slate-500 text-xs uppercase font-semibold">DOI</span>
                              <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-mono">
                                {ref.doi} <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {ref.status === 'not_found' && (
                        <p className="text-amber-600 text-sm mt-1">Could not verify this reference in Crossref. Please check for typos or missing information.</p>
                      )}
                      
                      {ref.status === 'error' && (
                        <p className="text-rose-600 text-sm mt-1">An error occurred while verifying this reference.</p>
                      )}
                      
                      {ref.isCited === false && (
                        <div className="mt-2 flex items-center gap-1 text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-md inline-flex">
                          <AlertTriangle size={14} /> Warning: This reference is not cited in the text.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {inTextCitations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-medium text-slate-800">In-Text Citations Found</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">
                  Successfully extracted {inTextCitations.length} in-text citations from the manuscript.
                </p>
                <div className="flex flex-wrap gap-2">
                  {inTextCitations.slice(0, 20).map((cit, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-mono border border-slate-200">
                      {cit.text}
                    </span>
                  ))}
                  {inTextCitations.length > 20 && (
                    <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded text-xs font-mono border border-slate-200 border-dashed">
                      +{inTextCitations.length - 20} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
