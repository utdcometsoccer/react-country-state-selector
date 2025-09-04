import { CountryInformation, CultureInfo } from '../types';

export async function getCountryInformationByCulture(cultureInfo: CultureInfo): Promise<CountryInformation[]> {
  const lang = cultureInfo.Language;
  const country = cultureInfo.Country;
  let fileName: string;
  if (lang === 'es' && country === 'MX') {
    fileName = 'countries.es-mx';
  } else if (lang === 'en' && country === 'US') {
    fileName = 'countries.en-us';
  } else if (lang === 'fr' && country === 'CA') {
    fileName = 'countries.fr-ca';
  } else {
    throw new Error(`No country information available for language: ${lang} and country: ${country}`);
  }
  // Dynamic import based on language and country
  const data = await import(`../components/CountryDropdown/${fileName}.json`);
  return data.default ?? data;
}
