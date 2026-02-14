
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StorySection from './components/StorySection';
import StoryViewer from './components/StoryViewer';
import StatusUpdate from './components/StatusUpdate';
import Feed from './components/Feed';
import FloatingMenu from './components/FloatingMenu';
import PostCreationModal from './components/PostCreationModal';
import ProfilePage from './components/ProfilePage';
import EditProfileModal from './components/EditProfileModal';
import MessengerPage from './components/MessengerPage';
import FriendRequestList from './components/FriendRequestList';
import SettingsPage from './components/SettingsPage';
import SavedPostsPage from './components/SavedPostsPage';
import VerificationPage from './components/VerificationPage';
import SearchOverlay from './components/SearchOverlay';
import AuthPage from './components/AuthPage';
import { Post, Comment, ReactionCounts, Story, PrivacyType, UserInfo, Message, ChatSettings } from './types';

const EMPTY_REACTIONS: ReactionCounts = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('bijoy_auth') === 'true');
  const [appLoading, setAppLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'messenger' | 'requests' | 'settings' | 'saved' | 'verification'>('home');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('me');
  const [targetChatUserId, setTargetChatUserId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<UserInfo>(() => {
    try {
      const saved = localStorage.getItem('bijoy_user_local');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      id: 'me', name: 'Bijoy', avatar: 'https://i.pravatar.cc/150?u=me', cover: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800',
      bio: 'Connecting Bangladesh 🚀', school: '', college: '', university: '', hometown: '', district: '', relationship: 'Single', nameLastChanged: 0, isActive: true
    };
  });

  const [allUsers, setAllUsers] = useState<Record<string, UserInfo>>({ me: currentUser });
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      author: 'Farso',
      authorId: 'farso',
      avatar: 'https://i.pravatar.cc/150?u=farso',
      content: 'বিজয় অ্যাপের নতুন আপডেটটি কেমন লাগলো? 😍',
      timestamp: '২ মিনিট আগে',
      reactions: { ...EMPTY_REACTIONS, love: 5, like: 12 },
      comments: [
        {
          id: 'c1',
          author: 'Bijoy User',
          userId: 'test-user',
          avatar: 'https://i.pravatar.cc/150?u=test',
          text: 'অসাধারণ হয়েছে! বিশেষ করে গ্রিন থিমটা দারুণ।',
          timestamp: '১ মিনিট আগে',
          reactions: { ...EMPTY_REACTIONS, like: 2 }
        }
      ],
      userReaction: null
    }
  ]);

  const [stories, setStories] = useState<Story[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chatSettings, setChatSettings] = useState<Record<string, ChatSettings>>({});
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [activeStatusEnabled, setActiveStatusEnabled] = useState(true);

  useEffect(() => {
    setTimeout(() => setAppLoading(false), 1200);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('bijoy_user_local', JSON.stringify(currentUser));
    setAllUsers(prev => ({ ...prev, me: currentUser }));
  }, [currentUser]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (name: string, avatar?: string) => {
    const updatedUser = { ...currentUser, name, avatar: avatar || currentUser.avatar };
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('bijoy_auth', 'true');
    showToast(`স্বাগতম, ${updatedUser.name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bijoy_auth');
    setCurrentView('home');
  };

  const handleToggleReaction = (postId: string, type: keyof ReactionCounts) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      const newReactions = { ...post.reactions };
      let newUserReaction = post.userReaction;
      if (post.userReaction === type) {
        newReactions[type] = Math.max(0, newReactions[type] - 1);
        newUserReaction = null;
      } else {
        if (post.userReaction) newReactions[post.userReaction] = Math.max(0, newReactions[post.userReaction] - 1);
        newReactions[type] = (newReactions[type] || 0) + 1;
        newUserReaction = type;
      }
      return { ...post, reactions: newReactions, userReaction: newUserReaction };
    }));
  };

  const handleAddComment = (postId: string, text: string, image?: string, sticker?: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser.name,
      userId: 'me',
      avatar: currentUser.avatar,
      text,
      image,
      sticker,
      timestamp: 'এখনই',
      reactions: { ...EMPTY_REACTIONS },
      replies: []
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      if (parentId) {
        const updateReplies = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newComment] };
            if (c.replies) return { ...c, replies: updateReplies(c.replies) };
            return c;
          });
        };
        return { ...post, comments: updateReplies(post.comments) };
      }
      return { ...post, comments: [...post.comments, newComment] };
    }));
    showToast('কমেন্ট করা হয়েছে।');
  };

  const handleAddStory = (params: any) => {
    const newStory: Story = {
      id: Date.now().toString(),
      userId: 'me',
      username: currentUser.name,
      userAvatar: currentUser.avatar,
      ...params,
      timestamp: Date.now(),
      reactions: { ...EMPTY_REACTIONS },
      viewers: [],
    };
    setStories([newStory, ...stories]);
    showToast('স্টোরি শেয়ার করা হয়েছে!');
  };

  const handleUpdateUserInfo = (info: Partial<UserInfo>) => {
    setCurrentUser(prev => ({ ...prev, ...info }));
  };

  const handleUpdateProfilePic = (url: string) => {
    setCurrentUser(prev => ({ ...prev, avatar: url }));
    showToast("প্রোফাইল ছবি পরিবর্তন করা হয়েছে।");
  };

  const handleNavigateToProfile = (userId: string) => {
    setSelectedProfileId(userId);
    setCurrentView('profile');
    setShowSearch(false);
    window.scrollTo(0, 0);
  };

  const handleSendMessage = (friendId: string, params: any) => {
    const newMessage: Message = { id: Date.now().toString(), senderId: 'me', ...params, timestamp: Date.now(), isMe: true };
    setMessages(prev => ({ ...prev, [friendId]: [...(prev[friendId] || []), newMessage] }));
  };

  const handleNewPost = (content: string, image?: string, theme?: string, fontStyle?: string) => {
    const newPost: Post = { 
      id: Date.now().toString(), 
      author: currentUser.name, 
      authorId: 'me', 
      avatar: currentUser.avatar, 
      content, image, theme, fontStyle, 
      timestamp: 'এইমাত্র', 
      reactions: { ...EMPTY_REACTIONS }, 
      comments: [], 
      userReaction: null 
    };
    setPosts([newPost, ...posts]);
    setIsPostCreationOpen(false);
    showToast('পোস্ট করা হয়েছে!');
  };

  const handleSavePost = (postId: string) => {
    if (savedPostIds.includes(postId)) {
      setSavedPostIds(prev => prev.filter(id => id !== postId));
      showToast("পোস্টটি সেভ থেকে সরানো হয়েছে।");
    } else {
      setSavedPostIds(prev => [...prev, postId]);
      showToast("পোস্টটি সেভ করা হয়েছে।");
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('পোস্ট ডিলিট করা হয়েছে।');
  };

  if (appLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#18191a] flex items-center justify-center">
        <div className="text-center">
           <h1 className="text-5xl font-black text-green-600 animate-pulse mb-4 tracking-tighter">Bijoy</h1>
           <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] transition-colors duration-300">
      <div className="text-gray-900 dark:text-gray-100 min-h-screen">
        {currentView === 'home' ? (
          <>
            <Header onNavigateToProfile={handleNavigateToProfile} onRefresh={() => showToast('ফিড রিফ্রেশ হচ্ছে...')} onOpenSearch={() => setShowSearch(true)} />
            <main className="max-w-xl mx-auto md:py-4">
              <StorySection stories={stories} onAddStory={handleAddStory} onViewStory={setActiveStoryIndex} currentUserAvatar={currentUser.avatar} />
              <StatusUpdate onImageSelect={() => {}} onOpenCreatePost={() => setIsPostCreationOpen(true)} onProfileClick={() => handleNavigateToProfile('me')} profilePic={currentUser.avatar} activeStatus={activeStatusEnabled} />
              <Feed 
                posts={posts} 
                onToggleReaction={handleToggleReaction} 
                onNavigateToProfile={handleNavigateToProfile} 
                onAddComment={handleAddComment}
                onSavePost={handleSavePost}
                onDeletePost={handleDeletePost}
                savedPostIds={savedPostIds}
              />
            </main>
          </>
        ) : currentView === 'profile' ? (
          <ProfilePage 
            onBack={() => setCurrentView('home')} 
            posts={posts} 
            stories={stories} 
            userInfo={allUsers[selectedProfileId] || currentUser} 
            isMe={selectedProfileId === 'me'} 
            onUpdateProfilePic={handleUpdateProfilePic} 
            onUpdateCoverPic={() => {}} 
            onToggleReaction={handleToggleReaction} 
            onAddComment={handleAddComment} 
            onDeletePost={handleDeletePost} 
            onOpenCreatePost={() => setIsPostCreationOpen(true)} 
            onOpenEditProfile={() => setIsEditProfileOpen(true)} 
            onOpenMessage={(id) => {setTargetChatUserId(id); setCurrentView('messenger');}} 
            onNavigateToProfile={handleNavigateToProfile} 
            activeStatusEnabled={activeStatusEnabled} 
          />
        ) : currentView === 'messenger' ? (
          <MessengerPage onBack={() => setCurrentView('home')} onViewStory={(uid) => {
            const idx = stories.findIndex(s => s.userId === uid);
            if(idx !== -1) setActiveStoryIndex(idx);
          }} onSendMessage={handleSendMessage} onReactToMessage={() => {}} onDeleteMessage={() => {}} onUnsendMessage={() => {}} messages={messages} chatSettings={chatSettings} defaultChatSettings={{themeColor:'bg-green-600', myNickname:'', friendNickname:'', isBlocked:false}} onUpdateChatSettings={(f, s) => setChatSettings(prev => ({ ...prev, [f]: s }))} onNavigateToProfile={handleNavigateToProfile} activeStatusEnabled={activeStatusEnabled} stories={stories} initialChatUserId={targetChatUserId} onClearInitialChat={() => setTargetChatUserId(null)} allUsers={allUsers} />
        ) : currentView === 'settings' ? (
          <SettingsPage onBack={() => setCurrentView('home')} userInfo={currentUser} onEditProfile={() => setIsEditProfileOpen(true)} onUpdateUserInfo={handleUpdateUserInfo} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onOpenSaved={() => setCurrentView('saved')} onOpenVerification={() => setCurrentView('verification')} activeStatusEnabled={activeStatusEnabled} onToggleActiveStatus={() => setActiveStatusEnabled(!activeStatusEnabled)} onLogout={handleLogout} />
        ) : currentView === 'requests' ? (
          <FriendRequestList requests={[]} suggestions={[]} onBack={() => setCurrentView('home')} onNavigateToProfile={handleNavigateToProfile} onFriendshipAction={() => {}} />
        ) : currentView === 'saved' ? (
          <SavedPostsPage posts={posts.filter(p => savedPostIds.includes(p.id))} onBack={() => setCurrentView('settings')} onToggleReaction={handleToggleReaction} onAddComment={handleAddComment} onNavigateToProfile={handleNavigateToProfile} onUnsavePost={handleSavePost} />
        ) : (
          <VerificationPage onBack={() => setCurrentView('settings')} userInfo={currentUser} />
        )}

        <FloatingMenu onOpenMessenger={() => setCurrentView('messenger')} onOpenRequests={() => setCurrentView('requests')} onOpenHome={() => setCurrentView('home')} onOpenSettings={() => setCurrentView('settings')} />

        {activeStoryIndex !== null && (
          <StoryViewer 
            stories={stories} 
            initialIndex={activeStoryIndex} 
            onClose={() => setActiveStoryIndex(null)} 
            onToggleReaction={() => {}} 
            onDeleteStory={() => {}} 
            onUpdatePrivacy={() => {}}
            onNavigateToProfile={handleNavigateToProfile}
          />
        )}

        {isPostCreationOpen && <PostCreationModal onClose={() => setIsPostCreationOpen(false)} onPost={handleNewPost} profilePic={currentUser.avatar} />}
        {isEditProfileOpen && <EditProfileModal onClose={() => setIsEditProfileOpen(false)} userInfo={currentUser} onUpdateInfo={handleUpdateUserInfo} profilePic={currentUser.avatar} coverPic={currentUser.cover} onUpdateProfilePic={handleUpdateProfilePic} onUpdateCoverPic={() => {}} />}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} users={Object.values(allUsers)} onNavigateToProfile={handleNavigateToProfile} />}
        
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-in slide-in-from-bottom-10 fade-in flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-green-400"></i>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
