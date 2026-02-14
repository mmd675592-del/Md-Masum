
import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: (name: string, avatar?: string) => void;
}

type RegStep = 'login' | 'name' | 'birthday' | 'gender' | 'address' | 'contact' | 'password' | 'otp' | 'policy' | 'intro' | 'forgot_contact' | 'forgot_otp';

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<RegStep>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Registration Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDay, setBirthDay] = useState('1');
  const [birthMonth, setBirthMonth] = useState('Jan');
  const [birthYear, setBirthYear] = useState('2000');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password Data
  const [forgotContact, setForgotContact] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');

  // Intro Animation State
  const [introText, setIntroText] = useState('');
  const introSeq = ["Hello", "Welcome", "Bijoy social media"];

  const handleNext = async () => {
    setErrorMsg(null);
    if (step === 'login') setStep('name');
    else if (step === 'name') {
      if (!firstName || !lastName) { setErrorMsg("নাম প্রদান করুন।"); return; }
      setStep('birthday');
    }
    else if (step === 'birthday') setStep('gender');
    else if (step === 'gender') {
      if (!gender) { setErrorMsg("লিঙ্গ নির্বাচন করুন।"); return; }
      setStep('address');
    }
    else if (step === 'address') {
      if (!address) { setErrorMsg("ঠিকানা লিখুন।"); return; }
      setStep('contact');
    }
    else if (step === 'contact') {
      if (!contact) { setErrorMsg("মোবাইল নম্বর অথবা ইমেইল প্রয়োজন।"); return; }
      setStep('password');
    }
    else if (step === 'password') {
      if (password.length < 6) { setErrorMsg("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।"); return; }
      if (password !== confirmPassword) { setErrorMsg("পাসওয়ার্ড ম্যাচ করেনি!"); return; }
      setStep('otp');
    }
    else if (step === 'otp') {
      if (otp === '12345') setStep('policy');
      else setErrorMsg("ভুল কোড! '12345' ব্যবহার করুন।");
    }
    else if (step === 'policy') {
      if (!isAgreed) { setErrorMsg("শর্তাবলীতে রাজি হতে হবে।"); return; }
      handleFinalSignup();
    }
    else if (step === 'forgot_contact') {
      if (!forgotContact) { setErrorMsg("তথ্য প্রদান করুন।"); return; }
      setStep('forgot_otp');
    }
    else if (step === 'forgot_otp') {
      if (forgotOtp === '12345') {
        setFirstName("Bijoy"); setLastName("User");
        startIntro();
      } else {
        setErrorMsg("ভুল কোড! '12345' ব্যবহার করুন।");
      }
    }
  };

  const handleFinalSignup = async () => {
    setLoading(true);
    // Simulate data persistence
    setTimeout(() => {
      const userData = {
        name: `${firstName} ${lastName}`,
        birthday: `${birthDay} ${birthMonth} ${birthYear}`,
        gender,
        address,
        contact
      };
      localStorage.setItem('bijoy_user_local', JSON.stringify(userData));
      setLoading(false);
      startIntro();
    }, 1000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    // Simple local login simulation
    setTimeout(() => {
      const savedUser = localStorage.getItem('bijoy_user_local');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        onLogin(parsed.name, parsed.avatar);
      } else {
        // Fallback for demo
        onLogin("Bijoy User");
      }
      setLoading(false);
    }, 800);
  };

  const startIntro = () => {
    setStep('intro');
    let i = 0;
    const interval = setInterval(() => {
      if (i < introSeq.length) {
        setIntroText(introSeq[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLogin(`${firstName} ${lastName}`);
        }, 1500);
      }
    }, 1200);
  };

  const renderStepHeader = (title: string, desc: string) => (
    <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-green-600 flex items-center justify-center p-6 overflow-hidden">
        <div className="text-center">
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter animate-in zoom-in-50 duration-700 drop-shadow-2xl">{introText}</h1>
          <div className="mt-12 flex justify-center">
             <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[loading_4s_linear_forwards]"></div>
             </div>
          </div>
        </div>
        <style>{`@keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col items-center justify-center p-4 font-sans transition-colors duration-500">
      <div className="mb-10 text-center animate-in zoom-in duration-700">
        <div className="inline-flex items-center gap-2">
           <h1 className="text-6xl font-black text-green-600 tracking-tighter drop-shadow-xl">Bijoy</h1>
           <i className="fa-solid fa-cricket-bat-ball text-green-600 text-2xl mt-4 animate-bounce"></i>
        </div>
      </div>

      <div className="w-full max-w-[420px] bg-white dark:bg-[#242526] p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 transition-all duration-300 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 flex items-center justify-center backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-300 border border-red-100 dark:border-red-900/30">
            <i className="fa-solid fa-circle-exclamation text-lg"></i>
            {errorMsg}
          </div>
        )}

        {step === 'login' && (
          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <input type="text" placeholder="ইমেইল অথবা মোবাইল নম্বর" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none dark:text-white font-bold" required />
            <input type="password" placeholder="পাসওয়ার্ড" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none dark:text-white font-bold" required />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl text-lg shadow-xl shadow-green-100 dark:shadow-none active:scale-95 transition-all">প্রবেশ করুন</button>
            <div className="text-center pt-2"><button type="button" onClick={() => setStep('forgot_contact')} className="text-green-600 text-sm hover:underline font-black uppercase tracking-widest">পাসওয়ার্ড ভুলে গেছেন?</button></div>
            <div className="relative my-8"><div className="absolute inset-0 flex items-center"><div className="w-full border-t dark:border-gray-800"></div></div><div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-400"><span className="bg-white dark:bg-[#242526] px-4">অর</span></div></div>
            <button type="button" onClick={() => setStep('name')} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600 border-2 border-green-600 font-black py-4 px-8 rounded-2xl transition-all shadow-md active:scale-95 w-full uppercase tracking-widest">নতুন অ্যাকাউন্ট খুলুন</button>
          </form>
        )}

        {step === 'forgot_contact' && (
          <div className="animate-in slide-in-from-right">
            {renderStepHeader("একাউন্ট খুঁজুন", "আপনার নম্বর অথবা ইমেইল ঠিকানা প্রদান করুন।")}
            <input type="text" value={forgotContact} onChange={(e) => setForgotContact(e.target.value)} placeholder="মোবাইল নম্বর অথবা ইমেইল" className="w-full p-5 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none mb-8 dark:text-white font-black tracking-tight text-xl" />
            <button onClick={handleNext} className="w-full bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg">পরবর্তী</button>
          </div>
        )}

        {step === 'forgot_otp' && (
          <div className="animate-in slide-in-from-right">
            {renderStepHeader("কোড দিন", "আপনার ঠিকানায় পাঠানো ৫ ডিজিটের কোডটি দিন।")}
            <input type="text" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="12345" className="w-full p-6 bg-gray-50 dark:bg-[#18191a] border-4 border-green-50 rounded-[2rem] text-center text-5xl font-black tracking-[0.5em] outline-none mb-8 dark:text-white shadow-inner" maxLength={5} />
            <button onClick={handleNext} className="w-full bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl">একাউন্ট উদ্ধার করুন</button>
          </div>
        )}

        {step === 'name' && (
          <div className="animate-in slide-in-from-right">
            {renderStepHeader("আপনার নাম কি?", "বিজয় অ্যাপে সবাই আপনাকে এই নামে দেখবে।")}
            <div className="space-y-4 mb-8">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="নামের প্রথম অংশ" className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 dark:text-white font-bold" />
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="পদবী" className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 dark:text-white font-bold" />
            </div>
            <button onClick={handleNext} disabled={!firstName || !lastName} className="w-full bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg">পরবর্তী ধাপ</button>
          </div>
        )}

        {step === 'birthday' && (
          <div className="animate-in slide-in-from-right">
            {renderStepHeader("জন্মদিন কবে?", "আপনার আসল জন্মদিন প্রদান করুন।")}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-xl dark:text-white font-bold outline-none">{[...Array(31)].map((_, i) => <option key={i}>{i + 1}</option>)}</select>
              <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-xl dark:text-white font-bold outline-none">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m}>{m}</option>)}</select>
              <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-xl dark:text-white font-bold outline-none">{[...Array(100)].map((_, i) => <option key={i}>{2024 - i}</option>)}</select>
            </div>
            <button onClick={handleNext} className="w-full bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg">পরবর্তী ধাপ</button>
          </div>
        )}

        {step === 'gender' && (
          <div className="animate-in slide-in-from-right">
            {renderStepHeader("আপনার লিঙ্গ কি?", "এটি আপনার একাউন্টের তথ্য হিসেবে থাকবে।")}
            <div className="space-y-4 mb-8">
              {['পুরুষ', 'মহিলা', 'অন্যান্য'].map(g => (
                <label key={g} className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${gender === g ? 'border-green-600 bg-green-50 dark:bg-green-900/10' : 'border-gray-100 dark:border-gray-800'}`}>
                  <span className="font-bold dark:text-white">{g}</span>
                  <input type="radio" checked={gender === g} onChange={() => setGender(g)} className="w-5 h-5 accent-green-600" />
                </label>
              ))}
            </div>
            <button onClick={handleNext} disabled={!gender} className="w-full bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg">পরবর্তী ধাপ</button>
          </div>
        )}

        {['address', 'contact', 'password', 'otp', 'policy'].includes(step) && (
          <div className="animate-in slide-in-from-right">
            {step === 'address' && (
              <>
                {renderStepHeader("বর্তমান ঠিকানা", "আপনার এলাকা বা শহরের নাম লিখুন।")}
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ঠিকানা..." className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none mb-8 dark:text-white font-bold h-32" />
              </>
            )}
            {step === 'contact' && (
              <>
                {renderStepHeader("যোগাযোগের তথ্য", "মোবাইল অথবা ইমেইল প্রদান করুন।")}
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="মোবাইল অথবা ইমেইল" className="w-full p-5 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl outline-none mb-8 dark:text-white font-black tracking-tight text-xl" />
              </>
            )}
            {step === 'password' && (
              <>
                {renderStepHeader("নিরাপত্তা পাসওয়ার্ড", "একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।")}
                <div className="space-y-4 mb-8">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="নতুন পাসওয়ার্ড" className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl outline-none dark:text-white font-bold" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="নিশ্চিত করুন" className="w-full p-4 bg-gray-50 dark:bg-[#18191a] border dark:border-gray-700 rounded-2xl outline-none dark:text-white font-bold" />
                </div>
              </>
            )}
            {step === 'otp' && (
              <>
                {renderStepHeader("কোড ভেরিফিকেশন", "আপনার তথ্য যাচাই করতে কোড দিন।")}
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="12345" className="w-full p-6 bg-gray-50 dark:bg-[#18191a] border-4 border-green-50 rounded-[2rem] text-center text-5xl font-black tracking-[0.5em] outline-none mb-8 dark:text-white" maxLength={5} />
              </>
            )}
            {step === 'policy' && (
              <>
                {renderStepHeader("নীতিমালা ও শর্তাবলী", "বিজয় কমিউনিটির নিয়মগুলো মেনে চলুন।")}
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-3xl text-sm mb-8 h-48 overflow-y-auto border dark:border-gray-700 shadow-inner">
                  <p className="font-black text-green-600 uppercase text-xs">বিজয় রুলস বুক:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 font-medium mt-2">
                    <li>প্রতারণামূলক একাউন্ট খোলা যাবে না।</li>
                    <li>অশ্লীল পোস্ট করা নিষিদ্ধ।</li>
                    <li>ধর্মীয় অনুভূতিতে আঘাত করা যাবে না।</li>
                    <li>সবাইকে সম্মান করতে হবে।</li>
                  </ul>
                </div>
                <label className="flex items-center gap-4 mb-8 cursor-pointer p-4 rounded-2xl border-2 border-transparent hover:border-green-100 transition-all">
                  <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="w-7 h-7 accent-green-600" />
                  <span className="text-sm font-bold dark:text-white">আমি বিজয়-এর সকল নীতিমালা মেনে নিচ্ছি।</span>
                </label>
              </>
            )}
            <button onClick={handleNext} className="w-full bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg">পরবর্তী ধাপ</button>
          </div>
        )}
      </div>

      {/* Footer back button - Removed redundant 'intro' step check since it's handled by early return */}
      {step !== 'login' && (
        <button onClick={() => setStep('login')} className="mt-10 text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:text-green-600 transition-colors text-xs">
          <i className="fa-solid fa-arrow-left-long"></i> লগইন পেজে ফিরে যান
        </button>
      )}
    </div>
  );
};

export default AuthPage;
