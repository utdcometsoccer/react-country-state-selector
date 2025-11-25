# Style Implementation Examples

This guide provides practical, real-world examples of styling the `react-country-state-selector` components for various use cases and design requirements.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Examples](#basic-examples)
- [Design System Examples](#design-system-examples)
- [Responsive Design](#responsive-design)
- [Accessibility Examples](#accessibility-examples)
- [Advanced Examples](#advanced-examples)
- [Integration Examples](#integration-examples)

---

## Getting Started

Before diving into examples, ensure you've imported the base CSS:

```tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';
```

Or import a preset theme:

```tsx
import 'react-country-state-selector/dist/themes/minimal.css';
// OR
import 'react-country-state-selector/dist/themes/material.css';
// OR
import 'react-country-state-selector/dist/themes/bootstrap.css';
```

---

## Basic Examples

### Example 1: Simple Color Change

Change the primary color to match your brand:

```css
/* styles.css */
:root {
  --rcss-primary-color: #10b981; /* Green */
  --rcss-primary-hover: #059669;
  --rcss-focus-ring-color: rgba(16, 185, 129, 0.4);
}
```

```tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';
import './styles.css';

function App() {
  return (
    <CountryDropdown 
      selectedCountry={country}
      onCountryChange={setCountry}
      Label="Select Country"
    />
  );
}
```

### Example 2: Rounded Corners

Create more rounded or square corners:

```css
/* More rounded */
:root {
  --rcss-border-radius: 0.75rem; /* 12px */
}

/* Fully rounded (pill shape) */
:root {
  --rcss-border-radius: 2rem;
}

/* Square corners */
:root {
  --rcss-border-radius: 0;
}
```

### Example 3: Custom Font

Use a custom web font:

```tsx
// Import font in your HTML or CSS
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
:root {
  --rcss-font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## Design System Examples

### Example 4: Tailwind CSS Integration

Integrate with Tailwind CSS utility classes:

```tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';

function App() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <CountryDropdown 
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country"
        classNameLabel="block text-sm font-medium text-gray-700 mb-2"
        classNameSelect="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
}
```

```css
/* Custom CSS to override variables for Tailwind-like styling */
:root {
  --rcss-primary-color: #6366f1; /* Indigo */
  --rcss-primary-hover: #4f46e5;
  --rcss-border-color: #d1d5db; /* Gray-300 */
  --rcss-border-radius: 0.5rem;
}
```

### Example 5: Chakra UI Integration

Style to match Chakra UI components:

```css
/* chakra-theme.css */
:root {
  --rcss-primary-color: #3182ce; /* Chakra blue.500 */
  --rcss-primary-hover: #2c5282; /* Chakra blue.700 */
  --rcss-border-color: #e2e8f0; /* Chakra gray.200 */
  --rcss-border-radius: 0.375rem;
  --rcss-text-color: #2d3748; /* Chakra gray.700 */
  --rcss-label-color: #4a5568; /* Chakra gray.600 */
  --rcss-background-color: #ffffff;
  --rcss-disabled-background: #edf2f7; /* Chakra gray.100 */
  --rcss-focus-ring-color: rgba(49, 130, 206, 0.4);
}
```

```tsx
import { Box, VStack } from '@chakra-ui/react';
import 'react-country-state-selector/dist/react-country-state-selector.css';
import './chakra-theme.css';

function App() {
  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <CountryDropdown 
          selectedCountry={country}
          onCountryChange={setCountry}
          Label="Country"
        />
      </Box>
    </VStack>
  );
}
```

### Example 6: Material-UI (MUI) Integration

Match Material-UI's design language:

```css
/* mui-theme.css */
:root {
  --rcss-primary-color: #1976d2; /* MUI primary.main */
  --rcss-primary-hover: #1565c0; /* MUI primary.dark */
  --rcss-border-color: rgba(0, 0, 0, 0.23);
  --rcss-border-radius: 4px;
  --rcss-text-color: rgba(0, 0, 0, 0.87);
  --rcss-label-color: rgba(0, 0, 0, 0.6);
  --rcss-font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  --rcss-focus-ring-color: rgba(25, 118, 210, 0.25);
}

/* Additional MUI-like styling */
label[for="country-select"],
label[for="state-province-select"],
label[for="language-select"] {
  transform: scale(0.75);
  transform-origin: top left;
  margin-bottom: 0.25rem;
}
```

---

## Responsive Design

### Example 7: Mobile-First Responsive

Adjust sizing for different screen sizes:

```css
/* mobile-responsive.css */

/* Mobile (default) */
:root {
  --rcss-font-size: 0.875rem;
  --rcss-label-font-size: 0.75rem;
  --rcss-spacing: 0.375rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  :root {
    --rcss-font-size: 1rem;
    --rcss-label-font-size: 0.875rem;
    --rcss-spacing: 0.5rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  :root {
    --rcss-font-size: 1.125rem;
    --rcss-label-font-size: 1rem;
    --rcss-spacing: 0.625rem;
  }
}

/* Mobile: Larger touch targets */
@media (max-width: 767px) {
  select#country-select,
  select#state-province-select,
  select#language-select {
    padding: 0.75rem;
    min-height: 44px; /* WCAG touch target size */
  }
}
```

### Example 8: Responsive Container

Full-width on mobile, constrained on desktop:

```tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';

function App() {
  return (
    <div className="responsive-form-container">
      <CountryDropdown 
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country"
      />
      <StateDropdown 
        selectedState={state}
        onStateChange={setState}
        country={country}
        Label="State/Province"
      />
    </div>
  );
}
```

```css
/* Responsive container */
.responsive-form-container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 640px) {
  .responsive-form-container {
    max-width: 28rem; /* 448px */
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .responsive-form-container {
    max-width: 32rem; /* 512px */
  }
}
```

---

## Accessibility Examples

### Example 9: High Contrast Mode

Enhance visibility for users with visual impairments:

```css
/* high-contrast.css */
:root {
  --rcss-primary-color: #0000ff; /* Pure blue */
  --rcss-text-color: #000000; /* Pure black */
  --rcss-background-color: #ffffff; /* Pure white */
  --rcss-border-color: #000000;
}

/* Enhanced borders in high contrast mode */
@media (prefers-contrast: high) {
  select#country-select,
  select#state-province-select,
  select#language-select {
    border-width: 2px;
  }
  
  select#country-select:focus,
  select#state-province-select:focus,
  select#language-select:focus {
    outline: 3px solid var(--rcss-primary-color);
    outline-offset: 2px;
  }
}
```

### Example 10: Reduced Motion

Respect user's motion preferences:

```css
/* All animations disabled for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Specifically for our components */
@media (prefers-reduced-motion: reduce) {
  select#country-select,
  select#state-province-select,
  select#language-select,
  input#country-select,
  input#state-province-select,
  input#language-select {
    transition: none;
  }
}
```

---

## Advanced Examples

### Example 11: Dark Mode

Comprehensive dark mode implementation:

```css
/* dark-mode.css */
:root {
  /* Light mode (default) */
  --rcss-primary-color: #3b82f6;
  --rcss-primary-hover: #2563eb;
  --rcss-border-color: #d1d5db;
  --rcss-text-color: #1f2937;
  --rcss-label-color: #374151;
  --rcss-background-color: #ffffff;
  --rcss-disabled-background: #f3f4f6;
  --rcss-error-color: #dc2626;
  --rcss-error-background: #fef2f2;
  --rcss-error-border: #fecaca;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --rcss-primary-color: #60a5fa;
    --rcss-primary-hover: #3b82f6;
    --rcss-border-color: #4b5563;
    --rcss-text-color: #f3f4f6;
    --rcss-label-color: #e5e7eb;
    --rcss-background-color: #1f2937;
    --rcss-disabled-background: #374151;
    --rcss-error-color: #ef4444;
    --rcss-error-background: #7f1d1d;
    --rcss-error-border: #991b1b;
  }
  
  /* Update dropdown arrow for dark mode */
  select#country-select,
  select#state-province-select,
  select#language-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  }
}
```

### Example 12: Floating Label Effect

Create a Material Design-style floating label:

```css
/* floating-label.css */
.floating-label-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.floating-label-container label {
  position: absolute;
  left: 0.75rem;
  top: 0.875rem;
  transition: all 0.2s ease;
  pointer-events: none;
  color: var(--rcss-label-color);
  background-color: var(--rcss-background-color);
  padding: 0 0.25rem;
}

