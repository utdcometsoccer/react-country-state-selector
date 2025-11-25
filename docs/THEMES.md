# Preset Themes Guide

The `react-country-state-selector` library provides four optional preset themes that you can use out of the box. These themes are designed to match popular design systems and provide a quick way to style your dropdowns without writing custom CSS.

## Available Themes

### 1. Minimal Theme

**Perfect for:** Modern applications with clean, understated design.

**Features:**
- Subtle borders and focus states
- Compact spacing
- Neutral gray color palette
- Lightweight hover effects
- System font stack

**Usage:**
```tsx
// Import the minimal theme CSS
import 'react-country-state-selector/dist/themes/minimal.css';

// Use the dropdown components normally
<CountryDropdown 
  selectedCountry={country}
  onCountryChange={setCountry}
  Label="Country"
/>
```

**Preview:**
- Border: 1px thin gray (#e5e7eb)
- Focus: Subtle blue glow
- Colors: Blue accents (#3b82f6) with gray text
- Spacing: Compact padding (0.5rem)

---

### 2. Material Theme

**Perfect for:** Applications following Google's Material Design principles.

**Features:**
- Elevated surfaces with shadows
- Uppercase labels with letter spacing
- Bottom border emphasis on focus
- Material blue color palette
- Roboto font family (if available)
- 8px grid spacing

**Usage:**
```tsx
// Import the material theme CSS
import 'react-country-state-selector/dist/themes/material.css';

// Optionally include Roboto font from Google Fonts
// <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">

<CountryDropdown 
  selectedCountry={country}
  onCountryChange={setCountry}
  Label="Country"
/>
```

**Preview:**
- Border: 1px with 2px bottom border
- Focus: Elevated shadow effect
- Colors: Material blue (#1976d2) with dark text
- Labels: Uppercase with letter spacing
- Background: Light gray (#fafafa)

---

### 3. Bootstrap Theme

**Perfect for:** Applications using Bootstrap or similar frameworks.

**Features:**
- Bootstrap 5 form control styling
- Familiar border and focus states
- Bootstrap color palette
- Standard Bootstrap spacing
- Bootstrap font stack

**Usage:**
```tsx
// Import the bootstrap theme CSS
import 'react-country-state-selector/dist/themes/bootstrap.css';

<CountryDropdown 
  selectedCountry={country}
  onCountryChange={setCountry}
  Label="Country"
/>
```

**Preview:**
- Border: 1px with Bootstrap grays (#dee2e6, #ced4da)
- Focus: Bootstrap blue glow (#0d6efd)
- Colors: Bootstrap primary blue
- Spacing: Bootstrap standard padding (0.375rem 0.75rem)

---

### 4. Dark Theme

**Perfect for:** Applications with dark mode support or dark-themed interfaces.

**Features:**
- Dark gray backgrounds
- Light text for readability
- Bright blue accent colors for visibility
- Visible focus states on dark backgrounds
- System font stack

**Usage:**
```tsx
// Import the dark theme CSS
import 'react-country-state-selector/dist/themes/dark.css';

<CountryDropdown 
  selectedCountry={country}
  onCountryChange={setCountry}
  Label="Country"
/>
```

**Preview:**
- Border: 1px gray on dark background (#4b5563)
- Focus: Bright blue glow (#60a5fa)
- Colors: Bright blue accents with light gray text (#f3f4f6)
- Background: Dark gray (#1f2937)

---

## Comparing Themes

| Feature | Minimal | Material | Bootstrap | Dark |
|---------|---------|----------|-----------|------|
| **Style** | Clean, subtle | Elevated, prominent | Familiar, standard | Dark mode |
| **Borders** | Thin (1px) | Bottom emphasis (2px) | Standard (1px) | Subtle (1px) |
| **Focus** | Subtle glow | Shadow elevation | Blue ring | Bright glow |
| **Colors** | Blue/Gray | Material Blue | Bootstrap Blue | Bright Blue |
| **Labels** | Normal case | Uppercase | Normal case | Normal case |
| **Spacing** | Compact | Standard | Standard | Standard |
| **Font** | System | Roboto preferred | Bootstrap stack | System |
| **Background** | White | Light gray | White | Dark gray |

---

## Using Multiple Themes

You can switch between themes by importing different theme files. Only import one theme at a time:

```tsx
// Development environment - minimal theme
import 'react-country-state-selector/dist/themes/minimal.css';

// Production environment - material theme
// import 'react-country-state-selector/dist/themes/material.css';
```

---

## Customizing Preset Themes

All preset themes use the same CSS custom properties (variables) as the default theme. You can override specific variables to customize a preset theme:

```css
/* Override minimal theme colors */
@import 'react-country-state-selector/dist/themes/minimal.css';

:root {
  --rcss-primary-color: #10b981; /* Change to green */
  --rcss-primary-hover: #059669;
}
```

```tsx
// Import your custom CSS after the theme
import 'react-country-state-selector/dist/themes/material.css';
import './my-theme-overrides.css';
```

---

## Theme Installation

The theme CSS files are included in the package and will be available in your `node_modules` after installation:

```bash
npm install react-country-state-selector
```

The themes are located at:
- `node_modules/react-country-state-selector/dist/themes/minimal.css`
- `node_modules/react-country-state-selector/dist/themes/material.css`
- `node_modules/react-country-state-selector/dist/themes/bootstrap.css`
- `node_modules/react-country-state-selector/dist/themes/dark.css`

---

## Complete Examples

### Minimal Theme Example

```tsx
import React, { useState } from 'react';
import { CountryDropdown, StateDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/themes/minimal.css';

function App() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  return (
    <div>
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
        Label="State"
        culture="en-US"
      />
    </div>
  );
}
```

### Material Theme Example

```tsx
import React, { useState } from 'react';
import { CountryDropdown, StateDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/themes/material.css';

function App() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  return (
    <div style={{ padding: '16px' }}>
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
        Label="State"
        culture="en-US"
      />
    </div>
  );
}
```

### Bootstrap Theme Example

```tsx
import React, { useState } from 'react';
import { CountryDropdown, StateDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/themes/bootstrap.css';

function App() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  return (
    <div className="container">
      <div className="mb-3">
        <CountryDropdown 
          selectedCountry={country}
          onCountryChange={setCountry}
          Label="Country"
          culture="en-US"
        />
      </div>
      <div className="mb-3">
        <StateDropdown 
          selectedState={state}
          onStateChange={setState}
          country={country}
          Label="State/Province"
          culture="en-US"
        />
      </div>
    </div>
  );
}
```

### Dark Theme Example

```tsx
import React, { useState } from 'react';
import { CountryDropdown, StateDropdown } from 'react-country-state-selector';
import 'react-country-state-selector/dist/themes/dark.css';

function App() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  return (
    <div style={{ background: '#111827', minHeight: '100vh', padding: '16px' }}>
      <CountryDropdown 
        selectedCountry={country}
        onCountryChange={setCountry}
        Label="Country"
        culture="en-US"
      />
      <div style={{ marginTop: '16px' }}>
        <StateDropdown 
          selectedState={state}
          onStateChange={setState}
          country={country}
          Label="State"
          culture="en-US"
        />
      </div>
    </div>
  );
}
```

---

## Browser Support

All preset themes use modern CSS features and are supported in:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Samsung Internet 13+

For older browser support, you may need to add CSS custom property polyfills.

---

## Accessibility

All preset themes maintain the accessibility features of the default theme:

- ✅ WCAG 2.1 AA compliant color contrast
- ✅ Visible focus indicators
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Screen reader compatible

---

## Performance

Each theme CSS file is:
- **Minimal theme:** ~2KB (minified), ~0.5KB (gzipped)
- **Material theme:** ~2.5KB (minified), ~0.6KB (gzipped)
- **Bootstrap theme:** ~3KB (minified), ~0.7KB (gzipped)

All themes have minimal performance impact on your application.

---

## Creating Your Own Theme

If none of the preset themes fit your needs, you can create your own theme file using CSS custom properties. See the [Styling Guide](./STYLING.md) for a complete list of available CSS variables and customization options.

Example custom theme:

```css
/* my-custom-theme.css */
:root {
  --rcss-primary-color: #your-brand-color;
  --rcss-primary-hover: #your-hover-color;
  --rcss-border-color: #your-border-color;
  --rcss-border-radius: 0.5rem;
  /* ... customize all variables */
}

/* Add your custom styling */
label[for="country-select"] {
  /* Custom label styles */
}

select#country-select {
  /* Custom select styles */
}
```

---

## Support

If you encounter any issues with the preset themes or have suggestions for new themes, please:

1. Check the [Styling Guide](./STYLING.md) for customization options
2. Review the [main README](../README.md) for component usage
3. Open an issue on [GitHub](https://github.com/utdcometsoccer/react-country-state-selector/issues)

---

## Contributing

We welcome contributions of new preset themes! If you've created a theme that others might find useful, please consider contributing it back to the project. See our contributing guidelines for more information.
