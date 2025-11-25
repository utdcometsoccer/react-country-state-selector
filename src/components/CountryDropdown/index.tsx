import { type ChangeEvent, type FC, useEffect, useMemo, useReducer, useState } from 'react';
import './CountryDropdown.css';
import { cultureFromBrowser } from '../../services/cultureFromBrowser';
import { getCountryInformationByCulture } from '../../services/getCountryInformation';
import { resolveCultureInfo } from '../../utils/cultureResolution';
import { renderGroupedOptions } from '../../utils/renderOptions';
import { generateUniqueId } from '../../utils/generateId';
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
  retryCount: number;
}

type CountryDropdownAction =
  | { type: 'SET_COUNTRY'; payload: Country }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COUNTRY_INFORMATION'; payload: CountryInformation[] }
  | { type: 'SET_LOADING_COUNTRY_INFORMATION'; payload: boolean }
  | { type: 'INCREMENT_RETRY_COUNT' }
  | { type: 'RESET_RETRY_COUNT' };

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
    case 'INCREMENT_RETRY_COUNT':
      return { ...state, retryCount: state.retryCount + 1 };
    case 'RESET_RETRY_COUNT':
      return { ...state, retryCount: 0 };
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
  loadingText = "Loading country information...",
  required = false
}) => {
  // Generate unique ID for this instance
  const uniqueId = useMemo(() => generateUniqueId('country'), []);
  const errorId = `${uniqueId}-error`;
  const datalistId = `${uniqueId}-datalist`;
  
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
    isLoadingCountryInformation: false,
    retryCount: 0
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
          dispatch({ type: 'RESET_RETRY_COUNT' });
        } catch (err: any) {
          dispatch({ type: 'INCREMENT_RETRY_COUNT' });
          if (process.env.NODE_ENV === 'development') {
            dispatch({ type: 'SET_ERROR', payload: `Error loading country information: ${err?.message}\n${err?.stack}` });
          } else {
            // Provide actionable error message with guidance
            const errorMessage = 'Unable to load country information. This might be due to a network issue or the data file being unavailable.';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
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

  const handleRetry = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_COUNTRY_INFORMATION', payload: [] });
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
      // No success feedback for partial/invalid input - user is likely still typing
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
    <div className="rcs-container">
      {state.error && <div id={errorId} className="rcs-error">{state.error}</div>}
      <label
        htmlFor={uniqueId}
        className={classNameLabel ?? 'rcs-label'}
      >
        {Label}
      </label>
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
          {state.retryCount < 3 && (
            <>
              {' '}
              <button 
                onClick={handleRetry}
                className="country-retry-button"
                aria-label="Retry loading country information"
              >
                Try Again
              </button>
            </>
          )}
          {state.retryCount >= 3 && (
            <div className="country-error-guidance">
              <strong>What you can do:</strong>
              <ul>
                <li>Check your internet connection</li>
                <li>Refresh the page</li>
                <li>Try again later</li>
              </ul>
            </div>
          )}
        </div>
      )}
      <label
        id="country-select-label"
        htmlFor="country-select"
        className={classNameLabel ?? 'country-dropdown-label'}
      >
        {Label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {state.isLoadingCountryInformation && showLoadingIndicator ? (
        <div className="rcs-loading" aria-live="polite">
          {customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading country information" />}
        </div>
      ) : enableSearch ? (
        <>
          <input
            id={uniqueId}
            list={datalistId}
            value={getSelectedCountryName()}
            onChange={handleSearchChange}
            aria-describedby={state.error ? errorId : undefined}
            className={`${classNameSelect ?? ''} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
            aria-labelledby="country-select-label"
            aria-required={required}
            aria-invalid={state.error ? true : undefined}
            placeholder="Search or select a country"
            autoComplete="off"
            required={required}
          />
          <datalist id={datalistId}>
            {state.countryInformation.map((country) => (
              <option key={country.code} value={country.name} data-value={country.code}>
                {country.name}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <VirtualSelect
          id={uniqueId}
          value={state.selectedCountry ?? ''}
          onChange={handleChange}
          options={virtualSelectOptions}
          placeholder="Select a country"
          aria-describedby={state.error ? errorId : undefined}
          className={`${classNameSelect ?? 'rcs-select'} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
          aria-labelledby="country-select-label"
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