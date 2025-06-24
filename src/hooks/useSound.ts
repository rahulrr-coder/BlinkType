
import { useRef, useState, useCallback } from "react";

// Simple hook for sound management with mute/volume, using native Audio API
type SoundMap = {
  typing?: string;
  correct?: string;
  error?: string;
  start?: string;
  finish?: string;
};

const defaultSounds: SoundMap = {
  typing: "/sounds/typing.wav",
  correct: "/sounds/correct.mp3", 
  error: "/sounds/error.mp3",
  start: "/sounds/start.mp3",
  finish: "/sounds/finish.mp3",
};

// Simple beep sounds as data URIs for fallback
const beepSounds = {
  typing: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY4O2+aiM",
  error: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY4O2+aiM",
};

export function useSound(customSounds: Partial<SoundMap> = {}) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const audioRefs = useRef<{[k: string]: HTMLAudioElement}>({});

  const initializeAudio = useCallback(() => {
    if (!audioInitialized) {
      setAudioInitialized(true);
    }
  }, [audioInitialized]);

  const play = useCallback((key: keyof SoundMap) => {
    if (muted) return;

    initializeAudio();

    const src = customSounds[key] || defaultSounds[key];
    if (!src) return;

    try {
      if (!audioRefs.current[key]) {
        audioRefs.current[key] = new Audio();
        audioRefs.current[key].volume = volume;
        audioRefs.current[key].preload = 'auto';
        
        // Try loading the file, fallback to beep sound
        audioRefs.current[key].onerror = () => {
          if (key === 'typing' || key === 'error') {
            audioRefs.current[key].src = beepSounds[key] || beepSounds.typing;
          }
        };
        
        audioRefs.current[key].src = src;
      }
      
      const sound = audioRefs.current[key];
      sound.currentTime = 0;
      sound.volume = volume;
      
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently handle play failures
        });
      }
    } catch (error) {
      // Silently handle errors
    }
  }, [muted, volume, customSounds, initializeAudio]);

  // Update volume for existing audio objects when volume changes
  const setVolumeAndUpdate = useCallback((newVolume: number) => {
    setVolume(newVolume);
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = newVolume;
    });
  }, []);

  return {
    play,
    setMuted,
    muted,
    setVolume: setVolumeAndUpdate,
    volume,
    audioInitialized
  };
}
