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

## API

### CountryDropdown Props

- `onChange`: A callback function that is called when the selected country changes.

### StateDropdown Props

- `country`: The selected country to filter the states.
- `onChange`: A callback function that is called when the selected state changes.

## License

This project is licensed under the MIT License.