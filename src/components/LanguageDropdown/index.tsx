import { type ChangeEvent, type FC, useEffect, useReducer } from 'react';
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
  required = false
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
    <div className="language-dropdown-container">
      {state.error && (
        <div 
          id="language-error-message" 
          className="language-error-message"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </div>
      )}
      <label
        id="language-select-label"
        htmlFor="language-select"
        className={classNameLabel ?? 'language-dropdown-label'}
      >
        {Label}{required && <span aria-label="required"> *</span>}
      </label>
      {state.isLoadingLanguageInformation ? (
        <div role="status" aria-live="polite">
          {customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading language information" />}
        </div>
      ) : enableSearch ? (
        <>
          <input
            id="language-select"
            list="language-datalist"
            value={getSelectedLanguageName()}
            onChange={handleSearchChange}
            className={classNameSelect ?? undefined}
            aria-labelledby="language-select-label"
            aria-describedby={state.error ? 'language-error-message' : undefined}
            aria-required={required}
            aria-invalid={state.error ? true : undefined}
            placeholder="Search or select a language"
            autoComplete="off"
            required={required}
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
          aria-labelledby="language-select-label"
          aria-describedby={state.error ? 'language-error-message' : undefined}
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

export default LanguageDropdown;
