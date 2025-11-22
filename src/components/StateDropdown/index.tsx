import { type ChangeEvent, type FC, useEffect, useReducer } from 'react';
import './StateDropdown.css';
import { getStateProvinceInformationByCulture } from '../../services/getStateProvinceInformation';
import { CultureInfo, type StateDropdownProps, StateProvinceInformation } from '../../types';
import { resolveCultureInfo } from '../../utils/cultureResolution';
import { renderGroupedOptions } from '../../utils/renderOptions';
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
  enableSearch = false
}) => {
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
  }, [state.stateProvinceInformation.length, state.cultureInfo, country, state.retryCount]);

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_STATE', payload: value });
    onStateChange(value);
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
    } else {
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
    <div className="state-dropdown-container">
      {state.error && (
        <div 
          id="state-province-error" 
          className="state-error-message"
          role="alert"
          aria-live="polite"
        >
          <span>{state.error}</span>
          {state.retryCount < 3 && (
            <>
              {' '}
              <button 
                onClick={handleRetry}
                className="state-retry-button"
                aria-label="Retry loading state/province information"
              >
                Try Again
              </button>
            </>
          )}
          {state.retryCount >= 3 && (
            <div className="state-error-guidance">
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
        id="state-province-select-label"
        htmlFor="state-province-select"
        className={classNameLabel ?? 'state-dropdown-label'}
      >
        {Label}
      </label>
      {state.isLoadingStateProvinceInformation ? (
        customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading state or province information" />
      ) : enableSearch ? (
        <>
          <input
            id="state-province-select"
            list="state-province-datalist"
            value={getSelectedStateName()}
            onChange={handleSearchChange}
            className={classNameSelect ?? undefined}
            aria-labelledby="state-province-select-label"
            aria-describedby={state.error ? 'state-province-error' : undefined}
            aria-invalid={state.error ? 'true' : undefined}
            placeholder="Search or select a state/province"
            autoComplete="off"
          />
          <datalist id="state-province-datalist">
            {state.stateProvinceInformation.map((stateProvince) => (
              <option key={stateProvince.code} value={stateProvince.name} data-value={stateProvince.code}>
                {stateProvince.name}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <VirtualSelect
          id="state-province-select"
          value={state.selectedState ?? ''}
          onChange={handleChange}
          options={virtualSelectOptions}
          placeholder="Select a state/province"
          className={classNameSelect ?? undefined}
          aria-labelledby="state-province-select-label"
          aria-describedby={state.error ? 'state-province-error' : undefined}
          aria-invalid={state.error ? 'true' : undefined}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
        />
      )}
    </div>
  );
};

export default StateDropdown;