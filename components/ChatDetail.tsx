
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatSettings, ReactionCounts, UserInfo } from '../types';
import ChatInfoPage from './ChatInfoPage';
import CallOverlay from './CallOverlay';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { REACTION_DATA } from './Feed';

const BENGALI_STICKERS = [
  { id: 'img1', url: 'https://i.ibb.co.com/20DnP2nf/images-22.jpg', type: 'image' },
  { id: 'img2', url: 'https://i.ibb.co.com/tMgN5Tp3/images-16.jpg', type: 'image' },
  { id: 'img3', url: 'https://i.ibb.co.com/jkQLG4FP/images-19.jpg', type: 'image' },
  { id: 'img4', url: 'https://i.ibb.co.com/Y4B1PFhY/images-20.jpg', type: 'image' },
  { id: 'img5', url: 'https://i.ibb.co.com/R4T3SyFN/images-17.jpg', type: 'image' },
  { id: 'img6', url: 'https://i.ibb.co.com/XZ2MzHvb/images-18.jpg', type: 'image' },
  { id: 'img7', url: 'https://i.ibb.co.com/RGDY26q9/com-mobioapp-banglasticker-2500.png', type: 'image' },
  { id: 'img8', url: 'https://i.ibb.co.com/Q3tp9Fb9/images-21.jpg', type: 'image' },
  { id: 'img9', url: 'https://i.ibb.co.com/JNwTq24/Funny-bangla-sticker-1.jpg', type: 'image' },
  { id: 'img10', url: 'https://i.ibb.co.com/kVMqbp4V/882a2a02-9e2f-40cd-ba00-f09ac526051d.jpg', type: 'image' },
  { id: 'img11', url: 'https://i.ibb.co.com/3mX8W48v/Funny-bangla-quotes-2.jpg', type: 'image' },
  { id: 'img12', url: 'https://i.ibb.co.com/23HSgJ0d/65d8190e-c7b4-45a1-8952-c951f035c101.jpg', type: 'image' },
  { id: 'img13', url: 'https://i.ibb.co.com/bgdQ5SVk/image.jpg', type: 'image' },
  { id: 'img14', url: 'https://i.ibb.co.com/xS9fcH5r/13b0b170-94a1-49ad-96d2-e24467af19a8.jpg', type: 'image' },
  { id: 'img15', url: 'https://i.ibb.co.com/LL5yWGq/622e58a6-ba0c-4d7b-870a-a4e1d3d4d48c.jpg', type: 'image' },
  { id: 'img16', url: 'https://i.ibb.co.com/kgPszG0M/a85c5a90-27b3-4058-8abc-f75c8b8dd6f9.jpg', type: 'image' },
  { id: 'img17', url: 'https://i.ibb.co.com/4Rcpz7LR/image.jpg', type: 'image' },
  { id: 'img18', url: 'https://i.ibb.co.com/RGbZZXyz/Friends-funny-quotes-6.jpg', type: 'image' },
  { id: 'img19', url: 'https://i.ibb.co.com/dJtLQyp0/Friend-funny-quotes-2.jpg', type: 'image' },
  { id: 'img20', url: 'https://i.ibb.co.com/6R6ff2PY/Funny-bangla-quotes-1.jpg', type: 'image' },
  { id: 'img21', url: 'https://i.ibb.co.com/MrVqSdv/Friends-funny-quotes-5.jpg', type: 'image' },
  { id: 'img22', url: 'https://i.ibb.co.com/84Sc6YTN/e5345abc-d30c-4161-bae6-6efd75fea1a1.jpg', type: 'image' },
  { id: 'img23', url: 'https://i.ibb.co.com/wNtDmrSd/Friends-funny-quotes-4.jpg', type: 'image' },
  { id: 'img24', url: 'https://i.ibb.co.com/r2qnrVbh/friends-funny-quotes-3.jpg', type: 'image' },
  { id: 'img25', url: 'https://i.ibb.co.com/k2QZMpzW/Friend-funny-quotes-1.jpg', type: 'image' },
  { id: 'img26', url: 'https://i.ibb.co.com/0pRd9GX4/ee802df9-85bc-4415-8bd2-7f942e3226da.jpg', type: 'image' },
  { id: 'img27', url: 'https://i.ibb.co.com/kgXXctmQ/0e268bec-f166-4dea-9eb8-b5a2734325e0.jpg', type: 'image' },
  { id: 'img28', url: 'https://i.ibb.co.com/BH5XRzR8/Friends-funny-quotes-2.jpg', type: 'image' },
  { id: 'img29', url: 'https://i.ibb.co.com/99XNKB1y/13a5b7fd-3779-4136-8c2d-5b4c844757f8.jpg', type: 'image' },
  { id: 'img30', url: 'https://i.ibb.co.com/JRzgKqhf/Friend-funny-quotes.jpg', type: 'image' },
  { id: 'img31', url: 'https://i.ibb.co.com/Hp7K7Sh9/3167c0f2-ff0f-464c-b6c2-09d76634e26a.jpg', type: 'image' },
  { id: 'img32', url: 'https://i.ibb.co.com/HfxDB7Hh/9e302f4f-34a1-451a-bf3e-d252284106ca.jpg', type: 'image' },
  { id: 'img33', url: 'https://i.ibb.co.com/WvPgwS2Z/Funny-bangla-quotes.jpg', type: 'image' },
  { id: 'img34', url: 'https://i.ibb.co.com/Zz4sqrhY/77e117a0-df2b-4786-a5d7-5b3d8c2e3a7c.jpg', type: 'image' },
  { id: 'img35', url: 'https://i.ibb.co.com/01KLdFJ/friends-funny-quotes-1.jpg', type: 'image' },
  { id: 'img36', url: 'https://i.ibb.co.com/ksVMzKWt/friends-funny-quotes.jpg', type: 'image' },
  { id: 'img37', url: 'https://i.ibb.co.com/1fpr5hQ9/6b7f41e2-3655-4264-be31-8427d85219e1.jpg', type: 'image' },
  { id: 'img38', url: 'https://i.ibb.co.com/wF4kTHXK/Funny-bangla-sticker.jpg', type: 'image' },
  { id: 'img39', url: 'https://i.ibb.co.com/0VByrR0g/a5be1d62229085-Y3-Jvc-Cwx-Njgy-LDEz-MTYs-MCw0-MQ.png', type: 'image' },
  { id: 'img40', url: 'https://i.ibb.co.com/sdfdSGtw/images-2.jpg', type: 'image' },
  { id: 's1', text: 'দারুণ!', type: 'text', color: 'bg-green-500' },
  { id: 's2', text: 'অসাধারণ', type: 'text', color: 'bg-blue-500' },
  { id: 's3', text: 'শুভকামনা', type: 'text', color: 'bg-pink-500' },
  { id: 's4', text: 'মন ছুঁয়ে গেল', type: 'text', color: 'bg-purple-500' },
  { id: 's5', text: 'একমত 👍', type: 'text', color: 'bg-orange-500' },
  { id: 's6', text: 'কি কিউট!', type: 'text', color: 'bg-rose-400' },
];

