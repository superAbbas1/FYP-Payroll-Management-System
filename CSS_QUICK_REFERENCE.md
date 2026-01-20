# CSS Quick Reference Guide - FYP Payroll

## Typography Classes

### Headings
```jsx
// Page Title
<h1>Dashboard</h1>
<h1 className="heading-primary">Dashboard</h1>

// Section Title
<h2>Employee Management</h2>
<h2 className="heading-secondary">Employee Management</h2>

// Subsection
<h3>Personal Details</h3>
<h3 className="heading-tertiary">Personal Details</h3>

// Small titles
<h4>Date:</h4>
<h4 className="heading-quaternary">Date:</h4>
```

### Text Styles
```jsx
// Regular paragraph
<p>This is body text</p>

// Small text / labels
<label className="form-label">Employee ID</label>
<small className="text-small">Optional field</small>

// Extra small (validation, hints)
<span className="text-extra-small">Password must be 8+ characters</span>

// Bold text
<strong>Important Note:</strong>
<span className="text-bold">Emphasized text</span>
```

---

## Button Classes

### Primary Buttons (Black - Main Actions)
```jsx
<button className="btn btn-primary">Save</button>
<button className="btn btn-primary btn-sm">Save</button>
<button className="btn btn-primary btn-lg">Save</button>
```

### Secondary Buttons (Outline - Alternative Actions)
```jsx
<button className="btn btn-secondary">Cancel</button>
<button className="btn btn-secondary">Edit</button>
```

### Success Buttons (Green - Approve/Confirm)
```jsx
<button className="btn btn-success">Approve</button>
<button className="btn btn-success">Accept</button>
```

### Danger Buttons (Red - Delete/Reject)
```jsx
<button className="btn btn-danger">Delete</button>
<button className="btn btn-danger">Reject</button>
```

### Info Buttons (Blue - Information/Special)
```jsx
<button className="btn btn-info">View Details</button>
<button className="btn btn-info">Submit</button>
```

### Icon-Only Buttons (Circular)
```jsx
<button className="btn btn-icon">
  <CloseIcon />
</button>
```

### With Icons
```jsx
<button className="btn btn-primary">
  <AddIcon />
  Add Employee
</button>
```

---

## Form Components

### Form Groups
```jsx
<div className="form-group">
  <label className="form-label">Employee Name</label>
  <input type="text" placeholder="Enter name" />
</div>

<div className="form-group">
  <label className="form-label">Department</label>
  <select>
    <option>Select Department</option>
  </select>
</div>
```

### Validation Messages
```jsx
<div className="form-group">
  <label className="form-label">Email</label>
  <input type="email" />
  <span className="validation-error">Invalid email format</span>
</div>

<div className="form-group">
  <label className="form-label">Password</label>
  <input type="password" />
  <span className="validation-success">Password strength: Strong</span>
</div>
```

---

## Card Components

### Basic Card
```jsx
<div className="card">
  <div className="card-header">
    <h3>Employee Information</h3>
  </div>
  <div className="card-body">
    <p>Employee details go here</p>
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Edit</button>
    <button className="btn btn-secondary">Cancel</button>
  </div>
</div>
```

### Light Container
```jsx
<div className="container-light">
  <h2>Dashboard Overview</h2>
  <p>Content here...</p>
</div>
```

---

## Table Components

### Professional Table
```jsx
<table className="table">
  <thead>
    <tr>
      <th>Employee ID</th>
      <th>Name</th>
      <th>Department</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>EMP001</td>
      <td>John Doe</td>
      <td>IT</td>
      <td>
        <button className="btn btn-sm btn-info">Edit</button>
        <button className="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

## Modal Components

### Modal Structure
```jsx
<div className="modal-overlay">
  <div className="modal-content">
    <div className="modal-header">
      <h2>Confirm Action</h2>
      <button className="btn btn-icon">
        <CloseIcon />
      </button>
    </div>
    <div className="modal-body">
      <p>Are you sure you want to delete this employee?</p>
    </div>
    <div className="modal-footer">
      <button className="btn btn-secondary">Cancel</button>
      <button className="btn btn-danger">Delete</button>
    </div>
  </div>
</div>
```

---

## List Components

### List Items
```jsx
<div>
  <div className="list-item">
    <h4>John Doe</h4>
    <p>Employee ID: EMP001</p>
  </div>
  <div className="list-item">
    <h4>Jane Smith</h4>
    <p>Employee ID: EMP002</p>
  </div>
</div>
```

### Striped List
```jsx
{employees.map((emp, idx) => (
  <div key={idx} className={`list-item striped`}>
    <div className="flex-between">
      <span>{emp.name}</span>
      <span>{emp.department}</span>
    </div>
  </div>
))}
```

---

## Utility Classes

### Flexbox
```jsx
<div className="flex-center">
  {/* Centered content */}
