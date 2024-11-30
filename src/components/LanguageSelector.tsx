import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  fromLang: string;
  toLang: string;
  onFromLangChange: (lang: string) => void;
  onToLangChange: (lang: string) => void;
  onSwapLanguages: () => void;
}

const LANGUAGES = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  zh: '中文'
};

const LanguageSelector: React.FC<Props> = ({
  fromLang,
  toLang,
  onFromLangChange,
  onToLangChange,
  onSwapLanguages
}) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1">
        <select
          value={fromLang}
          onChange={(e) => onFromLangChange(e.target.value)}
          className="w-full p-3 rounded-xl glass-morphism text-white 
            focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
            appearance-none bg-transparent cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem',
            paddingRight: '2.5rem'
          }}
        >
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code} className="bg-[#1a1a2e] text-white">
              {name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onSwapLanguages}
        className="p-3 glass-morphism rounded-xl hover:scale-105 
          transition-all duration-300 ease-out shadow-md hover:shadow-lg
          hover:bg-white/10 group"
        title="تبديل اللغات"
      >
        <ArrowLeftRight className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
      </button>

      <div className="flex-1">
        <select
          value={toLang}
          onChange={(e) => onToLangChange(e.target.value)}
          className="w-full p-3 rounded-xl glass-morphism text-white 
            focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
            appearance-none bg-transparent cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem',
            paddingRight: '2.5rem'
          }}
        >
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code} className="bg-[#1a1a2e] text-white">
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;