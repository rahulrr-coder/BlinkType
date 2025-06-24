import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Play } from 'lucide-react';
import StartScreen from './StartScreen';
import ResultsScreen from './ResultsScreen';
import Header from './Header';
import { sampleParagraphs } from '../utils/sampleText';
import { Progress } from './ui/progress';
import { useSound } from '../hooks/useSound';

export interface GameStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  totalChars: number;
  correctChars: number;
  timestamp: number;
}

export type GameState = 'start' | 'playing' | 'finished';
export type Difficulty = 'short' | 'medium' | 'long';

// For floating particles
const FloatingParticle = ({ children, x, y }: {children: React.ReactNode, x: number, y: number}) => (
  <span
    className="absolute pointer-events-none animate-float-up"
    style={{
      left: x,
      top: y,
      fontSize: 20 + Math.random() * 18,
      opacity: 0.8,
      zIndex: 100,
      color: "#38bdf8", // sky-400
      filter: "drop-shadow(0 2px 8px #64748b33)"
    }}
  >
    {children}
  </span>
);

const TypingGame = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  // Pause state
  const [isPaused, setIsPaused] = useState(false);
  const [pauseOverlay, setPauseOverlay] = useState(false);
  const [pauseStart, setPauseStart] = useState<number | null>(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0);

  // Audio system
  const { play, muted, setMuted, volume, setVolume } = useSound();

  // UI micro-interactions state
  const [shakeInput, setShakeInput] = useState(false);

  // Floating particles effects
  const [particles, setParticles] = useState<{x:number, y:number, content:React.ReactNode, id:number}[]>([]);
  const particleId = useRef(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Use ref for finishGame to avoid timer dependency issues
  const finishGameRef = useRef<() => void>();

  // Timing WPM/accuracy for milestones
  const calculateWPM = () => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = userInput.trim().split(' ').length;
    return Math.round(wordsTyped / timeElapsed) || 0;
  };

  const calculateAccuracy = () => {
    if (userInput.length === 0) return 100;
    const correctChars = userInput.split('').filter((char, index) => 
      char === currentText[index]
    ).length;
    return Math.round((correctChars / userInput.length) * 100);
  };

  // ENHANCED: character-by-character animated rendering, with bounce and shake
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      // Enhanced animations per character
      let className = 'text-gray-400 dark:text-gray-500 transition-colors duration-150';
      let animate = '';

      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-green-600 bg-green-100 dark:bg-green-900/30';
          animate = 'animate-bounce-char'; // bounce animation on correct char
        } else {
          className = 'text-red-600 bg-red-100 dark:bg-red-900/30';
          animate = 'animate-shake-char'; // shake animation on error
        }
      } else if (index === userInput.length) {
        className = 'text-gray-800 dark:text-gray-200 bg-blue-200 dark:bg-blue-800/50 animate-pulse';
      }

      return (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={`${className} ${animate}`}
        >
          {char}
        </span>
      );
    });
  };

  // Start game handler
  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const paragraphs = sampleParagraphs[selectedDifficulty];
    const randomText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    setCurrentText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setStartTime(null);
    setGameStats(null);
    setIsPaused(false);
    setPauseStart(null);
    setTotalPausedDuration(0);
    setShakeInput(false);
    setParticles([]);
    play('start');
    setGameState('playing');
  };

  // Reset handler
  const resetGame = () => {
    setGameState('start');
    setUserInput('');
    setCurrentText('');
    setTimeLeft(60);
    setStartTime(null);
    setGameStats(null);
    setIsPaused(false);
    setPauseStart(null);
    setTotalPausedDuration(0);
    setShakeInput(false);
    setParticles([]);
  };

  // --- Audio/visual feedback typing ---
  const handleTyping = (input: string) => {
    if (!startTime && !isPaused) {
      setStartTime(Date.now());
    }

    // Play keystroke sound on every character typed
    if (input.length > userInput.length) {
      play('typing');
      
      // Check if the last character is correct or incorrect for visual feedback
      const lastIndex = input.length - 1;
      if (input[lastIndex] && currentText[lastIndex]) {
        if (currentText[lastIndex] !== input[lastIndex]) {
          play('error');
          setShakeInput(true);
          setTimeout(() => setShakeInput(false), 350);
        }
      }
    }

    setUserInput(input);

    // Milestones: WPM or accuracy
    const currWpm = calculateWPM();
    const currAcc = calculateAccuracy();
    if (currWpm >= 50) {
      floatParticle("🔥");
    }
    if (currAcc === 100 && input.length > 15) {
      floatParticle("💯");
    }
  };

  const floatParticle = (symbol: string) => {
    // Place randomly over input area
    const x = Math.random() * 320 + 80;
    const y = Math.random() * 65 + 350;
    setParticles(p => [
      ...p,
      {x, y, content: symbol, id: particleId.current++}
    ]);
    setTimeout(() => {
      setParticles(p => p.filter(pt => pt.id !== particleId.current-1));
    }, 1200);
  };

  // Finish game logic
  const finishGame = useCallback(() => {
    if (!startTime) return;

    const now = Date.now();
    const effectiveElapsed = ((now - startTime - totalPausedDuration) / 1000);

    const correctChars = userInput.split('').filter((char, index) =>
      char === currentText[index]
    ).length;

    const totalWords = userInput.trim().split(' ').length;
    const wpm = Math.round((totalWords / effectiveElapsed) * 60);
    const accuracy = Math.round((correctChars / userInput.length) * 100) || 0;

    const stats: GameStats = {
      wpm: wpm || 0,
      accuracy,
      timeElapsed: Math.round(effectiveElapsed),
      totalChars: userInput.length,
      correctChars,
      timestamp: Date.now()
    };

    const savedScores = JSON.parse(localStorage.getItem('typingScores') || '[]');
    savedScores.push(stats);
    savedScores.sort((a: GameStats, b: GameStats) => b.wpm - a.wpm);
    savedScores.splice(3);
    localStorage.setItem('typingScores', JSON.stringify(savedScores));

    setGameStats(stats);
    setGameState('finished');
    setIsPaused(false);
    setPauseStart(null);
    setTotalPausedDuration(0);

    // Play finish sound and trigger celebration
    play('finish');
    floatParticle("🎉");
    setTimeout(() => floatParticle("✨"), 300);
  }, [startTime, userInput, currentText, totalPausedDuration, play]);

  // Update finishGameRef whenever finishGame changes
  useEffect(() => {
    finishGameRef.current = finishGame;
  }, [finishGame]);

  // FIXED: Timer logic without finishGame dependency
  useEffect(() => {
    if (gameState !== 'playing' || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          finishGameRef.current?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPaused]); // Removed finishGame dependency

  // Pause/resume logic
  const handlePause = () => {
    if (!isPaused) {
      setIsPaused(true);
      setPauseStart(Date.now());
      setTimeout(() => setPauseOverlay(true), 75);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setPauseOverlay(false);
    if (pauseStart) {
      setTotalPausedDuration((prev) => prev + (Date.now() - pauseStart));
    }
    setPauseStart(null);
  };

  // ESC key: pause/unpause during gameplay only
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.key === 'Escape') {
          if (isPaused) {
            handleResume();
          } else {
            handlePause();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, isPaused, pauseStart]);

  useEffect(() => {
    if (!isPaused) setPauseOverlay(false);
  }, [isPaused]);

  // Auto-finish if text completed
  useEffect(() => {
    if (
      gameState === 'playing' &&
      !isPaused &&
      userInput.length >= currentText.length &&
      currentText.length > 0
    ) {
      finishGame();
    }
  }, [userInput, currentText, gameState, isPaused, finishGame]);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const handleBack = () => {
    if (gameState === 'playing' && !isPaused) {
      if (
        window.confirm(
          'Are you sure you want to leave? Your current progress will be lost.'
        )
      ) {
        resetGame();
      }
    } else {
      resetGame();
    }
  };

  const showBack =
    (gameState === 'playing' && !isPaused) ||
    gameState === 'finished' ||
    (gameState === 'playing' && isPaused);
  const showPause = gameState === 'playing' && !isPaused && timeLeft > 0;

  // Enhanced overlay class for shake on errors
  const overlayClasses = [
    'fixed inset-0 z-40 bg-black/40 flex items-center justify-center transition-all duration-200',
    pauseOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
  ].join(' ');

  // -- Smooth progress calculation --
  const progressPercent = currentText.length 
    ? Math.min(100, Math.floor((userInput.length / currentText.length) * 100)) 
    : 0;

  return (
    <div className="relative">
      <Header
        showBack={showBack}
        showPause={showPause}
        isPaused={isPaused}
        onBack={handleBack}
        onPauseToggle={isPaused ? handleResume : handlePause}
        muted={muted}
        volume={volume}
        onMuteToggle={() => setMuted(m => !m)}
        onVolumeChange={setVolume}
      />
      <div className="pt-20 container mx-auto px-4 py-8 max-w-4xl">
        {gameState === 'start' && <StartScreen onStart={startGame} />}
        
        {gameState === 'playing' && (
          <>
            <div className="animate-fade-in">
              {/* Stats Bar */}
              <div className="bg-white dark:bg-card rounded-xl shadow-lg p-6 mb-6 transition hover:shadow-xl">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{calculateWPM()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{calculateAccuracy()}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-800 dark:text-white'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>
                {/* Smooth Progress (show below stats on mobile, top on desktop) */}
                <Progress className="mt-4 w-full h-3 rounded-full" value={progressPercent} />
              </div>

              {/* Text Display */}
              <div className="bg-white dark:bg-card rounded-xl shadow-lg p-8 mb-6 transition-all hover:shadow-xl relative">
                <div className="text-lg leading-relaxed font-mono text-justify select-none overflow-x-auto">
                  {renderText()}
                </div>
                {/* Floating particles layer */}
                {particles.map(pt => (
                  <FloatingParticle key={pt.id} x={pt.x} y={pt.y}>
                    {pt.content}
                  </FloatingParticle>
                ))}
              </div>

              {/* Input */}
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => isPaused ? {} : handleTyping(e.target.value)}
                className={`w-full p-4 border-2 border-gray-300 dark:border-gray-600 dark:bg-background dark:text-white rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg font-mono resize-none transition-all duration-100 ${shakeInput ? "animate-shake-input border-red-400" : ""}`}
                placeholder={startTime ? "Keep typing..." : "Start typing to begin the timer..."}
                rows={4}
                disabled={timeLeft === 0}
                style={{ touchAction: 'manipulation' }}
                tabIndex={0}
              />

              <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                <p>Type the text above as accurately and quickly as possible!</p>
              </div>
            </div>

            {/* Pause Overlay */}
            <div className={overlayClasses} style={{transitionProperty:'opacity'}}>
              {isPaused && (
                <div className="rounded-2xl bg-white/95 dark:bg-background/95 shadow-2xl px-8 py-10 text-center animate-scale-in">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Paused</h2>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">Game is paused. Click <span className="font-semibold text-blue-600">Resume</span> or press <kbd className="rounded bg-gray-200 px-2 py-1">ESC</kbd> to continue.</p>
                  <button
                    onClick={handleResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition text-lg flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-5 h-5" /> Resume
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {gameState === 'finished' && gameStats && (
          <ResultsScreen
            stats={gameStats}
            onRestart={resetGame}
            onNewGame={() => startGame(difficulty)}
          />
        )}
      </div>
      {/* Celebrate confetti on finish */}
      {gameState === "finished" &&
        <div className="fixed inset-0 pointer-events-none z-50">
          <CelebrationConfetti />
        </div>
      }
    </div>
  );
};

function CelebrationConfetti() {
  // Basic milestone celebration: burst of text particles/emoji as confetti
  return (
    <div className="h-full w-full flex items-center justify-center animate-fade-in" aria-hidden>
      {[...Array(16)].map((_, i) => {
        // Random position for each "confetti"
        const left = Math.random() * 90 + 2;
        const top = Math.random() * 90 + 2;
        const emojis = ["🎊","🎉","✨","💫","🪐","🌟","🔥","⚡"];
        const emoji = emojis[i%emojis.length];
        return (
          <span key={i}
            style={{ position: "absolute", left: `${left}%`, top: `${top}%`, fontSize: 36+Math.random()*15, zIndex: 55, opacity: 0.6+Math.random()*0.3, pointerEvents: "none", userSelect: "none",
              animation: `confetti-burst 1.5s cubic-bezier(.4,1.5,.7,1) ${i*0.05}s both`
            }}>{emoji}</span>
        )
      })}
    </div>
  );
}

export default TypingGame;
