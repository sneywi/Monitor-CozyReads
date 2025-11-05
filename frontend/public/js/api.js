// API Call wrapper

// Main API call function
async function apiCall(url, options = {}) {
    try {
        const token = getToken();
        
        // Set default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Add Authorization header if token exists
        if (token) {
            headers['Authorization'] = 'Bearer ${token}';
        }
        
        // Make the request
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Parse response
        const data = await response.json();
        
        // Handle errors
        if (!response.ok) {
            throw new Error(data.message || 'HTTP Error: ${response.status}');
        }
        
        return data;
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Handle authentication errors
        if (error.message.includes('token') || error.message.includes('unauthorized')) {
            showAlert('Session expired. Please login again.', 'error');
            setTimeout(() => {
                logout();
            }, 2000);
        }
        
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-${type}';
    alert.textContent = message;
    
    // Insert at top of container
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alert, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Show loading spinner
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-spinner';
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingDiv);
}

// Hide loading spinner
function hideLoading() {
    const loadingDiv = document.getElementById('loading-spinner');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Format currency
function formatCurrency(amount) {
    return '$${parseFloat(amount).toFixed(2)}';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get cart count from localStorage
function getCartCount() {
    const count = localStorage.getItem('cartCount') || 0;
    return parseInt(count);
}

// Update cart count in localStorage and UI
function updateCartCount(count) {
    localStorage.setItem('cartCount', count);
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'block' : 'none';
    }
}
