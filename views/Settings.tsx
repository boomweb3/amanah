
import React, { useState } from 'react';
import { User } from '../types';
import GeneratedAvatar from '../components/GeneratedAvatar';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser }) => {
  const [profileData, setProfileData] = useState({
    name: currentUser.name
  });

  const [notifications, setNotifications] = useState({
    dueDate: true,
    verification: true
  });

  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/u/${currentUser.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      onUpdateUser({
        ...currentUser,
        name: profileData.name
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg font-medium">Manage your professional identity.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 ${
            saveStatus === 'saved' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-emerald-800 dark:bg-emerald-600 text-white hover:bg-emerald-900 dark:hover:bg-emerald-500'
          }`}
        >
          {saveStatus === 'saving' ? 'Updating...' : saveStatus === 'saved' ? 'Updated!' : 'Apply Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
              <i className="fa-solid fa-user-circle text-accent-text"></i>
              Personal Information
            </h3>
            
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Public Name</label>
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-accent-primary rounded-2xl font-bold text-slate-700 dark:text-slate-200 shadow-inner outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Account ID</label>
                  <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-400 dark:text-slate-600 shadow-inner cursor-not-allowed truncate">
                    {currentUser.id}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
              <i className="fa-solid fa-bell text-accent-text"></i>
              Privacy & Notifications
            </h3>
            <div className="space-y-8">
              <Toggle 
                label="Trust Reminders" 
                description="Receive alerts for upcoming commitments."
                active={notifications.dueDate}
                onToggle={() => setNotifications({...notifications, dueDate: !notifications.dueDate})}
              />
              <Toggle 
                label="Partner Alerts" 
                description="Instant notifications for verification requests."
                active={notifications.verification}
                onToggle={() => setNotifications({...notifications, verification: !notifications.verification})}
              />
            </div>
          </section>
        </div>

        {/* Live Preview / Identifier Card */}
        <div className="space-y-8 lg:sticky lg:top-12">
          <section className="bg-slate-900 dark:bg-black p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 relative z-10">Unique Identifier</p>
            <div className="relative z-10 mb-8 inline-block">
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                <GeneratedAvatar seed={currentUser.id} size="xl" />
              </div>
            </div>
            <h4 className="text-white font-serif text-2xl font-bold mb-1 relative z-10">{profileData.name}</h4>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 relative z-10">Community Member</p>
            <button 
              onClick={handleCopyLink}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isCopied ? 'bg-emerald-400 text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-link'} mr-2`}></i>
              {isCopied ? 'ID Link Copied' : 'Copy Profile Link'}
            </button>
          </section>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-shield-halved text-accent-text text-xs"></i>
              <h4 className="text-slate-800 dark:text-slate-200 font-black text-xs uppercase tracking-widest">Amanah Security</h4>
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-[10px] leading-relaxed font-medium">
              Your pattern is generated from your account ID. It is your visual fingerprint within the network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, description, active, onToggle }: { label: string, description: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between group py-2">
    <div className="flex-1 pr-6">
      <h4 className="font-bold text-slate-800 dark:text-slate-200">{label}</h4>
      <p className="text-slate-500 text-xs mt-0.5">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-7 rounded-full transition-all relative flex-shrink-0 active:scale-95 ${active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${active ? 'left-8' : 'left-1'}`}></div>
    </button>
  </div>
);

export default Settings;
