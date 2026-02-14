
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, ReactionCounts } from '../types';
import { REACTION_DATA } from './Feed';

interface CommentPageProps {
  post: Post;
  onClose: () => void;
  onAddComment: (postId: string, text: string, image?: string, sticker?: string, parentId?: string) => void;
  onToggleCommentReaction: (postId: string, commentId: string, type: keyof ReactionCounts) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onEditComment: (postId: string, commentId: string, newText: string) => void;
  onNavigateToProfile?: (userId: string) => void;
}

const BENGALI_STICKERS = [
  { id: 's1', text: 'দারুণ!', color: 'bg-green-500' },
  { id: 's2', text: 'অসাধারণ', color: 'bg-blue-500' },
  { id: 's3', text: 'শুভকামনা', color: 'bg-pink-500' },
  { id: 's4', text: 'মন ছুঁয়ে গেল', color: 'bg-purple-500' },
  { id: 's5', text: 'একমত 👍', color: 'bg-orange-500' },
  { id: 's6', text: 'কি কিউট!', color: 'bg-rose-400' },
];

const CommentPage: React.FC<CommentPageProps> = ({ 
  post, onClose, onAddComment, onToggleCommentReaction, onDeleteComment, onEditComment, onNavigateToProfile 
}) => {
  const [inputText, setInputText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [longPressedComment, setLongPressedComment] = useState<Comment | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pressTimer = useRef<number | null>(null);

  const handleSendComment = (text: string = inputText, sticker?: string) => {
    if (!text.trim() && !selectedImage && !sticker) return;
    
    if (editingCommentId) {
      onEditComment(post.id, editingCommentId, text);
      setEditingCommentId(null);
    } else {
      onAddComment(post.id, text, selectedImage || undefined, sticker, replyingTo?.id);
    }
    
    setInputText('');
    setSelectedImage(null);
    setShowStickers(false);
    setReplyingTo(null);
  };

  const startPress = (comment: Comment) => {
    pressTimer.current = window.setTimeout(() => {
      setLongPressedComment(comment);
    }, 600);
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo({ id: comment.id, name: comment.author });
    setEditingCommentId(null);
    setLongPressedComment(null);
    inputRef.current?.focus();
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setInputText(comment.text);
    setReplyingTo(null);
    setLongPressedComment(null);
    inputRef.current?.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getTotalCommentReactions = (reactions: ReactionCounts) => {
    return Object.values(reactions).reduce((a, b) => a + b, 0);
  };

  const getCommentActiveEmojis = (reactions: ReactionCounts) => {
    return Object.entries(reactions)
      .filter(([_, count]) => count > 0)
      .map(([key]) => REACTION_DATA[key as keyof ReactionCounts].emoji);
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const userReacted = comment.userReaction;
    const commReaction = userReacted ? REACTION_DATA[userReacted] : null;
    const totalReacts = getTotalCommentReactions(comment.reactions);
    const activeEmojis = getCommentActiveEmojis(comment.reactions);

    return (
      <div key={comment.id} className={`${isReply ? 'ml-10 mt-3' : 'mt-4'} animate-in fade-in duration-300`}>
        <div 
          className="flex gap-2 items-start relative group"
          onMouseDown={() => startPress(comment)}
          onMouseUp={endPress}
          onMouseLeave={endPress}
          onTouchStart={() => startPress(comment)}
          onTouchEnd={endPress}
        >
          <div 
            onClick={() => onNavigateToProfile?.(comment.userId)}
            className={`${isReply ? 'w-7 h-7' : 'w-10 h-10'} rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 cursor-pointer hover:opacity-90`}
          >
            <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-1">
              <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border border-gray-100 inline-block max-w-[90%] active:bg-gray-50 transition-colors">
                <p onClick={() => onNavigateToProfile?.(comment.userId)} className={`${isReply ? 'text-[11px]' : 'text-xs'} font-bold text-gray-900 mb-0.5 cursor-pointer hover:underline`}>{comment.author}</p>
                {comment.text && <p className={`${isReply ? 'text-[13px]' : 'text-[14px]'} text-gray-800 leading-tight mb-1`}>{comment.text}</p>}
                {comment.image && (
                  <img src={comment.image} alt="Comment Attachment" className="rounded-lg max-h-48 w-auto mt-2 mb-1 border border-gray-100" />
                )}
                {comment.sticker && (
                  <div className="mt-2 py-2 px-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-extrabold text-sm drop-shadow-sm">{comment.sticker}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-1 ml-2 text-[10px] font-bold text-gray-500">
              <button 
                onClick={() => onToggleCommentReaction(post.id, comment.id, userReacted || 'like')}
                className={`hover:underline uppercase ${commReaction ? commReaction.color : ''}`}
              >
                {commReaction ? commReaction.label : 'Like'}
              </button>
              <button 
                onClick={() => handleReply(comment)}
                className="cursor-pointer hover:underline uppercase"
              >
                Reply
              </button>
              <span className="font-normal text-gray-400 uppercase">{comment.timestamp}</span>

              {totalReacts > 0 && (
                <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-full shadow-sm border border-gray-100">
                  <span className="flex -space-x-1">
                    {activeEmojis.slice(0, 3).map((emoji, i) => (
                      <span key={i} className="text-[9px]">{emoji}</span>
                    ))}
                  </span>
                  <span className="text-[9px] text-gray-600 font-extrabold ml-1">
                    {totalReacts}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-gray-100 ml-5">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-arrow-left text-xl text-gray-700"></i>
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Comments on {post.author}'s Post</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.comments.length} Comments Total</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 pb-32">
        {post.comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-50">
            <i className="fa-solid fa-comments text-5xl mb-4"></i>
            <p className="font-medium">No comments yet. Be the first to reply!</p>
          </div>
        ) : (
          post.comments.map(comment => renderComment(comment))
        )}
      </div>

      {longPressedComment && (
        <div 
          className="fixed inset-0 z-[200] bg-black/40 flex items-end animate-in fade-in duration-200"
          onClick={() => setLongPressedComment(null)}
        >
          <div 
            className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-around items-center mb-8 bg-gray-50 py-4 px-2 rounded-2xl border border-gray-100 overflow-x-auto scrollbar-hide">
              {Object.entries(REACTION_DATA).map(([key, data]) => (
                <button 
                  key={key}
                  onClick={() => {
                    onToggleCommentReaction(post.id, longPressedComment.id, key as keyof ReactionCounts);
                    setLongPressedComment(null);
                  }}
                  className="flex flex-col items-center gap-2 hover:scale-125 transition-transform min-w-[50px]"
                >
                  <span className="text-3xl drop-shadow-sm">{data.emoji}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${data.color}`}>{data.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => handleReply(longPressedComment)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-gray-700 font-bold"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-reply"></i>
                </div>
                <span>Reply to Comment</span>
              </button>

              {longPressedComment.userId === 'me' && (
                <>
                  <button 
                    onClick={() => handleEditClick(longPressedComment)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-gray-700 font-bold"
                  >
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-pen"></i>
                    </div>
                    <span>Edit Comment</span>
                  </button>
                  <button 
                    onClick={() => {
                      onDeleteComment(post.id, longPressedComment.id);
                      setLongPressedComment(null);
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-xl transition-colors text-red-600 font-bold"
                  >
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-trash"></i>
                    </div>
                    <span>Delete Comment</span>
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setLongPressedComment(null)}
                className="w-full mt-4 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-20">
        {(replyingTo || editingCommentId) && (
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 mb-2 rounded-lg border border-gray-100 text-[11px] animate-in slide-in-from-bottom-2 duration-200">
            <p className="text-gray-600 font-bold">
              {editingCommentId ? (
                <>Editing comment...</>
              ) : (
                <>Replying to <span className="text-green-600">{replyingTo?.name}</span></>
              )}
            </p>
            <button 
              onClick={() => { setReplyingTo(null); setEditingCommentId(null); setInputText(''); }}
              className="text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        {selectedImage && (
          <div className="relative w-20 h-20 mb-2 rounded-lg overflow-hidden border-2 border-green-500 shadow-md">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-lg">
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        {showStickers && (
          <div className="mb-4 grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
            {BENGALI_STICKERS.map(sticker => (
              <button
                key={sticker.id}
                onClick={() => handleSendComment('', sticker.text)}
                className="py-3 px-2 rounded-lg bg-white border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all flex items-center justify-center text-center shadow-sm"
              >
                <span className="font-bold text-gray-800 text-xs">{sticker.text}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          {!editingCommentId && (
            <>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-green-600 hover:bg-green-50 rounded-full transition-colors flex-shrink-0"
              >
                <i className="fa-solid fa-camera text-lg"></i>
              </button>
              <button 
                onClick={() => setShowStickers(!showStickers)}
                className={`p-2.5 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0 ${showStickers ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <i className="fa-solid fa-note-sticky text-lg"></i>
              </button>
            </>
          )}
          
          <div className="flex-1 bg-gray-100 rounded-[24px] flex items-center px-4 py-1.5 border border-transparent focus-within:bg-white focus-within:border-green-200 transition-all">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={editingCommentId ? "Edit your comment..." : "Write a comment..."}
              rows={1}
              className="w-full bg-transparent outline-none py-1.5 text-[15px] resize-none max-h-32"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
            />
          </div>

          <button 
            onClick={() => handleSendComment()}
            disabled={!inputText.trim() && !selectedImage}
            className={`p-3 rounded-full transition-all flex-shrink-0 ${inputText.trim() || selectedImage ? 'bg-green-600 text-white shadow-lg' : 'text-gray-300'}`}
          >
            <i className={`fa-solid ${editingCommentId ? 'fa-check' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
      
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
    </div>
  );
};

export default CommentPage;
