import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowRightLeft, Loader2, Settings } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import TranslationHistory from './components/TranslationHistory';
import ApiKeyModal from './components/ApiKeyModal';
import CharacterPronouns from './components/CharacterPronouns';
import GlossaryManager from './components/GlossaryManager';
import TextFormatting from './components/TextFormatting';
import ChapterManager from './components/ChapterManager';
import { GeminiService } from './lib/gemini-service';
import type { 
  AITranslator, 
  TranslationHistoryItem, 
  AISettings, 
  Character,
  Gender
} from './lib/types';

// Local storage utilities
const SETTINGS_KEY = 'ai_translator_settings';
const CHARACTERS_KEY = 'ai_translator_characters';

const getStoredSettings = (): AISettings | null => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storeSettings = (settings: AISettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const getStoredCharacters = (): Record<string, Gender> => {
  try {
    const stored = localStorage.getItem(CHARACTERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storeCharacter = (name: string, gender: Gender): void => {
  const characters = getStoredCharacters();
  characters[name] = gender;
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
};

const removeCharacter = (name: string): void => {
  const characters = getStoredCharacters();
  delete characters[name];
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
};

function App() {
  // حالة النص والترجمة
  const [sourceLang, setSourceLang] = useState('ar');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // سجل الترجمات
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  // إعدادات الذكاء الاصطناعي
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [aiSettings, setAISettings] = useState<AISettings>(() => getStoredSettings() || {});

  // إدارة الشخصيات
  const [characters, setCharacters] = useState<Character[]>([]);

  // إدارة التبويب النشط
  const [activeTab, setActiveTab] = useState<'translate' | 'chapters'>('translate');

  // مرجع للخدمة الحالية
  const [translator, setTranslator] = useState<AITranslator | null>(null);

  /**
   * تحميل الإعدادات والشخصيات عند بدء التطبيق
   */
  useEffect(() => {
    const storedCharacters = getStoredCharacters();
    setCharacters(
      Object.entries(storedCharacters).map(([name, gender]) => ({
        name,
        gender,
        timestamp: new Date()
      }))
    );

    // محاولة إنشاء المترجم مع المفتاح المخزن
    if (aiSettings?.apiKey) {
      try {
        const service = new GeminiService(aiSettings.apiKey);
        setTranslator(service);
      } catch (error) {
        console.error('فشل في تهيئة خدمة الترجمة:', error);
        setError('فشل في تهيئة خدمة الترجمة');
        setIsApiKeyModalOpen(true);
      }
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  /**
   * تحديث الخدمة عند تغيير الإعدادات
   */
  useEffect(() => {
    if (aiSettings?.apiKey) {
      try {
        const service = new GeminiService(aiSettings.apiKey);
        setTranslator(service);
        setError(null);
      } catch (error) {
        console.error('فشل في تهيئة خدمة الترجمة:', error);
        setError('فشل في تهيئة خدمة الترجمة');
        setTranslator(null);
      }
    } else {
      setTranslator(null);
    }
  }, [aiSettings]);

  /**
   * تبديل اللغات المصدر والهدف
   */
  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  }, [sourceLang, targetLang, sourceText, targetText]);

  /**
   * معالجة تحديث إعدادات الذكاء الاصطناعي
   */
  const handleAISettingsSubmit = useCallback((settings: AISettings) => {
    setAISettings(settings);
    storeSettings(settings);
    setIsApiKeyModalOpen(false);
  }, []);

  /**
   * إضافة شخصية جديدة
   */
  const handleAddCharacter = useCallback((name: string) => {
    if (!characters.some(char => char.name.toLowerCase() === name.toLowerCase())) {
      setCharacters(prev => [...prev, { 
        name,
        timestamp: new Date()
      }]);
    }
  }, [characters]);

  /**
   * حذف شخصية
   */
  const handleRemoveCharacter = useCallback((name: string) => {
    setCharacters(prev => prev.filter(char => char.name !== name));
    removeCharacter(name);
  }, []);

  /**
   * تحديث معلومات شخصية
   */
  const handleCharacterUpdate = useCallback((name: string, gender: Gender) => {
    storeCharacter(name, gender);
    setCharacters(prev =>
      prev.map(char =>
        char.name === name ? { ...char, gender, timestamp: new Date() } : char
      )
    );
  }, []);

  /**
   * اختيار ترجمة من السجل
   */
  const handleHistorySelect = useCallback((item: TranslationHistoryItem) => {
    setSourceLang(item.fromLang);
    setTargetLang(item.toLang);
    setSourceText(item.sourceText);
    setTargetText(item.targetText);
    
    if (item.characters) {
      setCharacters(item.characters);
    }
  }, []);

  /**
   * تنفيذ الترجمة
   */
  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setError('الرجاء إدخال نص للترجمة');
      return;
    }
    
    if (!translator) {
      setError('الرجاء إدخال مفتاح API صالح');
      setIsApiKeyModalOpen(true);
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const characterGenders = Object.fromEntries(
        characters
          .filter(char => char.gender)
          .map(char => [char.name, char.gender])
      );

      const result = await translator.translate(sourceText, {
        fromLang: sourceLang,
        toLang: targetLang,
        characters: characterGenders,
        preserveFormatting: true
      });

      setTargetText(result);
      
      const newHistoryItem: TranslationHistoryItem = {
        id: Date.now(),
        sourceText,
        targetText: result,
        fromLang: sourceLang,
        toLang: targetLang,
        timestamp: new Date(),
        characters: characters.filter(char => char.gender)
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error) {
      console.error('Translation error:', error);
      setError(error.message || 'حدث خطأ أثناء الترجمة');
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang, translator, characters]);

  /**
   * معالج ترجمة الفصول
   */
  const handleChapterTranslate = useCallback(async (text: string) => {
    if (!translator) {
      throw new Error('خدمة الترجمة غير متوفرة');
    }
    
    return await translator.translate(text, {
      fromLang: sourceLang,
      toLang: targetLang,
      preserveFormatting: true
    });
  }, [translator, sourceLang, targetLang]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">المترجم الذكي</h1>
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className="btn-icon"
          aria-label="الإعدادات"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 container mx-auto p-4 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              label="من"
            />
            <button
              onClick={handleSwapLanguages}
              className="p-2 rounded hover:bg-gray-100"
              title="تبديل اللغات"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
            <LanguageSelector
              value={targetLang}
              onChange={setTargetLang}
              label="إلى"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="أدخل النص للترجمة..."
                className="textarea-translation"
                dir={sourceLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="space-y-2">
              <textarea
                value={targetText}
                readOnly
                placeholder="الترجمة ستظهر هنا..."
                className="textarea-translation"
                dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <CharacterPronouns
              characters={characters}
              onAdd={handleAddCharacter}
              onRemove={handleRemoveCharacter}
              onUpdate={handleCharacterUpdate}
            />
            <button
              onClick={handleTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="btn-primary"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الترجمة...
                </div>
              ) : (
                'ترجمة'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">سجل الترجمات</h2>
          {history.length === 0 ? (
            <p className="text-center text-gray-400">لا يوجد سجل ترجمة حتى الآن</p>
          ) : (
            <TranslationHistory
              history={history}
              onSelect={handleHistorySelect}
            />
          )}
        </div>
      </main>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        settings={aiSettings}
        onSave={handleAISettingsSubmit}
      />
    </div>
  );
}

export default App;
