
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, ReactionCounts } from '../types';
import CommentPage from './CommentPage';

interface FeedProps {
  posts: Post[];
  onToggleReaction?: (postId: string, type: keyof ReactionCounts) => void;
  onToggleCommentReaction?: (postId: string, commentId: string, type: keyof ReactionCounts) => void;
  onAddComment?: (postId: string, text: string, image?: string, sticker?: string, parentId?: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onEditComment?: (postId: string, commentId: string, newText: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onSharePost?: (post: Post, caption?: string) => void;
  onShareToMessenger?: (post: Post) => void;
  onNavigateToProfile?: (userId: string) => void;
  onSavePost?: (postId: string) => void;
  savedPostIds?: string[];
}

export const REACTION_DATA: Record<keyof ReactionCounts, { label: string; icon: string; color: string; emoji: string }> = {
  like: { label: 'Like', icon: 'fa-thumbs-up', color: 'text-blue-500', emoji: '👍' },
  love: { label: 'Love', icon: 'fa-heart', color: 'text-pink-600', emoji: '❤️' },
  haha: { label: 'Haha', icon: 'fa-face-grin-stars', color: 'text-yellow-500', emoji: '🤩' },
  wow: { label: 'Wow', icon: 'fa-face-surprise', color: 'text-yellow-500', emoji: '😲' },
  care: { label: 'Care', icon: 'fa-face-smile', color: 'text-yellow-500', emoji: '🙂' },
  angry: { label: 'Angry', icon: 'fa-face-angry', color: 'text-orange-600', emoji: '🤬' },
  sad: { label: 'Sad', icon: 'fa-face-sad-tear', color: 'text-yellow-600', emoji: '😔' },
};

const playReactionSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error('Audio error:', e);
  }
};

const vibrate = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

const ShareMenu: React.FC<{ onShare: () => void; onMessenger: () => void; onClose: () => void }> = ({ onShare, onMessenger, onClose }) => (
  <div className="absolute bottom-full right-0 mb-3 bg-white dark:bg-[#242526] border dark:border-gray-700 shadow-2xl p-2 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100] w-56 flex flex-col gap-1">
    <button 
      onClick={() => { onShare(); onClose(); }}
      className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <i className="fa-solid fa-share text-sm"></i>
      </div>
      Share to Timeline
    </button>
    <button 
      onClick={() => { onMessenger(); onClose(); }}
      className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <i className="fa-brands fa-facebook-messenger text-blue-600 dark:text-blue-400 text-sm"></i>
      </div>
      Send in Messenger
    </button>
    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
    <button 
      onClick={onClose}
      className="p-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
    >
      Cancel
    </button>
  </div>
);

const ReactionPicker: React.FC<{ onSelect: (type: keyof ReactionCounts) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
  <div 
    className="absolute bottom-full left-0 mb-3 flex items-center gap-1 bg-white dark:bg-[#242526] border dark:border-gray-700 shadow-2xl p-2 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100] origin-bottom-left"
  >
    {['love', 'angry', 'wow', 'haha', 'care'].map((key, index) => {
      const data = REACTION_DATA[key as keyof ReactionCounts];
      return (
        <button 
          key={key}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(key as keyof ReactionCounts);
            onClose();
          }} 
          className="relative group/emoji px-1 hover:scale-125 transition-transform active:scale-95 duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="text-3xl p-1 cursor-pointer">
            {data.emoji}
          </div>
        </button>
      );
    })}
  </div>
);

