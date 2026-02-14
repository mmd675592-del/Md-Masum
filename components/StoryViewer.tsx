
import React, { useState, useEffect, useRef } from 'react';
import { Story, ReactionCounts, PrivacyType } from '../types';
import { REACTION_DATA } from './Feed';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onToggleReaction: (storyId: string, type: keyof ReactionCounts) => void;
  onDeleteStory: (storyId: string) => void;
  onUpdatePrivacy: (storyId: string, privacy: PrivacyType) => void;
  onReplyMessage?: (userId: string, text: string) => void;
  onNavigateToProfile?: (userId: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ 
  stories, initialIndex, onClose, onToggleReaction, onDeleteStory, onUpdatePrivacy, onReplyMessage, onNavigateToProfile 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const STORY_DURATION = 5000;

  const story = stories[currentIndex];
  const isMine = story.userId === 'me';

  useEffect(() => {
    setProgress(0);
    setIsVideoPlaying(false);
    
    // If it's a video, progress is handled by video duration or standard time
    // But usually video stories play until end.
    const interval = setInterval(() => {
      if (showViewers || showMenu || replyText.length > 0) return; // Pause if modals are open or typing
      
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        // If video is playing, use video's duration if available
        if (story.video && videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          if (duration) return (currentTime / duration) * 100;
          return prev;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, showViewers, showMenu, replyText, story.video]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleReaction = (type: keyof ReactionCounts) => {
    onToggleReaction(story.id, type);
    handleNext();
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !onReplyMessage) return;
    onReplyMessage(story.userId, replyText);
    setReplyText('');
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 flex gap-1.5 px-4 z-30">
        {stories.map((_, index) => (
          <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' }}
            ></div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-0 right-0 p-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigateToProfile?.(story.userId)}
            className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img src={story.userAvatar} alt={story.username} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
               <p 
                onClick={() => onNavigateToProfile?.(story.userId)}
                className="text-white font-bold text-sm drop-shadow-md cursor-pointer hover:underline"
               >
                 {story.username}
               </p>
               {story.taggedFriends && story.taggedFriends.length > 0 && (
                 <p className="text-white/80 text-[10px]">with <span className="font-bold">{story.taggedFriends[0]}</span></p>
               )}
            </div>
            <p className="text-white/70 text-[10px]">Just now • <i className={`fa-solid ${story.privacy === 'public' ? 'fa-earth-americas' : story.privacy === 'friends' ? 'fa-user-group' : 'fa-lock'}`}></i></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isMine && (
            <button onClick={() => setShowMenu(true)} className="w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center"><i className="fa-solid fa-ellipsis"></i></button>
          )}
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full h-full flex items-center justify-center relative z-10">
        <div className="absolute inset-0 z-20 flex">
          <div className="w-1/3 h-full" onClick={handlePrev}></div>
          <div className="w-1/3 h-full"></div>
          <div className="w-1/3 h-full" onClick={handleNext}></div>
        </div>
        
        {story.video ? (
          <video 
            ref={videoRef}
            src={story.video} 
            className="w-full h-auto max-h-full object-contain" 
            autoPlay 
            playsInline
            onEnded={handleNext}
          />
        ) : story.text ? (
          <div className={`w-full h-full ${story.theme} flex items-center justify-center p-12 text-center`}>
            <p className={`${story.fontStyle} text-3xl font-bold drop-shadow-lg text-white`}>
              {story.text}
            </p>
          </div>
        ) : (
          <img src={story.image} className="w-full h-auto max-h-full object-contain" alt="Story" />
        )}
      </div>

      {/* Footer Area */}
      <div className="absolute bottom-10 left-0 right-0 px-6 z-30 flex flex-col gap-6">
        {isMine ? (
          <button 
            onClick={() => setShowViewers(true)}
            className="flex items-center gap-2 text-white bg-black/40 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
          >
            <i className="fa-solid fa-eye text-sm"></i>
            <span className="text-sm font-bold">{story.viewers.length} Viewers</span>
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-2">
              <input 
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write message..." 
                className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/60 text-sm"
              />
              {replyText.length > 0 && (
                <button onClick={handleSendReply} className="text-white">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {Object.entries(REACTION_DATA).slice(0, 6).map(([key, data]) => (
                <button 
                  key={key} 
                  onClick={() => handleReaction(key as keyof ReactionCounts)}
                  className="text-2xl hover:scale-125 transition-transform active:scale-90"
                >
                  {data.emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Viewers Bottom Sheet */}
      {showViewers && (
        <div className="fixed inset-0 z-[250] bg-black/60 flex items-end" onClick={() => setShowViewers(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-users text-green-600"></i>
              Story Details
            </h3>
            <div className="space-y-4">
              {story.viewers.length > 0 ? story.viewers.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={v.avatar} className="w-12 h-12 rounded-lg object-cover border" />
                    <div>
                      <p className="font-bold text-gray-800">{v.name}</p>
                      <p className="text-xs text-gray-500">Viewed just now</p>
                    </div>
                  </div>
                  {v.reaction && (
                    <span className="text-2xl">{REACTION_DATA[v.reaction].emoji}</span>
                  )}
                </div>
              )) : (
                <div className="py-10 text-center text-gray-400">No viewers yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-[250] bg-black/60 flex items-end" onClick={() => setShowMenu(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="space-y-2">
              <button 
                onClick={() => { onDeleteStory(story.id); onClose(); }}
                className="w-full flex items-center gap-4 p-4 text-red-600 font-bold hover:bg-red-50 rounded-xl"
              >
                <i className="fa-solid fa-trash"></i> Delete Story
              </button>
              <div className="border-t my-2"></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase p-2">Change Privacy</p>
              {(['public', 'friends', 'only_me'] as PrivacyType[]).map(p => (
                <button 
                  key={p}
                  onClick={() => { onUpdatePrivacy(story.id, p); setShowMenu(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl ${story.privacy === p ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`}
                >
                  <span className="capitalize">{p.replace('_', ' ')}</span>
                  {story.privacy === p && <i className="fa-solid fa-check"></i>}
                </button>
              ))}
              <button onClick={() => setShowMenu(false)} className="w-full mt-4 py-4 bg-gray-100 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
