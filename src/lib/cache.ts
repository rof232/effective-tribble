interface CacheItem {
  translation: string;
  timestamp: number;
}

interface TranslationCache {
  [key: string]: CacheItem;
}

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class TranslationCacheManager {
  private cache: TranslationCache = {};

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedCache = localStorage.getItem('translationCache');
    if (savedCache) {
      this.cache = JSON.parse(savedCache);
      this.cleanExpiredEntries();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('translationCache', JSON.stringify(this.cache));
  }

  private cleanExpiredEntries() {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > CACHE_EXPIRY) {
        delete this.cache[key];
      }
    });
    this.saveToLocalStorage();
  }

  public getCachedTranslation(text: string, fromLang: string, toLang: string): string | null {
    const key = `${text}_${fromLang}_${toLang}`;
    const cached = this.cache[key];
    
    if (cached && Date.now() - cached.timestamp <= CACHE_EXPIRY) {
      return cached.translation;
    }
    
    return null;
  }

  public cacheTranslation(text: string, fromLang: string, toLang: string, translation: string) {
    const key = `${text}_${fromLang}_${toLang}`;
    this.cache[key] = {
      translation,
      timestamp: Date.now()
    };
    this.saveToLocalStorage();
  }

  public clearCache() {
    this.cache = {};
    localStorage.removeItem('translationCache');
  }
}
