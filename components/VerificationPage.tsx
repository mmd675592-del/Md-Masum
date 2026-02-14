
import React, { useState } from 'react';
import { UserInfo } from '../types';

interface VerificationPageProps {
  onBack: () => void;
  userInfo: UserInfo;
}

type Step = 'form' | 'policy' | 'final';

const VerificationPage: React.FC<VerificationPageProps> = ({ onBack, userInfo }) => {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    fullName: userInfo.name,
    phone: '',
    email: '',
    idType: 'National ID Card',
    birthDate: '',
    address: ''
  });
  const [isAgreed, setIsAgreed] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('policy');
  };

  const handlePolicyNext = () => {
    if (isAgreed) setStep('final');
  };

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
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Verification Center</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-xl mx-auto w-full">
        {step === 'form' && (
          <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300 pb-10">
            <div className="bg-white dark:bg-[#242526] p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-green-600 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-address-card"></i> Personal Information
              </h3>
              
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full mt-1 p-3.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full mt-1 p-3.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full mt-1 p-3.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium"
                  placeholder="example@mail.com"
                />
              </div>

              <div className="flex flex-col items-center py-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-2">
                  <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Profile Photo Selected</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Identity Document</label>
                <select 
                  value={formData.idType}
                  onChange={(e) => setFormData({...formData, idType: e.target.value})}
                  className="w-full mt-1 p-3.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none font-medium"
                >
                  <option>National ID Card</option>
                  <option>Birth Certificate</option>
                  <option>Student ID Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Birth Date</label>
                <input 
                  required
                  type="text" 
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full mt-1 p-3.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium"
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Original Address</label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full mt-1 p-3.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium min-h-[100px]"
                  placeholder="Your full permanent address"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 transition-all active:scale-95"
            >
              Submit Information
            </button>
          </form>
        )}

        {step === 'policy' && (
          <div className="animate-in slide-in-from-bottom duration-300 pb-10">
            <div className="bg-white dark:bg-[#242526] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center rounded-full mb-4">
                  <i className="fa-solid fa-shield-check text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">ধন্যবাদ প্রিয় ব্যবহারকারী</h3>
                <p className="text-sm text-gray-500 text-center mt-2">আপনি ভালোভাবে আমাদের নিয়মগুলো পড়বেন এবং মেনে চলতে চেষ্টা করবেন।</p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-green-600 uppercase text-xs tracking-widest border-b pb-2 dark:border-gray-700">আমাদের নীতিমালা:</h4>
                <ul className="space-y-3">
                  {[
                    "আপনি কারো সাথে প্রতারণা করবেন না।",
                    "আপনি সকল তথ্য সত্য দিবেন।",
                    "পোস্টের মাধ্যমে কারো ধর্মীয় অনুভূতিতে আঘাত করতে পারবেন না।",
                    "কাউকে বকাবকি কিংবা বাজে ছবি ভিডিও কিংবা ভয়েস পাঠাবেন না।",
                    "কোন হুমকি কিংবা অপরাধমূলক কাজ করবেন না।",
                    "আপনার একাধিক বিজয় একাউন্ট নেই।"
                  ].map((policy, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center gap-4">
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 w-full hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                  <div 
                    onClick={() => setIsAgreed(!isAgreed)}
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${isAgreed ? 'bg-green-500 border-green-500 shadow-md' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                  >
                    {isAgreed && <i className="fa-solid fa-check text-white"></i>}
                  </div>
                  <span className="flex-1 text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-green-700 transition-colors">
                    আমি উপরোক্ত বিষয় পড়েছি এবং এ সকল বিষয় মেনে চলার চেষ্টা করবো।
                  </span>
                </label>

                <button 
                  onClick={handlePolicyNext}
                  disabled={!isAgreed}
                  className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${isAgreed ? 'bg-green-600 text-white shadow-green-200' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                >
                  আবেদন সম্পন্ন করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'final' && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-pulse">
                <i className="fa-solid fa-check-double text-5xl text-green-600"></i>
              </div>
              <div className="absolute -top-2 -right-2 bg-white dark:bg-[#18191a] p-2 rounded-full shadow-lg">
                <i className="fa-solid fa-paper-plane text-green-500 animate-bounce"></i>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-4">ধন্যবাদ!</h3>
            <p className="text-gray-600 dark:text-gray-400 px-6 leading-relaxed">
              আমরা আপনার আবেদন পেয়েছি। দয়া করে অপেক্ষা করুন, আমরা আপনার তথ্যগুলো যাচাই করে ফলাফল জানাব।
            </p>

            <button 
              onClick={onBack}
              className="mt-10 px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Back to Settings
            </button>

            <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Bijoy Verification Center</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
