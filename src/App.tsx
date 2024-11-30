/**
 * المترجم الذكي - تطبيق React لترجمة النصوص باستخدام الذكاء الاصطناعي
 * يدعم ترجمة النصوص والفصول مع إدارة المصطلحات والشخصيات
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowRightLeft, Loader2, Settings } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import TranslationHistory from './components/TranslationHistory';
import ApiKeyModal from './components/ApiKeyModal';
import CharacterPronouns from './components/CharacterPronouns';
import GlossaryManager from './components/GlossaryManager';
import TextFormatting from './components/TextFormatting';
import ChapterManager from './components/ChapterManager';
import { AIService, getStoredSettings, storeSettings } from './lib/ai-service';
import { getStoredCharacters, storeCharacter, removeCharacter } from './lib/characters';
import type { TranslationHistoryItem, DetectedCharacter, AISettings } from './lib/types';

/**
 * المكون الرئيسي للتطبيق
 * يدير حالة الترجمة والإعدادات والمكونات الفرعية
 */
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
  const [aiService, setAIService] = useState<AIService | null>(null);
  const [aiSettings, setAISettings] = useState<AISettings>(getStoredSettings());

  // إدارة الشخصيات
  const [characters, setCharacters] = useState<DetectedCharacter[]>([]);

  // إدارة التبويب النشط
  const [activeTab, setActiveTab] = useState<'translate' | 'chapters'>('translate');

  /**
   * تحميل الإعدادات والشخصيات عند بدء التطبيق
   */
  useEffect(() => {
    const settings = getStoredSettings();
    if (settings.apiKey) {
      setAIService(new AIService(settings));
    } else {
      setIsApiKeyModalOpen(true);
    }

    // Load stored characters
    const storedCharacters = getStoredCharacters();
    setCharacters(
      Object.entries(storedCharacters).map(([name, gender]) => ({
        name,
        gender
      }))
    );
  }, []);

  /**
   * تبديل اللغات المصدر والهدف
   */
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  /**
   * معالجة تحديث إعدادات الذكاء الاصطناعي
   */
  const handleAISettingsSubmit = (settings: AISettings) => {
    setAISettings(settings);
    setAIService(new AIService(settings));
    storeSettings(settings);
  };

  /**
   * إضافة شخصية جديدة
   */
  const handleAddCharacter = (name: string) => {
    if (!characters.some(char => char.name.toLowerCase() === name.toLowerCase())) {
      setCharacters(prev => [...prev, { name }]);
    }
  };

  /**
   * حذف شخصية
   */
  const handleRemoveCharacter = (name: string) => {
    setCharacters(prev => prev.filter(char => char.name !== name));
    removeCharacter(name);
  };

  /**
   * تحديث معلومات شخصية
   */
  const handleCharacterUpdate = (name: string, gender: 'male' | 'female') => {
    storeCharacter(name, gender);
    setCharacters(prev =>
      prev.map(char =>
        char.name === name ? { ...char, gender } : char
      )
    );
  };

  /**
   * اختيار ترجمة من السجل
   */
  const handleHistorySelect = (item: TranslationHistoryItem) => {
    setSourceLang(item.fromLang);
    setTargetLang(item.toLang);
    setSourceText(item.sourceText);
    setTargetText(item.targetText);
    
    if (item.characters) {
      setCharacters(
        item.characters.map(char => ({
          name: char.name,
          gender: char.gender
        }))
      );
    }
  };

  /**
   * تنفيذ الترجمة
   */
  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      if (!aiSettings?.apiKey) {
        throw new Error('الرجاء إدخال مفتاح API في الإعدادات');
      }

      const service = new GeminiService(aiSettings.apiKey);
      if (!service.isConfigured()) {
        throw new Error('فشل في تهيئة خدمة الترجمة');
      }

      const characterGenders = Object.fromEntries(
        characters
          .filter(char => char.gender)
          .map(char => [char.name, char.gender])
      );

      const result = await service.translate(sourceText, {
        fromLang: sourceLang,
        toLang: targetLang,
        characters: characterGenders,
        preserveFormatting: true
      });

      if (!result) {
        throw new Error('لم يتم استلام أي ترجمة');
      }

      setTargetText(result);
      
      // حفظ في السجل
      setHistory(prev => [{
        id: Date.now(),
        sourceText,
        targetText: result,
        fromLang: sourceLang,
        toLang: targetLang,
        timestamp: new Date()
      }, ...prev]);

    } catch (error) {
      console.error('Translation error:', error);
      setError(error.message || 'حدث خطأ أثناء الترجمة');
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang, aiSettings, characters]);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-white">المترجم الذكي</h1>
      </header>
      <main className="container mx-auto p-4" role="main">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="text-center mb-12 relative floating">
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="absolute left-4 top-4 p-4 glass-morphism rounded-2xl hover:scale-105 
              transition-all duration-300 ease-out shadow-lg hover:shadow-xl 
              backdrop-blur-lg bg-white/5 hover:bg-white/10 group"
            title="إعدادات API"
          >
            <Settings className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg text-stroke">المترجم الذكي</h1>
          <p className="text-xl text-white/90 text-stroke-sm">ترجمة احترافية باستخدام الذكاء الاصطناعي</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('translate')}
            className={`btn-secondary ${activeTab === 'translate' ? 'bg-white/20' : ''}`}
          >
            ترجمة نص
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`btn-secondary ${activeTab === 'chapters' ? 'bg-white/20' : ''}`}
          >
            إدارة الفصول
          </button>
        </div>

        {activeTab === 'translate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-morphism rounded-2xl p-6 shadow-lg">
                <CharacterPronouns
                  characters={characters}
                  onAdd={handleAddCharacter}
                  onRemove={handleRemoveCharacter}
                  onUpdate={handleCharacterUpdate}
                />
                <div className="flex items-center gap-4 mb-6">
                  <LanguageSelector
                    fromLang={sourceLang}
                    toLang={targetLang}
                    onFromLangChange={setSourceLang}
                    onToLangChange={setTargetLang}
                    onSwapLanguages={handleSwapLanguages}
                  />
                </div>

                <div className="space-y-4">
                  <TextFormatting
                    text={sourceText}
                    onTextChange={setSourceText}
                  />

                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="أدخل النص للترجمة..."
                    className="w-full h-32 p-4 rounded-xl glass-morphism text-white placeholder-white/50
                      focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    dir="auto"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleTranslate}
                      disabled={isLoading || !sourceText.trim()}
                      className={`px-6 py-2 rounded-lg ${
                        isLoading
                          ? 'bg-gray-500 cursor-not-allowed'
                          : error
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-primary hover:bg-primary-dark'
                      } text-white transition-all duration-300`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" size={16} />
                          جاري الترجمة...
                        </span>
                      ) : error ? (
                        'حاول مرة أخرى'
                      ) : (
                        'ترجم'
                      )}
                    </button>
                  </div>

                  {targetText && (
                    <div className="glass-morphism rounded-xl p-4 text-white/90">
                      <p dir="auto">{targetText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <GlossaryManager
                onTermSelect={(term) => {
                  setSourceText((prev) => prev + ' ' + term.original);
                }}
              />
              <TranslationHistory
                history={history}
                onSelect={handleHistorySelect}
              />
            </div>
          </div>
        ) : (
          <ChapterManager
            onTranslate={async (text) => {
              if (!aiService) throw new Error('لم يتم تكوين خدمة الترجمة');
              return await aiService.translate(text, sourceLang, targetLang);
            }}
          />
        )}
      </main>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSubmit={handleAISettingsSubmit}
        initialSettings={aiSettings}
      >
        <select
          value={aiSettings.provider}
          onChange={(e) => setAISettings({
            ...aiSettings,
            provider: e.target.value as 'openai' | 'anthropic'
          })}
          className="w-full p-3 rounded-xl glass-morphism text-white
            focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          aria-label="اختر مزود خدمة الذكاء الاصطناعي"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
        <select
          value={aiSettings.model}
          onChange={(e) => setAISettings({
            ...aiSettings,
            model: e.target.value
          })}
          className="w-full p-3 rounded-xl glass-morphism text-white
            focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          aria-label="اختر نموذج الذكاء الاصطناعي"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </ApiKeyModal>
    </div>
  );
}

export default App;
