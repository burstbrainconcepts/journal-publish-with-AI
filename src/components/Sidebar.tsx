import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  PenTool, 
  BookMarked, 
  X,
  GraduationCap,
  Library,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Tab } from '../App';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  profile?: any;
}

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, profile }: SidebarProps) {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'upload', label: 'Smart Upload', icon: <UploadCloud size={20} /> },
    { id: 'formatting', label: 'Formatting & Validation', icon: <FileText size={20} /> },
    { id: 'writing', label: 'Writing Assistant', icon: <PenTool size={20} /> },
    { id: 'references', label: 'Reference Intelligence', icon: <Library size={20} /> },
    { id: 'integrity', label: 'Integrity Checks', icon: <ShieldCheck size={20} /> },
    { id: 'journals', label: 'Journal Matching', icon: <BookMarked size={20} /> },
    { id: 'reviews', label: 'Peer Review Simulation', icon: <MessageSquare size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-slate-300 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <GraduationCap className="text-indigo-400" size={24} />
            <span>ScholarSync AI</span>
          </div>
          <button 
            className="lg:hidden p-1 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Research Pipeline
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => setActiveTab('profile')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold">
              {profile?.profile?.name?.split(' ').map((n: string) => n[0]).join('') || 'DR'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.profile?.name || 'Loading...'}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.profile?.affiliation || 'Loading...'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
