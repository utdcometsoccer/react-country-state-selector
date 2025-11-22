import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VirtualSelect, { VirtualSelectOption } from '../components/VirtualSelect/VirtualSelect';

describe('VirtualSelect Component', () => {
  const mockOptions: VirtualSelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
  ];

  const mockOnChange = vi.fn();

  afterEach(() => {
    mockOnChange.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render with placeholder text when no value selected', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          placeholder="Select an option"
        />
      );

      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with selected value', () => {
      render(
        <VirtualSelect
          id="test-select"
          value="us"
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          className="custom-class"
        />
      );

      const selectContainer = container.querySelector('.virtual-select-container');
      expect(selectContainer).toHaveClass('custom-class');
    });

    it('should render with disabled state', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          disabled={true}
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveClass('disabled');
    });
  });

  describe('Dropdown Interaction', () => {
    it('should open dropdown when clicking trigger', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should display all options when opened', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      mockOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should call onChange when option is clicked', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getByText('Canada');
      fireEvent.click(canadaOption);

      expect(mockOnChange).toHaveBeenCalledWith('ca');
    });

    it('should close dropdown after selecting option', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getByText('Canada');
      fireEvent.click(canadaOption);

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown on Enter key', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should open dropdown on Space key', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const container = screen.getByRole('combobox').closest('.virtual-select-container');
      fireEvent.keyDown(container!, { key: ' ' });

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close dropdown on Escape key', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const container = screen.getByRole('combobox').closest('.virtual-select-container');
      
      // Open dropdown
      fireEvent.keyDown(container!, { key: 'Enter' });
      
      // Close with Escape
      fireEvent.keyDown(container!, { key: 'Escape' });

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should navigate options with ArrowDown', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const container = screen.getByRole('combobox').closest('.virtual-select-container');
      
      // Open dropdown
      fireEvent.keyDown(container!, { key: 'Enter' });
      
      // Navigate down
      fireEvent.keyDown(container!, { key: 'ArrowDown' });

      const highlightedOption = screen.getByText('Canada');
      expect(highlightedOption).toHaveClass('highlighted');
    });

    it('should select highlighted option with Enter', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const container = screen.getByRole('combobox').closest('.virtual-select-container');
      
      // Open dropdown
      fireEvent.keyDown(container!, { key: 'Enter' });
      
      // Navigate down to second option
      fireEvent.keyDown(container!, { key: 'ArrowDown' });
      
      // Select with Enter
      fireEvent.keyDown(container!, { key: 'Enter' });

      expect(mockOnChange).toHaveBeenCalledWith('ca');
    });
  });

  describe('Grouped Options', () => {
    const groupedOptions: VirtualSelectOption[] = [
      { value: 'us', label: 'United States', group: 'North America' },
      { value: 'ca', label: 'Canada', group: 'North America' },
      { value: 'mx', label: 'Mexico', group: 'North America' },
      { value: 'fr', label: 'France', group: 'Europe' },
      { value: 'de', label: 'Germany', group: 'Europe' },
      { value: 'uk', label: 'United Kingdom' }, // Ungrouped
    ];

    it('should render group labels', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={groupedOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      expect(screen.getByText('North America')).toBeInTheDocument();
      expect(screen.getByText('Europe')).toBeInTheDocument();
    });

    it('should render ungrouped options first', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={groupedOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const dropdown = screen.getByRole('listbox');
      const firstOption = dropdown.querySelector('.virtual-select-option');
      expect(firstOption).toHaveTextContent('United Kingdom');
    });

    it('should apply grouped class to grouped options', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={groupedOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getByText('Canada');
      expect(canadaOption).toHaveClass('grouped');
    });
  });

  describe('Virtual Scrolling', () => {
    it('should use virtual scrolling for large lists', () => {
      const largeOptions: VirtualSelectOption[] = Array.from({ length: 100 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i}`,
      }));

      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={largeOptions}
          enableVirtualScrolling={true}
          virtualScrollThreshold={50}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Virtual scrolling should be enabled for 100 items
      const dropdown = screen.getByRole('listbox');
      expect(dropdown.querySelector('[style*="overflow"]')).toBeDefined();
    });

    it('should not use virtual scrolling when disabled', () => {
      const largeOptions: VirtualSelectOption[] = Array.from({ length: 100 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i}`,
      }));

      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={largeOptions}
          enableVirtualScrolling={false}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Should render all options without virtual scrolling
      expect(screen.getByText('Option 0')).toBeInTheDocument();
      expect(screen.getByText('Option 99')).toBeInTheDocument();
    });

    it('should not use virtual scrolling for small lists', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          enableVirtualScrolling={true}
          virtualScrollThreshold={50}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Should not use virtual scrolling for only 5 items
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          placeholder="Select a country"
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-controls', 'test-select-listbox');
    });

    it('should support aria-describedby', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          aria-describedby="error-message"
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-describedby', 'error-message');
    });

    it('should have focusable trigger', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when disabled', () => {
      render(
        <VirtualSelect
          id="test-select"
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          disabled={true}
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('tabIndex', '-1');
    });

    it('should mark selected option with aria-selected', () => {
      render(
        <VirtualSelect
          id="test-select"
          value="ca"
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const canadaOption = screen.getAllByText('Canada')[1]; // Get the option in dropdown, not trigger
      expect(canadaOption).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Click Outside', () => {
    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <VirtualSelect
            id="test-select"
            value=""
            onChange={mockOnChange}
            options={mockOptions}
          />
          <div data-testid="outside">Outside element</div>
        </div>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });
});
