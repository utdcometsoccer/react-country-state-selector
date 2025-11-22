import CountryDropdown from '../components/CountryDropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
