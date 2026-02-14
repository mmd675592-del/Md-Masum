
import React, { useState, useEffect, useRef } from 'react';
import { UserInfo } from '../types';

interface SearchOverlayProps {
  onClose: () => void;
  users: UserInfo[];
  onNavigateToProfile: (userId: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, users, onNavigateToProfile }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredUsers = query.trim() === '' 
    ? [] 
    : users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelectUser = (user: UserInfo) => {
    addToRecent(user.name);
    onNavigateToProfile(user.id);
    onClose();
  };

  const addToRecent = (name: string) => {
    const newRecent = [name, ...recentSearches.filter(s => s !== name)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecent = (name: string) => {
    const newRecent = recentSearches.filter(s => s !== name);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-[#18191a] animate-in fade-in duration-200 flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center border border-transparent focus-within:border-green-500 focus-within:bg-white dark:focus-within:bg-[#242526] transition-all">
          <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3 text-sm"></i>
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search on Bijoy" 
            className="w-full bg-transparent outline-none text-[15px] font-semibold text-gray-900 dark:text-gray-100"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-[#18191a]">
        {query.trim() === '' ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Recent searches</h3>
              <button onClick={clearRecent} className="text-green-600 text-sm font-bold hover:underline">Edit</button>
            </div>
            
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((s, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <button 
                      onClick={() => setQuery(s)}
                      className="flex items-center gap-4 flex-1 py-2"
                    >
                      <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                        <i className="fa-solid fa-clock-rotate-left text-sm"></i>
                      </div>
                      <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">{s}</span>
                    </button>
                    <button onClick={() => removeRecent(s)} className="p-2 text-gray-400 hover:text-gray-600 group-hover:block">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-10">No recent searches</p>
            )}
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-800">
            {filteredUsers.length > 0 ? filteredUsers.map(user => (
              <div 
                key={user.id} 
                onClick={() => handleSelectUser(user)}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{user.name}</h4>
                  <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">
                    {user.friendshipStatus === 'friends' ? 'Friend' : user.district || 'Bijoy User'}
                  </p>
                </div>
                <i className="fa-solid fa-magnifying-glass text-gray-300 text-xs"></i>
              </div>
            )) : (
              <div className="p-10 text-center">
                <i className="fa-solid fa-user-slash text-4xl text-gray-200 mb-4"></i>
                <p className="text-gray-500 font-medium">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
