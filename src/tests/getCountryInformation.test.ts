import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { CultureInfo } from '../types';

describe('getCountryInformationByCulture', () => {
  it('returns country information for en-US', async () => {
    const cultureInfo = new CultureInfo('en-US');
    const countries = await getCountryInformationByCulture(cultureInfo);
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
    expect(countries[0]).toHaveProperty('code');
    expect(countries[0]).toHaveProperty('name');
  });

  it('throws for unsupported language', async () => {
    const cultureInfo = new CultureInfo('fr-FR');
    await expect(getCountryInformationByCulture(cultureInfo)).rejects.toThrow();
  });
});
