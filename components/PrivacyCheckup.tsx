import React, { useState } from 'react';

interface PrivacyCheckupProps {
  onBack: () => void;
}

const PrivacyCheckup: React.FC<PrivacyCheckupProps> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const topics = [
    { id: 1, title: 'Who can see what you share', icon: 'fa-user-shield', color: 'bg-orange-500', desc: 'Profile information, posts and stories, blocking' },
    { id: 2, title: 'How to keep your account secure', icon: 'fa-shield-halved', color: 'bg-purple-500', desc: 'Password, two-factor authentication, login alerts' },
    { id: 3, title: 'How people can find you on Facebook', icon: 'fa-magnifying-glass', color: 'bg-blue-500', desc: 'Friend requests, phone number and email address, search engines' },
    { id: 4, title: 'Your data settings on Facebook', icon: 'fa-database', color: 'bg-green-500', desc: 'Apps and websites, location' },
  ];

  if (activeStep !== null) {
    return (
      <div className="fixed inset-0 z-[260] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#242526] z-10 shadow-sm">
          <button onClick={() => setActiveStep(null)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Privacy Checkup</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
          <div className={`w-20 h-20 ${topics[activeStep - 1].color} rounded-full flex items-center justify-center text-white mb-6 shadow-lg`}>
            <i className={`fa-solid ${topics[activeStep - 1].icon} text-3xl`}></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{topics[activeStep - 1].title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
            You're all set! We've reviewed your settings and everything looks good. You can always change these settings later in your Privacy Shortcuts.
          </p>
          <button 
            onClick={() => setActiveStep(null)}
            className="w-full max-w-sm py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Review Another Topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#242526] z-10 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Privacy Checkup</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Checkup</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">We'll guide you through some settings so you can make the right choices for your account. What topic do you want to start with?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map(topic => (
            <div 
              key={topic.id} 
              onClick={() => setActiveStep(topic.id)}
              className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3"
            >
              <div className={`w-16 h-16 ${topic.color} rounded-full flex items-center justify-center text-white shadow-inner`}>
                <i className={`fa-solid ${topic.icon} text-2xl`}></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-[15px] mb-1">{topic.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyCheckup;
