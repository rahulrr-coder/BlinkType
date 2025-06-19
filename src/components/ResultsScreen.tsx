
import React from 'react';
import { Trophy, RotateCcw, Play, Target, Clock, Zap, Award } from 'lucide-react';
import { GameStats } from './TypingGame';

interface ResultsScreenProps {
  stats: GameStats;
  onRestart: () => void;
  onNewGame: () => void;
}

const ResultsScreen = ({ stats, onRestart, onNewGame }: ResultsScreenProps) => {
  const getPerformanceLevel = (wpm: number) => {
    if (wpm >= 70) return { 
      level: 'Typing Virtuoso', 
      color: 'from-purple-500 to-purple-600', 
      textColor: 'text-purple-700 dark:text-purple-300',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      icon: Award
    };
    if (wpm >= 50) return { 
      level: 'Speed Specialist', 
      color: 'from-coral-500 to-coral-600', 
      textColor: 'text-coral-700 dark:text-coral-300',
      bgColor: 'from-coral-50 to-coral-100 dark:from-coral-900/20 dark:to-coral-800/20',
      icon: Target
    };
    if (wpm >= 30) return { 
      level: 'Rising Talent', 
      color: 'from-teal-500 to-teal-600', 
      textColor: 'text-teal-700 dark:text-teal-300',
      bgColor: 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20',
      icon: Zap
    };
    return { 
      level: 'Learning Journey', 
      color: 'from-sage-400 to-sage-500', 
      textColor: 'text-sage-700 dark:text-sage-300',
      bgColor: 'from-sage-50 to-sage-100 dark:from-sage-900/20 dark:to-sage-800/20',
      icon: Clock
    };
  };

  const performance = getPerformanceLevel(stats.wpm);
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 flex items-center justify-center p-6 animate-scale-in">
      <div className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border border-sage-200/50 dark:border-navy-700/50 rounded-3xl shadow-2xl dark:shadow-navy-900/50 p-10 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-12 h-12 text-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-coral-500 to-coral-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-navy-800 dark:text-cream-100 mb-4">
            Challenge Complete!
          </h1>
          
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${performance.bgColor} border border-white/50 shadow-lg`}>
            <PerformanceIcon className={`w-6 h-6 ${performance.textColor}`} />
            <span className={`font-bold text-lg ${performance.textColor}`}>
              {performance.level}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="group text-center p-6 bg-gradient-to-br from-coral-50 to-coral-100 dark:from-coral-900/20 dark:to-coral-800/20 border border-coral-200/50 dark:border-coral-800/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-coral-600 dark:text-coral-400 mb-2">{stats.wpm}</div>
            <div className="text-sage-600 dark:text-sage-300 font-medium">Words Per Minute</div>
          </div>
          
          <div className="group text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border border-teal-200/50 dark:border-teal-800/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">{stats.accuracy}%</div>
            <div className="text-sage-600 dark:text-sage-300 font-medium">Accuracy</div>
          </div>
          
          <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-800/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stats.correctChars}</div>
            <div className="text-sage-600 dark:text-sage-300 font-medium">Correct Characters</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={onNewGame}
            className="group bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl shadow-coral-500/30 hover:shadow-2xl hover:shadow-coral-600/40 flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Play className="w-6 h-6 relative z-10" />
            <span className="relative z-10">New Challenge</span>
          </button>
          
          <button
            onClick={onRestart}
            className="group bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl shadow-sage-500/30 hover:shadow-2xl hover:shadow-sage-600/40 flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <RotateCcw className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Back to Home</span>
          </button>
        </div>

        {/* Performance Tips */}
        <div className="bg-gradient-to-r from-sage-50 to-cream-50 dark:from-sage-900/20 dark:to-navy-700/50 border border-sage-200/50 dark:border-navy-600/50 rounded-2xl p-6 shadow-inner">
          <h3 className="font-bold text-navy-800 dark:text-cream-100 mb-4 text-xl flex items-center gap-2">
            <Target className="w-5 h-5 text-coral-500" />
            Performance Insights
          </h3>
          <div className="text-sage-700 dark:text-sage-300 space-y-3">
            {stats.accuracy < 90 && (
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-navy-800/30 rounded-xl">
                <div className="w-2 h-2 bg-coral-400 rounded-full mt-2 flex-shrink-0" />
                <p className="leading-relaxed">Focus on precision over speed—accuracy builds the foundation for sustained improvement.</p>
              </div>
            )}
            {stats.wpm < 40 && (
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-navy-800/30 rounded-xl">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
                <p className="leading-relaxed">Regular practice develops muscle memory—try 10-15 minutes daily for optimal progress.</p>
              </div>
            )}
            {stats.wpm >= 60 && (
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-navy-800/30 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="leading-relaxed">Excellent velocity! Now focus on maintaining this pace while improving accuracy consistency.</p>
              </div>
            )}
            {stats.accuracy >= 95 && stats.wpm >= 50 && (
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800/50">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                <p className="leading-relaxed font-medium text-yellow-800 dark:text-yellow-200">Outstanding performance! You've achieved an elite balance of speed and precision.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
