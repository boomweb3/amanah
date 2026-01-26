
import React, { useState } from 'react';
import { LedgerEntry, TransactionStatus, User } from '../types';

interface GuestVerificationProps {
  entry: LedgerEntry;
  users: User[];
  onConfirm: (id: string) => void;
  onDispute: (id: string) => void;
  onGoHome: () => void;
  theme: 'light' | 'dark';
}

const GuestVerification: React.FC<GuestVerificationProps> = ({ entry, users, onConfirm, onDispute, onGoHome, theme }) => {
  const [step, setStep] = useState<'security' | 'action' | 'success'>('security');
  const [otp, setOtp] = useState('');
  
  const creator = users.find(u => u.id === entry.creatorId);
  const target = users.find(u => u.id === entry.targetUserId);
  
  const initiatorName = creator?.name || 'A Community Member';

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      setStep('action');
    }
  };

  const handleConfirm = () => {
    onConfirm(entry.id);
    setStep('success');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#FCF9F1]'} flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300`}>
      <div className="max-w-xl w-full">
        {/* Branding */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl shadow-xl mb-4">
            <i className="fa-solid fa-feather-pointed text-2xl"></i>
          </div>
          <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-slate-100">Amānah</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Verified Integrity</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl dark:shadow-black/40 shadow-emerald-900/5 p-10 md:p-14 border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors">
          {step === 'security' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4">Security Check</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                To verify this is you, please enter the 4-digit code sent to your registered device.
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <input 
                  autoFocus
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-4xl tracking-[1em] font-black py-6 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 dark:focus:border-emerald-400 rounded-3xl outline-none transition-all text-emerald-900 dark:text-emerald-400 shadow-inner"
                  placeholder="••••"
                />
                <button 
                  disabled={otp.length !== 4}
                  className="w-full py-5 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl dark:shadow-emerald-950/20 shadow-emerald-100 disabled:opacity-30 transition-all hover:-translate-y-1"
                >
                  Enter Verification
                </button>
              </form>
            </div>
          )}

          {step === 'action' && (
            <div className="animate-slideDown">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-xl ${creator?.avatar || 'bg-emerald-500'} flex items-center justify-center text-white font-black`}>
                  {initiatorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-lg">{initiatorName}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">Requesting Confirmation</p>
                </div>
              </div>

              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[2rem] p-8 mb-10 border border-emerald-100/50 dark:border-emerald-900/30 transition-colors">
                <div className="text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Commitment Value</p>
                  <p className="text-5xl font-black text-emerald-900 dark:text-emerald-400 tracking-tighter">{entry.amount}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-emerald-100/30 dark:border-emerald-900/10">
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                    "{entry.notes || 'No additional notes provided for this ledger entry.'}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={handleConfirm}
                  className="w-full py-6 bg-emerald-800 dark:bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl dark:shadow-emerald-950/20 shadow-emerald-200 hover:bg-emerald-900 dark:hover:bg-emerald-500 transition-all active:scale-95"
                >
                  I Confirm I Received It
                </button>
                <button 
                  onClick={() => onDispute(entry.id)}
                  className="w-full py-6 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                >
                  I Have Not Received It
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10 animate-scaleUp">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                <i className="fa-solid fa-handshake-simple text-4xl"></i>
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">Verification Complete</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
                The ledger has been updated. This transaction is now marked as <strong>Honored</strong>.
              </p>
              <button 
                onClick={onGoHome}
                className="px-10 py-4 bg-emerald-800 dark:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-100 dark:shadow-emerald-950/20 hover:bg-emerald-900 dark:hover:bg-emerald-500 transition-all"
              >
                Track Your Own Debts
              </button>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-slate-400 dark:text-slate-600 animate-fadeIn transition-colors">
          <p className="text-xs font-medium">Protect your relationships with clarity.</p>
          <div className="flex justify-center gap-6 mt-4">
            <i className="fa-brands fa-apple text-xl opacity-20 hover:opacity-100 transition-opacity cursor-pointer"></i>
            <i className="fa-brands fa-google-play text-xl opacity-20 hover:opacity-100 transition-opacity cursor-pointer"></i>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GuestVerification;
