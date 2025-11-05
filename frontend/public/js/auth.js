// Authentication utilities -> JWT token management and user helpers

// Save authentication token
function saveToken(token) {
    if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved successfully');
    }
}

// Get authentication token
function getToken() {
    return localStorage.getItem('token');
}

// Check if user is logged in
function isLoggedIn() {
    return !!getToken();
}

// Decode JWT token to get user info
function decodeToken(token) {
    try {
        if (!token || typeof token !== 'string') {
            console.warn('Invalid token provided to decodeToken');
            return null;
        }
        
        const parts = token.split('.');
        
        // Check if token has 3 parts (header.payload.signature)
        if (parts.length !== 3) {
            console.warn('Token does not have 3 parts:', parts.length);
            return null;
        }
        
        const base64Url = parts[1];
        
        // Check if base64Url exists
        if (!base64Url) {
            console.warn('Token payload is empty');
            return null;
        }
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        
        const decoded = JSON.parse(jsonPayload);
        console.log('Token decoded successfully:', decoded);
        return decoded;
        
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Get user ID from token
function getUserId() {
    const token = getToken();
    if (!token) {
        console.warn('No token found in getUserId');
        return null;
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
        console.warn('Could not decode token in getUserId');
        return null;
    }
    
    // Try multiple possible property names
    const userId = decoded.userId || decoded.id || decoded.user_id || decoded.sub;
    console.log('User ID extracted:', userId);
    return userId;
}

// Get user info from token
function getUserInfo() {
    const token = getToken();
    if (!token) {
        console.warn('No token found in getUserInfo');
        return null;
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
        console.warn('Could not decode token in getUserInfo');
        return null;
    }
    
    // Return user info with multiple possible property names
    return {
        userId: decoded.userId || decoded.id || decoded.user_id || decoded.sub,
        email: decoded.email,
        name: decoded.name
    };
}

// Logout user
function logout() {
    localStorage.clear();
    console.log('User logged out');
    window.location.href = 'login.html';
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        console.warn('Authentication required - redirecting to login');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Update navigation based on auth state
function updateNavigation() {
    const authButton = document.getElementById('auth-button');
    
    if (!authButton) return;
    
    const token = getToken();
    const user = getUserInfo();
    
    if (token && user) {
        // User is logged in - show welcome message and logout button
        authButton.innerHTML = '
            <div class="user-info">
                <span class="user-welcome">Hello,</span>
                <span class="user-name">${user.name || user.email}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="logout()">
                Logout
            </button>
        ';
    } else {
        // User is not logged in - show login button
        authButton.innerHTML = '
            <a href="login.html" class="btn btn-primary btn-sm">Login</a>
        ';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth initialized, logged in:', isLoggedIn());
    updateNavigation();
});
