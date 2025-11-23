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

interface LanguageDropdownState {
  selectedLanguage?: Language;
  culture?: CultureInfo | string;
  cultureInfo?: CultureInfo;
  languageInformation: LanguageInformation[];
  error?: string | null;
  isLoadingLanguageInformation: boolean;
}

type LanguageDropdownAction =
  | { type: 'SET_LANGUAGE'; payload?: Language }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LANGUAGE_INFORMATION'; payload: LanguageInformation[] }
  | { type: 'SET_LOADING_LANGUAGE_INFORMATION'; payload: boolean };

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
    default:
      return state;
  }
}


const LanguageDropdown: FC<LanguageDropdownProps> = ({
  selectedLanguage,
  onLanguageChange,
  onSuccess,
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
  loadingText = "Loading language information..."
}) => {
  const effectiveGetLanguageInformation = getLanguageInformation ?? getLanguageInformationByCulture;
  const initialCultureInfo: CultureInfo = resolveCultureInfo(culture);
  const initialLanguageInformation: LanguageInformation[] = languageInformation ?? [];

  const [state, dispatch] = useReducer(reducer, {
    selectedLanguage,
    culture,
    cultureInfo: initialCultureInfo,
    languageInformation: initialLanguageInformation,
    error: null,
    isLoadingLanguageInformation: false
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

  // Helper function to trigger success feedback
  const triggerSuccessFeedback = (code: Language, name: string) => {
    setSelectionFeedback(`${name} selected`);
    setShowSuccessAnimation(true);
    if (onSuccess) {
      onSuccess(code);
    }
  };

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: value as Language });
    onLanguageChange(value as Language);
    
    // Success feedback
    const language = state.languageInformation.find(l => l.code === value);
    const languageName = language ? language.name : value;
    triggerSuccessFeedback(value as Language, languageName);
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
      triggerSuccessFeedback(matchingLanguage.code, matchingLanguage.name);
    } else {
      // No success feedback for partial/invalid input - user is likely still typing
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
    <div className="language-dropdown-container">
      {/* Aria-live region for selection confirmation */}
      <div className="rcss-selection-feedback" role="status" aria-live="polite" aria-atomic="true">
        {selectionFeedback}
      </div>
      
      {state.error && (
        <div 
          id="language-error-message"
          className="language-error-message"
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
        htmlFor="language-select"
        className={classNameLabel ?? 'language-dropdown-label'}
      >
        {Label}
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
            className={`${classNameSelect ?? ''} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
            aria-describedby={state.error ? 'language-error-message' : undefined}
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
          className={`${classNameSelect ?? 'language-dropdown-select'} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
          aria-describedby={state.error ? 'language-error-message' : undefined}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
        />
      )}
    </div>
  );
};

export default LanguageDropdown;
