import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIService } from '../lib/ai-service';
import { AIServiceError } from '../lib/types';

describe('AIService', () => {
  let service: AIService;

  beforeEach(() => {
    service = new AIService({
      provider: 'gemini',
      apiKey: 'test-key',
      model: 'test-model'
    });
  });

  it('should throw error when initialized without API key', () => {
    expect(() => new AIService({
      provider: 'gemini',
      apiKey: '',
      model: 'test-model'
    })).toThrow(AIServiceError);
  });

  it('should throw error when translating empty text', async () => {
    await expect(service.translate('', 'en', 'es')).rejects.toThrow(AIServiceError);
  });

  it('should handle translation errors gracefully', async () => {
    // Mock a failed API call
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    await expect(service.translate('Hello', 'en', 'es')).rejects.toThrow(AIServiceError);
  });

  // Add more tests as needed
});
