// At the top of auth.js
const auth = window.auth;
const provider = window.provider;

if (!auth) {
    console.error("Firebase auth not initialized");
    // You might want to redirect or show an error message
}

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');
    
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    
    // Error message elements
    const loginEmailError = document.getElementById('login-email-error');
    const loginPasswordError = document.getElementById('login-password-error');
    const signupEmailError = document.getElementById('signup-email-error');
    const signupPasswordError = document.getElementById('signup-password-error');
    const signupConfirmError = document.getElementById('signup-confirm-error');
    
    // Tab switching
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));
    showSignupBtn.addEventListener('click', () => switchTab('signup'));
    showLoginBtn.addEventListener('click', () => switchTab('login'));
    
    // Form submissions
    loginButton.addEventListener('click', loginUser);
    signupButton.addEventListener('click', signupUser);
    googleLoginBtn.addEventListener('click', loginWithGoogle);
    googleSignupBtn.addEventListener('click', loginWithGoogle);
    
    // Check auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            window.location.href = 'chatbot.html';
        }
    });
    
    function switchTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            clearAuthErrors();
        } else {
            loginTab.classList.remove('active');
            signupTab.classList.add('active');
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            clearAuthErrors();
        }
    }
    
    function clearAuthErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    function showError(element, message) {
        const errorElement = document.getElementById(`${element}-error`);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        document.getElementById(element).style.borderColor = 'var(--error)';
    }
    
    async function loginUser() {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        
        clearAuthErrors();
        
        if (!email) {
            showError('login-email', 'Email is required');
            return;
        }
        
        if (!password) {
            showError('login-password', 'Password is required');
            return;
        }
        
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            loginButton.disabled = false;
            loginButton.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    showError('login-email', 'Invalid email address');
                    break;
                case 'auth/user-disabled':
                    showError('login-email', 'Account disabled');
                    break;
                case 'auth/user-not-found':
                    showError('login-email', 'User not found');
                    break;
                case 'auth/wrong-password':
                    showError('login-password', 'Incorrect password');
                    break;
                default:
                    showError('login-email', 'Login failed. Please try again.');
                    console.error("Login error:", error);
            }
        }
    }
    
    async function signupUser() {
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();
        const confirmPassword = signupConfirmPassword.value.trim();
        
        clearAuthErrors();
        
        if (!email) {
            showError('signup-email', 'Email is required');
            return;
        }
        
        if (!password) {
            showError('signup-password', 'Password is required');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('signup-confirm', 'Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showError('signup-password', 'Password must be at least 6 characters');
            return;
        }
        
        signupButton.disabled = true;
        signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        
        try {
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            signupButton.disabled = false;
            signupButton.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    showError('signup-email', 'Email already in use');
                    break;
                case 'auth/invalid-email':
                    showError('signup-email', 'Invalid email address');
                    break;
                case 'auth/weak-password':
                    showError('signup-password', 'Password is too weak');
                    break;
                default:
                    showError('signup-email', 'Signup failed. Please try again.');
                    console.error("Signup error:", error);
            }
        }
    }
    
    async function loginWithGoogle() {
        const button = this;
        const originalHTML = button.innerHTML;
        
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Continuing with Google...';
        
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            button.disabled = false;
            button.innerHTML = originalHTML;
            console.error("Google login error:", error);
            
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.display = 'block';
            errorElement.textContent = 'Google login failed. Please try again.';
            button.parentNode.insertBefore(errorElement, button.nextSibling);
        }
    }
});