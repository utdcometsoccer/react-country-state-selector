# Visual Hierarchy: Typography and Spacing

## Overview

This document describes the visual hierarchy improvements made to the react-country-state-selector library through enhanced typography and spacing.

## Changes Made

### CSS Enhancements

Each dropdown component (`CountryDropdown`, `StateDropdown`, and `LanguageDropdown`) now includes default CSS classes that provide:

1. **Typography Improvements**:
   - Labels now have consistent font-size (14px), font-weight (600), and line-height (1.5)
   - Select elements use consistent font-size (14px) and line-height (1.5)
   - Text color for labels is set to `#212121` for better contrast

2. **Spacing Improvements**:
   - Container has bottom margin (16px) for spacing between form elements
   - Label has bottom margin (6px) for spacing from the select element
   - Select elements have padding (8px 12px) for better visual comfort

### Component Structure

Each dropdown component is now wrapped in a container div with default CSS classes:

```tsx
<div className="{component}-dropdown-container">
  <label className="{component}-dropdown-label">
    {Label}
  </label>
  <select className="{component}-dropdown-select">
    {/* options */}
  </select>
</div>
```

### CSS Classes

The following CSS classes are automatically applied:

#### CountryDropdown
- `.country-dropdown-container` - Container wrapper
- `.country-dropdown-label` - Label element
- `.country-dropdown-select` - Select element

#### StateDropdown
- `.state-dropdown-container` - Container wrapper
- `.state-dropdown-label` - Label element
- `.state-dropdown-select` - Select element

#### LanguageDropdown
- `.language-dropdown-container` - Container wrapper
- `.language-dropdown-label` - Label element
- `.language-dropdown-select` - Select element

## Customization

While default styles are now provided, you can still fully customize the appearance:

### Override with Custom Classes

The `classNameLabel` and `classNameSelect` props will override the default classes:

```tsx
<CountryDropdown
  selectedCountry="US"
  onCountryChange={handleChange}
  Label="Country"
  classNameLabel="my-custom-label"  // Overrides default
  classNameSelect="my-custom-select" // Overrides default
/>
```

### CSS Custom Styling

You can add your own CSS that targets the default classes:

```css
/* Override default label styles */
.country-dropdown-label {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

/* Override default select styles */
.country-dropdown-select {
  padding: 12px 16px;
  border-radius: 8px;
}
```

## Backward Compatibility

These changes are fully backward compatible:

- If you were using custom `classNameLabel` or `classNameSelect` props, they continue to work exactly as before
- If you were relying on browser default styles, the new default styles provide a better baseline while remaining unopinionated enough to integrate with any design system
- The component API and behavior remains unchanged

## Testing

16 new unit tests have been added to verify:

1. Default CSS classes are applied correctly
2. Custom classes override defaults as expected
3. All three components follow a consistent naming pattern
4. Container, label, and select elements have proper class attributes

Run tests with:
```bash
npm test -- src/tests/VisualHierarchy.test.tsx
```

## Benefits

### For Users
- Better out-of-the-box appearance without requiring custom CSS
- Clearer visual hierarchy makes forms easier to scan and use
- Improved typography and spacing enhance readability

### For Developers
- Consistent styling baseline across all dropdown components
- Easy to customize with CSS or custom class names
- No breaking changes to existing implementations

## Related Documentation

- [UI/UX Analysis Report](./UI-UX-ANALYSIS.md) - See Section 1 for the original recommendations
- [Main README](../README.md) - For general usage and API documentation

## Future Enhancements

Potential future improvements could include:

- CSS custom properties (CSS variables) for easy theming
- Additional visual states (focus, disabled, error)
- Dark mode support
- Animation and transition effects
- Preset themes (minimal, material, bootstrap-like)

These enhancements maintain the library's principle of being unopinionated while providing sensible defaults for better developer experience.
