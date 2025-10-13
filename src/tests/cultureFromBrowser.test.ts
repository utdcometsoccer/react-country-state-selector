import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cultureFromBrowser } from '../services/cultureFromBrowser';
import { CultureInfo } from '../types';

// Mock navigator.language
const mockNavigator = {
  language: 'en-US',
};

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

describe('cultureFromBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns CultureInfo based on navigator.language', () => {
    mockNavigator.language = 'en-US';
    const result = cultureFromBrowser();

    expect(result).toBeInstanceOf(CultureInfo);
    expect(result.Culture).toBe('en-US');
    expect(result.Language).toBe('en');
    expect(result.Country).toBe('US');
  });

  it('works with different browser languages', () => {
    mockNavigator.language = 'es-MX';
    const result = cultureFromBrowser();

    expect(result).toBeInstanceOf(CultureInfo);
    expect(result.Culture).toBe('es-MX');
    expect(result.Language).toBe('es');
    expect(result.Country).toBe('MX');
  });

  it('works with French Canadian locale', () => {
    mockNavigator.language = 'fr-CA';
    const result = cultureFromBrowser();

    expect(result).toBeInstanceOf(CultureInfo);
    expect(result.Culture).toBe('fr-CA');
    expect(result.Language).toBe('fr');
    expect(result.Country).toBe('CA');
  });

  it('handles European locales', () => {
    mockNavigator.language = 'de-DE';
    const result = cultureFromBrowser();

    expect(result).toBeInstanceOf(CultureInfo);
    expect(result.Culture).toBe('de-DE');
    expect(result.Language).toBe('de');
    expect(result.Country).toBe('DE');
  });

  it('handles Asian locales', () => {
    mockNavigator.language = 'ja-JP';
    const result = cultureFromBrowser();

    expect(result).toBeInstanceOf(CultureInfo);
    expect(result.Culture).toBe('ja-JP');
    expect(result.Language).toBe('ja');
    expect(result.Country).toBe('JP');
  });

  it('throws error for invalid culture format', () => {
    mockNavigator.language = 'invalid';
    
    expect(() => cultureFromBrowser()).toThrow('Invalid culture: invalid');
  });

  it('throws error for unsupported language code', () => {
    mockNavigator.language = 'xx-US';
    
    expect(() => cultureFromBrowser()).toThrow('Invalid culture: xx-US');
  });

  it('throws error for unsupported country code', () => {
    mockNavigator.language = 'en-XX';
    
    expect(() => cultureFromBrowser()).toThrow('Invalid culture: en-XX');
  });
});