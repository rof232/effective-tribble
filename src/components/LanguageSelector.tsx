import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useStore } from '../lib/store';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  // يمكن إضافة المزيد من اللغات هنا
];

interface Props {
  fromLang: string;
  toLang: string;
  onFromLangChange: (lang: string) => void;
  onToLangChange: (lang: string) => void;
  onSwapLanguages: () => void;
}

const LanguageSelector: React.FC<Props> = ({
  fromLang,
  toLang,
  onFromLangChange,
  onToLangChange,
  onSwapLanguages
}) => {
  const getLanguageDirection = (langCode: string): 'ltr' | 'rtl' => {
    return languages.find(lang => lang.code === langCode)?.direction || 'ltr';
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1">
        <select
          value={fromLang}
          onChange={(e) => onFromLangChange(e.target.value)}
          className="w-full p-3 rounded-xl glass-morphism text-white 
            focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
            appearance-none bg-transparent cursor-pointer select-language"
          style={{ direction: getLanguageDirection(fromLang) }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#1a1a2e] text-white">
              {lang.nativeName}
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
            appearance-none bg-transparent cursor-pointer select-language"
          style={{ direction: getLanguageDirection(toLang) }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#1a1a2e] text-white">
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
