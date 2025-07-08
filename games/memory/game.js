// Memory Match Game Logic
window.initGame = function() {
    // Elements
    const cardsContainer = document.getElementById('memory-cards');
    const movesCount = document.getElementById('moves-count');
    const timeValue = document.getElementById('time');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const gameResult = document.getElementById('game-result');
    const finalMoves = document.getElementById('final-moves');
    const finalTime = document.getElementById('final-time');
    const highScoreElement = document.getElementById('high-score');
    const newHighScoreElement = document.querySelector('.new-high-score');
    const playAgainButton = document.getElementById('play-again-btn');
    
    // Game variables
    let cards;
    let interval;
    let firstCard = false;
    let secondCard = false;
    
    // Game state
    let moves = 0;
    let seconds = 0;
    let minutes = 0;
    let matchedCards = 0;
    let gameStarted = false;
    
    // Card data - emoji pairs
    const items = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
        '🦁', '🐯', '🐨', '🐮', '🐷', '🐸', '🐵', '🦄'
    ];
    
    // Display high score from localStorage
    const highScore = window.getHighScore('memory') || 0;
    highScoreElement.innerText = highScore;
    
    // Functions
    function generateCards(count = 16) {
        // Get a subset of items if count is less than number of items
        const selectedItems = items.slice(0, count / 2);
        
        // Create card pairs and shuffle them
        let cardValues = [...selectedItems, ...selectedItems];
        cardValues = shuffleArray(cardValues);
        
        // Create card elements
        cardsContainer.innerHTML = '';
        cardValues.forEach((item) => {
            cardsContainer.innerHTML += `
                <div class="memory-card" data-card-value="${item}">
                    <div class="card-front card-face">${item}</div>
                    <div class="card-back card-face">?</div>
                </div>
            `;
        });
        
        // Reference to cards
        cards = document.querySelectorAll('.memory-card');
    }
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Start timer
    function startTimer() {
        seconds = 0;
        minutes = 0;
        interval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            
            // Update time display
            timeValue.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    // Initialize game
    function initializeGame() {
        gameStarted = false;
        matchedCards = 0;
        moves = 0;
        seconds = 0;
        minutes = 0;
        
        // Reset UI
        movesCount.innerText = moves;
        timeValue.innerText = '00:00';
        
        // Clear previous timer
        clearInterval(interval);
        
        // Generate cards
        generateCards();
        
        // Hide game result
        gameResult.style.display = 'none';
    }
    
    // Handle card click
    function flipCard(card) {
        // Start timer on first card click
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }
        
        // Only allow two cards to be flipped at a time
        if (firstCard !== false && secondCard !== false) {
            return;
        }
        
        // Add flipped class
        card.classList.add('flipped');
        
        // Sound effect
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
        
        // Assign first or second card
        if (firstCard === false) {
            firstCard = card;
        } else if (firstCard !== card) {
            secondCard = card;
            
            // Increment moves
            moves++;
            movesCount.innerText = moves;
            
            // Check for match
            checkForMatch();
        }
    }
    
    // Check if cards match
    function checkForMatch() {
        // Get card values
        const firstCardValue = firstCard.getAttribute('data-card-value');
        const secondCardValue = secondCard.getAttribute('data-card-value');
        
        // If match
        if (firstCardValue === secondCardValue) {
            // Sound effect
            if (window.soundEffects) {
                window.soundEffects.play('success');
            }
            
            // Add matched class
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            // Reset selected cards
            firstCard = false;
            secondCard = false;
            
            // Increment matched count
            matchedCards += 2;
            
            // Check for win
            if (matchedCards === cards.length) {
                setTimeout(() => {
                    gameOver();
                }, 1000);
            }
        } else {
            // Not a match, flip cards back after delay
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                
                // Reset selected cards
                firstCard = false;
                secondCard = false;
            }, 900);
        }
    }
    
    // Game over function
    function gameOver() {
        // Stop timer
        clearInterval(interval);
        
        // Update final stats
        finalMoves.innerText = moves;
        finalTime.innerText = timeValue.innerText;
        
        // Check for high score (lower moves is better)
        let isNewHighScore = false;
        if (highScore === 0 || moves < highScore) {
            isNewHighScore = window.saveHighScore('memory', moves);
            highScoreElement.innerText = moves;
        }
        
        // Show new high score message if applicable
        if (isNewHighScore) {
            newHighScoreElement.classList.remove('hidden');
            // Sound effect
            if (window.soundEffects) {
                window.soundEffects.play('success');
            }
        } else {
            newHighScoreElement.classList.add('hidden');
            // Sound effect
            if (window.soundEffects) {
                window.soundEffects.play('gameOver');
            }
        }
        
        // Show result modal
        gameResult.style.display = 'flex';
    }
    
    // Event Listeners
    startButton.addEventListener('click', () => {
        initializeGame();
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    restartButton.addEventListener('click', () => {
        initializeGame();
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    playAgainButton.addEventListener('click', () => {
        initializeGame();
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    // Add event listeners to cards
    cardsContainer.addEventListener('click', (e) => {
        const clicked = e.target.closest('.memory-card');
        if (clicked && !clicked.classList.contains('flipped') && !clicked.classList.contains('matched')) {
            flipCard(clicked);
        }
    });
    
    // Initialize the game
    initializeGame();
}; 