import { type ChangeEvent, type FC, useEffect, useReducer } from 'react';
import { cultureFromBrowser } from '../../services/cultureFromBrowser';
import { Culture, CultureInfo, type Language, type LanguageDropdownProps, type LanguageInformation } from '../../types';
import { getLanguageInformationByCulture } from '../../services/getLanguageInformation';
import './LanguageDropdown.css';

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
  classNameSelect
}) => {
  const effectiveGetLanguageInformation = getLanguageInformation ?? getLanguageInformationByCulture;

  let initialCultureInfo: CultureInfo = cultureFromBrowser();
  if (culture instanceof CultureInfo) {
    initialCultureInfo = culture;
  } else if (typeof culture === 'string') {
    try {
      initialCultureInfo = new CultureInfo(culture as Culture);
    } catch {
      initialCultureInfo = cultureFromBrowser();
    }
  }

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

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_LANGUAGE', payload: e.target.value as Language });
    onLanguageChange(e.target.value as Language);
  };

  return (
    <>
  {state.error && <div className="language-error-message">{state.error}</div>}
      <label
        htmlFor="language-select"
        className={classNameLabel ?? undefined}
        aria-label={Label}
      >
        {Label}
      </label>
      {state.isLoadingLanguageInformation ? (
        <div>Loading language information...</div>
      ) : (
        <select
          id="language-select"
          value={state.selectedLanguage ?? ''}
          onChange={handleChange}
          className={classNameSelect ?? undefined}
          aria-labelledby={Label ? 'language-select-label' : undefined}
          aria-describedby={state.error ? 'language-error' : undefined}
        >
          <option value="">Select a language</option>
          {state.languageInformation.map((lang: LanguageInformation) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default LanguageDropdown;
