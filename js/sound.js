// Sound Effects Controller
document.addEventListener('DOMContentLoaded', function() {
    const soundBtn = document.getElementById('sound-btn');
    const mobileSoundBtn = document.getElementById('mobile-sound-btn');
    
    // Create sound effects object
    window.soundEffects = {
        soundEnabled: localStorage.getItem('soundEnabled') !== 'false', // Default to true
        sounds: {
            // Using CDN-hosted sound effects
            click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-light-button-2580.mp3'),
            success: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3'),
            error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-click-error-1110.mp3'),
            gameOver: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3')
        },
        
        // Play sound method
        play: function(soundName) {
            if (this.soundEnabled && this.sounds[soundName]) {
                // Stop and reset the sound first (for rapid clicks)
                this.sounds[soundName].pause();
                this.sounds[soundName].currentTime = 0;
                
                // Play the sound
                this.sounds[soundName].play().catch(error => {
                    console.warn('Sound play failed:', error);
                });
            }
        },
        
        // Toggle sound method
        toggleSound: function() {
            this.soundEnabled = !this.soundEnabled;
            localStorage.setItem('soundEnabled', this.soundEnabled);
            
            // Update body attribute for showing correct icon
            document.body.setAttribute('data-sound', this.soundEnabled ? 'on' : 'off');
            
            // Play test sound when enabling
            if (this.soundEnabled) {
                this.play('click');
            }
        }
    };
    
    // Set initial sound state in DOM
    document.body.setAttribute('data-sound', window.soundEffects.soundEnabled ? 'on' : 'off');
    
    // Add event listeners for sound toggle buttons
    soundBtn.addEventListener('click', function() {
        window.soundEffects.toggleSound();
    });
    
    if (mobileSoundBtn) {
        mobileSoundBtn.addEventListener('click', function() {
            window.soundEffects.toggleSound();
        });
    }
}); 