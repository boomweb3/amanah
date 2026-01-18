
import React, { useState } from 'react';

export interface Supporter {
  id: string;
  name: string;
  relation: string;
  contributionTotal: number;
}

const FamilyCircle: React.FC = () => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', relation: '' });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setSupporters([...supporters, {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteData.name,
      relation: inviteData.relation,
      contributionTotal: 0
    }]);
    setIsInviting(false);
    setInviteData({ name: '', relation: '' });
  };

  return (
    <div className="space-y-8">
      <header className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Support Circle</h2>
          <p className="text-emerald-100 max-w-lg">
            Manage your debts with transparency. Invite trusted family or friends who can see your progress and support your journey toward financial freedom.
          </p>
          <button 
            onClick={() => setIsInviting(true)}
            className="mt-6 bg-white text-emerald-900 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
          >
            Invite Supporter
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
      </header>

      {isInviting && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleInvite} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-scaleUp">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Invite to Circle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supporter Name</label>
                <input 
                  required
                  type="text" 
                  value={inviteData.name}
                  onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Relation</label>
                <input 
                  required
                  type="text" 
                  value={inviteData.relation}
                  onChange={(e) => setInviteData({...inviteData, relation: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Brother, Close Friend"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsInviting(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Send Invite</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supporters.map(supporter => (
          <div key={supporter.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{supporter.name}</h4>
              <p className="text-sm text-slate-500">{supporter.relation}</p>
            </div>
            <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Support</span>
              <span className="text-emerald-600 font-bold">${supporter.contributionTotal.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Privacy Control</h4>
          <p className="text-sm text-amber-800/80 mt-1">
            Supporters can only see the debts you choose to share. By default, they only see your aggregate progress to maintain your dignity while offering support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FamilyCircle;