const Feed: React.FC<FeedProps> = ({ 
  posts = [], onToggleReaction, onToggleCommentReaction, onAddComment, onDeleteComment, onEditComment,
  onDeletePost, onEditPost, onSharePost, onShareToMessenger, onNavigateToProfile, onSavePost, savedPostIds = []
}) => {
  const [activeReactionPost, setActiveReactionPost] = useState<string | null>(null);
  const [activeShareMenuPost, setActiveShareMenuPost] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const longPressTimer = useRef<number | null>(null);

  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < posts.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  const visiblePosts = posts.slice(0, visibleCount);

  const handleToggleReaction = (postId: string, type: keyof ReactionCounts) => {
    onToggleReaction?.(postId, type);
    playReactionSound();
    vibrate();
  };

  const startLongPress = (postId: string) => {
    longPressTimer.current = window.setTimeout(() => {
      setActiveReactionPost(postId);
      vibrate();
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const getPrivacyIcon = (privacy?: string) => {
    switch(privacy) {
      case 'friends': return 'fa-user-group';
      case 'only_me': return 'fa-lock';
      default: return 'fa-earth-americas';
    }
  };

  const getTotalReactions = (reactions: ReactionCounts) => {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((a, b) => a + (b || 0), 0);
  };

  const getActiveEmojis = (reactions: ReactionCounts) => {
    if (!reactions) return [];
    return Object.entries(reactions)
      .filter(([_, count]) => (count || 0) > 0)
      .map(([key]) => REACTION_DATA[key as keyof ReactionCounts]?.emoji)
      .filter(Boolean);
  };

  return (
    <div className="space-y-4 pb-24">
      {visiblePosts.map((post) => {
        if (!post) return null;
        const userReacted = post.userReaction;
        const currentReaction = userReacted ? REACTION_DATA[userReacted] : null;
        const totalReacts = getTotalReactions(post.reactions);
        const activeEmojis = Array.from(new Set(getActiveEmojis(post.reactions)));

        return (
          <div id={`post-${post.id}`} key={post.id} className="bg-white dark:bg-[#242526] md:rounded-xl shadow-sm overflow-hidden border-b dark:border-gray-800 transition-colors">
            {/* Header */}
            <div className="p-3 flex items-start justify-between">
              <div className="flex gap-3">
                <div onClick={() => onNavigateToProfile?.(post.authorId)} className="w-11 h-11 rounded-xl overflow-hidden border dark:border-gray-700 cursor-pointer shadow-sm">
                  <img 
                    src={post.avatar || `https://i.pravatar.cc/150?u=${post.authorId}`} 
                    alt={post.author} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`;
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-[15px] text-gray-900 dark:text-gray-100">
                    <span onClick={() => onNavigateToProfile?.(post.authorId)} className="font-bold cursor-pointer hover:underline">
                      {post.author}
                    </span>
                    {post.isNews && <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">News</span>}
                    {post.feeling && (
                      <span className="font-normal text-gray-600 dark:text-gray-400 text-[14px]">
                        {' is feeling '}
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {post.feeling.emoji} {post.feeling.text}
                        </span>
                      </span>
                    )}
                    {post.taggedFriends && post.taggedFriends.length > 0 && (
                      <span className="font-normal text-gray-600 dark:text-gray-400 text-[14px]">
                        {' with '}
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {post.taggedFriends[0]}
                          {post.taggedFriends.length > 1 && ` and ${post.taggedFriends.length - 1} others`}
                        </span>
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-500 font-bold">{post.timestamp}</span>
                    <i className={`fa-solid ${getPrivacyIcon(post.privacy)} text-[9px] text-gray-400`}></i>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePostMenuId(activePostMenuId === post.id ? null : post.id);
                  }} 
                  className="text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>

                {activePostMenuId === post.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActivePostMenuId(null)}></div>
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 space-y-1">
                        <button 
                          onClick={() => {
                            onSavePost?.(post.id);
                            setActivePostMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors">
                            <i className={`fa-solid ${savedPostIds.includes(post.id) ? 'fa-bookmark' : 'fa-regular fa-bookmark'}`}></i>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                              {savedPostIds.includes(post.id) ? 'Unsave Post' : 'Save Post'}
                            </span>
                            <span className="text-[10px] text-gray-500">Add this to your saved items</span>
                          </div>
                        </button>

                        {post.authorId === 'me' && (
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this post?')) {
                                onDeletePost?.(post.id);
                              }
                              setActivePostMenuId(null);
                            }}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 transition-colors">
                              <i className="fa-solid fa-trash-can"></i>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-bold text-red-600 block">Delete Post</span>
                              <span className="text-[10px] text-red-400">Remove this post permanently</span>
                            </div>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => setActivePostMenuId(null)}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors">
                            <i className="fa-solid fa-bell-slash"></i>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Turn off notifications</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className={post.theme ? "px-4 pb-4" : "px-4 pb-3"}>
              {post.content && (
                post.theme ? (
                  <div className={`${post.theme} ${post.fontStyle || ''} rounded-xl overflow-hidden`}>
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
                ) : (
                  <p className={`text-[15px] text-gray-800 dark:text-gray-200 mb-2 leading-snug whitespace-pre-wrap ${post.fontStyle || ''}`}>{post.content}</p>
                )
              )}
              {post.link && (
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mb-3 text-sm font-bold text-green-600 hover:underline"
                >
                  আরও পড়ুন (Read More) →
                </a>
              )}
              {post.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    {post.image.startsWith('data:video/') || post.image.includes('.mp4') ? (
                      <video src={post.image} className="w-full h-auto max-h-[500px]" controls />
                    ) : (
                      <img src={post.image} className="w-full h-auto object-cover max-h-[500px]" alt="post content" referrerPolicy="no-referrer" />
                    )}
                  </div>
              )}

              {post.sharedPost && (
                <div className="mt-3 border dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-black/20">
                  <div className="p-3 flex items-center gap-2 border-b dark:border-gray-800">
                    <div className="w-6 h-6 rounded-md overflow-hidden">
                      <img src={post.sharedPost.avatar} alt={post.sharedPost.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-xs text-gray-900 dark:text-gray-100">
                      <span className="font-bold">{post.sharedPost.author}</span>
                      {post.sharedPost.feeling && (
                        <span className="font-normal text-gray-600 dark:text-gray-400">
                          {' is feeling '}
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {post.sharedPost.feeling.emoji} {post.sharedPost.feeling.text}
                          </span>
                        </span>
                      )}
                      {post.sharedPost.taggedFriends && post.sharedPost.taggedFriends.length > 0 && (
                        <span className="font-normal text-gray-600 dark:text-gray-400">
                          {' with '}
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {post.sharedPost.taggedFriends[0]}
                            {post.sharedPost.taggedFriends.length > 1 && ` and ${post.sharedPost.taggedFriends.length - 1} others`}
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-500">{post.sharedPost.timestamp}</span>
                  </div>
                  <div className={post.sharedPost.theme ? "p-0" : "p-3"}>
                    {post.sharedPost.content && (
                      post.sharedPost.theme ? (
                        <div className={`${post.sharedPost.theme} ${post.sharedPost.fontStyle || ''}`}>
                          <p className="whitespace-pre-wrap">{post.sharedPost.content}</p>
                        </div>
                      ) : (
                        <p className={`text-sm text-gray-800 dark:text-gray-200 mb-2 leading-snug whitespace-pre-wrap ${post.sharedPost.fontStyle || ''}`}>{post.sharedPost.content}</p>
                      )
                    )}
                    {post.sharedPost.image && (
                      post.sharedPost.image.startsWith('data:video/') || post.sharedPost.image.includes('.mp4') ? (
                        <video src={post.sharedPost.image} className="w-full h-auto rounded-lg max-h-[300px]" controls />
                      ) : (
                        <img src={post.sharedPost.image} className="w-full h-auto rounded-lg max-h-[300px] object-cover" alt="shared content" referrerPolicy="no-referrer" />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Summary Bar */}
            <div className="px-4 py-2 flex items-center justify-between border-t border-b dark:border-gray-800 bg-gray-50/30 dark:bg-black/10">
              <div className="flex items-center gap-1.5">
                {totalReacts > 0 && (
                  <div className="flex items-center">
                    <div className="flex items-center -space-x-1">
                      {activeEmojis.slice(0, 3).map((emoji, i) => (
                        <span key={i} className="text-sm drop-shadow-sm z-10 relative" style={{ zIndex: 3 - i }}>{emoji}</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-bold ml-6">{totalReacts}</span>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-gray-500 font-bold flex gap-3 uppercase tracking-tighter">
                <button onClick={() => setActiveCommentPostId(post.id)} className="hover:underline">{post.comments?.length || 0} comments</button>
                <span>•</span>
                <span>{post.sharesCount || 0} shares</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-around py-1 relative">
              <div className="flex-1 relative">
                <button 
                  onClick={() => {
                    if (!activeReactionPost) {
                      handleToggleReaction(post.id, userReacted || 'like');
                    }
                  }}
                  onMouseDown={() => startLongPress(post.id)}
                  onMouseUp={endLongPress}
                  onMouseLeave={endLongPress}
                  onTouchStart={() => startLongPress(post.id)}
                  onTouchEnd={endLongPress}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors ${currentReaction ? currentReaction.color : 'text-gray-500'}`}
                >
                  <i className={`fa-solid ${currentReaction ? currentReaction.icon : 'fa-thumbs-up'} text-lg`}></i>
                  {currentReaction ? currentReaction.label : 'Like'}
                </button>
                {activeReactionPost === post.id && (
                  <ReactionPicker onSelect={(t) => handleToggleReaction(post.id, t)} onClose={() => setActiveReactionPost(null)} />
                )}
              </div>
              <button onClick={() => setActiveCommentPostId(post.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 font-bold text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <i className="fa-regular fa-comment text-lg"></i> Comment
              </button>
              <div className="flex-1 relative">
                <button 
                  onClick={() => setActiveShareMenuPost(activeShareMenuPost === post.id ? null : post.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 font-bold text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <i className="fa-solid fa-share text-lg"></i> Share
                </button>
                {activeShareMenuPost === post.id && (
                  <ShareMenu 
                    onShare={() => onSharePost?.(post)} 
                    onMessenger={() => onShareToMessenger?.(post)} 
                    onClose={() => setActiveShareMenuPost(null)} 
                  />
                )}
              </div>
            </div>

            {activeCommentPostId === post.id && (
              <CommentPage 
                post={post} 
                onClose={() => setActiveCommentPostId(null)} 
                onAddComment={onAddComment!} 
                onToggleCommentReaction={onToggleCommentReaction!} 
                onDeleteComment={onDeleteComment!} 
                onEditComment={onEditComment!} 
                onNavigateToProfile={onNavigateToProfile}
              />
            )}
          </div>
        );
      })}

      {hasMore && (
        <div ref={observerTarget} className="py-6 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading more posts...</p>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="py-6 text-center">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">You've caught up on all posts!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
