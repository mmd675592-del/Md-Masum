
import React, { useState } from 'react';
import { Post, UserInfo } from '../types';

interface ShareToMessengerModalProps {
  post: Post;
  users: UserInfo[];
  onClose: () => void;
  onSend: (userId: string, post: Post) => void;
}

const ShareToMessengerModal: React.FC<ShareToMessengerModalProps> = ({ post, users, onClose, onSend }) => {
  const [search, setSearch] = useState('');
  const [sentUsers, setSentUsers] = useState<string[]>([]);

  const filteredUsers = users.filter(u => 
    u.id !== 'me' && u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (userId: string) => {
    onSend(userId, post);
    setSentUsers(prev => [...prev, userId]);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Send in Messenger</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search for friends" 
              className="w-full bg-gray-100 dark:bg-[#3a3b3c] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[400px] p-2">
          {filteredUsers.length > 0 ? (
            <div className="space-y-1">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-md object-cover border dark:border-gray-700" referrerPolicy="no-referrer" />
                      {user.isActive && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full"></div>}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => handleSend(user.id)}
                    disabled={sentUsers.includes(user.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      sentUsers.includes(user.id) 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-default' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                    }`}
                  >
                    {sentUsers.includes(user.id) ? 'Sent' : 'Send'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              <i className="fa-solid fa-user-slash text-3xl mb-2 opacity-20"></i>
              <p className="text-sm">No friends found</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-[#1c1d1e] border-t dark:border-gray-700">
          <div className={`flex items-center gap-3 p-2 bg-white dark:bg-[#242526] rounded-xl border dark:border-gray-700 ${sentUsers.length > 0 ? 'mb-3' : ''}`}>
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              {post.image && (post.image.startsWith('data:video/') || post.image.includes('.mp4')) ? (
                <video src={post.image} className="w-full h-full object-cover" />
              ) : (
                <img src={post.image || post.avatar} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{post.author}</p>
              <p className="text-[10px] text-gray-500 truncate leading-tight">{post.content || 'Shared a post'}</p>
            </div>
          </div>

          {sentUsers.length > 0 && (
            <button 
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-bottom-2"
            >
              <i className="fa-solid fa-arrow-left"></i>
              {post.id.startsWith('reel-') ? 'ভিডিওতে ফিরে যান (Back to Video)' : 'ফিরে যান (Back)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareToMessengerModal;
