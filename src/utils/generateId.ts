/**
 * Counter for generating unique IDs
 */
let idCounter = 0;

/**
 * Generates a unique ID with the rcs- prefix for react-country-state-selector components
 * @param prefix - The prefix to use for the ID (e.g., 'country', 'state', 'language')
 * @returns A unique ID string
 */
export function generateUniqueId(prefix: string): string {
  return `rcs-${prefix}-${++idCounter}`;
}
