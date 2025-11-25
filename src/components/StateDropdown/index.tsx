import { type ChangeEvent, type FC, useEffect, useReducer, useMemo, useState } from 'react';
import './StateDropdown.css';
import { getStateProvinceInformationByCulture } from '../../services/getStateProvinceInformation';
import { CultureInfo, type StateDropdownProps, StateProvinceInformation } from '../../types';
import { resolveCultureInfo } from '../../utils/cultureResolution';
import { renderGroupedOptions } from '../../utils/renderOptions';
import { generateUniqueId } from '../../utils/generateId';
import LoadingIndicator from '../LoadingIndicator';
import LoadingSpinner from '../LoadingSpinner';
import VirtualSelect, { type VirtualSelectOption } from '../VirtualSelect';

interface StateDropdownState {
  selectedState?: string;
  culture?: CultureInfo | string;
  cultureInfo?: CultureInfo;
  stateProvinceInformation: StateProvinceInformation[];
  error?: string | null;
  isLoadingStateProvinceInformation: boolean;
  retryCount: number;
}

type StateDropdownAction =
  | { type: 'SET_STATE'; payload?: string }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STATE_PROVINCE_INFORMATION'; payload: StateProvinceInformation[] }
  | { type: 'SET_LOADING_STATE_PROVINCE_INFORMATION'; payload: boolean }
  | { type: 'INCREMENT_RETRY_COUNT' }
  | { type: 'RESET_RETRY_COUNT' };

