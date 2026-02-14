
import React, { useState, useRef, useEffect } from 'react';
import { generateBitResponse, generateImageWithBit } from '../services/geminiService';

interface BitAIMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string;
  sources?: { title: string; uri: string }[];
  isGeneratingImage?: boolean;
}

interface BitAIModalProps {
  onClose: () => void;
}

const BitAIModal: React.FC<BitAIModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<BitAIMessage[]>([
    { id: 'welcome', role: 'model', text: 'হ্যালো! আমি Bit। আমি আপনাকে তথ্য দিতে পারি এবং আপনার জন্য সুন্দর ছবিও তৈরি করে দিতে পারি। কি সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isGenerating]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping || isGenerating) return;

    const userPrompt = input.trim();
    const currentImage = selectedImage;
    const currentMimeType = imageMimeType;
    
    const userMsgId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', text: userPrompt || (currentImage ? "ছবিটি বিশ্লেষণ করো" : ""), image: currentImage || undefined }
    ]);
    
    setInput('');
    setSelectedImage(null);

    // Image generation detection
    const imageKeywords = ['draw', 'generate image', 'create image', 'ছবি আঁকো', 'ছবি বানাও', 'তৈরি করো ছবি', 'আঁকো', 'paint', 'image of'];
    const isImageRequest = imageKeywords.some(k => userPrompt.toLowerCase().includes(k)) && !currentImage;

    if (isImageRequest) {
      setIsGenerating(true);
      try {
        const genImg = await generateImageWithBit(userPrompt);
        if (genImg) {
          setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), role: 'model', image: genImg, text: 'আপনার জন্য Google Gemini AI দিয়ে এই ছবিটি তৈরি করেছি:' }
          ]);
        } else {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'দুঃখিত, ছবিটি তৈরি করতে সমস্যা হয়েছে। অন্য কোনো বিবরণ দিয়ে চেষ্টা করুন।' }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।' }]);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setIsTyping(true);
      try {
        const imageBlob = currentImage ? { data: currentImage.split(',')[1], mimeType: currentMimeType } : undefined;
        const history = messages.filter(m => m.text).map(m => ({ role: m.role, text: m.text! }));
        const response = await generateBitResponse(userPrompt || "Analyze this", history, imageBlob);
        
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'model', text: response.text, sources: response.sources }
        ]);
      } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'দুঃখিত, আমি উত্তর দিতে পারছি না।' }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <button onClick={onClose} className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600 active:scale-90">
          <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl transform rotate-3 border border-white/10">
            <span className="text-xl font-black italic -rotate-3 tracking-tighter">B</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-xl text-gray-900 tracking-tight leading-none">Bit</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Powered by Google Gemini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 bg-[#FAFAFA]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] ${msg.role === 'user' ? 'bg-black text-white rounded-3xl rounded-tr-none' : 'bg-white text-gray-800 rounded-3xl rounded-tl-none border border-gray-100'} px-5 py-4 shadow-sm animate-in zoom-in-95 duration-200`}>
              {msg.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                  <img src={msg.image} alt="Media" className="w-full h-auto max-h-80 object-contain bg-black/5" />
                </div>
              )}
              {msg.text && (
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.text}
                </div>
              )}
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-2 mb-3 text-emerald-500">
                      <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                      <p className="text-[10px] font-black uppercase tracking-widest">Google Search Sources</p>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {msg.sources.map((source, i) => (
                       <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-gray-50 text-gray-600 px-4 py-2 rounded-xl font-bold border border-gray-100 hover:bg-emerald-50 transition-all flex items-center gap-2">
                         <i className="fa-solid fa-link text-[9px] opacity-50"></i>
                         <span className="truncate max-w-[140px]">{source.title}</span>
                       </a>
                     ))}
                   </div>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase mt-2 px-2 tracking-widest">
              {msg.role === 'user' ? 'You' : 'Bit AI'}
            </span>
          </div>
        ))}
        
        {(isTyping || isGenerating) && (
          <div className="flex flex-col items-start">
            <div className="bg-white border border-gray-100 px-6 py-5 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-sm">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {isGenerating ? 'Drawing with Gemini...' : 'Searching Google...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Separate Buttons as Requested */}
      <div className="p-4 bg-white border-t border-gray-100 space-y-4">
        {selectedImage && (
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-xl animate-in slide-in-from-bottom duration-300">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-1.5 right-1.5 bg-black/80 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs backdrop-blur-md">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Green Photo Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-green-700 flex-shrink-0"
            title="Upload Photo"
          >
            <i className="fa-solid fa-camera-retro text-2xl"></i>
          </button>
          
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

          {/* Write Message Field */}
          <div className="flex-1 bg-gray-100 rounded-3xl px-5 py-2 border-2 border-transparent focus-within:bg-white focus-within:border-gray-200 transition-all duration-300">
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Write massage..." 
              className="w-full bg-transparent outline-none py-3 text-[15px] font-semibold resize-none max-h-40 text-gray-900"
            />
          </div>
          
          {/* Send Button */}
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isTyping || isGenerating}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg flex-shrink-0 ${input.trim() || selectedImage ? 'bg-black text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
          >
            <i className="fa-solid fa-paper-plane text-xl"></i>
          </button>
        </div>
        
        <p className="text-[9px] text-center text-gray-300 font-black uppercase tracking-[0.4em]">Google Gemini AI Studio</p>
      </div>
    </div>
  );
};

export default BitAIModal;
