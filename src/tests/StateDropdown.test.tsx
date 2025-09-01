import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import StateDropdown from '../components/StateDropdown';

describe('StateDropdown', () => {
  it('renders label and select', () => {
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={() => {}}
        country="US"
        culture="en-US"
        Label="State/Province"
      />
    );
    expect(screen.getByLabelText('State/Province')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onStateChange when selection changes', () => {
    const handleChange = jest.fn();
    render(
      <StateDropdown
        selectedState="TX"
        onStateChange={handleChange}
        country="US"
        culture="en-US"
        Label="State/Province"
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'TX' } });
    expect(handleChange).toHaveBeenCalledWith('TX');
  });
});
