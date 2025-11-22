# react-country-state-selector

[![GitHub Actions](https://github.com/utdcometsoccer/react-country-state-selector/actions/workflows/publish.yml/badge.svg)](https://github.com/utdcometsoccer/react-country-state-selector/actions)
[![Tests](https://img.shields.io/badge/tests-128%2B%20passing-brightgreen)](https://github.com/utdcometsoccer/react-country-state-selector/actions)
[![npm version](https://badge.fury.io/js/@idahoedokpayi%2Freact-country-state-selector.svg)](https://www.npmjs.com/package/@idahoedokpayi/react-country-state-selector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Internationalization First!**

This library provides React components for country and state/province selection, designed for easy internationalization and localization. Out of the box, it supports:

- United States
- Mexico
- Canada

in **English**, **Spanish**, and **French**.

## Features

- 🔍 **Optional search/filter** - Built-in search functionality for mobile users and long lists
- 🌍 **Dynamic loading** of country and state/province data based on user culture
- 🔤 **ISO Standards Compliance** - ISO 3166-1 country codes and ISO 639-1 language codes
- 🎨 **Flexible customization** - Custom labels, CSS classes, and data sources
- ♿ **Accessibility first** - Full ARIA support and screen reader compatibility
- 🧪 **Thoroughly tested** - 144+ comprehensive unit tests with 100% backward compatibility
- 🏗️ **Clean architecture** - Centralized culture resolution logic with robust error handling
- 🎯 **TypeScript support** - Full type safety and IntelliSense support
- 📱 **Mobile-friendly** - Optimized touch interactions and native keyboard support

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

## Search/Filter Functionality

All dropdown components support optional search/filter functionality, which is particularly useful on mobile devices and for long lists. When enabled, users can type to search and filter options in real-time.

### Enabling Search

Simply add the `enableSearch` prop to any dropdown component:

```jsx
import { CountryDropdown } from 'react-country-state-selector';

const App = () => {
  const [country, setCountry] = useState('');

  return (
    <CountryDropdown 
      selectedCountry={country}
      onCountryChange={setCountry}
      culture="en-US"
      Label="Select Country"
      enableSearch={true}  // Enable search functionality
    />
  );
};
```

### How It Works

- When `enableSearch={true}`, the dropdown renders as a searchable input field with autocomplete suggestions
- Users can type to filter options in real-time
- Works on all devices, including mobile
- Uses native HTML5 `<datalist>` for optimal performance and accessibility
- Automatically matches input by name or code
- Falls back to standard `<select>` when `enableSearch` is `false` or omitted

### Mobile-Friendly

The search functionality is designed with mobile users in mind:
- Large, touch-friendly input fields
- Native mobile keyboard support
- Autocomplete suggestions adapt to mobile screens
- Fast filtering for large lists (like all countries)

### Examples

**StateDropdown with Search**
```jsx
<StateDropdown 
  selectedState={state}
  onStateChange={setState}
  country="US"
  culture="en-US"
  Label="Select State"
  enableSearch={true}
/>
```

**LanguageDropdown with Search**
```jsx
<LanguageDropdown 
  selectedLanguage={language}
  onLanguageChange={setLanguage}
  culture="en-US"
  Label="Select Language"
  enableSearch={true}
/>
```

### Backward Compatibility

The `enableSearch` prop is **optional and defaults to `false`**, ensuring complete backward compatibility with existing implementations. Your existing code will continue to work exactly as before without any changes.

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
- `enableSearch` (boolean, optional): Enables search/filter functionality. Default: `false`.
- `showLoadingIndicator` (boolean, default: true): Whether to display a loading indicator while data is loading.
- `customLoadingIndicator` (ReactNode): Custom loading indicator component to replace the default spinner.
- `loadingText` (string, default: "Loading country information..."): Custom text to display with the loading indicator.

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
- `enableSearch` (boolean, optional): Enables search/filter functionality. Default: `false`.
- `showLoadingIndicator` (boolean, default: true): Whether to display a loading indicator while data is loading.
- `customLoadingIndicator` (ReactNode): Custom loading indicator component to replace the default spinner.
- `loadingText` (string, default: "Loading state/province information..."): Custom text to display with the loading indicator.

### LanguageDropdown Props

- `selectedLanguage` (string): The currently selected language code.
- `onLanguageChange` (function): Callback when the language selection changes.
- `culture` (string | CultureInfo): The culture/language to use for language data.
- `languageInformation` (array): Custom array of language objects to display.
- `getLanguageInformation` (function): Custom function to fetch language data by culture.
- `Label` (string): Text for the label element.
- `classNameLabel` (string): CSS class for the label element.
- `classNameSelect` (string): CSS class for the select element.
- `enableSearch` (boolean, optional): Enables search/filter functionality. Default: `false`.
- `showLoadingIndicator` (boolean, default: true): Whether to display a loading indicator while data is loading.
- `customLoadingIndicator` (ReactNode): Custom loading indicator component to replace the default spinner.
- `loadingText` (string, default: "Loading language information..."): Custom text to display with the loading indicator.

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

- **144+ comprehensive unit tests** covering all components and utilities
- **24+ dedicated tests** for search/filter functionality
- **128+ comprehensive unit tests** covering all components and utilities
- **20+ dedicated tests** for culture resolution logic
- **15+ tests** for loading indicator functionality
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

## Loading Indicators

All dropdown components display a loading indicator while data is being fetched. The loading indicators are fully customizable:

### Default Loading Indicator

By default, all components show an animated spinner with descriptive text:

```jsx
<CountryDropdown 
  selectedCountry=""
  onCountryChange={handleCountryChange}
  culture="en-US"
/>
// Shows: animated spinner with "Loading country information..."
```

### Disable Loading Indicator

You can hide the loading indicator completely:

```jsx
<CountryDropdown 
  selectedCountry=""
  onCountryChange={handleCountryChange}
  culture="en-US"
  showLoadingIndicator={false}
/>
// No loading indicator will be shown
```

### Custom Loading Text

Customize the loading message:

```jsx
<StateDropdown 
  selectedState=""
  onStateChange={handleStateChange}
  country="US"
  culture="en-US"
  loadingText="Please wait, fetching states..."
/>
// Shows: spinner with "Please wait, fetching states..."
```

### Custom Loading Indicator

Replace the default spinner with your own component:

```jsx
const MyCustomSpinner = () => (
  <div style={{ padding: '10px' }}>
    <img src="/my-loader.gif" alt="Loading" />
    <span>Loading data...</span>
  </div>
);

<LanguageDropdown 
  selectedLanguage=""
  onLanguageChange={handleLanguageChange}
  culture="en-US"
  customLoadingIndicator={<MyCustomSpinner />}
/>
```

### Using the LoadingSpinner Component

The library exports the `LoadingSpinner` component that you can use independently:

```jsx
import { LoadingSpinner } from 'react-country-state-selector';

// In your component
<LoadingSpinner text="Loading..." />
```
  ]} 
/>
```

## Loading Indicators

All dropdown components display a loading indicator while data is being fetched. The loading indicators are fully customizable:

### Default Loading Indicator

By default, all components show an animated spinner with descriptive text:

```jsx
<CountryDropdown 
  selectedCountry=""
  onCountryChange={handleCountryChange}
  culture="en-US"
/>
// Shows: animated spinner with "Loading country information..."
```

### Disable Loading Indicator

You can hide the loading indicator completely:

```jsx
<CountryDropdown 
  selectedCountry=""
  onCountryChange={handleCountryChange}
  culture="en-US"
  showLoadingIndicator={false}
/>
// No loading indicator will be shown
```

### Custom Loading Text

Customize the loading message:

```jsx
<StateDropdown 
  selectedState=""
  onStateChange={handleStateChange}
  country="US"
  culture="en-US"
  loadingText="Please wait, fetching states..."
/>
// Shows: spinner with "Please wait, fetching states..."
```

### Custom Loading Indicator

Replace the default spinner with your own component:

```jsx
const MyCustomSpinner = () => (
  <div style={{ padding: '10px' }}>
    <img src="/my-loader.gif" alt="Loading" />
    <span>Loading data...</span>
  </div>
);

<LanguageDropdown 
  selectedLanguage=""
  onLanguageChange={handleLanguageChange}
  culture="en-US"
  customLoadingIndicator={<MyCustomSpinner />}
/>
```

### Using the LoadingSpinner Component

The library exports the `LoadingSpinner` component that you can use independently:

```jsx
import { LoadingSpinner } from 'react-country-state-selector';

// In your component
<LoadingSpinner text="Loading..." />
```
  ]} 
/>
```

### Organizing Long Lists with Optgroups

For better organization of long lists, you can group options using the optional `group` property. This is particularly useful for organizing countries by region, states by geographic area, or languages by family.

When any item in your data has a `group` property, items will be automatically organized into `<optgroup>` elements:

```tsx
// Group countries by continent
<CountryDropdown 
  countryInformation={[
    { code: 'US', name: 'United States', group: 'North America' },
    { code: 'CA', name: 'Canada', group: 'North America' },
    { code: 'MX', name: 'Mexico', group: 'North America' },
    { code: 'FR', name: 'France', group: 'Europe' },
    { code: 'DE', name: 'Germany', group: 'Europe' },
    { code: 'JP', name: 'Japan', group: 'Asia' }
  ]}
  onCountryChange={handleChange}
/>

// Group states by region
<StateDropdown 
  country="US"
  stateProvinceInformation={[
    { code: 'CA', name: 'California', group: 'West Coast' },
    { code: 'WA', name: 'Washington', group: 'West Coast' },
    { code: 'NY', name: 'New York', group: 'East Coast' },
    { code: 'FL', name: 'Florida', group: 'East Coast' }
  ]}
  onStateChange={handleChange}
/>

// Group languages by language family
<LanguageDropdown 
  languageInformation={[
    { code: 'en', name: 'English', group: 'Germanic' },
    { code: 'de', name: 'German', group: 'Germanic' },
    { code: 'es', name: 'Spanish', group: 'Romance' },
    { code: 'fr', name: 'French', group: 'Romance' }
  ]}
  onLanguageChange={handleChange}
/>
```

**Notes:**
- The `group` property is completely optional - items without it will render normally
- Groups are displayed in the order they first appear in the data
- Ungrouped items (without a `group` property) are rendered first, followed by grouped items
- This feature works with all three dropdown components: CountryDropdown, StateDropdown, and LanguageDropdown

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