
import React, { useState } from 'react';
import { LedgerEntry, TransactionStatus, Direction, TransactionType, User } from '../types';
import GeneratedAvatar from '../components/GeneratedAvatar';

interface RecordDetailProps {
  entryId: string;
  entries: LedgerEntry[];
  currentUser: User;
  users: User[];
  onBack: () => void;
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onPartialPayment: (id: string, amount: number) => void;
  onRetractResolution: (id: string) => void;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ entryId, entries, currentUser, users, onBack, onUpdateStatus, onPartialPayment, onRetractResolution }) => {
  const entry = entries.find(e => e.id === entryId);
  if (!entry) return <div className="p-20 text-center">Record not found.</div>;

  const isCreator = entry.creatorId === currentUser.id;
  const isCreditor = (isCreator && entry.direction === Direction.OWED_TO_ME) || (!isCreator && entry.direction === Direction.I_OWE);
  const isDebtor = !isCreditor;
  const isMonetaryDebt = entry.type === TransactionType.DEBT && entry.numericAmount !== undefined;
  const partnerName = isCreator ? entry.partnerName : (users.find(u => u.id === entry.creatorId)?.name || "Partner");
  
  // Verification lock: If verification is required, debtor cannot record payment until creditor confirms
  const isLocked = entry.requireVerification && !entry.isConfirmed && isDebtor;

  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [showRetractConfirm, setShowRetractConfirm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/verify/${entry.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFulfill = () => onUpdateStatus(entry.id, TransactionStatus.FULFILLED);
  const handleForgive = () => onUpdateStatus(entry.id, TransactionStatus.FORGIVEN);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(paymentAmount);
    if (!isNaN(val) && val > 0 && val <= (entry.remainingAmount ?? entry.numericAmount ?? 0)) {
      onPartialPayment(entry.id, val);
      setPaymentAmount('');
      setShowPaymentInput(false);
    }
  };

  const handleRetract = () => {
    onRetractResolution(entry.id);
    setShowRetractConfirm(false);
  };

  const isRetractEligible = [TransactionStatus.FULFILLED, TransactionStatus.PARTIALLY_FULFILLED].includes(entry.status);

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending';

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-24 space-y-8">
      <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-emerald-700 transition-colors font-black uppercase tracking-widest text-[10px]">
        <i className="fa-solid fa-arrow-left"></i> Back to Ledger
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="p-10 md:p-14 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <GeneratedAvatar seed={partnerName} size="lg" className="rounded-[2rem]" />
              <div>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-1">{entry.status}</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{partnerName}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{isCreditor ? 'Partner is your responsibility' : 'Partner holds your trust'}</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
              <p className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                {isMonetaryDebt ? `₦${entry.remainingAmount ?? entry.numericAmount}` : entry.amount}
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* OVERVIEW SECTION */}
          <div className="space-y-12">
            <section>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Record Details</h3>
              <div className="space-y-6">
                <DetailRow label="Type" value={entry.type} />
                <DetailRow label="Original Value" value={isMonetaryDebt ? `₦${entry.numericAmount}` : entry.amount} />
                <DetailRow label="Role" value={isCreditor ? 'Creditor (You are owed)' : 'Debtor (You owe)'} />
                <DetailRow label="Due Date" value={entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : 'Unspecified'} />
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Verification Status</h3>
              <div className="space-y-6">
                <DetailRow label="Confirmation Required" value={entry.requireVerification ? 'Yes' : 'No'} />
                <DetailRow label="Status" value={entry.isConfirmed ? 'Confirmed' : 'Pending Verification'} />
                <DetailRow label="Confirmed At" value={formatDate(entry.confirmedAt)} />
                {!entry.isConfirmed && (
                  <button 
                    onClick={handleCopyLink}
                    className={`mt-4 w-full py-3 rounded-xl border font-black uppercase text-[10px] tracking-widest transition-all ${copiedLink ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-slate-500 hover:border-emerald-600'}`}
                  >
                    <i className={`fa-solid ${copiedLink ? 'fa-check' : 'fa-link'} mr-2`}></i>
                    {copiedLink ? 'Link Copied' : 'Share Verification Link'}
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* TIMELINE SECTION */}
          <div className="space-y-12">
            <section>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Timeline & History</h3>
              <div className="relative pl-8 space-y-10">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800"></div>
                
                <TimelinePoint date={formatDate(entry.createdAt)} label="Record Created" active />
                
                {entry.isConfirmed && <TimelinePoint date={formatDate(entry.confirmedAt)} label="Mutual Confirmation Received" active />}
                
                {entry.paymentLog?.map((p, idx) => (
                  <TimelinePoint 
                    key={p.id} 
                    date={formatDate(p.date)} 
                    label={`Partial Payment: ₦${p.amount}${p.isReverted ? ' (Reverted)' : ''}`} 
                    active 
                    variant={p.isReverted ? 'amber' : 'emerald'}
                  />
                ))}

                {entry.retractionHistory?.map((r, idx) => (
                  <TimelinePoint key={r.id} date={formatDate(r.date)} label={`Resolution Retracted (${r.previousStatus})`} active variant="amber" />
                ))}

                {entry.resolvedAt && (
                  <TimelinePoint 
                    date={formatDate(entry.resolvedAt)} 
                    label={entry.status === TransactionStatus.FULFILLED ? "Fully Honored" : entry.status} 
                    highlight 
                  />
                )}
              </div>
            </section>

            {/* ACTION SECTION */}
            <section className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Management Actions</h3>
              
              {!entry.resolvedAt ? (
                <div className="space-y-4">
                  {isLocked && (
                    <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start gap-4">
                      <i className="fa-solid fa-lock text-amber-600 mt-1"></i>
                      <p className="text-[10px] text-amber-800 dark:text-amber-500 font-bold leading-relaxed uppercase tracking-widest">
                        Repayment actions are locked until the creditor confirms this record.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {/* Primary Actions: Available to both Creditor and Debtor */}
                    <button 
                      disabled={isLocked} 
                      onClick={handleFulfill} 
                      className="w-full py-5 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-20 transition-all"
                    >
                      Mark Fully Honored
                    </button>
                    
                    {isMonetaryDebt && (
                      <>
                        {!showPaymentInput ? (
                          <button 
                            disabled={isLocked} 
                            onClick={() => setShowPaymentInput(true)} 
                            className="w-full py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 disabled:opacity-20 transition-all"
                          >
                            Record Partial Payment
                          </button>
                        ) : (
                          <form onSubmit={handlePaymentSubmit} className="space-y-4 p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl animate-fadeIn">
                            <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₦</span>
                              <input autoFocus type="number" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-xl border border-slate-200 outline-none font-black text-lg text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900" placeholder="0.00" />
                            </div>
                            <div className="flex gap-2">
                              <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px]">Confirm Payment</button>
                              <button type="button" onClick={() => setShowPaymentInput(false)} className="px-4 py-3 text-slate-400 font-black uppercase tracking-widest text-[9px]">Cancel</button>
                            </div>
                          </form>
                        )}
                      </>
                    )}

                    {/* Secondary Actions: Forgive is exclusive to the Creditor */}
                    {isCreditor && (
                      <button 
                        onClick={handleForgive} 
                        className="w-full py-5 mt-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                      >
                        Forgive Debt (Act of Grace)
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isRetractEligible && (
                    <button 
                      onClick={() => setShowRetractConfirm(true)}
                      className="w-full py-5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-500 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-100 transition-all"
                    >
                      Retract Resolution
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400 font-bold uppercase text-center tracking-widest italic">This record is currently resolved.</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* NOTES SECTION */}
        <footer className="p-10 md:p-14 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contextual Notes</h3>
           <p className="text-slate-600 dark:text-slate-400 text-sm italic font-medium leading-relaxed">
             {entry.notes || 'No additional context was provided for this commitment.'}
           </p>
        </footer>
      </div>

      {showRetractConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setShowRetractConfirm(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-10 rounded-[3rem] shadow-2xl relative z-10 animate-scaleUp border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-rotate-left text-2xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Retract Resolution?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
              This will return the debt to an active state. The outstanding balance will be recalculated and your partner will be notified.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleRetract} className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                Yes, Retract & Reopen
              </button>
              <button onClick={() => setShowRetractConfirm(false)} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">{value}</span>
  </div>
);

const TimelinePoint = ({ date, label, active = false, highlight = false, variant = 'emerald' }: { date: string, label: string, active?: boolean, highlight?: boolean, variant?: 'emerald' | 'amber' }) => (
  <div className="relative">
    <div className={`absolute -left-[36px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
      highlight ? 'bg-emerald-500 scale-125' : 
      active ? (variant === 'amber' ? 'bg-amber-500' : 'bg-emerald-600') : 'bg-slate-200'
    }`}></div>
    <p className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-emerald-600' : 'text-slate-400'}`}>{date}</p>
    <p className={`text-sm font-bold mt-1 ${highlight ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>{label}</p>
  </div>
);

export default RecordDetail;
