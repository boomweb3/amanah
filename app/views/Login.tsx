
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-amber-500', 'bg-slate-500', 
  'bg-rose-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-violet-500'
];

const Login: React.FC = () => {
  const { login, register, error, loading, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: AVATAR_COLORS[0]
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.avatar);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-800 text-white rounded-[2rem] shadow-2xl shadow-emerald-200 mb-6 group transition-transform hover:scale-105">
            <i className="fa-solid fa-feather-pointed text-3xl group-hover:rotate-12 transition-transform"></i>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Amānah</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Honoring trust, together.</p>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-emerald-100/40 border border-slate-100 relative overflow-hidden">
          {/* Form Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {mode === 'login' ? 'Sign In' : 'Join Community'}
            </h2>
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setLocalError(null);
              }}
              className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              {mode === 'login' ? 'Create Account' : 'Back to Login'}
            </button>
          </div>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3 animate-shake">
              <i className="fa-solid fa-circle-exclamation"></i>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2 animate-slideDown">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-inner"
                  placeholder="e.g. Omar Farooq"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-inner"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <input 
                required
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-4 pt-2 animate-slideDown">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-center">Choose your vibe</label>
                <div className="flex flex-wrap justify-center gap-3">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, avatar: color})}
                      className={`w-10 h-10 rounded-xl ${color} transition-all ${formData.avatar === color ? 'ring-4 ring-emerald-100 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                    >
                      {formData.avatar === color && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-800 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200 hover:bg-emerald-900 hover:-translate-y-1 active:scale-95 transition-all mt-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Finalize Profile'
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-3">
            <i className="fa-solid fa-shield-halved text-emerald-100"></i>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              Zero-Knowledge Integrity
            </p>
          </div>
        </div>

        {mode === 'login' && (
          <div className="mt-8 text-center animate-fadeIn">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-4">Demo Credentials</p>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-mono text-slate-600">Email: omar@example.com</p>
              <p className="text-xs font-mono text-slate-600">Password: password</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
