
import React, { useRef } from 'react';

interface StatusUpdateProps {
  onImageSelect: (file: File) => void;
  onOpenCreatePost: (openFeeling?: boolean) => void;
  onProfileClick?: () => void;
  profilePic?: string;
  activeStatus?: boolean;
}

const StatusUpdate: React.FC<StatusUpdateProps> = ({ onImageSelect, onOpenCreatePost, onProfileClick, profilePic, activeStatus = true }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const currentAvatar = profilePic || "https://i.pravatar.cc/150?u=me";

  return (
    <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-800 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        {/* User Avatar with verified/active status dot - respects activeStatus toggle */}
        <div className="relative flex-shrink-0 cursor-pointer group" onClick={onProfileClick}>
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800 group-hover:ring-2 ring-green-500 transition-all">
            <img src={currentAvatar} alt="My Profile" className="w-full h-full object-cover" />
          </div>
          {activeStatus && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full"></div>
          )}
        </div>

        {/* Locked Post Input Bar */}
        <button 
          onClick={() => onOpenCreatePost(false)}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full py-2.5 px-5 text-left text-gray-600 dark:text-gray-400 transition-all text-sm font-medium flex items-center justify-between group"
        >
          <span className="group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">What's on your mind, Bijoy?</span>
          <i className="fa-solid fa-lock text-[10px] text-gray-400 opacity-60"></i>
        </button>
      </div>
      
      <div className="border-t dark:border-gray-800 pt-3 flex items-center justify-between">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-red-500">
          <i className="fa-solid fa-video text-sm"></i>
          <span className="text-gray-600 dark:text-gray-300 font-bold text-[11px]">Live Video</span>
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-green-500"
        >
          <i className="fa-solid fa-images text-sm"></i>
          <span className="text-gray-600 dark:text-gray-300 font-bold text-[11px]">Photo/Video</span>
        </button>
        <button 
          onClick={() => onOpenCreatePost(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-yellow-500"
        >
          <i className="fa-solid fa-face-smile text-sm"></i>
          <span className="text-gray-600 dark:text-gray-300 font-bold text-[11px]">Feeling</span>
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden"
      />
    </div>
  );
};

export default StatusUpdate;
