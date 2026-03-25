import React, { useState, useRef, useEffect } from 'react';
import { Comment, ReactionCounts, Post } from '../types';
import CommentPage from './CommentPage';

const EMPTY_REACTIONS: ReactionCounts = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };

interface Reel {
  id: string;
  url: string;
  author: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  commentsList?: Comment[];
}

const DUMMY_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'User 1',
    avatar: 'https://i.pravatar.cc/150?img=1',
    userId: 'u1',
    text: 'This is amazing! 🔥',
    timestamp: '2h',
    reactions: { ...EMPTY_REACTIONS, like: 5 },
    replies: []
  },
  {
    id: 'c2',
    author: 'User 2',
    avatar: 'https://i.pravatar.cc/150?img=2',
    userId: 'u2',
    text: 'Wow, love this!',
    timestamp: '1h',
    reactions: { ...EMPTY_REACTIONS, love: 2 },
    replies: []
  }
];

const SAMPLE_REELS: Reel[] = [
  {
    id: '1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    author: '@nature_lover',
    description: 'Beautiful blazing fire! 🔥 #nature #fire',
    likes: 12400,
    comments: 450,
    shares: 1200,
    commentsList: [...DUMMY_COMMENTS]
  },
  {
    id: '2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    author: '@travel_diaries',
    description: 'The great escape into the wild 🌲 #travel #adventure',
    likes: 8900,
    comments: 230,
    shares: 450,
    commentsList: [...DUMMY_COMMENTS]
  },
  {
    id: '3',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    author: '@comedy_central',
    description: 'Having some bigger fun today! 😂 #funny #comedy',
    likes: 45600,
    comments: 1200,
    shares: 8900,
    commentsList: [...DUMMY_COMMENTS]
  },
  {
    id: '4',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    author: '@auto_enthusiast',
    description: 'Taking a joyride in the new beast 🚗💨 #cars #joyride',
    likes: 32100,
    comments: 890,
    shares: 2100,
    commentsList: [...DUMMY_COMMENTS]
  },
  {
    id: '5',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    author: '@tech_guru',
    description: 'When the code finally compiles but fails at runtime 😭 #tech #coding',
    likes: 56700,
    comments: 3400,
    shares: 12000,
    commentsList: [...DUMMY_COMMENTS]
  }
];

interface ReelsPageProps {
  onBack: () => void;
  onShareToFeed?: (reel: Reel) => void;
  onShareToMessenger?: (reel: Reel) => void;
}

