document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.getElementById('get-started-btn');
    const ctaBtn = document.getElementById('cta-btn');
    
    // Both buttons navigate to auth page
    getStartedBtn.addEventListener('click', navigateToAuth);
    ctaBtn.addEventListener('click', navigateToAuth);
    
    function navigateToAuth() {
        window.location.href = 'auth.html';
    }
});