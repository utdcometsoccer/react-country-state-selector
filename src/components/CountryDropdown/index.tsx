import { type ChangeEvent, type FC, useEffect, useReducer } from 'react';
import './CountryDropdown.css';
import { cultureFromBrowser } from '../../services/cultureFromBrowser';
import { getCountryInformationByCulture } from '../../services/getCountryInformation';
import { resolveCultureInfo } from '../../utils/cultureResolution';
import { renderGroupedOptions } from '../../utils/renderOptions';
import { Country, type CountryDropdownProps, CountryInformation, CultureInfo } from '../../types';
import LoadingIndicator from '../LoadingIndicator';
import VirtualSelect, { type VirtualSelectOption } from '../VirtualSelect';
import LoadingSpinner from '../LoadingSpinner';

interface CountryDropdownState {
  selectedCountry: Country;
  culture?: CultureInfo | string;
  cultureInfo?: CultureInfo;
  countryInformation: CountryInformation[];
  error?: string | null;
  isLoadingCountryInformation: boolean;
}

type CountryDropdownAction =
  | { type: 'SET_COUNTRY'; payload: Country }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COUNTRY_INFORMATION'; payload: CountryInformation[] }
  | { type: 'SET_LOADING_COUNTRY_INFORMATION'; payload: boolean };

function reducer(state: CountryDropdownState, action: CountryDropdownAction): CountryDropdownState {
  switch (action.type) {
    case 'SET_COUNTRY': {
      return { ...state, selectedCountry: action.payload };
    }
    case 'SET_CULTURE':
      return { ...state, culture: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_COUNTRY_INFORMATION':
      return { ...state, countryInformation: action.payload };
    case 'SET_LOADING_COUNTRY_INFORMATION':
      return { ...state, isLoadingCountryInformation: action.payload };
    default:
      return state;
  }
}

const CountryDropdown: FC<CountryDropdownProps> = ({ 
  selectedCountry, 
  onCountryChange, 
  culture, 
  countryInformation, 
  getCountryInformation, 
  Label, 
  classNameLabel, 
  classNameSelect,
  enableVirtualScrolling = true,
  virtualScrollThreshold = 50,
  enableSearch = false,
  showLoadingIndicator = true,
  customLoadingIndicator,
  loadingText = "Loading country information...",
  required = false
}) => {
  // Set default for getCountryInformation if not provided
  const effectiveGetCountryInformation = getCountryInformation ?? getCountryInformationByCulture;
  const initialCultureInfo: CultureInfo = resolveCultureInfo(culture);
  const initialCountryInformation: CountryInformation[] = countryInformation ?? [];

  const [state, dispatch] = useReducer(reducer, {
    selectedCountry: selectedCountry as Country,
    culture,
    cultureInfo: initialCultureInfo,
    countryInformation: initialCountryInformation,
    error: null,
    isLoadingCountryInformation: false
  });

  useEffect(() => {
    if (state.countryInformation.length === 0 && !state.isLoadingCountryInformation) {
      dispatch({ type: 'SET_LOADING_COUNTRY_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetCountryInformation(state.cultureInfo!);
          dispatch({ type: 'SET_COUNTRY_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
        } catch (err: any) {
          if (process.env.NODE_ENV === 'development') {
            dispatch({ type: 'SET_ERROR', payload: `Error loading country information: ${err?.message}\n${err?.stack}` });
          } else {
            dispatch({ type: 'SET_ERROR', payload: 'Error loading country information. Please try again later.' });
          }
        } finally {
          dispatch({ type: 'SET_LOADING_COUNTRY_INFORMATION', payload: false });
        }
      })();
    }
  }, [state.countryInformation.length, state.cultureInfo, effectiveGetCountryInformation]);

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_COUNTRY', payload: value as Country });
    onCountryChange(value);
  };

  // Convert country information to VirtualSelect options
  const virtualSelectOptions: VirtualSelectOption[] = state.countryInformation.map(country => ({
    value: country.code,
    label: country.name,
    group: country.group
  }));
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Find matching country by code or name
    const matchingCountry = state.countryInformation.find(
      c => c.code === value || c.name === value
    );
    if (matchingCountry) {
      dispatch({ type: 'SET_COUNTRY', payload: matchingCountry.code });
      onCountryChange(matchingCountry.code);
    } else {
      dispatch({ type: 'SET_COUNTRY', payload: value as Country });
      onCountryChange(value);
    }
  };

  // Get display name for selected country
  const getSelectedCountryName = () => {
    if (!state.selectedCountry) return '';
    const country = state.countryInformation.find(c => c.code === state.selectedCountry);
    return country ? country.name : state.selectedCountry;
  };

  return (
    <div className="country-dropdown-container">
      {state.error && (
        <div 
          id="country-error-message" 
          className="country-error-message"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </div>
      )}
      <label
        id="country-select-label"
        htmlFor="country-select"
        className={classNameLabel ?? 'country-dropdown-label'}
      >
        {Label}{required && <span aria-label="required"> *</span>}
      </label>
      {state.isLoadingCountryInformation && showLoadingIndicator ? (
        <div role="status" aria-live="polite">
          {customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading country information" />}
        </div>
      ) : enableSearch ? (
        <>
          <input
            id="country-select"
            list="country-datalist"
            value={getSelectedCountryName()}
            onChange={handleSearchChange}
            className={classNameSelect ?? undefined}
            aria-labelledby="country-select-label"
            aria-describedby={state.error ? 'country-error-message' : undefined}
            aria-required={required}
            aria-invalid={state.error ? true : undefined}
            placeholder="Search or select a country"
            autoComplete="off"
            required={required}
          />
          <datalist id="country-datalist">
            {state.countryInformation.map((country) => (
              <option key={country.code} value={country.name} data-value={country.code}>
                {country.name}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <VirtualSelect
          id="country-select"
          value={state.selectedCountry ?? ''}
          onChange={handleChange}
          options={virtualSelectOptions}
          placeholder="Select a country"
          className={classNameSelect ?? 'country-dropdown-select'}
          aria-labelledby="country-select-label"
          aria-describedby={state.error ? 'country-error-message' : undefined}
          aria-required={required}
          aria-invalid={state.error ? true : undefined}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
          required={required}
        />
      )}
    </div>
  );
};

export default CountryDropdown;

// Removed ImportMeta global declaration since 'import.meta.env' is no longer used.