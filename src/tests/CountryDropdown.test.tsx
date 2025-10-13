import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import { CultureInfo, type CountryInformation, type Country } from '../types';
import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

// Mock the services
vi.mock('../services/getCountryInformation');
vi.mock('../services/cultureFromBrowser');

const mockedGetCountryInformation = vi.mocked(getCountryInformationByCulture);
const mockedCultureFromBrowser = vi.mocked(cultureFromBrowser);

const mockCountryInformation: CountryInformation[] = [
  { code: 'US' as Country, name: 'United States' },
  { code: 'CA' as Country, name: 'Canada' },
  { code: 'MX' as Country, name: 'Mexico' },
];

describe('CountryDropdown', () => {
  const mockOnCountryChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  it('renders label and select when provided', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        culture="en-US"
        countryInformation={mockCountryInformation}
        Label="Country"
      />
    );
    
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
  });

  it('renders without a label when not provided', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        countryInformation={mockCountryInformation}
      />
    );

    const labels = screen.queryAllByText('Country');
    expect(labels).toHaveLength(0);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onCountryChange when selection changes', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        culture="en-US"
        countryInformation={mockCountryInformation}
        Label="Country"
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'CA' } });
    
    expect(mockOnCountryChange).toHaveBeenCalledWith('CA');
  });

  it('displays all country options', () => {
    render(
      <CountryDropdown
        selectedCountry=""
        onCountryChange={mockOnCountryChange}
        countryInformation={mockCountryInformation}
        Label="Country"
      />
    );

    expect(screen.getByText('Select a country')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
  });

  it('applies custom CSS classes when provided', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        countryInformation={mockCountryInformation}
        Label="Country"
        classNameLabel="custom-label"
        classNameSelect="custom-select"
      />
    );

    const label = screen.getByLabelText('Country');
    const select = screen.getByRole('combobox');

    expect(label).toHaveClass('custom-label');
    expect(select).toHaveClass('custom-select');
  });

  it('shows loading message when loading country information', async () => {
    mockedGetCountryInformation.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockCountryInformation), 100))
    );

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        Label="Country"
      />
    );

    expect(screen.getByText('Loading country information...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('displays error message when loading fails', async () => {
    mockedGetCountryInformation.mockRejectedValue(new Error('Failed to load'));

    // Mock process.env for development mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        Label="Country"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading country information: Failed to load/)).toBeInTheDocument();
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('displays generic error message in production', async () => {
    mockedGetCountryInformation.mockRejectedValue(new Error('Failed to load'));

    // Mock process.env for production mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        Label="Country"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading country information. Please try again later.')).toBeInTheDocument();
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('uses custom getCountryInformation function when provided', async () => {
    const customGetCountryInformation = vi.fn().mockResolvedValue(mockCountryInformation);

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        getCountryInformation={customGetCountryInformation}
        Label="Country"
      />
    );

    await waitFor(() => {
      expect(customGetCountryInformation).toHaveBeenCalled();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('handles CultureInfo object for culture prop', () => {
    const cultureInfo = new CultureInfo('es-MX');

    render(
      <CountryDropdown
        selectedCountry="MX"
        onCountryChange={mockOnCountryChange}
        culture={cultureInfo}
        countryInformation={mockCountryInformation}
        Label="Country"
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles string culture prop', () => {
    render(
      <CountryDropdown
        selectedCountry="CA"
        onCountryChange={mockOnCountryChange}
        culture="fr-CA"
        countryInformation={mockCountryInformation}
        Label="Country"
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        countryInformation={mockCountryInformation}
        Label="Country"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'country-select');
    expect(select).toHaveAttribute('aria-labelledby');
  });

  it('sets error aria attributes when error is present', async () => {
    mockedGetCountryInformation.mockRejectedValue(new Error('Failed to load'));

    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={mockOnCountryChange}
        Label="Country"
      />
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'country-error');
    });
  });
});
