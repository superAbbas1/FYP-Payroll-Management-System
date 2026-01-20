# Typography System - Visual Guide

## Font Stack
```
'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
```
Modern, clean, professional appearance. Fallback chain ensures cross-platform compatibility.

---

## Heading Hierarchy

### H1 - Primary Heading (Page Title)
- **Size**: clamp(1.8rem, 5vw, 2.5rem)
- **Weight**: 700 (Bold)
- **Line Height**: 1.2
- **Letter Spacing**: -0.5px
- **Color**: #1a1a1a
- **Margin Bottom**: 1.5rem
- **Use Case**: Page titles, main section headings
```jsx
<h1>Employee Dashboard</h1>
<h1 className="heading-primary">Employee Dashboard</h1>
```

---

### H2 - Secondary Heading (Section Title)
- **Size**: clamp(1.4rem, 3.5vw, 2rem)
- **Weight**: 600 (Semibold)
- **Line Height**: 1.3
- **Letter Spacing**: -0.25px
- **Color**: #2c2c2c
- **Margin Bottom**: 1.2rem
- **Use Case**: Section titles, major groupings
```jsx
<h2>Employee Management</h2>
<h2 className="heading-secondary">Employee Management</h2>
```

---

### H3 - Tertiary Heading (Subsection)
- **Size**: clamp(1.1rem, 2.5vw, 1.5rem)
- **Weight**: 600 (Semibold)
- **Line Height**: 1.4
- **Color**: #404040
- **Margin Bottom**: 0.8rem
- **Use Case**: Subsection titles, card headers
```jsx
<h3>Personal Details</h3>
<h3 className="heading-tertiary">Personal Details</h3>
```

---

### H4 - Quaternary Heading (Label/Small Title)
- **Size**: clamp(0.95rem, 2vw, 1.2rem)
- **Weight**: 600 (Semibold)
- **Line Height**: 1.4
- **Color**: #555555
- **Margin Bottom**: 0.6rem
- **Use Case**: Field groups, small titles
```jsx
<h4>Date of Birth:</h4>
<h4 className="heading-quaternary">Date of Birth:</h4>
```

---

## Body Text

### Standard Paragraph
- **Size**: clamp(0.9rem, 1.5vw, 1.05rem)
- **Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Color**: #333333
- **Margin Bottom**: 1rem
- **Use Case**: Main content, descriptions
```jsx
<p>This is the employee information section where you can view and edit details.</p>
```

---

## Supporting Text

### Form Label
- **Size**: clamp(0.85rem, 1.3vw, 1rem)
- **Weight**: 600 (Semibold)
- **Color**: #333333
- **Margin Bottom**: 0.5rem
- **Display**: Block
- **Use Case**: Form field labels
```jsx
<label className="form-label">Employee Name</label>
```

---

### Small Text / Caption
- **Size**: clamp(0.75rem, 1vw, 0.9rem)
- **Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Color**: #666666
- **Use Case**: Hints, captions, secondary information
```jsx
<small className="text-small">Optional field</small>
<span className="caption">Last updated 2 hours ago</span>
```

---

### Extra Small Text
- **Size**: clamp(0.65rem, 0.8vw, 0.8rem)
- **Weight**: 400 (Regular)
- **Line Height**: 1.4
- **Color**: #888888
- **Use Case**: Validation messages, tiny text
```jsx
<span className="text-extra-small">Password must be 8+ characters</span>
```

---

## Font Weights & Usage

| Weight | Name | Usage | Example |
|--------|------|-------|---------|
| 400 | Regular | Body text, paragraphs | Lorem ipsum dolor sit amet |
| 500 | Medium | Button text, emphasis | **Button Label** |
| 600 | Semibold | Labels, subheadings | Employee Information |
| 700 | Bold | Main headings, titles | Dashboard |

---

## Responsive Typography

All typography uses `clamp()` for automatic responsive scaling:

```css
/* How clamp() works */
font-size: clamp(MIN, PREFERRED, MAX)

/* Mobile (320px) → MIN value */
/* Tablet (768px) → PREFERRED value */
/* Desktop (1920px) → MAX value */
/* Scales smoothly in between */
```

### Example Breakpoints

```
Heading 1: clamp(1.8rem, 5vw, 2.5rem)
  Mobile (320px):  ~1.8rem (no scaling down)
  Tablet (768px):  ~2.1rem (scaled)
  Desktop (1920px): ~2.5rem (max)

Paragraph: clamp(0.9rem, 1.5vw, 1.05rem)
  Mobile:   ~0.9rem
  Tablet:   ~1rem
  Desktop:  ~1.05rem
```

---

## Text Colors

### Color Palette

| Use | Color | Hex | Usage |
|-----|-------|-----|-------|
| Primary Headings | Dark | #1a1a1a | H1, H2 |
| Secondary Text | Medium Gray | #333333 | Body, H3 |
| Tertiary Text | Light Gray | #666666 | Small text |
| Quaternary | Very Light | #888888 | Hints, disabled |
| Links/Actions | Blue | #007bff | Interactive |
| Success | Green | #28a745 | Confirmations |
| Error | Red | #dc3545 | Validations |
| Warning | Orange | #ffc107 | Alerts |

---

## Text Alignment

