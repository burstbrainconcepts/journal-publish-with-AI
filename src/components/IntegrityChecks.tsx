import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, Search, FileSearch, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function IntegrityChecks({ activePaperId }: { activePaperId: number | null }) {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activePaperId) {
      setIsLoading(true);
      fetch(`/api/integrity/${activePaperId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => setReport(data.report))
        .catch(err => setError('Failed to run integrity checks'))
        .finally(() => setIsLoading(false));
    }
  }, [activePaperId]);

  if (!activePaperId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <AlertCircle size={48} className="text-amber-500" />
        <p>Please upload a manuscript first to run integrity checks.</p>
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
          <ShieldCheck className="text-indigo-600" /> Research Integrity Checks
        </h2>
        <p className="text-slate-600 mt-1">AI-powered plagiarism detection, citation mismatch analysis, and duplicate publication scanning.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
          <p>Running comprehensive integrity checks...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-200">
          {error}
        </div>
      ) : report ? (
        <div className="flex-1 overflow-auto space-y-6">
          {/* Overall Score */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4
              ${report.plagiarismScore < 15 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {report.plagiarismScore}%
            </div>
            <h3 className="text-xl font-bold text-slate-800">Similarity Score</h3>
            <p className="text-slate-500 mt-2 max-w-md">
              {report.plagiarismScore < 15 
                ? 'Your manuscript has a low similarity score, indicating high originality.' 
                : 'Your manuscript has a moderate similarity score. Please review the flagged sections.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detailed Similarity Report */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search className="text-indigo-600" size={20} />
                <h3 className="font-medium text-slate-800">Detailed Similarity Report</h3>
              </div>
              <div className="p-6">
                {report.detailedReport && report.detailedReport.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Source</th>
                          <th className="px-4 py-3">Similarity</th>
                          <th className="px-4 py-3 rounded-tr-lg">Match Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.detailedReport.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0">
                            <td className="px-4 py-3 font-medium text-slate-800">{item.source}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${item.similarity > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                    style={{ width: `${item.similarity}%` }}
                                  ></div>
                                </div>
                                <span className="text-slate-600 font-medium">{item.similarity}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.type === 'Direct Copy' ? 'bg-rose-100 text-rose-700' : 
                                item.type === 'Paraphrasing' ? 'bg-amber-100 text-amber-700' : 
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {item.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={20} />
                    <span>No significant similarities found in our database or external sources.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Citation Mismatches */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <FileSearch className="text-indigo-600" size={20} />
                <h3 className="font-medium text-slate-800">Citation Mismatches</h3>
              </div>
              <div className="p-6">
                {report.citationMismatches.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={20} />
                    <span>No citation mismatches found.</span>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {report.citationMismatches.map((mismatch: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="font-medium text-slate-800">{mismatch.issue}</p>
                          <p className="text-slate-500 mt-1">{mismatch.details}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Duplicate Publication */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search className="text-indigo-600" size={20} />
                <h3 className="font-medium text-slate-800">Duplicate Publication Scan</h3>
              </div>
              <div className="p-6">
                {report.duplicateFound ? (
                  <div className="flex items-start gap-3 text-sm">
                    <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-rose-700">Potential duplicate publication detected.</p>
                      <p className="text-slate-600 mt-1">{report.duplicateDetails}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={20} />
                    <span>No duplicate publications found across major databases.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
