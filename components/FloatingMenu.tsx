
import React, { useState } from 'react';

interface FloatingMenuProps {
  onOpenMessenger?: () => void;
  onOpenRequests?: () => void;
  onOpenHome?: () => void;
  onOpenFriends?: () => void;
  onOpenSettings?: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ 
  onOpenMessenger, onOpenRequests, onOpenHome, onOpenSettings 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Circular Arc Layout for 4 items:
   * 1. Messenger (Top)
   * 2. Requests (Top-Left) - Updated to exact FB style silhouette
   * 3. Settings (Left)
   * 4. Home (Bottom-Left)
   */
  const menuItems = [
    { id: 'messenger', icon: 'fa-brands fa-facebook-messenger', color: 'text-blue-600', x: -15, y: -115, label: 'Chat' },
    { id: 'requests', icon: 'fa-solid fa-user-group', color: 'text-blue-500', x: -90, y: -80, label: 'Friends' },
    { id: 'settings', icon: 'fa-solid fa-gear', color: 'text-gray-600', x: -115, y: -5, label: 'Settings' },
    { id: 'home', icon: 'fa-solid fa-house', color: 'text-orange-500', x: -85, y: 75, label: 'Home' },
  ];

  const handleItemClick = (id: string) => {
    setIsOpen(false);
    if (id === 'messenger' && onOpenMessenger) onOpenMessenger();
    if (id === 'requests' && onOpenRequests) onOpenRequests();
    if (id === 'settings' && onOpenSettings) onOpenSettings();
    if (id === 'home' && onOpenHome) onOpenHome();
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      {/* Background Overlay when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[3px] z-[-1] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <div 
          key={index}
          className="absolute transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform"
          style={{
            transform: isOpen 
              ? `translate(${item.x}px, ${item.y}px)` 
              : 'translate(0px, 0px)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transitionDelay: isOpen ? `${index * 40}ms` : '0ms'
          }}
        >
          <div className="flex flex-col items-center gap-1 group">
            <button
              onClick={() => handleItemClick(item.id)}
              className={`w-14 h-14 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] flex items-center justify-center border border-gray-50 transition-all active:scale-90 hover:scale-110 hover:shadow-2xl`}
            >
              <i className={`${item.icon} ${item.color} text-xl`}></i>
            </button>
            {isOpen && (
              <span className="text-[10px] font-bold uppercase text-gray-600 tracking-tighter bg-white/90 px-2 py-0.5 rounded-lg shadow-sm border border-gray-100 animate-in fade-in zoom-in-75 duration-300">
                {item.label}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Main Plus Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-10 w-16 h-16 rounded-full shadow-[0_15px_35px_rgba(22,163,74,0.35)] flex items-center justify-center text-white transition-all duration-500 active:scale-90
          ${isOpen ? 'rotate-45 bg-red-500 shadow-[0_15px_35px_rgba(239,68,68,0.35)]' : 'bg-green-600 hover:bg-green-700'}`}
      >
        <div className="relative">
          <i className="fa-solid fa-plus text-2xl"></i>
          {!isOpen && (
             <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce shadow-sm"></span>
          )}
        </div>
      </button>
    </div>
  );
};

export default FloatingMenu;
