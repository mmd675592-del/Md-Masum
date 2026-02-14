import React, { useState, useRef } from 'react';
import { UserInfo } from '../types';

interface EditProfileModalProps {
  onClose: () => void;
  userInfo: UserInfo;
  onUpdateInfo: (info: Partial<UserInfo>) => void;
  profilePic: string;
  coverPic: string;
  onUpdateProfilePic: (url: string) => void;
  onUpdateCoverPic: (url: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  onClose, userInfo, onUpdateInfo, profilePic, coverPic, onUpdateProfilePic, onUpdateCoverPic 
}) => {
  // Use local state for form data to ensure inputs are fast and persistent until final save
  const [formData, setFormData] = useState<UserInfo>({ ...userInfo });
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSaveDetails = () => {
    // Propagate the current formData to the parent
    onUpdateInfo(formData);
    setIsEditingDetails(false);
  };

  const handleMainSave = () => {
    // Final save of all changes in formData
    onUpdateInfo(formData);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'profile') {
          onUpdateProfilePic(result);
          setFormData(prev => ({ ...prev, avatar: result }));
        } else {
          onUpdateCoverPic(result);
          setFormData(prev => ({ ...prev, cover: result }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 flex items-center bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-1 text-center">Edit Profile</h2>
        <button onClick={handleMainSave} className="font-bold px-4 py-1.5 rounded-lg bg-green-600 text-white shadow-md active:scale-95 transition-transform">
          SAVE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#18191a] pb-20">
        {/* Profile Picture Section */}
        <section className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Profile picture</h3>
            <button 
              onClick={() => profileInputRef.current?.click()} 
              className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="flex justify-center">
            <div className="w-44 h-44 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm relative group">
              <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
              <div 
                onClick={() => profileInputRef.current?.click()}
                className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <i className="fa-solid fa-camera text-white text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
          <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile')} />
        </section>

        {/* Cover Photo Section */}
        <section className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Cover photo</h3>
            <button 
              onClick={() => coverInputRef.current?.click()} 
              className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 relative group">
            <img src={formData.cover} className="w-full h-full object-cover" alt="Cover" />
            <div 
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="fa-solid fa-camera text-white text-2xl"></i>
              </div>
            </div>
          </div>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
        </section>

        {/* Bio Section */}
        <section className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Bio</h3>
            <button 
              onClick={() => setIsEditingDetails(true)}
              className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-center py-4 font-medium italic">
            {formData.bio || "Describe yourself..."}
          </p>
        </section>

        {/* Details Section */}
        <section className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Details</h3>
            <button 
              onClick={() => setIsEditingDetails(true)}
              className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-graduation-cap w-6 text-center text-gray-400"></i>
              <span className="text-sm">Studied at <span className="font-bold">{formData.university || "University"}</span></span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-house w-6 text-center text-gray-400"></i>
              <span className="text-sm">Lives in <span className="font-bold">{formData.district || "Your City"}</span></span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-location-dot w-6 text-center text-gray-400"></i>
              <span className="text-sm">From <span className="font-bold">{formData.hometown || "Your Hometown"}</span></span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-heart w-6 text-center text-gray-400"></i>
              <span className="text-sm font-bold">{formData.relationship || "Relationship Status"}</span>
            </div>
          </div>
        </section>

        {/* Edit Details Full Screen Form */}
        {isEditingDetails && (
          <div className="fixed inset-0 z-[400] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b dark:border-gray-800 flex items-center bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
              <button onClick={() => setIsEditingDetails(false)} className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
                <i className="fa-solid fa-arrow-left text-xl"></i>
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-1">Edit details</h2>
              <button onClick={handleSaveDetails} className="font-bold px-4 py-1.5 rounded-lg bg-blue-600 text-white shadow-md active:scale-95 transition-transform">
                SAVE
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-[#18191a]">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Your details will be set to public and updated in your profile.</p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">University</label>
                  <input 
                    type="text" 
                    value={formData.university || ''}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    placeholder="Add university"
                    className="w-full p-4 bg-white dark:bg-[#242526] border dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-gray-100 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Current City</label>
                  <input 
                    type="text" 
                    value={formData.district || ''}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="Add current city"
                    className="w-full p-4 bg-white dark:bg-[#242526] border dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-gray-100 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Hometown</label>
                  <input 
                    type="text" 
                    value={formData.hometown || ''}
                    onChange={(e) => setFormData({...formData, hometown: e.target.value})}
                    placeholder="Add hometown"
                    className="w-full p-4 bg-white dark:bg-[#242526] border dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-gray-100 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Relationship Status</label>
                  <select 
                    value={formData.relationship || 'Single'}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    className="w-full p-4 bg-white dark:bg-[#242526] border dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-gray-900 dark:text-gray-100 shadow-sm"
                  >
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Married">Married</option>
                    <option value="Engaged">Engaged</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                  <textarea 
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe yourself..."
                    className="w-full p-4 bg-white dark:bg-[#242526] border dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none font-bold text-gray-900 dark:text-gray-100 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;