</div>

<div className="flex-between">
  {/* Space-between layout */}
</div>
```

### Text Alignment
```jsx
<p className="text-center">Centered text</p>
<p className="text-left">Left aligned text</p>
<p className="text-right">Right aligned text</p>
```

### Spacing (Margins)
```jsx
<div className="m-0">No margin</div>
<div className="m-1">Small margin (0.5rem)</div>
<div className="m-2">Medium margin (1rem)</div>
<div className="m-3">Large margin (1.5rem)</div>
```

### Spacing (Padding)
```jsx
<div className="p-0">No padding</div>
<div className="p-1">Small padding (0.5rem)</div>
<div className="p-2">Medium padding (1rem)</div>
<div className="p-3">Large padding (1.5rem)</div>
```

### Gap Utilities
```jsx
<div style={{display: 'flex'}} className="gap-1">
  {/* 0.5rem gap between children */}
</div>

<div style={{display: 'flex'}} className="gap-2">
  {/* 1rem gap between children */}
</div>
```

### Visibility
```jsx
<div className="hidden">Hidden element</div>
<div className="visible">Visible element</div>
```

### Grid
```jsx
<div className="grid-1-col">
  {/* 1 column on all sizes */}
</div>

<div className="grid-2-col">
  {/* 2 columns, responsive to 1 on mobile */}
</div>

<div className="grid-3-col">
  {/* 3 columns, responsive to 1 on mobile */}
</div>
```

---

## Common Patterns

### Header with Title and Action
```jsx
<div className="flex-between p-2">
  <h2>Employees</h2>
  <button className="btn btn-primary">
    <AddIcon />
    Add Employee
  </button>
</div>
```

### Search and Filter Section
```jsx
<div className="container-light p-2">
  <div className="grid-2-col gap-2">
    <input className="form-label" type="search" placeholder="Search..." />
    <select>
      <option>All Departments</option>
    </select>
  </div>
</div>
```

### Status Badge
```jsx
<span className={`btn btn-sm ${status === 'active' ? 'btn-success' : 'btn-danger'}`}>
  {status}
</span>
```

### Disabled Button
```jsx
<button className="btn btn-primary" disabled>
  Processing...
</button>
```

### Loading State
```jsx
<button className="btn btn-primary" disabled>
  <LoadingSpinner />
  Loading...
</button>
```

---

## Responsive Behavior

All typography classes use `clamp()` for automatic responsive sizing:

```css
/* Automatically scales between min and max */
font-size: clamp(0.85rem, 1.2vw, 1rem)

/* Mobile (small viewport) → 0.85rem */
/* Desktop (1000px viewport) → 1rem */
```

Mobile-specific breakpoint: **768px**

```jsx
// Hide on mobile
@media screen and (max-width: 786px) {
  .hide-in-mobile-table { display: none; }
}

// Show only on mobile
.view-in-mobile-only { display: none; }
@media screen and (max-width: 786px) {
  .view-in-mobile-only { display: block; }
}
```

---

## Color Reference

### Button Colors
- **Primary**: Black (#000000) → White on hover
- **Secondary**: Transparent → Black on hover
- **Success**: Green (#28a745)
- **Danger**: Red (#dc3545)
- **Warning**: Orange (#ffc107)
- **Info**: Blue (#007bff)

### Text Colors
- **Primary**: Dark gray (#1a1a1a)
- **Secondary**: Medium gray (#333333)
- **Tertiary**: Light gray (#666666)
- **Quaternary**: Very light gray (#888888)

### Alert Colors
- **Error**: Red (#dc3545)
- **Success**: Green (#28a745)
- **Warning**: Orange (#ffc107)
- **Info**: Blue (#007bff)

---

## Migration Tips

### Before (Old Way)
```jsx
<button style={{
  backgroundColor: 'black',
  color: 'white',
  padding: '10px 15px',
  border: '1px solid black',
  borderRadius: '5px',
  cursor: 'pointer'
}}>
  Save
</button>
```

### After (New Way)
```jsx
<button className="btn btn-primary">
  Save
</button>
```

---

## Performance Benefits

✅ Fewer CSS rules to parse
✅ Better caching (shared styles)
✅ Smaller CSS bundle
✅ Faster page load
✅ Easier to maintain
✅ Consistent appearance

---

**Pro Tips:**
- Always use semantic button classes instead of custom styles
- Use utility classes for quick layouts (margin, padding, gap)
- Combine classes for customization: `btn btn-primary btn-sm`
- Use `clamp()` for responsive typography
- Maintain color consistency using semantic names

---

**Questions?** Refer to `CSS_OPTIMIZATION_SUMMARY.md` for detailed documentation.
