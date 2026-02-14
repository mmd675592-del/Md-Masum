
import React, { useState, useEffect } from 'react';
import { ChatSettings } from '../types';

interface ChatInfoPageProps {
  friend: { id: string; name: string; avatar: string };
  settings: ChatSettings;
  onUpdateSettings: (newSettings: ChatSettings) => void;
  onBack: () => void;
  onNavigateToProfile?: (userId: string) => void;
}

const THEMES = [
  { name: 'Classic Blue', color: 'bg-gradient-to-br from-[#0084FF] to-[#A033FF]', circle: 'from-[#0084FF] to-[#A033FF]' },
  { name: 'Bijoy Green', color: 'bg-gradient-to-br from-green-600 to-emerald-400', circle: 'from-green-600 to-emerald-400' },
  { name: 'Lavender Pop', color: 'bg-gradient-to-br from-[#A033FF] to-[#FF52FF]', circle: 'from-[#A033FF] to-[#FF52FF]' },
  { name: 'Cyberpunk', color: 'bg-gradient-to-br from-[#FF00FF] to-[#00FFFF]', circle: 'from-[#FF00FF] to-[#00FFFF]' },
  { name: 'Sunset Glow', color: 'bg-gradient-to-br from-[#FF5F6D] to-[#FFC371]', circle: 'from-[#FF5F6D] to-[#FFC371]' },
  { name: 'Midnight', color: 'bg-[#1c1e21]', circle: 'from-[#1c1e21] to-[#3a3b3c]' },
];

