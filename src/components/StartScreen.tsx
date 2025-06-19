
import React, { useState } from 'react';
import { Timer, Zap, Target, Sparkles } from 'lucide-react';
import Scoreboard from './Scoreboard';
import { Difficulty } from './TypingGame';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const difficultyOptions = [
    { 
      key: 'short' as Difficulty, 
      label: 'Quick Sprint', 
      description: 'A swift 2-3 sentence challenge', 
      icon: Zap,
      gradient: 'from-teal-400 to-teal-500'
    },
    { 
      key: 'medium' as Difficulty, 
      label: 'Steady Flow', 
      description: 'Balanced 4-6 sentence test', 
      icon: Target,
      gradient: 'from-coral-400 to-coral-500'
    },
    { 
      key: 'long' as Difficulty, 
      label: 'Marathon', 
      description: 'Extended 7+ sentence endurance', 
      icon: Timer,
      gradient: 'from-sage-400 to-sage-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 text-center transition-all duration-500">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Brand Header with Enhanced Typography */}
          <div className="mb-16">
            <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight flex items-center justify-center group">
              <span className="text-coral-500 drop-shadow-sm">Blink</span>
              <span className="text-navy-700 dark:text-cream-100 ml-2">Type</span>
              <div className="ml-4 flex items-center">
                <span className="w-1 h-16 bg-gradient-to-b from-coral-500 to-coral-600 animate-pulse rounded-full shadow-lg"></span>
                <Sparkles className="w-8 h-8 text-coral-500 ml-2 animate-pulse opacity-60" />
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-sage-600 dark:text-sage-300 max-w-2xl mx-auto leading-relaxed font-light">
              Elevate your typing prowess with precision-crafted challenges. 
              <span className="block mt-2 text-lg text-sage-500 dark:text-sage-400">
                Track progress • Master rhythm • Achieve flow state
              </span>
            </p>
          </div>

          {/* Difficulty Selection Card */}
          <div className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-navy-900/50 p-10 mb-12 max-w-4xl mx-auto border border-sage-200/50 dark:border-navy-700/50">
            <h2 className="text-3xl font-semibold text-navy-800 dark:text-cream-100 mb-8">
              Choose Your Challenge
            </h2>
            
            {/* Difficulty Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {difficultyOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedDifficulty === option.key;
                
                return (
                  <button
                    key={option.key}
                    onClick={() => setSelectedDifficulty(option.key)}
                    className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                      isSelected
                        ? 'border-coral-400 bg-gradient-to-br from-coral-50 to-white dark:from-coral-900/20 dark:to-navy-700/50 shadow-xl shadow-coral-500/20 dark:shadow-coral-500/10'
                        : 'border-sage-200 dark:border-navy-600 bg-gradient-to-br from-white to-sage-50/50 dark:from-navy-700/50 dark:to-navy-800/50 hover:border-sage-300 dark:hover:border-navy-500 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Gradient Accent Bar */}
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r ${option.gradient} rounded-b-full transition-all duration-300 ${
                      isSelected ? 'opacity-100 w-24' : 'opacity-50 group-hover:opacity-80 group-hover:w-20'
                    }`} />
                    
                    {/* Icon */}
                    <Icon className={`w-12 h-12 mx-auto mb-4 transition-all duration-300 ${
                      isSelected 
                        ? 'text-coral-500 drop-shadow-sm' 
                        : 'text-sage-500 dark:text-sage-400 group-hover:text-coral-400'
                    }`} />
                    
                    {/* Content */}
                    <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      isSelected 
                        ? 'text-navy-800 dark:text-cream-100' 
                        : 'text-navy-700 dark:text-cream-200 group-hover:text-navy-800 dark:group-hover:text-cream-100'
                    }`}>
                      {option.label}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isSelected 
                        ? 'text-sage-700 dark:text-sage-300' 
                        : 'text-sage-600 dark:text-sage-400 group-hover:text-sage-700 dark:group-hover:text-sage-300'
                    }`}>
                      {option.description}
                    </p>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Start Button */}
            <button
              onClick={() => onStart(selectedDifficulty)}
              className="group relative bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl shadow-coral-500/30 hover:shadow-2xl hover:shadow-coral-600/40 overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:animate-spin transition-transform duration-300" />
                Begin Typing Journey
                <span className="text-lg opacity-80">→</span>
              </span>
            </button>

            {/* Feature Highlights */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-sage-600 dark:text-sage-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-coral-400 rounded-full animate-pulse" />
                <span>Real-time precision tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span>Adaptive difficulty scaling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" />
                <span>Performance analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoreboard Section */}
      <div className="pb-20 px-6">
        <div className="max-w-lg mx-auto">
          <Scoreboard />
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
