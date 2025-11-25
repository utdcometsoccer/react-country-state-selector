import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import { CultureInfo, type CountryInformation, type Country, type StateProvinceInformation, type LanguageInformation, type Language } from '../types';

const mockCountryInformation: CountryInformation[] = [
  { code: 'US' as Country, name: 'United States' },
  { code: 'CA' as Country, name: 'Canada' },
  { code: 'MX' as Country, name: 'Mexico' },
];

const mockStateInformation: StateProvinceInformation[] = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
];

const mockLanguageInformation: LanguageInformation[] = [
  { code: 'en' as Language, name: 'English' },
  { code: 'es' as Language, name: 'Spanish' },
  { code: 'fr' as Language, name: 'French' },
];

describe('Required Field Validation', () => {
  describe('CountryDropdown', () => {
    const mockOnCountryChange = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('displays asterisk for required field', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          required={true}
        />
      );
      
      const label = screen.getByText(/Country/);
      expect(label).toBeInTheDocument();
      expect(label.textContent).toContain('*');
    });

    it('does not display asterisk when not required', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          required={false}
        />
      );
      
      const label = screen.getByText('Country');
      expect(label).toBeInTheDocument();
      expect(label.textContent).not.toContain('*');
    });

    it('has aria-required attribute when required', async () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          required={true}
        />
      );
      
      await waitFor(() => {
        const combobox = screen.getByRole('combobox');
        expect(combobox).toHaveAttribute('aria-required', 'true');
      });
    });

    it('does not have aria-required when not required', async () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          required={false}
        />
      );
      
      await waitFor(() => {
        const combobox = screen.getByRole('combobox');
        expect(combobox).not.toHaveAttribute('aria-required');
      });
    });
  });

  describe('StateDropdown', () => {
    const mockOnStateChange = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('displays asterisk for required field', () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={mockOnStateChange}
          country="US" as Country
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          required={true}
        />
      );
      
      const label = screen.getByText(/State/);
      expect(label).toBeInTheDocument();
      expect(label.textContent).toContain('*');
    });

    it('does not display asterisk when not required', () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={mockOnStateChange}
          country="US" as Country
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          required={false}
        />
      );
      
      const label = screen.getByText('State');
      expect(label).toBeInTheDocument();
      expect(label.textContent).not.toContain('*');
    });

    it('has aria-required attribute when required', async () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={mockOnStateChange}
          country="US" as Country
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          required={true}
        />
      );
      
      await waitFor(() => {
        const combobox = screen.getByRole('combobox');
        expect(combobox).toHaveAttribute('aria-required', 'true');
      });
    });
  });

  describe('LanguageDropdown', () => {
    const mockOnLanguageChange = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('displays asterisk for required field', () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          required={true}
        />
      );
      
      const label = screen.getByText(/Language/);
      expect(label).toBeInTheDocument();
      expect(label.textContent).toContain('*');
    });

    it('does not display asterisk when not required', () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          required={false}
        />
      );
      
      const label = screen.getByText('Language');
      expect(label).toBeInTheDocument();
      expect(label.textContent).not.toContain('*');
    });

    it('has aria-required attribute when required', async () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          required={true}
        />
      );
      
      await waitFor(() => {
        const combobox = screen.getByRole('combobox');
        expect(combobox).toHaveAttribute('aria-required', 'true');
      });
    });
  });
});

describe('ARIA Accessibility Improvements', () => {
  describe('CountryDropdown', () => {
    const mockOnCountryChange = vi.fn();

    it('has proper label ID association', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );
      
      const label = document.querySelector('#country-select-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'country-select');
    });

    it('error message has role="alert" and aria-live="polite"', async () => {
      const getErrorCountryInfo = async () => {
        throw new Error('Test error');
      };

      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          getCountryInformation={getErrorCountryInfo}
          Label="Country"
        />
      );
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/Error loading country information/);
        expect(errorMessage).toHaveAttribute('role', 'alert');
        expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      }, { timeout: 3000 });
    });

    it('loading state has role="status" and aria-live="polite"', async () => {
      const slowCountryInfo = () => new Promise<CountryInformation[]>((resolve) => {
        setTimeout(() => resolve(mockCountryInformation), 100);
      });

      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnCountryChange}
          culture="en-US"
          getCountryInformation={slowCountryInfo}
          Label="Country"
        />
      );
      
      // The wrapper div has both role="status" and aria-live="polite"
      const statusElement = document.querySelector('[role="status"][aria-live="polite"]');
      expect(statusElement).toBeInTheDocument();
    });
  });

  describe('StateDropdown', () => {
    const mockOnStateChange = vi.fn();

    it('has proper label ID association', () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={mockOnStateChange}
          country="US" as Country
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
        />
      );
      
      const label = document.querySelector('#state-province-select-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'state-province-select');
    });
  });

  describe('LanguageDropdown', () => {
    const mockOnLanguageChange = vi.fn();

    it('has proper label ID association', () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
        />
      );
      
      const label = document.querySelector('#language-select-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'language-select');
    });
  });
});
