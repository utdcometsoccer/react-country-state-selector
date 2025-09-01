import { CultureInfo, Culture } from '../types';

/**
 * Gets the browser's culture (e.g., 'en-US') and returns a CultureInfo instance.
 */
export function cultureFromBrowser(): CultureInfo {
  // navigator.language returns e.g. 'en-US', 'es-MX', etc.
  const browserCulture = navigator.language as Culture;
  return new CultureInfo(browserCulture);
}
