/* ============================================
   UI.JS - INTERACTIVE FEATURES
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
  setupSidebarToggle();
  setupSettingsPanel();
  setupTableSearch();
});

/* ============================================
   NAVIGATION BETWEEN PAGES
   ============================================ */

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const pageTitle = document.getElementById('pageTitle');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get page name
      const pageName = item.getAttribute('data-page');
      
      // Update active state in nav
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Hide all pages
      pages.forEach(page => page.style.display = 'none');
      
      // Show selected page
      const selectedPage = document.getElementById(pageName);
      if (selectedPage) {
        selectedPage.style.display = 'block';
        
        // Update page title
        const titles = {
          'dashboard': 'Dashboard',
          'employees': 'Employees',
          'payroll': 'Payroll',
          'attendance': 'Attendance',
          'salary': 'Salary Structure',
          'reports': 'Reports',
          'settings': 'Settings'
        };
        
        pageTitle.textContent = titles[pageName] || 'Dashboard';
      }
      
      // Close mobile sidebar after selection
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
      }
    });
  });
}

/* ============================================
   SIDEBAR TOGGLE
   ============================================ */

function setupSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && 
          !mobileToggle?.contains(e.target) && 
          sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    }
  });
}

/* ============================================
   SETTINGS PANEL
   ============================================ */

function setupSettingsPanel() {
  const settingsItems = document.querySelectorAll('.settings-item');
  const settingsSections = document.querySelectorAll('.settings-section');
  
  settingsItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      
      // Remove active from all items and sections
      settingsItems.forEach(i => i.classList.remove('active'));
      settingsSections.forEach(s => s.classList.remove('active'));
      
      // Add active to clicked item and corresponding section
      item.classList.add('active');
      const selectedSection = document.getElementById(section);
      if (selectedSection) {
        selectedSection.classList.add('active');
      }
    });
  });
}

/* ============================================
   TABLE SEARCH & FILTER
   ============================================ */

function setupTableSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  searchInputs.forEach(input => {
    input.addEventListener('keyup', function() {
      const searchTerm = this.value.toLowerCase();
      const table = this.closest('.card').querySelector('table');
      
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.innerText.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      }
    });
  });
}

/* ============================================
   FORM BUTTON INTERACTIONS
   ============================================ */

document.addEventListener('click', function(e) {
  // Save Changes buttons
  if (e.target.textContent.includes('Save Changes') && e.target.classList.contains('btn')) {
    e.preventDefault();
    showNotification('Changes saved successfully!', 'success');
  }
  
  // Process/Submit buttons
  if (e.target.textContent.includes('Process') || 
      e.target.textContent.includes('Submit')) {
    e.preventDefault();
    showNotification('Action processed successfully!', 'success');
  }
  
  // Delete/Remove buttons
  if (e.target.textContent.includes('Delete') || 
      e.target.textContent.includes('Remove')) {
    e.preventDefault();
    if (confirm('Are you sure?')) {
      showNotification('Deleted successfully!', 'success');
    }
  }
});

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideIn 300ms ease-out;
    font-weight: 500;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 300ms ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/* ============================================
   ANIMATIONS
   ============================================ */

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

/* ============================================
   SIDEBAR TOGGLE BUTTON ANIMATION
   ============================================ */

document.addEventListener('click', function(e) {
  if (e.target.closest('.sidebar-toggle') || e.target.closest('.navbar-toggle')) {
    const btn = e.target.closest('.sidebar-toggle') || e.target.closest('.navbar-toggle');
    if (btn) {
      const spans = btn.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    }
  }
});

/* ============================================
   RESPONSIVE SIDEBAR CLOSE ON WINDOW RESIZE
   ============================================ */

window.addEventListener('resize', function() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth > 768) {
    sidebar.classList.remove('active');
  }
});

/* ============================================
   TABLE EXPORT FUNCTIONALITY
   ============================================ */

document.addEventListener('click', function(e) {
  if (e.target.textContent.includes('Export')) {
    e.preventDefault();
    exportTableToCSV();
  }
});

function exportTableToCSV() {
  const table = document.querySelector('.modern-table');
  if (!table) return;
  
  let csv = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    const rowData = Array.from(cells).map(cell => {
      let text = cell.innerText.trim();
      // Escape quotes and wrap in quotes if contains comma
      text = text.replace(/"/g, '""');
      return text.includes(',') ? `"${text}"` : text;
    });
    csv.push(rowData.join(','));
  });
  
  // Create download link
  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payroll_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  showNotification('Table exported to CSV!', 'success');
}

/* ============================================
   FORM VALIDATION
   ============================================ */

document.addEventListener('submit', function(e) {
  const form = e.target;
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  });
  
  if (!isValid) {
    e.preventDefault();
    showNotification('Please fill in all required fields', 'error');
  }
});

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) searchBar.focus();
  }
  
  // Escape to close sidebar on mobile
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('active');
    }
  }
});

/* ============================================
   LOADING STATES
   ============================================ */

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn') && !e.target.classList.contains('btn-icon')) {
    const btn = e.target;
    const originalText = btn.innerHTML;
    
    // Add loading state
    btn.disabled = true;
    btn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⟳</span> Processing...';
    
    // Simulate processing
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }, 1500);
  }
});

// Add spin animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinStyle);
