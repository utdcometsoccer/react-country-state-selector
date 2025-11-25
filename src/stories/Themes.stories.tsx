import React from 'react';
import CountryDropdown from '../components/CountryDropdown';
import StateDropdown from '../components/StateDropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Country } from '../types';
import '../themes/minimal.css';
import '../themes/material.css';
import '../themes/bootstrap.css';

/**
 * Preset Themes Showcase
 * 
 * This story demonstrates the three preset themes available in react-country-state-selector:
 * - Minimal: Clean, understated design
 * - Material: Google Material Design inspired
 * - Bootstrap: Bootstrap 5 form control styling
 */
const meta = {
    title: 'Themes/Preset Themes',
    component: CountryDropdown,
    parameters: {
        docs: {
            description: {
                component: `
# Preset Themes

The library provides three ready-to-use preset themes that can be imported directly:

## Available Themes

### Minimal Theme
\`\`\`tsx
import 'react-country-state-selector/dist/themes/minimal.css';
\`\`\`
Clean and subtle styling perfect for modern applications.

### Material Theme
\`\`\`tsx
import 'react-country-state-selector/dist/themes/material.css';
\`\`\`
Google Material Design inspired with elevated surfaces and prominent focus states.

### Bootstrap Theme
\`\`\`tsx
import 'react-country-state-selector/dist/themes/bootstrap.css';
\`\`\`
Familiar Bootstrap 5 form control styling.

See the [Themes Guide](../docs/THEMES.md) for detailed documentation.
                `,
            },
        },
    },
    argTypes: {
        onCountryChange: { action: 'country changed' },
        selectedCountry: { control: 'text' },
        culture: { control: 'text' },
        Label: { control: 'text' },
    },
} satisfies Meta<typeof CountryDropdown>;

type Story = StoryObj<typeof CountryDropdown>;

export default meta;

/**
 * Minimal Theme Example
 * 
 * A clean, minimalist theme with subtle styling.
 * Features:
 * - Thin borders (1px)
 * - Compact spacing
 * - Neutral gray color palette
 * - Subtle focus states
 */
export const MinimalTheme: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        Label: 'Country (Minimal Theme)',
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', fontFamily: 'var(--rcss-font-family)' }}>
                <style>{`
                    /* Apply minimal theme to this story */
                    .minimal-theme-container {
                        --rcss-primary-color: #3b82f6;
                        --rcss-primary-hover: #2563eb;
                        --rcss-border-color: #e5e7eb;
                        --rcss-border-radius: 0.25rem;
                        --rcss-focus-ring-color: rgba(59, 130, 246, 0.2);
                        --rcss-text-color: #374151;
                        --rcss-label-color: #6b7280;
                        --rcss-background-color: #ffffff;
                        --rcss-disabled-background: #f9fafb;
                        --rcss-font-size: 0.875rem;
                        --rcss-label-font-size: 0.875rem;
                        --rcss-spacing: 0.375rem;
                    }
                `}</style>
                <div className="minimal-theme-container" style={{ maxWidth: '400px' }}>
                    <Story />
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        ✨ Minimal theme with clean, subtle styling
                    </p>
                </div>
            </div>
        ),
    ],
};

/**
 * Material Theme Example
 * 
 * A theme inspired by Google's Material Design principles.
 * Features:
 * - Elevated surfaces with shadows
 * - Uppercase labels with letter spacing
 * - Bottom border emphasis on focus
 * - Material blue color palette
 */
export const MaterialTheme: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        Label: 'Country (Material Theme)',
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', fontFamily: 'var(--rcss-font-family)' }}>
                <style>{`
                    /* Apply material theme to this story */
                    .material-theme-container {
                        --rcss-primary-color: #1976d2;
                        --rcss-primary-hover: #1565c0;
                        --rcss-border-color: #bdbdbd;
                        --rcss-border-radius: 4px;
                        --rcss-focus-ring-color: rgba(25, 118, 210, 0.3);
                        --rcss-text-color: #212121;
                        --rcss-label-color: #616161;
                        --rcss-background-color: #ffffff;
                        --rcss-disabled-background: #fafafa;
                        --rcss-font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                        --rcss-font-size: 1rem;
                        --rcss-label-font-size: 0.875rem;
                        --rcss-spacing: 0.5rem;
                    }
                    .material-theme-container label {
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        font-size: 0.75rem;
                    }
                    .material-theme-container select,
                    .material-theme-container input {
                        padding: 1rem 0.875rem;
                        border-bottom-width: 2px;
                        background-color: #fafafa;
                    }
                    .material-theme-container select:focus,
                    .material-theme-container input:focus {
                        background-color: #ffffff;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                `}</style>
                <div className="material-theme-container" style={{ maxWidth: '400px' }}>
                    <Story />
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#616161' }}>
                        ✨ Material Design inspired with elevated surfaces
                    </p>
                </div>
            </div>
        ),
    ],
};

/**
 * Bootstrap Theme Example
 * 
 * A theme inspired by Bootstrap 5's form controls.
 * Features:
 * - Familiar Bootstrap styling
 * - Standard Bootstrap spacing and sizing
 * - Bootstrap blue color palette
 * - Bootstrap focus ring effect
 */