### Center Aligned
- Section titles
- Headings
- Buttons
- Modal headers
```jsx
<h2 className="text-center">Dashboard</h2>
```

### Left Aligned (Default)
- Body paragraphs
- List items
- Form labels
- Tables

### Right Aligned
- Numbers in tables
- Prices
- Amounts
- Currency

```jsx
<span className="text-right">$1,000.00</span>
```

---

## Line Height Reference

| Value | Size Range | Use Case |
|-------|------------|----------|
| 1.2 | Headings (H1) | Tight, impactful |
| 1.3 | Headings (H2) | Section titles |
| 1.4 | Headings (H3-H4) | Subsections |
| 1.5 | Small text | Captions, hints |
| 1.6 | Body text | Paragraphs, readability |

Larger line heights improve readability for body text.

---

## Letter Spacing

| Value | Type | Use Case |
|-------|------|----------|
| -0.5px | H1 | Tighter, premium look |
| -0.25px | H2 | Slightly tighter |
| 0 (default) | H3-H4 | Normal |
| 0.5px | Tables | Uppercase headers |
| 0 | Body | Normal readability |

---

## Bold Text Styling

### Using Strong Tag
```jsx
<p>This is <strong>important</strong> information.</p>
```
- Automatically uses 600 weight
- Semantic meaning for screen readers
- Preferred method

### Using Class
```jsx
<p>This is <span className="text-bold">important</span> information.</p>
```
- Also uses 600 weight
- Use when semantic tag not appropriate

### Using Inline Styles (Not Recommended)
```jsx
<span style={{ fontWeight: '600' }}>Important</span>
```
- Avoid this - breaks consistency
- Use classes instead

---

## Validation & Error Text

### Error Message
- Color: #dc3545 (Red)
- Size: clamp(0.65rem, 0.8vw, 0.8rem)
- Weight: 400
- Class: `.validation-error`
```jsx
<span className="validation-error">Email is required</span>
```

### Success Message
- Color: #28a745 (Green)
- Size: clamp(0.65rem, 0.8vw, 0.8rem)
- Weight: 400
- Class: `.validation-success`
```jsx
<span className="validation-success">Password strength: Strong</span>
```

---

## Disabled & Inactive Text

### Disabled Text
- Color: #888888 (Quaternary)
- Opacity: 0.6
- Weight: 400
- Use Case: Disabled form fields, inactive items
```jsx
<input disabled />
<span className="text-quaternary">Disabled field</span>
```

---

## Table Headers vs Body Text

### Table Header
- Size: clamp(0.9rem, 1.4vw, 1.05rem)
- Weight: 600
- Color: #ffffff
- Background: #1a1a1a
- Text Transform: UPPERCASE
- Letter Spacing: 0.5px

### Table Data
- Size: clamp(0.85rem, 1.3vw, 0.95rem)
- Weight: 400
- Color: #333333
- Line Height: 1.6

```jsx
<table className="table">
  <thead>
    <tr>
      <th>Employee ID</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>EMP001</td>
      <td>John Doe</td>
    </tr>
  </tbody>
</table>
```

---

## Mobile Typography Adjustments

### Breakpoint: 786px

**What happens on mobile:**
- Font sizes scale down automatically (thanks to clamp())
- Line heights increase for better readability on small screens
- Headings may appear smaller but are still prominent
- Body text maintains 1.6 line height for readability
- Labels are still bold and visible

**No need for media queries** - clamp() handles scaling automatically!

---

## Typography Checklist for New Components

- [ ] Main heading uses h1 (or .heading-primary)
- [ ] Section headings use h2 (or .heading-secondary)
- [ ] Body text uses <p> (or .text-body)
- [ ] Labels use .form-label class
- [ ] All font sizes use clamp()
- [ ] Font weights are 400, 500, 600, or 700 (never "bold")
- [ ] Text color is from approved palette
- [ ] Line heights match purpose (1.2 for headers, 1.6 for body)
- [ ] Mobile text is readable (minimum 12px recommended)
- [ ] Contrast ratio meets accessibility standards (4.5:1)

---

## Common Mistakes to Avoid

❌ **Don't:** Use px units for font sizes
```jsx
// Bad
style={{ fontSize: '16px' }}
```

✅ **Do:** Use rem units or clamp()
```jsx
// Good
className="text-body"
style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
```

---

❌ **Don't:** Mix font families
```jsx
// Bad
.button { font-family: 'Verdana'; }
.heading { font-family: 'Arial'; }
```

✅ **Do:** Inherit from body
```jsx
// Good - all inherit from body
body { font-family: 'Segoe UI', sans-serif; }
```

---

❌ **Don't:** Use hardcoded colors
```jsx
// Bad
color: 'blue'; /* Which blue? */
color: 'red';  /* Which red? */
```

✅ **Do:** Use semantic color names
```jsx
// Good
color: #007bff; /* Info blue */
color: #dc3545; /* Danger red */
```

---

❌ **Don't:** Make bold with multiple values
```jsx
// Bad
font-weight: bold;
font-weight: 700;
```

✅ **Do:** Use consistent weights
```jsx
// Good
font-weight: 600; /* Semibold */
font-weight: 700; /* Bold */
```

---

**Version**: 1.0
**Last Updated**: January 18, 2026
**Status**: Production Ready ✅
