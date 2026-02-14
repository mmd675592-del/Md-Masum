
import React, { useRef, useState } from 'react';
import { Story, PrivacyType } from '../types';

interface StorySectionProps {
  stories: Story[];
  onAddStory: (params: { image?: string; video?: string; text?: string; theme?: string; fontStyle?: string; privacy: PrivacyType; taggedFriends: string[] }) => void;
  onViewStory: (index: number) => void;
  currentUserAvatar?: string;
}

const FRIENDS = ['Akash', 'MD ROHIT', 'Runa', 'Farso', 'Tanvir'];

const STORY_THEMES = [
  { id: 'blue', bg: 'bg-gradient-to-br from-blue-600 to-blue-400', text: 'text-white' },
  { id: 'green', bg: 'bg-gradient-to-br from-green-600 to-emerald-400', text: 'text-white' },
  { id: 'purple', bg: 'bg-gradient-to-br from-purple-600 to-pink-500', text: 'text-white' },
  { id: 'orange', bg: 'bg-gradient-to-br from-orange-500 to-yellow-400', text: 'text-white' },
  { id: 'dark', bg: 'bg-gray-900', text: 'text-white' },
  { id: 'love', bg: 'bg-red-500', text: 'text-white' },
];

const STORY_FONTS = [
  { name: 'Default', class: 'font-sans' },
  { name: 'Elegant', class: 'font-serif' },
  { name: 'Modern', class: 'font-mono' },
  { name: 'Bold', class: 'font-extrabold tracking-tight' },
];

