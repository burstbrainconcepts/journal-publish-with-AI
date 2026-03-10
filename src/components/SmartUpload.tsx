import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function SmartUpload({ onUploadComplete }: { onUploadComplete: (id: number) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      setMetadata(data.metadata);
      onUploadComplete(data.id);
      
      // Now validate structure
      setIsUploading(false);
      setIsValidating(true);
      
      const valRes = await fetch(`/api/validate/${data.id}`, { method: 'POST' });
      if (valRes.ok) {
        const valData = await valRes.json();
        setValidation(valData.validation);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      setIsValidating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Smart Upload & Analysis</h2>
        <p className="text-slate-600 mt-1">Upload your manuscript (Word, PDF) and our AI will extract metadata and validate structure.</p>
      </div>

      {!metadata ? (
        <div 
          className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all
            ${isUploading ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50 cursor-pointer'}
          `}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">Analyzing Manuscript...</h3>
              <p className="text-slate-500 mt-2 max-w-md">Extracting metadata, identifying sections, and checking structural integrity.</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Click to upload your manuscript</h3>
              <p className="text-slate-500 mb-6">Supports .docx, .pdf (Max 50MB)</p>
              <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all">
                Browse Files
              </button>
              {error && <p className="text-rose-500 mt-4 font-medium">{error}</p>}
            </>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Extracted Metadata */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={20} />
                  Extracted Metadata
                </h3>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Analysis Complete
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 font-medium">
                    {metadata.title || 'Untitled'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Authors</label>
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 text-sm">
                      {metadata.authors?.join(', ') || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Affiliations</label>
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 text-sm">
                      {metadata.affiliations?.join(', ') || 'Unknown'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Abstract</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed">
                    {metadata.abstract || 'No abstract found.'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keywords</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {metadata.keywords?.map((kw: string) => (
                      <span key={kw} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Structural Validation */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Structural Validation</h3>
              
              {isValidating ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm">Validating structure...</p>
                </div>
              ) : validation ? (
                <div className="space-y-3">
                  {validation.map((section: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                        <span className="text-sm font-medium text-slate-700">{section.name}</span>
                        {section.status === 'ok' && <CheckCircle2 className="text-emerald-500" size={18} />}
                        {section.status === 'warning' && <AlertCircle className="text-amber-500" size={18} />}
                        {section.status === 'error' && <AlertCircle className="text-rose-500" size={18} />}
                      </div>
                      {section.msg && (
                        <p className={`text-xs pl-3 ${section.status === 'error' ? 'text-rose-600' : 'text-amber-600'}`}>
                          {section.msg}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Validation failed or not available.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
