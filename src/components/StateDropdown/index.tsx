import { type ChangeEvent, type FC, useEffect, useReducer, useState, useRef } from 'react';
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
}

type StateDropdownAction =
  | { type: 'SET_STATE'; payload?: string }
  | { type: 'SET_CULTURE'; payload: CultureInfo | string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STATE_PROVINCE_INFORMATION'; payload: StateProvinceInformation[] }
  | { type: 'SET_LOADING_STATE_PROVINCE_INFORMATION'; payload: boolean };

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
    isLoadingStateProvinceInformation: false
  });

  const [selectionFeedback, setSelectionFeedback] = useState<string>('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.stateProvinceInformation.length === 0 && !state.isLoadingStateProvinceInformation) {
      dispatch({ type: 'SET_LOADING_STATE_PROVINCE_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetStateProvinceInformation(state.cultureInfo!);
          dispatch({ type: 'SET_STATE_PROVINCE_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
        } catch (err: any) {
          if (process.env.NODE_ENV === 'Development') {
            dispatch({ type: 'SET_ERROR', payload: `Error loading state/province information: ${err?.message}\n${err?.stack}` });
          } else {
            dispatch({ type: 'SET_ERROR', payload: 'Error loading state/province information. Please try again later.' });
          }
        } finally {
          dispatch({ type: 'SET_LOADING_STATE_PROVINCE_INFORMATION', payload: false });
        }
      })();
    }
  }, [state.stateProvinceInformation.length, state.cultureInfo, country]);

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_STATE', payload: value });
    onStateChange(value);
    
    // Success feedback
    const stateProvince = state.stateProvinceInformation.find(s => s.code === value);
    const stateName = stateProvince ? stateProvince.name : value;
    setSelectionFeedback(`${stateName} selected`);
    
    // Trigger success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 600);
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess(value);
    }
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
      
      // Success feedback
      setSelectionFeedback(`${matchingState.name} selected`);
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 600);
      
      if (onSuccess) {
        onSuccess(matchingState.code);
      }
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
    <div className="state-dropdown-container" ref={selectRef}>
      {/* Aria-live region for selection confirmation */}
      <div className="rcss-selection-feedback" role="status" aria-live="polite" aria-atomic="true">
        {selectionFeedback}
      </div>
      
      {state.error && (
        <div 
          id="state-province-error-message"
          className="state-error-message"
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
            className={`${classNameSelect ?? ''} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
            aria-describedby={state.error ? 'state-province-error-message' : undefined}
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
          className={`${classNameSelect ?? ''} ${showSuccessAnimation ? 'rcss-success-animation' : ''}`.trim()}
          aria-describedby={state.error ? 'state-province-error-message' : undefined}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
        />
      )}
    </div>
  );
};

export default StateDropdown;