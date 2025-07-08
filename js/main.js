// Main JavaScript for the game portal
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const playButtons = document.querySelectorAll('.play-btn');
    const gameModal = document.getElementById('game-modal');
    const gameContainer = document.getElementById('game-container');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggleBtn = document.querySelector('.menu-toggle');
    const sideNav = document.querySelector('.sidenav');
    const contentSections = document.querySelectorAll('.content-section');
    const gridToggles = document.querySelectorAll('.grid-toggle');
    const gamesGrid = document.querySelector('.games-grid');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');
    const mobileSoundBtn = document.getElementById('mobile-sound-btn');
    
    // Create sidenav overlay
    const sidenavOverlay = document.createElement('div');
    sidenavOverlay.className = 'sidenav-overlay';
    document.body.appendChild(sidenavOverlay);
    
    // High scores storage
    const highScores = JSON.parse(localStorage.getItem('gameZoneHighScores')) || {
        memory: 0,
        tictactoe: 0,
        snake: 0,
        quiz: 0,
        racing: 0
    };
    
    // Initialize high score displays
    function updateHighScoreDisplays() {
        // Update game cards
        document.getElementById('memory-highscore').textContent = highScores.memory;
        document.getElementById('tictactoe-highscore').textContent = highScores.tictactoe;
        document.getElementById('snake-highscore').textContent = highScores.snake;
        document.getElementById('quiz-highscore').textContent = highScores.quiz;
        document.getElementById('racing-highscore').textContent = highScores.racing || 0;
        
        // Update stats page
        document.getElementById('stats-memory').textContent = highScores.memory;
        document.getElementById('stats-tictactoe').textContent = highScores.tictactoe;
        document.getElementById('stats-snake').textContent = highScores.snake;
        document.getElementById('stats-quiz').textContent = highScores.quiz;
        document.getElementById('stats-racing').textContent = highScores.racing || 0;
    }
    
    // Call initially to update the displays
    updateHighScoreDisplays();
    
    // Save high score function (to be used by games)
    window.saveHighScore = function(game, score) {
        // Only save if score is higher than current high score
        if (score > highScores[game]) {
            highScores[game] = score;
            localStorage.setItem('gameZoneHighScores', JSON.stringify(highScores));
            updateHighScoreDisplays();
            return true; // Indicate a new high score
        }
        return false; // Not a new high score
    };
    
    // Get high score function (to be used by games)
    window.getHighScore = function(game) {
        return highScores[game] || 0;
    };
    
    // Function to load game content
    function loadGame(gameType) {
        // Clear previous game content
        gameContainer.innerHTML = '';
        
        // Set modal title based on game type
        const gameTitles = {
            memory: "Memory Match",
            tictactoe: "Tic Tac Toe",
            snake: "Snake Game",
            quiz: "Knowledge Quiz",
            racing: "Cyber Racing"
        };
        
        modalTitle.textContent = gameTitles[gameType] || "Game";
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        gameContainer.appendChild(loadingDiv);
        
        // Play sound effect
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
        
        // Load game based on type
        fetch(`games/${gameType}/index.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Game not found');
                }
                return response.text();
            })
            .then(html => {
                // Insert game HTML
                gameContainer.innerHTML = html;
                
                // Load and execute game script
                const script = document.createElement('script');
                script.src = `games/${gameType}/game.js`;
                document.body.appendChild(script);
                
                // Load game styles
                const linkElem = document.createElement('link');
                linkElem.rel = 'stylesheet';
                linkElem.href = `games/${gameType}/style.css`;
                document.head.appendChild(linkElem);
                
                // Initialize game if it has an init function
                script.onload = function() {
                    if (typeof window.initGame === 'function') {
                        window.initGame();
                    }
                };
            })
            .catch(error => {
                console.error('Error loading game:', error);
                gameContainer.innerHTML = `
                    <div class="error-message">
                        <h2>Oops! Something went wrong</h2>
                        <p>Could not load the game. Please try again later.</p>
                    </div>
                `;
            });
    }
    
    // Function to switch between sections
    function switchSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        document.getElementById(`${sectionId}-section`).classList.add('active');
        
        // Update nav items
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
        
        // Close the sidenav on mobile
        if (window.innerWidth <= 992) {
            sideNav.classList.remove('active');
            sidenavOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Toggle grid view (grid/list)
    function toggleGridView(view) {
        gridToggles.forEach(toggle => {
            toggle.classList.remove('active');
            if (toggle.getAttribute('data-view') === view) {
                toggle.classList.add('active');
            }
        });
        
        if (view === 'list') {
            gamesGrid.classList.add('list-view');
        } else {
            gamesGrid.classList.remove('list-view');
        }
    }
    
    // Event listeners for play buttons
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameCard = this.closest('.game-card');
            const gameType = gameCard.getAttribute('data-game');
            
            // Show modal
            gameModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Load game
            loadGame(gameType);
        });
    });
    
    // Navigation event listeners
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
            
            // Sound effect
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
        });
    });
    
    // Mobile menu toggle
    menuToggleBtn.addEventListener('click', function() {
        sideNav.classList.toggle('active');
        sidenavOverlay.classList.toggle('active');
        
        if (sideNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        // Sound effect
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    // Sidenav overlay click
    sidenavOverlay.addEventListener('click', function() {
        sideNav.classList.remove('active');
        sidenavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Grid view toggles
    gridToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            toggleGridView(view);
            
            // Sound effect
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
        });
    });
    
    // Mobile theme toggle
    mobileThemeBtn.addEventListener('click', function() {
        // Use the same logic as in theme.js
        if (typeof toggleTheme === 'function') {
            toggleTheme();
        }
    });
    
    // Mobile sound toggle
    mobileSoundBtn.addEventListener('click', function() {
        // Use the same logic as in sound.js
        if (typeof toggleSound === 'function') {
            toggleSound();
        }
    });
    
    // Close modal functionality
    closeModalBtn.addEventListener('click', function() {
        gameModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        gameContainer.innerHTML = ''; // Clear game to free resources
        
        // Play sound effect
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    // Close modal on clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === gameModal) {
            gameModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            gameContainer.innerHTML = '';
            
            // Play sound effect
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes the modal
        if (e.key === 'Escape' && gameModal.style.display === 'block') {
            gameModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            gameContainer.innerHTML = '';
        }
        
        // Escape key closes the mobile sidenav
        if (e.key === 'Escape' && sideNav.classList.contains('active')) {
            sideNav.classList.remove('active');
            sidenavOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Page transitions
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 500);
    
    // Initialize with games section
    switchSection('games');
}); 