.floating-label-container select:focus + label,
.floating-label-container select:not(:placeholder-shown) + label,
.floating-label-container input:focus + label,
.floating-label-container input:not(:placeholder-shown) + label {
  top: -0.5rem;
  left: 0.5rem;
  font-size: 0.75rem;
  color: var(--rcss-primary-color);
}

.floating-label-container select,
.floating-label-container input {
  padding: 0.875rem 0.75rem;
}
```

```tsx
// Note: This requires a custom wrapper component
function FloatingLabelDropdown() {
  return (
    <div className="floating-label-container">
      <CountryDropdown 
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country"
      />
    </div>
  );
}
```

### Example 13: Gradient Borders

Add colorful gradient borders:

```css
/* gradient-borders.css */
select#country-select,
select#state-province-select,
select#language-select {
  border: 2px solid transparent;
  background: 
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
}

select#country-select:focus,
select#state-province-select:focus,
select#language-select:focus {
  background: 
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #f093fb 0%, #f5576c 100%) border-box;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Example 14: Glassmorphism Style

Create a modern glassmorphism effect:

```css
/* glassmorphism.css */
:root {
  --rcss-background-color: rgba(255, 255, 255, 0.7);
  --rcss-border-color: rgba(255, 255, 255, 0.3);
}

select#country-select,
select#state-province-select,
select#language-select {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

select#country-select:hover,
select#state-province-select:hover,
select#language-select:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

select#country-select:focus,
select#state-province-select:focus,
select#language-select:focus {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
}
```

