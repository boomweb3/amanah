
import React, { useState, useMemo } from 'react';
import { LedgerEntry, TransactionType, TransactionStatus, Direction, User } from '../types';

interface LedgerFormProps {
  onAdd: (entry: LedgerEntry) => void;
  onCancel: () => void;
  currentUser: User;
  users: User[];
}

const LedgerForm: React.FC<LedgerFormProps> = ({ onAdd, onCancel, currentUser, users }) => {
  const otherUsers = useMemo(() => users.filter(u => u.id !== currentUser.id), [users, currentUser]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: TransactionType.DEBT,
    direction: Direction.I_OWE,
    dueDate: '',
    notes: ''
  });

  const filteredUsers = useMemo(() => 
    otherUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [otherUsers, searchTerm]
  );

  const selectedUser = useMemo(() => 
    otherUsers.find(u => u.id === selectedUserId), [otherUsers, selectedUserId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    const entry: LedgerEntry = {
      id: Math.random().toString(36).substr(2, 9),
      creatorId: currentUser.id,
      targetUserId: selectedUserId,
      ...formData,
      status: TransactionStatus.PENDING,
      isConfirmed: false,
      createdAt: new Date().toISOString()
    };
    onAdd(entry);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-black/20 shadow-emerald-50 relative overflow-hidden transition-colors">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-950/20 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none transition-colors"></div>

        <header className="mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Record Commitment</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-base md:text-lg max-w-xl">
            Transparency is the seed of trust. Once you sign this ledger, the other party will receive a request to verify the terms.
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative">
          {/* Perspection Toggle */}
          <div className="flex gap-3 p-2 bg-slate-50 dark:bg-slate-950 rounded-2xl md:rounded-3xl transition-colors">
            <button 
              type="button"
              onClick={() => setFormData({...formData, direction: Direction.I_OWE})}
              className={`flex-1 py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${formData.direction === Direction.I_OWE ? 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-black/20 text-emerald-800 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
            >
              <i className="fa-solid fa-arrow-left-long mr-2"></i> I Owe
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, direction: Direction.OWED_TO_ME})}
              className={`flex-1 py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${formData.direction === Direction.OWED_TO_ME ? 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-black/20 text-emerald-800 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
            >
              Owes Me <i className="fa-solid fa-arrow-right-long ml-2"></i>
            </button>
          </div>

          {/* User Discovery Selection */}
          <div className="space-y-6">
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
              Commitment Partner
            </label>
            
            {!selectedUserId ? (
              <div className="space-y-6">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"></i>
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full pl-14 pr-8 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl md:rounded-3xl outline-none transition-all font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin transition-colors">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelectedUserId(user.id)}
                      className="flex flex-col items-center p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group"
                    >
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${user.avatar || 'bg-slate-200'} flex items-center justify-center text-white font-black text-lg mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-200 text-sm truncate w-full text-center">{user.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full text-center">{user.email}</span>
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="col-span-full py-10 text-center text-slate-400 dark:text-slate-600 font-medium">
                      No matching partners found on the platform.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 md:p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl md:rounded-[2.5rem] border-2 border-emerald-100 dark:border-emerald-900/30 animate-scaleUp transition-colors">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${selectedUser?.avatar} flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl`}>
                    {selectedUser?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 dark:text-emerald-400 text-lg md:text-xl">{selectedUser?.name}</h4>
                    <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-600 font-medium">{selectedUser?.email}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedUserId(null)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-400 hover:text-emerald-600 transition-all"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Amount / Subject</label>
              <input 
                required
                type="text" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-8 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl md:rounded-[2rem] outline-none transition-all font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                placeholder="e.g. $500 or Nikon D850"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Agreement Type</label>
              <div className="relative">
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})}
                  className="w-full px-8 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl md:rounded-[2rem] outline-none transition-all appearance-none font-bold text-slate-700 dark:text-slate-200 cursor-pointer shadow-inner transition-colors"
                >
                  <option value={TransactionType.DEBT}>Financial Debt</option>
                  <option value={TransactionType.AMANAH}>Amānah (Item Held in Trust)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 dark:text-slate-700">
                   <i className="fa-solid fa-box-open text-sm"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Context & Circumstances</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] md:rounded-[2.5rem] outline-none transition-all font-bold text-slate-700 dark:text-slate-200 shadow-inner resize-none transition-colors"
              placeholder="Record any specific conditions or promises made..."
            />
          </div>

          <div className="flex gap-6 pt-8">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 md:px-10 py-4 md:py-5 text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-400 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!selectedUserId}
              className={`flex-1 px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest transition-all ${
                selectedUserId 
                  ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-2xl dark:shadow-emerald-950/20 shadow-emerald-200 hover:bg-emerald-900 dark:hover:bg-emerald-500 hover:-translate-y-1' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-600 font-medium italic opacity-60">
          "O you who have believed, when you contract a debt for a specified term, write it down."
        </p>
      </div>
    </div>
  );
};

export default LedgerForm;