const ReelItem: React.FC<{ reel: Reel; isActive: boolean; onOpenComments: () => void; onOpenShare: () => void }> = ({ reel, isActive, onOpenComments, onOpenShare }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(console.error);
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    
    if (now - lastTapRef.current < 400) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current === 3) {
      if (!isLiked) {
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
      tapCountRef.current = 0;
      
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      togglePlay();
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="relative w-full h-full snap-start bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={reel.url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        onClick={handleVideoTap}
      />
      
      {/* Big Heart Animation for Triple Tap */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in zoom-in duration-300 fade-out delay-500">
          <i className="fa-solid fa-heart text-red-500 text-9xl drop-shadow-2xl scale-150"></i>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <i className="fa-solid fa-play text-white text-2xl ml-1"></i>
          </div>
        </div>
      )}

      {/* Right Actions Bar */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={handleLike}
            className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90"
          >
            <i className={`fa-solid fa-heart text-2xl ${isLiked ? 'text-blue-500' : 'text-white'}`}></i>
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">{formatNumber(likesCount)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button onClick={onOpenComments} className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90">
            <i className="fa-solid fa-comment text-white text-2xl"></i>
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">{formatNumber(reel.comments)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button onClick={onOpenShare} className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90">
            <i className="fa-solid fa-share text-white text-2xl"></i>
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">{formatNumber(reel.shares)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90">
            <i className="fa-solid fa-ellipsis text-white text-2xl"></i>
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-0 bottom-0 right-16 p-4 pb-8 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 mb-2 pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reel.author)}&background=random`} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-white font-bold text-sm drop-shadow-md">{reel.author}</h3>
          <button className="ml-2 px-3 py-1 bg-transparent border border-white text-white text-xs font-bold rounded-full backdrop-blur-sm">
            Follow
          </button>
        </div>
        <p className="text-white text-sm drop-shadow-md line-clamp-2">{reel.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <i className="fa-solid fa-music text-white text-xs"></i>
          <span className="text-white text-xs drop-shadow-md">Original Audio - {reel.author}</span>
        </div>
      </div>
    </div>
  );
};

const ReelsPage: React.FC<ReelsPageProps> = ({ onBack, onShareToFeed, onShareToMessenger }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCommentReel, setActiveCommentReel] = useState<Reel | null>(null);
  const [activeShareReel, setActiveShareReel] = useState<Reel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create an infinite list by repeating the sample reels
  const [reelsList, setReelsList] = useState<Reel[]>([]);

  useEffect(() => {
    // Initialize with 3 sets of sample reels
    setReelsList([...SAMPLE_REELS, ...SAMPLE_REELS.map(r => ({...r, id: r.id + '_2'})), ...SAMPLE_REELS.map(r => ({...r, id: r.id + '_3'}))]);
  }, []);

  const handleShare = (destination: string) => {
    if (destination === 'Messenger' && onShareToMessenger && activeShareReel) {
      onShareToMessenger(activeShareReel);
      setActiveShareReel(null);
      return;
    }
    if (destination === 'Profile Feed' && onShareToFeed && activeShareReel) {
      onShareToFeed(activeShareReel);
      setActiveShareReel(null);
      return;
    }
    setToastMessage(`Shared to ${destination}`);
    setActiveShareReel(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddComment = (reelId: string, text: string, image?: string, sticker?: string, parentId?: string) => {
    setReelsList(prev => prev.map(reel => {
      if (reel.id === reelId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          author: 'You',
          avatar: 'https://i.pravatar.cc/150?img=11',
          userId: 'me',
          text,
          image,
          sticker,
          timestamp: 'Just now',
          reactions: { ...EMPTY_REACTIONS },
          replies: []
        };

        let updatedComments = [...(reel.commentsList || [])];
        if (parentId) {
          updatedComments = updatedComments.map(c => 
            c.id === parentId 
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          );
        } else {
          updatedComments.push(newComment);
        }

        return { ...reel, commentsList: updatedComments, comments: reel.comments + 1 };
      }
      return reel;
    }));

    if (activeCommentReel && activeCommentReel.id === reelId) {
      setActiveCommentReel(prev => prev ? {
        ...prev,
        comments: prev.comments + 1,
        commentsList: parentId 
          ? (prev.commentsList || []).map(c => c.id === parentId ? { ...c, replies: [...(c.replies || []), {
              id: Date.now().toString(),
              author: 'You',
              avatar: 'https://i.pravatar.cc/150?img=11',
              userId: 'me',
              text,
              image,
              sticker,
              timestamp: 'Just now',
              reactions: { ...EMPTY_REACTIONS },
              replies: []
            }] } : c)
          : [...(prev.commentsList || []), {
              id: Date.now().toString(),
              author: 'You',
              avatar: 'https://i.pravatar.cc/150?img=11',
              userId: 'me',
              text,
              image,
              sticker,
              timestamp: 'Just now',
              reactions: { ...EMPTY_REACTIONS },
              replies: []
            }]
      } : null);
    }
  };

  const handleToggleCommentReaction = (reelId: string, commentId: string, type: keyof ReactionCounts) => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          const isRemoving = c.userReaction === type;
          const newReaction = isRemoving ? null : type;
          const newReactions = { ...c.reactions };
          
          if (c.userReaction) newReactions[c.userReaction]--;
          if (!isRemoving) newReactions[type]++;

          return { ...c, reactions: newReactions, userReaction: newReaction };
        }
        if (c.replies) {
          return { ...c, replies: updateComments(c.replies) };
        }
        return c;
      });
    };

    setReelsList(prev => prev.map(reel => 
      reel.id === reelId ? { ...reel, commentsList: updateComments(reel.commentsList || []) } : reel
    ));

    if (activeCommentReel && activeCommentReel.id === reelId) {
      setActiveCommentReel(prev => prev ? {
        ...prev,
        commentsList: updateComments(prev.commentsList || [])
      } : null);
    }
  };

  const handleDeleteComment = (reelId: string, commentId: string) => {
    const deleteFromComments = (comments: Comment[]): Comment[] => {
      return comments.filter(c => c.id !== commentId).map(c => ({
        ...c,
        replies: c.replies ? deleteFromComments(c.replies) : []
      }));
    };

    setReelsList(prev => prev.map(reel => {
      if (reel.id === reelId) {
        const newCommentsList = deleteFromComments(reel.commentsList || []);
        // Calculate new total comments
        const countComments = (comments: Comment[]): number => {
          return comments.reduce((acc, c) => acc + 1 + countComments(c.replies || []), 0);
        };
        return { ...reel, commentsList: newCommentsList, comments: countComments(newCommentsList) };
      }
      return reel;
    }));

    if (activeCommentReel && activeCommentReel.id === reelId) {
      setActiveCommentReel(prev => {
        if (!prev) return null;
        const newCommentsList = deleteFromComments(prev.commentsList || []);
        const countComments = (comments: Comment[]): number => {
          return comments.reduce((acc, c) => acc + 1 + countComments(c.replies || []), 0);
        };
        return {
          ...prev,
          commentsList: newCommentsList,
          comments: countComments(newCommentsList)
        };
      });
    }
  };

  const handleEditComment = (reelId: string, commentId: string, newText: string) => {
    const editInComments = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return { ...c, text: newText };
        }
        if (c.replies) {
          return { ...c, replies: editInComments(c.replies) };
        }
        return c;
      });
    };

    setReelsList(prev => prev.map(reel => 
      reel.id === reelId ? { ...reel, commentsList: editInComments(reel.commentsList || []) } : reel
    ));

    if (activeCommentReel && activeCommentReel.id === reelId) {
      setActiveCommentReel(prev => prev ? {
        ...prev,
        commentsList: editInComments(prev.commentsList || [])
      } : null);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    
    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    // Infinite scroll logic: append more reels when near bottom
    if (scrollHeight - scrollTop <= clientHeight * 3) {
      setReelsList(prev => [
        ...prev, 
        ...SAMPLE_REELS.map(r => ({...r, id: r.id + '_' + Date.now() + Math.random()}))
      ]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h1 className="text-white font-bold text-xl drop-shadow-md">Reels</h1>
        </div>
        <button className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <i className="fa-solid fa-camera text-xl"></i>
        </button>
      </div>

      {/* Reels Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {reelsList.map((reel, index) => (
          <div key={reel.id} className="w-full h-full snap-start">
            <ReelItem 
              reel={reel} 
              isActive={index === activeIndex} 
              onOpenComments={() => setActiveCommentReel(reel)}
              onOpenShare={() => setActiveShareReel(reel)}
            />
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {activeCommentReel && (
        <CommentPage
          post={{
            id: activeCommentReel.id,
            author: activeCommentReel.author,
            authorId: activeCommentReel.author,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(activeCommentReel.author)}&background=random`,
            content: activeCommentReel.description,
            image: activeCommentReel.url,
            timestamp: 'Just now',
            likes: activeCommentReel.likes,
            comments: activeCommentReel.commentsList || [],
            shares: activeCommentReel.shares,
            isLiked: false,
            reactions: { ...EMPTY_REACTIONS },
            privacy: 'public',
            createdAt: Date.now()
          } as any}
          onClose={() => setActiveCommentReel(null)}
          onAddComment={handleAddComment}
          onToggleCommentReaction={handleToggleCommentReaction}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
        />
      )}

      {/* Share Modal */}
      {activeShareReel && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex flex-col justify-end" onClick={() => setActiveShareReel(null)}>
          <div className="bg-white dark:bg-gray-900 w-full rounded-t-2xl p-4 animate-in slide-in-from-bottom-full duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg dark:text-white">Share Reel</h3>
              <button onClick={() => setActiveShareReel(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <i className="fa-solid fa-xmark dark:text-white"></i>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleShare('Messenger')} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <i className="fa-brands fa-facebook-messenger"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold dark:text-white">Send in Messenger</p>
                  <p className="text-sm text-gray-500">Share privately with friends</p>
                </div>
              </button>
              <button onClick={() => handleShare('Profile Feed')} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold dark:text-white">Share to Feed</p>
                  <p className="text-sm text-gray-500">Post on your timeline</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-in slide-in-from-bottom-10 fade-in flex items-center gap-2">
          <i className="fa-solid fa-check-circle text-green-400"></i>
          {toastMessage}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default ReelsPage;
