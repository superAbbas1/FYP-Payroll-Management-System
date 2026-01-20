# CSS Implementation Checklist

This checklist helps ensure new components follow the optimized CSS system.

---

## ✅ For New Components

### Typography
- [ ] Use h1-h4 tags (or .heading-primary through .heading-quaternary)
- [ ] Body text uses standard `<p>` tags with .text-body class
- [ ] Labels use `.form-label` class
- [ ] Small text uses `.text-small` or `<small>` tags
- [ ] Validation messages use `.validation-error` or `.validation-success`
- [ ] No custom font-family declarations (inherit from body)
- [ ] Font sizes use responsive `clamp()` function
- [ ] Font weights are 400, 500, 600, or 700 (never "bold")

### Buttons
- [ ] All buttons use `.btn` base class
- [ ] Button type is specified: `.btn-primary`, `.btn-secondary`, etc.
- [ ] Size variant used if needed: `.btn-sm` or `.btn-lg`
- [ ] Icon buttons use `.btn-icon` class
- [ ] Disabled state uses `disabled` attribute
- [ ] No custom button styling in component CSS
- [ ] Hover effects use `transition: all 0.2s ease-in-out`
- [ ] No hardcoded colors (use semantic classes)

### Forms
- [ ] Form inputs wrapped in `.form-group`
- [ ] Labels use `.form-label` class
- [ ] Inputs have consistent padding: 10px
- [ ] Focus states use blue border (#007bff)
- [ ] Validation text uses appropriate color class
- [ ] Form selects match input styling
- [ ] Textareas use same font as inputs

### Cards & Containers
- [ ] Cards use `.card` class
- [ ] Headers use `.card-header`
- [ ] Content uses `.card-body`
- [ ] Footer uses `.card-footer`
- [ ] Light backgrounds use `.container-light`
- [ ] No box-shadow duplication (use standard)
- [ ] Hover effects are subtle (`transform: translateY(-2px)`)

### Tables
- [ ] Tables use `.table` class
- [ ] Headers use semantic `<thead>` and `.table-header` styling
- [ ] Data uses `<tbody>`
- [ ] Row hover effects for interactivity
- [ ] Header background is dark (#1a1a1a)
- [ ] Consistent cell padding: 10px 15px
- [ ] Alternating row colors if needed

### Modals
- [ ] Overlay uses `.modal-overlay` class
- [ ] Content uses `.modal-content` class
- [ ] Structure: header, body, footer sections
- [ ] Close button uses `.btn-icon` class
- [ ] Z-index: 1000+
- [ ] Max height with overflow scroll
- [ ] Slide-down animation on entry

### Lists
- [ ] Items use `.list-item` class
- [ ] Striped variant uses `.striped` class
- [ ] Consistent spacing and borders
- [ ] Hover effects for interactivity
- [ ] No custom list styling

### Layouts
- [ ] Use flexbox utilities: `.flex-center`, `.flex-between`
- [ ] Use grid classes: `.grid-1-col`, `.grid-2-col`, `.grid-3-col`
- [ ] Use utility classes for spacing: `.m-*`, `.p-*`, `.gap-*`
- [ ] Responsive design with mobile breakpoint (786px)
- [ ] Grid adjusts to 1 column on mobile

---

## ✅ For Styling Updates

### Colors
- [ ] Primary text: #1a1a1a (not pure black)
- [ ] Secondary text: #333333
- [ ] Labels/tertiary: #666666
- [ ] Disabled/quaternary: #888888
- [ ] Borders: #cccccc (not #ccc)
- [ ] Backgrounds: #f9f9f9 or #f0f2f5
- [ ] Headers: #1a1a1a text on white/dark bg
- [ ] Semantic: green (#28a745), red (#dc3545), orange (#ffc107), blue (#007bff)

### Transitions
- [ ] All interactive elements use transitions
- [ ] Standard: `transition: all 0.2s ease-in-out`
- [ ] Buttons: 0.2s
- [ ] Modals: 0.3-0.5s for entry/exit
- [ ] Hover effects: smooth and responsive

### Responsive
- [ ] Mobile-first approach
- [ ] Breakpoint: 786px
- [ ] Use media queries for layout shifts
- [ ] Test on: mobile (320px), tablet (768px), desktop (1920px)
- [ ] Font sizes use `clamp()` for fluid scaling
- [ ] Touch-friendly button sizes (minimum 44px)

### Accessibility
- [ ] Focus states are visible (not removed)
- [ ] Color contrast ratios met (4.5:1 for text)
- [ ] Buttons have descriptive labels
- [ ] Form inputs have associated labels
- [ ] Error messages are semantic (not just color)
- [ ] ARIA attributes used where needed

---

## ✅ For Component CSS Files

### File Structure
```css
/* ComponentName.css */

/* 1. Section comment */
.component-class {
  /* Styles */
}

/* 2. Child element */
.component-class .child {
  /* Styles */
}

/* 3. States */
.component-class.active {
  /* Styles */
}

.component-class:hover {
  /* Styles */
}

/* 4. Responsive */
@media screen and (max-width: 786px) {
  .component-class {
    /* Mobile styles */
  }
}
```

### Style Organization
- [ ] Group related styles together
- [ ] Use clear section comments
- [ ] Parent styles before child selectors
- [ ] Hover/active states after default
- [ ] Media queries at the end
- [ ] No unnecessary nesting
- [ ] Maximum specificity: 2-3 levels

### CSS Practices
- [ ] No !important flags (except for overrides)
- [ ] Use shorthand properties where applicable
- [ ] Consistent formatting and indentation
- [ ] Remove unused CSS (or mark as legacy)
- [ ] Comments explain non-obvious styling
- [ ] No hardcoded colors in components
- [ ] No inline styles in components

### Properties to Avoid
- [ ] ❌ `bold` (use font-weight: 600)
- [ ] ❌ Font-family overrides (use global)
- [ ] ❌ `red`, `blue` (use hex colors)
- [ ] ❌ Hardcoded sizes for mobile
- [ ] ❌ `z-index` values > 1000
- [ ] ❌ Multiple transition definitions
- [ ] ❌ Unused vendor prefixes

---

## ✅ Code Review Checklist

Before merging CSS changes:

### Functionality
- [ ] Component renders without errors
- [ ] All states work (hover, focus, active, disabled)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Cross-browser compatibility verified
- [ ] Performance impact assessed

### Code Quality
- [ ] No duplication of existing classes
- [ ] Follows naming conventions
- [ ] Uses utility classes where applicable
- [ ] Minimal CSS-in-JS or inline styles
- [ ] Proper use of semantic HTML
- [ ] CSS is modular and reusable

### Design Consistency
- [ ] Typography matches system
- [ ] Colors match palette
- [ ] Spacing consistent with design
- [ ] Button styles standardized
- [ ] Hover effects smooth and intentional

### Accessibility
- [ ] Color not only indicator
- [ ] Focus states visible
- [ ] Contrast ratios met
- [ ] Touch-friendly sizes
- [ ] No motion that triggers seizures

### Documentation
- [ ] Component usage documented
- [ ] Class purposes clear from names
- [ ] Complex styling has comments
- [ ] Edge cases handled

---

## ✅ Git Commit Message Template

```
feat: Add Employee List component with professional CSS

- Added .employee-list-container with consistent styling
- Used .table class for data display
- Buttons follow .btn-primary/.btn-secondary pattern
- Typography uses .heading-secondary and .text-body
- Mobile responsive with 786px breakpoint
- All validation errors use .validation-error class

Follows CSS Optimization System guidelines
```

---

## ✅ Testing Checklist

### Visual Testing
- [ ] Typography hierarchy looks professional
- [ ] Button sizes appropriate
- [ ] Colors consistent
- [ ] Spacing balanced
- [ ] Shadows subtle and consistent
- [ ] No layout shifts
- [ ] Mobile layout stacks properly

### Interaction Testing
- [ ] Hover effects work smoothly
- [ ] Click states visible
- [ ] Focus states keyboard accessible
- [ ] Disabled states clear
- [ ] Form validation messages clear
- [ ] Modals open/close smoothly
- [ ] Buttons trigger correct actions

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Chrome Mobile

### Performance Testing
- [ ] CSS bundle size checked
- [ ] No performance regressions
- [ ] Animations smooth (60fps)
- [ ] No layout thrashing
- [ ] Font loading optimized

---

## ✅ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Button text wraps | Use `white-space: nowrap` on `.btn` |
| Icon misaligned | Verify `.btn` uses `display: flex` |
| Font too large on mobile | Check `clamp()` values |
| Color doesn't match | Verify hex code matches palette |
| Hover effect janky | Use `transition: all 0.2s` |
| Modal not centered | Verify `.modal-overlay` flex properties |
| Table misaligned | Check `border-collapse: collapse` |
| Focus state missing | Add `:focus { outline: none; box-shadow: ... }` |

---

## ✅ When NOT to Use Global Classes

Sometimes component-specific CSS is needed:

- ❌ Unique layouts (use component CSS)
- ❌ Brand-specific styling (use component CSS)
- ❌ Complex animations (define in component CSS)
- ❌ Component-only interactions (use component CSS)
- ✅ But always extend from global system

Example:
```css
/* In Dashboard2.css - extend global .btn */
.emp-dashboard-feature-container .attendance-option {
  /* Override global .btn-info with specific styling */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slide-down 0.5s forwards;
}
```

---

## ✅ Performance Optimizations

### CSS Best Practices
- [ ] Minimize specificity (avoid deep nesting)
- [ ] Use class selectors (faster than attribute selectors)
- [ ] Avoid universal selector (*)
- [ ] Keep media queries at file end
- [ ] Combine rules where possible
- [ ] Remove redundant properties
- [ ] Use shorthand for margins/padding

### File Optimization
- [ ] Delete unused CSS rules
- [ ] Consolidate similar selectors
- [ ] Minify before production
- [ ] Use CSS variables for repeated values
- [ ] Load critical CSS first

---

## ✅ Version Updates

### When Adding New Features
1. [ ] Create component CSS file
2. [ ] Use global classes from index.css
3. [ ] Follow naming conventions
4. [ ] Add to CSS_QUICK_REFERENCE.md
5. [ ] Test thoroughly
6. [ ] Update summary if major changes

### When Modifying Global Styles
1. [ ] Update index.css
2. [ ] Test across all components
3. [ ] Update documentation
4. [ ] Note breaking changes
5. [ ] Create migration guide if needed

---

**Last Updated**: January 18, 2026
**System Version**: 1.0 (Production Ready)
**Maintained By**: FYP Development Team
