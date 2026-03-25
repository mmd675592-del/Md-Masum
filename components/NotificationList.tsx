
import React, { useState } from 'react';

interface NotificationItemProps {
  id: string;
  userId: string;
  user: string;
  avatar: string;
  action: string;
  time: string;
  isRead: boolean;
  type: 'like' | 'comment' | 'share' | 'post' | 'mention';
  postId?: string;
  isMuted?: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItemProps[] = [
  {
    id: '1',
    userId: '2',
    user: 'MD ROHIT',
    avatar: 'https://i.pravatar.cc/150?u=rohit',
    action: 'loved your photo.',
    time: '2m',
    isRead: false,
    type: 'like',
    postId: 'p-me-1'
  },
  {
    id: 'mention-1',
    userId: '5',
    user: 'Sajib',
    avatar: 'https://i.pravatar.cc/150?u=sajib',
    action: 'mentioned you in a post: "Check this out @Me"',
    time: '5m',
    isRead: false,
    type: 'mention',
    postId: 'p-2'
  },
  {
    id: '2',
    userId: '1',
    user: 'Akash',
    avatar: 'https://i.pravatar.cc/150?u=akash',
    action: 'commented on your post: "Nice editing!"',
    time: '10m',
    isRead: false,
    type: 'comment',
    postId: 'p-me-1'
  },
  {
    id: '3',
    userId: '3',
    user: 'Runa',
    avatar: 'https://i.pravatar.cc/150?u=runa',
    action: 'shared your post on her timeline.',
    time: '1h',
    isRead: false,
    type: 'share',
    postId: 'p-me-1',
    isMuted: true
  },
  {
    id: '4',
    userId: '4',
    user: 'Farso',
    avatar: 'https://i.pravatar.cc/150?u=farso',
    action: 'posted a new update in the group.',
    time: '3h',
    isRead: true,
    type: 'post'
  },
  {
    id: '5',
    userId: '6',
    user: 'Mitu',
    avatar: 'https://i.pravatar.cc/150?u=mitu',
    action: 'liked your profile picture.',
    time: '5h',
    isRead: true,
    type: 'like',
    isMuted: true
  }
];

interface NotificationListProps {
  onClose: () => void;
  onNavigateToProfile?: (userId: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose, onNavigateToProfile }) => {
  const [notifs, setNotifs] = useState<NotificationItemProps[]>(INITIAL_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItemProps | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mention'>('all');

  const filteredNotifs = notifs.filter(n => {
    if (n.isMuted) return false;
    if (filter === 'unread') return !n.isRead;
    if (filter === 'mention') return n.type === 'mention';
    return true;
  });

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  const handleNotifClick = (notif: NotificationItemProps) => {
    setNotifs(notifs.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    if (notif.postId) {
      setSelectedNotif(notif);
    } else {
      onNavigateToProfile?.(notif.userId);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <i className="fa-solid fa-heart text-white text-[10px]"></i>;
      case 'comment': return <i className="fa-solid fa-comment text-white text-[10px]"></i>;
      case 'share': return <i className="fa-solid fa-share text-white text-[10px]"></i>;
      case 'mention': return <i className="fa-solid fa-at text-white text-[10px]"></i>;
      default: return <i className="fa-solid fa-bell text-white text-[10px]"></i>;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'like': return 'bg-pink-500';
      case 'comment': return 'bg-green-500';
      case 'share': return 'bg-purple-500';
      case 'mention': return 'bg-blue-500';
      default: return 'bg-green-600';
    }
  };

  if (selectedNotif) {
    return (
      <div className="flex flex-col h-full w-full bg-[#F0F2F5] dark:bg-[#18191a] animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b flex items-center bg-white dark:bg-[#242526] sticky top-0 z-10">
          <button onClick={() => setSelectedNotif(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-4">Post details</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden w-full max-w-lg mb-6">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="Me" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Your Post</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Just now seen by {selectedNotif.user}</p>
              </div>
            </div>
            <div className="p-4 pt-0">
               <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">This is the post {selectedNotif.user} {selectedNotif.action}</p>
            </div>
            <div className="aspect-video w-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border-t dark:border-gray-800">
               <img src="https://picsum.photos/seed/post1/800/600" className="w-full h-full object-cover" alt="Post" referrerPolicy="no-referrer" />
            </div>
            <div className="p-4 border-t dark:border-gray-800 flex items-center gap-3">
               <div className="flex -space-x-1">
                 <span className="text-sm">❤️</span>
                 <span className="text-sm">👍</span>
               </div>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{selectedNotif.user} and 12 others</p>
            </div>
          </div>
          
          <button 
            onClick={() => setSelectedNotif(null)}
            className="px-8 py-3 bg-white dark:bg-[#242526] text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Back to notifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full bg-white dark:bg-[#18191a]">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 flex items-center bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
        <button 
          onClick={onClose}
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <div className="flex-1">
           <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Notifications</h2>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filteredNotifs.length} items</p>
        </div>
        <button onClick={markAllRead} className="text-xs font-black text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 px-4 py-2 rounded-xl transition-colors uppercase tracking-widest border border-green-100 dark:border-green-900/30">
          Mark Read
        </button>
      </div>
      
      {/* Filter Tabs */}
      <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide border-b dark:border-gray-800 bg-gray-50/30 dark:bg-black/10">
        <button 
          onClick={() => setFilter('all')}
          className={`whitespace-nowrap px-4 py-2 font-bold rounded-xl text-xs uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white dark:bg-gray-800 text-gray-500 border dark:border-gray-700'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`whitespace-nowrap px-4 py-2 font-bold rounded-xl text-xs uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white dark:bg-gray-800 text-gray-500 border dark:border-gray-700'}`}
        >
          Unread
        </button>
        <button 
          onClick={() => setFilter('mention')}
          className={`whitespace-nowrap px-4 py-2 font-bold rounded-xl text-xs uppercase tracking-widest transition-all ${filter === 'mention' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white dark:bg-gray-800 text-gray-500 border dark:border-gray-700'}`}
        >
          Mention
        </button>
      </div>

      <div className="overflow-y-auto flex-1 bg-gray-50/50 dark:bg-[#18191a]">
        {filteredNotifs.length > 0 ? (
          <div className="divide-y dark:divide-gray-800">
            {filteredNotifs.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotifClick(notif)}
                className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors relative ${!notif.isRead ? 'bg-green-50/20 dark:bg-green-900/5' : ''}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-0.5">
                    <img src={notif.avatar} alt={notif.user} className="w-full h-full object-cover rounded-[14px]" referrerPolicy="no-referrer" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-xl border-2 border-white dark:border-[#242526] flex items-center justify-center shadow-md ${getIconBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <p className={`text-[15px] leading-snug ${!notif.isRead ? 'text-gray-900 dark:text-gray-100 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                    <span className="font-black text-gray-900 dark:text-gray-100">{notif.user}</span> {notif.action}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${!notif.isRead ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      {notif.time}
                    </p>
                  </div>
                </div>

                {!notif.isRead && (
                  <div className="flex items-center ml-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
             <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-6">
                <i className="fa-solid fa-bell text-4xl opacity-20"></i>
             </div>
             <h3 className="text-lg font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest">No Notifications</h3>
             <p className="text-sm font-medium mt-1">Nothing to see here right now</p>
          </div>
        )}

        <div className="p-6">
          <button className="w-full py-4 bg-white dark:bg-[#242526] text-gray-600 dark:text-gray-400 font-black uppercase tracking-[0.2em] rounded-2xl border dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-3 text-xs">
            Review History
            <i className="fa-solid fa-chevron-down text-[10px]"></i>
          </button>
        </div>
      </div>
      
      <div className="p-4 border-t dark:border-gray-800 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Bijoy Social Encrypted</p>
      </div>
    </div>
  );
};

export default NotificationList;
