# react-country-state-selector

**Internationalization First!**

This library provides React components for country and state/province selection, designed for easy internationalization and localization. Out of the box, it supports:

- United States
- Mexico
- Canada

in **English**, **Spanish**, and **French**.

## Features

- Dynamic loading of country and state/province data based on user culture
- Support for ISO 3166-1 country codes and ISO 639-1 language codes
- Flexible props for customizing labels, classes, and data sources
- Robust error handling and accessibility

## Installation

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

The `CountryDropdown` component allows users to select a country from a dropdown list.

```jsx
import { CountryDropdown } from 'react-country-state-selector';

const App = () => {
  const handleCountryChange = (country) => {
    console.log('Selected country:', country);
  };

  return (
    <CountryDropdown onChange={handleCountryChange} />
  );
};
```

### StateDropdown

The `StateDropdown` component allows users to select a state based on the selected country.

```jsx
import { StateDropdown } from 'react-country-state-selector';

const App = () => {
  const handleStateChange = (state) => {
    console.log('Selected state:', state);
  };

  return (
    <StateDropdown country="US" onChange={handleStateChange} />
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

## Standards Compliance

Country codes are based on the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard. State and province codes are based on official government sources and follow the conventions of [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) where applicable. This ensures broad compatibility and internationalization support.

## Customization

You can insert your own countries and states/provinces by passing custom arrays to the `countryInformation` and `stateProvinceInformation` props of the components. This allows you to extend or override the built-in data for your own use cases or regions.

Example:

```tsx
<CountryDropdown countryInformation={[{ code: 'XX', name: 'My Country' }]} />
<StateDropdown stateProvinceInformation={[{ code: 'YY', name: 'My State' }]} />
```

## License

This project is licensed under the MIT License.