import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, FileText, Download, Check, AlertCircle } from 'lucide-react';

export default function FormattingEngine({ activePaperId }: { activePaperId: number | null }) {
  const [selectedStyle, setSelectedStyle] = useState('ieee');
  const [isFormatting, setIsFormatting] = useState(false);
  const [formattedHtml, setFormattedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const styles = [
    { id: 'ieee', name: 'IEEE', desc: 'Two-column, numbered citations, specific heading styles.' },
    { id: 'apa', name: 'APA (7th Ed.)', desc: 'Author-date citations, specific title page format.' },
    { id: 'harvard', name: 'Harvard', desc: 'Author-date citations, specific reference list format.' },
    { id: 'vancouver', name: 'Vancouver', desc: 'Numbered citations, specific reference list format.' },
  ];

  const handleFormat = async () => {
    if (!activePaperId) {
      setError('Please upload a paper first.');
      return;
    }
    
    setIsFormatting(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/format/${activePaperId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: selectedStyle })
      });
      
      if (!res.ok) throw new Error('Formatting failed');
      
      const data = await res.json();
      setFormattedHtml(data.formattedHtml);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Intelligent Formatting Engine</h2>
        <p className="text-slate-600 mt-1">Automatically restructure your paper to meet specific journal guidelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Style Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Target Format</h3>
          {styles.map((style) => (
            <div 
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedStyle === style.id 
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-indigo-300'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold ${selectedStyle === style.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {style.name}
                </h4>
                {selectedStyle === style.id && <Check className="text-indigo-600" size={18} />}
              </div>
              <p className="text-sm text-slate-500">{style.desc}</p>
            </div>
          ))}

          <div className="pt-4">
            <button 
              onClick={handleFormat}
              disabled={isFormatting || !activePaperId}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormatting ? (
                <>Applying Format...</>
              ) : formattedHtml ? (
                <>Re-apply Format</>
              ) : (
                <>Apply {styles.find(s => s.id === selectedStyle)?.name} Format</>
              )}
            </button>
            {!activePaperId && (
              <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> Upload a paper first
              </p>
            )}
            {error && <p className="text-rose-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 bg-slate-200 rounded-2xl p-4 lg:p-8 flex items-center justify-center min-h-[600px] border border-slate-300 relative overflow-hidden">
          <motion.div 
            className="bg-white w-full max-w-[800px] min-h-[800px] shadow-xl rounded-sm p-8 relative overflow-hidden"
            animate={isFormatting ? { scale: 0.95, opacity: 0.8 } : { scale: 1, opacity: 1 }}
          >
            {isFormatting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Settings className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="font-medium text-slate-800">Restructuring document...</p>
              </div>
            )}

            {formattedHtml ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formattedHtml.replace(/```html|```/g, '') }} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-4">
                <FileText size={48} className="opacity-50" />
                <p>Select a format and apply to see preview</p>
              </div>
            )}
          </motion.div>

          {formattedHtml && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-8"
            >
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/20 font-medium flex items-center gap-2 transition-colors">
                <Download size={20} />
                Download PDF
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
