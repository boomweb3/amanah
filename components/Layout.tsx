
import React, { useState } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'ledger' | 'new-entry' | 'settings';
  setActiveTab: (tab: 'ledger' | 'new-entry' | 'settings') => void;
  currentUser: User | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onLogout, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const navItems: { id: 'ledger' | 'new-entry' | 'settings', label: string, icon: string }[] = [
    { id: 'ledger', label: 'My Ledger', icon: 'fa-layer-group' },
    { id: 'new-entry', label: 'Record Entry', icon: 'fa-square-plus' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ];

  const handleTabChange = (tab: 'ledger' | 'new-entry' | 'settings') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const goHome = () => {
    setActiveTab('ledger');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Top Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-50 transition-colors">
        <button 
          onClick={goHome}
          className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400"
        >
          <i className="fa-solid fa-feather-pointed text-xl"></i>
          <span className="text-xl font-black tracking-tight">Amānah</span>
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-all"
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Collapsible Menu */}
      <div className={`md:hidden fixed inset-0 bg-white dark:bg-slate-900 z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="pt-24 px-6 space-y-4">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-4">Navigation</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all text-left ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-lg">{item.label}</span>
            </button>
          ))}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-bold"
            >
              <i className="fa-solid fa-right-from-bracket text-lg"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm flex-col fixed inset-y-0 z-20 transition-colors">
        <div className="p-8">
          <button 
            onClick={goHome}
            className="text-2xl font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <i className="fa-solid fa-feather-pointed"></i>
            Amānah
          </button>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-[0.2em] font-black">The Ethical Ledger</p>
        </div>
        
        <div className="flex-1 px-4 space-y-2 py-4">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-2xl ${currentUser.avatar || 'bg-emerald-100'} flex items-center justify-center text-white font-black shadow-inner`}>
                 {currentUser.name.charAt(0)}
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Online</p>
               </div>
             </div>
             <button 
               onClick={toggleTheme}
               className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:scale-110 transition-transform"
             >
               <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
             </button>
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0 md:ml-64 transition-colors">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
