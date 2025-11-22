import { type ChangeEvent, type FC, useEffect, useReducer, useState } from 'react';
import { cultureFromBrowser } from '../../services/cultureFromBrowser';
import { CultureInfo, type Language, type LanguageDropdownProps, type LanguageInformation } from '../../types';
import { getLanguageInformationByCulture } from '../../services/getLanguageInformation';
import { resolveCultureInfo } from '../../utils/cultureResolution';
import { renderGroupedOptions } from '../../utils/renderOptions';
import './LanguageDropdown.css';
import LoadingIndicator from '../LoadingIndicator';
import VirtualSelect, { type VirtualSelectOption } from '../VirtualSelect';
import LoadingSpinner from '../LoadingSpinner';
import DropdownErrorBoundary from '../DropdownErrorBoundary';

interface LanguageDropdownState {
  selectedLanguage?: Language;
  culture?: CultureInfo | string;
  cultureInfo?: CultureInfo;
  languageInformation: LanguageInformation[];
  error?: string | null;
  isLoadingLanguageInformation: boolean;
  validationError?: string;
  retryCount: number;
}

type LanguageDropdownAction =
  | { type: 'SET_LANGUAGE'; payload?: Language }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LANGUAGE_INFORMATION'; payload: LanguageInformation[] }
  | { type: 'SET_LOADING_LANGUAGE_INFORMATION'; payload: boolean }
  | { type: 'SET_VALIDATION_ERROR'; payload?: string }
  | { type: 'INCREMENT_RETRY_COUNT' }
  | { type: 'RESET_RETRY_COUNT' };

