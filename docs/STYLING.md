# Styling Guide

This guide provides comprehensive information on styling the react-country-state-selector components.

## Table of Contents

- [Overview](#overview)
- [Default Styles](#default-styles)
- [Customization Methods](#customization-methods)
  - [CSS Variables](#css-variables)
  - [Custom CSS Classes](#custom-css-classes)
  - [Completely Unstyled](#completely-unstyled)
- [Accessibility](#accessibility)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

The library provides **beautiful, accessible default styles** that work out of the box. These styles are designed to:

- Work well in most design systems
- Meet WCAG 2.1 AA accessibility standards
- Be easily customizable
- Support modern CSS features
- Respect user preferences (reduced motion, high contrast)

## Default Styles

### Including the Styles

To use the default styles, import the CSS file at the top level of your application:

```tsx
// In your main App.tsx or index.tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';
```

### What's Included

The default styles provide:

1. **Form Controls**: Clean, modern select dropdowns with custom arrow indicator
2. **Labels**: Clear, readable labels with proper spacing
3. **Error Messages**: Prominent error messages with appropriate styling
4. **Interactive States**:
   - Hover effects for better feedback
   - Focus rings for keyboard navigation
   - Disabled states with reduced opacity
5. **Accessibility Features**:
   - High contrast mode support
   - Reduced motion support
   - Proper color contrast ratios
   - Visible focus indicators

## Customization Methods

### CSS Variables

The easiest way to customize the appearance is by overriding CSS custom properties (variables). Add this to your CSS file:

```css
:root {
  /* Primary colors - used for focus states and interactive elements */
  --rcss-primary-color: #0066cc;
  --rcss-primary-hover: #0052a3;
  
  /* Border styling */
  --rcss-border-color: #d1d5db;
  --rcss-border-radius: 0.375rem;
  
  /* Focus ring - visible indicator when element is focused */
  --rcss-focus-ring-color: rgba(0, 102, 204, 0.4);
  
  /* Text colors */
  --rcss-text-color: #1f2937;
  --rcss-label-color: #374151;
  
  /* Background colors */
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

#### Customizing the Dropdown Arrow

**Note**: The dropdown arrow color is embedded in an SVG data URI and cannot be changed via CSS variables due to browser limitations. To customize the arrow color, override the `background-image` property:

```css
/* Black arrow */
select#country-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

/* White arrow (for dark backgrounds) */
select#country-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

/* Blue arrow to match primary color */
select#country-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230066cc' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
```

The color in the SVG must be URL-encoded. Here are common colors:
- `%23000000` = black
- `%23ffffff` = white
- `%236b7280` = gray (default)
- `%230066cc` = blue
- `%23ef4444` = red

#### Example: Material Design Theme

```css
:root {
  --rcss-primary-color: #1976d2;
  --rcss-primary-hover: #1565c0;
  --rcss-border-color: #bdbdbd;
  --rcss-border-radius: 4px;
  --rcss-focus-ring-color: rgba(25, 118, 210, 0.3);
  --rcss-font-family: 'Roboto', sans-serif;
}
```

#### Example: Dark Mode

```css
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
  }
}
```

### Custom CSS Classes

For more control, use the `classNameLabel` and `classNameSelect` props to apply your own CSS classes:

```tsx
<CountryDropdown
  selectedCountry=""
  onCountryChange={handleChange}
  classNameLabel="form-label"
  classNameSelect="form-select"
/>
```

```css
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #cbd5e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
}
```

### Completely Unstyled

If you want to provide all styling yourself:

1. **Don't import the CSS file**
2. **Provide custom classes for all elements**

```tsx
// No CSS import!

<CountryDropdown
  selectedCountry=""
  onCountryChange={handleChange}
  classNameLabel="your-custom-label-class"
  classNameSelect="your-custom-select-class"
/>
```

The components will render with clean HTML and your classes, giving you complete control.

## Accessibility

### Built-in Accessibility Features

The default styles include critical accessibility features:

1. **Color Contrast**: All color combinations meet WCAG 2.1 AA standards (4.5:1 for normal text)
2. **Focus Indicators**: Clearly visible focus rings with sufficient contrast
3. **High Contrast Mode**: Enhanced borders and outlines when high contrast mode is enabled
4. **Reduced Motion**: Respects `prefers-reduced-motion` media query
5. **Touch Targets**: Adequate size for touch input (44x44px minimum)

### Testing Accessibility

When customizing styles, ensure:

- Text has sufficient contrast against backgrounds (use tools like WebAIM Contrast Checker)
- Focus indicators are clearly visible
- Touch/click targets are at least 44x44px
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard navigation (Tab, Enter, Arrow keys)

### Accessibility Example

```css
/* Ensure strong focus indicators */
.my-select:focus {
  outline: 3px solid var(--rcss-primary-color);
  outline-offset: 2px;
}

/* Provide sufficient color contrast */
.my-label {
  color: #000000; /* Black on white = 21:1 contrast ratio */
}

/* Support high contrast mode */
@media (prefers-contrast: high) {
  .my-select {
    border-width: 3px;
  }
}
```

## Examples

### Example 1: Bootstrap Theme

```tsx
import 'react-country-state-selector/dist/react-country-state-selector.css';
import './bootstrap-theme.css';
```

```css
/* bootstrap-theme.css */
:root {
  --rcss-primary-color: #0d6efd;
  --rcss-primary-hover: #0b5ed7;
  --rcss-border-color: #dee2e6;
  --rcss-border-radius: 0.375rem;
  --rcss-focus-ring-color: rgba(13, 110, 253, 0.25);
  --rcss-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

### Example 2: Tailwind-inspired Custom Classes

```tsx
<CountryDropdown
  selectedCountry=""
  onCountryChange={handleChange}
  classNameLabel="block text-sm font-medium text-gray-700 mb-1"
  classNameSelect="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
/>
```

### Example 3: Full Custom Styling

```tsx
import './my-custom-styles.css';

<CountryDropdown
  selectedCountry=""
  onCountryChange={handleChange}
  classNameLabel="dropdown-label"
  classNameSelect="dropdown-select"
/>
```

```css
/* my-custom-styles.css */
.dropdown-label {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.dropdown-select {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #2d3748;
  background-color: #fff;
  background-clip: padding-box;
  border: 2px solid #cbd5e0;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  appearance: none;
}

.dropdown-select:focus {
  color: #2d3748;
  background-color: #fff;
  border-color: #667eea;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.dropdown-select:disabled {
  background-color: #e2e8f0;
  opacity: 1;
}
```

### Example 4: Responsive Design

```css
:root {
  --rcss-font-size: 0.875rem;
  --rcss-spacing: 0.375rem;
}

/* Larger sizes on tablets and up */
@media (min-width: 768px) {
  :root {
    --rcss-font-size: 1rem;
    --rcss-spacing: 0.5rem;
  }
}

/* Even larger on desktops */
@media (min-width: 1024px) {
  :root {
    --rcss-font-size: 1.125rem;
    --rcss-spacing: 0.625rem;
  }
}
```

## Best Practices

### 1. Start with CSS Variables

Before writing custom CSS classes, try customizing the CSS variables. This is the simplest approach and maintains consistency.

### 2. Keep Accessibility in Mind

Always test your custom styles for:
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus indicators

### 3. Use Semantic Class Names

If providing custom classes, use descriptive names:
- ✅ `classNameLabel="form-label-primary"`
- ❌ `classNameLabel="blue-text-small"`

### 4. Maintain Consistency

If customizing multiple components, ensure they share the same design language:

```tsx
const labelClass = "form-label";
const selectClass = "form-select";

<CountryDropdown classNameLabel={labelClass} classNameSelect={selectClass} />
<StateDropdown classNameLabel={labelClass} classNameSelect={selectClass} />
<LanguageDropdown classNameLabel={labelClass} classNameSelect={selectClass} />
```

### 5. Document Your Customizations

Keep track of your CSS variable overrides and custom classes for easier maintenance:

```css
/**
 * react-country-state-selector Theme Customization
 * 
 * Purpose: Match company brand colors and design system
 * Updated: 2024-01-01
 */
:root {
  --rcss-primary-color: #1a73e8; /* Company blue */
  --rcss-font-family: 'Inter', sans-serif; /* Brand font */
}
```

### 6. Test Across Browsers

Test your custom styles in different browsers and devices:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

### 7. Consider Print Styles

If your application needs to be printed, consider adding print-specific styles:

```css
@media print {
  select#country-select,
  select#state-province-select,
  select#language-select {
    border: 1px solid #000;
    background: #fff;
  }
}
```

## Browser Support

The default styles use modern CSS features but are designed to work in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Samsung Internet 13+

If you need to support older browsers, you may need to adjust some CSS features (e.g., CSS custom properties require IE11 polyfills).

## Performance Considerations

The default CSS is:
- **Minimal**: Only ~6KB (minified and gzipped: ~1KB)
- **Efficient**: Uses modern CSS features for optimal performance
- **Tree-shakeable**: Only includes styles for imported components

## Troubleshooting

### Styles Not Applying

1. **Ensure CSS is imported**: Check that you've imported the CSS file
2. **Check CSS specificity**: Your custom styles may need higher specificity
3. **Verify build process**: Ensure your bundler is processing CSS files

### Custom Classes Not Working

1. **Check prop names**: Use `classNameLabel` and `classNameSelect` (not `className`)
2. **Verify CSS is loaded**: Check browser dev tools to see if your CSS file is loaded
3. **Inspect element**: Use browser dev tools to see which classes are applied

### Focus Rings Not Visible

Some CSS reset libraries remove focus outlines. Ensure you're adding them back:

```css
select:focus {
  outline: 2px solid var(--rcss-primary-color);
  outline-offset: 2px;
}
```

## Additional Resources

- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Can I Use - CSS Custom Properties](https://caniuse.com/css-variables)

## Contributing

If you have suggestions for improving the default styles or this documentation, please open an issue or pull request on GitHub.
