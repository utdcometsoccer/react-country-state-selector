import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { CultureInfo } from '../types';

describe('getStateProvinceInformationByCulture', () => {
  it('returns state/province information for en-US', async () => {
    const cultureInfo = new CultureInfo('en-US');
    const states = await getStateProvinceInformationByCulture(cultureInfo);
    expect(Array.isArray(states)).toBe(true);
    expect(states.length).toBeGreaterThan(0);
    expect(states[0]).toHaveProperty('code');
    expect(states[0]).toHaveProperty('name');
  });

  it('throws for unsupported country/language', async () => {
    const cultureInfo = new CultureInfo('fr-FR');
    await expect(getStateProvinceInformationByCulture(cultureInfo)).rejects.toThrow();
  });
});
