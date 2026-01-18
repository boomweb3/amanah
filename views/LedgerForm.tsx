
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
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-emerald-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none"></div>

        <header className="mb-12 relative">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Record Commitment</h2>
          <p className="text-slate-500 mt-3 font-medium text-lg max-w-xl">
            Transparency is the seed of trust. Once you sign this ledger, the other party will receive a request to verify the terms.
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative">
          {/* Perspection Toggle */}
          <div className="flex gap-3 p-2 bg-slate-50 rounded-3xl">
            <button 
              type="button"
              onClick={() => setFormData({...formData, direction: Direction.I_OWE})}
              className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.direction === Direction.I_OWE ? 'bg-white shadow-xl text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <i className="fa-solid fa-arrow-left-long mr-2"></i> I Owe Someone
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, direction: Direction.OWED_TO_ME})}
              className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.direction === Direction.OWED_TO_ME ? 'bg-white shadow-xl text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Someone Owes Me <i className="fa-solid fa-arrow-right-long ml-2"></i>
            </button>
          </div>

          {/* User Discovery Selection */}
          <div className="space-y-6">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              Commitment Partner
            </label>
            
            {!selectedUserId ? (
              <div className="space-y-6">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all font-bold text-slate-700 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelectedUserId(user.id)}
                      className="flex flex-col items-center p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${user.avatar || 'bg-slate-200'} flex items-center justify-center text-white font-black text-lg mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      <span className="text-[10px] text-slate-400 truncate w-full text-center">{user.email}</span>
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="col-span-full py-10 text-center text-slate-400 font-medium">
                      No matching partners found on the platform.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 animate-scaleUp">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl ${selectedUser?.avatar} flex items-center justify-center text-white font-black text-2xl shadow-xl`}>
                    {selectedUser?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 text-xl">{selectedUser?.name}</h4>
                    <p className="text-sm text-emerald-700 font-medium">{selectedUser?.email}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedUserId(null)}
                  className="w-12 h-12 rounded-full hover:bg-emerald-100 text-emerald-400 hover:text-emerald-600 transition-all"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Amount / Subject</label>
              <input 
                required
                type="text" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] outline-none transition-all font-bold text-slate-700 shadow-inner"
                placeholder="e.g. $500 or Nikon D850"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Agreement Type</label>
              <div className="relative">
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] outline-none transition-all appearance-none font-bold text-slate-700 cursor-pointer shadow-inner"
                >
                  <option value={TransactionType.DEBT}>Financial Debt</option>
                  <option value={TransactionType.AMANAH}>Amānah (Item Held in Trust)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                   <i className="fa-solid fa-box-open text-sm"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Context & Circumstances</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-[2.5rem] outline-none transition-all font-bold text-slate-700 shadow-inner resize-none"
              placeholder="Record any specific conditions or promises made..."
            />
          </div>

          <div className="flex gap-6 pt-8">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-10 py-5 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!selectedUserId}
              className={`flex-1 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all ${
                selectedUserId 
                  ? 'bg-emerald-800 text-white shadow-2xl shadow-emerald-200 hover:bg-emerald-900 hover:-translate-y-1' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              Confirm Commitment
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-400 font-medium italic opacity-60">
          "O you who have believed, when you contract a debt for a specified term, write it down."
        </p>
      </div>
    </div>
  );
};

export default LedgerForm;
