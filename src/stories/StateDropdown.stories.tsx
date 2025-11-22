import StateDropdown from '../components/StateDropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
    component: StateDropdown,
    argTypes: {
        onStateChange: { action: 'state changed' },
        selectedState: { control: 'text' },
        country: {
            control: {
                type: 'select',
                options: ['US', 'CA', 'MX']
            },
        },
        culture: { control: 'text' },
        Label: { control: 'text' },
        classNameLabel: { control: 'text' },
        classNameSelect: { control: 'text' },
    },
} satisfies Meta<typeof StateDropdown>;


type Story = StoryObj<typeof StateDropdown>;

export default meta;

export const Primary: Story = {
    args: {
        onStateChange: (state) => console.log('Selected state:', state),
        selectedState: 'TX',
        country: 'US',
        culture: 'en-US',
        Label: 'State/Province',
        classNameLabel: 'state-label',
        classNameSelect: 'state-select',
    },
};