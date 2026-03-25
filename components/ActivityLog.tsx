import React from 'react';

interface ActivityLogProps {
  onBack: () => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ onBack }) => {
  const activities = [
    { id: 1, type: 'like', text: 'You liked a post by Akash.', date: 'Today' },
    { id: 2, type: 'comment', text: 'You commented on Runa\'s photo.', date: 'Yesterday' },
    { id: 3, type: 'search', text: 'You searched for "React Developer".', date: 'March 18' },
    { id: 4, type: 'friend', text: 'You became friends with Farso.', date: 'March 15' },
    { id: 5, type: 'post', text: 'You updated your profile picture.', date: 'March 10' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'like': return 'fa-thumbs-up text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'comment': return 'fa-comment text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'search': return 'fa-magnifying-glass text-purple-500 bg-purple-100 dark:bg-purple-900/30';
      case 'friend': return 'fa-user-group text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30';
      case 'post': return 'fa-image text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      default: return 'fa-circle text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#242526] z-10 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Activity Log</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {activities.map((activity, index) => (
            <div key={activity.id} className={`p-4 flex gap-4 items-start ${index !== activities.length - 1 ? 'border-b dark:border-gray-800' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIcon(activity.type).split(' ').slice(1).join(' ')}`}>
                <i className={`fa-solid ${getIcon(activity.type).split(' ')[0]} text-lg`}></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{activity.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
