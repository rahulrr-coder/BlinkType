import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-background/80 backdrop-blur-md border-t border-border/40 py-4 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://github.com/rahulrr-coder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium underline-offset-4 hover:underline"
          >
            <Github className="w-4 h-4" />
            rahulrr-coder
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
