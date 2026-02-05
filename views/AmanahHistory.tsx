
import React, { useState, useMemo } from 'react';
import { LedgerEntry, TransactionStatus, Direction, User } from '../types';
import GeneratedAvatar from '../components/GeneratedAvatar';

interface AmanahHistoryProps {
  entries: LedgerEntry[];
  currentUser: User;
  users: User[];
  onDeleteEntry: (id: string) => void;
}

const AmanahHistory: React.FC<AmanahHistoryProps> = ({ entries, currentUser, users, onDeleteEntry }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const resolvedEntries = useMemo(() => {
    return entries
      .filter(e => (e.creatorId === currentUser.id || e.targetUserId === currentUser.id))
      .filter(e => 
        e.status === TransactionStatus.FULFILLED || 
        e.status === TransactionStatus.FORGIVEN || 
        e.status === TransactionStatus.CHARITY
      )
      .sort((a, b) => new Date(b.resolvedAt || b.createdAt).getTime() - new Date(a.resolvedAt || a.createdAt).getTime());
  }, [entries, currentUser.id]);

  const summary = useMemo(() => {
    const total = resolvedEntries.length;
    if (total === 0) return { rate: 0, forgiven: 0, charity: 0 };
    const fulfilled = resolvedEntries.filter(e => e.status === TransactionStatus.FULFILLED).length;
    return {
      rate: Math.round((fulfilled / total) * 100),
      forgiven: resolvedEntries.filter(e => e.status === TransactionStatus.FORGIVEN).length,
      charity: resolvedEntries.filter(e => e.status === TransactionStatus.CHARITY).length
    };
  }, [resolvedEntries]);

  const grouped = useMemo(() => {
    const groups: Record<string, LedgerEntry[]> = {};
    resolvedEntries.forEach(e => {
      const date = new Date(e.resolvedAt || e.createdAt);
      const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  }, [resolvedEntries]);

  const handleDelete = (id: string) => {
    onDeleteEntry(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <header>
        <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-2">Amānah History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">A reflective record of honored commitments and shared grace.</p>
      </header>

      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8">Resolution Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-1">{summary.rate}%</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Fulfillment Rate</p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${summary.rate}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">{summary.forgiven}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forgiven Obligations</p>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">{summary.charity}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Charity Conversions</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <i className="fa-solid fa-scroll text-3xl text-slate-200 dark:text-slate-800 mb-4"></i>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Your journey is just beginning.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([period, items]) => (
            <section key={period} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <h3 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em]">{period}</h3>
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="space-y-4">
                {items.map(entry => (
                  <HistoryItem 
                    key={entry.id} 
                    entry={entry} 
                    currentUser={currentUser} 
                    onDeleteClick={() => setDeleteConfirmId(entry.id)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-10 rounded-[3rem] shadow-2xl relative z-10 animate-scaleUp border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-trash-can text-2xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Delete Record</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">Are you sure you want to remove this record from your history? This cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleDelete(deleteConfirmId)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                Delete Permanently
              </button>
              <button onClick={() => setDeleteConfirmId(null)} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryItem = ({ entry, currentUser, onDeleteClick }: { entry: LedgerEntry, currentUser: User, onDeleteClick: () => void }) => {
  const isCreator = entry.creatorId === currentUser.id;
  const role = (isCreator && entry.direction === Direction.I_OWE) || (!isCreator && entry.direction === Direction.OWED_TO_ME) ? 'My Responsibility' : 'My Trust';
  const displayName = entry.partnerName;
  
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group transition-all hover:border-emerald-100 dark:hover:border-emerald-900/40 relative">
      <div className="flex items-center gap-4">
        <GeneratedAvatar seed={displayName} size="md" className="rounded-2xl" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{displayName}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{role} • {entry.type}</p>
        </div>
      </div>
      <div className="flex-1 sm:text-center">
        <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
          {entry.numericAmount ? `₦${entry.numericAmount}` : entry.amount}
        </p>
        <div className="flex items-center justify-start sm:justify-center gap-2 text-[9px] text-slate-400 font-bold mt-1">
          <span>{formatDate(entry.createdAt)}</span>
          <i className="fa-solid fa-arrow-right-long text-[7px] opacity-30"></i>
          <span className="text-emerald-700 dark:text-emerald-400">{formatDate(entry.resolvedAt || entry.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
          entry.status === TransactionStatus.FULFILLED ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
          entry.status === TransactionStatus.FORGIVEN ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' :
          'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
        }`}>
          {entry.status}
        </span>
        <button onClick={onDeleteClick} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all text-xs">
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  );
};

export default AmanahHistory;
