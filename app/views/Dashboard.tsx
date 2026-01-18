import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LedgerEntry, TransactionStatus, Direction, TransactionType, User } from '../types/types';
import { useAuth } from '../contexts/AuthContext';
import { useLedger } from '../contexts/LedgerContext';

const Dashboard: React.FC = () => {
  const { user, users, fetchUsers } = useAuth();
  const { entries, fetchEntries, updateStatus, confirmEntry } = useLedger();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchUsers();
    }
  }, [user, fetchEntries, fetchUsers]);

  if (!user) return null;

  const userId = user._id || user.id;

  const relevantEntries = entries.filter(e => 
    (e.creatorId === userId || e.targetUserId === userId) &&
    (e.status === TransactionStatus.PENDING || e.status === TransactionStatus.CONFIRMED)
  );
  
  const myObligations = relevantEntries.filter(e => {
    if (e.creatorId === userId) {
      return e.direction === Direction.I_OWE;
    } else {
      return e.direction === Direction.OWED_TO_ME;
    }
  });

  const myTrusts = relevantEntries.filter(e => {
    if (e.creatorId === userId) {
      return e.direction === Direction.OWED_TO_ME;
    } else {
      return e.direction === Direction.I_OWE;
    }
  });

  const handleAddEntry = () => {
    navigate('/new-entry');
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">My Ledger</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">As-salāmu 'alaykum, {user.name}. Honoring your trusts.</p>
        </div>
        <button 
          onClick={handleAddEntry}
          className="bg-emerald-800 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:bg-emerald-900 hover:-translate-y-1 transition-all flex items-center gap-3 group"
        >
          <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i> New Entry
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-hand-holding-dollar text-rose-500"></i>
              </div>
              Responsibilities
            </h3>
            <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              {myObligations.length} Active
            </span>
          </div>
          <div className="space-y-6">
            {myObligations.length === 0 ? (
              <EmptyState message="No current moral responsibilities recorded." />
            ) : (
              myObligations.map(entry => (
                <LedgerCard 
                  key={entry._id || entry.id} 
                  entry={entry} 
                  currentUser={user}
                  users={users}
                  onUpdateStatus={updateStatus} 
                  onConfirm={confirmEntry} 
                />
              ))
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-shield-heart text-emerald-500"></i>
              </div>
              Trusts
            </h3>
            <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              {myTrusts.length} Active
            </span>
          </div>
          <div className="space-y-6">
            {myTrusts.length === 0 ? (
              <EmptyState message="No trusts currently owed to you." />
            ) : (
              myTrusts.map(entry => (
                <LedgerCard 
                  key={entry._id || entry.id} 
                  entry={entry} 
                  currentUser={user}
                  users={users}
                  onUpdateStatus={updateStatus} 
                  onConfirm={confirmEntry} 
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
  <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-200 p-20 rounded-[3.5rem] text-center">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <i className="fa-solid fa-feather text-3xl text-slate-200"></i>
    </div>
    <p className="text-slate-400 text-lg font-bold">{message}</p>
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
  const currentUserId = currentUser._id || currentUser.id;
  const entryId = entry._id || entry.id;
  const isCreator = entry.creatorId === currentUserId;
  const isPending = !entry.isConfirmed;
  
  const otherUserId = isCreator ? entry.targetUserId : entry.creatorId;
  const otherUser = users.find(u => u._id === otherUserId || u.id === otherUserId);

  const isCreditor = (isCreator && entry.direction === Direction.OWED_TO_ME) || 
                     (!isCreator && entry.direction === Direction.I_OWE);

  return (
    <div className={`bg-white p-8 rounded-[3rem] border transition-all group shadow-sm hover:shadow-2xl hover:-translate-y-2 ${isPending ? 'border-amber-100 bg-amber-50/20' : 'border-slate-50'}`}>
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-5">
          <div className={`w-14 h-14 rounded-[1.25rem] ${otherUser?.avatar || 'bg-slate-200'} flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform`}>
            {otherUser?.name.charAt(0) || '?'}
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-xl">{otherUser?.name || 'Unknown'}</h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest ${entry.type === TransactionType.AMANAH ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                {entry.type}
              </span>
              {entry.isConfirmed ? (
                <span className="text-[10px] text-emerald-600 flex items-center gap-1.5 font-black bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-emerald-100/50">
                  <i className="fa-solid fa-check-double"></i> Verified
                </span>
              ) : (
                <span className="text-[10px] text-amber-600 flex items-center gap-1.5 font-black bg-amber-50 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-amber-100/50 animate-pulse">
                  <i className="fa-solid fa-user-clock"></i> 
                  {isCreator ? 'Awaiting Handshake' : 'Verify Relationship'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{entry.amount}</p>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-1.5">
            {entry.dueDate ? `Term: ${new Date(entry.dueDate).toLocaleDateString()}` : 'No fixed term'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex gap-4 w-full">
          {isPending ? (
            isCreator ? (
              <div className="w-full flex items-center justify-center py-4 px-6 bg-slate-50 text-slate-400 text-xs font-bold rounded-2xl italic tracking-wide">
                Waiting for {otherUser?.name.split(' ')[0]} to verify terms...
              </div>
            ) : (
              <button 
                onClick={() => onConfirm(entryId)}
                className="w-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-white bg-emerald-800 hover:bg-emerald-900 px-8 py-5 rounded-[1.5rem] transition-all shadow-xl shadow-emerald-100 active:scale-95"
              >
                <i className="fa-solid fa-handshake-simple text-sm"></i>
                Verify & Sign Ledger
              </button>
            )
          ) : (
            <>
              <button 
                onClick={() => onUpdateStatus(entryId, TransactionStatus.FULFILLED)}
                className="flex-1 text-xs font-black uppercase tracking-widest text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-6 py-4 rounded-[1.25rem] transition-all active:scale-95"
              >
                {isCreditor ? 'Received' : 'Mark Honored'}
              </button>
              {isCreditor && (
                <button 
                  onClick={() => onUpdateStatus(entryId, TransactionStatus.FORGIVEN)}
                  className="flex-1 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-slate-600 px-6 py-4 rounded-[1.25rem] transition-all active:scale-95"
                >
                  Forgive
                </button>
              )}
            </>
          )}
        </div>
        
        {entry.notes && (
          <div className="ml-5 group/note relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all">
              <i className="fa-solid fa-comment-dots text-2xl"></i>
            </div>
            <div className="absolute bottom-full right-0 mb-5 w-72 p-5 bg-slate-900 text-white text-[11px] rounded-[2rem] opacity-0 group-hover/note:opacity-100 transition-all pointer-events-none z-10 shadow-2xl border border-slate-800 leading-relaxed translate-y-3 group-hover/note:translate-y-0">
              <div className="font-black text-emerald-400 mb-2 uppercase text-[9px] tracking-[0.2em] border-b border-white/10 pb-2">Agreement Context</div>
              {entry.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
