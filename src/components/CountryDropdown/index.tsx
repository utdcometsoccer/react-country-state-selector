import { type ChangeEvent, type FC, useEffect, useReducer, useState } from 'react';
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
  onSuccess,
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
  loadingText = "Loading country information..."
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

  const [selectionFeedback, setSelectionFeedback] = useState<string>('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    if (!showSuccessAnimation) return;
    
    const timeoutId = setTimeout(() => setShowSuccessAnimation(false), 600);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccessAnimation]);

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

  // Helper function to trigger success feedback
  const triggerSuccessFeedback = (code: string, name: string) => {
    setSelectionFeedback(`${name} selected`);
    setShowSuccessAnimation(true);
    if (onSuccess) {
      onSuccess(code);
    }
  };

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_COUNTRY', payload: value as Country });
    onCountryChange(value);
    
    // Success feedback
    const country = state.countryInformation.find(c => c.code === value);
    const countryName = country ? country.name : value;
    triggerSuccessFeedback(value, countryName);
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
      triggerSuccessFeedback(matchingCountry.code, matchingCountry.name);
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
      {/* Aria-live region for selection confirmation */}
      <div className="rcss-selection-feedback" role="status" aria-live="polite" aria-atomic="true">
        {selectionFeedback}
      </div>
      
      {state.error && (
        <div 
          id="country-error-message"
          className="country-error-message"
          role="alert"
          aria-live="polite"
        >
          <span className="rcss-error-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </span>
          <span>{state.error}</span>
        </div>
      )}
      <label
        htmlFor="country-select"
        className={classNameLabel ?? 'country-dropdown-label'}
      >
        {Label}
      </label>
      {state.isLoadingCountryInformation && showLoadingIndicator ? (
        customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading country information" />
      ) : enableSearch ? (
        <>
          <input
            id="country-select"
            list="country-datalist"
            value={getSelectedCountryName()}
            onChange={handleSearchChange}
            className={`${classNameSelect ?? ''} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
            aria-describedby={state.error ? 'country-error-message' : undefined}
            placeholder="Search or select a country"
            autoComplete="off"
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
          className={`${classNameSelect ?? 'country-dropdown-select'} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
          aria-describedby={state.error ? 'country-error-message' : undefined}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
        />
      )}
    </div>
  );
};

export default CountryDropdown;

// Removed ImportMeta global declaration since 'import.meta.env' is no longer used.