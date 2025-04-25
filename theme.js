// Theme toggling functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeBtn = document.getElementById('theme-btn');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');
    
    // Check for saved theme preference or use dark by default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Toggle theme function - make it globally accessible for main.js
    window.toggleTheme = function() {
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        
        // Toggle theme
        if (document.body.getAttribute('data-theme') === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
        
        // Play sound effect if available
        if (window.soundEffects && window.soundEffects.soundEnabled) {
            window.soundEffects.play('click');
        }
    };
    
    // Event listener for theme toggle buttons
    themeBtn.addEventListener('click', window.toggleTheme);
    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', window.toggleTheme);
    }
}); 