const StorySection: React.FC<StorySectionProps> = ({ stories, onAddStory, onViewStory, currentUserAvatar }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [creationType, setCreationType] = useState<'media' | 'text'>('media');
  
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingVideo, setPendingVideo] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(STORY_THEMES[0]);
  const [selectedFont, setSelectedFont] = useState(STORY_FONTS[0]);
  
  const [privacy, setPrivacy] = useState<PrivacyType>('public');
  const [taggedFriends, setTaggedFriends] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (file.type.startsWith('video/')) {
            setPendingVideo(event.target.result as string);
            setPendingImage(null);
          } else {
            setPendingImage(event.target.result as string);
            setPendingVideo(null);
          }
          setCreationType('media');
          setShowConfig(true);
          setShowTypeSelector(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (creationType === 'media' && (pendingImage || pendingVideo)) {
      onAddStory({ image: pendingImage || undefined, video: pendingVideo || undefined, privacy, taggedFriends });
    } else if (creationType === 'text' && pendingText.trim()) {
      onAddStory({ 
        text: pendingText, 
        theme: `${selectedTheme.bg} ${selectedTheme.text}`, 
        fontStyle: selectedFont.class, 
        privacy, 
        taggedFriends 
      });
    }

    // Reset
    setPendingImage(null);
    setPendingVideo(null);
    setPendingText('');
    setShowConfig(false);
    setTaggedFriends([]);
  };

  const openTextStory = () => {
    setCreationType('text');
    setShowConfig(true);
    setShowTypeSelector(false);
  };

  const avatarUrl = currentUserAvatar || "https://i.pravatar.cc/150?u=me";

  return (
    <div className="bg-white dark:bg-[#242526] py-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 min-w-max">
        {/* Create Story Button */}
        <div 
          onClick={() => setShowTypeSelector(true)}
          className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden shadow-sm group cursor-pointer transition-transform active:scale-95 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="h-3/4 w-full overflow-hidden">
            <img 
              src={avatarUrl} 
              alt="My Profile" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-white dark:bg-[#242526] flex flex-col items-center justify-center">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-green-600 border-4 border-white dark:border-[#242526] flex items-center justify-center text-white shadow-md">
              <i className="fa-solid fa-plus text-sm"></i>
            </div>
            <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 mt-2">Create Story</p>
          </div>
        </div>

        {/* Existing Stories */}
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            onClick={() => onViewStory(index)}
            className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden shadow-sm group cursor-pointer transition-transform active:scale-95"
          >
            {story.video ? (
              <video src={story.video} className="w-full h-full object-cover" muted playsInline />
            ) : story.text ? (
              <div className={`w-full h-full ${story.theme} flex items-center justify-center p-2 text-center`}>
                <p className={`${story.fontStyle} text-[10px] font-bold line-clamp-4`}>{story.text}</p>
              </div>
            ) : (
              <img src={story.image} alt={story.username} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
            <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-4 border-green-600 overflow-hidden bg-white z-10 shadow-md">
              <img src={story.userAvatar} alt={story.username} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <p className="text-white text-[11px] font-bold leading-tight drop-shadow-lg truncate">
                {story.username}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Story Type Selector */}
      {showTypeSelector && (
        <div className="fixed inset-0 z-[350] bg-black/60 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Create a Story</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg">
                  <i className="fa-solid fa-images"></i>
                </div>
                <span className="font-bold text-blue-700 dark:text-blue-300">Media</span>
              </button>
              <button 
                onClick={openTextStory}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-green-50 dark:bg-green-900/10 hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg">
                  <i className="fa-solid fa-font"></i>
                </div>
                <span className="font-bold text-green-700 dark:text-green-300">Text</span>
              </button>
            </div>
            <button onClick={() => setShowTypeSelector(false)} className="w-full mt-6 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
        </div>
      )}

      {/* Story Creation Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-[400] bg-white dark:bg-[#18191a] animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
            <button onClick={() => setShowConfig(false)} className="p-2 text-gray-700 dark:text-gray-300"><i className="fa-solid fa-arrow-left text-xl"></i></button>
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {creationType === 'text' ? 'Text Story' : (pendingVideo ? 'Video Story' : 'Photo Story')}
            </h2>
            <button 
              onClick={handleCreate} 
              disabled={creationType === 'text' && !pendingText.trim()}
              className={`bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition-all active:scale-95 ${creationType === 'text' && !pendingText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Share
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {/* Story Preview Area */}
            <div className="mb-8 flex justify-center">
              <div className={`w-64 h-[400px] rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-2xl relative flex items-center justify-center
                ${creationType === 'text' ? `${selectedTheme.bg} ${selectedTheme.text} p-6` : 'bg-black'}`}>
                
                {creationType === 'media' ? (
                  pendingVideo ? (
                    <video src={pendingVideo} className="w-full h-full object-contain" autoPlay muted loop />
                  ) : (
                    <img src={pendingImage!} className="w-full h-full object-contain" />
                  )
                ) : (
                  <textarea
                    autoFocus
                    placeholder="Type something..."
                    value={pendingText}
                    onChange={(e) => setPendingText(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none resize-none text-center font-bold text-2xl placeholder:text-white/50 ${selectedFont.class}`}
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-6 max-w-sm mx-auto w-full">
              {creationType === 'text' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Themes</label>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                      {STORY_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme)}
                          className={`w-10 h-10 rounded-lg flex-shrink-0 border-2 transition-all ${selectedTheme.id === theme.id ? 'border-green-600 scale-110 shadow-md' : 'border-white shadow-sm'} ${theme.bg}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Fonts</label>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                      {STORY_FONTS.map((font) => (
                        <button
                          key={font.name}
                          onClick={() => setSelectedFont(font)}
                          className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap text-sm transition-all ${selectedFont.class === font.class ? 'border-green-600 bg-green-50 text-green-700 font-bold' : 'border-gray-100 bg-white text-gray-600'}`}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Privacy</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['public', 'friends', 'only_me'] as PrivacyType[]).map((p) => (
                    <button 
                      key={p}
                      onClick={() => setPrivacy(p)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-bold capitalize transition-all ${privacy === p ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 text-gray-500'}`}
                    >
                      {p.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tag Friends</label>
                <div className="flex flex-wrap gap-2">
                  {FRIENDS.map(friend => (
                    <button 
                      key={friend}
                      onClick={() => setTaggedFriends(prev => prev.includes(friend) ? prev.filter(f => f !== friend) : [...prev, friend])}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${taggedFriends.includes(friend) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                    >
                      {friend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySection;
