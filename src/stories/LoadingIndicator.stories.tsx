import LoadingIndicator from '../components/LoadingIndicator';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
    component: LoadingIndicator,
    title: 'Components/LoadingIndicator',
    tags: ['autodocs'],
    argTypes: {
        message: { control: 'text' },
        ariaLabel: { control: 'text' },
    },
    parameters: {
        docs: {
            description: {
                component: 'A touch-optimized loading indicator with an animated spinner. Designed to meet WCAG touch target guidelines with a minimum 48px height.',
            },
        },
    },
} satisfies Meta<typeof LoadingIndicator>;

type Story = StoryObj<typeof LoadingIndicator>;

export default meta;

export const Default: Story = {
    args: {},
};

export const CountryLoading: Story = {
    args: {
        message: 'Loading country information...',
        ariaLabel: 'Loading country information',
    },
};

export const StateLoading: Story = {
    args: {
        message: 'Loading state/province information...',
        ariaLabel: 'Loading state or province information',
    },
};

export const LanguageLoading: Story = {
    args: {
        message: 'Loading language information...',
        ariaLabel: 'Loading language information',
    },
};

export const CustomMessage: Story = {
    args: {
        message: 'Please wait while we fetch your data...',
        ariaLabel: 'Loading data',
    },
};
