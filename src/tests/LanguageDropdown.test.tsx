import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LanguageDropdown from '../components/LanguageDropdown';
import { CultureInfo, type LanguageInformation, type Language } from '../types';
import { getLanguageInformationByCulture } from '../services/getLanguageInformation';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

// Mock the services
vi.mock('../services/getLanguageInformation');
vi.mock('../services/cultureFromBrowser');

// Create mocked functions
const mockedGetLanguageInformation = vi.mocked(getLanguageInformationByCulture);
const mockedCultureFromBrowser = vi.mocked(cultureFromBrowser);

const mockLanguageInformation: LanguageInformation[] = [
  { code: 'en' as Language, name: 'English' },
  { code: 'es' as Language, name: 'Spanish' },
  { code: 'fr' as Language, name: 'French' },
];

describe('LanguageDropdown', () => {
  const mockOnLanguageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
  });

  it('renders label and select when provided', () => {
    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        languageInformation={mockLanguageInformation}
        Label="Language"
      />
    );

    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('English')).toBeInTheDocument();
  });

  it('renders without a label when not provided', () => {
    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        languageInformation={mockLanguageInformation}
      />
    );

    const labels = screen.queryAllByText('Language');
    expect(labels).toHaveLength(0);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onLanguageChange when selection changes', () => {
    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        languageInformation={mockLanguageInformation}
        Label="Language"
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'es' } });

    expect(mockOnLanguageChange).toHaveBeenCalledWith('es');
  });

  it('displays all language options', () => {
    render(
      <LanguageDropdown
        selectedLanguage={undefined}
        onLanguageChange={mockOnLanguageChange}
        languageInformation={mockLanguageInformation}
        Label="Language"
      />
    );

    expect(screen.getByText('Select a language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('applies custom CSS classes when provided', () => {
    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        languageInformation={mockLanguageInformation}
        Label="Language"
        classNameLabel="custom-label"
        classNameSelect="custom-select"
      />
    );

    const label = screen.getByLabelText('Language');
    const select = screen.getByRole('combobox');

    expect(label).toHaveClass('custom-label');
    expect(select).toHaveClass('custom-select');
  });

  it('shows loading message when loading language information', async () => {
    mockedGetLanguageInformation.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockLanguageInformation), 100))
    );

    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        Label="Language"
      />
    );

    expect(screen.getByText('Loading language information...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('displays error message when loading fails', async () => {
    mockedGetLanguageInformation.mockRejectedValue(new Error('Failed to load'));

    // Mock process.env for development mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        Label="Language"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading language information: Failed to load/)).toBeInTheDocument();
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('displays generic error message in production', async () => {
    mockedGetLanguageInformation.mockRejectedValue(new Error('Failed to load'));

    // Mock process.env for production mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        Label="Language"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading language information. Please try again later.')).toBeInTheDocument();
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('uses custom getLanguageInformation function when provided', async () => {
    const customGetLanguageInformation = vi.fn().mockResolvedValue(mockLanguageInformation);

    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        getLanguageInformation={customGetLanguageInformation}
        Label="Language"
      />
    );

    await waitFor(() => {
      expect(customGetLanguageInformation).toHaveBeenCalled();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('handles CultureInfo object for culture prop', () => {
    const cultureInfo = new CultureInfo('es-MX');

    render(
      <LanguageDropdown
        selectedLanguage="es"
        onLanguageChange={mockOnLanguageChange}
        culture={cultureInfo}
        languageInformation={mockLanguageInformation}
        Label="Language"
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles string culture prop', () => {
    render(
      <LanguageDropdown
        selectedLanguage="fr"
        onLanguageChange={mockOnLanguageChange}
        culture="fr-CA"
        languageInformation={mockLanguageInformation}
        Label="Language"
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        languageInformation={mockLanguageInformation}
        Label="Language"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'language-select');
    expect(select).toHaveAttribute('aria-labelledby');
  });

  it('sets error aria attributes when error is present', async () => {
    mockedGetLanguageInformation.mockRejectedValue(new Error('Failed to load'));

    render(
      <LanguageDropdown
        selectedLanguage="en"
        onLanguageChange={mockOnLanguageChange}
        Label="Language"
      />
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'language-error');
    });
  });
});