import { CacheEntry } from './types';

export class CacheService<T> {
  private readonly storage: Storage;
  private readonly prefix: string;
  private readonly ttl: number; // Time to live in milliseconds

  constructor(
    storage: Storage = localStorage,
    prefix: string = 'ai_translator_cache_',
    ttlMinutes: number = 60
  ) {
    this.storage = storage;
    this.prefix = prefix;
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, value: T): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.ttl
    };

    try {
      this.storage.setItem(
        this.prefix + key,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.warn('Cache write failed:', error);
      this.cleanup(); // Try to free up space
    }
  }

  get(key: string): T | null {
    try {
      const item = this.storage.getItem(this.prefix + key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      if (Date.now() > entry.expiresAt) {
        this.storage.removeItem(this.prefix + key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  private cleanup(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        try {
          const item = this.storage.getItem(key);
          if (item) {
            const entry: CacheEntry<T> = JSON.parse(item);
            if (Date.now() > entry.expiresAt) {
              keysToRemove.push(key);
            }
          }
        } catch {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => this.storage.removeItem(key));
  }

  clear(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => this.storage.removeItem(key));
  }
}
