import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import DropdownErrorBoundary from '../components/DropdownErrorBoundary';
import { CultureInfo, type CountryInformation, type Country, type StateProvinceInformation, type LanguageInformation, type Language } from '../types';
import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { getLanguageInformationByCulture } from '../services/getLanguageInformation';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

// Mock the services
vi.mock('../services/getCountryInformation');
vi.mock('../services/getStateProvinceInformation');
vi.mock('../services/getLanguageInformation');
vi.mock('../services/cultureFromBrowser');

const mockedGetCountryInformation = vi.mocked(getCountryInformationByCulture);
const mockedGetStateProvinceInformation = vi.mocked(getStateProvinceInformationByCulture);
const mockedGetLanguageInformation = vi.mocked(getLanguageInformationByCulture);
const mockedCultureFromBrowser = vi.mocked(cultureFromBrowser);

const mockCountryInformation: CountryInformation[] = [
  { code: 'US' as Country, name: 'United States' },
  { code: 'CA' as Country, name: 'Canada' },
];

const mockStateInformation: StateProvinceInformation[] = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
];

const mockLanguageInformation: LanguageInformation[] = [
  { code: 'en' as Language, name: 'English' },
  { code: 'es' as Language, name: 'Spanish' },
];

describe('Validation Props', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  describe('CountryDropdown Validation', () => {
    it('shows validation error when required field is empty', async () => {
      const mockOnValidationError = vi.fn();
      
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={() => {}}
          countryInformation={mockCountryInformation}
          required={true}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Country selection is required')).toBeInTheDocument();
      });
      
      expect(mockOnValidationError).toHaveBeenCalledWith('Country selection is required');
    });

    it('clears validation error when required field is filled', async () => {
      const mockOnCountryChange = vi.fn();
      const mockOnValidationError = vi.fn();
      
      const { rerender } = render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnCountryChange}
          countryInformation={mockCountryInformation}
          required={true}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Country selection is required')).toBeInTheDocument();
      });

      // Update with a selected country
      rerender(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          countryInformation={mockCountryInformation}
          required={true}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Country selection is required')).not.toBeInTheDocument();
      });
    });

    it('uses custom validation function', async () => {
      const mockValidate = vi.fn((value: string) => {
        return value === 'US' ? undefined : 'Only US is allowed';
      });
      const mockOnValidationError = vi.fn();

      render(
        <CountryDropdown
          selectedCountry="CA"
          onCountryChange={() => {}}
          countryInformation={mockCountryInformation}
          validate={mockValidate}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Only US is allowed')).toBeInTheDocument();
      });

      expect(mockValidate).toHaveBeenCalledWith('CA');
      expect(mockOnValidationError).toHaveBeenCalledWith('Only US is allowed');
    });

    it('displays required indicator with asterisk', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={() => {}}
          countryInformation={mockCountryInformation}
          Label="Country"
          required={true}
        />
      );

      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveAttribute('aria-label', 'required');
    });
  });

  describe('StateDropdown Validation', () => {
    it('shows validation error when required field is empty', async () => {
      const mockOnValidationError = vi.fn();
      
      render(
        <StateDropdown
          selectedState=""
          onStateChange={() => {}}
          country="US"
          stateProvinceInformation={mockStateInformation}
          required={true}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('State/Province selection is required')).toBeInTheDocument();
      });
      
      expect(mockOnValidationError).toHaveBeenCalledWith('State/Province selection is required');
    });

    it('uses custom validation function', async () => {
      const mockValidate = vi.fn((value: string) => {
        return value === 'CA' ? undefined : 'Only California is allowed';
      });
      const mockOnValidationError = vi.fn();

      render(
        <StateDropdown
          selectedState="TX"
          onStateChange={() => {}}
          country="US"
          stateProvinceInformation={mockStateInformation}
          validate={mockValidate}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Only California is allowed')).toBeInTheDocument();
      });

      expect(mockValidate).toHaveBeenCalledWith('TX');
      expect(mockOnValidationError).toHaveBeenCalledWith('Only California is allowed');
    });
  });

  describe('LanguageDropdown Validation', () => {
    it('shows validation error when required field is empty', async () => {
      const mockOnValidationError = vi.fn();
      
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={() => {}}
          languageInformation={mockLanguageInformation}
          required={true}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Language selection is required')).toBeInTheDocument();
      });
      
      expect(mockOnValidationError).toHaveBeenCalledWith('Language selection is required');
    });

    it('uses custom validation function', async () => {
      const mockValidate = vi.fn((value: string) => {
        return value === 'en' ? undefined : 'Only English is allowed';
      });
      const mockOnValidationError = vi.fn();

      render(
        <LanguageDropdown
          selectedLanguage={'es' as Language}
          onLanguageChange={() => {}}
          languageInformation={mockLanguageInformation}
          validate={mockValidate}
          onValidationError={mockOnValidationError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Only English is allowed')).toBeInTheDocument();
      });

      expect(mockValidate).toHaveBeenCalledWith('es');
      expect(mockOnValidationError).toHaveBeenCalledWith('Only English is allowed');
    });
  });
});

