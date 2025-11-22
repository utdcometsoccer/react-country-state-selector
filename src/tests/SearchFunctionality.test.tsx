import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LanguageDropdown from '../components/LanguageDropdown';
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

describe('Search Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  describe('CountryDropdown with enableSearch', () => {
    it('renders search input when enableSearch is true', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a country');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('renders select dropdown when enableSearch is false', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={false}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // VirtualSelect uses a div with role="combobox", not a native select
      expect(select.tagName).toBe('DIV');
    });

    it('renders select dropdown when enableSearch is not provided (default)', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // VirtualSelect uses a div with role="combobox", not a native select
      expect(select.tagName).toBe('DIV');
    });

    it('renders datalist with all country options', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a country');
      const datalistId = input.getAttribute('list');
      expect(datalistId).toBeTruthy();
      expect(datalistId).toMatch(/^rcs-country-\d+-datalist$/);
      
      const datalist = document.getElementById(datalistId!);
      expect(datalist).toBeInTheDocument();
      expect(datalist?.tagName).toBe('DATALIST');
      
      const options = datalist?.querySelectorAll('option');
      expect(options?.length).toBe(3);
    });

    it('displays selected country name in input', () => {
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={true}
        />
      );

      const input = screen.getByDisplayValue('United States');
      expect(input).toBeInTheDocument();
    });

    it('calls onCountryChange when user selects from datalist', () => {
      const mockOnChange = vi.fn();
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a country');
      fireEvent.change(input, { target: { value: 'Canada' } });

      expect(mockOnChange).toHaveBeenCalledWith('CA');
    });

    it('handles input with country code', () => {
      const mockOnChange = vi.fn();
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={mockOnChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a country');
      fireEvent.change(input, { target: { value: 'US' } });

      expect(mockOnChange).toHaveBeenCalledWith('US');
    });

    it('applies custom CSS class to search input', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          classNameSelect="custom-input"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a country');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('StateDropdown with enableSearch', () => {
    it('renders search input when enableSearch is true', () => {
      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a state/province');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('renders select dropdown when enableSearch is false', () => {
      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          enableSearch={false}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('displays selected state name in input', () => {
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          enableSearch={true}
        />
      );

      const input = screen.getByDisplayValue('California');
      expect(input).toBeInTheDocument();
    });

    it('calls onStateChange when user selects from datalist', () => {
      const mockOnChange = vi.fn();
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnChange}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a state/province');
      fireEvent.change(input, { target: { value: 'Texas' } });

      expect(mockOnChange).toHaveBeenCalledWith('TX');
    });

    it('renders datalist with all state options', () => {
      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          enableSearch={true}
        />
      );

      const datalist = document.getElementById('state-province-datalist');
      expect(datalist).toBeInTheDocument();
      
      const options = datalist?.querySelectorAll('option');
      expect(options?.length).toBe(3);
    });
  });

  describe('LanguageDropdown with enableSearch', () => {
    it('renders search input when enableSearch is true', () => {
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a language');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('renders select dropdown when enableSearch is false', () => {
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          enableSearch={false}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('displays selected language name in input', () => {
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          enableSearch={true}
        />
      );

      const input = screen.getByDisplayValue('English');
      expect(input).toBeInTheDocument();
    });

    it('calls onLanguageChange when user selects from datalist', () => {
      const mockOnChange = vi.fn();
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={mockOnChange}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          enableSearch={true}
        />
      );

      const input = screen.getByPlaceholderText('Search or select a language');
      fireEvent.change(input, { target: { value: 'Spanish' } });

      expect(mockOnChange).toHaveBeenCalledWith('es');
    });

    it('renders datalist with all language options', () => {
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          enableSearch={true}
        />
      );

      const datalist = document.getElementById('language-datalist');
      expect(datalist).toBeInTheDocument();
      
      const options = datalist?.querySelectorAll('option');
      expect(options?.length).toBe(3);
    });
  });

  describe('Accessibility with search enabled', () => {
    it('maintains proper label association for CountryDropdown', () => {
      render(
        <CountryDropdown
          selectedCountry=""
          onCountryChange={vi.fn()}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
          enableSearch={true}
        />
      );

      const label = screen.getByText('Country');
      const input = screen.getByPlaceholderText('Search or select a country');
      
      expect(label.getAttribute('for')).toBe('country-select');
      expect(input.id).toBe('country-select');
    });

    it('maintains proper label association for StateDropdown', () => {
      render(
        <StateDropdown
          selectedState=""
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
          enableSearch={true}
        />
      );

      const label = screen.getByText('State');
      const input = screen.getByPlaceholderText('Search or select a state/province');
      
      expect(label.getAttribute('for')).toBe('state-province-select');
      expect(input.id).toBe('state-province-select');
    });

    it('maintains proper label association for LanguageDropdown', () => {
      render(
        <LanguageDropdown
          selectedLanguage={undefined}
          onLanguageChange={vi.fn()}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
          enableSearch={true}
        />
      );

      const label = screen.getByText('Language');
      const input = screen.getByPlaceholderText('Search or select a language');
      
      expect(label.getAttribute('for')).toBe('language-select');
      expect(input.id).toBe('language-select');
    });
  });

  describe('Backward compatibility', () => {
    it('does not break existing CountryDropdown usage without enableSearch', () => {
      const mockOnChange = vi.fn();
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnChange}
          culture="en-US"
          countryInformation={mockCountryInformation}
          Label="Country"
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'CA' } });

      expect(mockOnChange).toHaveBeenCalledWith('CA');
      expect(select.tagName).toBe('SELECT');
    });

    it('does not break existing StateDropdown usage without enableSearch', () => {
      const mockOnChange = vi.fn();
      render(
        <StateDropdown
          selectedState="CA"
          onStateChange={mockOnChange}
          country="US"
          culture="en-US"
          stateProvinceInformation={mockStateInformation}
          Label="State"
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'TX' } });

      expect(mockOnChange).toHaveBeenCalledWith('TX');
      expect(select.tagName).toBe('SELECT');
    });

    it('does not break existing LanguageDropdown usage without enableSearch', () => {
      const mockOnChange = vi.fn();
      render(
        <LanguageDropdown
          selectedLanguage="en"
          onLanguageChange={mockOnChange}
          culture="en-US"
          languageInformation={mockLanguageInformation}
          Label="Language"
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'es' } });

      expect(mockOnChange).toHaveBeenCalledWith('es');
      expect(select.tagName).toBe('SELECT');
    });
  });
});
