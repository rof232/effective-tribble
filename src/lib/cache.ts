interface CacheEntry {
  translation: string;
  timestamp: number;
}

export class TranslationCache {
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة

  constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    return `${fromLang}:${toLang}:${text}`;
  }

  private loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('translation-cache');
      if (saved) {
        const entries = JSON.parse(saved);
        this.cache = new Map(entries);
        // تنظيف الذاكرة المؤقتة القديمة
        this.cleanup();
      }
    } catch (error) {
      console.warn('فشل تحميل الذاكرة المؤقتة:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      const entries = Array.from(this.cache.entries());
      localStorage.setItem('translation-cache', JSON.stringify(entries));
    } catch (error) {
      console.warn('فشل حفظ الذاكرة المؤقتة:', error);
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
    this.saveToLocalStorage();
  }

  get(text: string, fromLang: string, toLang: string): string | null {
    const key = this.getCacheKey(text, fromLang, toLang);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // التحقق من صلاحية الذاكرة المؤقتة
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.saveToLocalStorage();
      return null;
    }
    
    return entry.translation;
  }

  set(text: string, fromLang: string, toLang: string, translation: string) {
    const key = this.getCacheKey(text, fromLang, toLang);
    this.cache.set(key, {
      translation,
      timestamp: Date.now()
    });
    this.saveToLocalStorage();
  }
}
