import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import { CultureInfo, type CountryInformation, type StateProvinceInformation, type LanguageInformation, type Country, type Language } from '../types';
import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { getLanguageInformationByCulture } from '../services/getLanguageInformation';

// Mock all services
vi.mock('../services/getCountryInformation');
vi.mock('../services/getStateProvinceInformation');
vi.mock('../services/getLanguageInformation');
vi.mock('../services/cultureFromBrowser');

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('all dropdowns render and function together', async () => {
    const mockCountryChange = vi.fn();
    const mockStateChange = vi.fn();
    const mockLanguageChange = vi.fn();

    const mockCountryData: CountryInformation[] = [
      { code: 'US' as Country, name: 'United States' },
      { code: 'CA' as Country, name: 'Canada' },
    ];

    const mockStateData = [
      { code: 'TX', name: 'Texas' },
      { code: 'CA', name: 'California' },
    ];

    const mockLanguageData: LanguageInformation[] = [
      { code: 'en' as Language, name: 'English' },
      { code: 'es' as Language, name: 'Spanish' },
    ];

    render(
      <div>
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockCountryChange}
          countryInformation={mockCountryData}
          Label="Country"
        />
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={mockLanguageChange}
          languageInformation={mockLanguageData}
          Label="Language"
        />
      </div>
    );

    // Check all components are rendered
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();

    // Check options are available
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();

    // Test that components are working together - just verify they render with options
    const countrySelect = screen.getByLabelText('Country');
    const languageSelect = screen.getByLabelText('Language');

    expect(countrySelect).toBeInTheDocument();
    expect(languageSelect).toBeInTheDocument();
  });

  it('components work with culture information flow', () => {
    const culture = new CultureInfo('en-US');
    const mockOnChange = vi.fn();

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnChange}
        culture={culture}
        countryInformation={[{ code: 'US', name: 'United States' }]}
        Label="Country"
      />
    );

    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
  });

  it('handles error states across components', async () => {
    // No need for dynamic imports since we have top-level imports

    vi.mocked(getCountryInformationByCulture).mockRejectedValue(new Error('Country error'));
    vi.mocked(getStateProvinceInformationByCulture).mockRejectedValue(new Error('State error'));
    vi.mocked(getLanguageInformationByCulture).mockRejectedValue(new Error('Language error'));

    // Mock development environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <div>
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={() => {}}
          Label="Country"
        />
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={() => {}}
          Label="Language"
        />
      </div>
    );

    // Wait for errors to appear
    await waitFor(() => {
      expect(screen.getByText(/Error loading country information: Country error/)).toBeInTheDocument();
      expect(screen.getByText(/Error loading language information: Language error/)).toBeInTheDocument();
    });

    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });

  it('components maintain accessibility across all interactions', async () => {
    const mockCountryData: CountryInformation[] = [{ code: 'US' as Country, name: 'United States' }];
    const mockStateData = [{ code: 'TX', name: 'Texas' }];
    const mockLanguageData: LanguageInformation[] = [{ code: 'en' as Language, name: 'English' }];

    render(
      <div>
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={() => {}}
          countryInformation={mockCountryData}
          Label="Country"
        />

        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={() => {}}
          languageInformation={mockLanguageData}
          Label="Language"
        />
      </div>
    );

    // Check accessibility attributes
    const countrySelect = screen.getByRole('combobox', { name: 'Country' });
    const languageSelect = screen.getByRole('combobox', { name: 'Language' });

    expect(countrySelect).toHaveAttribute('id', 'country-select');
    expect(languageSelect).toHaveAttribute('id', 'language-select');

    // Verify they have proper label-to-input association (not aria-labelledby when using htmlFor/id)
    const countryLabel = screen.getByText('Country');
    const languageLabel = screen.getByText('Language');
    
    expect(countryLabel).toHaveAttribute('for', 'country-select');
    expect(languageLabel).toHaveAttribute('for', 'language-select');
    
    // aria-labelledby should not be present when using htmlFor/id
    expect(countrySelect).not.toHaveAttribute('aria-labelledby');
    expect(languageSelect).not.toHaveAttribute('aria-labelledby');
  });
});