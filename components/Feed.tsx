
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
  onNavigateToProfile?: (userId: string) => void;
  onSavePost?: (postId: string) => void;
  savedPostIds?: string[];
}

export const REACTION_DATA: Record<keyof ReactionCounts, { label: string; icon: string; color: string; emoji: string }> = {
  like: { label: 'Like', icon: 'fa-thumbs-up', color: 'text-blue-500', emoji: '👍' },
  love: { label: 'Love', icon: 'fa-heart', color: 'text-pink-600', emoji: '❤️' },
  care: { label: 'Care', icon: 'fa-face-grin-hearts', color: 'text-yellow-500', emoji: '🥰' },
  haha: { label: 'Haha', icon: 'fa-face-laugh', color: 'text-yellow-500', emoji: '😆' },
  wow: { label: 'Wow', icon: 'fa-face-surprise', color: 'text-yellow-500', emoji: '😮' },
  sad: { label: 'Sad', icon: 'fa-face-sad-tear', color: 'text-yellow-600', emoji: '😔' },
  angry: { label: 'Angry', icon: 'fa-face-angry', color: 'text-orange-600', emoji: '😡' },
};

const ReactionPicker: React.FC<{ onSelect: (type: keyof ReactionCounts) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
  <div 
    className="absolute bottom-full left-0 mb-3 flex items-center gap-1 bg-white dark:bg-[#242526] border dark:border-gray-700 shadow-2xl p-2 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100] origin-bottom-left"
    onMouseLeave={onClose}
  >
    {Object.entries(REACTION_DATA).map(([key, data], index) => (
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
    ))}
  </div>
);

const Feed: React.FC<FeedProps> = ({ 
  posts = [], onToggleReaction, onToggleCommentReaction, onAddComment, onDeleteComment, onEditComment,
  onDeletePost, onEditPost, onSharePost, onNavigateToProfile, onSavePost, savedPostIds = []
}) => {
  const [activeReactionPost, setActiveReactionPost] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const getPrivacyIcon = (privacy?: string) => {
    switch(privacy) {
      case 'friends': return 'fa-user-group';
      case 'only_me': return 'fa-lock';
      default: return 'fa-earth-americas';
    }
  };

  const showPickerWithDelay = (id: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setActiveReactionPost(id), 400);
  };

  const clearPickerDelay = () => { if (timerRef.current) clearTimeout(timerRef.current); };

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
      {posts.map((post) => {
        if (!post) return null;
        const userReacted = post.userReaction;
        const currentReaction = userReacted ? REACTION_DATA[userReacted] : null;
        const totalReacts = getTotalReactions(post.reactions);
        const activeEmojis = Array.from(new Set(getActiveEmojis(post.reactions)));

        return (
          <div key={post.id} className="bg-white dark:bg-[#242526] md:rounded-xl shadow-sm overflow-hidden border-b dark:border-gray-800 transition-colors">
            {/* Header */}
            <div className="p-3 flex items-start justify-between">
              <div className="flex gap-3">
                <div onClick={() => onNavigateToProfile?.(post.authorId)} className="w-11 h-11 rounded-xl overflow-hidden border dark:border-gray-700 cursor-pointer shadow-sm">
                  <img src={post.avatar || `https://i.pravatar.cc/150?u=${post.authorId}`} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 onClick={() => onNavigateToProfile?.(post.authorId)} className="text-[15px] font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:underline">
                    {post.author}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-500 font-bold">{post.timestamp}</span>
                    <i className={`fa-solid ${getPrivacyIcon(post.privacy)} text-[9px] text-gray-400`}></i>
                  </div>
                </div>
              </div>
              <button onClick={() => setActivePostMenuId(post.id)} className="text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
               {post.content && <p className="text-[15px] text-gray-800 dark:text-gray-200 mb-2 leading-snug whitespace-pre-wrap">{post.content}</p>}
               {post.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <img src={post.image} className="w-full h-auto object-cover max-h-[500px]" alt="post content" />
                  </div>
               )}
            </div>

            {/* Summary Bar */}
            <div className="px-4 py-2 flex items-center justify-between border-t border-b dark:border-gray-800 bg-gray-50/30 dark:bg-black/10">
              <div className="flex items-center gap-1.5">
                {totalReacts > 0 && (
                  <div className="flex items-center -space-x-1">
                    {activeEmojis.slice(0, 3).map((emoji, i) => (
                      <span key={i} className="text-sm drop-shadow-sm">{emoji}</span>
                    ))}
                    <span className="text-xs text-gray-500 font-bold ml-2">{totalReacts}</span>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-gray-500 font-bold flex gap-3 uppercase tracking-tighter">
                 <button onClick={() => setActiveCommentPostId(post.id)} className="hover:underline">{post.comments?.length || 0} comments</button>
                 <span>•</span>
                 <span>shares</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-around py-1 relative">
              <div 
                className="flex-1 relative"
                onMouseEnter={() => showPickerWithDelay(post.id)}
                onMouseLeave={() => { clearPickerDelay(); setActiveReactionPost(null); }}
              >
                <button 
                  onClick={() => onToggleReaction?.(post.id, userReacted || 'like')}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors ${currentReaction ? currentReaction.color : 'text-gray-500'}`}
                >
                  <i className={`fa-solid ${currentReaction ? currentReaction.icon : 'fa-thumbs-up'} text-lg`}></i>
                  {currentReaction ? currentReaction.label : 'Like'}
                </button>
                {activeReactionPost === post.id && (
                   <ReactionPicker onSelect={(t) => onToggleReaction?.(post.id, t)} onClose={() => setActiveReactionPost(null)} />
                )}
              </div>
              <button onClick={() => setActiveCommentPostId(post.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 font-bold text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <i className="fa-regular fa-comment text-lg"></i> Comment
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 font-bold text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <i className="fa-solid fa-share text-lg"></i> Share
              </button>
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
    </div>
  );
};

export default Feed;
