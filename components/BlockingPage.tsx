
import React, { useState, useMemo } from 'react';
import { UserInfo } from '../types';

interface BlockingPageProps {
  onBack: () => void;
  allUsers: Record<string, UserInfo>;
  onFriendshipAction: (userId: string, action: 'send' | 'accept' | 'delete' | 'cancel' | 'block' | 'unblock') => void;
}

const BlockingPage: React.FC<BlockingPageProps> = ({ onBack, allUsers, onFriendshipAction }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const blockedUsers = useMemo(() => {
    return (Object.values(allUsers) as UserInfo[]).filter(u => u.friendshipStatus === 'blocked');
  }, [allUsers]);

  const friendsToBlock = useMemo(() => {
    return (Object.values(allUsers) as UserInfo[]).filter(u => 
      u.id !== 'me' && 
      u.friendshipStatus === 'friends' &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allUsers, searchQuery]);

  return (
    <div className="fixed inset-0 z-[300] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 bg-white dark:bg-[#242526] sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Blocking</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Blocked people</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Once you block someone, that person can no longer see things you post on your timeline, tag you, invite you to events or groups, start a conversation with you, or add you as a friend.
          </p>
          
          <div className="space-y-3">
            {blockedUsers.length > 0 ? (
              blockedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} referrerPolicy="no-referrer" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => onFriendshipAction(user.id, 'unblock')}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 italic text-sm">
                No blocked users
              </div>
            )}
          </div>
        </div>

        <div className="border-t dark:border-gray-800 pt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Block a friend</h3>
          
          <div className="relative mb-4">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search friends to block..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            {friendsToBlock.length > 0 ? (
              friendsToBlock.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} referrerPolicy="no-referrer" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to block ${user.name}?`)) {
                        onFriendshipAction(user.id, 'block');
                      }
                    }}
                    className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Block
                  </button>
                </div>
              ))
            ) : (
              searchQuery && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No friends found matching "{searchQuery}"
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockingPage;
