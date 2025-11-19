import React from 'react';
import { ReactionItem } from '../types';
import { MessageSquare, Clock, Smile } from 'lucide-react';

interface ScriptCardProps {
  item: ReactionItem;
  index: number;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ item, index }) => {
  return (
    <div 
        className="relative flex bg-gray-900 border-l-4 border-red-600 rounded-r-lg p-6 mb-4 shadow-lg hover:shadow-red-900/20 transition-all duration-300 group"
        style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-shrink-0 mr-6 flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 text-red-500 font-bold border-2 border-red-800/50 mb-2">
          {index + 1}
        </div>
        <div className="flex items-center text-xs font-mono text-gray-500 bg-black/40 px-2 py-1 rounded">
            <Clock className="w-3 h-3 mr-1" />
            {item.timestamp}
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <Smile className="w-4 h-4" />
                {item.emotion}
            </h4>
        </div>
        
        <div className="relative mb-3">
            <MessageSquare className="absolute -left-4 -top-1 w-8 h-8 text-gray-800 opacity-50 transform -scale-x-100" />
            <p className="text-2xl font-bold text-white italic leading-tight pl-4 border-l-2 border-gray-700">
                "{item.line}"
            </p>
        </div>

        <p className="text-gray-400 text-sm border-t border-gray-800 pt-2 mt-2">
            <span className="text-gray-600 font-semibold uppercase text-xs mr-2">Context:</span>
            {item.description}
        </p>
      </div>
    </div>
  );
};

export default ScriptCard;