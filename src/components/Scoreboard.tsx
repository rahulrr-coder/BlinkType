
import React from 'react';
import { Trophy, Medal, Award, Clock, Target, Zap } from 'lucide-react';
import { GameStats } from './TypingGame';

const Scoreboard = () => {
  const getScores = (): GameStats[] => {
    const saved = localStorage.getItem('typingScores');
    return saved ? JSON.parse(saved) : [];
  };

  const scores = getScores();

  if (scores.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border border-sage-200/50 dark:border-navy-700/50 rounded-2xl shadow-xl dark:shadow-navy-900/50 p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-coral-100 to-coral-200 dark:from-coral-900/30 dark:to-coral-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-coral-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy-800 dark:text-cream-100 mb-3">
            Performance Leaderboard
          </h2>
          <p className="text-sage-600 dark:text-sage-300 leading-relaxed">
            Your typing achievements will appear here once you complete your first challenge.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="px-4 py-2 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-full">
              <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                Ready to begin? ↑
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (index: number) => {
    const iconProps = "w-6 h-6";
    switch (index) {
      case 0: return <Trophy className={`${iconProps} text-yellow-500 drop-shadow-sm`} />;
      case 1: return <Medal className={`${iconProps} text-slate-400 drop-shadow-sm`} />;
      case 2: return <Award className={`${iconProps} text-amber-600 drop-shadow-sm`} />;
      default: return <Target className={`${iconProps} text-sage-500`} />;
    }
  };

  const getPerformanceBadge = (wpm: number) => {
    if (wpm >= 70) return { label: 'Expert', color: 'from-purple-500 to-purple-600', text: 'text-white' };
    if (wpm >= 50) return { label: 'Advanced', color: 'from-coral-500 to-coral-600', text: 'text-white' };
    if (wpm >= 30) return { label: 'Skilled', color: 'from-teal-500 to-teal-600', text: 'text-white' };
    return { label: 'Learning', color: 'from-sage-400 to-sage-500', text: 'text-white' };
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border border-sage-200/50 dark:border-navy-700/50 rounded-2xl shadow-xl dark:shadow-navy-900/50 p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-coral-100 to-coral-200 dark:from-coral-900/30 dark:to-coral-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-coral-500" />
        </div>
        <h2 className="text-2xl font-bold text-navy-800 dark:text-cream-100">
          Performance Leaderboard
        </h2>
        <p className="text-sm text-sage-600 dark:text-sage-300 mt-2">
          Your best typing achievements
        </p>
      </div>
      
      <div className="space-y-4">
        {scores.map((score, index) => {
          const performance = getPerformanceBadge(score.wpm);
          const isTopScore = index === 0;
          
          return (
            <div
              key={score.timestamp}
              className={`group relative p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 ${
                isTopScore 
                  ? 'bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-yellow-900/10 dark:via-navy-700/50 dark:to-yellow-900/10 border-yellow-200 dark:border-yellow-800/30 shadow-lg shadow-yellow-500/10' 
                  : 'bg-gradient-to-br from-white to-sage-50/30 dark:from-navy-700/30 dark:to-navy-800/30 border-sage-200/50 dark:border-navy-600/50 hover:border-coral-200 dark:hover:border-coral-800/50'
              }`}
            >
              {/* Rank indicator */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-coral-500 to-coral-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">#{index + 1}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getIcon(index)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-navy-800 dark:text-cream-100">
                        {score.wpm}
                      </span>
                      <span className="text-sm font-medium text-sage-600 dark:text-sage-300">
                        WPM
                      </span>
                      <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${performance.color} text-xs font-bold ${performance.text}`}>
                        {performance.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-sage-600 dark:text-sage-300">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{score.accuracy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span>{score.correctChars} chars</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-sage-500 dark:text-sage-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(score.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Subtle animation line for top score */}
              {isTopScore && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-16 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom accent */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-coral-50 dark:from-teal-900/20 dark:to-coral-900/20 rounded-full">
          <div className="w-2 h-2 bg-coral-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-sage-600 dark:text-sage-400">
            Keep pushing your limits
          </span>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
