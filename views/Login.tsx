
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (user: User) => void;
  error?: string | null;
}

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-amber-500', 'bg-slate-500', 
  'bg-rose-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-violet-500'
];

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp, error }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: AVATAR_COLORS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(formData.email, formData.password);
    } else {
      const newUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar
      };
      onSignUp(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-300">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-800 dark:bg-emerald-600 text-white rounded-[2rem] shadow-2xl dark:shadow-emerald-900/40 shadow-emerald-200 mb-6 group transition-transform hover:scale-105">
            <i className="fa-solid fa-feather-pointed text-3xl group-hover:rotate-12 transition-transform"></i>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Amānah</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Honoring trust, together.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3.5rem] shadow-2xl dark:shadow-black/40 border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors">
          {/* Form Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {mode === 'login' ? 'Sign In' : 'Join Community'}
            </h2>
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 transition-colors"
            >
              {mode === 'login' ? 'Create Account' : 'Back to Login'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 animate-shake">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2 animate-slideDown">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-100 shadow-inner"
                  placeholder="e.g. Omar Farooq"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-100 shadow-inner"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Password</label>
              <input 
                required
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all font-bold text-slate-700 dark:text-slate-100 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-4 pt-2 animate-slideDown">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 text-center">Choose your vibe</label>
                <div className="flex flex-wrap justify-center gap-3">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, avatar: color})}
                      className={`w-10 h-10 rounded-xl ${color} transition-all ${formData.avatar === color ? 'ring-4 ring-emerald-100 dark:ring-emerald-900 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                    >
                      {formData.avatar === color && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-emerald-800 dark:bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200 dark:shadow-emerald-950/20 hover:bg-emerald-900 dark:hover:bg-emerald-500 hover:-translate-y-1 active:scale-95 transition-all mt-4"
            >
              {mode === 'login' ? 'Sign In' : 'Finalize Profile'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-center gap-3 transition-colors">
            <i className="fa-solid fa-shield-halved text-emerald-100 dark:text-slate-800"></i>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest font-black">
              Zero-Knowledge Integrity
            </p>
          </div>
        </div>

        {/* Community Proof */}
        {mode === 'login' && (
          <div className="mt-8 text-center animate-fadeIn">
            <p className="text-[11px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest mb-4 transition-colors">Trusted by the community</p>
            <div className="flex justify-center -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-50 dark:border-slate-900 ${AVATAR_COLORS[i]} flex items-center justify-center text-[10px] text-white font-black transition-colors`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-slate-50 dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-600 font-black transition-colors">
                +1k
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
