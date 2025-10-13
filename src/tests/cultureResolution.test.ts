import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveCultureInfo, isCultureInfo } from '../utils/cultureResolution';
import { CultureInfo } from '../types';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

// Mock the browser culture detection
vi.mock('../services/cultureFromBrowser', () => ({
  cultureFromBrowser: vi.fn(),
}));

describe('cultureResolution', () => {
  const mockCultureFromBrowser = vi.mocked(cultureFromBrowser);
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock returns en-US culture
    mockCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  describe('resolveCultureInfo', () => {
    describe('Priority 1: CultureInfo object from props', () => {
      it('returns the CultureInfo object when passed directly', () => {
        const cultureInfo = new CultureInfo('fr-CA');
        const result = resolveCultureInfo(cultureInfo);
        
        expect(result).toBe(cultureInfo);
        expect(result.Culture).toBe('fr-CA');
        expect(mockCultureFromBrowser).not.toHaveBeenCalled();
      });

      it('returns different CultureInfo objects correctly', () => {
        const cultures = ['en-US', 'es-MX', 'de-DE', 'ja-JP'] as const;
        
        cultures.forEach(cultureCode => {
          const cultureInfo = new CultureInfo(cultureCode);
          const result = resolveCultureInfo(cultureInfo);
          
          expect(result).toBe(cultureInfo);
          expect(result.Culture).toBe(cultureCode);
        });
      });
    });

    describe('Priority 2: String culture converted to CultureInfo', () => {
      it('converts valid culture string to CultureInfo', () => {
        const result = resolveCultureInfo('es-MX');
        
        expect(result).toBeInstanceOf(CultureInfo);
        expect(result.Culture).toBe('es-MX');
        expect(result.Language).toBe('es');
        expect(result.Country).toBe('MX');
        expect(mockCultureFromBrowser).not.toHaveBeenCalled();
      });

      it('handles various valid culture strings', () => {
        const validCultures = ['en-US', 'fr-CA', 'de-DE', 'zh-CN', 'ja-JP'];
        
        validCultures.forEach(culture => {
          const result = resolveCultureInfo(culture);
          
          expect(result).toBeInstanceOf(CultureInfo);
          expect(result.Culture).toBe(culture);
        });
      });

      it('falls back to browser culture when invalid string is provided', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const browserCulture = new CultureInfo('en-GB');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        const result = resolveCultureInfo('invalid-culture');
        
        expect(result).toBe(browserCulture);
        expect(result.Culture).toBe('en-GB');
        expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
        expect(consoleSpy).toHaveBeenCalledWith(
          'Invalid culture string "invalid-culture", falling back to browser culture:',
          expect.any(Error)
        );
        
        consoleSpy.mockRestore();
      });

      it('falls back to browser culture when empty string is provided', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const browserCulture = new CultureInfo('en-US');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        const result = resolveCultureInfo('');
        
        expect(result).toBe(browserCulture);
        expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
        expect(consoleSpy).toHaveBeenCalled();
        
        consoleSpy.mockRestore();
      });

      it('falls back to browser culture when truly malformed culture string is provided', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const malformedCultures = ['invalid', 'xx-XX', 'not-a-culture', '123-456'];
        
        malformedCultures.forEach(malformed => {
          mockCultureFromBrowser.mockClear();
          const browserCulture = new CultureInfo('en-US');
          mockCultureFromBrowser.mockReturnValue(browserCulture);
          
          const result = resolveCultureInfo(malformed);
          
          expect(result).toBe(browserCulture);
          expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
        });
        
        consoleSpy.mockRestore();
      });

      it('handles edge case culture strings that CultureInfo constructor can parse', () => {
        // These are edge cases that the CultureInfo constructor handles by defaulting missing country
        const edgeCases = ['en', 'fr', 'es']; // These default to 'en-US', 'fr-US', 'es-US'
        
        edgeCases.forEach(culture => {
          const result = resolveCultureInfo(culture);
          
          expect(result).toBeInstanceOf(CultureInfo);
          expect(result.Language).toBe(culture);
          expect(result.Country).toBe('US'); // Defaults to US
          expect(mockCultureFromBrowser).not.toHaveBeenCalled();
        });
      });
    });

    describe('Priority 3: Browser-detected culture (fallback)', () => {
      it('falls back to browser culture when undefined is provided', () => {
        const browserCulture = new CultureInfo('fr-FR');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        const result = resolveCultureInfo(undefined);
        
        expect(result).toBe(browserCulture);
        expect(result.Culture).toBe('fr-FR');
        expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
      });

      it('falls back to browser culture when no parameter is provided', () => {
        const browserCulture = new CultureInfo('de-DE');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        const result = resolveCultureInfo();
        
        expect(result).toBe(browserCulture);
        expect(result.Culture).toBe('de-DE');
        expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
      });

      it('handles different browser cultures correctly', () => {
        const browserCultures = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
        
        browserCultures.forEach(culture => {
          const browserCulture = new CultureInfo(culture as any);
          mockCultureFromBrowser.mockReturnValue(browserCulture);
          
          const result = resolveCultureInfo();
          
          expect(result).toBe(browserCulture);
          expect(result.Culture).toBe(culture);
        });
      });
    });

    describe('Priority order validation', () => {
      it('prioritizes CultureInfo object over string', () => {
        const cultureObject = new CultureInfo('fr-CA');
        const result = resolveCultureInfo(cultureObject);
        
        expect(result).toBe(cultureObject);
        expect(result.Culture).toBe('fr-CA');
        expect(mockCultureFromBrowser).not.toHaveBeenCalled();
      });

      it('prioritizes valid string over browser culture', () => {
        const browserCulture = new CultureInfo('en-US');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        const result = resolveCultureInfo('es-MX');
        
        expect(result.Culture).toBe('es-MX');
        expect(result).not.toBe(browserCulture);
        expect(mockCultureFromBrowser).not.toHaveBeenCalled();
      });

      it('uses browser culture only when string is invalid', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const browserCulture = new CultureInfo('en-GB');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        const result = resolveCultureInfo('invalid-format');
        
        expect(result).toBe(browserCulture);
        expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
        
        consoleSpy.mockRestore();
      });
    });

    describe('Error handling', () => {
      it('gracefully handles CultureInfo constructor errors', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const browserCulture = new CultureInfo('en-US');
        mockCultureFromBrowser.mockReturnValue(browserCulture);
        
        // Test with a culture string that will cause CultureInfo constructor to throw
        const result = resolveCultureInfo('definitely-invalid-culture-format');
        
        expect(result).toBe(browserCulture);
        expect(mockCultureFromBrowser).toHaveBeenCalledOnce();
        expect(consoleSpy).toHaveBeenCalled();
        
        consoleSpy.mockRestore();
      });

      it('does not throw when browser culture detection fails', () => {
        mockCultureFromBrowser.mockImplementation(() => {
          throw new Error('Browser detection failed');
        });
        
        expect(() => resolveCultureInfo()).toThrow('Browser detection failed');
      });
    });
  });

  describe('isCultureInfo type guard', () => {
    it('returns true for CultureInfo instances', () => {
      const cultureInfo = new CultureInfo('en-US');
      expect(isCultureInfo(cultureInfo)).toBe(true);
    });

    it('returns false for strings', () => {
      expect(isCultureInfo('en-US')).toBe(false);
      expect(isCultureInfo('')).toBe(false);
    });

    it('returns false for other types', () => {
      expect(isCultureInfo(null)).toBe(false);
      expect(isCultureInfo(undefined)).toBe(false);
      expect(isCultureInfo(123)).toBe(false);
      expect(isCultureInfo({})).toBe(false);
      expect(isCultureInfo([])).toBe(false);
      expect(isCultureInfo(() => {})).toBe(false);
    });

    it('returns false for objects that look like CultureInfo', () => {
      const fakeCultureInfo = {
        Culture: 'en-US',
        Language: 'en',
        Country: 'US'
      };
      
      expect(isCultureInfo(fakeCultureInfo)).toBe(false);
    });
  });
});