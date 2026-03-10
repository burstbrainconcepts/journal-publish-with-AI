import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertTriangle, XCircle, RefreshCw, MessageSquare } from 'lucide-react';

interface Review {
  id: number;
  reviewer_name: string;
  status: 'accept' | 'minor_revision' | 'major_revision' | 'reject' | 'pending';
  score: number;
  comments: string;
  created_at: string;
}

export default function PeerReviewSimulation({ activePaperId }: { activePaperId: number | null }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activePaperId) {
      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [activePaperId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/papers/${activePaperId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const simulateReview = async () => {
    if (!activePaperId) return;
    setIsSimulating(true);
    setError(null);
    try {
      const res = await fetch(`/api/papers/${activePaperId}/reviews/simulate`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to simulate review');
      const newReview = await res.json();
      setReviews(prev => [...prev, newReview]);
    } catch (err: any) {
      setError(err.message || 'An error occurred during simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accept': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'minor_revision': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'major_revision': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'reject': return <XCircle className="text-rose-500" size={20} />;
      default: return <FileText className="text-slate-400" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (!activePaperId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Paper Selected</h3>
          <p className="text-slate-500">Please upload or select a paper from the dashboard to simulate peer reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Peer Review Simulation</h1>
            <p className="text-slate-500 mt-1">Generate AI-simulated peer reviews to anticipate feedback.</p>
          </div>
          <button
            onClick={simulateReview}
            disabled={isSimulating}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSimulating ? <RefreshCw className="animate-spin" size={18} /> : <MessageSquare size={18} />}
            <span>{isSimulating ? 'Simulating...' : 'Simulate New Review'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start space-x-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Reviews Yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Click the button above to generate a simulated peer review based on your paper's abstract.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {review.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{review.reviewer_name}</h3>
                      <p className="text-sm text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Score</span>
                      <span className="font-bold text-slate-900">{review.score}/10</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      {getStatusIcon(review.status)}
                      <span className="text-sm font-medium text-slate-700">{getStatusText(review.status)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Review Comments</h4>
                  <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                    {review.comments}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
