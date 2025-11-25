# Required Field Validation and Accessibility Improvements

This document describes the required field validation and ARIA accessibility improvements added to the react-country-state-selector library.

## Overview

Version X.X.X introduces comprehensive support for required field validation and improved accessibility compliance with WCAG 2.1 standards.

## New Features

### 1. Required Field Support

All three dropdown components (`CountryDropdown`, `StateDropdown`, `LanguageDropdown`) now support the `required` prop:

```tsx
<CountryDropdown
  selectedCountry="US"
  onCountryChange={handleCountryChange}
  Label="Country"
  required={true}  // ← New prop
/>
```

When `required={true}`:
- A visual asterisk (*) appears next to the label (hidden from screen readers with `aria-hidden="true"`)
- The `aria-required="true"` attribute is added to the select element
- Screen readers will announce the field as required based on the `aria-required` attribute

### 2. Improved ARIA Accessibility

#### Fixed Label Association
Previously, the components had incorrect ARIA references. Now:

```tsx
// Before (incorrect):
<label htmlFor="country-select" aria-label={Label}>
  {Label}
</label>
<select
  id="country-select"
  aria-labelledby="country-select-label"  // ← ID didn't exist!
/>

// After (correct):
<label
  id="country-select-label"  // ← ID added
  htmlFor="country-select"
>
  {Label}
</label>
<select
  id="country-select"
  aria-labelledby="country-select-label"  // ← Now references correct ID
/>
```

#### Enhanced Error Messages
Error messages now have proper ARIA live regions:

```tsx
<div
  id="country-error-message"
  className="country-error-message"
  role="alert"           // ← Screen readers announce immediately
  aria-live="polite"     // ← Updates announced when user is idle
>
  {state.error}
</div>
```

When an error occurs:
- `aria-invalid="true"` is set on the select element
- `aria-describedby` points to the error message ID
- Screen readers announce the error automatically

#### Enhanced Loading States
Loading indicators now have proper ARIA attributes:

```tsx
<div role="status" aria-live="polite">
  <LoadingIndicator message="Loading country information..." />
</div>
```

This ensures screen readers announce loading states to users.

### 3. Bug Fixes

#### StateDropdown Environment Check
Fixed inconsistent environment check in StateDropdown:

```tsx
// Before (bug):
if (process.env.NODE_ENV === 'Development') {  // ← Incorrect capitalization
  // Show detailed error
}

// After (fixed):
if (process.env.NODE_ENV === 'development') {  // ← Correct
  // Show detailed error
}
```

This ensures consistent behavior across all three dropdown components.

## Usage Examples

### Basic Required Field

```tsx
import { CountryDropdown } from '@idahoedokpayi/react-country-state-selector';

function MyForm() {
  const [country, setCountry] = useState('');

  return (
    <form>
      <CountryDropdown
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country *"
        required={true}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### All Three Dropdowns with Required Fields

```tsx
function AddressForm() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [language, setLanguage] = useState('');

  return (
    <form>
      <CountryDropdown
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country"
        required={true}
      />
      
      <StateDropdown
        selectedState={state}
        onStateChange={setState}
        country={country}
        Label="State/Province"
        required={true}
      />
      
      <LanguageDropdown
        selectedLanguage={language}
        onLanguageChange={setLanguage}
        Label="Preferred Language"
        required={false}  // Optional field
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Custom Validation

```tsx
function FormWithValidation() {
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!country) {
      setError('Country is required');
      return;
    }
    
    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit}>
      <CountryDropdown
        selectedCountry={country}
        onCountryChange={(value) => {
          setCountry(value);
          setError(''); // Clear error on change
        }}
        Label="Country"
        required={true}
      />
      {error && <div role="alert">{error}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Accessibility Benefits

### WCAG 2.1 Compliance

The improvements help meet the following WCAG 2.1 Success Criteria:

1. **1.3.1 Info and Relationships (Level A)**
   - Proper label association with `id` and `htmlFor`
   - Correct `aria-labelledby` references

2. **3.3.1 Error Identification (Level A)**
   - Errors clearly identified with `role="alert"`
   - `aria-invalid` indicates fields with errors
   - `aria-describedby` links to error messages

3. **3.3.2 Labels or Instructions (Level A)**
   - Visual asterisk (*) for required fields
   - `aria-required` for screen readers

4. **4.1.3 Status Messages (Level AA)**
   - `aria-live="polite"` for error and loading announcements
   - `role="alert"` for immediate error notifications
   - `role="status"` for loading state updates

### Screen Reader Experience

When using a screen reader:

1. **Navigating to field**: "Country, combobox, required"
2. **Selecting a value**: "United States selected"
3. **Loading state**: "Loading country information..."
4. **Error state**: "Error loading country information. Please try again later."

## API Reference

### New Props

All three components (`CountryDropdown`, `StateDropdown`, `LanguageDropdown`) now accept:

```typescript
interface DropdownProps {
  // ... existing props ...
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
}
```

### Updated ARIA Attributes

The select elements now include:

- `aria-labelledby`: References the label element ID
- `aria-required`: Set to `true` when `required={true}`
- `aria-invalid`: Set to `true` when an error is present
- `aria-describedby`: References error message ID when error exists

## Migration Guide

### From Previous Versions

No breaking changes! The `required` prop is optional and defaults to `false`.

If you were relying on the StateDropdown bug where `NODE_ENV === 'Development'` (capitalized), you'll need to update to lowercase:

```tsx
// Before:
process.env.NODE_ENV = 'Development';

// After:
process.env.NODE_ENV = 'development';
```

### Testing

If you have tests that check ARIA attributes, update them:

```tsx
// Before:
expect(select).not.toHaveAttribute('aria-labelledby');
expect(select).toHaveAttribute('aria-describedby', 'country-error');

// After:
expect(select).toHaveAttribute('aria-labelledby', 'country-select-label');
expect(select).toHaveAttribute('aria-describedby', 'country-error-message');
```

## Browser Support

These improvements use standard ARIA attributes supported by all modern browsers and screen readers:

- JAWS (Windows)
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)
- Narrator (Windows)

## Future Enhancements

Planned for future releases:

- Custom validation rules via `validate` prop
- Error recovery with retry mechanism
- Visual error styling (CSS improvements)
- Dark mode support
- Enhanced mobile experience with search functionality

## Contributing

Found a bug or have a suggestion? Please open an issue on GitHub:
https://github.com/utdcometsoccer/react-country-state-selector/issues

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [UI/UX Analysis Report](./UI-UX-ANALYSIS.md)
