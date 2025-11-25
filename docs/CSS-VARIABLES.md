# CSS Custom Properties Reference

This guide provides a complete reference for all CSS custom properties (variables) used in `react-country-state-selector`. Use these variables to customize the appearance of the dropdown components to match your design system.

## Table of Contents

- [Overview](#overview)
- [Complete Variable List](#complete-variable-list)
- [Variable Groups](#variable-groups)
  - [Colors](#colors)
  - [Borders](#borders)
  - [Typography](#typography)
  - [Spacing](#spacing)
- [Usage Examples](#usage-examples)
- [Browser Support](#browser-support)

---

## Overview

CSS custom properties allow you to customize the appearance of the library components without writing complex CSS. Simply override the variables in your stylesheet:

```css
:root {
  --rcss-primary-color: #your-color;
  --rcss-border-radius: 0.5rem;
  /* ... more variables */
}
```

All variables are prefixed with `--rcss-` (react-country-state-selector) to avoid naming conflicts.

---

## Complete Variable List

Here's the complete list of all available CSS custom properties with their default values:

```css
:root {
  /* Primary Colors */
  --rcss-primary-color: #0066cc;
  --rcss-primary-hover: #0052a3;
  
  /* Border Styling */
  --rcss-border-color: #d1d5db;
  --rcss-border-radius: 0.375rem;
  
  /* Focus State */
  --rcss-focus-ring-color: rgba(0, 102, 204, 0.4);
  
  /* Text Colors */
  --rcss-text-color: #1f2937;
  --rcss-label-color: #374151;
  
  /* Background Colors */
  --rcss-background-color: #ffffff;
  --rcss-disabled-background: #f3f4f6;
  
  /* Error Styling */
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

---

## Variable Groups

### Colors

#### Primary Colors

**`--rcss-primary-color`**
- **Default:** `#0066cc` (Blue)
- **Used for:** Border on focus, links, interactive elements
- **Example:** 
  ```css
  --rcss-primary-color: #10b981; /* Green */
  ```

**`--rcss-primary-hover`**
- **Default:** `#0052a3` (Darker blue)
- **Used for:** Border color on hover state
- **Example:**
  ```css
  --rcss-primary-hover: #059669; /* Darker green */
  ```

#### Text Colors

**`--rcss-text-color`**
- **Default:** `#1f2937` (Dark gray)
- **Used for:** Select/input text, dropdown options
- **Requirements:** Must meet WCAG AA contrast ratio (4.5:1) against background
- **Example:**
  ```css
  --rcss-text-color: #000000; /* Black for maximum contrast */
  ```

**`--rcss-label-color`**
- **Default:** `#374151` (Medium gray)
- **Used for:** Label text
- **Requirements:** Must meet WCAG AA contrast ratio (4.5:1) against background
- **Example:**
  ```css
  --rcss-label-color: #4b5563; /* Slightly lighter gray */
  ```

#### Background Colors

**`--rcss-background-color`**
- **Default:** `#ffffff` (White)
- **Used for:** Select/input background, dropdown background
- **Example:**
  ```css
  --rcss-background-color: #f9fafb; /* Off-white */
  ```

**`--rcss-disabled-background`**
- **Default:** `#f3f4f6` (Light gray)
- **Used for:** Background of disabled select/input elements
- **Example:**
  ```css
  --rcss-disabled-background: #e5e7eb; /* Slightly darker gray */
  ```

#### Error Colors

**`--rcss-error-color`**
- **Default:** `#dc2626` (Red)
- **Used for:** Error message text
- **Example:**
  ```css
  --rcss-error-color: #ef4444; /* Brighter red */
  ```

**`--rcss-error-background`**
- **Default:** `#fef2f2` (Light red)
- **Used for:** Error message background
- **Example:**
  ```css
  --rcss-error-background: #fee2e2; /* Slightly darker red background */
  ```

**`--rcss-error-border`**
- **Default:** `#fecaca` (Light red border)
- **Used for:** Error message border
- **Example:**
  ```css
  --rcss-error-border: #fca5a5; /* Slightly darker red border */
  ```

---

### Borders

**`--rcss-border-color`**
- **Default:** `#d1d5db` (Gray)
- **Used for:** Default border color of select/input elements
- **Example:**
  ```css
  --rcss-border-color: #9ca3af; /* Darker gray */
  ```

**`--rcss-border-radius`**
- **Default:** `0.375rem` (6px)
- **Used for:** Border radius of all elements (select, input, error messages)
- **Example:**
  ```css
  --rcss-border-radius: 0.5rem; /* More rounded (8px) */
  --rcss-border-radius: 0.25rem; /* Less rounded (4px) */
  --rcss-border-radius: 0; /* Square corners */
  ```

**`--rcss-focus-ring-color`**
- **Default:** `rgba(0, 102, 204, 0.4)` (Semi-transparent blue)
- **Used for:** Focus ring shadow around focused elements
- **Note:** Should be a semi-transparent version of your primary color
- **Example:**
  ```css
  --rcss-focus-ring-color: rgba(16, 185, 129, 0.4); /* Semi-transparent green */
  ```

---

### Typography

**`--rcss-font-family`**
- **Default:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Used for:** All text in the component
- **Example:**
  ```css
  --rcss-font-family: 'Inter', sans-serif; /* Custom web font */
  --rcss-font-family: 'Roboto', sans-serif; /* Google Font */
  ```

**`--rcss-font-size`**
- **Default:** `1rem` (16px)
- **Used for:** Select/input text size, error messages
- **Example:**
  ```css
  --rcss-font-size: 0.875rem; /* Smaller (14px) */
  --rcss-font-size: 1.125rem; /* Larger (18px) */
  ```

**`--rcss-label-font-size`**
- **Default:** `0.875rem` (14px)
- **Used for:** Label text size
- **Example:**
  ```css
  --rcss-label-font-size: 0.75rem; /* Smaller (12px) */
  --rcss-label-font-size: 1rem; /* Same as body text */
  ```

---

### Spacing

**`--rcss-spacing`**
- **Default:** `0.5rem` (8px)
- **Used for:** Margin bottom of labels, padding in error messages
- **Example:**
  ```css
  --rcss-spacing: 0.375rem; /* Tighter spacing (6px) */
  --rcss-spacing: 0.75rem; /* Looser spacing (12px) */
  ```

---

## Usage Examples

### Example 1: Brand Color Integration

```css
/* Match your company brand colors */
:root {
  --rcss-primary-color: #6366f1; /* Indigo brand color */
  --rcss-primary-hover: #4f46e5; /* Darker indigo */
  --rcss-focus-ring-color: rgba(99, 102, 241, 0.4); /* Semi-transparent indigo */
}
```

### Example 2: Dark Mode

```css
/* Dark mode color scheme */
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
}
```

### Example 3: Compact Design

```css
/* Reduce sizes and spacing for compact layouts */
:root {
  --rcss-font-size: 0.875rem;
  --rcss-label-font-size: 0.75rem;
  --rcss-spacing: 0.375rem;
  --rcss-border-radius: 0.25rem;
}
```

### Example 4: Large Touch Targets

```css
/* Increase sizes for better touch accessibility */
:root {
  --rcss-font-size: 1.125rem;
  --rcss-label-font-size: 1rem;
  --rcss-spacing: 0.75rem;
  --rcss-border-radius: 0.5rem;
}
```

### Example 5: High Contrast

```css
/* High contrast for better accessibility */
:root {
  --rcss-primary-color: #0000ff; /* Pure blue */
  --rcss-text-color: #000000; /* Pure black */
  --rcss-background-color: #ffffff; /* Pure white */
  --rcss-border-color: #000000; /* Black borders */
  --rcss-error-color: #ff0000; /* Pure red */
}
```

### Example 6: Custom Web Fonts

```css
/* Using custom web fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --rcss-font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

---

## Combining with Preset Themes

You can use CSS custom properties to override specific aspects of preset themes:

```css
/* Load a preset theme */
@import 'react-country-state-selector/dist/themes/minimal.css';

/* Override specific variables */
:root {
  --rcss-primary-color: #10b981; /* Change to green */
  --rcss-border-radius: 0.5rem; /* More rounded */
}
```

---

## Advanced Customization

### Per-Component Variables

While the library doesn't provide per-component variables by default, you can create your own using CSS scoping:

```css
/* Different colors for different dropdowns */
.country-section {
  --rcss-primary-color: #3b82f6; /* Blue for countries */
}

.state-section {
  --rcss-primary-color: #10b981; /* Green for states */
}
```

```tsx
<div className="country-section">
  <CountryDropdown {...props} />
</div>

<div className="state-section">
  <StateDropdown {...props} />
</div>
```

### Responsive Variables

Change variables based on screen size:

```css
:root {
  --rcss-font-size: 0.875rem;
  --rcss-spacing: 0.375rem;
}

@media (min-width: 768px) {
  :root {
    --rcss-font-size: 1rem;
    --rcss-spacing: 0.5rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --rcss-font-size: 1.125rem;
    --rcss-spacing: 0.625rem;
  }
}
```

---

## Important Notes

### Dropdown Arrow Color

⚠️ **Important:** The dropdown arrow color is embedded in an SVG data URI and **cannot** be changed using CSS custom properties. To customize the arrow color, you must override the entire `background-image` property.

See the [Styling Guide](./STYLING.md#customizing-the-dropdown-arrow) for details on customizing the arrow color.

### Browser Support

CSS custom properties are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- iOS Safari 9.3+

For IE11 support, you'll need a CSS custom property polyfill.

### Specificity

CSS custom properties follow standard CSS specificity rules. If variables aren't applying:

1. Check that you're setting them in `:root` or a parent element
2. Verify the import order of your CSS files
3. Use browser dev tools to inspect which values are being applied

---

## Testing Your Customizations

After customizing variables, test:

1. **Accessibility**
   - Color contrast ratios (use tools like WebAIM Contrast Checker)
   - Focus indicators are clearly visible
   - Test with screen readers

2. **Different States**
   - Default state
   - Hover state
   - Focus state
   - Disabled state
   - Error state

3. **Browser Compatibility**
   - Test in different browsers
   - Test on mobile devices
   - Test in different color schemes (light/dark mode)

4. **User Preferences**
   - High contrast mode
   - Reduced motion
   - Different zoom levels

---

## Quick Reference Table

| Variable | Default | Purpose |
|----------|---------|---------|
| `--rcss-primary-color` | `#0066cc` | Primary interactive color |
| `--rcss-primary-hover` | `#0052a3` | Hover state color |
| `--rcss-border-color` | `#d1d5db` | Default border color |
| `--rcss-border-radius` | `0.375rem` | Corner radius |
| `--rcss-focus-ring-color` | `rgba(0, 102, 204, 0.4)` | Focus ring color |
| `--rcss-text-color` | `#1f2937` | Text color |
| `--rcss-label-color` | `#374151` | Label color |
| `--rcss-background-color` | `#ffffff` | Background color |
| `--rcss-disabled-background` | `#f3f4f6` | Disabled background |
| `--rcss-error-color` | `#dc2626` | Error text color |
| `--rcss-error-background` | `#fef2f2` | Error background |
| `--rcss-error-border` | `#fecaca` | Error border |
| `--rcss-font-family` | System fonts | Font family |
| `--rcss-font-size` | `1rem` | Body text size |
| `--rcss-label-font-size` | `0.875rem` | Label text size |
| `--rcss-spacing` | `0.5rem` | Standard spacing |

---

## Additional Resources

- [Main Styling Guide](./STYLING.md) - Complete styling documentation
- [Preset Themes Guide](./THEMES.md) - Ready-to-use theme presets
- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) - Browser documentation
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) - Accessibility standards

---

## Support

If you have questions about CSS custom properties or customization:

1. Review the [Styling Guide](./STYLING.md)
2. Check the [Preset Themes](./THEMES.md) for examples
3. Open an issue on [GitHub](https://github.com/utdcometsoccer/react-country-state-selector/issues)
