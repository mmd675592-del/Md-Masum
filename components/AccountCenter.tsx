
import React, { useState } from 'react';
import { UserInfo } from '../types';

interface AccountCenterProps {
  userInfo: UserInfo;
  onBack: () => void;
  onUpdateUserInfo?: (info: Partial<UserInfo>) => void;
}

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

const AccountCenter: React.FC<AccountCenterProps> = ({ userInfo, onBack, onUpdateUserInfo }) => {
  const [activeScreen, setActiveScreen] = useState<'main' | 'personal_details' | 'name_change' | 'ownership'>('main');
  const [newName, setNewName] = useState(userInfo.name);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const timeSinceLastChange = Date.now() - userInfo.nameLastChanged;
  const canChangeName = timeSinceLastChange > SIXTY_DAYS_MS;
  const daysRemaining = Math.ceil((SIXTY_DAYS_MS - timeSinceLastChange) / (24 * 60 * 60 * 1000));

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateName = () => {
    if (!canChangeName) {
      showToast(`You can't change your name yet. Wait ${daysRemaining} more days.`, 'error');
      return;
    }
    if (newName.trim().length < 2) {
      showToast("Name is too short.", 'error');
      return;
    }
    onUpdateUserInfo?.({ name: newName, nameLastChanged: Date.now() });
    showToast("Name updated successfully!");
    setActiveScreen('main');
  };

  const renderHeader = (title: string, backTo: 'main' | 'personal_details' | 'root') => (
    <div className="p-4 border-b dark:border-gray-800 bg-white dark:bg-[#242526] sticky top-0 z-10 flex items-center gap-4">
      <button 
        onClick={() => backTo === 'root' ? onBack() : setActiveScreen(backTo)} 
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
      >
        <i className="fa-solid fa-arrow-left text-xl"></i>
      </button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[250] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      {activeScreen === 'main' && (
        <>
          {renderHeader("THT Center", 'root')}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30 dark:bg-[#18191a]">
            {/* THT Brand Logo */}
            <div className="flex flex-col items-center py-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl mb-3 transform -rotate-3 border border-white/20">
                <span className="text-2xl font-black italic tracking-tighter -rotate-3">THT</span>
              </div>
              <h3 className="font-black text-gray-900 dark:text-gray-100 text-lg uppercase tracking-tight">THT Center</h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 px-2 leading-relaxed text-center">
              Manage your account settings, security and privacy across the THT ecosystem.
            </p>

            {/* Profile Selection - Updated to Square Shape */}
            <section className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <h4 className="px-4 pt-4 text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase">Profiles</h4>
              <div 
                onClick={() => setActiveScreen('personal_details')}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm">
                  <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{userInfo.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Bijoy User</p>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-sm"></i>
              </div>
            </section>

            {/* Account Settings */}
            <section className="space-y-4">
               <h4 className="px-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase">Account settings</h4>
               <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
                 <div onClick={() => setActiveScreen('personal_details')} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                   <i className="fa-solid fa-user-shield w-6 text-gray-400 dark:text-gray-500 text-lg"></i>
                   <span className="flex-1 text-[15px] font-medium text-gray-800 dark:text-gray-200">Personal details</span>
                   <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-sm"></i>
                 </div>
                 <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                   <i className="fa-solid fa-shield-halved w-6 text-gray-400 dark:text-gray-500 text-lg"></i>
                   <span className="flex-1 text-[15px] font-medium text-gray-800 dark:text-gray-200">Password and security</span>
                   <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-sm"></i>
                 </div>
                 <div onClick={() => setActiveScreen('ownership')} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                   <i className="fa-solid fa-id-card-clip w-6 text-gray-400 dark:text-gray-500 text-lg"></i>
                   <span className="flex-1 text-[15px] font-medium text-gray-800 dark:text-gray-200">Account ownership and control</span>
                   <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-sm"></i>
                 </div>
               </div>
            </section>
          </div>
        </>
      )}

      {activeScreen === 'personal_details' && (
        <>
          {renderHeader("Personal details", 'main')}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-[#18191a]">
             <div onClick={() => setActiveScreen('name_change')} className="bg-white dark:bg-[#242526] p-4 rounded-2xl border dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
               <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Name</p>
                 <p className="font-bold text-gray-900 dark:text-gray-100">{userInfo.name}</p>
               </div>
               <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600"></i>
             </div>
             <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border dark:border-gray-800">
               <p className="text-xs font-bold text-gray-400 uppercase">Contact info</p>
               <p className="font-bold text-gray-900 dark:text-gray-100">bijoy.user@example.com</p>
             </div>
             <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border dark:border-gray-800">
               <p className="text-xs font-bold text-gray-400 uppercase">Birthday</p>
               <p className="font-bold text-gray-900 dark:text-gray-100">January 1, 1995</p>
             </div>
          </div>
        </>
      )}

      {activeScreen === 'name_change' && (
        <>
          {renderHeader("Name", 'personal_details')}
          <div className="flex-1 p-4 space-y-6 dark:bg-[#18191a]">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  If you change your name on Bijoy, you can't change it again for **60 days**. Don't add any unusual capitalization, punctuation, characters or random words.
                </p>
              </div>

              {!canChangeName && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-2xl">
                  <p className="text-xs text-orange-800 dark:text-orange-300 font-bold">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                    You changed your name recently. You can change it again in {daysRemaining} days.
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={handleUpdateName}
              disabled={!canChangeName || newName === userInfo.name}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 
                ${canChangeName && newName !== userInfo.name ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
            >
              Review Change
            </button>
          </div>
        </>
      )}

      {activeScreen === 'ownership' && (
        <>
          {renderHeader("Ownership and control", 'main')}
          <div className="flex-1 p-4 space-y-4 dark:bg-[#18191a]">
             <div className="p-4 bg-white dark:bg-[#242526] rounded-2xl border dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer transition-colors group">
               <div className="flex items-center justify-between mb-2">
                 <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-700 transition-colors">Deactivation or deletion</h4>
                 <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600"></i>
               </div>
               <p className="text-sm text-gray-500 dark:text-gray-400">Temporarily deactivate or permanently delete your account.</p>
               
               <div className="mt-6 space-y-3">
                 <button className="w-full py-3 border-2 border-gray-100 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Deactivate Account</button>
                 <button 
                   onClick={() => showToast("Deletion request sent. You have 120 days to cancel this request.", "success")}
                   className="w-full py-3 border-2 border-red-100 border-red-900 rounded-xl font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                 >
                   Delete Account Permanently
                 </button>
               </div>
             </div>

             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
               <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                 <i className="fa-solid fa-shield-halved mr-2"></i>
                 Deleting your account is permanent. When you delete your Bijoy account, you won't be able to retrieve the content or information you've shared. We will keep your data for **120 days** before permanent removal.
               </p>
             </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-full text-white font-bold shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AccountCenter;