const ChatInfoPage: React.FC<ChatInfoPageProps> = ({ friend, settings, onUpdateSettings, onBack, onNavigateToProfile }) => {
  const [activeScreen, setActiveScreen] = useState<'main' | 'theme' | 'nicknames'>('main');
  const [editingNickname, setEditingNickname] = useState<'me' | 'friend' | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  
  const now = Date.now();
  const isNoteActive = settings.note && settings.noteCreatedAt && (now - settings.noteCreatedAt < 24 * 60 * 60 * 1000);
  
  useEffect(() => {
    if (settings.note && settings.noteCreatedAt && (now - settings.noteCreatedAt >= 24 * 60 * 60 * 1000)) {
      onUpdateSettings({ ...settings, note: undefined, noteCreatedAt: undefined });
    }
  }, []);

  const handleSaveNote = () => {
    if (noteInput.trim().length === 0 || isNoteActive) return;
    onUpdateSettings({ 
      ...settings, 
      note: noteInput.slice(0, 101), 
      noteCreatedAt: Date.now() 
    });
    setNoteInput('');
  };

  const handleSaveNickname = () => {
    if (editingNickname === 'me') {
      onUpdateSettings({ ...settings, myNickname: nicknameInput });
    } else if (editingNickname === 'friend') {
      onUpdateSettings({ ...settings, friendNickname: nicknameInput });
    }
    setEditingNickname(null);
    setNicknameInput('');
  };

  const getTimeRemaining = () => {
    if (!settings.noteCreatedAt) return '';
    const remaining = (24 * 60 * 60 * 1000) - (now - settings.noteCreatedAt);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const toggleBlock = () => {
    onUpdateSettings({ ...settings, isBlocked: !settings.isBlocked });
  };

  const handleProfileClick = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile(friend.id);
    }
  };

  const headerTitle = activeScreen === 'main' ? 'Chat Settings' : activeScreen === 'theme' ? 'Themes' : 'Nicknames';

  return (
    <div className="fixed inset-0 z-[220] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => activeScreen === 'main' ? onBack() : setActiveScreen('main')} 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{headerTitle}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeScreen === 'main' && (
          <>
            {/* Profile Card */}
            <div className="flex flex-col items-center py-8 bg-gray-50/30 dark:bg-black/10 border-b dark:border-gray-800">
              <div 
                onClick={handleProfileClick}
                className="w-28 h-28 rounded-3xl border-4 border-white dark:border-[#242526] shadow-2xl overflow-hidden mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-all relative p-0.5 bg-gray-100 dark:bg-gray-800"
              >
                <img src={friend.avatar} className="w-full h-full object-cover rounded-[22px]" alt={friend.name} />
              </div>
              <h3 onClick={handleProfileClick} className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight cursor-pointer hover:text-green-600 transition-colors">
                {settings.friendNickname || friend.name}
              </h3>
              <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-[0.2em] mt-1">Messenger User</p>
              
              <div className="flex gap-4 mt-6">
                 <button onClick={handleProfileClick} className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border dark:border-gray-700">
                    <i className="fa-solid fa-user"></i>
                 </button>
                 <button className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 border dark:border-gray-700"><i className="fa-solid fa-bell"></i></button>
                 <button className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 border dark:border-gray-700"><i className="fa-solid fa-magnifying-glass"></i></button>
              </div>
            </div>

            <div className="p-4 space-y-8">
              {/* Customization Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <i className="fa-solid fa-palette text-blue-500"></i>
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Customization</p>
                </div>
                <div className="bg-white dark:bg-[#242526] rounded-2xl border dark:border-gray-800 shadow-sm divide-y dark:divide-gray-800">
                  <button 
                    onClick={() => setActiveScreen('theme')}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl shadow-inner ${settings.themeColor} border-2 border-white dark:border-gray-800`}></div>
                      <div className="text-left">
                        <span className="font-bold text-gray-900 dark:text-gray-100 block text-sm">Theme</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
                  </button>
                  <button 
                    onClick={() => setActiveScreen('nicknames')}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-600">
                        <i className="fa-solid fa-font"></i>
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-gray-900 dark:text-gray-100 block text-sm">Nicknames</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
                  </button>
                </div>
              </section>

              {/* Private Note Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <i className="fa-solid fa-note-sticky text-yellow-500"></i>
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Private Note</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border-2 border-green-100 dark:border-green-800 shadow-sm">
                  {isNoteActive ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-[#18191a] rounded-2xl border-l-4 border-green-500 shadow-md">
                        <p className="text-[15px] font-bold text-gray-800 dark:text-gray-200">"{settings.note}"</p>
                      </div>
                      <div className="flex justify-between text-[10px] font-black text-green-600 uppercase">
                        <span><i className="fa-solid fa-lock"></i> Locked</span>
                        <span>{getTimeRemaining()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea 
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value.slice(0, 101))}
                        placeholder="Write a note... (101 characters)"
                        className="w-full bg-white dark:bg-[#18191a] p-4 rounded-2xl border-2 border-transparent focus:border-green-500 outline-none text-sm font-bold resize-none min-h-[110px]"
                      />
                      <button 
                        onClick={handleSaveNote}
                        disabled={!noteInput.trim()}
                        className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 disabled:opacity-50"
                      >
                        Save Note
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Privacy Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <i className="fa-solid fa-shield-halved text-red-500"></i>
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Privacy & Safety</p>
                </div>
                <div className="bg-white dark:bg-[#242526] rounded-2xl border dark:border-gray-800 overflow-hidden divide-y dark:divide-gray-800">
                  <button 
                    onClick={toggleBlock}
                    className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${settings.isBlocked ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.isBlocked ? 'bg-green-50' : 'bg-red-50'}`}>
                        <i className={`fa-solid ${settings.isBlocked ? 'fa-user-check' : 'fa-user-slash'}`}></i>
                      </div>
                      <span className="font-bold text-sm">{settings.isBlocked ? 'Unblock User' : 'Block User'}</span>
                    </div>
                  </button>
                </div>
              </section>
            </div>
          </>
        )}

        {activeScreen === 'theme' && (
          <div className="p-4 grid grid-cols-3 gap-6">
            {THEMES.map(t => (
              <button 
                key={t.name}
                onClick={() => { onUpdateSettings({...settings, themeColor: t.color}); setActiveScreen('main'); }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${t.circle} border-4 transition-all ${settings.themeColor === t.color ? 'border-green-500 scale-110' : 'border-white dark:border-gray-700 shadow-md'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${settings.themeColor === t.color ? 'text-green-600' : 'text-gray-400'}`}>{t.name}</span>
              </button>
            ))}
          </div>
        )}

        {activeScreen === 'nicknames' && (
          <div className="p-4 space-y-2">
            <button 
              onClick={() => { setEditingNickname('friend'); setNicknameInput(settings.friendNickname || friend.name); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <img src={friend.avatar} className="w-12 h-12 rounded-xl object-cover" />
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{settings.friendNickname || friend.name}</p>
                  <p className="text-xs text-gray-500">Set nickname</p>
                </div>
              </div>
              <i className="fa-solid fa-pen text-gray-300 text-sm"></i>
            </button>
            <button 
              onClick={() => { setEditingNickname('me'); setNicknameInput(settings.myNickname || 'Bijoy'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?u=me" className="w-12 h-12 rounded-xl object-cover" />
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{settings.myNickname || 'Bijoy'}</p>
                  <p className="text-xs text-gray-500">Set nickname</p>
                </div>
              </div>
              <i className="fa-solid fa-pen text-gray-300 text-sm"></i>
            </button>
          </div>
        )}
      </div>

      {/* Nickname Editor Modal */}
      {editingNickname && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in" onClick={() => setEditingNickname(null)}>
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6 text-center">Edit Nickname</h3>
            <div className="space-y-4">
              <input 
                autoFocus
                type="text" 
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Enter nickname..."
                className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-green-500 outline-none font-bold"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingNickname(null)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNickname}
                  className="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="py-8 text-center">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">Bijoy Social Secure</p>
      </div>
    </div>
  );
};

export default ChatInfoPage;
