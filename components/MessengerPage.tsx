
import React, { useState, useEffect, useMemo } from 'react';
import ChatDetail from './ChatDetail';
import BitAIModal from './BitAIModal';
import { Message, ChatSettings, ReactionCounts, Story, UserInfo } from '../types';
import { REACTION_DATA } from './Feed';

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  isActive?: boolean;
  lastActive?: number;
  isGroup?: boolean;
}

const GROUPS: ChatItem[] = [
  { id: 'global', name: 'Global Community', avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop', lastMessage: 'Welcome to Bijoy Global Chat!', isActive: true, isGroup: true },
];

const formatLastActive = (timestamp?: number) => {
  if (!timestamp) return '';
  const diffInMinutes = Math.floor((Date.now() - timestamp) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

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
  onEditMessage: (friendId: string, messageId: string, newText: string) => void;
  onForwardMessage: (friendId: string, messageId: string) => void;
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
  onUpdateNote?: (userId: string, note: string) => void;
  onReactToNote?: (userId: string, reaction: keyof ReactionCounts) => void;
}

const MessengerPage: React.FC<MessengerPageProps> = ({ 
  onBack, onViewStory, onSendMessage, onReactToMessage, onDeleteMessage, onUnsendMessage, onEditMessage, onForwardMessage, messages,
  chatSettings, defaultChatSettings, onUpdateChatSettings, onNavigateToProfile,
  activeStatusEnabled = true,
  stories = [],
  initialChatUserId,
  onClearInitialChat,
  allUsers,
  onUpdateNote,
  onReactToNote
}) => {
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [showBitAI, setShowBitAI] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showMessengerInfo, setShowMessengerInfo] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [viewingNoteUser, setViewingNoteUser] = useState<UserInfo | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const chatList = useMemo(() => {
    const userIdsWithMessages = Object.keys(messages);
    const defaultChatIds = ['4', '5', '2', '1', '6']; // Default users to show
    
    const allChatIds = Array.from(new Set([...userIdsWithMessages, ...defaultChatIds]));
    
    const computedChats = allChatIds.map(id => {
      const user = allUsers[id];
      const userMessages = messages[id] || [];
      const lastMsg = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
      
      let lastMessageText = 'Tap to start chatting';
      let lastMessageTime = 0;
      
      if (lastMsg) {
        lastMessageText = lastMsg.text || (lastMsg.image ? 'Sent an image' : lastMsg.video ? 'Sent a video' : lastMsg.audio ? 'Sent an audio' : lastMsg.sticker ? 'Sent a sticker' : 'Sent a message');
        lastMessageTime = lastMsg.timestamp;
      }
      
      return {
        id,
        name: user?.name || 'Unknown User',
        avatar: user?.avatar || 'https://i.pravatar.cc/150',
        lastMessage: lastMessageText,
        isActive: user?.isActive,
        lastActive: user?.lastActive,
        lastMessageTime
      };
    }).filter(chat => chat.id !== 'me'); // Exclude self from chat list
    
    return computedChats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [messages, allUsers]);

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

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    onUpdateNote?.('me', noteInput.slice(0, 101));
    setNoteInput('');
    setShowNoteInput(false);
  };

  const isNoteActive = (user: UserInfo) => {
    return user.note && user.noteCreatedAt && (Date.now() - user.noteCreatedAt < 24 * 60 * 60 * 1000);
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
              onClick={() => setShowNoteInput(true)}
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
              const hasNote = isNoteActive(friend);
              const chatTheme = chatSettings[friend.id]?.themeColor || defaultChatSettings.themeColor;
              const themeAccent = chatTheme.includes('gradient') 
                ? `${chatTheme} bg-clip-text text-transparent` 
                : chatTheme.replace('bg-', 'text-');
              
              return (
                <div 
                  key={friend.id} 
                  className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    {hasNote && (
                      <div 
                        onClick={(e) => { e.stopPropagation(); setViewingNoteUser(friend); }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-[#242526] px-3 py-1.5 rounded-2xl shadow-xl border dark:border-gray-700 animate-in zoom-in duration-300 max-w-[80px]"
                      >
                        <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate">{friend.note}</p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#242526] rotate-45 border-r border-b dark:border-gray-700"></div>
                        {friend.noteReactions && friend.noteReactions.length > 0 && (
                          <div className="absolute -bottom-2 -right-1 flex -space-x-1">
                            {friend.noteReactions.slice(0, 2).map((r, i) => {
                              const reactionData = REACTION_DATA[r.reaction as keyof ReactionCounts];
                              return (
                                <span key={i} className="text-[8px] bg-white dark:bg-gray-800 rounded-full shadow-sm border dark:border-gray-700 w-3 h-3 flex items-center justify-center">
                                  {reactionData?.emoji}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    <div 
                      onClick={() => handleFriendClick(friend.id)}
                      className={`w-16 h-16 rounded-[1.5rem] overflow-hidden p-0.5 bg-white dark:bg-gray-700 shadow-lg transition-all active:scale-95 border-2 relative ${hasStory ? (chatTheme.includes('gradient') ? 'border-transparent scale-105' : `${chatTheme.replace('bg-', 'border-')} scale-105`) : 'border-white dark:border-gray-600'}`}
                    >
                      {hasStory && chatTheme.includes('gradient') && (
                        <div className={`absolute inset-0 rounded-[1.5rem] ${chatTheme} -z-10`}></div>
                      )}
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover rounded-[1.3rem] bg-white dark:bg-gray-700" referrerPolicy="no-referrer" />
                    </div>
                    {showDot && (
                      <div className={`absolute top-0 right-0 w-5 h-5 ${chatTheme} border-4 border-white dark:border-[#242526] rounded-full shadow-md z-10`}></div>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${themeAccent}`}>{isMe ? 'YOU' : (chatSettings[friend.id]?.friendNickname || friend.name)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 divide-y divide-gray-50 dark:divide-gray-800">
            {chatList.map((chat) => {
              const user = allUsers[chat.id] || chat;
              const hasStory = stories.some(s => s.userId === chat.id);
              const chatTheme = chatSettings[chat.id]?.themeColor || defaultChatSettings.themeColor;
              const themeAccent = chatTheme.includes('gradient') 
                ? `${chatTheme} bg-clip-text text-transparent` 
                : chatTheme.replace('bg-', 'text-');
              
              return (
                <div 
                  key={chat.id} 
                  onClick={() => handleOpenChat(chat)}
                  className="px-5 py-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className={`w-16 h-16 rounded-[1.4rem] overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-800 shadow-md relative p-0.5 border-2 ${hasStory ? (chatTheme.includes('gradient') ? 'border-transparent' : chatTheme.replace('bg-', 'border-')) : 'border-transparent'}`}>
                    {hasStory && chatTheme.includes('gradient') && (
                      <div className={`absolute inset-0 rounded-[1.4rem] ${chatTheme} -z-10`}></div>
                    )}
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[1.2rem] bg-white dark:bg-gray-800" referrerPolicy="no-referrer" />
                    {(user.isActive || chat.isActive) && (
                      <div className={`absolute bottom-1 right-1 w-4 h-4 ${chatTheme} border-2 border-white dark:border-[#242526] rounded-full shadow-sm`}></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-[16px] font-black uppercase tracking-tight ${themeAccent}`}>
                        {chatSettings[chat.id]?.friendNickname || user.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase">
                        {(user.isActive || chat.isActive) ? 'Active' : formatLastActive(user.lastActive || chat.lastActive)}
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
          onEditMessage={(msgId, newText) => onEditMessage(activeChat.id, msgId, newText)}
          onForwardMessage={(msgId) => onForwardMessage(activeChat.id, msgId)}
          onUpdateSettings={(newSettings) => onUpdateChatSettings(activeChat.id, newSettings)}
          onNavigateToProfile={onNavigateToProfile}
          allUsers={allUsers}
          onUpdateNote={onUpdateNote}
        />
      )}

      {showBitAI && <BitAIModal onClose={() => setShowBitAI(false)} />}

      {/* Note Input Modal */}
      {showNoteInput && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black mb-6 text-center text-gray-900 dark:text-gray-100 tracking-tight">Share a Note</h3>
            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  autoFocus
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value.slice(0, 101))}
                  placeholder="What's on your mind?"
                  className="w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-transparent focus:border-green-500 outline-none font-bold text-gray-800 dark:text-gray-200 resize-none min-h-[120px]"
                />
                <span className="absolute bottom-4 right-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{noteInput.length}/101</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowNoteInput(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-black text-gray-500 uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNote}
                  disabled={!noteInput.trim()}
                  className="flex-1 py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {viewingNoteUser && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in" onClick={() => setViewingNoteUser(null)}>
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 relative" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden mb-6 border-4 border-green-50 dark:border-green-900/20 shadow-xl">
                <img src={viewingNoteUser.avatar} className="w-full h-full object-cover" alt={viewingNoteUser.name} referrerPolicy="no-referrer" />
              </div>
              <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{viewingNoteUser.name}</h4>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-8">Shared a note</p>
              
              <div className="w-full p-8 bg-green-50/50 dark:bg-green-900/10 rounded-[2.5rem] border-2 border-green-100 dark:border-green-800/30 mb-8 relative">
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-relaxed italic">"{viewingNoteUser.note}"</p>
                <div className="absolute -top-3 left-8 bg-green-600 text-white px-3 py-1 rounded-full"><i className="fa-solid fa-quote-left text-xs"></i></div>
              </div>

              {viewingNoteUser.id !== 'me' && (
                <div className="flex justify-between w-full bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border dark:border-gray-700">
                  {(Object.keys(REACTION_DATA) as (keyof ReactionCounts)[]).map((key) => {
                    const data = REACTION_DATA[key];
                    const hasReacted = viewingNoteUser.noteReactions?.some(r => r.userId === 'me' && r.reaction === key);
                    return (
                      <button 
                        key={key} 
                        onClick={() => { onReactToNote?.(viewingNoteUser.id, key); setViewingNoteUser(null); }} 
                        className={`flex flex-col items-center gap-1.5 hover:scale-125 transition-transform active:scale-90 ${hasReacted ? 'scale-110' : ''}`}
                      >
                        <span className="text-3xl drop-shadow-sm">{data.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <button 
                onClick={() => setViewingNoteUser(null)}
                className="mt-8 text-xs font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessengerPage;
