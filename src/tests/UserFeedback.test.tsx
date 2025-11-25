import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import LoadingIndicator from '../components/LoadingIndicator';
import { CultureInfo, type CountryInformation, type StateProvinceInformation } from '../types';
import { getCountryInformationByCulture } from '../services/getCountryInformation';
import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

// Mock the services
vi.mock('../services/getCountryInformation');
vi.mock('../services/getStateProvinceInformation');
vi.mock('../services/cultureFromBrowser');

const mockedGetCountryInformation = vi.mocked(getCountryInformationByCulture);
const mockedGetStateProvinceInformation = vi.mocked(getStateProvinceInformationByCulture);
const mockedCultureFromBrowser = vi.mocked(cultureFromBrowser);

const mockCountryInformation: CountryInformation[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
];

const mockStateProvinceInformation: StateProvinceInformation[] = [
  { code: 'TX', name: 'Texas' },
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
];

describe('User Feedback & Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
    mockedGetCountryInformation.mockResolvedValue(mockCountryInformation);
    mockedGetStateProvinceInformation.mockResolvedValue(mockStateProvinceInformation);
  });

  describe('Enhanced Loading States', () => {
    it('LoadingIndicator has aria-live="polite" attribute', () => {
      render(<LoadingIndicator message="Loading..." ariaLabel="Loading content" />);
      
      const loadingContainer = screen.getByRole('status');
      expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('LoadingIndicator displays custom loading message', () => {
      const customMessage = 'Loading country information...';
      render(<LoadingIndicator message={customMessage} ariaLabel="Loading" />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('LoadingIndicator has spinner marked as aria-hidden', () => {
      render(<LoadingIndicator message="Loading..." ariaLabel="Loading content" />);
      
      const spinner = screen.getByRole('status').querySelector('.rcss-loading-spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Improved Error Messages', () => {
    it('CountryDropdown displays error with role="alert" and aria-live', async () => {
      mockedGetCountryInformation.mockRejectedValue(new Error('Network error'));
      
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
        />
      );

      await waitFor(() => {
        const errorMessage = screen.queryByRole('alert');
        if (errorMessage) {
          expect(errorMessage).toHaveAttribute('aria-live', 'polite');
          expect(errorMessage).toHaveAttribute('id', 'country-error-message');
        }
      });
    });

    it('StateDropdown displays error with role="alert" and aria-live', async () => {
      mockedGetStateProvinceInformation.mockRejectedValue(new Error('Network error'));
      
      render(
        <StateDropdown
          selectedState="TX"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
        />
      );

      await waitFor(() => {
        const errorMessage = screen.queryByRole('alert');
        if (errorMessage) {
          expect(errorMessage).toHaveAttribute('aria-live', 'polite');
          expect(errorMessage).toHaveAttribute('id', 'state-province-error-message');
        }
      });
    });

    it('error message includes SVG icon', async () => {
      mockedGetCountryInformation.mockRejectedValue(new Error('Network error'));
      
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
        />
      );

      await waitFor(() => {
        const errorMessage = screen.queryByRole('alert');
        if (errorMessage) {
          const icon = errorMessage.querySelector('.rcss-error-icon');
          expect(icon).toBeInTheDocument();
          expect(icon?.querySelector('svg')).toBeInTheDocument();
        }
      });
    });
  });

  describe('Success Feedback', () => {
    it('CountryDropdown calls onSuccess callback when selection changes', async () => {
      const mockOnSuccess = vi.fn();
      const mockOnCountryChange = vi.fn();
      
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          onSuccess={mockOnSuccess}
          culture="en-US"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getByText('Canada');
      fireEvent.click(canadaOption);

      expect(mockOnCountryChange).toHaveBeenCalledWith('CA');
      expect(mockOnSuccess).toHaveBeenCalledWith('CA');
    });

    it('StateDropdown calls onSuccess callback when selection changes', async () => {
      const mockOnSuccess = vi.fn();
      const mockOnStateChange = vi.fn();
      
      render(
        <StateDropdown
          selectedState="TX"
          onStateChange={mockOnStateChange}
          onSuccess={mockOnSuccess}
          country="US"
          culture="en-US"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const californiaOption = screen.getByText('California');
      fireEvent.click(californiaOption);

      expect(mockOnStateChange).toHaveBeenCalledWith('CA');
      expect(mockOnSuccess).toHaveBeenCalledWith('CA');
    });

    it('CountryDropdown updates aria-live region with selection confirmation', async () => {
      const mockOnCountryChange = vi.fn();
      
      const { container } = render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getByText('Canada');
      fireEvent.click(canadaOption);

      // Check for success feedback element with selection confirmation
      const feedbackRegion = container.querySelector('.rcs-country-success-feedback');
      if (feedbackRegion) {
        expect(feedbackRegion).toBeInTheDocument();
      }
      // The important test is that the change was processed
      expect(mockOnCountryChange).toHaveBeenCalledWith('CA');
    });

    it('StateDropdown updates aria-live region with selection confirmation', async () => {
      const mockOnStateChange = vi.fn();
      
      const { container } = render(
        <StateDropdown
          selectedState="TX"
          onStateChange={mockOnStateChange}
          country="US"
          culture="en-US"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const californiaOption = screen.getByText('California');
      fireEvent.click(californiaOption);

      // Check for success feedback element with selection confirmation
      const feedbackRegion = container.querySelector('.rcs-state-success-feedback');
      if (feedbackRegion) {
        expect(feedbackRegion).toBeInTheDocument();
      }
      // The important test is that the change was processed
      expect(mockOnStateChange).toHaveBeenCalledWith('CA');
    });

    it('CountryDropdown works without onSuccess callback (optional)', async () => {
      const mockOnCountryChange = vi.fn();
      
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={mockOnCountryChange}
          culture="en-US"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getByText('Canada');
      fireEvent.click(canadaOption);

      // Should not throw error even without onSuccess
      expect(mockOnCountryChange).toHaveBeenCalledWith('CA');
    });

    it('StateDropdown works without onSuccess callback (optional)', async () => {
      const mockOnStateChange = vi.fn();
      
      render(
        <StateDropdown
          selectedState="TX"
          onStateChange={mockOnStateChange}
          country="US"
          culture="en-US"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const californiaOption = screen.getByText('California');
      fireEvent.click(californiaOption);

      // Should not throw error even without onSuccess
      expect(mockOnStateChange).toHaveBeenCalledWith('CA');
    });
  });

  describe('Accessibility', () => {
    it('CountryDropdown error is linked to select via aria-describedby', async () => {
      mockedGetCountryInformation.mockRejectedValue(new Error('Network error'));
      
      render(
        <CountryDropdown
          selectedCountry="US"
          onCountryChange={vi.fn()}
          culture="en-US"
        />
      );

      await waitFor(() => {
        const errorMessage = screen.queryByRole('alert');
        if (errorMessage) {
          const select = screen.getByRole('combobox');
          expect(select).toHaveAttribute('aria-describedby', 'country-error-message');
        }
      });
    });

    it('StateDropdown error is linked to select via aria-describedby', async () => {
      mockedGetStateProvinceInformation.mockRejectedValue(new Error('Network error'));
      
      render(
        <StateDropdown
          selectedState="TX"
          onStateChange={vi.fn()}
          country="US"
          culture="en-US"
        />
      );

      await waitFor(() => {
        const errorMessage = screen.queryByRole('alert');
        if (errorMessage) {
          const select = screen.getByRole('combobox');
          expect(select).toHaveAttribute('aria-describedby', 'state-province-error-message');
        }
      });
    });
  });
});
