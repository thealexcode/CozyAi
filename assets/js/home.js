document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.getElementById('get-started-btn');
    const ctaBtn = document.getElementById('cta-btn');
    
    // Both buttons navigate to auth page
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', navigateToAuth);
    }
    if (ctaBtn) {
        ctaBtn.addEventListener('click', navigateToAuth);
    }
    
    function navigateToAuth() {
        window.location.href = 'auth.html';
    }
    
    // Check auth state to show profile if logged in
    const auth = window.auth;
    auth.onAuthStateChanged(user => {
        const authButtons = document.getElementById('auth-buttons');
        const profileSection = document.getElementById('profile-section');
        
        if (user) {
            // User is logged in
            if (authButtons) authButtons.style.display = 'none';
            if (profileSection) profileSection.style.display = 'block';
            
            // Update profile info
            const firstLetter = user.email ? user.email.charAt(0).toUpperCase() : 'U';
            document.querySelector('.profile-img').textContent = firstLetter;
            document.getElementById('profile-name').textContent = user.displayName || user.email.split('@')[0];
            document.getElementById('profile-email').textContent = user.email;
        } else {
            // User is not logged in
            if (authButtons) authButtons.style.display = 'block';
            if (profileSection) profileSection.style.display = 'none';
        }
    });
});