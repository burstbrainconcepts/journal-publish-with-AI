import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import SmartUpload from './components/SmartUpload';
import FormattingEngine from './components/FormattingEngine';
import WritingAssistant from './components/WritingAssistant';
import JournalRecommendations from './components/JournalRecommendations';
import ProfileView from './components/ProfileView';
import ReferenceIntelligence from './components/ReferenceIntelligence';
import IntegrityChecks from './components/IntegrityChecks';
import PeerReviewSimulation from './components/PeerReviewSimulation';
import { Menu } from 'lucide-react';

export type Tab = 'dashboard' | 'upload' | 'formatting' | 'writing' | 'references' | 'integrity' | 'journals' | 'reviews' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePaperId, setActivePaperId] = useState<number | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to load profile', err));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview onNavigate={setActiveTab} profile={profile} setActivePaperId={setActivePaperId} />;
      case 'upload': return <SmartUpload onUploadComplete={(id) => setActivePaperId(id)} />;
      case 'formatting': return <FormattingEngine activePaperId={activePaperId} />;
      case 'writing': return <WritingAssistant activePaperId={activePaperId} />;
      case 'references': return <ReferenceIntelligence activePaperId={activePaperId} />;
      case 'integrity': return <IntegrityChecks activePaperId={activePaperId} />;
      case 'journals': return <JournalRecommendations activePaperId={activePaperId} />;
      case 'reviews': return <PeerReviewSimulation activePaperId={activePaperId} />;
      case 'profile': return <ProfileView profile={profile} />;
      default: return <DashboardOverview onNavigate={setActiveTab} profile={profile} setActivePaperId={setActivePaperId} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        profile={profile}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
            {activePaperId && activeTab !== 'dashboard' && activeTab !== 'profile' && (
              <span className="ml-4 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                Active Paper ID: {activePaperId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('profile')} className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium shadow-sm hover:bg-indigo-700 transition-colors">
              {profile?.profile?.name?.split(' ').map((n: string) => n[0]).join('') || 'DR'}
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
