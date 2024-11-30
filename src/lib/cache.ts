interface CacheEntry {
  translation: string;
  timestamp: number;
  fromLang: string;
  toLang: string;
  hash: string;
}

export class TranslationCache {
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة
  private readonly MAX_CACHE_SIZE = 1000; // الحد الأقصى لعدد الترجمات المخزنة

  constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  private generateHash(text: string): string {
    // استخدام خوارزمية بسيطة لتوليد هاش للنص
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    const hash = this.generateHash(text);
    return `${fromLang}:${toLang}:${hash}`;
  }

  private loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('translation-cache');
      if (saved) {
        const entries = JSON.parse(saved);
        this.cache = new Map(entries);
        this.cleanup();
      }
    } catch (error) {
      console.warn('فشل تحميل الذاكرة المؤقتة:', error);
      this.cache.clear();
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
    const entries = Array.from(this.cache.entries());
    
    // حذف الترجمات القديمة
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    });

    // إذا كان حجم الذاكرة المؤقتة أكبر من الحد الأقصى
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      // ترتيب الترجمات حسب وقت الاستخدام وحذف الأقدم
      const sortedEntries = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const entriesToKeep = sortedEntries.slice(0, this.MAX_CACHE_SIZE);
      this.cache = new Map(entriesToKeep);
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

    // تحديث وقت الاستخدام
    entry.timestamp = Date.now();
    this.cache.set(key, entry);
    this.saveToLocalStorage();
    
    return entry.translation;
  }

  set(text: string, fromLang: string, toLang: string, translation: string) {
    const key = this.getCacheKey(text, fromLang, toLang);
    const hash = this.generateHash(text);
    
    this.cache.set(key, {
      translation,
      timestamp: Date.now(),
      fromLang,
      toLang,
      hash
    });

    // تنظيف الذاكرة المؤقتة إذا تجاوزت الحد الأقصى
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      this.cleanup();
    } else {
      this.saveToLocalStorage();
    }
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem('translation-cache');
  }
}
