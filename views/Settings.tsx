
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-amber-500', 'bg-slate-500', 
  'bg-rose-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-violet-500'
];

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser }) => {
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    avatar: currentUser.avatar || AVATAR_COLORS[0]
  });

  const [notifications, setNotifications] = useState({
    dueDate: true,
    summary: false,
    verification: true
  });

  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`amaanah.app/u/${currentUser.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    onUpdateUser({
      ...currentUser,
      name: profileData.name,
      avatar: profileData.avatar
    });
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-2 text-sm md:text-lg font-medium">Manage your identity.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`w-full md:w-auto px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm transition-all shadow-xl ${
            saveStatus === 'saved' ? 'bg-emerald-500 text-white' : 'bg-emerald-800 dark:bg-emerald-600 text-white hover:bg-emerald-900 dark:hover:bg-emerald-500'
          }`}
        >
          {saveStatus === 'saving' ? 'Applying...' : saveStatus === 'saved' ? 'Updated!' : 'Save Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 mb-6 md:mb-8 flex items-center gap-3">
              <i className="fa-solid fa-user-gear text-emerald-600 dark:text-emerald-400"></i>
              Personal Profile
            </h3>
            
            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 md:mb-3 ml-2">Full Name</label>
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold text-slate-700 dark:text-slate-200 shadow-inner outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 md:mb-3 ml-2">Email Address</label>
                  <div className="px-6 py-4 bg-slate-100 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-400 dark:text-slate-600 shadow-inner cursor-not-allowed text-sm truncate transition-colors">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 md:mb-4 ml-2">Profile Vibe</label>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setProfileData({...profileData, avatar: color})}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${color} transition-all relative ${profileData.avatar === color ? 'ring-4 ring-emerald-100 dark:ring-emerald-900 scale-105 md:scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                    >
                      {profileData.avatar === color && (
                        <i className="fa-solid fa-check text-white text-[10px] absolute inset-0 flex items-center justify-center"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 mb-6 md:mb-8 flex items-center gap-3">
              <i className="fa-solid fa-bell text-emerald-600 dark:text-emerald-400"></i>
              Notifications
            </h3>
            
            <div className="space-y-6">
              <Toggle 
                label="Reminders" 
                description="Notified 48h before due date."
                active={notifications.dueDate}
                onToggle={() => setNotifications({...notifications, dueDate: !notifications.dueDate})}
              />
              <Toggle 
                label="Verification" 
                description="Alerts on verification requests."
                active={notifications.verification}
                onToggle={() => setNotifications({...notifications, verification: !notifications.verification})}
              />
            </div>
          </section>
        </div>

        {/* Community Card */}
        <div className="space-y-6 md:space-y-8">
          <section className="bg-emerald-900 dark:bg-emerald-950 p-8 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden group transition-colors">
            <div className="relative z-10 text-center">
              <p className="text-[10px] font-black text-emerald-400 dark:text-emerald-500 uppercase tracking-[0.2em] mb-6">Community ID</p>
              
              <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] inline-block mb-6 md:mb-8 shadow-2xl">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center relative overflow-hidden transition-colors">
                  <div className="grid grid-cols-6 gap-2 opacity-5">
                    {[...Array(36)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-emerald-900' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${profileData.avatar} rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center`}>
                      <span className="text-white font-black text-xl">{profileData.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-white dark:text-slate-100 font-serif text-lg md:text-xl font-bold mb-1">{profileData.name}</h4>
              <p className="text-emerald-300/40 dark:text-emerald-600/40 text-[10px] font-medium mb-6 md:mb-8 uppercase tracking-widest">Amaanah Verified</p>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCopyLink}
                  className={`w-full py-4 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isCopied ? 'bg-emerald-400 text-emerald-950' : 'bg-white/10 dark:bg-white/5 text-white hover:bg-white/20 dark:hover:bg-white/10'}`}
                >
                  <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-link'} mr-2`}></i>
                  {isCopied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>
          </section>

          <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-colors">
            <h4 className="text-slate-800 dark:text-slate-200 font-black text-xs md:text-sm mb-2">Privacy Note</h4>
            <p className="text-slate-500 dark:text-slate-500 text-[10px] md:text-xs leading-relaxed font-medium">
              Sharing your ID link allows others to partner with you instantly. No financial details are ever shared publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, description, active, onToggle }: { label: string, description: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between group">
    <div className="flex-1 pr-4">
      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{label}</h4>
      <p className="text-slate-500 dark:text-slate-500 text-[10px] md:text-xs mt-0.5">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 md:w-14 md:h-8 rounded-full transition-all relative flex-shrink-0 ${active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 md:w-6 md:h-6 bg-white dark:bg-slate-300 rounded-full shadow-md transition-all ${active ? 'left-7 md:left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default Settings;
