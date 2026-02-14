
import React, { useState, useEffect, useMemo } from 'react';
import ChatDetail from './ChatDetail';
import BitAIModal from './BitAIModal';
import { Message, ChatSettings, ReactionCounts, Story, UserInfo } from '../types';

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  isActive?: boolean;
  lastActive?: string;
  isGroup?: boolean;
}

const CHATS: ChatItem[] = [
  { id: 'farso', name: 'Farso', avatar: 'https://i.pravatar.cc/150?u=farso', lastMessage: 'Kemon acho, Bijoy?', isActive: true },
  { id: 'tanim', name: 'TANIM', avatar: 'https://i.pravatar.cc/150?u=tanim', lastMessage: 'massege', isActive: true },
  { id: 'rohit', name: 'ROHIT', avatar: 'https://i.pravatar.cc/150?u=rohit', lastMessage: 'masseg', isActive: true },
  { id: 'akash', name: 'Akash', avatar: 'https://i.pravatar.cc/150?u=akash', lastMessage: 'Cricket is life', isActive: true },
  { id: 'tu', name: 'TU', avatar: 'https://i.pravatar.cc/150?u=tu', lastMessage: 'masse', isActive: false, lastActive: '5m' },
];

const GROUPS: ChatItem[] = [
  { id: 'global', name: 'Global Community', avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop', lastMessage: 'Welcome to Bijoy Global Chat!', isActive: true, isGroup: true },
];

interface UserNote {
  text: string;
  createdAt: number;
}

interface MessengerPageProps {
  onBack: () => void;
  onViewStory: (userId: string) => void;
  onSendMessage: (friendId: string, params: { text?: string; image?: string; video?: string; audio?: string; sticker?: string }) => void;
  onReactToMessage: (friendId: string, messageId: string, reaction: keyof ReactionCounts | null) => void;
  onDeleteMessage: (friendId: string, messageId: string) => void;
  onUnsendMessage: (friendId: string, messageId: string) => void;
  messages: Record<string, Message[]>;
  chatSettings: Record<string, ChatSettings>;
  defaultChatSettings: ChatSettings;
  onUpdateChatSettings: (friendId: string, settings: ChatSettings) => void;
  onNavigateToProfile?: (userId: string) => void;
  activeStatusEnabled?: boolean;
  stories?: Story[];
  initialChatUserId?: string | null;
  onClearInitialChat?: () => void;
  allUsers: Record<string, UserInfo>;
}

const MessengerPage: React.FC<MessengerPageProps> = ({ 
  onBack, onViewStory, onSendMessage, onReactToMessage, onDeleteMessage, onUnsendMessage, messages,
  chatSettings, defaultChatSettings, onUpdateChatSettings, onNavigateToProfile,
  activeStatusEnabled = true,
  stories = [],
  initialChatUserId,
  onClearInitialChat,
  allUsers
}) => {
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [showBitAI, setShowBitAI] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showMessengerInfo, setShowMessengerInfo] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const activeFriends = useMemo(() => {
    return (Object.values(allUsers) as UserInfo[])
      .filter(user => user.isActive || user.id === 'me' || user.name === 'Farso')
      .sort((a, b) => (a.id === 'me' ? -1 : b.id === 'me' ? 1 : 0));
  }, [allUsers]);

  useEffect(() => {
    if (initialChatUserId) {
      const user = allUsers[initialChatUserId];
      if (user) {
        setActiveChat({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          lastMessage: 'Tap to start chatting',
          isActive: user.isActive,
          lastActive: user.lastActive
        });
      }
      onClearInitialChat?.();
    }
  }, [initialChatUserId, allUsers, onClearInitialChat]);

  const [userNote, setUserNote] = useState<UserNote | null>(() => {
    const saved = localStorage.getItem('bijoy_user_note');
    if (!saved) return null;
    const parsed = JSON.parse(saved) as UserNote;
    if (Date.now() - parsed.createdAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('bijoy_user_note');
      return null;
    }
    return parsed;
  });
  const [noteInput, setNoteInput] = useState('');

  const isNoteLocked = userNote && (Date.now() - userNote.createdAt < 24 * 60 * 60 * 1000);

  const handleSaveNote = () => {
    if (isNoteLocked || !noteInput.trim()) return;
    const newNote = { text: noteInput.slice(0, 101), createdAt: Date.now() };
    setUserNote(newNote);
    localStorage.setItem('bijoy_user_note', JSON.stringify(newNote));
    setNoteInput('');
  };

  const getTimeLeftForNote = () => {
    if (!userNote) return '';
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - userNote.createdAt);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const handleOpenChat = (chat: ChatItem) => {
    const latestUser = allUsers[chat.id];
    if (latestUser) {
      setActiveChat({
        ...chat,
        name: latestUser.name,
        avatar: latestUser.avatar,
        isActive: latestUser.isActive,
        lastActive: latestUser.lastActive
      });
    } else {
      setActiveChat(chat);
    }
  };

  const handleFriendClick = (friendId: string) => {
    const hasStory = stories.some(s => s.userId === friendId);
    if (hasStory) {
      onViewStory(friendId);
    } else {
      const user = allUsers[friendId];
      if (user) {
        handleOpenChat({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          lastMessage: 'Tap to start chatting',
          isActive: user.isActive,
          lastActive: user.lastActive
        });
      }
    }
  };

  const toggleMemberSelection = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    alert(`Group "${groupName}" created!`);
    setIsCreatingGroup(false);
    setGroupName('');
    setSelectedMembers([]);
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-800 dark:text-gray-200">
              <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tighter">Inboxes</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </button>
            <button 
              onClick={() => setShowMessengerInfo(true)}
              className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 active:scale-90 transition-all shadow-sm"
            >
              <i className="fa-solid fa-note-sticky text-xl"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="p-4 flex gap-4 overflow-x-auto scrollbar-hide border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-black/10">
            {activeFriends.map((friend) => {
              const showDot = friend.id === 'me' ? activeStatusEnabled : friend.isActive;
              const hasStory = stories.some(s => s.userId === friend.id);
              const isMe = friend.id === 'me';
              
              return (
                <div 
                  key={friend.id} 
                  onClick={() => handleFriendClick(friend.id)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-[1.5rem] overflow-hidden p-0.5 bg-white dark:bg-gray-700 shadow-lg transition-all active:scale-95 border-2 ${hasStory ? 'border-green-500 scale-105' : 'border-white dark:border-gray-600'}`}>
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover rounded-[1.3rem]" />
                    </div>
                    {showDot && (
                      <div className="absolute top-0 right-0 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#242526] rounded-full shadow-md z-10"></div>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">{isMe ? 'YOU' : friend.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 divide-y divide-gray-50 dark:divide-gray-800">
            {CHATS.map((chat) => {
              const user = allUsers[chat.id] || chat;
              const hasStory = stories.some(s => s.userId === chat.id);
              return (
                <div 
                  key={chat.id} 
                  onClick={() => handleOpenChat(chat)}
                  className="px-5 py-5 flex items-center gap-4 hover:bg-green-50/30 dark:hover:bg-green-900/5 cursor-pointer transition-colors"
                >
                  <div className={`w-16 h-16 rounded-[1.4rem] overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-800 shadow-md relative p-0.5 border-2 ${hasStory ? 'border-green-500' : 'border-transparent'}`}>
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[1.2rem]" />
                    {(user.isActive || chat.isActive) && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[16px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {chatSettings[chat.id]?.friendNickname || user.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase">
                        {(user.isActive || chat.isActive) ? 'Active' : (user.lastActive || chat.lastActive)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold truncate max-w-[200px] mt-0.5">
                      {messages[chat.id]?.length > 0 
                        ? (messages[chat.id][messages[chat.id].length-1].isUnsent 
                            ? 'Unsent a message' 
                            : (messages[chat.id][messages[chat.id].length-1].text || '[Attachment]'))
                        : chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-10 right-6 flex flex-col gap-4 items-center">
          <button 
            onClick={() => setShowBitAI(true)}
            className="w-14 h-14 rounded-2xl bg-black text-white shadow-2xl flex items-center justify-center font-black text-lg hover:scale-110 active:scale-90 transition-all"
          >
            Bit
          </button>
          
          <button 
            onClick={() => setShowGroups(true)}
            className="w-16 h-16 rounded-[1.5rem] bg-green-600 text-white shadow-2xl flex items-center justify-center hover:bg-green-700 hover:scale-110 active:scale-90 transition-all relative"
          >
            <i className="fa-solid fa-users text-2xl"></i>
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
          </button>
        </div>
      </div>

      {activeChat && (
        <ChatDetail 
          friend={activeChat} 
          messages={messages[activeChat.id] || []}
          settings={chatSettings[activeChat.id] || defaultChatSettings}
          onBack={() => setActiveChat(null)}
          onSendMessage={(params) => onSendMessage(activeChat.id, params)}
          onReactToMessage={(msgId, react) => onReactToMessage(activeChat.id, msgId, react)}
          onDeleteMessage={(msgId) => onDeleteMessage(activeChat.id, msgId)}
          onUnsendMessage={(msgId) => onUnsendMessage(activeChat.id, msgId)}
          onUpdateSettings={(newSettings) => onUpdateChatSettings(activeChat.id, newSettings)}
          onNavigateToProfile={onNavigateToProfile}
        />
      )}

      {showBitAI && <BitAIModal onClose={() => setShowBitAI(false)} />}
    </>
  );
};

export default MessengerPage;
