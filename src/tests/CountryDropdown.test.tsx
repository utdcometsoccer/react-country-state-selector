import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryDropdown from '../components/CountryDropdown';

describe('CountryDropdown', () => {
  it('renders label and select', () => {
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={() => {}}
        culture="en-US"
        countryInformation={[{ code: 'US', name: 'United States' }]}
        Label="Country"
      />
    );
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onCountryChange when selection changes', () => {
    const handleChange = jest.fn();
    render(
      <CountryDropdown
        selectedCountry="US"
        onCountryChange={handleChange}
        culture="en-US"
        countryInformation={[{ code: 'US', name: 'United States' }]}
        Label="Country"
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'US' } });
    expect(handleChange).toHaveBeenCalledWith('US');
  });
});