export const BootstrapTheme: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        Label: 'Country (Bootstrap Theme)',
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', fontFamily: 'var(--rcss-font-family)' }}>
                <style>{`
                    /* Apply bootstrap theme to this story */
                    .bootstrap-theme-container {
                        --rcss-primary-color: #0d6efd;
                        --rcss-primary-hover: #0b5ed7;
                        --rcss-border-color: #dee2e6;
                        --rcss-border-radius: 0.375rem;
                        --rcss-focus-ring-color: rgba(13, 110, 253, 0.25);
                        --rcss-text-color: #212529;
                        --rcss-label-color: #212529;
                        --rcss-background-color: #ffffff;
                        --rcss-disabled-background: #e9ecef;
                        --rcss-font-size: 1rem;
                        --rcss-label-font-size: 1rem;
                        --rcss-spacing: 0.5rem;
                    }
                    .bootstrap-theme-container select,
                    .bootstrap-theme-container input {
                        padding: 0.375rem 0.75rem;
                        border-color: #ced4da;
                    }
                    .bootstrap-theme-container select:focus,
                    .bootstrap-theme-container input:focus {
                        border-color: #86b7fe;
                        box-shadow: 0 0 0 0.25rem var(--rcss-focus-ring-color);
                    }
                `}</style>
                <div className="bootstrap-theme-container" style={{ maxWidth: '400px' }}>
                    <Story />
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6c757d' }}>
                        ✨ Bootstrap 5 inspired form control styling
                    </p>
                </div>
            </div>
        ),
    ],
};

/**
 * Theme Comparison
 * 
 * See all three themes side by side for easy comparison.
 */
export const ThemeComparison: Story = {
    args: {
        onCountryChange: (country) => console.log('Selected country:', country),
        selectedCountry: 'US',
        culture: 'en-US',
        Label: 'Country',
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', fontFamily: 'var(--rcss-font-family)' }}>
                <style>{`
                    .theme-comparison-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 2rem;
                        margin-bottom: 2rem;
                    }
                    .theme-card {
                        border: 1px solid #e5e7eb;
                        border-radius: 0.5rem;
                        padding: 1.5rem;
                        background: white;
                    }
                    .theme-card h3 {
                        margin: 0 0 1rem 0;
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: #1f2937;
                    }
                    
                    /* Minimal theme styles */
                    .theme-minimal {
                        --rcss-primary-color: #3b82f6;
                        --rcss-primary-hover: #2563eb;
                        --rcss-border-color: #e5e7eb;
                        --rcss-border-radius: 0.25rem;
                        --rcss-font-size: 0.875rem;
                        --rcss-label-font-size: 0.875rem;
                    }
                    
                    /* Material theme styles */
                    .theme-material {
                        --rcss-primary-color: #1976d2;
                        --rcss-border-color: #bdbdbd;
                        --rcss-border-radius: 4px;
                    }
                    .theme-material label {
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        font-size: 0.75rem;
                    }
                    .theme-material select {
                        padding: 1rem 0.875rem;
                        background-color: #fafafa;
                        border-bottom-width: 2px;
                    }
                    
                    /* Bootstrap theme styles */
                    .theme-bootstrap {
                        --rcss-primary-color: #0d6efd;
                        --rcss-border-color: #ced4da;
                    }
                    .theme-bootstrap select {
                        padding: 0.375rem 0.75rem;
                    }
                `}</style>
                <div className="theme-comparison-grid">
                    <div className="theme-card theme-minimal">
                        <h3>Minimal</h3>
                        <Story />
                    </div>
                    <div className="theme-card theme-material">
                        <h3>Material</h3>
                        <Story />
                    </div>
                    <div className="theme-card theme-bootstrap">
                        <h3>Bootstrap</h3>
                        <Story />
                    </div>
                </div>
                <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563' }}>
                        💡 <strong>Tip:</strong> Click on each dropdown to see the different focus states and hover effects for each theme.
                    </p>
                </div>
            </div>
        ),
    ],
};

/**
 * Combined Dropdowns with Theme
 * 
 * Example showing Country and State dropdowns together with a preset theme.
 */
export const CombinedDropdownsWithTheme: Story = {
    render: () => {
        const [country, setCountry] = React.useState<string>('US');
        const [state, setState] = React.useState<string>('TX');

        return (
            <div style={{ padding: '2rem', fontFamily: 'var(--rcss-font-family)' }}>
                <style>{`
                    .combined-theme-container {
                        --rcss-primary-color: #1976d2;
                        --rcss-primary-hover: #1565c0;
                        --rcss-border-color: #bdbdbd;
                        --rcss-border-radius: 4px;
                        --rcss-focus-ring-color: rgba(25, 118, 210, 0.3);
                        --rcss-text-color: #212121;
                        --rcss-label-color: #616161;
                    }
                    .combined-theme-container label {
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        font-size: 0.75rem;
                    }
                    .combined-theme-container select {
                        padding: 1rem 0.875rem;
                        background-color: #fafafa;
                        border-bottom-width: 2px;
                    }
                    .combined-theme-container select:focus {
                        background-color: #ffffff;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                `}</style>
                <div className="combined-theme-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: '#212121' }}>Address Information</h2>
                    <CountryDropdown
                        selectedCountry={country}
                        onCountryChange={setCountry}
                        culture="en-US"
                        Label="Country"
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <StateDropdown
                            selectedState={state}
                            onStateChange={setState}
                            country={country as Country}
                            culture="en-US"
                            Label="State/Province"
                        />
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#616161' }}>
                        This example shows how Country and State dropdowns work together with the Material theme applied.
                    </p>
                </div>
            </div>
        );
    },
};