interface ChatDetailProps {
  friend: { id: string; name: string; avatar: string; isActive?: boolean; lastActive?: number };
  messages: Message[];
  settings: ChatSettings;
  onSendMessage: (params: { text?: string; image?: string; video?: string; audio?: string; sticker?: string }) => void;
  onReactToMessage: (messageId: string, reaction: keyof ReactionCounts | null) => void;
  onDeleteMessage: (messageId: string) => void;
  onUnsendMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onForwardMessage: (messageId: string) => void;
  onUpdateSettings: (newSettings: ChatSettings) => void;
  onBack: () => void;
  onNavigateToProfile?: (userId: string) => void;
  allUsers: Record<string, UserInfo>;
  onUpdateNote?: (userId: string, note: string) => void;
}

const formatLastActive = (timestamp?: number) => {
  if (!timestamp) return '';
  const diffInMinutes = Math.floor((Date.now() - timestamp) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

const REACTION_EMOJIS: Record<keyof ReactionCounts, string> = {
  like: '👍', love: '❤️', care: '🥰', haha: '😆', wow: '😮', sad: '😢', angry: '😡'
};

const ChatDetail: React.FC<ChatDetailProps> = ({ 
  friend, messages, settings, onSendMessage, onReactToMessage, onDeleteMessage, onUnsendMessage, onEditMessage, onForwardMessage, onUpdateSettings, onBack, onNavigateToProfile, allUsers, onUpdateNote 
}) => {
  const [inputText, setInputText] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [longPressedMsg, setLongPressedMsg] = useState<Message | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Special Effect States
  const [showSpecialEffect, setShowSpecialEffect] = useState(false);
  const [snowflakes, setSnowflakes] = useState<{id: number, left: number, delay: number, size: number}[]>([]);
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pressTimer = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Voice Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Select best supported MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : 'audio/aac';
          
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const reader = new FileReader();
          reader.onloadend = () => {
            onSendMessage({ audio: reader.result as string });
          };
          reader.readAsDataURL(audioBlob);
        }
        cleanupStream();
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হচ্ছে। অনুগ্রহ করে পারমিশন চেক করুন।");
    }
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const stopRecording = (shouldSend: boolean = true) => {
    if (mediaRecorderRef.current && isRecording) {
      if (!shouldSend) {
        // Clear chunks and overwrite onstop to prevent sending
        audioChunksRef.current = [];
        mediaRecorderRef.current.onstop = cleanupStream;
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerSpecialAnimation = () => {
    if (showSpecialEffect) return;
    setShowSpecialEffect(true);
    const newSnow = Array.from({ length: 50 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      size: Math.random() * 15 + 10
    }));
    setSnowflakes(newSnow);
    onSendMessage({ text: 'তোমাকে ভীষণ মিস করছি 🥺' });
    setTimeout(() => {
      setShowSpecialEffect(false);
      setSnowflakes([]);
    }, 3000);
  };

  const handleBackgroundClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('chat-bg-area')) return;
    const now = Date.now();
    if (now - lastTapRef.current < 500) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;
    if (tapCountRef.current === 3) {
      triggerSpecialAnimation();
      tapCountRef.current = 0;
    }
    setShowStickers(false);
  };

  const handleSend = () => {
    if (settings?.isBlocked) return;
    if (!inputText.trim()) {
      if (editingMessage) {
        setEditingMessage(null);
        setInputText('');
      } else {
        onSendMessage({ sticker: '👍' });
      }
      return;
    }
    
    if (editingMessage) {
      onEditMessage(editingMessage.id, inputText);
      setEditingMessage(null);
    } else {
      onSendMessage({ text: inputText });
    }
    setInputText('');
  };

  const handleSendSticker = (sticker: string) => {
    if (settings?.isBlocked) return;
    onSendMessage({ sticker });
    setShowStickers(false);
  };

  const handleLongPress = (msg: Message) => {
    setLongPressedMsg(msg);
  };

  const activeFriendName = settings?.friendNickname || friend.name;
  const safeThemeColor = settings?.themeColor || 'bg-green-600';
  const themeAccent = safeThemeColor.includes('gradient') 
    ? `${safeThemeColor} bg-clip-text text-transparent` 
    : safeThemeColor.replace('bg-', 'text-');
  const bubbleColor = settings?.isBlocked ? 'bg-gray-200' : safeThemeColor;

  if (showInfo) {
    return (
      <ChatInfoPage 
        friend={friend} 
        settings={settings} 
        onUpdateSettings={onUpdateSettings} 
        onBack={() => setShowInfo(false)}
        onNavigateToProfile={onNavigateToProfile}
        allUsers={allUsers}
        onUpdateNote={onUpdateNote}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[210] bg-white dark:bg-[#18191a] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3 border-b dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#242526] sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><i className="fa-solid fa-arrow-left text-xl text-gray-700 dark:text-gray-300"></i></button>
          <div className="relative cursor-pointer" onClick={() => onNavigateToProfile?.(friend.id)}>
            <img src={friend.avatar} className="w-10 h-10 rounded-2xl object-cover border dark:border-gray-700" referrerPolicy="no-referrer" />
            {friend.isActive && <div className={`absolute bottom-0 right-0 w-3 h-3 ${safeThemeColor} border-2 border-white dark:border-[#242526] rounded-full`}></div>}
          </div>
          <div className="cursor-pointer group" onClick={() => onNavigateToProfile?.(friend.id)}>
            <h4 className={`font-bold text-sm md:text-base group-hover:underline ${themeAccent}`}>{activeFriendName}</h4>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              {friend.isActive ? 'Active now' : (friend.lastActive ? (formatLastActive(friend.lastActive) === 'Just now' ? 'Active Just now' : `Active ${formatLastActive(friend.lastActive)} ago`) : 'Offline')}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-5 ${themeAccent}`}>
          <button onClick={() => setCallType('audio')} className="active:scale-90 transition-transform"><i className="fa-solid fa-phone text-lg"></i></button>
          <button onClick={() => setCallType('video')} className="active:scale-90 transition-transform"><i className="fa-solid fa-video text-lg"></i></button>
          <button onClick={() => setShowInfo(true)} className="active:scale-90 transition-transform"><i className="fa-solid fa-circle-info text-lg"></i></button>
        </div>
      </div>

      {/* Special Animation Overlay */}
      {showSpecialEffect && (
        <div className="fixed inset-0 z-[500] pointer-events-none flex flex-col items-center justify-center overflow-hidden">
          <div className="relative">
             <div className="text-[180px] animate-heart-focus-burst drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">❤️</div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-ping bg-red-400/20 rounded-full"></div>
             </div>
          </div>
          {snowflakes.map(snow => (
            <div 
              key={snow.id} 
              className="absolute text-white/90 animate-snow-fall filter drop-shadow-md"
              style={{ left: `${snow.left}%`, animationDelay: `${snow.delay}s`, fontSize: `${snow.size}px` }}
            >
              <i className="fa-solid fa-snowflake"></i>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-md animate-snow-ground"></div>
        </div>
      )}

      {/* Message List */}
      <div 
        ref={scrollRef} 
        onClick={handleBackgroundClick}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5] dark:bg-[#18191a] scrollbar-hide relative chat-bg-area"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm relative cursor-pointer active:scale-[0.98] transition-all group ${
                msg.isUnsent 
                  ? 'bg-transparent border border-gray-200 dark:border-gray-700 text-gray-400 italic rounded-2xl' 
                  : msg.isMe 
                    ? `${bubbleColor} text-white rounded-br-none` 
                    : 'bg-white dark:bg-[#242526] text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-800'
              }`}
              onMouseDown={() => { pressTimer.current = window.setTimeout(() => handleLongPress(msg), 500); }}
              onMouseUp={() => { if (pressTimer.current) clearTimeout(pressTimer.current); }}
              onTouchStart={(e) => { e.stopPropagation(); pressTimer.current = window.setTimeout(() => handleLongPress(msg), 500); }}
              onTouchEnd={() => { if (pressTimer.current) clearTimeout(pressTimer.current); }}
            >
              {msg.isUnsent ? (
                <span className="text-xs">Message unsent</span>
              ) : (
                <>
                  {msg.isForwarded && (
                    <div className="flex items-center gap-1 text-[10px] opacity-70 mb-1 font-bold italic">
                      <i className="fa-solid fa-share text-[8px]"></i> Forwarded
                    </div>
                  )}
                  {msg.text && <p className="whitespace-pre-wrap font-semibold leading-snug">{msg.text}</p>}
                  {msg.isEdited && (
                    <div className="text-[9px] opacity-60 text-right mt-0.5 italic">(edited)</div>
                  )}
                  {msg.sharedPost && (
                    <div className="mt-2 border dark:border-gray-700 rounded-xl overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-sm">
                      <div className="p-2 flex items-center gap-2 border-b dark:border-gray-700 bg-white/5">
                        <img src={msg.sharedPost.avatar} alt={msg.sharedPost.author} className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <span className="text-[10px] font-bold truncate">{msg.sharedPost.author}</span>
                      </div>
                      <div className="p-2">
                        {msg.sharedPost.content && <p className="text-[11px] line-clamp-2 mb-1 opacity-90 leading-tight">{msg.sharedPost.content}</p>}
                        {msg.sharedPost.image && (
                          msg.sharedPost.image.startsWith('data:video/') || msg.sharedPost.image.includes('.mp4') ? (
                            <video src={msg.sharedPost.image} className="w-full h-24 object-cover rounded-md" controls />
                          ) : (
                            <img src={msg.sharedPost.image} className="w-full h-24 object-cover rounded-md" alt="shared" referrerPolicy="no-referrer" />
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {msg.image && (
                    msg.image.startsWith('data:video/') || msg.image.includes('.mp4') ? (
                      <video src={msg.image} className="rounded-xl max-h-64 w-full object-cover mt-1" controls />
                    ) : (
                      <img src={msg.image} className="rounded-xl max-h-64 w-full object-cover mt-1" referrerPolicy="no-referrer" />
                    )
                  )}
                  {msg.video && <video src={msg.video} controls className="rounded-xl max-h-64 w-full mt-1" />}
                  {msg.audio && (
                    <VoiceMessagePlayer 
                      audioUrl={msg.audio} 
                      isMe={msg.isMe} 
                      themeColor={safeThemeColor} 
                    />
                  )}
                  {msg.sticker && (
                    msg.sticker.startsWith('http') ? (
                      <img src={msg.sticker} alt="Sticker" className="w-32 h-32 object-contain py-2" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-5xl py-2">{msg.sticker}</div>
                    )
                  )}
                </>
              )}
              {msg.reaction && !msg.isUnsent && (
                <div className={`absolute -bottom-2 ${msg.isMe ? 'left-1' : 'right-1'} bg-white dark:bg-[#242526] rounded-full shadow-lg px-1.5 py-0.5 border dark:border-gray-700 flex items-center justify-center animate-in zoom-in duration-200`}>
                  <span className="text-[12px]">{REACTION_EMOJIS[msg.reaction]}</span>
                </div>
              )}
            </div>
            {!msg.isUnsent && (
              <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-1 mx-2 font-black uppercase tracking-widest">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={`p-3 border-t dark:border-gray-800 bg-white dark:bg-[#242526] shadow-lg relative ${settings?.isBlocked ? 'opacity-30 pointer-events-none' : ''}`}>
        {editingMessage && (
          <div className="absolute bottom-full left-0 right-0 bg-gray-50 dark:bg-gray-800/80 p-3 border-t dark:border-gray-700 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <i className="fa-solid fa-pen text-sm"></i>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Editing Message</span>
                <span className="text-xs opacity-70 line-clamp-1">{editingMessage.text}</span>
              </div>
            </div>
            <button onClick={() => { setEditingMessage(null); setInputText(''); }} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        )}
        {showStickers && (
          <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-[#242526] p-4 border-t dark:border-gray-800 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stickers</span>
              <button onClick={() => setShowStickers(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div className="mb-4">
              <span className="text-xs font-bold text-gray-500 mb-2 block">Bengali Stickers</span>
              <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-32 scrollbar-hide">
                {BENGALI_STICKERS.map(sticker => (
                  <button
                    key={sticker.id}
                    onClick={() => handleSendSticker(sticker.type === 'image' ? sticker.url : sticker.text)}
                    className="py-2 px-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center text-center shadow-sm min-h-[60px]"
                  >
                    {sticker.type === 'image' ? (
                      <img src={sticker.url} alt="sticker" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-[10px]">{sticker.text}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-bold text-gray-500 mb-2 block">Emojis</span>
            <div className="grid grid-cols-6 gap-4 overflow-y-auto max-h-32 scrollbar-hide">
              {['👍', '❤️', '🥰', '😆', '😮', '😢', '😡', '🔥', '✨', '🎉', '💯', '🙌', '👏', '🤝', '🙏', '💪', '🌹', '🌈'].map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSendSticker(s)}
                  className="text-4xl hover:scale-125 transition-transform active:scale-90"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {isRecording ? (
          <div className="flex items-center justify-between gap-4 px-2 py-1 animate-in slide-in-from-bottom-2">
            <button onClick={() => stopRecording(false)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors">
              <i className="fa-solid fa-trash-can text-xl"></i>
            </button>
            <div className="flex-1 flex items-center gap-3">
               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
               <span className="text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">{formatRecordingTime(recordingTime)}</span>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Recording...</span>
            </div>
            <button onClick={() => stopRecording(true)} className={`${safeThemeColor} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform`}>
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex gap-1">
              <button onClick={() => setShowStickers(!showStickers)} className={`${themeAccent} p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-90`}>
                <i className="fa-solid fa-face-smile text-xl"></i>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className={`${themeAccent} p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors`}><i className="fa-solid fa-image text-xl"></i></button>
              <button onClick={() => videoInputRef.current?.click()} className={`${themeAccent} p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors`}><i className="fa-solid fa-video text-xl"></i></button>
              <button onClick={startRecording} className={`${themeAccent} p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-90`}><i className="fa-solid fa-microphone text-xl"></i></button>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2.5 flex items-center shadow-inner border dark:border-gray-700">
              <input 
                type="text" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                placeholder="Aa" 
                className="w-full bg-transparent outline-none text-[15px] font-semibold" 
              />
            </div>
            <button onClick={handleSend} className={`${themeAccent} p-2.5 active:scale-90 transition-all`}><i className={`fa-solid ${inputText.trim() ? 'fa-paper-plane' : 'fa-thumbs-up'} text-2xl`}></i></button>
          </div>
        )}
      </div>

      {/* Message Options Bottom Sheet */}
      {longPressedMsg && (
        <div className="fixed inset-0 z-[310] bg-black/60 backdrop-blur-[2px] flex items-end animate-in fade-in duration-200" onClick={() => setLongPressedMsg(null)}>
           <div className="w-full bg-white dark:bg-[#242526] rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
             <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8"></div>
             {!longPressedMsg.isUnsent && (
               <div className="flex justify-between items-center mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border dark:border-gray-700 overflow-x-auto scrollbar-hide">
                 {Object.entries(REACTION_DATA).map(([key, data], index) => (
                   <button key={key} onClick={() => { 
                     const newReaction = longPressedMsg.reaction === key ? null : key as keyof ReactionCounts;
                     onReactToMessage(longPressedMsg.id, newReaction); 
                     setLongPressedMsg(null); 
                   }} className={`flex flex-col items-center gap-1.5 hover:scale-125 transition-transform active:scale-90 group ${longPressedMsg.reaction === key ? 'scale-125' : ''}`}>
                     <span className="text-3xl drop-shadow-sm">{data.emoji}</span>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${data.color} opacity-0 group-hover:opacity-100 transition-opacity`}>{data.label}</span>
                   </button>
                 ))}
               </div>
             )}
             <div className="space-y-2">
               {longPressedMsg.isMe && !longPressedMsg.isUnsent && longPressedMsg.text && (
                 <button onClick={() => { setEditingMessage(longPressedMsg); setInputText(longPressedMsg.text || ''); setLongPressedMsg(null); }} className="w-full p-4 flex items-center gap-4 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 font-bold rounded-2xl transition-all active:scale-[0.98]">
                   <div className="w-10 h-10 bg-white dark:bg-green-900/20 rounded-full flex items-center justify-center shadow-sm"><i className="fa-solid fa-pen"></i></div>
                   <span>Edit Message</span>
                 </button>
               )}
               {!longPressedMsg.isUnsent && (
                 <button onClick={() => { onForwardMessage(longPressedMsg.id); setLongPressedMsg(null); }} className="w-full p-4 flex items-center gap-4 bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 font-bold rounded-2xl transition-all active:scale-[0.98]">
                   <div className="w-10 h-10 bg-white dark:bg-purple-900/20 rounded-full flex items-center justify-center shadow-sm"><i className="fa-solid fa-share"></i></div>
                   <span>Forward Message</span>
                 </button>
               )}
               {longPressedMsg.isMe && !longPressedMsg.isUnsent && (
                 <button onClick={() => { onUnsendMessage(longPressedMsg.id); setLongPressedMsg(null); }} className="w-full p-4 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-bold rounded-2xl transition-all active:scale-[0.98]">
                   <div className="w-10 h-10 bg-white dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-sm"><i className="fa-solid fa-rotate-left"></i></div>
                   <span>Unsend Message</span>
                 </button>
               )}
               <button onClick={() => { onDeleteMessage(longPressedMsg.id); setLongPressedMsg(null); }} className="w-full p-4 flex items-center gap-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold rounded-2xl transition-all active:scale-[0.98]">
                 <div className="w-10 h-10 bg-white dark:bg-red-900/20 rounded-full flex items-center justify-center shadow-sm"><i className="fa-solid fa-trash-can"></i></div>
                 <span>Delete for me</span>
               </button>
               <button onClick={() => setLongPressedMsg(null)} className="w-full p-4 mt-4 bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-center text-xs uppercase tracking-[0.2em] rounded-2xl">Cancel</button>
             </div>
           </div>
        </div>
      )}

      {callType && <CallOverlay friend={{ name: activeFriendName, avatar: friend.avatar }} type={callType} onEnd={() => setCallType(null)} />}
      
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        if(e.target.files?.[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => onSendMessage({ image: ev.target?.result as string });
          reader.readAsDataURL(e.target.files[0]);
        }
      }} />
      <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => {
        if(e.target.files?.[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => onSendMessage({ video: ev.target?.result as string });
          reader.readAsDataURL(e.target.files[0]);
        }
      }} />

      <style>{`
        @keyframes heartFocusBurst {
          0% { transform: scale(0); opacity: 0; filter: blur(20px); }
          40% { transform: scale(1.4); opacity: 1; filter: blur(0); }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(8); opacity: 0; filter: blur(80px); }
        }
        @keyframes snowFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes snowGround {
          0% { opacity: 0; transform: translateY(20px) scaleX(0.8); }
          30% { opacity: 1; transform: translateY(0) scaleX(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-heart-focus-burst { animation: heartFocusBurst 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-snow-fall { animation: snowFall 3s linear forwards; }
        .animate-snow-ground { animation: snowGround 3.2s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default ChatDetail;
