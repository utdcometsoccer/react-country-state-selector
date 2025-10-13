import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLanguageInformationByCulture } from '../services/getLanguageInformation';
import { CultureInfo } from '../types';

// Mock the dynamic imports
vi.mock('../components/LanguageDropdown/Languages.en-US.json', () => ({
  default: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
  ],
}));

vi.mock('../components/LanguageDropdown/Languages.es-MX.json', () => ({
  default: [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'fr', name: 'Francés' },
  ],
}));

vi.mock('../components/LanguageDropdown/Languages.fr-CA.json', () => ({
  default: [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'Anglais' },
    { code: 'es', name: 'Espagnol' },
  ],
}));

describe('getLanguageInformationByCulture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns English language information for en-US culture', async () => {
    const cultureInfo = new CultureInfo('en-US');
    const result = await getLanguageInformationByCulture(cultureInfo);

    expect(result).toEqual([
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
    ]);
  });

  it('returns Spanish language information for es-MX culture', async () => {
    const cultureInfo = new CultureInfo('es-MX');
    const result = await getLanguageInformationByCulture(cultureInfo);

    expect(result).toEqual([
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'Inglés' },
      { code: 'fr', name: 'Francés' },
    ]);
  });

  it('returns French language information for fr-CA culture', async () => {
    const cultureInfo = new CultureInfo('fr-CA');
    const result = await getLanguageInformationByCulture(cultureInfo);

    expect(result).toEqual([
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'Anglais' },
      { code: 'es', name: 'Espagnol' },
    ]);
  });

  it('throws error for unsupported language and country combination', async () => {
    const cultureInfo = new CultureInfo('de-DE');

    await expect(getLanguageInformationByCulture(cultureInfo)).rejects.toThrow(
      'No language information available for language: de and country: DE'
    );
  });

  it('throws error for unsupported language with supported country', async () => {
    const cultureInfo = new CultureInfo('de-US');

    await expect(getLanguageInformationByCulture(cultureInfo)).rejects.toThrow(
      'No language information available for language: de and country: US'
    );
  });

  it('throws error for supported language with unsupported country', async () => {
    const cultureInfo = new CultureInfo('en-GB');

    await expect(getLanguageInformationByCulture(cultureInfo)).rejects.toThrow(
      'No language information available for language: en and country: GB'
    );
  });
});