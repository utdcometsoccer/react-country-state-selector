# react-country-state-selector

[![GitHub Actions](https://github.com/utdcometsoccer/react-country-state-selector/actions/workflows/publish.yml/badge.svg)](https://github.com/utdcometsoccer/react-country-state-selector/actions)
[![Tests](https://img.shields.io/badge/tests-261%2B%20passing-brightgreen)](https://github.com/utdcometsoccer/react-country-state-selector/actions)
[![npm version](https://badge.fury.io/js/@idahoedokpayi%2Freact-country-state-selector.svg)](https://www.npmjs.com/package/@idahoedokpayi/react-country-state-selector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Internationalization First!**

This library provides React components for country and state/province selection, designed for easy internationalization and localization. Out of the box, it supports:

- United States
- Mexico
- Canada

in **English**, **Spanish**, and **French**.

## Features

- ⚡ **Performance optimized** - Code splitting with dynamic imports keeps bundle size minimal (~18 KB gzipped core)
- 🔍 **Optional search/filter** - Built-in search functionality for mobile users and long lists
- 🌍 **Dynamic loading** of country and state/province data based on user culture
- 🔤 **ISO Standards Compliance** - ISO 3166-1 country codes and ISO 639-1 language codes
- 🚀 **Virtual scrolling** - Optimized performance for long lists using react-window
- 🎨 **Flexible customization** - Custom labels, CSS classes, and data sources
- ♿ **Accessibility first** - Full ARIA support, screen reader compatibility, and WCAG 2.1 compliance
- ✅ **Required field validation** - Built-in support for required fields with visual indicators and ARIA attributes
- 🛡️ **Error boundaries** - Graceful error handling with customizable fallback UI
- 🧪 **Thoroughly tested** - 261+ comprehensive unit tests with 100% backward compatibility
- 🏗️ **Clean architecture** - Centralized culture resolution logic with robust error handling
- 🎯 **TypeScript support** - Full type safety and IntelliSense support
- 📱 **Mobile-first design** - Touch-optimized with 44x44px minimum touch targets, responsive CSS, and mobile testing guidelines

## Quick Links

- [📱 Mobile & Touch Optimization Guide](./docs/MOBILE.md) - Comprehensive mobile best practices and testing
- [♿ Accessibility Documentation](./docs/ACCESSIBILITY.md) - WCAG compliance and screen reader support
- [🎨 Styling Guide](./docs/STYLING.md) - Customization and theming options
- [✅ Required Field Validation](./docs/REQUIRED-FIELD-VALIDATION.md) - Form validation and ARIA accessibility
- [🛡️ Error Handling & Recovery](./docs/ERROR-HANDLING.md) - Error boundaries and retry mechanisms

## Performance & Bundle Size

This library is designed with performance in mind, implementing several optimization strategies to minimize bundle size and maximize runtime efficiency.

### Bundle Size Impact

The library uses **code splitting** and **dynamic imports** to ensure you only load the data you actually need. Bundle size measurements below are from the Vite build output:

**Core Library (always loaded):**
- ES Module: **65.22 KB** (14.55 KB gzipped)
- UMD Module: **90.36 KB** (22.35 KB gzipped)
- CSS Styles: **27.12 KB** (3.18 KB gzipped)

**Data Files (loaded on-demand):**
- Country data per locale: **~8.6-8.7 KB each** (~2.4 KB gzipped)
- Language data per locale: **~8.3-8.4 KB each** (~1.5 KB gzipped)  
- State/Province data per locale: **0.8-3.1 KB each** (0.3-0.7 KB gzipped)

**Total Initial Bundle:** **~92 KB** uncompressed or **~18 KB gzipped** for the core library (ES + CSS) without any data files.

### Dynamic Data Loading

All country, state, and language data files are loaded **dynamically** using JavaScript's native `import()` function. This means:

✅ **Only requested locales are downloaded** - If a user needs English (US) country data, Spanish (Mexico) and French (Canada) data are never loaded  
✅ **Data files are code-split automatically** - Each locale's data becomes a separate chunk  
✅ **Browser caching is effective** - Unchanged data files remain cached between updates  
✅ **Parallel loading when needed** - Multiple locales can load simultaneously without blocking

**Example: How Dynamic Loading Works**

```typescript
// This code from getCountryInformationByCulture uses dynamic imports
const data = await import(`../components/CountryDropdown/${fileName}.json`);

// Result: Only the specific locale file is loaded:
// ✅ countries.en-us.json → 8.74 KB (2.44 KB gzipped) 
// ❌ countries.es-mx.json → NOT loaded (saved 8.63 KB)
// ❌ countries.fr-ca.json → NOT loaded (saved 8.61 KB)
```

### Virtual Scrolling Performance

For dropdowns with more than 50 items (configurable), the library automatically uses **virtual scrolling** powered by `react-window`:

✅ **Constant rendering performance** - Only visible items are rendered (typically 10-20 DOM nodes)  
✅ **Smooth scrolling** - 60 FPS even with 250+ countries or 185+ languages  
✅ **Reduced memory footprint** - Minimal DOM nodes regardless of list size  
✅ **Instant dropdown opening** - No lag when opening large lists

**Performance Comparison:**

| List Size | Without Virtualization | With Virtualization |
|-----------|----------------------|---------------------|
| 50 items  | 50 DOM nodes | ~15 DOM nodes |
| 185 items | 185 DOM nodes | ~15 DOM nodes |
| 250 items | 250 DOM nodes | ~15 DOM nodes |

### Search/Filter Optimization

The optional search functionality reduces the visible options in real-time:

✅ **Instant filtering** - Native browser autocomplete with `<datalist>`  
✅ **Reduced rendering** - Only matching items are displayed  
✅ **Mobile-optimized** - Leverages native mobile keyboard and autocomplete  
✅ **No additional bundle cost** - Uses native HTML5 features

### Best Practices for Optimal Performance

1. **Specify culture explicitly** when possible to avoid browser detection overhead:
   ```jsx
   <CountryDropdown culture="en-US" /> // Preferred
   ```

2. **Reuse data** across components by passing `countryInformation` prop:
   ```jsx
   const [countries, setCountries] = useState([]);
   
   useEffect(() => {
     getCountryInformationByCulture(new CultureInfo('en-US'))
       .then(setCountries);
   }, []);
   
   // Reuse the same data, avoiding duplicate requests
   <CountryDropdown countryInformation={countries} />
   ```

3. **Enable search** for long lists to improve user experience:
   ```jsx
   <CountryDropdown enableSearch={true} /> // Better UX for 250+ countries
   ```

4. **Keep virtual scrolling enabled** (default) for optimal performance with large lists.

5. **Use tree shaking** in your bundler to exclude unused exports.

### Production Build Recommendations

For the smallest possible bundle:

```javascript
// webpack.config.js or similar
module.exports = {
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

This ensures:
- Dead code elimination removes unused functions
- Data files are in separate chunks for better caching
- Only the locales you use are included in the final bundle

### Measuring Bundle Impact

To analyze the bundle size impact in your application:

```bash
# Using webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Using source-map-explorer  
npm install --save-dev source-map-explorer
npx source-map-explorer dist/bundle.js
```

**Expected Impact on Your Bundle:**
- Minimal: **~21 KB gzipped** (core + one locale with country data)
- Typical: **~25 KB gzipped** (core + 2-3 locales)
- Maximum: **~37 KB gzipped** (core + all locale files)

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

## Virtual Scrolling

All dropdown components now feature **virtual scrolling** for improved performance with long lists. Virtual scrolling renders only the visible items in the dropdown, significantly improving performance when dealing with large datasets like the full list of countries (250+ items) or languages (185+ items).

### How It Works

Virtual scrolling is **automatically enabled** when the number of options exceeds a threshold (default: 50 items). This means:

- **Country Dropdown**: Virtual scrolling enabled (250+ countries)
- **Language Dropdown**: Virtual scrolling enabled (185+ languages)  
- **State Dropdown**: Standard rendering (typically < 50 states per country)

You can see the performance benefits when interacting with dropdowns containing many options - the dropdown opens instantly and scrolling is smooth regardless of the list size.

### Configuration

You can control virtual scrolling behavior using these props:

```jsx
<CountryDropdown 
  selectedCountry={country}
  onCountryChange={handleCountryChange}
  // Enable or disable virtual scrolling (default: true)
  enableVirtualScrolling={true}
  // Set the threshold for when to use virtual scrolling (default: 50)
  virtualScrollThreshold={100}
/>
```

**Props:**
- `enableVirtualScrolling` (boolean, default: `true`): Enable or disable virtual scrolling globally
- `virtualScrollThreshold` (number, default: `50`): Minimum number of items required to trigger virtual scrolling

### Features

- ✅ **Automatic activation** - No configuration needed for most use cases
- ✅ **Keyboard navigation** - Full support for arrow keys and Enter/Escape
- ✅ **Grouped options** - Works seamlessly with optgroup functionality
- ✅ **Accessibility** - Maintains all ARIA attributes and screen reader support
- ✅ **Smooth scrolling** - Optimized rendering for large lists
- ✅ **Backward compatible** - Can be disabled if needed

### Example with Custom Threshold

```jsx
// Only use virtual scrolling for very large lists
<LanguageDropdown
  selectedLanguage={language}
  onLanguageChange={handleLanguageChange}
  enableVirtualScrolling={true}
  virtualScrollThreshold={100} // Only virtualize if more than 100 languages
/>

// Disable virtual scrolling completely
<CountryDropdown
  selectedCountry={country}
  onCountryChange={handleCountryChange}
  enableVirtualScrolling={false} // Use standard rendering for all list sizes
/>
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

## Mobile-First & Touch Optimization

This library is built with a **mobile-first approach**, ensuring excellent usability on smartphones, tablets, and touch-enabled devices.

### ✅ Mobile Features

- **Touch-Optimized Targets**: All interactive elements meet the 44x44px minimum touch target size (iOS HIG and Material Design standards)
- **Responsive CSS**: Automatically adapts to different screen sizes with mobile-specific optimizations
- **No Zoom on Input**: Font sizes optimized to prevent unwanted iOS zoom behavior
- **Search for Long Lists**: Enable `enableSearch` prop for easier navigation on mobile
- **Native Mobile Support**: Uses native HTML elements for optimal mobile browser integration

### Mobile-Optimized Example

```jsx
import { CountryDropdown } from 'react-country-state-selector';

function MobileOptimizedForm() {
  const [country, setCountry] = useState('');

  return (
    <div style={{ padding: '1rem' }}>
      <CountryDropdown 
        selectedCountry={country}
        onCountryChange={setCountry}
        culture="en-US"
        Label="Country"
        enableSearch={true}  // Recommended for mobile: easier than scrolling 250+ countries
      />
    </div>
  );
}
```

### Touch Target Specifications

The library implements responsive touch targets that automatically adjust based on device:

| Device Type | Min Touch Target | Font Size | Implementation |
|-------------|-----------------|-----------|----------------|
| Desktop | Auto (~40px) | 1rem (16px) | Default styling |
| Tablet/Mobile (≤768px) | 44px | 16px | iOS HIG standard |
| Small Phones (≤480px) | 48px | 16px | Material Design standard |

### 📱 Comprehensive Mobile Guide

For detailed mobile implementation guidance, testing procedures, and best practices, see our comprehensive [Mobile & Touch Optimization Guide](./docs/MOBILE.md).

The guide covers:
- Touch target guidelines and customization
- Mobile testing checklist for various devices
- Performance optimization tips
- Mobile-specific troubleshooting
- PWA integration considerations

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
- `enableVirtualScrolling` (boolean, default: `true`): Enable virtual scrolling for long lists.
- `virtualScrollThreshold` (number, default: `50`): Minimum items to trigger virtual scrolling.
- `enableSearch` (boolean, optional): Enables search/filter functionality. Default: `false`.
- `showLoadingIndicator` (boolean, default: true): Whether to display a loading indicator while data is loading.
- `customLoadingIndicator` (ReactNode): Custom loading indicator component to replace the default spinner.
- `loadingText` (string, default: "Loading country information..."): Custom text to display with the loading indicator.
- `required` (boolean, default: `false`): Whether the field is required. Adds visual asterisk and `aria-required` attribute.
- `validate` (function): Custom validation function that receives the selected value and returns an error message or undefined.
- `onValidationError` (function): Callback when validation error occurs.
- `onSuccess` (function): Callback triggered when a selection is successfully made.

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
- `enableVirtualScrolling` (boolean, default: `true`): Enable virtual scrolling for long lists.
- `virtualScrollThreshold` (number, default: `50`): Minimum items to trigger virtual scrolling.
- `enableSearch` (boolean, optional): Enables search/filter functionality. Default: `false`.
- `showLoadingIndicator` (boolean, default: true): Whether to display a loading indicator while data is loading.
- `customLoadingIndicator` (ReactNode): Custom loading indicator component to replace the default spinner.
- `loadingText` (string, default: "Loading state/province information..."): Custom text to display with the loading indicator.
- `required` (boolean, default: `false`): Whether the field is required. Adds visual asterisk and `aria-required` attribute.
- `validate` (function): Custom validation function that receives the selected value and returns an error message or undefined.
- `onValidationError` (function): Callback when validation error occurs.
- `onSuccess` (function): Callback triggered when a selection is successfully made.

### LanguageDropdown Props

- `selectedLanguage` (string): The currently selected language code.
- `onLanguageChange` (function): Callback when the language selection changes.
- `culture` (string | CultureInfo): The culture/language to use for language data.
- `languageInformation` (array): Custom array of language objects to display.
- `getLanguageInformation` (function): Custom function to fetch language data by culture.
- `Label` (string): Text for the label element.
- `classNameLabel` (string): CSS class for the label element.
- `classNameSelect` (string): CSS class for the select element.
- `enableVirtualScrolling` (boolean, default: `true`): Enable virtual scrolling for long lists.
- `virtualScrollThreshold` (number, default: `50`): Minimum items to trigger virtual scrolling.
- `enableSearch` (boolean, optional): Enables search/filter functionality. Default: `false`.
- `showLoadingIndicator` (boolean, default: true): Whether to display a loading indicator while data is loading.
- `customLoadingIndicator` (ReactNode): Custom loading indicator component to replace the default spinner.
- `loadingText` (string, default: "Loading language information..."): Custom text to display with the loading indicator.
- `required` (boolean, default: `false`): Whether the field is required. Adds visual asterisk and `aria-required` attribute.
- `validate` (function): Custom validation function that receives the selected value and returns an error message or undefined.
- `onValidationError` (function): Callback when validation error occurs.
- `onSuccess` (function): Callback triggered when a selection is successfully made.

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

## Required Field Validation

All dropdown components support required field validation with built-in accessibility features. This ensures WCAG 2.1 compliance and provides a great user experience.

### Basic Required Field

```jsx
<CountryDropdown
  selectedCountry={country}
  onCountryChange={setCountry}
  Label="Country"
  required={true}  // Adds visual asterisk and aria-required
/>
```

When `required={true}`:
- A visual asterisk (*) appears next to the label
- The `aria-required="true"` attribute is added for screen readers
- Validation error appears when no selection is made

### Custom Validation

You can provide custom validation logic using the `validate` prop:

```jsx
<StateDropdown
  selectedState={state}
  onStateChange={setState}
  country="US"
  Label="State"
  validate={(value) => {
    if (!value) return 'State is required';
    if (value === 'XX') return 'This state is not available';
    return undefined; // No error
  }}
  onValidationError={(error) => {
    console.log('Validation error:', error);
  }}
/>
```

### Success Callback

Use the `onSuccess` callback to be notified when a valid selection is made:

```jsx
<LanguageDropdown
  selectedLanguage={language}
  onLanguageChange={setLanguage}
  Label="Language"
  onSuccess={(value) => {
    console.log('Language selected successfully:', value);
    // Show success message, trigger analytics, etc.
  }}
/>
```

## Error Boundary

The library includes a `DropdownErrorBoundary` component that wraps all dropdowns automatically to catch and handle errors gracefully. You can also use it directly:

```jsx
import { DropdownErrorBoundary, CountryDropdown } from 'react-country-state-selector';

// Custom error handling
<DropdownErrorBoundary
  fallback={<div>Custom error message</div>}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('Dropdown error:', error);
  }}
>
  <CountryDropdown
    selectedCountry={country}
    onCountryChange={setCountry}
  />
</DropdownErrorBoundary>
```

### Error Recovery

All components include built-in error recovery with retry functionality:

- Up to 3 automatic retry attempts
- User-friendly error messages
- Recovery guidance after failed attempts
- Accessible error announcements via ARIA live regions

For more details, see the [Error Handling & Recovery Guide](./docs/ERROR-HANDLING.md).

## Testing & Quality

This library is built with quality and reliability in mind:

- **261+ comprehensive unit tests** covering all components and utilities, including:
  - **40+ tests** for dropdown components (CountryDropdown, StateDropdown, LanguageDropdown)
  - **24+ tests** for search/filter functionality
  - **20+ tests** for culture resolution logic
  - **15+ tests** for loading indicator functionality
  - **20+ tests** for required field validation
  - **18+ tests** for CultureInfo class
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

### Preset Themes

Choose from three ready-to-use preset themes:

```tsx
// Minimal - Clean, understated design
import 'react-country-state-selector/dist/themes/minimal.css';

// Material - Google Material Design inspired
import 'react-country-state-selector/dist/themes/material.css';

// Bootstrap - Bootstrap 5 form control styling
import 'react-country-state-selector/dist/themes/bootstrap.css';
```

See the [Preset Themes Guide](./docs/THEMES.md) for detailed comparison and usage examples.

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

### Styling Documentation

For comprehensive styling information, see:
- **[Preset Themes Guide](./docs/THEMES.md)** - Ready-to-use theme presets (minimal, material, bootstrap)
- **[CSS Variables Reference](./docs/CSS-VARIABLES.md)** - Complete list of all customizable CSS custom properties
- **[Style Examples](./docs/STYLE-EXAMPLES.md)** - Real-world styling examples and patterns
- **[Styling Guide](./docs/STYLING.md)** - Comprehensive styling documentation

## Architecture

The library features a clean, maintainable architecture:

- **Centralized culture resolution** - Single utility handles all culture logic
- **Type-safe components** - Full TypeScript support with proper interfaces
- **Modular design** - Each component is self-contained with clear responsibilities
- **Error boundaries** - Graceful error handling with user-friendly fallbacks
- **Performance optimized** - Efficient data loading and caching strategies

## Theming and Customization

The library provides comprehensive CSS custom properties (CSS variables) for easy theming. You can customize all visual aspects including colors, fonts, spacing, and more.

For detailed theming documentation and examples, see:
- [Theming Guide](./docs/THEMING.md) - Complete guide to customizing the appearance

Quick example:
```css
:root {
  --rcss-primary-color: #8b5cf6;        /* Purple primary */
  --rcss-error-color: #dc2626;          /* Error color */
  --rcss-border-radius: 0.5rem;         /* Rounded corners */
}
```

## Additional Documentation

For more detailed information, see the following guides:

- **[Error Handling & Recovery Guide](./docs/ERROR-HANDLING.md)** - Learn about error handling, retry mechanisms, and recovery guidance
- **[Accessibility Guide](./docs/ACCESSIBILITY.md)** - Comprehensive accessibility features and ARIA support
- **[Required Field Validation](./docs/REQUIRED-FIELD-VALIDATION.md)** - Form validation features and ARIA accessibility improvements
- **[Styling Guide](./docs/STYLING.md)** - Customization options and CSS theming
- **[Visual Hierarchy Guide](./docs/VISUAL-HIERARCHY.md)** - Design principles and visual organization
- **[Mobile & Touch Optimization](./docs/MOBILE.md)** - Mobile best practices and touch target guidelines
- **[UI/UX Analysis](./docs/UI-UX-ANALYSIS.md)** - Detailed analysis and recommendations

## License

This project is licensed under the MIT License.