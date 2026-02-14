
import React, { useRef, useState, useMemo } from 'react';
import { Post, Story, ReactionCounts, UserInfo, FriendshipStatus } from '../types';
import Feed from './Feed';

interface ProfilePageProps {
  onBack: () => void;
  posts: Post[];
  stories: Story[];
  userInfo: UserInfo;
  isMe: boolean;
  onUpdateProfilePic: (url: string, caption?: string) => void;
  onUpdateCoverPic: (url: string, caption?: string) => void;
  onToggleReaction: (postId: string, type: keyof ReactionCounts) => void;
  onAddComment: (postId: string, text: string, image?: string, sticker?: string, parentId?: string) => void;
  onDeletePost: (postId: string) => void;
  onOpenCreatePost: (openFeeling?: boolean) => void;
  onOpenEditProfile: () => void;
  onOpenMessage?: (userId: string) => void;
  onNavigateToProfile?: (userId: string) => void;
  onFriendshipAction?: (userId: string, action: 'send' | 'accept' | 'delete' | 'cancel') => void;
  activeStatusEnabled?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onBack, posts, stories, userInfo, isMe,
  onUpdateProfilePic, onUpdateCoverPic,
  onToggleReaction, onAddComment, onDeletePost,
  onOpenCreatePost, onOpenEditProfile,
  onOpenMessage, onNavigateToProfile, onFriendshipAction,
  activeStatusEnabled = true
}) => {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [tempUpdate, setTempUpdate] = useState<{ url: string, type: 'profile' | 'cover' } | null>(null);
  const [caption, setCaption] = useState('');
  const [showGallery, setShowGallery] = useState(false);

  const userPosts = useMemo(() => {
    return posts.filter(p => p.authorId === userInfo.id);
  }, [posts, userInfo.id]);

  const allUserPhotos = useMemo(() => {
    const photos: string[] = [];
    userPosts.forEach(post => {
      if (post.image) photos.push(post.image);
      if (post.sharedPost?.image) photos.push(post.sharedPost.image);
    });
    return photos;
  }, [userPosts]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    if (!isMe) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTempUpdate({ url: result, type });
        setCaption(type === 'profile' ? `${userInfo.name} updated his profile picture.` : `${userInfo.name} updated his cover photo.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalUpdate = () => {
    if (!tempUpdate) return;
    if (tempUpdate.type === 'profile') {
      onUpdateProfilePic(tempUpdate.url, caption);
    } else {
      onUpdateCoverPic(tempUpdate.url, caption);
    }
    setTempUpdate(null);
    setCaption('');
  };

  const renderFriendButtons = () => {
    if (isMe) {
      return (
        <>
          <button onClick={onOpenEditProfile} className="flex-1 max-w-[180px] bg-gray-100 dark:bg-gray-800 py-3 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
            <i className="fa-solid fa-pen-to-square text-xs"></i>
            Edit profile
          </button>
          <button onClick={() => setShowGallery(true)} className="flex-1 max-w-[180px] bg-gray-100 dark:bg-gray-800 py-3 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
            <i className="fa-solid fa-images text-xs"></i>
            ALL Photo
          </button>
        </>
      );
    }

    const status = userInfo.friendshipStatus || 'none';

    switch (status) {
      case 'friends':
        return (
          <>
            <button className="flex-1 max-w-[180px] bg-gray-100 dark:bg-gray-800 py-3 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <i className="fa-solid fa-user-check text-xs"></i>
              Friends
            </button>
            <button onClick={() => onOpenMessage?.(userInfo.id)} className="flex-1 max-w-[180px] bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <i className="fa-brands fa-facebook-messenger text-xs"></i>
              Message
            </button>
          </>
        );
      case 'sent':
        return (
          <>
            <button 
              onClick={() => onFriendshipAction?.(userInfo.id, 'cancel')}
              className="flex-1 max-w-[180px] bg-gray-200 dark:bg-gray-800 py-3 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-user-minus text-xs"></i>
              Cancel Request
            </button>
            <button onClick={() => onOpenMessage?.(userInfo.id)} className="flex-1 max-w-[180px] bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <i className="fa-brands fa-facebook-messenger text-xs"></i>
              Message
            </button>
          </>
        );
      case 'received':
        return (
          <>
            <button 
              onClick={() => onFriendshipAction?.(userInfo.id, 'accept')}
              className="flex-1 max-w-[180px] bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-user-plus text-xs"></i>
              Confirm Request
            </button>
            <button 
              onClick={() => onFriendshipAction?.(userInfo.id, 'delete')}
              className="flex-1 max-w-[180px] bg-gray-200 dark:bg-gray-800 py-3 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Delete
            </button>
          </>
        );
      default:
        return (
          <>
            <button 
              onClick={() => onFriendshipAction?.(userInfo.id, 'send')}
              className="flex-1 max-w-[180px] bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-user-plus text-xs"></i>
              Add Friend
            </button>
            <button onClick={() => onOpenMessage?.(userInfo.id)} className="flex-1 max-w-[180px] bg-gray-100 dark:bg-gray-800 py-3 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <i className="fa-brands fa-facebook-messenger text-xs"></i>
              Message
            </button>
          </>
        );
    }
  };

  if (showGallery) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#18191a] animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-50 bg-white dark:bg-[#242526] border-b dark:border-gray-800 flex items-center px-4 h-14">
          <button onClick={() => setShowGallery(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <i className="fa-solid fa-arrow-left text-xl text-gray-700 dark:text-gray-300"></i>
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-4">Photos</h2>
        </div>
        <div className="max-w-xl mx-auto p-1">
          {allUserPhotos.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {allUserPhotos.map((photo, index) => (
                <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative group cursor-pointer">
                  <img src={photo} alt={`User photo ${index}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
              <i className="fa-solid fa-images text-6xl mb-4 opacity-20"></i>
              <p className="font-medium">No photos yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isUserActive = isMe ? activeStatusEnabled : userInfo.isActive;

  return (
    <div className="min-h-screen bg-white dark:bg-[#18191a] animate-in slide-in-from-right duration-300 pb-20">
      <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'profile')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'cover')} />

      <div className="sticky top-0 z-50 bg-white dark:bg-[#242526] border-b dark:border-gray-800 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-left text-lg text-gray-700 dark:text-gray-300"></i>
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{userInfo.name}</h2>
        </div>
        <div className="flex items-center gap-5 text-gray-700 dark:text-gray-300">
          {isMe && <button onClick={onOpenEditProfile} className="hover:text-green-600 transition-colors"><i className="fa-solid fa-pencil text-lg"></i></button>}
          <button className="hover:text-green-600 transition-colors"><i className="fa-solid fa-magnifying-glass text-lg"></i></button>
          <button className="hover:text-green-600 transition-colors"><i className="fa-solid fa-ellipsis text-lg"></i></button>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative h-60 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden group">
          <img src={userInfo.cover} className="w-full h-full object-cover transition-opacity duration-300" alt="Cover" />
          {isMe && (
            <button onClick={() => coverInputRef.current?.click()} className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white active:scale-90 transition-all border border-gray-100 dark:border-gray-700 z-20">
              <i className="fa-solid fa-plus text-lg"></i>
            </button>
          )}
        </div>

        <div className="relative -mt-20 flex flex-col items-center">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] bg-white dark:bg-[#242526] p-1.5 shadow-xl border-4 border-white dark:border-[#242526]">
              <div className="w-full h-full rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 relative">
                <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Profile" />
                {isUserActive && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#242526] rounded-full shadow-md"></div>
                )}
              </div>
            </div>
            {isMe && (
              <button onClick={() => profileInputRef.current?.click()} className="absolute bottom-2 right-2 w-10 h-10 bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-[#242526] rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-90 transition-all shadow-md z-20">
                <i className="fa-solid fa-plus text-sm"></i>
              </button>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-gray-100">{userInfo.name}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 font-medium text-center px-10">{userInfo.bio}</p>
        </div>

        <div className="mt-6 px-4 flex gap-3 justify-center">
          {renderFriendButtons()}
          <button className="w-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        <div className="mt-8 px-6 space-y-4">
          {userInfo.university && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-graduation-cap w-5"></i>
              <span className="text-sm">Studied at <span className="font-bold text-gray-800 dark:text-gray-200">{userInfo.university}</span></span>
            </div>
          )}
          {userInfo.district && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-house w-5"></i>
              <span className="text-sm">Lives in <span className="font-bold text-gray-800 dark:text-gray-200">{userInfo.district}</span></span>
            </div>
          )}
          {userInfo.hometown && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-location-dot w-5"></i>
              <span className="text-sm">From <span className="font-bold text-gray-800 dark:text-gray-200">{userInfo.hometown}</span></span>
            </div>
          )}
          {userInfo.relationship && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-heart w-5"></i>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{userInfo.relationship}</span>
            </div>
          )}
          <button className="w-full py-2.5 mt-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 font-bold rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">
            See {isMe ? 'your' : userInfo.name + "'s"} About info
          </button>
        </div>

        <div className="mt-8 border-t border-gray-100 dark:border-gray-800"></div>

        {isMe && (
          <div className="p-4 bg-white dark:bg-[#242526]">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => onOpenCreatePost(false)}>
                  <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Me" />
               </div>
               <div onClick={() => onOpenCreatePost(false)} className="flex-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-full px-5 py-3 text-gray-500 dark:text-gray-400 font-medium text-sm border border-gray-100 dark:border-gray-700 transition-colors">
                  post on update
               </div>
            </div>
          </div>
        )}

        <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-800"></div>
        <div className="bg-gray-50 dark:bg-[#18191a]">
          <Feed 
            posts={userPosts} 
            onToggleReaction={onToggleReaction} 
            onAddComment={onAddComment} 
            onDeletePost={onDeletePost}
            onNavigateToProfile={onNavigateToProfile}
          />
        </div>
      </div>

      {isMe && tempUpdate && (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b dark:border-gray-800 flex items-center bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
            <button onClick={() => setTempUpdate(null)} className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-1 text-center pr-10">Update {tempUpdate.type === 'profile' ? 'Profile Picture' : 'Cover Photo'}</h2>
            <button onClick={handleFinalUpdate} className="absolute right-4 font-bold px-5 py-2 rounded-lg bg-green-600 text-white shadow-md hover:bg-green-700 transition-all active:scale-95">SAVE</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-[#18191a] flex flex-col">
            <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                  <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Me" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{userInfo.name}</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." className="w-full border-none bg-transparent outline-none resize-none text-gray-800 dark:text-gray-200 text-lg placeholder:text-gray-400 min-h-[100px]" />
              </div>
              <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-800">
                <img src={tempUpdate.url} className={`w-full h-full ${tempUpdate.type === 'profile' ? 'object-cover' : 'object-contain'}`} alt="Preview" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
