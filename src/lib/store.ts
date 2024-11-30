import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AISettings, 
  TranslationHistoryItem, 
  Character,
  TranslationResult 
} from './types';
import { CacheService } from './cache-service';

interface AppState {
  // Settings
  settings: AISettings;
  updateSettings: (settings: Partial<AISettings>) => void;
  
  // Translation state
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  isTranslating: boolean;
  error: string | null;
  setSourceText: (text: string) => void;
  setTargetText: (text: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setIsTranslating: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // History
  history: TranslationHistoryItem[];
  addToHistory: (item: TranslationHistoryItem) => void;
  clearHistory: () => void;

  // Characters
  characters: Character[];
  addCharacter: (character: Character) => void;
  removeCharacter: (name: string) => void;
  updateCharacter: (name: string, updates: Partial<Character>) => void;
}

// Initialize cache service
const cache = new CacheService<TranslationResult>();

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial settings
      settings: {
        provider: 'gemini',
        apiKey: '',
        model: 'gemini-pro',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Translation state
      sourceText: '',
      targetText: '',
      sourceLang: 'en',
      targetLang: 'es',
      isTranslating: false,
      error: null,
      setSourceText: (text) => set({ sourceText: text }),
      setTargetText: (text) => set({ targetText: text }),
      setSourceLang: (lang) => set({ sourceLang: lang }),
      setTargetLang: (lang) => set({ targetLang: lang }),
      setIsTranslating: (loading) => set({ isTranslating: loading }),
      setError: (error) => set({ error }),

      // History
      history: [],
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 100), // Keep last 100 items
        })),
      clearHistory: () => set({ history: [] }),

      // Characters
      characters: [],
      addCharacter: (character) =>
        set((state) => ({
          characters: [...state.characters, character],
        })),
      removeCharacter: (name) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.name !== name),
        })),
      updateCharacter: (name, updates) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.name === name ? { ...c, ...updates } : c
          ),
        })),
    }),
    {
      name: 'ai-translator-storage',
      partialize: (state) => ({
        settings: state.settings,
        history: state.history,
        characters: state.characters,
      }),
    }
  )
);
