
import React, { useState, useEffect, useMemo } from 'react';
import { LedgerEntry, TransactionStatus, Direction, TransactionType, User } from '../types';
import { getEthicalInspiration } from '../services/gemini';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import GeneratedAvatar from '../components/GeneratedAvatar';

interface DashboardProps {
  entries: LedgerEntry[];
  currentUser: User;
  users: User[];
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onConfirmEntry: (id: string) => void;
  onPartialPayment: (id: string, amount: number) => void;
  onAddEntry: () => void;
  onViewDetail: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, currentUser, users, onUpdateStatus, onConfirmEntry, onPartialPayment, onAddEntry, onViewDetail }) => {
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [currentInspirationIndex, setCurrentInspirationIndex] = useState(0);
  const [isLoadingInspiration, setIsLoadingInspiration] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Fetch inspirations from Gemini on mount
  useEffect(() => {
    let isMounted = true;
    const fetchInspirations = async () => {
      try {
        const data = await getEthicalInspiration();
        if (isMounted) setInspirations(data);
      } catch (err) { console.error(err); } finally { if (isMounted) setIsLoadingInspiration(false); }
    };
    fetchInspirations();
    return () => { isMounted = false; };
  }, []);

  // Rotate through inspiration quotes
  useEffect(() => {
    if (inspirations.length <= 1) return;
    const interval = setInterval(() => setCurrentInspirationIndex((prev) => (prev + 1) % inspirations.length), 12000);
    return () => clearInterval(interval);
  }, [inspirations]);

  const relevantEntries = useMemo(() => entries.filter(e => (e.creatorId === currentUser.id || e.targetUserId === currentUser.id)), [entries, currentUser.id]);
  const activeEntries = relevantEntries.filter(e => e.status === TransactionStatus.PENDING || e.status === TransactionStatus.CONFIRMED || e.status === TransactionStatus.PARTIALLY_FULFILLED);
  
  const myObligations = activeEntries.filter(e => 
    (e.creatorId === currentUser.id && e.direction === Direction.I_OWE) || 
    (e.targetUserId === currentUser.id && e.direction === Direction.OWED_TO_ME)
  );
  
  const myTrusts = activeEntries.filter(e => 
    (e.creatorId === currentUser.id && e.direction === Direction.OWED_TO_ME) || 
    (e.targetUserId === currentUser.id && e.direction === Direction.I_OWE)
  );

  const trustScore = useMemo(() => {
    const total = relevantEntries.length;
    if (total === 0) return 0;
    const fulfilled = relevantEntries.filter(e => e.status === TransactionStatus.FULFILLED).length;
    return Math.round((fulfilled / total) * 100);
  }, [relevantEntries]);

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <GeneratedAvatar seed={currentUser.id} size="lg" className="shadow-xl" />
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">My Ledger</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">As-salāmu 'alaykum, {currentUser.name.split(' ')[0]}.</p>
          </div>
        </div>
        <button onClick={onAddEntry} className="bg-emerald-800 dark:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-900 dark:hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3">
          <i className="fa-solid fa-plus"></i> Record New
        </button>
      </header>

      {feedbackMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 dark:bg-emerald-900 text-white px-8 py-4 rounded-full shadow-2xl animate-fadeIn border border-white/10 flex items-center gap-4">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span className="text-sm font-bold uppercase tracking-widest">{feedbackMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 relative overflow-hidden bg-slate-900 dark:bg-black rounded-[4rem] shadow-2xl group">
          <div className="absolute inset-0 opacity-40">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-emerald-900 via-slate-900 to-black animate-[spin_20s_linear_infinite] blur-[120px]"></div>
          </div>
          <div className="relative z-10 p-14 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between w-full mb-8">
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70">Ethical Beacon</span>
              </div>
            </div>
            <div className="min-h-[140px] flex items-center">
              {isLoadingInspiration ? (
                <div className="space-y-4 w-full opacity-20"><div className="h-8 bg-white/20 rounded-full w-4/5"></div><div className="h-8 bg-white/20 rounded-full w-2/3"></div></div>
              ) : (
                <div key={currentInspirationIndex} className="animate-fadeIn w-full">
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white italic leading-tight tracking-tight drop-shadow-lg">
                    {inspirations[currentInspirationIndex] || "Honor your word as you would honor your most precious possession."}
                  </h2>
                </div>
              )}
            </div>
            <div className="mt-12 flex items-center gap-2 text-white/40 text-[10px] font-bold">
              <i className="fa-solid fa-sparkles text-emerald-400/50"></i>
              <span>INTEGRITY ENGINE</span>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Trust Health</h3>
              <p className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{trustScore}%</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Consistency Score</p>
            </div>
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ value: trustScore }, { value: 100 - trustScore }]} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                    <Cell fill="#10b981" />
                    <Cell fill="#f1f5f9" className="dark:fill-slate-800" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-shield-heart text-emerald-500 text-xl"></i>
              </div>
            </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Obligations</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">{myObligations.length} Items</span>
          </div>
          <div className="space-y-4">
            {myObligations.length === 0 ? (
              <EmptyState icon="fa-dove" message="Your slate is clean." />
            ) : (
              myObligations.map(entry => (
                <LedgerCard key={entry.id} entry={entry} currentUser={currentUser} onViewDetail={onViewDetail} />
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">My Trusts</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">{myTrusts.length} Owed</span>
          </div>
          <div className="space-y-4">
            {myTrusts.length === 0 ? (
              <EmptyState icon="fa-leaf" message="No active trusts." />
            ) : (
              myTrusts.map(entry => (
                <LedgerCard key={entry.id} entry={entry} currentUser={currentUser} onViewDetail={onViewDetail} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper component for empty dashboard states
const EmptyState = ({ icon, message }: { icon: string, message: string }) => (
  <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center">
    <i className={`fa-solid ${icon} text-slate-200 dark:text-slate-800 text-3xl mb-4`}></i>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{message}</p>
  </div>
);

// Summary card for individual ledger entries
const LedgerCard = ({ entry, currentUser, onViewDetail }: any) => {
  const isCreator = entry.creatorId === currentUser.id;
  const partnerName = isCreator ? entry.partnerName : "Partner";
  
  return (
    <div 
      onClick={() => onViewDetail(entry.id)}
      className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <GeneratedAvatar seed={partnerName} size="md" className="rounded-2xl" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-700 transition-colors">{partnerName}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{entry.type} • {entry.status}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
            {entry.numericAmount ? `₦${entry.remainingAmount ?? entry.numericAmount}` : entry.amount}
          </p>
          {entry.dueDate && <p className="text-[9px] font-bold text-slate-400 mt-1">Due {new Date(entry.dueDate).toLocaleDateString()}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