describe('Retry Mechanism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  it('shows retry button when CountryDropdown data loading fails', async () => {
    mockedGetCountryInformation.mockRejectedValue(new Error('Network error'));

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading country information/)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /Retry loading country data/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('retries loading data when retry button is clicked', async () => {
    let callCount = 0;
    mockedGetCountryInformation.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve(mockCountryInformation);
    });

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={() => {}}
      />
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Error loading country information/)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /Retry loading country data/i });
    fireEvent.click(retryButton);

    // Wait for successful retry
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByText(/Error loading country information/)).not.toBeInTheDocument();
    });

    expect(mockedGetCountryInformation).toHaveBeenCalledTimes(2);
  });

  it('hides retry button after max retries for CountryDropdown', async () => {
    mockedGetCountryInformation.mockRejectedValue(new Error('Network error'));

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={() => {}}
      />
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Error loading country information/)).toBeInTheDocument();
    });

    // Retry 3 times (max retries)
    for (let i = 0; i < 3; i++) {
      const retryButton = screen.getByRole('button', { name: /Retry loading country data/i });
      fireEvent.click(retryButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Error loading country information/)).toBeInTheDocument();
      });
    }

    // After max retries, button should not be visible
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Retry loading country data/i })).not.toBeInTheDocument();
    });
  });

  it('shows retry button when StateDropdown data loading fails', async () => {
    mockedGetStateProvinceInformation.mockRejectedValue(new Error('Network error'));

    render(
      <StateDropdown
        selectedState="CA"
        onStateChange={() => {}}
        country="US"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading state\/province information/)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /Retry loading state\/province data/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('shows retry button when LanguageDropdown data loading fails', async () => {
    mockedGetLanguageInformation.mockRejectedValue(new Error('Network error'));

    render(
      <LanguageDropdown
        selectedLanguage={'en' as Language}
        onLanguageChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading language information/)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /Retry loading language data/i });
    expect(retryButton).toBeInTheDocument();
  });
});

describe('Error Boundary', () => {
  // Component that throws an error
  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  it('catches errors and displays fallback UI', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();

    render(
      <DropdownErrorBoundary>
        <ThrowError shouldThrow={true} />
      </DropdownErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Restore console.error
    console.error = consoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <DropdownErrorBoundary>
        <ThrowError shouldThrow={false} />
      </DropdownErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('uses custom fallback when provided', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();

    const customFallback = <div>Custom error message</div>;

    render(
      <DropdownErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </DropdownErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    
    // Restore console.error
    console.error = consoleError;
  });

  it('calls onError callback when error occurs', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();

    const mockOnError = vi.fn();

    render(
      <DropdownErrorBoundary onError={mockOnError}>
        <ThrowError shouldThrow={true} />
      </DropdownErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(mockOnError.mock.calls[0][0].message).toBe('Test error');
    
    // Restore console.error
    console.error = consoleError;
  });

  it('displays error message in development mode', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <DropdownErrorBoundary>
        <ThrowError shouldThrow={true} />
      </DropdownErrorBoundary>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
    console.error = consoleError;
  });
});

describe('Accessibility with Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  it('sets aria-required on CountryDropdown when required', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={() => {}}
        countryInformation={mockCountryInformation}
        required={true}
      />
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-required', 'true');
  });

  it('sets aria-invalid when validation error exists', async () => {
    const mockOnValidationError = vi.fn();
    
    render(
      <CountryDropdown
        selectedCountry=""
        onCountryChange={() => {}}
        countryInformation={mockCountryInformation}
        required={true}
        onValidationError={mockOnValidationError}
      />
    );

    await waitFor(() => {
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('sets aria-describedby to validation error id', async () => {
    const mockOnValidationError = vi.fn();
    
    render(
      <CountryDropdown
        selectedCountry=""
        onCountryChange={() => {}}
        countryInformation={mockCountryInformation}
        required={true}
        onValidationError={mockOnValidationError}
      />
    );

    await waitFor(() => {
      const combobox = screen.getByRole('combobox');
      const ariaDescribedby = combobox.getAttribute('aria-describedby');
      // Verify aria-describedby is set and points to a validation error element
      expect(ariaDescribedby).toBeTruthy();
      expect(ariaDescribedby).toMatch(/-validation-error$/);
    });
  });
});
