
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'ledger' | 'new-entry';
  setActiveTab: (tab: 'ledger' | 'new-entry') => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onLogout }) => {
  if (!currentUser) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col z-20">
        <div className="p-8">
          <h1 className="text-2xl font-black text-emerald-800 flex items-center gap-3">
            <i className="fa-solid fa-feather-pointed"></i>
            Amānah
          </h1>
          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">The Ethical Ledger</p>
        </div>
        
        <div className="flex-1 px-4 space-y-2 py-4">
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'ledger' ? 'bg-emerald-50 text-emerald-800 font-bold shadow-sm shadow-emerald-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-layer-group"></i>
            My Ledger
          </button>
          <button 
            onClick={() => setActiveTab('new-entry')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'new-entry' ? 'bg-emerald-50 text-emerald-800 font-bold shadow-sm shadow-emerald-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-square-plus text-lg"></i>
            Record Entry
          </button>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black shadow-inner">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
               <p className="text-[10px] text-slate-400 truncate">Online</p>
             </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
           >
             <i className="fa-solid fa-right-from-bracket"></i>
             Sign Out
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
