import { CultureInfo, LanguageInformation } from '../types';

export async function getLanguageInformationByCulture(cultureInfo: CultureInfo): Promise<LanguageInformation[]> {
  const lang = cultureInfo.Language;
  const country = cultureInfo.Country;
  let fileName: string;
  if (lang === 'en' && country === 'US') {
    fileName = 'Languages.en-US';
  } else if (lang === 'es' && country === 'MX') {
    fileName = 'Languages.es-MX';
  } else if (lang === 'fr' && country === 'CA') {
    fileName = 'Languages.fr-CA';
  } else {
    throw new Error(`No language information available for language: ${lang} and country: ${country}`);
  }
  const data = await import(`../components/LanguageDropdown/${fileName}.json`);
  return data.default ?? data;
}
