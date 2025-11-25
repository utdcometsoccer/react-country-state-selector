import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import { CultureInfo, type CountryInformation, type StateProvinceInformation, type LanguageInformation } from '../types';
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
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
];

const mockStateInformation: StateProvinceInformation[] = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
];

const mockLanguageInformation: LanguageInformation[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
];

describe('Visual Hierarchy - Typography and Spacing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
    mockedGetCountryInformation.mockResolvedValue(mockCountryInformation);
    mockedGetStateProvinceInformation.mockResolvedValue(mockStateInformation);
    mockedGetLanguageInformation.mockResolvedValue(mockLanguageInformation);
  });

  describe('CountryDropdown', () => {
    it('applies default container class for spacing', () => {
      const { container } = render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );
      
      const containerDiv = container.querySelector('.rcs-container');
      expect(containerDiv).toBeInTheDocument();
    });

    it('applies default label class for typography', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );
      
      const label = screen.getByText('Country');
      expect(label).toHaveClass('rcs-label');
    });

    it('applies default select class for spacing', () => {
      const { container } = render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );
      
      const selectContainer = container.querySelector('.virtual-select-container');
      expect(selectContainer).toHaveClass('rcs-select');
    });

    it('allows custom label class to override default', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          classNameLabel="custom-label-class"
        />
      );
      
      const label = screen.getByText('Country');
      expect(label).toHaveClass('custom-label-class');
      expect(label).not.toHaveClass('rcs-label');
    });

    it('allows custom select class to override default', () => {
      const { container } = render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          classNameSelect="custom-select-class"
        />
      );
      
      const selectContainer = container.querySelector('.virtual-select-container');
      expect(selectContainer).toHaveClass('custom-select-class');
      expect(selectContainer).not.toHaveClass('rcs-select');
    });
  });

  describe('StateDropdown', () => {
    it('applies default container class for spacing', async () => {
      const { container } = render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          Label="State"
        />
      );
      
      const containerDiv = container.querySelector('.rcs-container');
      expect(containerDiv).toBeInTheDocument();
    });

    it('applies default label class for typography', async () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          Label="State"
        />
      );
      
      const label = screen.getByText('State');
      expect(label).toHaveClass('rcs-label');
    });

    it('applies default select class for spacing', async () => {
      const { container } = render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          Label="State"
        />
      );
      
      await waitFor(() => {
        const selectContainer = container.querySelector('.virtual-select-container');
        expect(selectContainer).toHaveClass('rcs-select');
      });
    });

    it('allows custom label class to override default', async () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          Label="State"
          classNameLabel="custom-state-label"
        />
      );
      
      const label = screen.getByText('State');
      expect(label).toHaveClass('custom-state-label');
      expect(label).not.toHaveClass('rcs-label');
    });

    it('allows custom select class to override default', async () => {
      const { container } = render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          Label="State"
          classNameSelect="custom-state-select"
        />
      );
      
      await waitFor(() => {
        const selectContainer = container.querySelector('.virtual-select-container');
        expect(selectContainer).toHaveClass('custom-state-select');
        expect(selectContainer).not.toHaveClass('rcs-select');
      });
    });
  });

  describe('LanguageDropdown', () => {
    it('applies default container class for spacing', () => {
      const { container } = render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
        />
      );
      
      const containerDiv = container.querySelector('.rcs-container');
      expect(containerDiv).toBeInTheDocument();
    });

    it('applies default label class for typography', () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
        />
      );
      
      const label = screen.getByText('Language');
      expect(label).toHaveClass('rcs-label');
    });

    it('applies default select class for spacing', () => {
      const { container } = render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
        />
      );
      
      const selectContainer = container.querySelector('.virtual-select-container');
      expect(selectContainer).toHaveClass('rcs-select');
    });

    it('allows custom label class to override default', () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          classNameLabel="custom-lang-label"
        />
      );
      
      const label = screen.getByText('Language');
      expect(label).toHaveClass('custom-lang-label');
      expect(label).not.toHaveClass('rcs-label');
    });

    it('allows custom select class to override default', () => {
      const { container } = render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          classNameSelect="custom-lang-select"
        />
      );
      
      const selectContainer = container.querySelector('.virtual-select-container');
      expect(selectContainer).toHaveClass('custom-lang-select');
      expect(selectContainer).not.toHaveClass('rcs-select');
    });
  });

  describe('CSS Class Consistency', () => {
    it('uses consistent naming pattern across all dropdowns', async () => {
      const { container: countryContainer } = render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );

      const { container: stateContainer } = render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          Label="State"
        />
      );

      const { container: langContainer } = render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
        />
      );

      // Check container classes use consistent rcs-container
      expect(countryContainer.querySelector('.rcs-container')).toBeInTheDocument();
      expect(stateContainer.querySelector('.rcs-container')).toBeInTheDocument();
      expect(langContainer.querySelector('.rcs-container')).toBeInTheDocument();

      // Check label classes use consistent rcs-label
      expect(countryContainer.querySelector('.rcs-label')).toBeInTheDocument();
      expect(stateContainer.querySelector('.rcs-label')).toBeInTheDocument();
      expect(langContainer.querySelector('.rcs-label')).toBeInTheDocument();

      // Check select classes use consistent rcs-select
      expect(countryContainer.querySelector('.rcs-select')).toBeInTheDocument();
      await waitFor(() => {
        expect(stateContainer.querySelector('.rcs-select')).toBeInTheDocument();
      });
      expect(langContainer.querySelector('.rcs-select')).toBeInTheDocument();
    });
  });
});
