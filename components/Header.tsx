
import React, { useState } from 'react';
import NotificationList from './NotificationList';

interface HeaderProps {
  onNavigateToProfile?: (userId: string) => void;
  onRefresh?: () => void;
  onOpenSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToProfile, onRefresh, onOpenSearch }) => {
  const [showNotifOptions, setShowNotifOptions] = useState(false);
  const [activeNotifType, setActiveNotifType] = useState<'all' | 'muted' | null>(null);

  const handleOpenNotifs = (type: 'all' | 'muted') => {
    setActiveNotifType(type);
    setShowNotifOptions(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-green-600 dark:bg-[#242526] border-b border-green-700 dark:border-gray-800 shadow-lg transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Clickable to Refresh with National Colors */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={onRefresh}>
          <h1 className="text-2xl font-black tracking-tighter transition-transform active:scale-95 flex items-center">
            <span className="text-white">Bi</span>
            <span className="text-red-500">joy</span>
          </h1>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-all shadow-inner">
             <i className="fa-solid fa-bat-ball text-lg"></i>
          </div>
        </div>
        
        {/* Action Icons with White Background on Green */}
        <div className="flex items-center gap-3 text-white relative">
          <button 
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowNotifOptions(!showNotifOptions)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${showNotifOptions ? 'bg-white text-green-600' : 'hover:bg-white/20'}`}
            >
              <i className="fa-solid fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-green-600 font-black shadow-lg">3</span>
            </button>

            {/* Notification Selection Menu */}
            {showNotifOptions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifOptions(false)}></div>
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-gray-400">
                    <p className="text-[10px] font-black uppercase tracking-widest">Updates</p>
                  </div>
                  <button 
                    onClick={() => handleOpenNotifs('all')}
                    className="w-full px-4 py-4 text-left flex items-center gap-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-bell"></i>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">All Notifications</span>
                      <span className="text-[10px] text-gray-500">View your activity</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleOpenNotifs('muted')}
                    className="w-full px-4 py-4 text-left flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-bell-slash"></i>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Muted Items</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Notification Overlay */}
          {activeNotifType && (
            <div className="fixed inset-0 z-[100] bg-white dark:bg-[#18191a] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
              <NotificationList 
                isMutedOnly={activeNotifType === 'muted'}
                onClose={() => setActiveNotifType(null)} 
                onNavigateToProfile={onNavigateToProfile}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
