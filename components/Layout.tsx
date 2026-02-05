
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { AppTab } from '../App';
import GeneratedAvatar from './GeneratedAvatar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onLogout, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change or when clicking outside
  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  if (!currentUser) return <>{children}</>;

  const navItems: { id: AppTab, label: string, icon: string }[] = [
    { id: 'ledger', label: 'My Ledger', icon: 'fa-layer-group' },
    { id: 'new-entry', label: 'Record Entry', icon: 'fa-square-plus' },
    { id: 'history', label: 'Amānah History', icon: 'fa-clock-rotate-left' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-all duration-300">
      
      {/* MOBILE TOP HEADER (Brand Only) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40">
        <button onClick={() => handleTabChange('ledger')} className="text-xl font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          <i className="fa-solid fa-feather-pointed"></i>
          <span className="tracking-tighter">Amānah</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="text-slate-400 dark:text-slate-500 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50">
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
          <GeneratedAvatar seed={currentUser.id} size="sm" className="rounded-xl" />
        </div>
      </header>

      {/* DESKTOP SIDEBAR (Unchanged) */}
      <nav className="hidden md:flex w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm flex-col fixed inset-y-0 z-20">
        <div className="p-8">
          <button onClick={() => setActiveTab('ledger')} className="text-2xl font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-3">
            <i className="fa-solid fa-feather-pointed"></i>
            <span className="hidden lg:block tracking-tighter">Amānah</span>
          </button>
        </div>
        <div className="flex-1 px-4 space-y-2 py-4">
          {navItems.map(item => (
            <button 
              key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 px-0 lg:px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 font-black shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon} text-lg lg:text-base`}></i>
              <span className="hidden lg:block text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex flex-col lg:flex-row items-center justify-between mb-4 gap-4">
             <GeneratedAvatar seed={currentUser.id} size="sm" className="rounded-xl shadow-sm" />
             <button onClick={toggleTheme} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:scale-110 transition-transform">
               <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
             </button>
           </div>
           <button onClick={onLogout} className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">Sign Out</button>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 pb-2 z-50 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => handleTabChange('ledger')} 
          className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'ledger' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-layer-group text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Ledger</span>
        </button>

        {/* Primary Action Button (Maintains Visibility) */}
        <button 
          onClick={() => handleTabChange('new-entry')} 
          className={`w-14 h-14 -mt-10 rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-90 ${activeTab === 'new-entry' ? 'bg-emerald-700 text-white shadow-emerald-500/20' : 'bg-slate-900 text-white'}`}
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>

        <button 
          onClick={() => setIsMenuOpen(true)} 
          className={`flex flex-col items-center gap-1 w-16 ${isMenuOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-ellipsis text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">More</span>
        </button>
      </nav>

      {/* MOBILE OVERFLOW MENU (Slide-up Drawer) */}
      <div 
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Drawer Content */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 pb-12 transition-transform duration-300 ease-out shadow-2xl ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8"></div>
          
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-4">Primary Navigation</p>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}

            <div className="my-6 border-t border-slate-100 dark:border-slate-800"></div>

            <button 
              onClick={() => { onLogout(); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <i className="fa-solid fa-right-from-bracket w-6 text-center"></i>
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pt-16 md:pt-0 pb-24 md:pb-0 md:ml-20 lg:ml-64 transition-all duration-300 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
