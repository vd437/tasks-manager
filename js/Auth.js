// Authentication functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and redirect if needed
    checkAuth();

    // Tab switching for login/signup
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            StorageHelper.clearCurrentUser();
            window.location.href = 'index.html';
        });
    }
});

function checkAuth() {
    const currentUser = StorageHelper.getCurrentUser();
    const isAuthPage = window.location.pathname.includes('index.html');
    
    if (currentUser && isAuthPage) {
        window.location.href = 'dashboard.html';
    } else if (!currentUser && !isAuthPage) {
        window.location.href = 'index.html';
    }
}

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activate selected tab
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    const user = StorageHelper.getUserByEmail(email);
    
    if (!user) {
        showError(errorElement, 'User not found. Please sign up.');
        return;
    }

    if (user.password !== password) {
        showError(errorElement, 'Incorrect password. Please try again.');
        return;
    }

    // Login successful
    StorageHelper.setCurrentUser(email);
    window.location.href = 'dashboard.html';
}

function handleSignup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('signupError');

    // Validation
    if (password !== confirmPassword) {
        showError(errorElement, 'Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        showError(errorElement, 'Password must be at least 6 characters.');
        return;
    }

    // Check if user already exists
    const existingUser = StorageHelper.getUserByEmail(email);
    if (existingUser) {
        showError(errorElement, 'Email already registered. Please login.');
        return;
    }

    // Create new user
    const newUser = {
        email,
        password,
        createdAt: new Date().toISOString()
    };

    StorageHelper.addUser(newUser);
    StorageHelper.setCurrentUser(email);
    window.location.href = 'dashboard.html';
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}
