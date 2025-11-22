import { type ChangeEvent, type FC, useEffect, useReducer, useMemo } from 'react';
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
    isLoadingStateProvinceInformation: false
  });

  useEffect(() => {
    if (state.stateProvinceInformation.length === 0 && !state.isLoadingStateProvinceInformation) {
      dispatch({ type: 'SET_LOADING_STATE_PROVINCE_INFORMATION', payload: true });
      (async () => {
        try {
          const info = await effectiveGetStateProvinceInformation(state.cultureInfo!);
          dispatch({ type: 'SET_STATE_PROVINCE_INFORMATION', payload: info });
          dispatch({ type: 'SET_ERROR', payload: null });
        } catch (err: any) {
          if (process.env.NODE_ENV === 'development') {
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
    <div className="rcs-container">
      {state.error && <div id={errorId} className="rcs-error">{state.error}</div>}
      <label
        htmlFor={uniqueId}
        className={classNameLabel ?? 'rcs-label'}
      >
        {Label}
      </label>
      {state.isLoadingStateProvinceInformation ? (
        <div className="rcs-loading">
          {customLoadingIndicator || <LoadingIndicator message={loadingText} ariaLabel="Loading state or province information" />}
        </div>
      ) : enableSearch ? (
        <>
          <input
            id={uniqueId}
            list={datalistId}
            value={getSelectedStateName()}
            onChange={handleSearchChange}
            className={classNameSelect ?? 'rcs-select'}
            aria-describedby={state.error ? errorId : undefined}
            placeholder="Search or select a state/province"
            autoComplete="off"
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
          className={classNameSelect ?? 'rcs-select'}
          aria-describedby={state.error ? errorId : undefined}
          enableVirtualScrolling={enableVirtualScrolling}
          virtualScrollThreshold={virtualScrollThreshold}
        />
      )}
    </div>
  );
};

export default StateDropdown;