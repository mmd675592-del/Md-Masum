
import React, { useState, useRef, useEffect } from 'react';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  isMe: boolean;
  themeColor: string;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ audioUrl, isMe, themeColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Playback error:", err);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      if (total && total !== Infinity) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (d && d !== Infinity) {
        setDuration(d);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressColor = isMe ? 'bg-white/40' : 'bg-gray-200';
  const barColor = isMe ? 'bg-white' : themeColor;

  return (
    <div className="flex items-center gap-3 min-w-[200px] py-1">
      <button 
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90 ${isMe ? 'bg-white text-green-600' : 'bg-green-600 text-white shadow-md'}`}
      >
        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
      </button>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className={`h-1.5 w-full rounded-full relative overflow-hidden ${progressColor}`}>
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-100 ${barColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center px-0.5">
          <span className={`text-[10px] font-bold ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
            {formatTime(currentTime)}
          </span>
          <span className={`text-[10px] font-bold ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
            {duration > 0 ? formatTime(duration) : '...'}
          </span>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
};

export default VoiceMessagePlayer;
