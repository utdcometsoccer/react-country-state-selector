import CountryDropdown from '../components/CountryDropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CountryInformation, CultureInfo } from '../types';
import groupedCountries from '../components/CountryDropdown/countries-grouped-example.json';

const meta = {
    component: CountryDropdown,
    argTypes: {
        onCountryChange: { action: 'country changed' },
        selectedCountry: { control: 'text' },
        culture: { control: 'text' },
        countryInformation: { control: 'object' },
        Label: { control: 'text' },
        classNameLabel: { control: 'text' },
        classNameSelect: { control: 'text' },
        enableSearch: { control: 'boolean' },
        required: { control: 'boolean' },
    },
} satisfies Meta<typeof CountryDropdown>;

type Story = StoryObj<typeof CountryDropdown>;

export default meta;

// Story showing default visual hierarchy styles
export const WithDefaultStyles: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Select Your Country',
    },
};

// Story showing custom styling that overrides defaults
export const WithCustomStyles: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Country',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
    },
};

// Legacy story for backward compatibility
export const Primary: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Country',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
    },
};

export const WithOptgroups: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: '',
        countryInformation: groupedCountries as CountryInformation[],
        Label: 'Select Country (Grouped by Region)',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
    },
};

export const WithSearch: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: '',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Country (Searchable)',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
        enableSearch: true,
    },
};

export const WithSearchPreselected: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'CA',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Country (Searchable - Preselected)',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
        enableSearch: true,
    },
};

/**
 * Story demonstrating error handling with retry mechanism.
 * 
 * This story shows how the component handles data loading failures:
 * - Displays a user-friendly error message
 * - Provides a "Retry loading data" button (up to 3 retries)
 * - Shows detailed error info in development mode for debugging
 * 
 * In production builds, only a brief error message is shown.
 * See docs/ERROR-HANDLING.md for full documentation.
 */
export const WithErrorHandling: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: '',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Country (Error Demo)',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
        // Mock function that simulates a network failure to demonstrate error handling
        getCountryInformation: async () => {
            throw new Error('Simulated network failure');
        },
    },
};

export const RequiredField: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: '',
        culture: 'en-US',
        countryInformation: [],
        Label: 'Country',
        classNameLabel: 'country-label',
        classNameSelect: 'country-select',
        required: true,
    },
};
