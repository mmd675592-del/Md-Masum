
import React, { useState, useEffect, useRef } from 'react';

interface Theme {
  id: string;
  bg: string;
  text: string;
}

interface FontStyle {
  name: string;
  class: string;
}

type PrivacyType = 'public' | 'friends' | 'only_me';

interface Feeling {
  emoji: string;
  text: string;
  color: string;
}

const THEMES: Theme[] = [
  { id: 'none', bg: 'bg-white', text: 'text-gray-900' },
  { id: 'blue', bg: 'bg-gradient-to-br from-blue-600 to-blue-400', text: 'text-white' },
  { id: 'green', bg: 'bg-gradient-to-br from-green-600 to-emerald-400', text: 'text-white' },
  { id: 'purple', bg: 'bg-gradient-to-br from-purple-600 to-pink-500', text: 'text-white' },
  { id: 'orange', bg: 'bg-gradient-to-br from-orange-500 to-yellow-400', text: 'text-white' },
  { id: 'dark', bg: 'bg-gray-900', text: 'text-white' },
  { id: 'love', bg: 'bg-red-500', text: 'text-white' },
];

const FONTS: FontStyle[] = [
  { name: 'Default', class: 'font-sans' },
  { name: 'Elegant', class: 'font-serif' },
  { name: 'Modern', class: 'font-mono' },
  { name: 'Bold', class: 'font-extrabold tracking-tight' },
];

const FEELINGS: Feeling[] = [
  { emoji: '😊', text: 'Happy', color: 'bg-yellow-100' },
  { emoji: '🥰', text: 'Loved', color: 'bg-pink-100' },
  { emoji: '😔', text: 'Sad', color: 'bg-blue-100' },
  { emoji: '🤩', text: 'Excited', color: 'bg-orange-100' },
  { emoji: '😇', text: 'Blessed', color: 'bg-green-100' },
  { emoji: '😡', text: 'Angry', color: 'bg-red-100' },
  { emoji: '😎', text: 'Cool', color: 'bg-indigo-100' },
  { emoji: '😴', text: 'Tired', color: 'bg-gray-100' },
  { emoji: '🥳', text: 'Celebrating', color: 'bg-purple-100' },
  { emoji: '🤔', text: 'Thinking', color: 'bg-amber-100' },
  { emoji: '🤒', text: 'Sick', color: 'bg-emerald-100' },
  { emoji: '😌', text: 'Relieved', color: 'bg-teal-100' },
];

const FRIENDS = ['Akash', 'MD ROHIT', 'Runa', 'Farso', 'Tanvir', 'Sumon'];

