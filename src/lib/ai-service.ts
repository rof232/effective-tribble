import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { AISettings, TranslationResult, AIServiceError } from './types';

export interface AITranslator {
  translate(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult>;
}

export abstract class BaseAIService implements AITranslator {
  protected apiKey: string;
  protected logger: Logger;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AIServiceError('API key is required');
    }
    this.apiKey = apiKey;
    this.logger = new Logger();
  }

  abstract translate(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult>;

  protected handleError(error: any): never {
    this.logger.error('Translation error:', error);
    throw new AIServiceError(
      error.message || 'An error occurred during translation',
      error.code || 'TRANSLATION_ERROR'
    );
  }
}

class Logger {
  error(...args: any[]) {
    console.error('[AI Service Error]', ...args);
    // TODO: Implement proper error logging service
  }

  info(...args: any[]) {
    console.info('[AI Service Info]', ...args);
  }

  warn(...args: any[]) {
    console.warn('[AI Service Warning]', ...args);
  }
}

export class AIService extends BaseAIService {
  private settings: AISettings;
  private geminiClient?: GoogleGenerativeAI;
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;

  constructor(settings: AISettings) {
    super(settings.apiKey);
    this.settings = settings;
    this.initializeClient();
  }

  private initializeClient() {
    try {
      switch (this.settings.provider) {
        case 'gemini':
          this.geminiClient = new GoogleGenerativeAI(this.settings.apiKey);
          break;
        case 'openai':
          this.openaiClient = new OpenAI({ apiKey: this.settings.apiKey });
          break;
        case 'anthropic':
          this.anthropicClient = new Anthropic({ apiKey: this.settings.apiKey });
          break;
      }
    } catch (error) {
      this.logger.error('Error initializing AI client:', error);
      throw new AIServiceError('Failed to initialize AI service');
    }
  }

  async translate(
    text: string,
    fromLang: string,
    toLang: string,
    characters?: Record<string, 'male' | 'female'>
  ): Promise<TranslationResult> {
    if (!text.trim()) {
      throw new AIServiceError('No text provided for translation');
    }

    let prompt = `Translate the following text from ${fromLang} to ${toLang}.`;
    
    if (characters && Object.keys(characters).length > 0) {
      prompt += '\n\nUse the following gender information for proper pronoun translation:\n';
      Object.entries(characters).forEach(([name, gender]) => {
        prompt += `- "${name}" is ${gender}\n`;
      });
    }
    
    prompt += `\nOnly return the translated text without any additional explanation or context:\n\n"${text}"`;

    try {
      switch (this.settings.provider) {
        case 'gemini':
          if (!this.geminiClient) throw new AIServiceError('Gemini client not initialized');
          const model = this.geminiClient.getGenerativeModel({ model: this.settings.model });
          const result = await model.generateContent(prompt);
          return { translatedText: result.response.text() };

        case 'openai':
          if (!this.openaiClient) throw new AIServiceError('OpenAI client not initialized');
          const completion = await this.openaiClient.chat.completions.create({
            model: this.settings.model,
            messages: [{ role: 'user', content: prompt }]
          });
          return { translatedText: completion.choices[0]?.message.content || '' };

        case 'anthropic':
          if (!this.anthropicClient) throw new AIServiceError('Anthropic client not initialized');
          const message = await this.anthropicClient.messages.create({
            model: this.settings.model,
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }]
          });
          return { translatedText: message.content[0].text };

        default:
          throw new AIServiceError('Unsupported AI provider');
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const getStoredSettings = (): AISettings => {
  try {
    const stored = localStorage.getItem('ai_settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    this.logger.error('Error reading stored settings:', error);
  }
  
  return {
    provider: 'gemini',
    model: 'gemini-pro',
    apiKey: ''
  };
};

export const storeSettings = (settings: AISettings) => {
  try {
    localStorage.setItem('ai_settings', JSON.stringify(settings));
  } catch (error) {
    this.logger.error('Error storing settings:', error);
  }
};
