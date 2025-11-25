import { type ChangeEvent, type FC, useEffect, useReducer, useState } from 'react';
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
import DropdownErrorBoundary from '../DropdownErrorBoundary';

interface CountryDropdownState {
  selectedCountry: Country;
  culture?: CultureInfo | string;
  cultureInfo?: CultureInfo;
  countryInformation: CountryInformation[];
  error?: string | null;
  isLoadingCountryInformation: boolean;
  validationError?: string;
  retryCount: number;
}

type CountryDropdownAction =
  | { type: 'SET_COUNTRY'; payload: Country }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COUNTRY_INFORMATION'; payload: CountryInformation[] }
  | { type: 'SET_LOADING_COUNTRY_INFORMATION'; payload: boolean }
  | { type: 'SET_VALIDATION_ERROR'; payload?: string }
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
    case 'SET_VALIDATION_ERROR':
      return { ...state, validationError: action.payload };
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
  required = false,
  validate,
  onValidationError
}) => {
  const maxRetries = 3;
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
    validationError: undefined,
    retryCount: 0
  });

  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  // Separate state for search input text when enableSearch is true
  const [searchText, setSearchText] = useState('');
  
  const uniqueId = generateUniqueId('country-dropdown');

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

  // Sync selected country from props to state
  useEffect(() => {
    // When search is enabled, only sync if prop has a value (to allow controlled preselection)
    // When search is disabled, always sync prop to state
    if (enableSearch) {
      if (selectedCountry && selectedCountry !== state.selectedCountry) {
        dispatch({ type: 'SET_COUNTRY', payload: selectedCountry as Country });
        setSearchText('');
      }
    } else {
      if (selectedCountry !== state.selectedCountry) {
        dispatch({ type: 'SET_COUNTRY', payload: selectedCountry as Country });
      }
    }
  }, [selectedCountry, enableSearch]);

  // Validation effect
  useEffect(() => {
    if (!state.selectedCountry) {
      if (required) {
        const error = 'Country selection is required';
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: error });
        if (onValidationError) {
          onValidationError(error);
        }
      } else {
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: undefined });
      }
      return;
    }

    if (validate) {
      const error = validate(state.selectedCountry);
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: error });
      if (error && onValidationError) {
        onValidationError(error);
      }
    } else {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: undefined });
    }
  }, [state.selectedCountry, required, validate, onValidationError]);

  const handleRetry = () => {
    if (state.retryCount < maxRetries) {
      dispatch({ type: 'INCREMENT_RETRY_COUNT' });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING_COUNTRY_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetCountryInformation(state.cultureInfo!);
          dispatch({ type: 'SET_COUNTRY_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
          dispatch({ type: 'RESET_RETRY_COUNT' });
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
  };

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_COUNTRY', payload: value as Country });
    onCountryChange(value);
    
    // Show success feedback and trigger callback
    if (onSuccess && value) {
      setShowSuccessFeedback(true);
      onSuccess(value);
      // Hide success feedback after 2 seconds
      setTimeout(() => setShowSuccessFeedback(false), 2000);
    }
  };

  // Convert country information to VirtualSelect options
  const virtualSelectOptions: VirtualSelectOption[] = state.countryInformation.map(country => ({
    value: country.code,
    label: country.name,
    group: country.group
  }));
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update search text for display
    setSearchText(value);
    
    // Find matching country by code or name
    const matchingCountry = state.countryInformation.find(
      c => c.code === value || c.name === value
    );
    if (matchingCountry) {
      dispatch({ type: 'SET_COUNTRY', payload: matchingCountry.code });
      onCountryChange(matchingCountry.code);
      // Clear search text to show the actual country name
      setSearchText('');
    }
    // Don't update selected country for partial matches - only when exact match is found
  };

  // Get display value for the search input
  const getSearchInputValue = () => {
    // If there's search text being typed, show it
    if (searchText) {
      return searchText;
    }
    // Otherwise, show the selected country name (or empty if none)
    if (!state.selectedCountry) return '';
    const country = state.countryInformation.find(c => c.code === state.selectedCountry);
    return country ? country.name : state.selectedCountry;
  };

  // Get display name for selected country
  const getSelectedCountryName = () => {
    if (!state.selectedCountry) return '';
    const country = state.countryInformation.find(c => c.code === state.selectedCountry);
    return country ? country.name : state.selectedCountry;
  };

  return (
    <DropdownErrorBoundary>
      <div className="rcs-country-dropdown-container">
        {state.error && (
          <div className="rcs-country-error-container">
            <div id={`${uniqueId}-error`} className="rcs-country-error-message" role="alert">
              {state.error}
            </div>
            {state.retryCount < maxRetries && (
              <button 
                onClick={handleRetry}
                className="rcs-country-retry-button"
                aria-label="Retry loading country data"
              >
                Retry loading data
              </button>
            )}
          </div>
        )}
        {state.validationError && (
          <div id={`${uniqueId}-validation-error`} className="rcs-country-validation-error">
            {state.validationError}
          </div>
        )}
        {showSuccessFeedback && (
          <div className="rcs-country-success-feedback">
            ✓ Country selected successfully!
          </div>
        )}
        <label
          htmlFor={uniqueId}
          className={classNameLabel ?? 'rcs-country-dropdown-label'}
        >
          {Label}{required && <span className="rcs-required-indicator" aria-label="required"> *</span>}
        </label>
      {state.isLoadingCountryInformation && showLoadingIndicator ? (
        customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading country information" />
      ) : enableSearch ? (
        <>
          <input
            id={uniqueId}
            list={`${uniqueId}-datalist`}
            value={getSearchInputValue()}
            onChange={handleSearchChange}
            className={classNameSelect ?? undefined}
            aria-describedby={state.error ? `${uniqueId}-error` : state.validationError ? `${uniqueId}-validation-error` : undefined}
            aria-required={required}
            aria-invalid={!!state.validationError}
            placeholder="Search or select a country"
            autoComplete="off"
          />
          <datalist id={`${uniqueId}-datalist`}>
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
          className={classNameSelect ?? 'rcs-country-dropdown-select'}
          aria-describedby={state.error ? `${uniqueId}-error` : state.validationError ? `${uniqueId}-validation-error` : undefined}
          aria-required={required}
          aria-invalid={!!state.validationError}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
        />
      )}
      </div>
    </DropdownErrorBoundary>
  );
};

export default CountryDropdown;

// Removed ImportMeta global declaration since 'import.meta.env' is no longer used.