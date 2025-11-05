// User auth: Login/signup page (login.html)

let currentTab = 'login';

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    setupAuthTabs();
    setupLoginForm();
    setupSignupForm();
    updateTabIndicator();
});

// Setup auth tabs (login/signup toggle)
function setupAuthTabs() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    
    if (loginTab) {
        loginTab.addEventListener('click', () => {
            currentTab = 'login';
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginFormContainer.classList.remove('hidden');
            signupFormContainer.classList.add('hidden');
            updateTabIndicator();
        });
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', () => {
            currentTab = 'signup';
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupFormContainer.classList.remove('hidden');
            loginFormContainer.classList.add('hidden');
            updateTabIndicator();
        });
    }
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle login submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validate
    if (!email || !password) {
        showAlert('Please enter email and password', 'error');
        return;
    }
    
    try {
        showLoading();
        
        const response = await apiCall(`${API_CONFIG.USER_SERVICE}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        console.log('Login response:', response);
        
        // Extract token from correct path
        const token = response.data?.token || response.token;
        
        if (!token) {
            throw new Error('No token received from server');
        }
        
        console.log('Token received:', token.substring(0, 50) + '...');
        
        // Save token
        saveToken(token);
        
        // Save user info if available
        const user = response.data?.user || response.user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        hideLoading();
        showAlert('Login successful!', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        hideLoading();
        showAlert(error.message || 'Invalid email or password', 'error');
        console.error('Login error:', error);
    }
}

// Setup signup form
function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Handle signup submission
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validate
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        showLoading();
        
        const response = await apiCall(`${API_CONFIG.USER_SERVICE}/register`, {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        
        console.log('Signup response:', response);
        
        // Extract token from correct path
        const token = response.data?.token || response.token;
        
        if (!token) {
            throw new Error('No token received from server');
        }
        
        console.log('Token received:', token.substring(0, 50) + '...');
        
        // Save token
        saveToken(token);
        
        // Save user info if available
        const user = response.data?.user || response.user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        hideLoading();
        showAlert('Account created successfully!', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        hideLoading();
        showAlert(error.message || 'Failed to create account. Please try again.', 'error');
        console.error('Signup error:', error);
    }
}

// Helper functions
function showLoading() {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

function updateTabIndicator() {
    const activeTab = document.querySelector('.auth-tab.active');
    const indicator = document.getElementById('tab-indicator');
    
    if (activeTab && indicator) {
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement.getBoundingClientRect();
        
        indicator.style.left = (rect.left - parentRect.left) + 'px';
        indicator.style.width = rect.width + 'px';
    }
}
