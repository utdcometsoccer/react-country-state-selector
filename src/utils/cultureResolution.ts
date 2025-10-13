import { CultureInfo, type Culture } from '../types';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

/**
 * Resolves a CultureInfo object from various input sources with priority:
 * 1. CultureInfo object from props
 * 2. Culture string from props (converted to CultureInfo)
 * 3. Browser-detected culture (fallback)
 * 
 * @param culture - Culture input that can be a CultureInfo object, string, or undefined
 * @returns A valid CultureInfo object
 */
export function resolveCultureInfo(culture?: CultureInfo | string): CultureInfo {
  // Priority 1: Direct CultureInfo object
  if (culture instanceof CultureInfo) {
    return culture;
  }
  
  // Priority 2: String culture converted to CultureInfo
  if (typeof culture === 'string') {
    try {
      return new CultureInfo(culture as Culture);
    } catch (error) {
      // If string is invalid, fall back to browser culture
      console.warn(`Invalid culture string "${culture}", falling back to browser culture:`, error);
    }
  }
  
  // Priority 3: Browser-detected culture (fallback)
  return cultureFromBrowser();
}

/**
 * Type guard to check if a value is a CultureInfo instance
 * @param value - Value to check
 * @returns True if value is CultureInfo instance
 */
export function isCultureInfo(value: any): value is CultureInfo {
  return value instanceof CultureInfo;
}