import { CountryInformation, CultureInfo } from '../types';

export async function getCountryInformationByCulture(cultureInfo: CultureInfo): Promise<CountryInformation[]> {
  const lang = cultureInfo.Language;
  let fileName: string;
  switch (lang) {
    case 'es':
      fileName = 'countries.es-mx';
      break;
    case 'en':
      fileName = 'countries.en-us';
      break;
    default:
      throw new Error(`No country information available for language: ${lang}`);
  }
  // Dynamic import based on language
  const data = await import(`../components/CountryDropdown/${fileName}.json`);
  return data.default ?? data;
}
