import { StateProvinceInformation, CultureInfo, GetStateProvinceInformation } from '../types';

export const getStateProvinceInformationByCulture: GetStateProvinceInformation = async (cultureInfo: CultureInfo): Promise<StateProvinceInformation[]> => {
  const country = cultureInfo.Country;
  const lang = cultureInfo.Language;
  let fileName: string | undefined;

  if (country === 'US' && lang === 'en') {
    fileName = 'StatesProvinces.en-us';
  } else if (country === 'CA' && lang === 'en') {
    fileName = 'StatesProvinces.en-ca';
  } else if (country === 'CA' && lang === 'fr') {
    fileName = 'StatesProvinces.fr-ca';
  } else if (country === 'MX' && lang === 'es') {
    fileName = 'StatesProvinces.es-mx';
  }

  if (!fileName) {
    throw new Error(`No state/province information available for country: ${country} and language: ${lang}`);
  }

  const data = await import(`../components/StateDropdown/${fileName}.json`);
  return data.default ?? data;
};

/**
 * Default function for getting state and province information used by StateDropdown component.
 * This is an alias for getStateProvinceInformationByCulture.
 */
export const defaultGetStateProvinceInformation: GetStateProvinceInformation = getStateProvinceInformationByCulture;
