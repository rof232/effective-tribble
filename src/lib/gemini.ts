import { GoogleGenerativeAI } from '@google/generative-ai';

let apiKey: string | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

export const initializeGemini = (key: string) => {
  apiKey = key;
  geminiClient = new GoogleGenerativeAI(key);
  localStorage.setItem('gemini_api_key', key);
};

export const getStoredApiKey = () => {
  return localStorage.getItem('gemini_api_key');
};

export const translate = async (
  text: string,
  fromLang: string,
  toLang: string,
  characters?: Record<string, 'male' | 'female'>
) => {
  if (!geminiClient) {
    throw new Error('Gemini API not initialized');
  }

  const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
  
  let prompt = `Translate the following text from ${fromLang} to ${toLang}.`;
  
  if (characters && Object.keys(characters).length > 0) {
    prompt += '\n\nUse the following gender information for proper pronoun translation:\n';
    Object.entries(characters).forEach(([name, gender]) => {
      prompt += `- "${name}" is ${gender}\n`;
    });
  }
  
  prompt += `\nOnly return the translated text without any additional explanation or context:\n\n"${text}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};