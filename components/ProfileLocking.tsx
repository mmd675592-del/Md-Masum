import React from 'react';
import { UserInfo } from '../types';

interface ProfileLockingProps {
  userInfo: UserInfo;
  onUpdateUserInfo?: (info: Partial<UserInfo>) => void;
  onBack: () => void;
}

const ProfileLocking: React.FC<ProfileLockingProps> = ({ userInfo, onUpdateUserInfo, onBack }) => {
  const isLocked = userInfo.isProfileLocked;

  const handleToggleLock = () => {
    if (onUpdateUserInfo) {
      onUpdateUserInfo({ isProfileLocked: !isLocked });
    }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#242526] z-10 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile Locking</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
          <i className={`fa-solid ${isLocked ? 'fa-lock' : 'fa-unlock'} text-4xl`}></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isLocked ? 'Your profile is locked' : 'Lock your profile'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
          {isLocked 
            ? "Only your friends can see the photos, posts and stories on your profile."
            : "Make your photos and posts more private in one step. Only friends will see the photos, posts and stories on your profile."}
        </p>
        
        <div className="w-full max-w-sm space-y-4 text-left mb-8">
          <div className="flex gap-3 items-start">
            <i className="fa-solid fa-user-check text-indigo-600 dark:text-indigo-400 mt-1"></i>
            <p className="text-sm text-gray-700 dark:text-gray-300">Only friends will see the photos, posts and stories on your profile.</p>
          </div>
          <div className="flex gap-3 items-start">
            <i className="fa-solid fa-image text-indigo-600 dark:text-indigo-400 mt-1"></i>
            <p className="text-sm text-gray-700 dark:text-gray-300">Only friends will see your full-size profile picture and cover photo.</p>
          </div>
          <div className="flex gap-3 items-start">
            <i className="fa-solid fa-magnifying-glass text-indigo-600 dark:text-indigo-400 mt-1"></i>
            <p className="text-sm text-gray-700 dark:text-gray-300">People you're not friends with will see a maximum of 5 profile details.</p>
          </div>
        </div>

        <button 
          onClick={handleToggleLock}
          className="w-full max-w-sm py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
        >
          {isLocked ? 'Unlock Your Profile' : 'Lock Your Profile'}
        </button>
      </div>
    </div>
  );
};

export default ProfileLocking;
