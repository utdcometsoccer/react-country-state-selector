import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import { CultureInfo, type CountryInformation, type StateProvinceInformation, type LanguageInformation, type Country, type Language } from '../types';
import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { getLanguageInformationByCulture } from '../services/getLanguageInformation';
import { cultureFromBrowser } from '../services/cultureFromBrowser';
import React from 'react';

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
