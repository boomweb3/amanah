
import React, { useState, useEffect, useCallback } from 'react';
import { LedgerEntry, TransactionStatus, Direction, TransactionType, User } from '../types';
import { getEthicalInspiration } from '../services/gemini';

interface DashboardProps {
  entries: LedgerEntry[];
  currentUser: User;
  users: User[];
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onConfirmEntry: (id: string) => void;
  onAddEntry: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, currentUser, users, onUpdateStatus, onConfirmEntry, onAddEntry }) => {
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [currentInspirationIndex, setCurrentInspirationIndex] = useState(0);
  const [isLoadingInspiration, setIsLoadingInspiration] = useState(true);

  // Fetch inspirations from Gemini on mount
  useEffect(() => {
    let isMounted = true;
    const fetchInspirations = async () => {
      try {
        const data = await getEthicalInspiration();
        if (isMounted) {
          setInspirations(data);
          setIsLoadingInspiration(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInspirations();
    return () => { isMounted = false; };
  }, []);

  // Auto-cycle inspirations
  useEffect(() => {
    if (inspirations.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentInspirationIndex((prev) => (prev + 1) % inspirations.length);
    }, 12000); // 12 seconds cycle

    return () => clearInterval(interval);
  }, [inspirations]);

  const relevantEntries = entries.filter(e => 
    (e.creatorId === currentUser.id || e.targetUserId === currentUser.id) &&
    (e.status === TransactionStatus.PENDING || e.status === TransactionStatus.CONFIRMED)
  );
  
  const myObligations = relevantEntries.filter(e => {
    if (e.creatorId === currentUser.id) {
      return e.direction === Direction.I_OWE;
    } else {
      return e.direction === Direction.OWED_TO_ME;
    }
  });

  const myTrusts = relevantEntries.filter(e => {
    if (e.creatorId === currentUser.id) {
      return e.direction === Direction.OWED_TO_ME;
    } else {
      return e.direction === Direction.I_OWE;
    }
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] ${currentUser.avatar || 'bg-emerald-500'} flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl dark:shadow-emerald-950/20 shadow-emerald-100`}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">My Ledger</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-2 text-sm md:text-lg font-medium">As-salāmu 'alaykum, {currentUser.name.split(' ')[0]}.</p>
          </div>
        </div>
        <button 
          onClick={onAddEntry}
          className="bg-emerald-800 dark:bg-emerald-600 text-white w-full md:w-auto px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl dark:shadow-emerald-900/20 shadow-emerald-200 hover:bg-emerald-900 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 group"
        >
          <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i> New Entry
        </button>
      </header>

      {/* AI Wisdom Flash Card Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-sm transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-full -ml-16 -mb-16 blur-3xl opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/50 transition-colors">
              Ethical Guidance
            </span>
            <div className="flex gap-2">
               <button 
                onClick={() => setCurrentInspirationIndex(prev => (prev - 1 + inspirations.length) % inspirations.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
               >
                 <i className="fa-solid fa-chevron-left text-xs"></i>
               </button>
               <button 
                onClick={() => setCurrentInspirationIndex(prev => (prev + 1) % inspirations.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
               >
                 <i className="fa-solid fa-chevron-right text-xs"></i>
               </button>
            </div>
          </div>

          <div className="min-h-[100px] flex items-center transition-all duration-700">
            {isLoadingInspiration ? (
              <div className="animate-pulse space-y-3 w-full">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2"></div>
              </div>
            ) : (
              <div key={currentInspirationIndex} className="animate-fadeIn">
                <i className="fa-solid fa-quote-left text-emerald-100 dark:text-emerald-900/30 text-4xl absolute -top-4 -left-2 -z-10"></i>
                <p className="text-xl md:text-2xl font-serif font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {inspirations[currentInspirationIndex]}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex items-center gap-4">
             <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-[12000ms] ease-linear"
                  key={currentInspirationIndex}
                  style={{ width: '100%' }}
                ></div>
             </div>
             <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest whitespace-nowrap">
               {isLoadingInspiration ? '--' : `0${currentInspirationIndex + 1} / 0${inspirations.length}`}
             </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between px-2 md:px-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-hand-holding-dollar text-rose-500 text-sm md:text-base"></i>
              </div>
              Responsibilities
            </h3>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-widest shadow-sm transition-colors">
              {myObligations.length} Active
            </span>
          </div>
          <div className="space-y-4 md:space-y-6">
            {myObligations.length === 0 ? (
              <EmptyState message="No responsibilities." />
            ) : (
              myObligations.map(entry => (
                <LedgerCard 
                  key={entry.id} 
                  entry={entry} 
                  currentUser={currentUser}
                  users={users}
                  onUpdateStatus={onUpdateStatus} 
                  onConfirm={onConfirmEntry} 
                />
              ))
            )}
          </div>
        </section>

        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between px-2 md:px-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-shield-heart text-emerald-500 text-sm md:text-base"></i>
              </div>
              Trusts
            </h3>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-widest shadow-sm transition-colors">
              {myTrusts.length} Active
            </span>
          </div>
          <div className="space-y-4 md:space-y-6">
            {myTrusts.length === 0 ? (
              <EmptyState message="No trusts." />
            ) : (
              myTrusts.map(entry => (
                <LedgerCard 
                  key={entry.id} 
                  entry={entry} 
                  currentUser={currentUser}
                  users={users}
                  onUpdateStatus={onUpdateStatus} 
                  onConfirm={onConfirmEntry} 
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] text-center transition-colors">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
      <i className="fa-solid fa-feather text-2xl md:text-3xl text-slate-200 dark:text-slate-700"></i>
    </div>
    <p className="text-slate-400 dark:text-slate-600 text-base md:text-lg font-bold">{message}</p>
  </div>
);

interface LedgerCardProps {
  entry: LedgerEntry;
  currentUser: User;
  users: User[];
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onConfirm: (id: string) => void;
}

const LedgerCard: React.FC<LedgerCardProps> = ({ entry, currentUser, users, onUpdateStatus, onConfirm }) => {
  const [copied, setCopied] = useState(false);
  const isCreator = entry.creatorId === currentUser.id;
  const isPending = !entry.isConfirmed;
  
  const otherUserId = isCreator ? entry.targetUserId : entry.creatorId;
  const otherUser = users.find(u => u.id === otherUserId);

  const isCreditor = (isCreator && entry.direction === Direction.OWED_TO_ME) || 
                     (!isCreator && entry.direction === Direction.I_OWE);

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?v=${entry.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border transition-all group shadow-sm hover:shadow-xl ${
      isPending 
        ? 'border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-900/5' 
        : 'border-slate-50 dark:border-slate-800'
    }`}>
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className="flex gap-4 md:gap-5 overflow-hidden">
          <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[1.25rem] ${otherUser?.avatar || 'bg-slate-200'} flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg`}>
            {otherUser?.name.charAt(0) || '?'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-black text-slate-900 dark:text-slate-100 text-base md:text-xl truncate">{otherUser?.name || 'Unknown'}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`text-[8px] md:text-[10px] px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg font-black uppercase tracking-widest ${
                entry.type === TransactionType.AMANAH 
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {entry.type}
              </span>
              {entry.isConfirmed ? (
                <span className="text-[8px] md:text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-black bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest border border-emerald-100/50 dark:border-emerald-800/50">
                  <i className="fa-solid fa-check-double"></i> Verified
                </span>
              ) : (
                <span className="text-[8px] md:text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-black bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest border border-amber-100/50 dark:border-amber-800/50 transition-colors">
                  <i className="fa-solid fa-user-clock"></i> {isCreator ? 'Awaiting' : 'Verify'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end flex-shrink-0">
          <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">{entry.amount}</p>
          <button 
            onClick={handleShare}
            className={`mt-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${copied ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 hover:text-emerald-800 dark:hover:text-emerald-400'}`}
          >
            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-share-nodes'}`}></i>
            {copied ? 'Copied' : 'Share'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800 gap-4 transition-colors">
        <div className="flex gap-3 w-full">
          {isPending ? (
            isCreator ? (
              <div className="w-full flex items-center justify-center py-3 px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 text-[10px] font-bold rounded-xl italic tracking-wide">
                Waiting for verification...
              </div>
            ) : (
              <button 
                onClick={() => onConfirm(entry.id)}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-500 px-6 py-4 rounded-xl transition-all shadow-lg active:scale-95"
              >
                <i className="fa-solid fa-handshake-simple"></i>
                Verify terms
              </button>
            )
          ) : (
            <>
              <button 
                onClick={() => onUpdateStatus(entry.id, TransactionStatus.FULFILLED)}
                className="flex-1 text-[10px] font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-4 py-3.5 rounded-xl transition-all"
              >
                {isCreditor ? 'Received' : 'Mark Honored'}
              </button>
              {isCreditor && (
                <button 
                  onClick={() => onUpdateStatus(entry.id, TransactionStatus.FORGIVEN)}
                  className="flex-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 px-4 py-3.5 rounded-xl transition-all"
                >
                  Forgive
                </button>
              )}
            </>
          )}
        </div>
        
        {entry.notes && (
          <div className="flex-shrink-0 flex items-center md:ml-4">
            <div className="relative group/note">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-all">
                <i className="fa-solid fa-comment-dots text-xl"></i>
              </div>
              <div className="absolute bottom-full right-0 mb-4 w-64 p-5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] rounded-2xl opacity-0 invisible group-hover/note:opacity-100 group-hover/note:visible transition-all z-10 shadow-2xl border border-slate-700 leading-relaxed">
                <div className="font-black text-emerald-400 mb-1 uppercase text-[8px] tracking-[0.2em]">Agreement Context</div>
                {entry.notes}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
