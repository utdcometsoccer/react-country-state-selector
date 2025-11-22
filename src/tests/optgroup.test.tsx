import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
import { CultureInfo, type CountryInformation, type StateProvinceInformation, type LanguageInformation, type Country, type Language } from '../types';

describe('Optgroup Support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CountryDropdown with optgroups', () => {
    const mockCountryInformationWithGroups: CountryInformation[] = [
      { code: 'US' as Country, name: 'United States', group: 'North America' },
      { code: 'CA' as Country, name: 'Canada', group: 'North America' },
      { code: 'MX' as Country, name: 'Mexico', group: 'North America' },
      { code: 'FR' as Country, name: 'France', group: 'Europe' },
      { code: 'DE' as Country, name: 'Germany', group: 'Europe' },
      { code: 'JP' as Country, name: 'Japan', group: 'Asia' },
    ];

    it('renders optgroups when countries have group property', () => {
      const mockOnChange = vi.fn();
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnChange}
          countryInformation={mockCountryInformationWithGroups}
          Label="Country"
        />
      );

      // Open the dropdown to see groups
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Check that group labels are present
      expect(screen.getByText('North America')).toBeInTheDocument();
      expect(screen.getByText('Europe')).toBeInTheDocument();

      // Verify grouped options appear under groups
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });

    it('renders options without optgroups when no group property exists', () => {
      const mockCountryInformationNoGroups: CountryInformation[] = [
        { code: 'US' as Country, name: 'United States' },
        { code: 'CA' as Country, name: 'Canada' },
      ];
      const mockOnChange = vi.fn();
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnChange}
          countryInformation={mockCountryInformationNoGroups}
          Label="Country"
        />
      );

      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Check that group labels are not present
      expect(screen.queryByText('North America')).not.toBeInTheDocument();
      expect(screen.queryByText('Europe')).not.toBeInTheDocument();

      // Options should still be rendered directly
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    it('handles mixed grouped and ungrouped items', () => {
      const mockMixedCountries: CountryInformation[] = [
        { code: 'US' as Country, name: 'United States', group: 'North America' },
        { code: 'CA' as Country, name: 'Canada', group: 'North America' },
        { code: 'XX' as Country, name: 'Unknown Country' }, // No group
      ];
      const mockOnChange = vi.fn();
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnChange}
          countryInformation={mockMixedCountries}
          Label="Country"
        />
      );

      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);
      
      // Should have group labels for grouped items
      expect(screen.getByText('North America')).toBeInTheDocument();
      
      // Ungrouped item should still be in the select
      expect(screen.getByText('Unknown Country')).toBeInTheDocument();
    });
  });

  describe('StateDropdown with optgroups', () => {
    const mockStateInformationWithGroups: StateProvinceInformation[] = [
      { code: 'CA', name: 'California', group: 'West Coast' },
      { code: 'WA', name: 'Washington', group: 'West Coast' },
      { code: 'NY', name: 'New York', group: 'East Coast' },
      { code: 'FL', name: 'Florida', group: 'East Coast' },
    ];

    it('renders optgroups when states have group property', async () => {
      const mockOnChange = vi.fn();
      const { container } = render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnChange}
          country="US"
          stateProvinceInformation={mockStateInformationWithGroups}
          getStateProvinceInformation={async () => mockStateInformationWithGroups}
          Label="State"
        />
      );

      // Wait for the component to finish loading
      await screen.findByRole('combobox');

      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Check that group labels are present
      expect(screen.getByText('West Coast')).toBeInTheDocument();
      expect(screen.getByText('East Coast')).toBeInTheDocument();
    });

    it('renders options without optgroups when no group property exists', async () => {
      const mockStateInformationNoGroups: StateProvinceInformation[] = [
        { code: 'CA', name: 'California' },
        { code: 'TX', name: 'Texas' },
      ];
      const mockOnChange = vi.fn();
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnChange}
          country="US"
          stateProvinceInformation={mockStateInformationNoGroups}
          getStateProvinceInformation={async () => mockStateInformationNoGroups}
          Label="State"
        />
      );

      // Wait for the component to finish loading
      await screen.findByRole('combobox');

      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Check that group labels are not present
      expect(screen.queryByText('West Coast')).not.toBeInTheDocument();

      expect(screen.getByText('California')).toBeInTheDocument();
      expect(screen.getByText('Texas')).toBeInTheDocument();
    });
  });

  describe('LanguageDropdown with optgroups', () => {
    const mockLanguageInformationWithGroups: LanguageInformation[] = [
      { code: 'en' as Language, name: 'English', group: 'Germanic' },
      { code: 'de' as Language, name: 'German', group: 'Germanic' },
      { code: 'es' as Language, name: 'Spanish', group: 'Romance' },
      { code: 'fr' as Language, name: 'French', group: 'Romance' },
    ];

    it('renders optgroups when languages have group property', () => {
      const mockOnChange = vi.fn();
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={mockOnChange}
          languageInformation={mockLanguageInformationWithGroups}
          Label="Language"
        />
      );

      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Check that group labels are present
      expect(screen.getByText('Germanic')).toBeInTheDocument();
      expect(screen.getByText('Romance')).toBeInTheDocument();
    });

    it('renders options without optgroups when no group property exists', () => {
      const mockLanguageInformationNoGroups: LanguageInformation[] = [
        { code: 'en' as Language, name: 'English' },
        { code: 'es' as Language, name: 'Spanish' },
      ];
      const mockOnChange = vi.fn();
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={mockOnChange}
          languageInformation={mockLanguageInformationNoGroups}
          Label="Language"
        />
      );

      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Check that group labels are not present
      expect(screen.queryByText('Germanic')).not.toBeInTheDocument();

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Spanish')).toBeInTheDocument();
    });
  });
});
