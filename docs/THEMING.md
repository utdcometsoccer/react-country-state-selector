# Theming Guide

The react-country-state-selector library provides comprehensive CSS custom properties (CSS variables) for easy theming and customization. All visual aspects of the components can be customized by overriding these properties in your application.

## Available CSS Custom Properties

All custom properties are defined with the `--rcss-` prefix to avoid conflicts with your application's styles.

### Primary Colors

```css
:root {
  --rcss-primary-color: #0066cc;        /* Primary brand color for focus, hover, and selection */
  --rcss-primary-hover: #0052a3;        /* Hover state for interactive elements */
}
```

### Border & Layout

```css
:root {
  --rcss-border-color: #d1d5db;         /* Default border color */
  --rcss-border-radius: 0.375rem;       /* Border radius for all elements */
}
```

### Focus & Interaction

```css
:root {
  --rcss-focus-ring-color: rgba(0, 102, 204, 0.4);  /* Focus ring color with transparency */
}
```

### Text Colors

```css
:root {
  --rcss-text-color: #1f2937;                /* Primary text color */
  --rcss-label-color: #374151;               /* Label text color */
  --rcss-highlight-text-color: #ffffff;      /* Text color for highlighted options */
  --rcss-placeholder-color: #9ca3af;         /* Placeholder text color */
}
```

### Background Colors

```css
:root {
  --rcss-background-color: #ffffff;              /* Background color for inputs and dropdowns */
  --rcss-disabled-background: #f3f4f6;           /* Background for disabled elements */
  --rcss-selected-background: rgba(0, 102, 204, 0.1);  /* Background for selected options */
  --rcss-group-background: #f9fafb;              /* Background for option groups */
}
```

### Error States

```css
:root {
  --rcss-error-color: #dc2626;           /* Error text color (WCAG AA compliant) */
  --rcss-error-background: #fef2f2;      /* Error message background */
  --rcss-error-border: #fecaca;          /* Error message border */
}
```

### Other

```css
:root {
  --rcss-dropdown-arrow-color: #6b7280;  /* Color of the dropdown arrow icon */
}
```

### Typography

```css
:root {
  --rcss-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --rcss-font-size: 1rem;                /* Base font size (16px) */
  --rcss-label-font-size: 0.875rem;      /* Label and small text size (14px) */
  --rcss-spacing: 0.5rem;                /* Standard spacing unit */
}
```

## Usage Examples

### Example 1: Dark Mode Theme

```css
/* Override in your application's CSS */
:root {
  --rcss-primary-color: #3b82f6;
  --rcss-primary-hover: #2563eb;
  --rcss-border-color: #374151;
  --rcss-text-color: #f9fafb;
  --rcss-label-color: #d1d5db;
  --rcss-background-color: #1f2937;
  --rcss-disabled-background: #111827;
  --rcss-selected-background: rgba(59, 130, 246, 0.2);
  --rcss-group-background: #111827;
  --rcss-error-color: #ef4444;
  --rcss-error-background: #7f1d1d;
  --rcss-error-border: #991b1b;
  --rcss-placeholder-color: #6b7280;
}
```

### Example 2: Custom Brand Colors

```css
:root {
  --rcss-primary-color: #8b5cf6;        /* Purple primary */
  --rcss-primary-hover: #7c3aed;
  --rcss-focus-ring-color: rgba(139, 92, 246, 0.4);
  --rcss-error-color: #dc2626;
  --rcss-selected-background: rgba(139, 92, 246, 0.1);
}
```

### Example 3: High Contrast Theme

```css
:root {
  --rcss-primary-color: #000000;
  --rcss-primary-hover: #1f2937;
  --rcss-border-color: #000000;
  --rcss-text-color: #000000;
  --rcss-label-color: #000000;
  --rcss-background-color: #ffffff;
  --rcss-focus-ring-color: rgba(0, 0, 0, 0.5);
  --rcss-error-color: #991b1b;
}
```

### Example 4: Scoped Theme (Component-Level)

If you want to apply different themes to different parts of your application, you can scope the CSS variables:

```css
/* Light theme (default) */
.theme-light {
  --rcss-background-color: #ffffff;
  --rcss-text-color: #1f2937;
}

/* Dark theme for specific section */
.theme-dark {
  --rcss-background-color: #1f2937;
  --rcss-text-color: #f9fafb;
  --rcss-border-color: #374151;
}
```

```jsx
import { CountryDropdown } from '@idahoedokpayi/react-country-state-selector';

function App() {
  return (
    <div className="theme-dark">
      <CountryDropdown
        label="Select Country"
        selectedCountry={country}
        onCountryChange={setCountry}
      />
    </div>
  );
}
```

## Accessibility Considerations

When customizing colors, ensure that:

1. **Color Contrast**: Maintain WCAG AA compliance (4.5:1 contrast ratio for normal text, 3:1 for large text)
2. **Error Colors**: Error text should be clearly distinguishable from normal text
3. **Focus Indicators**: Focus rings should be visible and have sufficient contrast
4. **Disabled States**: Disabled elements should be clearly distinguishable

Use tools like [WebAIM's Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify your color choices.

## Advanced: Runtime Theme Switching

You can switch themes at runtime using JavaScript:

```javascript
function setTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.style.setProperty('--rcss-background-color', '#1f2937');
    root.style.setProperty('--rcss-text-color', '#f9fafb');
    root.style.setProperty('--rcss-border-color', '#374151');
    // ... set other properties
  } else {
    root.style.setProperty('--rcss-background-color', '#ffffff');
    root.style.setProperty('--rcss-text-color', '#1f2937');
    root.style.setProperty('--rcss-border-color', '#d1d5db');
    // ... set other properties
  }
}

// Usage
setTheme('dark');
```

## Browser Support

CSS custom properties are supported in all modern browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, the fallback values specified in the component styles will be used.

## Reference

For the complete list of CSS custom properties and their default values, see:
- [CountryDropdown.css](../src/components/CountryDropdown/CountryDropdown.css)

All other components (StateDropdown, LanguageDropdown, VirtualSelect, LoadingSpinner, LoadingIndicator) use the same CSS custom properties defined in CountryDropdown.css.
