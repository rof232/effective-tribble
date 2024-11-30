import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { AISettings } from './types';

export class AIService {
  private settings: AISettings;
  private geminiClient?: GoogleGenerativeAI;
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;

  constructor(settings: AISettings) {
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
      console.error('Error initializing AI client:', error);
      throw new Error('Failed to initialize AI service');
    }
  }

  async translate(
    text: string,
    fromLang: string,
    toLang: string,
    characters?: Record<string, 'male' | 'female'>
  ): Promise<string> {
    if (!text.trim()) {
      throw new Error('No text provided for translation');
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
          if (!this.geminiClient) throw new Error('Gemini client not initialized');
          const model = this.geminiClient.getGenerativeModel({ model: this.settings.model });
          const result = await model.generateContent(prompt);
          return result.response.text();

        case 'openai':
          if (!this.openaiClient) throw new Error('OpenAI client not initialized');
          const completion = await this.openaiClient.chat.completions.create({
            model: this.settings.model,
            messages: [{ role: 'user', content: prompt }]
          });
          return completion.choices[0]?.message.content || '';

        case 'anthropic':
          if (!this.anthropicClient) throw new Error('Anthropic client not initialized');
          const message = await this.anthropicClient.messages.create({
            model: this.settings.model,
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }]
          });
          return message.content[0].text;

        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
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
    console.error('Error reading stored settings:', error);
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
    console.error('Error storing settings:', error);
  }
};
