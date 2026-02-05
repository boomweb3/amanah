
import React, { useState } from 'react';
import { User } from '../types';
import GeneratedAvatar from '../components/GeneratedAvatar';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (user: User) => void;
  error?: string | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp, error, theme, toggleTheme }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(formData.email, formData.password);
    } else {
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        id: userId,
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      onSignUp(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-all duration-300">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary text-white rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 mb-6">
            <i className="fa-solid fa-feather-pointed text-3xl"></i>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Amānah</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Honoring trust, together.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl dark:shadow-black/40 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {mode === 'login' ? 'Sign In' : 'Join Community'}
            </h2>
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-black uppercase tracking-widest text-accent-text hover:opacity-70 transition-colors"
            >
              {mode === 'login' ? 'Create Account' : 'Back to Login'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent-primary rounded-2xl outline-none font-bold text-slate-700 dark:text-slate-100 transition-all" placeholder="e.g. Omar Farooq" />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent-primary rounded-2xl outline-none font-bold text-slate-700 dark:text-slate-100 transition-all" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent-primary rounded-2xl outline-none font-bold text-slate-700 dark:text-slate-100 transition-all" placeholder="••••••••" />
            </div>

            {mode === 'signup' && formData.name && (
              <div className="space-y-4 pt-2 animate-fadeIn flex flex-col items-center">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Your Generated Identifier</label>
                <GeneratedAvatar seed={formData.name} size="lg" />
                <p className="text-[9px] text-slate-400 italic">This unique pattern will represent you in the ledger.</p>
              </div>
            )}

            <button type="submit" className="w-full py-5 bg-accent-primary text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:opacity-90 active:scale-95 transition-all">
              {mode === 'login' ? 'Continue' : 'Finalize Profile'}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <button onClick={toggleTheme} className="text-slate-400 hover:text-accent-text transition-colors">
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} mr-2`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
