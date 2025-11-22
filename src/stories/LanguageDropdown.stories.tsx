import LanguageDropdown from '../components/LanguageDropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: LanguageDropdown,
  argTypes: {
    onLanguageChange: { action: 'language changed' },
    selectedLanguage: { control: 'text' },
    culture: { control: 'text' },
    languageInformation: { control: 'object' },
    Label: { control: 'text' },
    classNameLabel: { control: 'text' },
    classNameSelect: { control: 'text' },
    enableSearch: { control: 'boolean' },
  },
} satisfies Meta<typeof LanguageDropdown>;

type Story = StoryObj<typeof LanguageDropdown>;

export default meta;

export const Primary: Story = {
  args: {
    onLanguageChange: (language) => console.log('Selected language:', language),
    selectedLanguage: 'en',
    culture: 'en-US',
    languageInformation: [],
    Label: 'Language',
    classNameLabel: 'language-label',
    classNameSelect: 'language-select',
  },
};

export const WithSearch: Story = {
  args: {
    onLanguageChange: (language) => console.log('Selected language:', language),
    selectedLanguage: undefined,
    culture: 'en-US',
    languageInformation: [],
    Label: 'Language (Searchable)',
    classNameLabel: 'language-label',
    classNameSelect: 'language-select',
    enableSearch: true,
  },
};
