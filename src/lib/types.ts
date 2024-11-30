export interface Character {
  name: string;
  gender: 'male' | 'female';
  timestamp: Date;
}

export interface TranslationHistoryItem {
  id: number;
  from: string;
  to: string;
  originalText: string;
  translatedText: string;
  timestamp: Date;
  characters?: Character[];
  provider: AIProvider;
  model: string;
}

export interface DetectedCharacter {
  name: string;
  gender?: 'male' | 'female';
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
}

export interface AIProviderConfig {
  name: string;
  models: AIModel[];
  customModelSupport?: boolean;
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface TranslationResult {
  text: string;
  from: string;
  to: string;
  timestamp: number;
}

export interface TranslationOptions {
  fromLang: string;
  toLang: string;
  characters?: Record<string, 'male' | 'female'>;
  preserveFormatting?: boolean;
}

export interface AITranslator {
  translate(text: string, options: TranslationOptions): Promise<string>;
  isConfigured(): boolean;
}
