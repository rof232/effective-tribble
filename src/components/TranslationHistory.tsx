import React from 'react';
import { Clock } from 'lucide-react';
import type { TranslationHistoryItem } from '../lib/types';

interface Props {
  history: TranslationHistoryItem[];
  onSelect: (item: TranslationHistoryItem) => void;
}

const TranslationHistory: React.FC<Props> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="glass-morphism rounded-2xl p-6 text-center text-white/70">
        <p>لا يوجد سجل ترجمة حتى الآن</p>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white text-stroke-sm">
        سجل الترجمة
      </h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-right p-4 rounded-xl glass-morphism hover:bg-white/10 
              transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                {new Date(item.timestamp).toLocaleTimeString('ar-SA')}
              </div>
              <div className="text-white/80 text-sm">
                {item.from} → {item.to}
              </div>
            </div>
            <p className="text-white/90 text-sm truncate mb-1" dir="auto">
              {item.originalText}
            </p>
            <p className="text-white/70 text-sm truncate" dir="auto">
              {item.translatedText}
            </p>
            {item.characters && item.characters.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.characters.map((char) => (
                  <span
                    key={char.name}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60"
                  >
                    {char.name} ({char.gender === 'male' ? 'ذكر' : 'أنثى'})
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TranslationHistory;