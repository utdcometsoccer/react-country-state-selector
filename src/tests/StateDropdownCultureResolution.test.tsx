import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import StateDropdown from '../components/StateDropdown';
import { CultureInfo } from '../types';

// Mock the resolveCultureInfo utility
const mockResolveCultureInfo = vi.fn();
vi.mock('../utils/cultureResolution', () => ({
  resolveCultureInfo: (...args: any[]) => mockResolveCultureInfo(...args),
}));

// Mock the state province information service to return mock data
vi.mock('../services/getStateProvinceInformation', () => ({
  getStateProvinceInformationByCulture: vi.fn().mockResolvedValue([
    { value: 'CA', displayName: 'California' },
    { value: 'NY', displayName: 'New York' }
  ])
}));

describe('StateDropdown Culture Resolution Integration', () => {
  const mockOnStateChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mocks before each test
    
    // Default mock implementation returns a valid CultureInfo
    mockResolveCultureInfo.mockReturnValue(new CultureInfo('en-US'));
  });

  describe('Culture resolution integration', () => {
    it('uses resolveCultureInfo utility with CultureInfo object', async () => {
      const cultureInfo = new CultureInfo('fr-CA');
      mockResolveCultureInfo.mockReturnValue(cultureInfo);
      
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="CA"
          culture={cultureInfo}
          Label="State"
        />
      );

      expect(mockResolveCultureInfo).toHaveBeenCalledWith(cultureInfo);
      expect(mockResolveCultureInfo).toHaveBeenCalledTimes(2);
    });

    it('uses resolveCultureInfo utility with culture string', async () => {
      const cultureString = 'es-MX';
      const resolvedCulture = new CultureInfo('es-MX');
      mockResolveCultureInfo.mockReturnValue(resolvedCulture);
      
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="MX"
          culture={cultureString}
          Label="State"
        />
      );

      expect(mockResolveCultureInfo).toHaveBeenCalledWith(cultureString);
      expect(mockResolveCultureInfo).toHaveBeenCalledTimes(2);
    });

    it('uses resolveCultureInfo utility when no culture is provided', async () => {
      const defaultCulture = new CultureInfo('en-US');
      mockResolveCultureInfo.mockReturnValue(defaultCulture);
      
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="US"
          Label="State"
        />
      );

      expect(mockResolveCultureInfo).toHaveBeenCalledWith(undefined);
      expect(mockResolveCultureInfo).toHaveBeenCalledTimes(2);
    });

    it('passes resolved culture to state initialization', async () => {
      const resolvedCulture = new CultureInfo('de-DE');
      mockResolveCultureInfo.mockReturnValue(resolvedCulture);
      
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="DE"
          culture="de-DE"
          Label="State"
        />
      );

      // The component should initialize with the resolved culture
      expect(mockResolveCultureInfo).toHaveBeenCalledWith('de-DE');
      
      // We can verify the culture is used by checking that the component renders
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('handles culture resolution errors gracefully', () => {
      // Mock resolveCultureInfo to throw an error
      mockResolveCultureInfo.mockImplementation(() => {
        throw new Error('Culture resolution failed');
      });

      // The error should be caught by React's error boundary or cause render failure
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <StateDropdown
            selectedState=""
            onStateChange={mockOnStateChange}
            country="US"
            culture={"invalid-culture" as any}
            Label="State"
          />
        );
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it('calls resolveCultureInfo on each render (due to no memoization)', () => {
      mockResolveCultureInfo.mockReturnValue(new CultureInfo('en-US'));

      const { rerender } = render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="US"
          culture="en-US"
          Label="State"
        />
      );

      // Initial render (with Strict Mode = 2 calls)
      expect(mockResolveCultureInfo).toHaveBeenCalledTimes(2);

      // Rerender with same props - since there's no memoization, it will call again
      rerender(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="US"
          culture="en-US"
          Label="State"
        />
      );

      // Should be called again for rerender (1 more call, not double due to same props)
      expect(mockResolveCultureInfo).toHaveBeenCalledTimes(3);
    });

    it('uses resolved culture for different culture input types', async () => {
      const testCases = [
        { 
          input: new CultureInfo('fr-FR'), 
          expected: new CultureInfo('fr-FR'),
          description: 'CultureInfo object'
        },
        { 
          input: 'en-GB' as any, 
          expected: new CultureInfo('en-GB'),
          description: 'culture string'
        },
        { 
          input: undefined, 
          expected: new CultureInfo('en-US'),
          description: 'undefined (browser fallback)'
        }
      ];

      for (const testCase of testCases) {
        mockResolveCultureInfo.mockClear();
        mockResolveCultureInfo.mockReturnValue(testCase.expected);
        
        const { unmount } = render(
          <StateDropdown
            selectedState=""
            onStateChange={mockOnStateChange}
            country="US"
            culture={testCase.input}
            Label={`State ${testCase.description}`}
          />
        );

        expect(mockResolveCultureInfo).toHaveBeenCalledWith(testCase.input);
        await waitFor(() => {
          expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
        
        unmount();
      }
    });
  });

  describe('Backward compatibility', () => {
    it('maintains same behavior as before refactoring', async () => {
      const cultureInfo = new CultureInfo('fr-CA');
      mockResolveCultureInfo.mockReturnValue(cultureInfo);
      
      render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="CA"
          culture={cultureInfo}
          Label="Province"
        />
      );

      // Should render the dropdown
      const label = screen.getByText('Province');
      expect(label).toBeInTheDocument();
      
      // Wait for the dropdown to load - check for the select element by ID
      await waitFor(() => {
        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();
        expect(selectElement.tagName).toBe('SELECT');
      });

      // Should have called our utility with the provided culture
      expect(mockResolveCultureInfo).toHaveBeenCalledWith(cultureInfo);
    });

    it('works with existing prop combinations', async () => {
      mockResolveCultureInfo.mockReturnValue(new CultureInfo('en-US'));

      // Test various prop combinations that existed before refactoring
      const { rerender } = render(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="US"
          Label="State"
        />
      );

      const label = screen.getByText('State');
      expect(label).toBeInTheDocument();

      rerender(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="CA"
          culture="fr-CA"
          Label="Province"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Province')).toBeInTheDocument();
      });

      rerender(
        <StateDropdown
          selectedState=""
          onStateChange={mockOnStateChange}
          country="MX"
          culture={new CultureInfo('es-MX')}
          Label="Estado"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Estado')).toBeInTheDocument();
      });
    });
  });
});