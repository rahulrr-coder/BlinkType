
import React from 'react';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, Volume1, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  showBack: boolean;
  showPause: boolean;
  isPaused: boolean;
  onBack: () => void;
  onPauseToggle: () => void;
  muted?: boolean;
  volume?: number;
  onMuteToggle?: () => void;
  onVolumeChange?: (v:number) => void;
}

const Header: React.FC<HeaderProps> = ({
  showBack,
  showPause,
  isPaused,
  onBack,
  onPauseToggle,
  muted,
  volume = 0.6,
  onMuteToggle,
  onVolumeChange
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/70 dark:bg-navy-800/70 backdrop-blur-xl border-b border-sage-200/50 dark:border-navy-700/50 h-16 flex items-center px-6 transition-all duration-300">
      <div className="flex-1 flex items-center">
        <div className="flex items-center group">
          <span className="font-bold text-xl tracking-tight select-none flex items-center">
            <span className="text-coral-500 drop-shadow-sm">Blink</span>
            <span className="text-navy-800 dark:text-cream-100 ml-1">Type</span>
            <div className="ml-2 flex items-center">
              <span className="w-0.5 h-5 bg-gradient-to-b from-coral-500 to-coral-600 animate-pulse rounded-full"></span>
              <Sparkles className="w-4 h-4 text-coral-500 ml-1 animate-pulse opacity-60" />
            </div>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {typeof muted !== "undefined" && onMuteToggle && (
          <button
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className={`rounded-xl p-2.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-coral-400 hover:scale-105 ${
              muted 
                ? "bg-sage-100 dark:bg-navy-700 text-sage-500 dark:text-sage-400" 
                : "bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 text-teal-600 dark:text-teal-400 hover:from-teal-100 hover:to-teal-200 dark:hover:from-teal-900/30 dark:hover:to-teal-800/30"
            } group border border-sage-200 dark:border-navy-600`}
            onClick={onMuteToggle}
          >
            {muted ? <VolumeX className="w-5 h-5" /> :
              (volume > 0.6 ? <Volume2 className="w-5 h-5" /> : <Volume1 className="w-5 h-5" />)}
          </button>
        )}
        {typeof volume !== "undefined" && onVolumeChange && (
          <input
            type="range"
            className="w-24 mx-1 accent-coral-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-coral-400 bg-gradient-to-r from-sage-100 to-sage-200 dark:from-navy-700 dark:to-navy-600 rounded-full h-2"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            aria-label="Volume slider"
          />
        )}
        <ThemeToggle />
        {showBack && (
          <button
            onClick={onBack}
            className="ml-2 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sage-700 dark:text-sage-200 bg-gradient-to-r from-sage-50 to-sage-100 dark:from-navy-700 dark:to-navy-600 hover:from-sage-100 hover:to-sage-200 dark:hover:from-navy-600 dark:hover:to-navy-500 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-sage-200 dark:border-navy-600 focus-visible:ring-2 focus-visible:ring-coral-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Back to Home</span>
          </button>
        )}
        {showPause && (
          <button
            onClick={onPauseToggle}
            className="ml-2 px-4 py-2.5 rounded-xl flex items-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-coral-400"
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5" />
                <span className="hidden sm:inline">Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-5 h-5" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
