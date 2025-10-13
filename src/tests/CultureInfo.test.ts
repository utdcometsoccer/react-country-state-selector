import { describe, it, expect } from 'vitest';
import { CultureInfo } from '../types';

describe('CultureInfo', () => {
  describe('constructor', () => {
    it('creates a valid CultureInfo for en-US', () => {
      const culture = new CultureInfo('en-US');
      
      expect(culture.Culture).toBe('en-US');
      expect(culture.Language).toBe('en');
      expect(culture.Country).toBe('US');
    });

    it('creates a valid CultureInfo for es-MX', () => {
      const culture = new CultureInfo('es-MX');
      
      expect(culture.Culture).toBe('es-MX');
      expect(culture.Language).toBe('es');
      expect(culture.Country).toBe('MX');
    });

    it('creates a valid CultureInfo for fr-CA', () => {
      const culture = new CultureInfo('fr-CA');
      
      expect(culture.Culture).toBe('fr-CA');
      expect(culture.Language).toBe('fr');
      expect(culture.Country).toBe('CA');
    });

    it('creates a valid CultureInfo for ja-JP', () => {
      const culture = new CultureInfo('ja-JP');
      
      expect(culture.Culture).toBe('ja-JP');
      expect(culture.Language).toBe('ja');
      expect(culture.Country).toBe('JP');
    });

    it('throws error for invalid culture format', () => {
      expect(() => new CultureInfo('invalid' as any)).toThrow('Invalid culture: invalid');
    });

    it('throws error for invalid language code', () => {
      expect(() => new CultureInfo('xx-US' as any)).toThrow('Invalid culture: xx-US');
    });

    it('throws error for invalid country code', () => {
      expect(() => new CultureInfo('en-XX' as any)).toThrow('Invalid culture: en-XX');
    });

    it('throws error for empty string', () => {
      expect(() => new CultureInfo('' as any)).toThrow('Invalid culture: ');
    });

    it('handles culture with too many parts - ignores extra parts', () => {
      // The constructor only takes the first two parts
      const culture = new CultureInfo('en-US-extra' as any);
      expect(culture.Language).toBe('en');
      expect(culture.Country).toBe('US');
    });

    it('handles culture with too few parts - defaults to US', () => {
      // The constructor defaults to 'US' for missing country
      const culture = new CultureInfo('en' as any);
      expect(culture.Language).toBe('en');
      expect(culture.Country).toBe('US');
    });
  });

  describe('isValidCulture static method', () => {
    it('returns true for valid cultures', () => {
      expect(CultureInfo.isValidCulture('en-US')).toBe(true);
      expect(CultureInfo.isValidCulture('es-MX')).toBe(true);
      expect(CultureInfo.isValidCulture('fr-CA')).toBe(true);
      expect(CultureInfo.isValidCulture('de-DE')).toBe(true);
      expect(CultureInfo.isValidCulture('ja-JP')).toBe(true);
      expect(CultureInfo.isValidCulture('zh-CN')).toBe(true);
    });

    it('returns false for invalid cultures', () => {
      expect(CultureInfo.isValidCulture('invalid')).toBe(false);
      expect(CultureInfo.isValidCulture('xx-US')).toBe(false);
      expect(CultureInfo.isValidCulture('en-XX')).toBe(false);
      expect(CultureInfo.isValidCulture('')).toBe(false);
      expect(CultureInfo.isValidCulture('en')).toBe(false);
      expect(CultureInfo.isValidCulture('en-US-extra')).toBe(false);
      expect(CultureInfo.isValidCulture('EN-US')).toBe(false); // Case sensitive
    });

    it('handles edge cases', () => {
      expect(CultureInfo.isValidCulture('a-US')).toBe(false); // Too short language
      expect(CultureInfo.isValidCulture('en-U')).toBe(false); // Too short country
      expect(CultureInfo.isValidCulture('123-US')).toBe(false); // Numbers in language
      expect(CultureInfo.isValidCulture('en-123')).toBe(false); // Numbers in country
    });
  });

  describe('properties', () => {
    it('returns correct Culture property', () => {
      const culture = new CultureInfo('en-US');
      expect(culture.Culture).toBe('en-US');
    });

    it('returns correct Language property', () => {
      const culture = new CultureInfo('en-US');
      expect(culture.Language).toBe('en');
    });

    it('returns correct Country property', () => {
      const culture = new CultureInfo('en-US');
      expect(culture.Country).toBe('US');
    });

    it('properties are consistent across different cultures', () => {
      const cultures = [
        { input: 'en-US', expectedLang: 'en', expectedCountry: 'US' },
        { input: 'es-MX', expectedLang: 'es', expectedCountry: 'MX' },
        { input: 'fr-CA', expectedLang: 'fr', expectedCountry: 'CA' },
        { input: 'de-DE', expectedLang: 'de', expectedCountry: 'DE' },
        { input: 'ja-JP', expectedLang: 'ja', expectedCountry: 'JP' },
      ];

      cultures.forEach(({ input, expectedLang, expectedCountry }) => {
        const culture = new CultureInfo(input as any);
        expect(culture.Culture).toBe(input);
        expect(culture.Language).toBe(expectedLang);
        expect(culture.Country).toBe(expectedCountry);
      });
    });
  });

  describe('immutability', () => {
    it('properties are read-only', () => {
      const culture = new CultureInfo('en-US');
      
      // These should not be writable (TypeScript will catch this, but testing the runtime behavior)
      expect(() => {
        (culture as any).Culture = 'es-MX';
      }).toThrow(); // The setter doesn't exist, so this throws an error
      
      // Values should remain unchanged
      expect(culture.Culture).toBe('en-US');
      expect(culture.Language).toBe('en');
      expect(culture.Country).toBe('US');
    });
  });
});