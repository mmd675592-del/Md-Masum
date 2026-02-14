
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

interface CallOverlayProps {
  friend: { name: string; avatar: string };
  type: 'audio' | 'video';
  onEnd: () => void;
}

// Fixed Encode/Decode Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const CallOverlay: React.FC<CallOverlayProps> = ({ friend, type, onEnd }) => {
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    
    const startCall = async () => {
      try {
        // Must create instance right before connecting
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;

        // Resume contexts - required for many browsers
        if (inputCtx.state === 'suspended') await inputCtx.resume();
        if (outputCtx.state === 'suspended') await outputCtx.resume();

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setIsConnected(true);
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted || !isConnected) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message) => {
              const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioBase64) {
                const outCtx = audioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(audioBase64), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outCtx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error("Gemini Live Error:", e);
              setErrorMsg("Connection lost. Trying to reconnect...");
            },
            onclose: () => onEnd()
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            },
            systemInstruction: `You are in a real-time call with ${friend.name}. Be conversational, concise, and helpful.`
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error("Call startup failure:", err);
        setErrorMsg("Failed to start call. Please check permissions.");
        setTimeout(onEnd, 3000);
      }
    };

    startCall();

    return () => {
      clearInterval(interval);
      setIsConnected(false);
      if (sessionRef.current) {
        try { sessionRef.current.close(); } catch(e) {}
      }
      sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#0c0c0c] flex flex-col items-center justify-between py-16 animate-in fade-in duration-500 overflow-hidden text-white">
      {/* Background Pulse */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-500 rounded-full blur-[180px] transition-all duration-1000 ${isConnected ? 'animate-pulse scale-110 opacity-30' : 'scale-50 opacity-10'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className={`w-36 h-36 rounded-3xl overflow-hidden border-4 ${isConnected ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-gray-700'} transition-all duration-700 scale-100 active:scale-95`}>
            <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
          </div>
          {isConnected && (
            <>
              <div className="absolute -inset-4 border-2 border-green-500/30 rounded-3xl animate-ping"></div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#0c0c0c] flex items-center justify-center">
                <i className="fa-solid fa-signal text-[10px]"></i>
              </div>
            </>
          )}
        </div>
        
        <h2 className="text-3xl font-black mb-1 uppercase tracking-tight">{friend.name}</h2>
        <div className="flex flex-col items-center gap-2">
          {errorMsg ? (
            <p className="text-red-400 text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
              {errorMsg}
            </p>
          ) : (
            <p className={`text-sm font-black uppercase tracking-[0.2em] ${isConnected ? 'text-green-400' : 'text-gray-500 animate-pulse'}`}>
              {isConnected ? 'On Call' : 'Connecting...'}
            </p>
          )}
          <p className="text-gray-500 font-black font-mono text-lg mt-2">{formatTime(timer)}</p>
        </div>
      </div>

      {/* Audio Wave Visualizer */}
      <div className="flex items-center gap-2 h-16">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-1.5 bg-green-500 rounded-full transition-all duration-300 ${isConnected ? 'animate-bounce' : 'h-1 opacity-20'}`} style={{ 
            height: isConnected ? `${30 + Math.random() * 70}%` : '4px',
            animationDuration: `${0.4 + Math.random() * 0.6}s`,
            animationDelay: `${i * 0.05}s`
          }}></div>
        ))}
      </div>

      <div className="relative z-10 flex gap-10 items-center">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-2xl`}></i>
        </button>
        
        <button 
          onClick={onEnd} 
          className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] active:scale-90 hover:bg-red-700 transition-all border-4 border-red-500/20"
        >
          <i className="fa-solid fa-phone-slash text-3xl"></i>
        </button>
        
        <button 
          className={`w-16 h-16 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center hover:bg-gray-700 transition-all cursor-not-allowed`}
          title="Video not supported in native audio mode"
        >
          <i className="fa-solid fa-video-slash text-2xl"></i>
        </button>
      </div>
      
      <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] mt-4">Bijoy Encrypted Call</p>
    </div>
  );
};

export default CallOverlay;
