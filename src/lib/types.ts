export type Gender = 'male' | 'female';

export interface Character {
  name: string;
  gender?: Gender;
  timestamp?: Date;
}

export interface AIProvider {
  id: 'gemini' | 'openai' | 'anthropic';
  name: string;
  models: AIModel[];
}

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  supportedLanguages: string[];
}

export interface AISettings {
  provider: AIProvider['id'];
  apiKey: string;
  model?: string;
}

export interface TranslationResult {
  text: string;
  from: string;
  to: string;
  timestamp: number;
  characters?: Character[];
}

export interface TranslationOptions {
  fromLang: string;
  toLang: string;
  characters?: Record<string, Gender>;
  preserveFormatting?: boolean;
}

export interface TranslationHistoryItem {
  id: number;
  sourceText: string;
  targetText: string;
  fromLang: string;
  toLang: string;
  timestamp: Date;
  characters?: Character[];
}

export interface AITranslator {
  translate(text: string, options: TranslationOptions): Promise<string>;
  isConfigured(): boolean;
}

export interface TranslationError extends Error {
  code?: string;
  details?: unknown;
}
