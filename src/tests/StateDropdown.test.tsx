import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import StateDropdown from '../components/StateDropdown';
import { CultureInfo, type StateProvinceInformation, type Country } from '../types';
import { getStateProvinceInformationByCulture } from '../services/getStateProvinceInformation';
import { cultureFromBrowser } from '../services/cultureFromBrowser';

// Mock the services
vi.mock('../services/getStateProvinceInformation');
vi.mock('../services/cultureFromBrowser');

const mockedGetStateProvinceInformation = vi.mocked(getStateProvinceInformationByCulture);
const mockedCultureFromBrowser = vi.mocked(cultureFromBrowser);

const mockStateProvinceInformation: StateProvinceInformation[] = [
  { code: 'TX', name: 'Texas' },
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
];

describe('StateDropdown', () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCultureFromBrowser.mockReturnValue(new CultureInfo('en-US'));
    mockedGetStateProvinceInformation.mockResolvedValue(mockStateProvinceInformation);
  });

  it('renders label and select when provided', async () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        culture="en-US"
        Label="State/Province"
      />
    );
    
    const label = screen.getByText('State/Province');
    expect(label).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('renders without a label when not provided', async () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
      />
    );

    await waitFor(() => {
      const labels = screen.queryAllByText('State/Province');
      expect(labels).toHaveLength(0);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('calls onStateChange when selection changes', async () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        culture="en-US"
        Label="State/Province"
      />
    );
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'CA' } });
    });
    
    expect(mockOnStateChange).toHaveBeenCalledWith('CA');
  });

  it('displays all state/province options', async () => {
    render(
      <StateDropdown
        selectedState=""
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Select a state/province')).toBeInTheDocument();
      expect(screen.getByText('Texas')).toBeInTheDocument();
      expect(screen.getByText('California')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
    });
  });

  it('applies custom CSS classes when provided', async () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
        classNameLabel="custom-label"
        classNameSelect="custom-select"
      />
    );

    const label = screen.getByText('State/Province');
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(label).toHaveClass('custom-label');
      expect(select).toHaveClass('custom-select');
    });
  });

  it('shows loading message when loading state information', async () => {
    mockedGetStateProvinceInformation.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockStateProvinceInformation), 100))
    );

    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
      />
    );

    expect(screen.getByText('Loading state/province information...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('displays error message when loading fails', async () => {
    mockedGetStateProvinceInformation.mockRejectedValue(new Error('Failed to load'));

    // Mock process.env for development mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'Development'; // Note: StateDropdown uses 'Development' not 'development'

    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading state\/province information: Failed to load/)).toBeInTheDocument();
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('displays generic error message in production', async () => {
    mockedGetStateProvinceInformation.mockRejectedValue(new Error('Failed to load'));

    // Mock process.env for production mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading state/province information. Please try again later.')).toBeInTheDocument();
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('uses custom getStateProvinceInformation function when provided', async () => {
    const customGetStateProvinceInformation = vi.fn().mockResolvedValue(mockStateProvinceInformation);

    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        getStateProvinceInformation={customGetStateProvinceInformation}
        Label="State/Province"
      />
    );

    await waitFor(() => {
      expect(customGetStateProvinceInformation).toHaveBeenCalled();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('handles CultureInfo object for culture prop', async () => {
    const cultureInfo = new CultureInfo('en-CA');

    render(
      <StateDropdown
        selectedState="ON"
        onStateChange={mockOnStateChange}
        country="CA"
        culture={cultureInfo}
        Label="Province"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('handles string culture prop', async () => {
    render(
      <StateDropdown
        selectedState="QC"
        onStateChange={mockOnStateChange}
        country="CA"
        culture="fr-CA"
        Label="Province"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('creates culture from country when no culture provided', async () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
      />
    );

    const label = screen.getByText('State/Province');

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      
      // Verify proper label-to-input association
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('for', 'state-province-select');
      expect(select).toHaveAttribute('id', 'state-province-select');
      
      // aria-labelledby should not be present when using htmlFor/id
      expect(select).not.toHaveAttribute('aria-labelledby');
    });
  });

  it('sets error aria attributes when error is present', async () => {
    mockedGetStateProvinceInformation.mockRejectedValue(new Error('Failed to load'));

    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={mockOnStateChange}
        country="US"
        Label="State/Province"
      />
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'state-province-error');
    });
  });
});
