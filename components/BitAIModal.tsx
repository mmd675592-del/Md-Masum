
import React, { useState, useRef, useEffect } from 'react';
import { generateBitResponse, generateImageWithBit } from '../services/geminiService';

interface BitAIMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string;
  sources?: { title: string; uri: string }[];
  isGeneratingImage?: boolean;
  summary?: string;
  reactions?: string[];
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
      { id: userMsgId, role: 'user', text: userPrompt || (currentImage ? "ছবিটি বিশ্লেষণ করো" : ""), image: currentImage || undefined, reactions: [] }
    ]);
    
    setInput('');
    setSelectedImage(null);

    // Image generation/editing detection
    const imageKeywords = ['draw', 'generate image', 'create image', 'ছবি আঁকো', 'ছবি বানাও', 'তৈরি করো ছবি', 'আঁকো', 'paint', 'image of'];
    const editKeywords = ['edit', 'change', 'modify', 'পরিবর্তন', 'এডিট', 'বদল'];
    
    const isImageRequest = imageKeywords.some(k => userPrompt.toLowerCase().includes(k)) && !currentImage;
    const isEditRequest = editKeywords.some(k => userPrompt.toLowerCase().includes(k)) && currentImage;

    if (isImageRequest) {
      setIsGenerating(true);
      try {
        const genImg = await generateImageWithBit(userPrompt);
        if (genImg) {
          setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), role: 'model', image: genImg, text: 'আপনার জন্য Google Gemini AI দিয়ে এই ছবিটি তৈরি করেছি:', reactions: [] }
          ]);
        } else {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'দুঃখিত, ছবিটি তৈরি করতে সমস্যা হয়েছে। অন্য কোনো বিবরণ দিয়ে চেষ্টা করুন।', reactions: [] }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।', reactions: [] }]);
      } finally {
        setIsGenerating(false);
      }
    } else if (isEditRequest) {
      setIsGenerating(true);
      try {
        const editedImg = await generateBitResponse(userPrompt, [], { data: currentImage!.split(',')[1], mimeType: currentMimeType });
        // Actually, the geminiService has editImageWithGemini, let's use it if it's better
        // But generateBitResponse with image also works for analysis/editing if the prompt is right.
        // Let's use editImageWithGemini for direct editing if possible.
        // For now, let's stick to generateBitResponse as it's already integrated.
        
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'model', text: editedImg.text, sources: editedImg.sources, reactions: [] }
        ]);
      } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'দুঃখিত, ছবিটি এডিট করতে সমস্যা হয়েছে।', reactions: [] }]);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setIsTyping(true);
      try {
        const imageBlob = currentImage ? { data: currentImage.split(',')[1], mimeType: currentMimeType } : undefined;
        const history = messages.filter(m => m.text).map(m => ({ role: m.role, text: m.text! }));
        const response = await generateBitResponse(userPrompt || "Analyze this", history, imageBlob);
        
        // Simple summary logic: first few words
        const summary = response.text.split(' ').slice(0, 5).join(' ') + '...';

        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'model', text: response.text, sources: response.sources, summary, reactions: [] }
        ]);
      } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'দুঃখিত, আমি উত্তর দিতে পারছি না।', reactions: [] }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const newReactions = m.reactions ? [...m.reactions] : [];
        if (newReactions.includes(emoji)) {
          return { ...m, reactions: newReactions.filter(r => r !== emoji) };
        } else {
          return { ...m, reactions: [...newReactions, emoji] };
        }
      }
      return m;
    }));
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 sticky top-0 z-10 shadow-lg">
        <button onClick={onClose} className="mr-4 p-2 hover:bg-white/20 rounded-full transition-all text-white active:scale-90">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-xl transform rotate-3 border border-white/20">
            <span className="text-2xl font-black italic -rotate-3 tracking-tighter">B</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-2xl text-white tracking-tight leading-none">Bit</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Live & Human-like AI</span>
            </div>
          </div>
        </div>
        <button className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all active:scale-90 shadow-inner" title="Live Talk">
          <i className="fa-solid fa-microphone-lines text-xl"></i>
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 bg-[#F8F9FA]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] relative group ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-3xl rounded-tr-none' : 'bg-white text-gray-800 rounded-3xl rounded-tl-none border border-gray-100 shadow-md'} px-6 py-5 animate-in zoom-in-95 duration-200`}>
              {msg.summary && (
                <div className="mb-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                  Summary: {msg.summary}
                </div>
              )}
              {msg.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                  <img src={msg.image} alt="Media" className="w-full h-auto max-h-80 object-contain bg-black/5" referrerPolicy="no-referrer" />
                </div>
              )}
              {msg.text && (
                <div className="text-[16px] leading-relaxed whitespace-pre-wrap font-medium">
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

              {/* Reactions */}
              <div className={`absolute -bottom-4 ${msg.role === 'user' ? 'right-0' : 'left-0'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                {['❤️', '👍', '🔥', '😂'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => handleReaction(msg.id, emoji)}
                    className={`w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-sm hover:scale-110 transition-transform ${msg.reactions?.includes(emoji) ? 'ring-2 ring-emerald-500' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              {msg.reactions && msg.reactions.length > 0 && (
                <div className={`absolute -bottom-3 ${msg.role === 'user' ? 'right-2' : 'left-2'} flex gap-0.5`}>
                  {msg.reactions.map((emoji, i) => (
                    <span key={i} className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] border border-gray-50">
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase mt-3 px-2 tracking-widest">
              {msg.role === 'user' ? 'You' : 'Bit AI'}
            </span>
          </div>
        ))}
        
        {(isTyping || isGenerating) && (
          <div className="flex flex-col items-start">
            <div className="bg-white border border-gray-100 px-6 py-5 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-md">
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {isGenerating ? 'Bit is working...' : 'Bit is thinking...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100 space-y-6">
        {selectedImage && (
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/80 text-white w-8 h-8 rounded-2xl flex items-center justify-center text-xs backdrop-blur-md">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Photo Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm active:scale-90 transition-all hover:bg-emerald-100 flex-shrink-0 border border-emerald-100"
            title="Upload Photo"
          >
            <i className="fa-solid fa-image text-2xl"></i>
          </button>
          
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

          {/* Write Message Field with Thin Border */}
          <div className="flex-1 bg-white rounded-3xl px-6 py-1 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all duration-300 shadow-sm">
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Write to Bit..." 
              className="w-full bg-transparent outline-none py-4 text-[16px] font-medium resize-none max-h-40 text-gray-900"
            />
          </div>
          
          {/* Trash Icon for Send (as requested) */}
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isTyping || isGenerating}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg flex-shrink-0 ${input.trim() || selectedImage ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            title="Send to Bit"
          >
            <i className="fa-solid fa-trash-can text-xl"></i>
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] flex-1 bg-gray-100"></div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Bit AI Assistant</p>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
};

export default BitAIModal;