function reducer(state: LanguageDropdownState, action: LanguageDropdownAction): LanguageDropdownState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, selectedLanguage: action.payload };
    case 'SET_CULTURE':
      return { ...state, culture: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LANGUAGE_INFORMATION':
      return { ...state, languageInformation: action.payload };
    case 'SET_LOADING_LANGUAGE_INFORMATION':
      return { ...state, isLoadingLanguageInformation: action.payload };
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


const LanguageDropdown: FC<LanguageDropdownProps> = ({
  selectedLanguage,
  onLanguageChange,
  culture,
  languageInformation,
  getLanguageInformation,
  Label,
  classNameLabel,
  classNameSelect,
  enableVirtualScrolling = true,
  virtualScrollThreshold = 50,
  enableSearch = false,
  showLoadingIndicator = true,
  customLoadingIndicator,
  loadingText = "Loading language information...",
  required = false,
  validate,
  onValidationError
}) => {
  const maxRetries = 3;
  const effectiveGetLanguageInformation = getLanguageInformation ?? getLanguageInformationByCulture;
  const initialCultureInfo: CultureInfo = resolveCultureInfo(culture);
  const initialLanguageInformation: LanguageInformation[] = languageInformation ?? [];

  const [state, dispatch] = useReducer(reducer, {
    selectedLanguage,
    culture,
    cultureInfo: initialCultureInfo,
    languageInformation: initialLanguageInformation,
    error: null,
    isLoadingLanguageInformation: false,
    retryCount: 0
  });

  useEffect(() => {
    if (state.languageInformation.length === 0 && !state.isLoadingLanguageInformation) {
      dispatch({ type: 'SET_LOADING_LANGUAGE_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetLanguageInformation(state.cultureInfo!);
          dispatch({ type: 'SET_LANGUAGE_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
        } catch (err: any) {
          if (process.env.NODE_ENV === 'development') {
            dispatch({ type: 'SET_ERROR', payload: `Error loading language information: ${err?.message}\n${err?.stack}` });
          } else {
            dispatch({ type: 'SET_ERROR', payload: 'Error loading language information. Please try again later.' });
          }
        } finally {
          dispatch({ type: 'SET_LOADING_LANGUAGE_INFORMATION', payload: false });
        }
      })();
    }
  }, [state.languageInformation.length, state.cultureInfo, effectiveGetLanguageInformation]);

  // Validation effect
  useEffect(() => {
    if (!state.selectedLanguage) {
      if (required) {
        const error = 'Language selection is required';
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
      const error = validate(state.selectedLanguage);
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: error });
      if (error && onValidationError) {
        onValidationError(error);
      }
    } else {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: undefined });
    }
  }, [state.selectedLanguage, required, validate, onValidationError]);

  const handleRetry = () => {
    if (state.retryCount < maxRetries) {
      dispatch({ type: 'INCREMENT_RETRY_COUNT' });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING_LANGUAGE_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetLanguageInformation(state.cultureInfo!);
          dispatch({ type: 'SET_LANGUAGE_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
          dispatch({ type: 'RESET_RETRY_COUNT' });
        } catch (err: any) {
          if (process.env.NODE_ENV === 'development') {
            dispatch({ type: 'SET_ERROR', payload: `Error loading language information: ${err?.message}\n${err?.stack}` });
          } else {
            dispatch({ type: 'SET_ERROR', payload: 'Error loading language information. Please try again later.' });
          }
        } finally {
          dispatch({ type: 'SET_LOADING_LANGUAGE_INFORMATION', payload: false });
        }
      })();
    }
  };

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: value as Language });
    onLanguageChange(value as Language);
  };

  // Convert language information to VirtualSelect options
  const virtualSelectOptions: VirtualSelectOption[] = state.languageInformation.map(language => ({
    value: language.code,
    label: language.name,
    group: language.group
  }));
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Find matching language by code or name
    const matchingLanguage = state.languageInformation.find(
      l => l.code === value || l.name === value
    );
    if (matchingLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: matchingLanguage.code });
      onLanguageChange(matchingLanguage.code);
    } else {
      dispatch({ type: 'SET_LANGUAGE', payload: value as Language });
      onLanguageChange(value as Language);
    }
  };

  // Get display name for selected language
  const getSelectedLanguageName = () => {
    if (!state.selectedLanguage) return '';
    const language = state.languageInformation.find(l => l.code === state.selectedLanguage);
    return language ? language.name : state.selectedLanguage;
  };

  return (
    <DropdownErrorBoundary>
      <div className="language-dropdown-container">
        {state.error && (
          <div id="language-error" className="language-error-message">
            {state.error}
            {state.retryCount < maxRetries && (
              <button 
                onClick={handleRetry}
                className="language-retry-button"
                aria-label="Retry loading language data"
              >
                Retry loading data
              </button>
            )}
          </div>
        )}
        {state.validationError && (
          <div id="language-validation-error" className="language-validation-error">
            {state.validationError}
          </div>
        )}
        <label
          htmlFor="language-select"
          className={classNameLabel ?? 'language-dropdown-label'}
        >
          {Label}{required && <span className="required-indicator" aria-label="required"> *</span>}
        </label>
      {state.isLoadingLanguageInformation ? (
        customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading language information" />
      ) : enableSearch ? (
        <>
          <input
            id="language-select"
            list="language-datalist"
            value={getSelectedLanguageName()}
            onChange={handleSearchChange}
            className={classNameSelect ?? undefined}
            aria-describedby={state.error ? 'language-error' : state.validationError ? 'language-validation-error' : undefined}
            aria-required={required}
            aria-invalid={!!state.validationError}
            placeholder="Search or select a language"
            autoComplete="off"
          />
          <datalist id="language-datalist">
            {state.languageInformation.map((language) => (
              <option key={language.code} value={language.name} data-value={language.code}>
                {language.name}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <VirtualSelect
          id="language-select"
          value={state.selectedLanguage ?? ''}
          onChange={handleChange}
          options={virtualSelectOptions}
          placeholder="Select a language"
          className={classNameSelect ?? 'language-dropdown-select'}
          aria-describedby={state.error ? 'language-error' : state.validationError ? 'language-validation-error' : undefined}
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

export default LanguageDropdown;
