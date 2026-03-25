
import React, { useState } from 'react';
import NotificationList from './NotificationList';

interface HeaderProps {
  onNavigateToProfile?: (userId: string) => void;
  onRefresh?: () => void;
  onOpenSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToProfile, onRefresh, onOpenSearch }) => {
  const [showNotifOptions, setShowNotifOptions] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleOpenNotifs = () => {
    setShowNotifs(true);
    setShowNotifOptions(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Clickable to Refresh with National Colors */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <h1 
              onClick={onRefresh}
              className="text-2xl font-black tracking-tighter transition-transform active:scale-95 flex items-center cursor-pointer"
            >
              <span className="text-green-600">Bi</span>
              <span className="text-red-500">joy</span>
            </h1>
            <span className="text-xl" title="Palestine Flag">🇵🇸</span>
          </div>
          <div className="text-[10px] font-bold text-green-700 dark:text-green-500 leading-none mt-0.5 opacity-80 select-none" style={{ fontFamily: 'serif' }}>
            لا إله إلا الله محمد رسول الله
          </div>
        </div>
        
        {/* Action Icons with White Background on Green */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 relative">
          <button 
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </button>
          <div className="relative">
            <button 
              onClick={handleOpenNotifs}
              className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <i className="fa-solid fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-[#242526] font-black shadow-lg">3</span>
            </button>
          </div>
          
          {/* Notification Overlay */}
          {showNotifs && (
            <div className="fixed inset-0 z-[100] bg-white dark:bg-[#18191a] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
              <NotificationList 
                onClose={() => setShowNotifs(false)} 
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
