
import React, { useState, useMemo } from 'react';
import { LedgerEntry, TransactionType, TransactionStatus, Direction, User } from '../types';
import GeneratedAvatar from '../components/GeneratedAvatar';

interface LedgerFormProps {
  onAdd: (entry: LedgerEntry) => void;
  onCancel: () => void;
  currentUser: User;
  users: User[];
}

const LedgerForm: React.FC<LedgerFormProps> = ({ onAdd, onCancel, currentUser, users }) => {
  const [partnerName, setPartnerName] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    type: TransactionType.DEBT,
    direction: Direction.I_OWE,
    notes: '',
    dueDate: '',
    requireVerification: true
  });

  const suggestions = useMemo(() => {
    return users.filter(u => u.id !== currentUser.id).map(u => u.name);
  }, [users, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;

    const matchedUser = users.find(u => u.name.toLowerCase() === partnerName.trim().toLowerCase());
    let numericAmount: number | undefined = undefined;
    if (formData.type === TransactionType.DEBT) {
      const parsed = parseFloat(formData.amount.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) { numericAmount = parsed; }
    }

    const entry: LedgerEntry = {
      id: Math.random().toString(36).substr(2, 9),
      creatorId: currentUser.id,
      partnerName: partnerName.trim(),
      targetUserId: matchedUser?.id,
      ...formData,
      numericAmount,
      remainingAmount: numericAmount,
      paymentLog: numericAmount !== undefined ? [] : undefined,
      // If verification is NOT required, start as confirmed immediately
      status: !formData.requireVerification ? TransactionStatus.CONFIRMED : TransactionStatus.PENDING,
      isConfirmed: !formData.requireVerification,
      createdAt: new Date().toISOString()
    };
    onAdd(entry);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Record Commitment</h2>
          <p className="text-slate-500 mt-3 font-medium text-lg">Integrity in every word.</p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex gap-3 p-2 bg-slate-50 dark:bg-slate-950 rounded-[2rem]">
            <button type="button" onClick={() => setFormData({...formData, direction: Direction.I_OWE})} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.direction === Direction.I_OWE ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-sm' : 'text-slate-400'}`}>I Owe</button>
            <button type="button" onClick={() => setFormData({...formData, direction: Direction.OWED_TO_ME})} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.direction === Direction.OWED_TO_ME ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-sm' : 'text-slate-400'}`}>Owes Me</button>
          </div>

          <div className="space-y-6">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Commitment Partner</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <GeneratedAvatar seed={partnerName || 'placeholder'} size="lg" className="rounded-[2rem] shadow-lg" />
              </div>
              <div className="flex-1 w-full relative">
                <input required type="text" list="partner-suggestions" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Enter full name..." className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-600 rounded-[2rem] outline-none font-bold text-slate-700 dark:text-slate-200 transition-all text-xl" />
                <datalist id="partner-suggestions">
                  {suggestions.map(name => <option key={name} value={name} />)}
                </datalist>
                {partnerName && <p className="absolute -bottom-6 left-6 text-[9px] font-black text-emerald-600 uppercase tracking-widest animate-fadeIn">Identity pattern generated</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Value / Amount</label>
              <div className="relative">
                {formData.type === TransactionType.DEBT && <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-slate-300">₦</span>}
                <input required type="text" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className={`w-full ${formData.type === TransactionType.DEBT ? 'pl-12 pr-8' : 'px-8'} py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-600 rounded-[2rem] outline-none font-bold text-slate-700 dark:text-slate-200`} placeholder={formData.type === TransactionType.DEBT ? "0.00" : "Description of item"} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-600 rounded-[2rem] outline-none font-bold text-slate-700 dark:text-slate-200 appearance-none">
                <option value={TransactionType.DEBT}>Financial Debt</option>
                <option value={TransactionType.AMANAH}>Amānah (Physical Item)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Require Verification</p>
                <p className="text-[10px] text-slate-500 font-medium">Creditor must confirm before any repayment can be recorded.</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, requireVerification: !formData.requireVerification})}
                className={`w-14 h-7 rounded-full transition-all relative flex-shrink-0 ${formData.requireVerification ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${formData.requireVerification ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Fulfillment Target (Optional)</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-600 rounded-[2rem] outline-none font-bold text-slate-700 dark:text-slate-200" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Context (Optional)</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-600 rounded-[2rem] outline-none font-bold text-slate-700 dark:text-slate-200 resize-none h-32" placeholder="What is this for?" />
          </div>

          <div className="flex gap-6 pt-8">
            <button type="button" onClick={onCancel} className="px-10 py-5 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
            <button type="submit" disabled={!partnerName.trim()} className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all ${partnerName.trim() ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 active:scale-95' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}>Sign Ledger</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LedgerForm;
