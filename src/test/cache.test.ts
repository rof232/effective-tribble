import { describe, it, expect, beforeEach } from 'vitest';
import { TranslationCacheManager } from '../lib/cache';

describe('TranslationCacheManager', () => {
  let cacheManager: TranslationCacheManager;

  beforeEach(() => {
    localStorage.clear();
    cacheManager = new TranslationCacheManager();
  });

  it('should cache and retrieve translations', () => {
    const text = 'Hello';
    const fromLang = 'en';
    const toLang = 'ar';
    const translation = 'مرحبا';

    cacheManager.cacheTranslation(text, fromLang, toLang, translation);
    const cached = cacheManager.getCachedTranslation(text, fromLang, toLang);

    expect(cached).toBe(translation);
  });

  it('should return null for non-existent cache entries', () => {
    const cached = cacheManager.getCachedTranslation('NonExistent', 'en', 'ar');
    expect(cached).toBeNull();
  });

  it('should clear cache when requested', () => {
    cacheManager.cacheTranslation('Hello', 'en', 'ar', 'مرحبا');
    cacheManager.clearCache();
    
    const cached = cacheManager.getCachedTranslation('Hello', 'en', 'ar');
    expect(cached).toBeNull();
  });
});
