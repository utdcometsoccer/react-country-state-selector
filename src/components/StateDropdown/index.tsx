import { type ChangeEvent, type FC, useEffect, useReducer } from 'react';
import { cultureFromBrowser } from '../../services/cultureFromBrowser';
import { getStateProvinceInformationByCulture } from '../../services/getStateProvinceInformation';
import { CultureInfo, type StateDropdownProps, StateProvinceInformation, Country } from '../../types';

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

const StateDropdown: FC<StateDropdownProps> = ({ getStateProvinceInformation, selectedState, onStateChange, country, culture, Label, classNameLabel, classNameSelect }) => {
  const effectiveGetStateProvinceInformation = getStateProvinceInformation || getStateProvinceInformationByCulture;
  let initialCultureInfo: CultureInfo = cultureFromBrowser();
  if (culture instanceof CultureInfo) {
    initialCultureInfo = culture;
  } else if (typeof culture !== 'undefined') {
    try {
      initialCultureInfo = new CultureInfo(culture);
    } catch {
      if (typeof country !== 'undefined') {
        initialCultureInfo = new CultureInfo(`en-${country}`);
      } 
    }
  } else if (typeof country !== 'undefined') {
    initialCultureInfo = new CultureInfo(`en-${country}`);
  }

  const [state, dispatch] = useReducer(reducer, {
    selectedState,
    culture,
    cultureInfo: initialCultureInfo,
    stateProvinceInformation: [],
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

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_STATE', payload: e.target.value });
    onStateChange(e.target.value);
  };

  return (
    <>
      {state.error && <div style={{ color: 'red' }}>{state.error}</div>}
      <label
        htmlFor="state-province-select"
        className={classNameLabel ?? undefined}
        aria-label={Label}
      >
        {Label}
      </label>
      {state.isLoadingStateProvinceInformation ? (
        <div>Loading state/province information...</div>
      ) : (
        <select
          id="state-province-select"
          value={state.selectedState ?? ''}
          onChange={handleChange}
          className={classNameSelect ?? undefined}
          aria-labelledby={Label ? 'state-province-select-label' : undefined}
          aria-describedby={state.error ? 'state-province-error' : undefined}
        >
          <option value="">Select a state/province</option>
          {state.stateProvinceInformation.map((sp: StateProvinceInformation) => (
            <option key={sp.code} value={sp.code}>
              {sp.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default StateDropdown;