export type AIProvider = 'gemini' | 'openai' | 'anthropic';
export type Gender = 'male' | 'female';

export interface Character {
  name: string;
  gender: Gender;
  timestamp: Date;
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TranslationResult {
  translatedText: string;
  confidence?: number;
  provider?: AIProvider;
  timeTaken?: number;
}

export interface TranslationHistoryItem extends TranslationResult {
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  supportedLanguages: string[];
}

export interface AITranslator {
  translate(text: string, options: TranslationOptions): Promise<string>;
  isConfigured(): boolean;
}

export interface TranslationOptions {
  fromLang: string;
  toLang: string;
  characters?: Record<string, Gender>;
  preserveFormatting?: boolean;
}

export interface TranslationError extends Error {
  code?: string;
  details?: unknown;
}

export class AIServiceError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
  }
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}
