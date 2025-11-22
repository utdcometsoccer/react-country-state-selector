# Accessibility Documentation

## Label-to-Input Association

This document describes the accessibility implementation for form controls in the react-country-state-selector library.

### Overview

All dropdown components in this library properly associate labels with their corresponding select elements using the standard HTML `htmlFor` (rendered as `for` in HTML) and `id` attributes pattern. This ensures:

1. Screen readers can correctly announce the label when the input is focused
2. Clicking the label will focus the associated input
3. The form controls are accessible to assistive technologies

### Components with Proper Label-to-Input Association

All dropdown components in this library have proper label-to-input associations:

#### 1. CountryDropdown

- **Label element**: Uses `htmlFor="country-select"`
- **Select element**: Uses `id="country-select"`
- **Error messages**: Uses `id="country-error"` when errors occur, referenced by `aria-describedby`

Example:
```tsx
<CountryDropdown
  selectedCountry="US"
  onCountryChange={handleChange}
  Label="Country"
/>
```

Renders:
```html
<label for="country-select">Country</label>
<select id="country-select">...</select>
```

#### 2. StateDropdown

- **Label element**: Uses `htmlFor="state-province-select"`
- **Select element**: Uses `id="state-province-select"`
- **Error messages**: Uses `id="state-province-error"` when errors occur, referenced by `aria-describedby`

Example:
```tsx
<StateDropdown
  selectedState="TX"
  onStateChange={handleChange}
  country="US"
  Label="State/Province"
/>
```

Renders:
```html
<label for="state-province-select">State/Province</label>
<select id="state-province-select">...</select>
```

#### 3. LanguageDropdown

- **Label element**: Uses `htmlFor="language-select"`
- **Select element**: Uses `id="language-select"`
- **Error messages**: Uses `id="language-error"` when errors occur, referenced by `aria-describedby`

Example:
```tsx
<LanguageDropdown
  selectedLanguage="en"
  onLanguageChange={handleChange}
  Label="Language"
/>
```

Renders:
```html
<label for="language-select">Language</label>
<select id="language-select">...</select>
```

### ARIA Attributes

The components use ARIA attributes appropriately:

- **`aria-describedby`**: Used on select elements to reference error messages when present
- **No `aria-labelledby`**: Not used because proper label-to-input association via `htmlFor`/`id` is sufficient and more semantic
- **No `aria-label` on labels**: Not used because label elements should convey their text through their content, not ARIA attributes

### Error Handling

When errors occur (e.g., during data loading), the components:

1. Display an error message in a div with a unique `id` (e.g., `country-error`)
2. Add `aria-describedby` to the select element referencing the error message
3. This allows screen readers to announce the error when the select is focused

### Optional Labels

Labels are optional in all components. When no `Label` prop is provided:

- The label element is still rendered but without text content
- The `htmlFor` attribute is still present on the label
- The `id` attribute is still present on the select
- This maintains the proper HTML structure while allowing custom styling

### Testing

All components include unit tests that verify:

1. Label elements have the correct `for` attribute
2. Select elements have the correct `id` attribute  
3. Labels and selects are properly associated (tested via `getByLabelText` in loading state tests)
4. No conflicting ARIA attributes are present
5. Error messages are properly referenced via `aria-describedby`

### Summary

✅ **All input elements can be associated with labels**

All three dropdown components (CountryDropdown, StateDropdown, LanguageDropdown) properly implement label-to-input association using the standard `htmlFor`/`id` pattern. No inputs exist that cannot be associated with their labels.
