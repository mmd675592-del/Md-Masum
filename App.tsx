
import React, { useState, useEffect, useMemo } from 'react';
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
import ReelsPage from './components/ReelsPage';
import SearchOverlay from './components/SearchOverlay';
import ShareToMessengerModal from './components/ShareToMessengerModal';
import { Post, Comment, ReactionCounts, Story, PrivacyType, UserInfo, Message, ChatSettings, FriendshipStatus } from './types';

const EMPTY_REACTIONS: ReactionCounts = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };

const App: React.FC = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'messenger' | 'requests' | 'settings' | 'saved' | 'verification' | 'reels'>('home');
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

  const [allUsers, setAllUsers] = useState<Record<string, UserInfo>>({
    me: currentUser,
    '1': { id: '1', name: 'Akash', avatar: 'https://i.pravatar.cc/150?u=akash', cover: 'https://picsum.photos/seed/c1/800/400', bio: 'Hello world!', school: '', college: '', university: 'Dhaka University', hometown: 'Dhaka', district: 'Dhaka', relationship: 'Single', nameLastChanged: 0, friendshipStatus: 'received', mutualFriends: 12, note: 'Cricket is life! 🏏', noteCreatedAt: Date.now() - 3600000, isActive: true },
    '2': { id: '2', name: 'MD ROHIT', avatar: 'https://i.pravatar.cc/150?u=rohit', cover: 'https://picsum.photos/seed/c2/800/400', bio: 'Tech enthusiast', school: '', college: '', university: 'BUET', hometown: 'Chittagong', district: 'Chittagong', relationship: 'In a relationship', nameLastChanged: 0, friendshipStatus: 'friends', mutualFriends: 5, note: 'Coding all night... 💻', noteCreatedAt: Date.now() - 7200000, isActive: true },
    '3': { id: '3', name: 'Runa', avatar: 'https://i.pravatar.cc/150?u=runa', cover: 'https://picsum.photos/seed/c3/800/400', bio: 'Nature lover', school: '', college: '', university: 'NSU', hometown: 'Sylhet', district: 'Sylhet', relationship: 'Single', nameLastChanged: 0, friendshipStatus: 'none', mutualFriends: 8, note: 'Listening to music 🎵', noteCreatedAt: Date.now() - 10800000, isActive: false, lastActive: Date.now() - 15 * 60000 },
    '4': { id: '4', name: 'Farso', avatar: 'https://i.pravatar.cc/150?u=farso', cover: 'https://picsum.photos/seed/c4/800/400', bio: 'Traveler', school: '', college: '', university: 'IUB', hometown: 'Rajshahi', district: 'Rajshahi', relationship: 'Single', nameLastChanged: 0, friendshipStatus: 'none', mutualFriends: 3, note: 'Traveling to Sylhet! 🚌', noteCreatedAt: Date.now() - 14400000, isActive: true },
    '5': { id: '5', name: 'Sajib', avatar: 'https://i.pravatar.cc/150?u=sajib', cover: 'https://picsum.photos/seed/c5/800/400', bio: 'Gamer', school: '', college: '', university: 'AIUB', hometown: 'Khulna', district: 'Khulna', relationship: 'Single', nameLastChanged: 0, friendshipStatus: 'none', mutualFriends: 15, isActive: false, lastActive: Date.now() - 120 * 60000 },
    '6': { id: '6', name: 'Mitu', avatar: 'https://i.pravatar.cc/150?u=mitu', cover: 'https://picsum.photos/seed/c6/800/400', bio: 'Artist', school: '', college: '', university: 'DU', hometown: 'Barisal', district: 'Barisal', relationship: 'Single', nameLastChanged: 0, friendshipStatus: 'received', mutualFriends: 2, isActive: false, lastActive: Date.now() - 5 * 60000 },
  });
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      author: 'Akash',
      authorId: '1',
      avatar: 'https://i.pravatar.cc/150?u=akash',
      content: 'শুভ সকাল! আজকের দিনটি সবার জন্য ভালো কাটুক। ☀️',
      timestamp: '১০ মিনিট আগে',
      createdAt: Date.now() - 600000,
      reactions: { ...EMPTY_REACTIONS, like: 12 },
      comments: [],
      userReaction: null,
      sharesCount: 5
    },
    {
      id: 'p2',
      author: 'MD ROHIT',
      authorId: '2',
      avatar: 'https://i.pravatar.cc/150?u=rohit',
      content: 'বিজয় অ্যাপের নতুন আপডেটগুলো দারুণ লাগছে! 🚀',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      timestamp: '২ ঘণ্টা আগে',
      createdAt: Date.now() - 7200000,
      reactions: { ...EMPTY_REACTIONS, love: 25 },
      comments: [],
      userReaction: null,
      sharesCount: 3
    }
  ]);
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([
    { id: 's1', userId: '1', username: 'Akash', userAvatar: 'https://i.pravatar.cc/150?u=akash', image: 'https://picsum.photos/seed/1/400/600', timestamp: Date.now() - 600000, reactions: { ...EMPTY_REACTIONS }, viewers: [] },
    { id: 's2', userId: '2', username: 'MD ROHIT', userAvatar: 'https://i.pravatar.cc/150?u=rohit', image: 'https://picsum.photos/seed/2/400/600', timestamp: Date.now() - 120000, reactions: { ...EMPTY_REACTIONS }, viewers: [] },
    { id: 's3', userId: '3', username: 'Runa', userAvatar: 'https://i.pravatar.cc/150?u=runa', image: 'https://picsum.photos/seed/3/400/600', timestamp: Date.now() - 120000, reactions: { ...EMPTY_REACTIONS }, viewers: [] },
    { id: 's4', userId: '4', username: 'Farso', userAvatar: 'https://i.pravatar.cc/150?u=farso', image: 'https://picsum.photos/seed/4/400/600', timestamp: Date.now() - 3600000, reactions: { ...EMPTY_REACTIONS }, viewers: [] },
  ]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '4': [{ id: 'm1', senderId: '4', text: 'Kemon acho, Bijoy?', timestamp: Date.now() - 3600000, isMe: false }],
    '5': [{ id: 'm2', senderId: '5', text: 'massege', timestamp: Date.now() - 7200000, isMe: false }],
    '2': [{ id: 'm3', senderId: '2', text: 'masseg', timestamp: Date.now() - 86400000, isMe: false }],
    '1': [{ id: 'm4', senderId: '1', text: 'Cricket is life', timestamp: Date.now() - 172800000, isMe: false }],
    '6': [{ id: 'm5', senderId: '6', text: 'masse', timestamp: Date.now() - 259200000, isMe: false }],
  });
  const [chatSettings, setChatSettings] = useState<Record<string, ChatSettings>>({});
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [postCreationInitialImage, setPostCreationInitialImage] = useState<string | undefined>(undefined);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareToMessengerOpen, setIsShareToMessengerOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [activeStatusEnabled, setActiveStatusEnabled] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data: Post[] = await response.json();
      const newsWithShares = data.map(p => ({
        ...p,
        sharesCount: p.sharesCount ?? Math.floor(Math.random() * 50) + 10
      }));
      setNewsPosts(newsWithShares);

      // Create user profiles for news channels
      const newsUsers: Record<string, UserInfo> = {};
      data.forEach(post => {
        if (!newsUsers[post.authorId]) {
          newsUsers[post.authorId] = {
            id: post.authorId,
            name: post.author,
            avatar: post.avatar,
            cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800', // Default news cover
            bio: `${post.author} - Latest news and updates from Bangladesh and around the world.`,
            school: '', college: '', university: '', hometown: '', district: '', relationship: '',
            nameLastChanged: 0,
            isActive: true,
            isNews: true,
            followers: Math.floor(Math.random() * 1000000) + 500000
          };
        }
      });
      setAllUsers(prev => ({ ...prev, ...newsUsers }));
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
    setTimeout(() => setAppLoading(false), 1200);
  }, []);

  const handleRefresh = async () => {
    showToast('ফিড রিফ্রেশ হচ্ছে...');
    await fetchNews();
    showToast('ফিড রিফ্রেশ সম্পন্ন হয়েছে।');
  };

  const allPosts = [...posts.sort((a, b) => b.createdAt - a.createdAt), ...newsPosts];

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

  const handleToggleReaction = (postId: string, type: keyof ReactionCounts) => {
    const toggle = (post: Post) => {
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
    };

    setPosts(prev => prev.map(toggle));
    setNewsPosts(prev => prev.map(toggle));
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

    const updatePost = (post: Post) => {
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
    };

    setPosts(prev => prev.map(updatePost));
    setNewsPosts(prev => prev.map(updatePost));
    showToast('কমেন্ট করা হয়েছে।');
  };

  const handleToggleCommentReaction = (postId: string, commentId: string, type: keyof ReactionCounts) => {
    const update = (post: Post) => {
      if (post.id !== postId) return post;
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            const newReactions = { ...c.reactions };
            let newUserReaction = c.userReaction;
            if (c.userReaction === type) {
              newReactions[type] = Math.max(0, newReactions[type] - 1);
              newUserReaction = null;
            } else {
              if (c.userReaction) newReactions[c.userReaction] = Math.max(0, newReactions[c.userReaction] - 1);
              newReactions[type] = (newReactions[type] || 0) + 1;
              newUserReaction = type;
            }
            return { ...c, reactions: newReactions, userReaction: newUserReaction };
          }
          if (c.replies) return { ...c, replies: updateComments(c.replies) };
          return c;
        });
      };
      return { ...post, comments: updateComments(post.comments) };
    };
    setPosts(prev => prev.map(update));
    setNewsPosts(prev => prev.map(update));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const update = (post: Post) => {
      if (post.id !== postId) return post;
      const filterComments = (comments: Comment[]): Comment[] => {
        return comments
          .filter(c => c.id !== commentId)
          .map(c => ({ ...c, replies: c.replies ? filterComments(c.replies) : [] }));
      };
      return { ...post, comments: filterComments(post.comments) };
    };
    setPosts(prev => prev.map(update));
    setNewsPosts(prev => prev.map(update));
    showToast('কমেন্ট ডিলিট করা হয়েছে।');
  };

  const handleEditComment = (postId: string, commentId: string, newText: string) => {
    const update = (post: Post) => {
      if (post.id !== postId) return post;
      const editComments = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === commentId) return { ...c, text: newText };
          if (c.replies) return { ...c, replies: editComments(c.replies) };
          return c;
        });
      };
      return { ...post, comments: editComments(post.comments) };
    };
    setPosts(prev => prev.map(update));
    setNewsPosts(prev => prev.map(update));
    showToast('কমেন্ট এডিট করা হয়েছে।');
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

  const handleUpdateNote = (userId: string, note: string) => {
    setAllUsers(prev => {
      const user = prev[userId];
      if (!user) return prev;
      const updatedUser = { ...user, note, noteCreatedAt: Date.now(), noteReactions: [] };
      if (userId === 'me') {
        setCurrentUser(updatedUser);
      }
      return { ...prev, [userId]: updatedUser };
    });
  };

  const handleReactToNote = (userId: string, reaction: keyof ReactionCounts) => {
    setAllUsers(prev => {
      const user = prev[userId];
      if (!user) return prev;
      const reactions = user.noteReactions || [];
      const existingIdx = reactions.findIndex(r => r.userId === 'me');
      let newReactions = [...reactions];
      if (existingIdx !== -1) {
        if (newReactions[existingIdx].reaction === reaction) {
          newReactions.splice(existingIdx, 1);
        } else {
          newReactions[existingIdx] = { userId: 'me', reaction };
        }
      } else {
        newReactions.push({ userId: 'me', reaction });
      }
      return { ...prev, [userId]: { ...user, noteReactions: newReactions } };
    });
  };

  const handleUpdateProfilePic = (url: string, caption?: string) => {
    setCurrentUser(prev => ({ ...prev, avatar: url }));
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser.name,
      authorId: 'me',
      avatar: url,
      content: caption || 'Updated profile picture.',
      image: url,
      timestamp: 'Just now',
      createdAt: Date.now(),
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      comments: [],
      sharesCount: 0
    };
    setPosts(prev => [newPost, ...prev]);
    showToast("প্রোফাইল ছবি পরিবর্তন করা হয়েছে।");
  };

  const handleUpdateCoverPic = (url: string, caption?: string) => {
    setCurrentUser(prev => ({ ...prev, cover: url }));
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser.name,
      authorId: 'me',
      avatar: currentUser.avatar,
      content: caption || 'Updated cover photo.',
      image: url,
      timestamp: 'Just now',
      createdAt: Date.now(),
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      comments: [],
      sharesCount: 0
    };
    setPosts(prev => [newPost, ...prev]);
    showToast("কভার ছবি পরিবর্তন করা হয়েছে।");
  };

  const handleNavigateToProfile = (userId: string) => {
    setSelectedProfileId(userId);
    setCurrentView('profile');
    setShowSearch(false);
    window.scrollTo(0, 0);
  };

  const handleNavigateToPost = (postId: string) => {
    setCurrentView('home');
    setShowSearch(false);
    setTimeout(() => {
      const element = document.getElementById(`post-${postId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-green-500', 'ring-opacity-50', 'transition-all', 'duration-1000');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-green-500', 'ring-opacity-50');
        }, 2000);
      }
    }, 100);
  };

  const handleSendMessage = (friendId: string, params: any) => {
    const newMessage: Message = { id: Date.now().toString(), senderId: 'me', ...params, timestamp: Date.now(), isMe: true };
    setMessages(prev => ({ ...prev, [friendId]: [...(prev[friendId] || []), newMessage] }));
  };

  const handleNewPost = (content: string, image?: string, theme?: string, fontStyle?: string, taggedFriends?: string[], privacy?: any, feeling?: { emoji: string; text: string }) => {
    const newPost: Post = { 
      id: Date.now().toString(), 
      author: currentUser.name, 
      authorId: 'me', 
      avatar: currentUser.avatar, 
      content, image, theme, fontStyle, taggedFriends, privacy, feeling,
      timestamp: 'এইমাত্র', 
      createdAt: Date.now(),
      reactions: { ...EMPTY_REACTIONS }, 
      comments: [], 
      userReaction: null,
      sharesCount: 0
    };
    setPosts([newPost, ...posts]);
    setIsPostCreationOpen(false);
    showToast('পোস্ট করা হয়েছে!');
  };

  const handleSharePost = (post: Post) => {
    const sharedPost: Post = {
      id: `shared-${Date.now()}`,
      author: currentUser.name,
      authorId: 'me',
      avatar: currentUser.avatar,
      content: '', // User can add a caption later if we add a modal, for now just share
      timestamp: 'এইমাত্র',
      createdAt: Date.now(),
      reactions: { ...EMPTY_REACTIONS },
      comments: [],
      userReaction: null,
      sharedPost: post,
      sharesCount: 0
    };
    
    // Increment share count on the original post
    const incrementShare = (p: Post) => {
      if (p.id === post.id) return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
      return p;
    };
    setPosts(prev => prev.map(incrementShare));
    setNewsPosts(prev => prev.map(incrementShare));

    setPosts(prev => [sharedPost, ...prev]);
    showToast('পোস্টটি আপনার টাইমলাইনে শেয়ার করা হয়েছে।');
  };

  const handleShareToMessenger = (post: Post) => {
    setSharingPost(post);
    setIsShareToMessengerOpen(true);
  };

  const handleShareReelToFeed = (reel: any) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser.name,
      authorId: currentUser.id,
      avatar: currentUser.avatar,
      content: `Check out this reel by ${reel.author}:\n\n${reel.description}`,
      image: reel.url,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      reactions: { ...EMPTY_REACTIONS },
      privacy: 'public',
    };
    setPosts([newPost, ...posts]);
    showToast('Reel shared to your feed');
    setCurrentView('home');
  };

  const handleShareReelToMessenger = (reel: any) => {
    const tempPost: Post = {
      id: `reel-${reel.id}`,
      author: reel.author,
      authorId: reel.author,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(reel.author)}&background=random`,
      content: reel.description,
      image: reel.url,
      timestamp: 'Just now',
      likes: reel.likes,
      comments: reel.comments,
      shares: reel.shares,
      isLiked: false,
      reactions: { ...EMPTY_REACTIONS },
      privacy: 'public',
    };
    setSharingPost(tempPost);
    setIsShareToMessengerOpen(true);
  };

  const handleSendToMessenger = (userId: string, post: Post) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      timestamp: Date.now(),
      isMe: true,
      sharedPost: post
    };
    setMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage]
    }));

    // Increment share count on the original post
    const incrementShare = (p: Post) => {
      if (p.id === post.id) return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
      return p;
    };
    setPosts(prev => prev.map(incrementShare));
    setNewsPosts(prev => prev.map(incrementShare));

    showToast(`${allUsers[userId]?.name || 'বন্ধুর'} কাছে পাঠানো হয়েছে।`);
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
    setNewsPosts(prev => prev.filter(p => p.id !== postId));
    showToast('পোস্ট ডিলিট করা হয়েছে।');
  };

  const handleFriendshipAction = (userId: string, action: 'send' | 'accept' | 'delete' | 'cancel' | 'block' | 'unblock') => {
    setAllUsers(prev => {
      const user = prev[userId];
      if (!user) return prev;

      let newStatus: FriendshipStatus = user.friendshipStatus || 'none';

      if (action === 'send') newStatus = 'sent';
      else if (action === 'accept') newStatus = 'friends';
      else if (action === 'delete') newStatus = 'none';
      else if (action === 'cancel') newStatus = 'none';
      else if (action === 'block') newStatus = 'blocked';
      else if (action === 'unblock') newStatus = 'none';

      const updatedUser = { ...user, friendshipStatus: newStatus };
      
      if (action === 'block') {
        showToast(`${user.name} ব্লক করা হয়েছে।`);
        if (currentView === 'profile' && selectedProfileId === userId) {
          setCurrentView('home');
        }
      } else if (action === 'unblock') {
        showToast(`${user.name} আনব্লক করা হয়েছে।`);
      } else if (action === 'accept') {
        showToast(`আপনি এখন ${user.name}-এর সাথে বন্ধু।`);
      } else if (action === 'send') {
        showToast(`${user.name}-কে ফ্রেন্ড রিকোয়েস্ট পাঠানো হয়েছে।`);
      } else if (action === 'delete') {
        showToast(`রিকোয়েস্ট ডিলিট করা হয়েছে।`);
      } else if (action === 'cancel') {
        showToast(`রিকোয়েস্ট বাতিল করা হয়েছে।`);
      }

      return { ...prev, [userId]: updatedUser };
    });
  };

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const author = allUsers[post.authorId];
      return author?.friendshipStatus !== 'blocked';
    });
  }, [allPosts, allUsers]);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      const user = allUsers[story.userId];
      return user?.friendshipStatus !== 'blocked';
    });
  }, [stories, allUsers]);

  const requests = useMemo(() => {
    return (Object.values(allUsers) as UserInfo[]).filter(u => u.friendshipStatus === 'received');
  }, [allUsers]);

  const suggestions = useMemo(() => {
    return (Object.values(allUsers) as UserInfo[]).filter(u => u.id !== 'me' && !u.isNews && (!u.friendshipStatus || u.friendshipStatus === 'none' || u.friendshipStatus === 'sent'));
  }, [allUsers]);

  if (appLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#18191a] flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
           <div className="flex items-center gap-3 mb-1">
             <h1 className="text-6xl font-black text-green-600 animate-pulse tracking-tighter">Bijoy</h1>
             <span className="text-4xl animate-bounce">🇵🇸</span>
           </div>
           <div className="text-sm font-bold text-green-700 dark:text-green-500 mb-6 opacity-80 select-none" style={{ fontFamily: 'serif' }}>
             لا إله إلا الله محمد رسول الله
           </div>
           <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleReplyMessage = (userId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: text,
      timestamp: Date.now(),
      isMe: true,
    };
    setMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage]
    }));
    setToast('Message sent to inbox');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] transition-colors duration-300">
      <div className="text-gray-900 dark:text-gray-100 min-h-screen">
        {currentView === 'home' ? (
          <>
            <Header onNavigateToProfile={handleNavigateToProfile} onRefresh={handleRefresh} onOpenSearch={() => setShowSearch(true)} />
            <main className="max-w-xl mx-auto md:py-4">
              <StorySection stories={filteredStories} onAddStory={handleAddStory} onViewStory={setActiveStoryIndex} currentUserAvatar={currentUser.avatar} />
              <StatusUpdate 
                onImageSelect={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setPostCreationInitialImage(e.target?.result as string);
                    setIsPostCreationOpen(true);
                  };
                  reader.readAsDataURL(file);
                }} 
                onOpenCreatePost={() => {
                  setPostCreationInitialImage(undefined);
                  setIsPostCreationOpen(true);
                }} 
                onProfileClick={() => handleNavigateToProfile('me')} 
                profilePic={currentUser.avatar} 
                activeStatus={activeStatusEnabled} 
              />
              <Feed 
                posts={filteredPosts} 
                onToggleReaction={handleToggleReaction} 
                onNavigateToProfile={handleNavigateToProfile} 
                onAddComment={handleAddComment}
                onToggleCommentReaction={handleToggleCommentReaction}
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
                onSharePost={handleSharePost}
                onShareToMessenger={handleShareToMessenger}
                onSavePost={handleSavePost}
                onDeletePost={handleDeletePost}
                savedPostIds={savedPostIds}
              />
            </main>
          </>
        ) : currentView === 'profile' ? (
          <ProfilePage 
            onBack={() => setCurrentView('home')} 
            posts={filteredPosts} 
            stories={filteredStories} 
            userInfo={allUsers[selectedProfileId] || currentUser} 
            isMe={selectedProfileId === 'me'} 
            onToggleReaction={handleToggleReaction} 
            onAddComment={handleAddComment} 
            onToggleCommentReaction={handleToggleCommentReaction}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
            onSharePost={handleSharePost}
            onShareToMessenger={handleShareToMessenger}
            onDeletePost={handleDeletePost} 
            onOpenCreatePost={() => {
              setPostCreationInitialImage(undefined);
              setIsPostCreationOpen(true);
            }} 
            onOpenEditProfile={() => setIsEditProfileOpen(true)} 
            onOpenMessage={(id) => {setTargetChatUserId(id); setCurrentView('messenger');}} 
            onNavigateToProfile={handleNavigateToProfile} 
            onFriendshipAction={handleFriendshipAction}
            onSavePost={handleSavePost}
            savedPostIds={savedPostIds}
            activeStatusEnabled={activeStatusEnabled} 
          />
        ) : currentView === 'messenger' ? (
          <MessengerPage 
            onBack={() => setCurrentView('home')} 
            onViewStory={(uid) => {
              const idx = stories.findIndex(s => s.userId === uid);
              if(idx !== -1) setActiveStoryIndex(idx);
            }} 
            onSendMessage={handleSendMessage} 
            onReactToMessage={(friendId, messageId, reaction) => {
              setMessages(prev => {
                const chatMsgs = prev[friendId] || [];
                return {
                  ...prev,
                  [friendId]: chatMsgs.map(msg => msg.id === messageId ? { ...msg, reaction } : msg)
                };
              });
            }} 
            onDeleteMessage={(friendId, messageId) => {
              setMessages(prev => {
                const chatMsgs = prev[friendId] || [];
                return {
                  ...prev,
                  [friendId]: chatMsgs.filter(msg => msg.id !== messageId)
                };
              });
            }} 
            onUnsendMessage={(friendId, messageId) => {
              setMessages(prev => {
                const chatMsgs = prev[friendId] || [];
                return {
                  ...prev,
                  [friendId]: chatMsgs.map(msg => msg.id === messageId ? { ...msg, isUnsent: true, text: undefined, image: undefined, video: undefined, audio: undefined, sticker: undefined, sharedPost: undefined } : msg)
                };
              });
            }} 
            onEditMessage={(friendId, messageId, newText) => {
              setMessages(prev => {
                const chatMsgs = prev[friendId] || [];
                return {
                  ...prev,
                  [friendId]: chatMsgs.map(msg => msg.id === messageId ? { ...msg, text: newText, isEdited: true } : msg)
                };
              });
            }}
            onForwardMessage={(friendId, messageId) => {
              // For a simple forward, we can just copy the message to the same chat or show a modal.
              // Since we don't have a forward modal, let's just duplicate it in the same chat as a forwarded message.
              setMessages(prev => {
                const chatMsgs = prev[friendId] || [];
                const msgToForward = chatMsgs.find(m => m.id === messageId);
                if (!msgToForward) return prev;
                const forwardedMsg: Message = {
                  ...msgToForward,
                  id: Date.now().toString(),
                  timestamp: Date.now(),
                  isMe: true,
                  isForwarded: true,
                  reaction: null,
                  isEdited: false
                };
                return {
                  ...prev,
                  [friendId]: [...chatMsgs, forwardedMsg]
                };
              });
            }}
            messages={messages} 
            chatSettings={chatSettings} 
            defaultChatSettings={{themeColor:'bg-green-600', myNickname:'', friendNickname:'', isBlocked:false}} 
            onUpdateChatSettings={(f, s) => setChatSettings(prev => ({ ...prev, [f]: s }))} 
            onNavigateToProfile={handleNavigateToProfile} 
            activeStatusEnabled={activeStatusEnabled} 
            stories={stories} 
            initialChatUserId={targetChatUserId} 
            onClearInitialChat={() => setTargetChatUserId(null)} 
            allUsers={allUsers} 
            onUpdateNote={handleUpdateNote}
            onReactToNote={handleReactToNote}
          />
        ) : currentView === 'settings' ? (
          <SettingsPage 
            onBack={() => setCurrentView('home')} 
            userInfo={currentUser} 
            onEditProfile={() => setIsEditProfileOpen(true)} 
            onUpdateUserInfo={handleUpdateUserInfo} 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            onOpenSaved={() => setCurrentView('saved')} 
            onOpenVerification={() => setCurrentView('verification')} 
            activeStatusEnabled={activeStatusEnabled} 
            onToggleActiveStatus={() => setActiveStatusEnabled(!activeStatusEnabled)} 
            allUsers={allUsers}
            onFriendshipAction={handleFriendshipAction}
          />
        ) : currentView === 'requests' ? (
          <FriendRequestList requests={requests} suggestions={suggestions} onBack={() => setCurrentView('home')} onNavigateToProfile={handleNavigateToProfile} onFriendshipAction={handleFriendshipAction} />
        ) : currentView === 'saved' ? (
          <SavedPostsPage 
            posts={allPosts.filter(p => savedPostIds.includes(p.id))} 
            onBack={() => setCurrentView('settings')} 
            onToggleReaction={handleToggleReaction} 
            onAddComment={handleAddComment} 
            onToggleCommentReaction={handleToggleCommentReaction}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
            onSharePost={handleSharePost}
            onShareToMessenger={handleShareToMessenger}
            onNavigateToProfile={handleNavigateToProfile} 
            onUnsavePost={handleSavePost} 
          />
        ) : currentView === 'reels' ? (
          <ReelsPage 
            onBack={() => setCurrentView('home')} 
            onShareToFeed={handleShareReelToFeed}
            onShareToMessenger={handleShareReelToMessenger}
          />
        ) : (
          <VerificationPage onBack={() => setCurrentView('settings')} userInfo={currentUser} />
        )}

        {currentView !== 'reels' && (
          <FloatingMenu onOpenMessenger={() => setCurrentView('messenger')} onOpenRequests={() => setCurrentView('requests')} onOpenHome={() => setCurrentView('home')} onOpenSettings={() => setCurrentView('settings')} onOpenReels={() => setCurrentView('reels')} />
        )}

        {activeStoryIndex !== null && (
          <StoryViewer 
            stories={stories} 
            initialIndex={activeStoryIndex} 
            onClose={() => setActiveStoryIndex(null)} 
            onToggleReaction={() => {}} 
            onDeleteStory={() => {}} 
            onUpdatePrivacy={() => {}}
            onNavigateToProfile={handleNavigateToProfile}
            onReplyMessage={handleReplyMessage}
          />
        )}

        {isPostCreationOpen && <PostCreationModal onClose={() => { setIsPostCreationOpen(false); setPostCreationInitialImage(undefined); }} onPost={handleNewPost} profilePic={currentUser.avatar} initialImage={postCreationInitialImage} />}
        {isEditProfileOpen && <EditProfileModal onClose={() => setIsEditProfileOpen(false)} userInfo={currentUser} onUpdateInfo={handleUpdateUserInfo} profilePic={currentUser.avatar} coverPic={currentUser.cover} onUpdateProfilePic={handleUpdateProfilePic} onUpdateCoverPic={handleUpdateCoverPic} />}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} users={Object.values(allUsers)} posts={allPosts} onNavigateToProfile={handleNavigateToProfile} onNavigateToPost={handleNavigateToPost} />}
        
        {isShareToMessengerOpen && sharingPost && (
          <ShareToMessengerModal 
            post={sharingPost} 
            users={Object.values(allUsers)} 
            onClose={() => setIsShareToMessengerOpen(false)} 
            onSend={handleSendToMessenger} 
          />
        )}

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
