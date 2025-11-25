# Error Handling & Recovery Guide

This document explains the error handling and recovery features implemented in the react-country-state-selector components.

## Overview

All three dropdown components (CountryDropdown, StateDropdown, and LanguageDropdown) include comprehensive error handling with user-friendly guidance and automatic retry mechanisms.

## Features

### 1. Actionable Error Messages

When an error occurs (e.g., network failure, missing data file), users see clear, actionable error messages instead of generic technical errors:

**Production Mode:**
```
Unable to load country information. This might be due to a network issue or the data file being unavailable.
```

**Development Mode:**
```
Error loading country information: [Technical details with stack trace for debugging]
```

### 2. Retry Mechanism

Users can retry loading data up to 3 times by clicking the "Try Again" button displayed with error messages.

**How it works:**
- First attempt: Component loads data on mount
- If it fails: Error message displays with "Try Again" button
- User clicks "Try Again": Component attempts to reload data (retry count: 1)
- If it fails again: Error message displays with "Try Again" button
- User clicks "Try Again": Component attempts to reload data (retry count: 2)
- If it fails a third time: Error message displays with "Try Again" button
- User clicks "Try Again": Component attempts to reload data (retry count: 3)
- After 3 failed attempts: "Try Again" button is hidden and recovery guidance is shown

### 3. Error Recovery Guidance

After 3 failed retry attempts, the component displays helpful guidance to users:

```
What you can do:
• Check your internet connection
• Refresh the page
• Try again later
```

This provides users with clear next steps when automatic recovery fails.

### 4. Accessibility (ARIA) Support

All error messages include proper ARIA attributes for screen reader users:

- `role="alert"`: Identifies the error as an alert
- `aria-live="polite"`: Announces errors to screen readers without interrupting
- `aria-invalid="true"`: Marks the form control as invalid when errors are present
- `aria-describedby`: Links error messages to form controls
- `aria-labelledby`: Properly associates labels with form controls

## Usage

No additional configuration is needed. Error handling is built into all three components:

```tsx
import { CountryDropdown } from '@idahoedokpayi/react-country-state-selector';

function MyForm() {
  return (
    <CountryDropdown
      selectedCountry="US"
      onCountryChange={(country) => console.log(country)}
      Label="Select Your Country"
    />
  );
}
```

If the component encounters an error while loading data, the error handling features automatically activate.

## Testing Error Scenarios

You can test error handling in Storybook using the "WithErrorHandling" story:

```bash
npm run storybook
```

Then navigate to:
**stories > CountryDropdown > With Error Handling**

This story demonstrates:
- Initial error display with user-friendly message
- Retry button functionality (up to 3 attempts)
- Stack trace visibility in development mode for debugging
- Scrollable error container for long messages

### Development vs Production Behavior

| Environment | Error Display |
|-------------|---------------|
| Development | Full error message with stack trace (scrollable) |
| Production  | Brief user-friendly message without technical details |

In development mode (including Storybook), the error container shows detailed information to help developers debug issues. The container has a maximum height with scrolling enabled to prevent the error from overwhelming the UI.

## Custom Error Handling

If you want to provide your own data fetching function with custom error handling:

```tsx
import { CountryDropdown } from '@idahoedokpayi/react-country-state-selector';
import { CultureInfo, CountryInformation } from '@idahoedokpayi/react-country-state-selector';

async function customGetCountryInformation(culture: CultureInfo): Promise<CountryInformation[]> {
  try {
    const response = await fetch(`/api/countries?culture=${culture.code}`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    // Custom error handling logic
    console.error('Country data fetch failed:', error);
    throw error; // Re-throw to trigger component error handling
  }
}

function MyForm() {
  return (
    <CountryDropdown
      selectedCountry="US"
      onCountryChange={(country) => console.log(country)}
      Label="Select Your Country"
      getCountryInformation={customGetCountryInformation}
    />
  );
}
```

The component's error handling will still work with your custom function.

## Styling Error Messages

Error messages and retry buttons use CSS custom properties for easy theming:

```css
:root {
  --rcss-error-color: #dc2626;          /* Error text color */
  --rcss-error-background: #fef2f2;     /* Error background color */
  --rcss-error-border: #fecaca;         /* Error border color */
  --rcss-primary-color: #0066cc;        /* Retry button color */
  --rcss-focus-ring-color: rgba(0, 102, 204, 0.4); /* Focus ring */
}
```

### Error Message Classes

- `.country-error-message` / `.state-error-message` / `.language-error-message`
- `.country-retry-button` / `.state-retry-button` / `.language-retry-button`
- `.country-error-guidance` / `.state-error-guidance` / `.language-error-guidance`

Example custom styling:

```css
/* Custom error styling */
.country-error-message {
  background-color: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.country-retry-button {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.country-retry-button:hover {
  background-color: #218838;
}
```

## Security Considerations

**Stack Traces in Production:**
Error stack traces are only shown in development mode (`NODE_ENV === 'development'`). In production, users see user-friendly messages without technical details that could expose system information.

**Error Logging:**
Consider implementing error tracking in production to monitor failures:

```tsx
async function customGetCountryInformation(culture: CultureInfo): Promise<CountryInformation[]> {
  try {
    // ... data fetching logic
  } catch (error) {
    // Log to error tracking service
    if (process.env.NODE_ENV === 'production') {
      trackError('CountryDataFetchError', error);
    }
    throw error;
  }
}
```

## Related Documentation

- [Accessibility Guide](./ACCESSIBILITY.md) - Learn about ARIA attributes and screen reader support
- [Styling Guide](./STYLING.md) - Customize the appearance of components
- [UI/UX Analysis](./UI-UX-ANALYSIS.md) - See the detailed analysis that led to these improvements

## Summary

The error handling and recovery features provide:

✅ **User-friendly error messages** - Clear, actionable information  
✅ **Automatic retry mechanism** - Up to 3 attempts with user control  
✅ **Recovery guidance** - Helpful next steps after failures  
✅ **Full accessibility support** - ARIA attributes for screen readers  
✅ **Customizable styling** - CSS custom properties for theming  
✅ **Security-conscious** - No stack traces in production  

These features address the "No Error Recovery" issue identified in the UI/UX analysis and provide users with a better experience when errors occur.
