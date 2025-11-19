import React from 'react';
import { Video, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-6 bg-gradient-to-r from-red-900 to-black border-b border-red-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg transform -rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl brand-font text-white uppercase tracking-wider">
              Super<span className="text-red-500">Reactor</span> AI
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">Made by James Tr.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-yellow-500">
          <Zap className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm tracking-wider">LIVE ANALYSIS READY</span>
        </div>
      </div>
    </header>
  );
};

export default Header;