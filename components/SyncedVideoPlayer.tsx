import React, { useRef, useState, useEffect } from 'react';
import { ReactionItem } from '../types';
import { XCircle, Play, Pause, RotateCcw } from 'lucide-react';

interface SyncedVideoPlayerProps {
  videoUrl: string;
  script: ReactionItem[];
  onClear: () => void;
}

const SyncedVideoPlayer: React.FC<SyncedVideoPlayerProps> = ({ videoUrl, script, onClear }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeReaction, setActiveReaction] = useState<ReactionItem | null>(null);

  // Convert "MM:SS" to seconds
  const parseTimestamp = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Find active reaction (display for 4 seconds after timestamp)
      const reaction = script.find(item => {
        const startTime = parseTimestamp(item.timestamp);
        return time >= startTime && time < startTime + 4;
      });
      
      setActiveReaction(reaction || null);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in">
      <div className="relative bg-black border-4 border-red-900 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] group">
        
        <video 
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[500px] object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onClick={togglePlay}
        />

        {/* Control Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <button 
                onClick={togglePlay}
                className="p-4 bg-red-600/90 text-white rounded-full hover:bg-red-500 transition-transform transform hover:scale-110 shadow-lg backdrop-blur-sm"
            >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
        </div>

        {/* Reaction Bubble Overlay */}
        {activeReaction && (
            <div className="absolute bottom-12 left-0 right-0 px-8 flex justify-center pointer-events-none">
                <div className="animate-bounce-in origin-bottom">
                    <div className="relative bg-white text-black px-6 py-4 rounded-2xl shadow-2xl border-4 border-black max-w-lg transform -rotate-1">
                         {/* Speech bubble triangle */}
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-black"></div>
                        <div className="absolute -bottom-[10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                        
                        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1 brand-font">
                            {activeReaction.emotion}
                        </p>
                        <p className="text-2xl md:text-3xl font-black uppercase italic leading-none tracking-tight">
                            "{activeReaction.line}"
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Close Button */}
        <button 
          onClick={onClear}
          className="absolute top-4 right-4 p-2 bg-gray-900/80 text-white rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm border border-gray-700 z-20"
          title="Close and Upload New"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>
      
      <div className="mt-3 flex justify-between items-center text-gray-400 px-2">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-mono tracking-widest uppercase">Review Mode</span>
        </div>
        <button 
            onClick={() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            }}
            className="text-xs hover:text-white flex items-center gap-1 transition-colors"
        >
            <RotateCcw className="w-3 h-3" /> Replay
        </button>
      </div>
    </div>
  );
};

export default SyncedVideoPlayer;