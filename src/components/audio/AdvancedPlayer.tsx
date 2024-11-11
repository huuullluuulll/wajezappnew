import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';
import {
  PlayIcon, PauseIcon, ForwardIcon, BackwardIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import { audioApi } from '../../lib/api';

interface PlayerProps {
  bookId: string;
  audioUrl: string;
  onProgressUpdate?: (progress: number) => void;
}

export const AdvancedPlayer: React.FC<PlayerProps> = ({
  bookId,
  audioUrl,
  onProgressUpdate
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  // Fetch saved progress
  const { data: savedProgress } = useQuery(
    ['audioProgress', user?.id, bookId],
    () => user ? audioApi.getProgress(user.id, bookId) : null,
    {
      enabled: !!user && !!bookId,
      staleTime: 30000,
      onError: (err) => {
        console.error('Error fetching progress:', err);
        setError('خطأ في تحميل التقدم');
      }
    }
  );

  const isCompleted = savedProgress?.is_completed ?? false;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Save progress mutation
  const saveProgress = useMutation(
    async () => {
      if (!user || !audioRef.current) return null;
      return audioApi.saveProgress(
        user.id,
        bookId,
        audioRef.current.currentTime,
        playbackRate,
        volume
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['audioProgress', user?.id, bookId]);
      },
      onError: (err) => {
        console.error('Error saving progress:', err);
      }
    }
  );

  // Debounced save progress
  const debouncedSaveProgress = useCallback(
    debounce((position: number, speed: number, vol: number) => {
      if (!user) return;
      audioApi.saveProgress(user.id, bookId, position, speed, vol)
        .then(() => {
          queryClient.invalidateQueries(['audioProgress', user.id, bookId]);
        })
        .catch(err => console.error('Error in debounced save:', err));
    }, 2000),
    [user, bookId, queryClient]
  );

  // Initialize audio player with saved progress
  useEffect(() => {
    if (audioRef.current && savedProgress && !hasLoadedProgress) {
      audioRef.current.currentTime = savedProgress.current_position || 0;
      audioRef.current.playbackRate = savedProgress.playback_speed || 1;
      audioRef.current.volume = savedProgress.volume || 1;
      setPlaybackRate(savedProgress.playback_speed || 1);
      setVolume(savedProgress.volume || 1);
      setCurrentTime(savedProgress.current_position || 0);
      setHasLoadedProgress(true);
    }
  }, [savedProgress, hasLoadedProgress]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Playback error:', err);
      toast.error('خطأ في تشغيل الملف الصوتي');
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    
    const progress = (time / duration) * 100;
    onProgressUpdate?.(progress);
    
    debouncedSaveProgress(time, playbackRate, volume);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    
    setDuration(audioRef.current.duration);
    setIsLoading(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#2A2A2A] p-4 shadow-lg backdrop-blur-lg">
      <div className="max-w-4xl mx-auto" dir="ltr">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-neon bg-[#2A2A2A] h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #C5FF3F ${progress}%, #2A2A2A ${progress}%)`
              }}
            />
            {isCompleted && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neon text-black px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                <span>مكتمل</span>
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => skipTime(-10)}
              className="p-2 hover:bg-[#2A2A2A] rounded-xl transition-colors"
              disabled={isLoading}
            >
              <BackwardIcon className="h-6 w-6 text-gray-400 hover:text-neon" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 bg-neon rounded-xl text-black hover:bg-neon/90 disabled:opacity-50 transition-colors"
              disabled={isLoading}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-2 hover:bg-[#2A2A2A] rounded-xl transition-colors"
              disabled={isLoading}
            >
              <ForwardIcon className="h-6 w-6 text-gray-400 hover:text-neon" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleMute} 
              className="p-2 hover:bg-[#2A2A2A] rounded-xl transition-colors"
              disabled={isLoading}
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-6 w-6 text-gray-400 hover:text-neon" />
              ) : (
                <SpeakerWaveIcon className="h-6 w-6 text-gray-400 hover:text-neon" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-neon"
              disabled={isLoading}
            />

            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                if (audioRef.current) {
                  audioRef.current.playbackRate = rate;
                  setPlaybackRate(rate);
                }
              }}
              className="bg-[#2A2A2A] text-gray-300 rounded-xl px-3 py-2 text-sm hover:bg-[#3A3A3A] transition-colors focus:outline-none focus:ring-2 focus:ring-neon"
              disabled={isLoading}
            >
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            saveProgress.mutate();
          }}
          onError={(e) => {
            console.error('Audio error:', e);
            toast.error('خطأ في تحميل الملف الصوتي');
            setIsLoading(false);
            setError('خطأ في تحميل الملف الصوتي');
          }}
        />
      </div>
    </div>
  );
};