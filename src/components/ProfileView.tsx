import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, MapPin, BookOpen, Quote, TrendingUp } from 'lucide-react';

export default function ProfileView({ profile }: { profile: any }) {
  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  const { profile: userProfile, papers } = profile;
  const metrics = userProfile.metrics || { citations: 0, hIndex: 0, i10Index: 0 };
  const publications = userProfile.publications || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
          {userProfile.name?.split(' ').map((n: string) => n[0]).join('') || 'DR'}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-800">{userProfile.name}</h2>
          <p className="text-lg text-slate-600 flex items-center justify-center md:justify-start gap-2 mt-1">
            <MapPin size={18} /> {userProfile.affiliation}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            {['Machine Learning', 'Climate Science', 'Ecology'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 flex gap-3">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Quote size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Citations</p>
            <p className="text-2xl font-bold text-slate-800">{metrics.citations}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">h-index</p>
            <p className="text-2xl font-bold text-slate-800">{metrics.hIndex}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">i10-index</p>
            <p className="text-2xl font-bold text-slate-800">{metrics.i10Index}</p>
          </div>
        </div>
      </div>

      {/* Publications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-2">
          <GraduationCap className="text-indigo-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Published Papers</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {publications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No publications yet.</div>
          ) : publications.map((pub: any, i: number) => (
            <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
              <h4 className="font-medium text-slate-900 text-lg mb-1">{pub.title}</h4>
              <p className="text-sm text-slate-500 mb-3">Published on {new Date(pub.date).toLocaleDateString()}</p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  DOI: {pub.doi}
                </span>
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <Quote size={14} /> 0 Citations
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
