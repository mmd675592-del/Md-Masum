import React from 'react';

interface PrivacyShortcutsProps {
  onBack: () => void;
}

const PrivacyShortcuts: React.FC<PrivacyShortcutsProps> = ({ onBack }) => {
  const sections = [
    {
      title: 'Privacy',
      icon: 'fa-shield-halved',
      color: 'text-blue-500',
      items: [
        'Review a few important privacy settings',
        'Manage your location',
        'Control facial recognition'
      ]
    },
    {
      title: 'Account Security',
      icon: 'fa-lock',
      color: 'text-orange-500',
      items: [
        'Update your personal information',
        'Change your password',
        'Get alerts about unrecognized logins',
        'Use two-factor authentication'
      ]
    },
    {
      title: 'Ad Preferences',
      icon: 'fa-rectangle-ad',
      color: 'text-purple-500',
      items: [
        'Learn how ads work',
        'Review your ad preferences'
      ]
    },
    {
      title: 'Your Facebook Information',
      icon: 'fa-address-card',
      color: 'text-green-500',
      items: [
        'Access your information',
        'See your Activity Log',
        'Manage your information'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[250] bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b dark:border-gray-800 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#242526] z-10 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Privacy Shortcuts</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
              <i className={`fa-solid ${section.icon} ${section.color} text-xl`}></i>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => alert(`${item} - Coming soon!`)}>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item}</p>
                  <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyShortcuts;
