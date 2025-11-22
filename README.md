# react-country-state-selector

[![GitHub Actions](https://github.com/utdcometsoccer/react-country-state-selector/actions/workflows/publish.yml/badge.svg)](https://github.com/utdcometsoccer/react-country-state-selector/actions)
[![Tests](https://img.shields.io/badge/tests-113%2B%20passing-brightgreen)](https://github.com/utdcometsoccer/react-country-state-selector/actions)
[![npm version](https://badge.fury.io/js/@idahoedokpayi%2Freact-country-state-selector.svg)](https://www.npmjs.com/package/@idahoedokpayi/react-country-state-selector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Internationalization First!**

This library provides React components for country and state/province selection, designed for easy internationalization and localization. Out of the box, it supports:

- United States
- Mexico
- Canada

in **English**, **Spanish**, and **French**.

## Features

- 🌍 **Dynamic loading** of country and state/province data based on user culture
- 🔤 **ISO Standards Compliance** - ISO 3166-1 country codes and ISO 639-1 language codes
- 🎨 **Flexible customization** - Custom labels, CSS classes, and data sources
- ♿ **Accessibility first** - Full ARIA support and screen reader compatibility
- 🧪 **Thoroughly tested** - 113+ comprehensive unit tests with 100% backward compatibility
- 🏗️ **Clean architecture** - Centralized culture resolution logic with robust error handling
- 🎯 **TypeScript support** - Full type safety and IntelliSense support

## Installation

This package requires `react` and `react-dom` as peer dependencies. Make sure you have them installed in your project:

```sh
npm install react react-dom
```

To install the library, you can use npm or yarn:

```bash
npm install react-country-state-selector
```

or

```bash
yarn add react-country-state-selector
```

## Usage

### CountryDropdown

The `CountryDropdown` component allows users to select a country from a dropdown list with automatic culture resolution.

```jsx
import { CountryDropdown } from 'react-country-state-selector';
import { CultureInfo } from 'react-country-state-selector';

const App = () => {
  const handleCountryChange = (country) => {
    console.log('Selected country:', country);
  };

  return (
    <CountryDropdown 
      selectedCountry=""
      onCountryChange={handleCountryChange}
      culture="es-MX" // Supports string or CultureInfo object
      Label="Select Country"
    />
  );
};
```

### StateDropdown

The `StateDropdown` component allows users to select a state/province based on the selected country with intelligent culture handling.

```jsx
import { StateDropdown } from 'react-country-state-selector';

const App = () => {
  const handleStateChange = (state) => {
    console.log('Selected state:', state);
  };

  return (
    <StateDropdown 
      selectedState=""
      onStateChange={handleStateChange}
      country="CA"
      culture="fr-CA" // Automatically resolves culture preferences
      Label="Select Province"
    />
  );
};
```

### LanguageDropdown

The `LanguageDropdown` component allows users to select a language with culture-aware display names.

```jsx
import { LanguageDropdown } from 'react-country-state-selector';

const App = () => {
  const handleLanguageChange = (language) => {
    console.log('Selected language:', language);
  };

  return (
    <LanguageDropdown 
      selectedLanguage=""
      onLanguageChange={handleLanguageChange}
      culture="en-US"
      Label="Select Language"
    />
  );
};
```

## Props Reference

### CountryDropdown Props

- `selectedCountry` (string): The currently selected country code.
- `onCountryChange` (function): Callback when the country selection changes.
- `culture` (string | CultureInfo): The culture/language to use for country data.
- `countryInformation` (array): Custom array of country objects to display.
- `getCountryInformation` (function): Custom function to fetch country data by culture.
- `Label` (string): Text for the label element.
- `classNameLabel` (string): CSS class for the label element.
- `classNameSelect` (string): CSS class for the select element.

### StateDropdown Props

- `selectedState` (string): The currently selected state/province code.
- `onStateChange` (function): Callback when the state/province selection changes.
- `culture` (string | CultureInfo): The culture/language to use for state/province data.
- `country` (string): The country code to use for state/province data.
- `stateProvinceInformation` (array): Custom array of state/province objects to display.
- `getStateProvinceInformation` (function): Custom function to fetch state/province data by culture.
- `Label` (string): Text for the label element.
- `classNameLabel` (string): CSS class for the label element.
- `classNameSelect` (string): CSS class for the select element.

### LanguageDropdown Props

- `selectedLanguage` (string): The currently selected language code.
- `onLanguageChange` (function): Callback when the language selection changes.
- `culture` (string | CultureInfo): The culture/language to use for language data.
- `languageInformation` (array): Custom array of language objects to display.
- `getLanguageInformation` (function): Custom function to fetch language data by culture.
- `Label` (string): Text for the label element.
- `classNameLabel` (string): CSS class for the label element.
- `classNameSelect` (string): CSS class for the select element.

## Culture Resolution

The library features intelligent culture resolution with a priority-based system:

1. **CultureInfo object** - Direct culture object passed as prop
2. **Culture string** - String culture code (e.g., "en-US", "fr-CA") 
3. **Browser fallback** - Automatically detects user's browser language

```jsx
import { CultureInfo } from 'react-country-state-selector';

// Option 1: CultureInfo object (highest priority)
const culture = new CultureInfo('fr-CA');
<CountryDropdown culture={culture} />

// Option 2: String culture (medium priority)
<CountryDropdown culture="es-MX" />

// Option 3: Browser detection (automatic fallback)
<CountryDropdown /> // Uses browser language automatically
```

## Testing & Quality

This library is built with quality and reliability in mind:

- **113+ comprehensive unit tests** covering all components and utilities
- **20+ dedicated tests** for culture resolution logic
- **Integration tests** ensuring component compatibility
- **Error handling tests** for robust fallback mechanisms
- **Accessibility tests** for ARIA compliance and screen reader support
- **100% backward compatibility** maintained across all updates

## Standards Compliance

Country codes are based on the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard. State and province codes are based on official government sources and follow the conventions of [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) where applicable. This ensures broad compatibility and internationalization support.

## Customization

You can insert your own countries, states/provinces, and languages by passing custom arrays to the respective props. This allows you to extend or override the built-in data for your specific use cases or regions.

Examples:

```tsx
// Custom countries
<CountryDropdown 
  countryInformation={[
    { code: 'XX', name: 'My Country' },
    { code: 'YY', name: 'Another Country' }
  ]} 
/>

// Custom states/provinces
<StateDropdown 
  stateProvinceInformation={[
    { code: 'ST', displayName: 'My State' },
    { code: 'PR', displayName: 'My Province' }
  ]} 
/>

// Custom languages
<LanguageDropdown 
  languageInformation={[
    { code: 'xx', name: 'My Language' },
    { code: 'yy', name: 'Another Language' }
  ]} 
/>
```

### Custom Data Loading Functions

You can also provide custom functions to load data dynamically. The library exports default implementations that you can use as reference:

```tsx
import { 
  StateDropdown, 
  defaultGetStateProvinceInformation,
  CultureInfo 
} from 'react-country-state-selector';

// Use the default function directly
const myCustomFunction = async (cultureInfo: CultureInfo) => {
  // You can call the default implementation
  const defaultData = await defaultGetStateProvinceInformation(cultureInfo);
  
  // Then modify or extend it
  return [...defaultData, { code: 'XX', name: 'Custom State' }];
};

<StateDropdown 
  getStateProvinceInformation={myCustomFunction}
  country="US"
  onStateChange={handleChange}
/>
```

Available default functions:
- `defaultGetStateProvinceInformation` - Default state/province data loader
- `getStateProvinceInformationByCulture` - Alias for the above
- `getCountryInformationByCulture` - Default country data loader
- `getLanguageInformationByCulture` - Default language data loader

## Styling

The library includes **default, accessible styling** out of the box that can be easily customized to match your design system.

### Including the Default Styles

To use the default styles, import the CSS file in your application:

```tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';
```

The default styles include:
- Clean, modern appearance with rounded corners
- Focus states with visible ring for keyboard navigation
- Hover states for better user feedback
- Disabled states with reduced opacity
- Error message styling
- High contrast mode support for accessibility
- Reduced motion support for users with motion sensitivities
- Responsive design that works on all screen sizes

### Customizing Styles with CSS Variables

The library uses **CSS custom properties (variables)** for easy customization. Override these variables to match your brand:

```css
:root {
  /* Primary colors */
  --rcss-primary-color: #0066cc;
  --rcss-primary-hover: #0052a3;
  
  /* Border styling */
  --rcss-border-color: #d1d5db;
  --rcss-border-radius: 0.375rem;
  
  /* Focus ring */
  --rcss-focus-ring-color: rgba(0, 102, 204, 0.4);
  
  /* Text colors */
  --rcss-text-color: #1f2937;
  --rcss-label-color: #374151;
  
  /* Backgrounds */
  --rcss-background-color: #ffffff;
  --rcss-disabled-background: #f3f4f6;
  
  /* Error styling */
  --rcss-error-color: #dc2626;
  --rcss-error-background: #fef2f2;
  --rcss-error-border: #fecaca;
  
  /* Typography */
  --rcss-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --rcss-font-size: 1rem;
  --rcss-label-font-size: 0.875rem;
  
  /* Spacing */
  --rcss-spacing: 0.5rem;
}
```

**Note about dropdown arrow color**: The dropdown arrow color is embedded in an SVG data URI and cannot be changed via CSS variables due to browser limitations. To customize the arrow color, you need to override the entire `background-image` property. See the [Styling Guide](./docs/STYLING.md) for examples.

### Using Custom CSS Classes

For complete control, you can provide your own CSS classes using the `classNameLabel` and `classNameSelect` props:

```tsx
<CountryDropdown
  selectedCountry=""
  onCountryChange={handleChange}
  classNameLabel="my-custom-label"
  classNameSelect="my-custom-select"
/>
```

Then style them in your CSS:

```css
.my-custom-label {
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
}

.my-custom-select {
  border: 2px solid #4a5568;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
}
```

### Completely Unstyled Components

If you want to start from scratch, you can skip importing the CSS file and provide your own classes:

```tsx
// Don't import the CSS file
// import 'react-country-state-selector/dist/react-country-state-selector.css';

<CountryDropdown
  selectedCountry=""
  onCountryChange={handleChange}
  classNameLabel="your-label-class"
  classNameSelect="your-select-class"
/>
```

The components will render with only your custom classes and no default styling.

### Accessibility Features

The default styles include important accessibility features:
- **WCAG 2.1 AA compliant** color contrast ratios
- **Focus indicators** that are clearly visible
- **High contrast mode** support for better visibility
- **Reduced motion** support for users who prefer less animation
- **Screen reader friendly** with proper ARIA attributes

For more details on styling and customization, see the [Styling Guide](./docs/STYLING.md).

## Architecture

The library features a clean, maintainable architecture:

- **Centralized culture resolution** - Single utility handles all culture logic
- **Type-safe components** - Full TypeScript support with proper interfaces
- **Modular design** - Each component is self-contained with clear responsibilities
- **Error boundaries** - Graceful error handling with user-friendly fallbacks
- **Performance optimized** - Efficient data loading and caching strategies

## License

This project is licensed under the MIT License.