import { describe, it, expect, beforeEach } from 'vitest';
import { CacheService } from '../lib/cache-service';

describe('CacheService', () => {
  let cache: CacheService<string>;
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = {
      length: 0,
      clear: vi.fn(),
      getItem: vi.fn(),
      key: vi.fn(),
      removeItem: vi.fn(),
      setItem: vi.fn(),
    };
    cache = new CacheService(mockStorage);
  });

  it('should store and retrieve items', () => {
    const key = 'test-key';
    const value = 'test-value';

    cache.set(key, value);
    expect(mockStorage.setItem).toHaveBeenCalled();

    mockStorage.getItem.mockReturnValue(JSON.stringify({
      data: value,
      timestamp: Date.now(),
      expiresAt: Date.now() + 3600000
    }));

    const retrieved = cache.get(key);
    expect(retrieved).toBe(value);
  });

  it('should handle expired items', () => {
    const key = 'test-key';
    mockStorage.getItem.mockReturnValue(JSON.stringify({
      data: 'test-value',
      timestamp: Date.now() - 7200000, // 2 hours ago
      expiresAt: Date.now() - 3600000  // Expired 1 hour ago
    }));

    const retrieved = cache.get(key);
    expect(retrieved).toBeNull();
    expect(mockStorage.removeItem).toHaveBeenCalled();
  });

  it('should handle storage errors gracefully', () => {
    const key = 'test-key';
    mockStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const retrieved = cache.get(key);
    expect(retrieved).toBeNull();
  });
});
