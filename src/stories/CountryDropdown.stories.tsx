import CountryDropdown from '../components/CountryDropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CountryInformation, Country } from '../types';
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