function reducer(state: StateDropdownState, action: StateDropdownAction): StateDropdownState {
  switch (action.type) {
    case 'SET_STATE': {
      return { ...state, selectedState: action.payload };
    }
    case 'SET_CULTURE':
      return { ...state, culture: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_STATE_PROVINCE_INFORMATION':
      return { ...state, stateProvinceInformation: action.payload };
    case 'SET_LOADING_STATE_PROVINCE_INFORMATION':
      return { ...state, isLoadingStateProvinceInformation: action.payload };
    case 'INCREMENT_RETRY_COUNT':
      return { ...state, retryCount: state.retryCount + 1 };
    case 'RESET_RETRY_COUNT':
      return { ...state, retryCount: 0 };
    default:
      return state;
  }
}

const StateDropdown: FC<StateDropdownProps> = ({
  getStateProvinceInformation,
  stateProvinceInformation, selectedState,
  onStateChange,
  onSuccess,
  country,
  culture,
  Label,
  classNameLabel,
  classNameSelect,
  enableVirtualScrolling = true,
  virtualScrollThreshold = 50,
  showLoadingIndicator = true,
  customLoadingIndicator,
  loadingText = "Loading state/province information...",
  enableSearch = false,
  required = false
}) => {
  // Generate unique ID for this instance
  const uniqueId = useMemo(() => generateUniqueId('state'), []);
  const errorId = `${uniqueId}-error`;
  const datalistId = `${uniqueId}-datalist`;
  
  const effectiveGetStateProvinceInformation = getStateProvinceInformation || getStateProvinceInformationByCulture;
  const initialCultureInfo: CultureInfo = resolveCultureInfo(culture);
  const initialStateProvinceInformation: StateProvinceInformation[] = stateProvinceInformation ?? [];

  const [state, dispatch] = useReducer(reducer, {
    selectedState,
    culture,
    cultureInfo: initialCultureInfo,
    stateProvinceInformation: initialStateProvinceInformation,
    error: null,
    isLoadingStateProvinceInformation: false,
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
    if (state.stateProvinceInformation.length === 0 && !state.isLoadingStateProvinceInformation) {
      dispatch({ type: 'SET_LOADING_STATE_PROVINCE_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetStateProvinceInformation(state.cultureInfo!);
          dispatch({ type: 'SET_STATE_PROVINCE_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
          dispatch({ type: 'RESET_RETRY_COUNT' });
        } catch (err: any) {
          dispatch({ type: 'INCREMENT_RETRY_COUNT' });
          if (process.env.NODE_ENV === 'development') {
            dispatch({ type: 'SET_ERROR', payload: `Error loading state/province information: ${err?.message}\n${err?.stack}` });
          } else {
            // Provide actionable error message with guidance
            const errorMessage = 'Unable to load state/province information. This might be due to a network issue or the data file being unavailable.';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
          }
        } finally {
          dispatch({ type: 'SET_LOADING_STATE_PROVINCE_INFORMATION', payload: false });
        }
      })();
    }
  }, [state.stateProvinceInformation.length, state.cultureInfo, country]);

  // Helper function to trigger success feedback
  const triggerSuccessFeedback = (code: string, name: string) => {
    setSelectionFeedback(`${name} selected`);
    setShowSuccessAnimation(true);
    if (onSuccess) {
      onSuccess(code);
    }
  };

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_STATE', payload: value });
    onStateChange(value);
    
    // Success feedback
    const stateProvince = state.stateProvinceInformation.find(s => s.code === value);
    const stateName = stateProvince ? stateProvince.name : value;
    triggerSuccessFeedback(value, stateName);
  };

  const handleRetry = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_STATE_PROVINCE_INFORMATION', payload: [] });
  };

  // Convert state/province information to VirtualSelect options
  const virtualSelectOptions: VirtualSelectOption[] = state.stateProvinceInformation.map(stateProvince => ({
    value: stateProvince.code,
    label: stateProvince.name,
    group: stateProvince.group
  }));
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Find matching state by code or name
    const matchingState = state.stateProvinceInformation.find(
      s => s.code === value || s.name === value
    );
    if (matchingState) {
      dispatch({ type: 'SET_STATE', payload: matchingState.code });
      onStateChange(matchingState.code);
      triggerSuccessFeedback(matchingState.code, matchingState.name);
    } else {
      // No success feedback for partial/invalid input - user is likely still typing
      dispatch({ type: 'SET_STATE', payload: value });
      onStateChange(value);
    }
  };

  // Get display name for selected state
  const getSelectedStateName = () => {
    if (!state.selectedState) return '';
    const stateProvince = state.stateProvinceInformation.find(s => s.code === state.selectedState);
    return stateProvince ? stateProvince.name : state.selectedState;
  };

  return (
    <div className="rcs-container">
      {/* Aria-live region for selection confirmation */}
      <div className="rcs-selection-feedback" role="status" aria-live="polite" aria-atomic="true">
        {selectionFeedback}
      </div>
      
      {state.error && (
        <div 
          id={errorId}
          className="rcs-error"
          role="alert"
          aria-live="polite"
        >
          <span className="rcs-error-icon" aria-hidden="true">
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
                className="rcs-retry-button"
                aria-label="Retry loading state/province information"
              >
                Try Again
              </button>
            </>
          )}
          {state.retryCount >= 3 && (
            <div className="rcs-error-guidance">
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
        htmlFor={uniqueId}
        className={classNameLabel ?? 'rcs-label'}
      >
        {Label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {state.isLoadingStateProvinceInformation ? (
        <div className="rcs-loading" role="status" aria-live="polite">
          {customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading state or province information" />}
        </div>
      ) : enableSearch ? (
        <>
          <input
            id={uniqueId}
            list={datalistId}
            value={getSelectedStateName()}
            onChange={handleSearchChange}
            className={`${classNameSelect ?? 'rcs-select'} ${showSuccessAnimation ? 'rcs-success-animation' : ''}`.trim()}
            aria-describedby={state.error ? errorId : undefined}
            aria-required={required}
            aria-invalid={state.error ? true : undefined}
            placeholder="Search or select a state/province"
            autoComplete="off"
            required={required}
          />
          <datalist id={datalistId}>
            {state.stateProvinceInformation.map((stateProvince) => (
              <option key={stateProvince.code} value={stateProvince.name} data-value={stateProvince.code}>
                {stateProvince.name}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <VirtualSelect
          id={uniqueId}
          value={state.selectedState ?? ''}
          onChange={handleChange}
          options={virtualSelectOptions}
          placeholder="Select a state/province"
          className={`${classNameSelect ?? 'rcs-select'} ${showSuccessAnimation ? 'rcs-success-animation' : ''}`.trim()}
          aria-describedby={state.error ? errorId : undefined}
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

export default StateDropdown;