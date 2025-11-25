import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import LoadingIndicator from '../components/LoadingIndicator';
import CountryDropdown from '../components/CountryDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import StateDropdown from '../components/StateDropdown';
import { cultureFromBrowser } from '../services/cultureFromBrowser';
import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { getLanguageInformationByCulture } from '../services/getLanguageInformation';
import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { 
  Country, 
  CountryInformation, 
  StateProvinceInformation, 
  LanguageInformation, 
  Language, 
  CultureInfo 
} from '../types';

describe('LoadingIndicator', () => {
  it('renders with default message', () => {
    render(<LoadingIndicator />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingIndicator message="Loading country information..." />);
    
    expect(screen.getByText('Loading country information...')).toBeInTheDocument();
  });

  it('has proper ARIA label for accessibility', () => {
    render(<LoadingIndicator ariaLabel="Loading content" />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading content');
  });

  it('has custom ARIA label when provided', () => {
    render(<LoadingIndicator ariaLabel="Loading language information" />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading language information');
  });

  it('renders spinner with aria-hidden', () => {
    const { container } = render(<LoadingIndicator />);
    
    const spinner = container.querySelector('.rcss-loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<LoadingIndicator />);
    
    expect(container.querySelector('.rcss-loading-container')).toBeInTheDocument();
    expect(container.querySelector('.rcss-loading-spinner')).toBeInTheDocument();
    expect(container.querySelector('.rcss-spinner-ring')).toBeInTheDocument();
    expect(container.querySelector('.rcss-loading-message')).toBeInTheDocument();
  });

  it('message is visible to screen readers', () => {
    render(<LoadingIndicator message="Custom loading message" />);
    
    const message = screen.getByText('Custom loading message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('rcss-loading-message');
  });

  it('uses default aria-label when not provided', () => {
    render(<LoadingIndicator />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading content');
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    render(<LoadingIndicator />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
  });

  it('has aria-busy="true" to indicate loading state', () => {
    render(<LoadingIndicator />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-busy', 'true');
  });

  it('announces loading state changes to screen readers', () => {
    const { rerender } = render(<LoadingIndicator message="Loading countries..." />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
    expect(statusElement).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading countries...')).toBeInTheDocument();

    // Test that the component can be updated with a new message
    rerender(<LoadingIndicator message="Loading complete" />);
    expect(screen.getByText('Loading complete')).toBeInTheDocument();
  });
});

// Mock the services
vi.mock('../services/getCountryInformation');
vi.mock('../services/getStateProvinceInformation');
vi.mock('../services/getLanguageInformation');
vi.mock('@/services/cultureFromBrowser');

const mockedGetCountryInformation = vi.mocked(getCountryInformationByCulture);
const mockedGetStateProvinceInformation = vi.mocked(getStateProvinceInformationByCulture);
const mockedGetLanguageInformation = vi.mocked(getLanguageInformationByCulture);
const mockedCultureFromBrowser = vi.mocked(cultureFromBrowser);

const mockCountryInformation: CountryInformation[] = [
  { code: 'US' as Country, name: 'United States' },
];

const mockStateInformation: StateProvinceInformation[] = [
  { code: 'CA', name: 'California' },
];

const mockLanguageInformation: LanguageInformation[] = [
  { code: 'en' as Language, name: 'English' },
];

describe('Loading Indicator Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  describe('CountryDropdown Loading Indicator', () => {
    it('displays default loading spinner when data is loading', async () => {
      mockedGetCountryInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCountryInformation), 100))
      );

      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
        />
      );

      // Check that loading spinner appears
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Loading country information...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('does not display loading indicator when showLoadingIndicator is false', async () => {
      mockedGetCountryInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCountryInformation), 100))
      );

      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          showLoadingIndicator={false}
        />
      );

      // Check that loading spinner does not appear
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('displays custom loading indicator when provided', async () => {
      mockedGetCountryInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCountryInformation), 100))
      );

      const CustomLoader = () => <div data-testid="custom-loader">Custom Loading...</div>;

      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          customLoadingIndicator={<CustomLoader />}
        />
      );

      // Check that custom loader appears
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('displays custom loading text', async () => {
      mockedGetCountryInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCountryInformation), 100))
      );

      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          loadingText="Please wait, fetching countries..."
        />
      );

      // Check that custom text appears
      expect(screen.getByText('Please wait, fetching countries...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('does not show loading indicator when data is already provided', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
        />
      );

      // Check that loading spinner does not appear
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
      
      // Check that select is immediately available
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('StateDropdown Loading Indicator', () => {
    it('displays default loading spinner when data is loading', async () => {
      mockedGetStateProvinceInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockStateInformation), 100))
      );

      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
        />
      );

      // Check that loading spinner appears
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Loading state/province information...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('does not display loading indicator when showLoadingIndicator is false', async () => {
      mockedGetStateProvinceInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockStateInformation), 100))
      );

      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          showLoadingIndicator={false}
        />
      );

      // Check that loading spinner does not appear
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('displays custom loading indicator when provided', async () => {
      mockedGetStateProvinceInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockStateInformation), 100))
      );

      const CustomLoader = () => <div data-testid="custom-loader">Loading states...</div>;

      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          customLoadingIndicator={<CustomLoader />}
        />
      );

      // Check that custom loader appears
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });
  });

  describe('LanguageDropdown Loading Indicator', () => {
    it('displays default loading spinner when data is loading', async () => {
      mockedGetLanguageInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockLanguageInformation), 100))
      );

      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
        />
      );

      // Check that loading spinner appears
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Loading language information...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('does not display loading indicator when showLoadingIndicator is false', async () => {
      mockedGetLanguageInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockLanguageInformation), 100))
      );

      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
          showLoadingIndicator={false}
        />
      );

      // Check that loading spinner does not appear
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('displays custom loading text', async () => {
      mockedGetLanguageInformation.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockLanguageInformation), 100))
      );

      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
          loadingText="Fetching available languages..."
        />
      );

      // Check that custom text appears
      expect(screen.getByText('Fetching available languages...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });
  });
});
  