interface PostCreationModalProps {
  onClose: () => void;
  onPost: (content: string, image?: string, theme?: string, fontStyle?: string, taggedFriends?: string[], privacy?: PrivacyType, feeling?: { emoji: string; text: string }) => void;
  initialContent?: string;
  initialPrivacy?: PrivacyType;
  initialImage?: string;
  openFeelingFirst?: boolean;
  profilePic?: string;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({ onClose, onPost, initialContent, initialPrivacy, initialImage, openFeelingFirst, profilePic }) => {
  const [content, setContent] = useState(initialContent || '');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState<FontStyle>(FONTS[0]);
  const [taggedFriends, setTaggedFriends] = useState<string[]>([]);
  const [showTagList, setShowTagList] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyType>(initialPrivacy || 'public');
  const [showPrivacySelector, setShowPrivacySelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [showFeelingSelector, setShowFeelingSelector] = useState(openFeelingFirst || false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAvatar = profilePic || "https://i.pravatar.cc/150?u=me";

  const handlePost = () => {
    if (!content.trim() && !selectedImage) return;
    
    const themeClass = (selectedTheme.id === 'none' || selectedImage) 
      ? undefined 
      : `${selectedTheme.bg} ${selectedTheme.text} flex items-center justify-center text-center p-8 text-2xl font-bold min-h-[300px]`;
    
    onPost(
      content, 
      selectedImage || undefined, 
      themeClass, 
      selectedFont.class, 
      taggedFriends, 
      privacy, 
      selectedFeeling ? { emoji: selectedFeeling.emoji, text: selectedFeeling.text } : undefined
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setSelectedTheme(THEMES[0]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleTagFriend = (name: string) => {
    setTaggedFriends(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const getPrivacyLabel = (p: PrivacyType) => {
    switch(p) {
      case 'public': return { label: 'Public', icon: 'fa-earth-americas' };
      case 'friends': return { label: 'Friends', icon: 'fa-user-group' };
      case 'only_me': return { label: 'Only me', icon: 'fa-lock' };
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-4 border-b flex items-center bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={onClose}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 flex-1 text-center pr-10">{initialContent ? 'Edit Post' : 'Create Post'}</h2>
        <button 
          onClick={handlePost}
          disabled={!content.trim() && !selectedImage}
          className={`absolute right-4 font-bold px-4 py-1.5 rounded-lg transition-colors ${content.trim() || selectedImage ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {initialContent ? 'SAVE' : 'POST'}
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* User Info & Privacy */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <img src={currentAvatar} alt="Bijoy" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-x-1">
              <p className="font-bold text-gray-900">Bijoy</p>
              {selectedFeeling && (
                <>
                  <span className="text-gray-600 text-sm">is feeling</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <span>{selectedFeeling.emoji}</span>
                    <span>{selectedFeeling.text}</span>
                  </span>
                </>
              )}
              {taggedFriends.length > 0 && (
                <span className="font-normal text-gray-600 text-sm">
                  {' is with '}
                  <span className="font-bold text-gray-900">
                    {taggedFriends[0]}
                    {taggedFriends.length > 1 && ` and ${taggedFriends.length - 1} others`}
                  </span>
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowPrivacySelector(true)}
              className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md mt-0.5 w-fit hover:bg-gray-200 transition-colors"
            >
              <i className={`fa-solid ${getPrivacyLabel(privacy).icon} text-[10px] text-gray-600`}></i>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{getPrivacyLabel(privacy).label}</span>
              <i className="fa-solid fa-caret-down text-[10px] text-gray-600 ml-1"></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex flex-col mb-4 rounded-xl overflow-hidden ${selectedTheme.id !== 'none' && !selectedImage ? selectedTheme.bg + ' ' + selectedTheme.text + ' min-h-[250px] justify-center text-center p-6' : 'bg-white'}`}>
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind, Bijoy?"
            rows={selectedImage ? 3 : 5}
            className={`w-full p-2 bg-transparent outline-none resize-none text-lg placeholder:text-gray-400 ${selectedFont.class} ${selectedTheme.id !== 'none' && !selectedImage ? 'text-center font-bold text-2xl placeholder:text-white/50' : 'text-gray-900'}`}
          />
          
          {selectedImage && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[400px]">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
        </div>

        {/* Font Selector */}
        {!selectedImage && !selectedFeeling && (
          <div className="mb-4">
             <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">English Font Styles</p>
             <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
               {FONTS.map((font) => (
                 <button
                   key={font.class}
                   onClick={() => setSelectedFont(font)}
                   className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap text-sm transition-all ${selectedFont.class === font.class ? 'border-green-600 bg-green-50 text-green-700 font-bold' : 'border-gray-100 bg-white text-gray-600'}`}
                 >
                   {font.name} Style
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Theme Selector */}
        {!selectedImage && !selectedFeeling && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Background Themes</p>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-10 h-10 rounded-lg flex-shrink-0 border-2 transition-all ${selectedTheme.id === theme.id ? 'border-green-600 scale-110 shadow-md' : 'border-white shadow-sm'} ${theme.id === 'none' ? 'bg-gray-100' : theme.bg}`}
                >
                  {theme.id === 'none' && <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-ban text-gray-400"></i></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar Footer */}
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm bg-white mt-auto">
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-700 text-sm">Add to your post</p>
            <div className="flex gap-4">
              <button onClick={() => fileInputRef.current?.click()}>
                <i className="fa-solid fa-images text-green-500 text-xl cursor-pointer hover:scale-110 transition-transform"></i>
              </button>
              <i 
                onClick={() => { setShowTagList(!showTagList); setShowFeelingSelector(false); }}
                className={`fa-solid fa-user-tag text-xl cursor-pointer hover:scale-110 transition-transform ${showTagList || taggedFriends.length > 0 ? 'text-blue-600' : 'text-blue-400'}`}
              ></i>
              <button onClick={() => { setShowFeelingSelector(true); setShowTagList(false); }}>
                <i className={`fa-solid fa-face-smile text-xl cursor-pointer hover:scale-110 transition-transform ${selectedFeeling ? 'text-yellow-600' : 'text-yellow-500'}`}></i>
              </button>
              <i className="fa-solid fa-location-dot text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform"></i>
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

          {/* Tag Friends List */}
          {showTagList && (
            <div className="pt-3 border-t animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500">Tag Friends</p>
                <button onClick={() => setShowTagList(false)} className="text-[10px] text-gray-400">Close</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {FRIENDS.map(friend => (
                  <button
                    key={friend}
                    onClick={() => toggleTagFriend(friend)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${taggedFriends.includes(friend) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {taggedFriends.includes(friend) && <i className="fa-solid fa-check mr-1"></i>}
                    {friend}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feeling Selector Overlay */}
      {showFeelingSelector && (
        <div className="fixed inset-0 z-[130] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
           <div className="p-4 border-b flex items-center bg-white sticky top-0 z-10 shadow-sm">
            <button 
              onClick={() => setShowFeelingSelector(false)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            >
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-900 flex-1 text-center pr-10">How are you feeling?</h2>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
            <button 
              onClick={() => { setSelectedFeeling(null); setShowFeelingSelector(false); }}
              className="col-span-2 p-4 border border-gray-100 rounded-xl bg-gray-50 font-bold text-gray-500 text-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-ban"></i> Remove Feeling
            </button>
            {FEELINGS.map((feeling) => (
              <button
                key={feeling.text}
                onClick={() => {
                  setSelectedFeeling(feeling);
                  setShowFeelingSelector(false);
                  setSelectedTheme(THEMES[0]); // Reset theme for feelings usually looks better
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedFeeling?.text === feeling.text ? 'border-green-500 bg-green-50' : 'border-gray-50 bg-white hover:bg-gray-50'}`}
              >
                <span className="text-2xl">{feeling.emoji}</span>
                <span className="font-bold text-gray-700 text-sm">{feeling.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Selector Overlay */}
      {showPrivacySelector && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-end animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-center mb-6">Who can see your post?</h3>
            <div className="space-y-2">
              {(['public', 'friends', 'only_me'] as PrivacyType[]).map((p) => {
                const info = getPrivacyLabel(p);
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setPrivacy(p);
                      setShowPrivacySelector(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${privacy === p ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${privacy === p ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <i className={`fa-solid ${info.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold ${privacy === p ? 'text-green-800' : 'text-gray-800'}`}>{info.label}</p>
                      <p className="text-xs text-gray-500">
                        {p === 'public' && 'Anyone on or off Bijoy'}
                        {p === 'friends' && 'Your friends on Bijoy'}
                        {p === 'only_me' && 'Only you'}
                      </p>
                    </div>
                    {privacy === p && <i className="fa-solid fa-circle-check text-green-600 text-xl"></i>}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setShowPrivacySelector(false)}
              className="w-full mt-6 py-4 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreationModal;
