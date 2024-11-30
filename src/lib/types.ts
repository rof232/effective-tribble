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

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'custom';

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
  model: string;
  apiKey: string;
}