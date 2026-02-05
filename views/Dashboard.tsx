
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
}

const Dashboard: React.FC<DashboardProps> = ({ entries, currentUser, users, onUpdateStatus, onConfirmEntry, onPartialPayment, onAddEntry }) => {
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [currentInspirationIndex, setCurrentInspirationIndex] = useState(0);
  const [isLoadingInspiration, setIsLoadingInspiration] = useState(true);
  const [paymentModalEntry, setPaymentModalEntry] = useState<LedgerEntry | null>(null);
  const [fulfillConfirmEntry, setFulfillConfirmEntry] = useState<LedgerEntry | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchInspirations = async () => {
      try {
        const data = await getEthicalInspiration();
        if (isMounted) setInspirations(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoadingInspiration(false);
      }
    };
    fetchInspirations();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (inspirations.length <= 1) return;
    const interval = setInterval(() => setCurrentInspirationIndex((prev) => (prev + 1) % inspirations.length), 12000);
    return () => clearInterval(interval);
  }, [inspirations]);

  const relevantEntries = useMemo(() => entries.filter(e => 
    (e.creatorId === currentUser.id || e.targetUserId === currentUser.id)
  ), [entries, currentUser.id]);

  const activeEntries = relevantEntries.filter(e => 
    e.status === TransactionStatus.PENDING || e.status === TransactionStatus.CONFIRMED
  );
  
  const myObligations = activeEntries.filter(e => e.creatorId === currentUser.id ? e.direction === Direction.I_OWE : e.direction === Direction.OWED_TO_ME);
  const myTrusts = activeEntries.filter(e => e.creatorId === currentUser.id ? e.direction === Direction.OWED_TO_ME : e.direction === Direction.I_OWE);

  const trustScore = useMemo(() => {
    const total = relevantEntries.length;
    if (total === 0) return 0;
    const fulfilled = relevantEntries.filter(e => e.status === TransactionStatus.FULFILLED).length;
    return Math.round((fulfilled / total) * 100);
  }, [relevantEntries]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleFulfillConfirmed = () => {
    if (fulfillConfirmEntry) {
      onUpdateStatus(fulfillConfirmEntry.id, TransactionStatus.FULFILLED);
      setFulfillConfirmEntry(null);
      showFeedback("The trust has been successfully honored and recorded.");
    }
  };

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
                    <Cell fill="rgba(0,0,0,0.05)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <i className="fa-solid fa-shield-heart text-slate-100 dark:text-slate-800 text-2xl"></i>
              </div>
            </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <i className="fa-solid fa-hand-holding-dollar text-emerald-600 dark:text-emerald-400 text-base"></i>
            </div>
            Responsibilities
          </h3>
          <div className="space-y-6">
            {myObligations.length === 0 ? <EmptyState message="No responsibilities." /> : myObligations.map(entry => (
              <LedgerCard 
                key={entry.id} 
                entry={entry} 
                currentUser={currentUser} 
                onFulfillClick={() => setFulfillConfirmEntry(entry)}
                onConfirm={onConfirmEntry} 
                onOpenPartial={() => setPaymentModalEntry(entry)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <i className="fa-solid fa-shield-heart text-emerald-600 dark:text-emerald-400 text-base"></i>
            </div>
            Trusts
          </h3>
          <div className="space-y-6">
            {myTrusts.length === 0 ? <EmptyState message="No trusts." /> : myTrusts.map(entry => (
              <LedgerCard 
                key={entry.id} 
                entry={entry} 
                currentUser={currentUser} 
                onFulfillClick={() => setFulfillConfirmEntry(entry)}
                onConfirm={onConfirmEntry} 
              />
            ))}
          </div>
        </section>
      </div>

      {paymentModalEntry && (
        <PartialPaymentModal 
          entry={paymentModalEntry} 
          onClose={() => setPaymentModalEntry(null)} 
          onSubmit={(amt) => {
            onPartialPayment(paymentModalEntry.id, amt);
            setPaymentModalEntry(null);
            showFeedback("Progress recorded. Every step toward fulfillment matters.");
          }} 
        />
      )}

      {fulfillConfirmEntry && (
        <ConfirmationModal 
          title="Confirm Fulfillment"
          message={`Are you sure the trust with ${fulfillConfirmEntry.partnerName} for ${fulfillConfirmEntry.amount} has been truly honored?`}
          confirmLabel="Yes, it's fulfilled"
          onConfirm={handleFulfillConfirmed}
          onClose={() => setFulfillConfirmEntry(null)}
        />
      )}
    </div>
  );
};

const ConfirmationModal = ({ title, message, confirmLabel, onConfirm, onClose }: { title: string, message: string, confirmLabel: string, onConfirm: () => void, onClose: () => void }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose}></div>
    <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-10 rounded-[3rem] shadow-2xl relative z-10 animate-scaleUp border border-slate-100 dark:border-slate-800 text-center">
      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <i className="fa-solid fa-circle-question text-2xl"></i>
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">{message}</p>
      <div className="flex flex-col gap-3">
        <button onClick={onConfirm} className="w-full py-4 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
          {confirmLabel}
        </button>
        <button onClick={onClose} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">
          Go Back
        </button>
      </div>
    </div>
  </div>
);

const PartialPaymentModal = ({ entry, onClose, onSubmit }: { entry: LedgerEntry, onClose: () => void, onSubmit: (amt: number) => void }) => {
  const [amount, setAmount] = useState('');
  const remaining = entry.remainingAmount ?? entry.numericAmount ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0 && val <= remaining) {
      onSubmit(val);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative z-10 animate-scaleUp border border-slate-100 dark:border-slate-800">
        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Record Payment</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Reducing the trust with {entry.partnerName}.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Payment Amount (Max: {remaining})</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₦</span>
              <input 
                autoFocus
                type="number" 
                step="0.01"
                required
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-600 rounded-2xl outline-none font-black text-2xl text-slate-700 dark:text-slate-100"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > remaining}
              className="flex-1 py-4 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl disabled:opacity-30 transition-all"
            >
              Update Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LedgerCard = ({ entry, currentUser, onFulfillClick, onConfirm, onOpenPartial }: any) => {
  const isCreator = entry.creatorId === currentUser.id;
  const isPending = !entry.isConfirmed;
  const isCreditor = (isCreator && entry.direction === Direction.OWED_TO_ME) || (!isCreator && entry.direction === Direction.I_OWE);
  const isDebtor = !isCreditor;
  const isMonetaryDebt = entry.type === TransactionType.DEBT && entry.numericAmount !== undefined;
  
  const displayName = entry.partnerName;
  const remaining = entry.remainingAmount ?? entry.numericAmount;
  const progress = isMonetaryDebt ? Math.round(((entry.numericAmount - remaining) / entry.numericAmount) * 100) : 0;

  return (
    <div className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border transition-all shadow-sm group relative overflow-hidden ${isPending ? 'border-amber-100 dark:border-amber-900/30 bg-amber-50/5' : 'border-slate-100 dark:border-slate-800'}`}>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex gap-4">
          <GeneratedAvatar seed={displayName} size="md" className="rounded-2xl" />
          <div>
            <h4 className="font-black text-slate-900 dark:text-slate-100 text-lg">{displayName}</h4>
            <span className="text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 mt-1 inline-block">{entry.type}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
            {isMonetaryDebt ? `₦${remaining}` : entry.amount}
          </p>
          {isMonetaryDebt && remaining < entry.numericAmount && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">of {entry.amount}</p>
          )}
        </div>
      </div>

      {isMonetaryDebt && (
        <div className="mb-8 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Progress</p>
            <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{progress}%</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800 relative z-10">
        {isPending ? (
          isCreator ? <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Waiting for verification...</p> : 
          <button onClick={() => onConfirm(entry.id)} className="bg-emerald-800 dark:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20">Handshake & Confirm</button>
        ) : (
          <div className="flex gap-2 w-full">
            <button onClick={onFulfillClick} className="flex-1 py-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-100 transition-colors">Fulfill</button>
            {isDebtor && isMonetaryDebt && (
              <button onClick={onOpenPartial} className="flex-1 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-100 transition-colors">Partial</button>
            )}
            {isCreditor && <button onClick={() => onFulfillClick()} className="flex-1 py-3.5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-50 transition-colors">Forgive</button>}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-white/40 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 p-20 rounded-[2.5rem] text-center">
    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{message}</p>
  </div>
);

export default Dashboard;
