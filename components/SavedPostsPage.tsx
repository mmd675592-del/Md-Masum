
import React from 'react';
import { Post, ReactionCounts } from '../types';
import Feed from './Feed';

interface SavedPostsPageProps {
  posts: Post[];
  onBack: () => void;
  onToggleReaction: (postId: string, type: keyof ReactionCounts) => void;
  onAddComment: (postId: string, text: string, image?: string, sticker?: string, parentId?: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onUnsavePost: (postId: string) => void;
}

const SavedPostsPage: React.FC<SavedPostsPageProps> = ({ 
  posts, onBack, onToggleReaction, onAddComment, onNavigateToProfile, onUnsavePost 
}) => {
  return (
    <div className="fixed inset-0 z-[250] bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 bg-white dark:bg-[#242526] sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Saved</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {posts.length > 0 ? (
          <div className="max-w-xl mx-auto py-4">
            <div className="px-4 mb-4">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Your saved items</h3>
            </div>
            <Feed 
              posts={posts}
              onToggleReaction={onToggleReaction}
              onAddComment={onAddComment}
              onNavigateToProfile={onNavigateToProfile}
              onSavePost={onUnsavePost}
              savedPostIds={posts.map(p => p.id)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 px-10 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-bookmark text-4xl opacity-20"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No saved items</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Items you save will appear here. Find a post you like and choose "Save post" from the menu.</p>
            <button 
              onClick={onBack}
              className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPostsPage;
