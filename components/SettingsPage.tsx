
import React, { useState } from 'react';
import { UserInfo } from '../types';
import AccountCenter from './AccountCenter';
import NotificationList from './NotificationList';

interface SettingsPageProps {
  onBack: () => void;
  userInfo: UserInfo;
  onLogout?: () => void;
  onEditProfile?: () => void;
  onUpdateUserInfo?: (info: Partial<UserInfo>) => void;
  onNavigateToNotifications?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenSaved?: () => void;
  onOpenVerification?: () => void;
  activeStatusEnabled?: boolean;
  onToggleActiveStatus?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  onBack, userInfo, onLogout, onEditProfile, onUpdateUserInfo, onNavigateToNotifications,
  isDarkMode, onToggleDarkMode, onOpenSaved, onOpenVerification,
  activeStatusEnabled, onToggleActiveStatus
}) => {
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [showNotifList, setShowNotifList] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  if (showAccountCenter) {
    return (
      <AccountCenter 
        userInfo={userInfo} 
        onBack={() => setShowAccountCenter(false)} 
        onUpdateUserInfo={onUpdateUserInfo}
      />
    );
  }

  if (showNotifList) {
    return (
      <div className="fixed inset-0 z-[250] bg-white dark:bg-[#18191a] animate-in slide-in-from-right duration-300">
        <NotificationList 
          onClose={() => setShowNotifList(false)}
          onNavigateToProfile={(uid) => {
            setShowNotifList(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 bg-white dark:bg-[#242526] sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings & Privacy</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Section */}
        <div className="p-4 bg-white dark:bg-[#242526] mb-4 shadow-sm active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer" onClick={onEditProfile}>
          <div className="flex items-center gap-4 p-2 rounded-xl transition-colors group">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white dark:border-[#242526] rounded-full ${activeStatusEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">{userInfo.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile & info</p>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-lg group-hover:text-green-600 transition-colors"></i>
          </div>
        </div>

        {/* Install Section - NEW */}
        <div className="mx-4 mb-4 p-4 bg-green-600 rounded-2xl shadow-lg border border-green-500 flex items-center justify-between text-white" onClick={() => setShowInstallGuide(true)}>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><i className="fa-solid fa-download text-lg"></i></div>
             <div>
               <p className="font-black text-sm uppercase tracking-tight">Install Bijoy App</p>
               <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Add to your home screen</p>
             </div>
          </div>
          <i className="fa-solid fa-chevron-right text-white/50"></i>
        </div>

        {/* THT Center */}
        <div className="mx-4 mb-6 p-4 bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden">
              <span className="text-[10px] font-black italic tracking-tighter">THT</span>
            </div>
            <h4 className="font-bold text-[15px] text-gray-900 dark:text-gray-100">THT Center</h4>
          </div>
          <button 
            onClick={() => setShowAccountCenter(true)}
            className="w-full mt-4 py-2.5 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            See more in THT Center
          </button>
        </div>

        {/* Categories Section */}
        <div className="space-y-6 px-4">
          <section>
            <h5 className="px-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Preferences</h5>
            <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800 overflow-hidden">
              <div 
                onClick={() => setShowNotifList(true)}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <i className="fa-solid fa-bell text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">Notifications</p>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
              </div>
              
              <div 
                onClick={onOpenSaved}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <i className="fa-solid fa-bookmark text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">Saved</p>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
              </div>

              {/* Active Status Row */}
              <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={onToggleActiveStatus}>
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-circle-dot text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">Active Status</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{activeStatusEnabled ? 'On' : 'Off'}</p>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 relative transition-colors ${activeStatusEnabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${activeStatusEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={onToggleDarkMode}>
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                  <i className="fa-solid fa-moon text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">Dark Mode</p>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 relative transition-colors ${isDarkMode ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button 
              onClick={onLogout}
              className="w-full py-4 bg-white dark:bg-[#242526] text-red-600 dark:text-red-400 font-bold rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Log Out
            </button>
            <p className="mt-8 text-center text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.3em]">
              Bijoy Social • Version 2.8.5
            </p>
          </div>
        </div>
      </div>

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowInstallGuide(false)}>
           <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
             <div className="flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-3xl flex items-center justify-center text-green-600 mb-6">
                 <i className="fa-solid fa-mobile-screen-button text-4xl"></i>
               </div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-tighter">Install Bijoy</h3>
               <div className="space-y-6 text-left w-full">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">১</div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">ব্রাউজারের <span className="text-gray-900 dark:text-gray-100 font-black">তিনটি ডট (⋮)</span> মেনুতে ক্লিক করুন।</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">২</div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400"><span className="text-gray-900 dark:text-gray-100 font-black">'Add to Home Screen'</span> অপশনটি বেছে নিন।</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">৩</div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">এখন বিজয় অ্যাপ আপনার ফোনের <span className="text-gray-900 dark:text-gray-100 font-black">হোম স্ক্রিনে</span> আইকন হিসেবে চলে আসবে!</p>
                 </div>
               </div>
               <button 
                onClick={() => setShowInstallGuide(false)}
                className="mt-8 w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest"
               >
                 ঠিক আছে
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