---

## Integration Examples

### Example 15: React Hook Form Integration

Style dropdowns within React Hook Form:

```tsx
import { useForm, Controller } from 'react-hook-form';
import { CountryDropdown, StateDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/react-country-state-selector.css';

function FormExample() {
  const { control, watch, handleSubmit } = useForm();
  const country = watch('country');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="country"
        control={control}
        rules={{ required: 'Country is required' }}
        render={({ field, fieldState }) => (
          <div>
            <CountryDropdown
              selectedCountry={field.value}
              onCountryChange={field.onChange}
              Label="Country *"
              culture="en-US"
            />
            {fieldState.error && (
              <p className="error-message">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <StateDropdown
            selectedState={field.value}
            onStateChange={field.onChange}
            country={country}
            Label="State/Province"
            culture="en-US"
          />
        )}
      />
    </form>
  );
}
```

```css
/* Form validation styling */
.error-message {
  color: var(--rcss-error-color);
  font-size: var(--rcss-label-font-size);
  margin-top: 0.25rem;
}
```

### Example 16: Next.js App Router Integration

Use with Next.js App Router and CSS Modules:

```tsx
// app/components/AddressForm.tsx
'use client';

import { useState } from 'react';
import { CountryDropdown, StateDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/react-country-state-selector.css';
import styles from './AddressForm.module.css';

export default function AddressForm() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  return (
    <div className={styles.formContainer}>
      <CountryDropdown
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country"
        culture="en-US"
      />
      <StateDropdown
        selectedState={state}
        onStateChange={setState}
        country={country}
        Label="State/Province"
        culture="en-US"
      />
    </div>
  );
}
```

```css
/* AddressForm.module.css */
.formContainer {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem;
}

.formContainer :global(select),
.formContainer :global(input) {
  width: 100%;
}
```

### Example 17: Form Grid Layout

Create a multi-column form layout:

```tsx
function CheckoutForm() {
  return (
    <div className="checkout-grid">
      <div className="form-row">
        <CountryDropdown
          selectedCountry={country}
          onCountryChange={setCountry}
          Label="Country"
        />
        <StateDropdown
          selectedState={state}
          onStateChange={setState}
          country={country}
          Label="State/Province"
        />
      </div>
    </div>
  );
}
```

```css
/* Grid layout */
.checkout-grid {
  max-width: 60rem;
  margin: 0 auto;
  padding: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## Complete Application Example

### Example 18: Full Registration Form

A complete, production-ready registration form:

```tsx
import { useState } from 'react';
import { CountryDropdown, StateDropdown, LanguageDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/themes/bootstrap.css';
import './registration-form.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    language: 'en'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Create Your Account</h2>
        
        <div className="form-section">
          <h3>Location Information</h3>
          
          <CountryDropdown
            selectedCountry={formData.country}
            onCountryChange={(value) => setFormData({ ...formData, country: value, state: '' })}
            Label="Country *"
            culture={formData.language}
            enableSearch={true}
          />

          {formData.country && (
            <StateDropdown
              selectedState={formData.state}
              onStateChange={(value) => setFormData({ ...formData, state: value })}
              country={formData.country}
              Label="State/Province *"
              culture={formData.language}
              enableSearch={true}
            />
          )}
        </div>

        <div className="form-section">
          <h3>Preferences</h3>
          
          <LanguageDropdown
            selectedLanguage={formData.language}
            onLanguageChange={(value) => setFormData({ ...formData, language: value })}
            Label="Preferred Language"
            culture={formData.language}
          />
        </div>

        <button type="submit" className="submit-button">
          Continue
        </button>
      </form>
    </div>
  );
}
```

```css
/* registration-form.css */
.registration-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.registration-form {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 32rem;
  width: 100%;
}

.registration-form h2 {
  margin: 0 0 2rem 0;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  color: #4b5563;
  font-size: 1.125rem;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .registration-form {
    padding: 1.5rem;
  }
  
  .registration-form h2 {
    font-size: 1.5rem;
  }
}
```

---

## Additional Resources

- [CSS Custom Properties Reference](./CSS-VARIABLES.md) - Complete variable documentation
- [Preset Themes Guide](./THEMES.md) - Ready-to-use themes
- [Main Styling Guide](./STYLING.md) - Comprehensive styling documentation
- [Main README](../README.md) - Component usage and API

---

## Contributing

Have a styling example you'd like to share? We welcome contributions! Please open a pull request with your example.
