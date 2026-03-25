import React from 'react';
import { UserInfo } from '../types';

interface GeneralSettingsProps {
  userInfo: UserInfo;
  onBack: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ userInfo, onBack }) => {
  return (
    <div className="fixed inset-0 z-[250] bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#242526] z-10 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Account</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Update your info to keep your account secure.</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Personal and account information</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{userInfo.name}</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Password and security</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Payments</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Preferences</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize your experience on Bijoy.</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-language text-gray-500 text-lg w-6 text-center"></i>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Language and region</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-clock text-gray-500 text-lg w-6 text-center"></i>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Your time on Bijoy</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-play text-gray-500 text-lg w-6 text-center"></i>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Media</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeneralSettings;
