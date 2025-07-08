// Snake Game Logic
window.initGame = function() {
    // Elements
    const canvas = document.getElementById('snake-board');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const speedSlider = document.getElementById('speed-slider');
    const gameOverModal = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const newHighScoreElement = document.querySelector('.new-high-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // Mobile Controls
    const upBtn = document.getElementById('up-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const downBtn = document.getElementById('down-btn');
    
    // Game settings
    const gridSize = 20;
    const initialSpeed = parseInt(speedSlider.value);
    let speed = initialSpeed;
    
    // Game state
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = direction;
    let score = 0;
    let highScore = window.getHighScore('snake') || 0;
    let gameInterval;
    let isGameRunning = false;
    
    // Set high score display
    highScoreElement.textContent = highScore;
    
    // Initialize the game
    function initializeGame() {
        // Reset game state
        snake = [
            { x: 8, y: 10 },
            { x: 7, y: 10 },
            { x: 6, y: 10 }
        ];
        score = 0;
        direction = 'right';
        nextDirection = direction;
        
        // Create first food
        createFood();
        
        // Update score display
        scoreElement.textContent = score;
        
        // Clear previous game interval if exists
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        // Hide game over modal
        gameOverModal.style.display = 'none';
        
        // Set speed from slider
        speed = parseInt(speedSlider.value);
        
        // Draw initial state
        draw();
    }
    
    // Start the game
    function startGame() {
        if (!isGameRunning) {
            isGameRunning = true;
            gameInterval = setInterval(gameLoop, 1000 / (speed + 5)); // Adjust for better gameplay
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
        }
    }
    
    // Main game loop
    function gameLoop() {
        update();
        draw();
    }
    
    // Update game state
    function update() {
        // Set direction for next frame
        direction = nextDirection;
        
        // Get current head position
        const head = { ...snake[0] };
        
        // Move head based on direction
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for collision with walls
        if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            gameOver();
            return;
        }
        
        // Check for collision with self
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }
        
        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreElement.textContent = score;
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('success');
            }
            
            // Create new food
            createFood();
            
            // Don't remove tail for this update (snake grows)
        } else {
            // Remove tail segment
            snake.pop();
        }
        
        // Add new head segment
        snake.unshift(head);
    }
    
    // Draw game elements
    function draw() {
        // Clear canvas
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Head is slightly different color
            if (index === 0) {
                ctx.fillStyle = 'var(--primary-color)';
            } else {
                // Gradient for body segments
                const colorRatio = 1 - (index / snake.length * 0.6);
                ctx.fillStyle = `hsl(225, 80%, ${50 + (colorRatio * 20)}%)`;
            }
            
            // Draw rounded segment
            drawRoundedRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize, 
                gridSize, 
                gridSize / 4 // rounded corner radius
            );
        });
        
        // Draw food
        ctx.fillStyle = 'var(--secondary-color)';
        drawRoundedRect(
            food.x * gridSize, 
            food.y * gridSize, 
            gridSize, 
            gridSize, 
            gridSize / 2 // fully rounded food
        );
    }
    
    // Helper function to draw rounded rectangles
    function drawRoundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
    }
    
    // Create food at random position
    function createFood() {
        const possiblePositions = [];
        
        // Get all possible positions (excluding snake body)
        for (let x = 0; x < canvas.width / gridSize; x++) {
            for (let y = 0; y < canvas.height / gridSize; y++) {
                let isSnakeSegment = false;
                
                // Check if this position is part of the snake
                for (const segment of snake) {
                    if (segment.x === x && segment.y === y) {
                        isSnakeSegment = true;
                        break;
                    }
                }
                
                // If not a snake segment, add to possible positions
                if (!isSnakeSegment) {
                    possiblePositions.push({ x, y });
                }
            }
        }
        
        // Randomly select from available positions
        if (possiblePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * possiblePositions.length);
            food = possiblePositions[randomIndex];
        }
    }
    
    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        isGameRunning = false;
        
        // Check for high score
        finalScoreElement.textContent = score;
        
        let isNewHighScore = false;
        if (score > highScore) {
            isNewHighScore = window.saveHighScore('snake', score);
            highScore = score;
            highScoreElement.textContent = highScore;
        }
        
        // Show new high score message if applicable
        if (isNewHighScore) {
            newHighScoreElement.classList.remove('hidden');
            // Play success sound
            if (window.soundEffects) {
                window.soundEffects.play('success');
            }
        } else {
            newHighScoreElement.classList.add('hidden');
            // Play game over sound
            if (window.soundEffects) {
                window.soundEffects.play('gameOver');
            }
        }
        
        // Show game over modal
        gameOverModal.style.display = 'flex';
    }
    
    // Event listeners
    startBtn.addEventListener('click', () => {
        initializeGame();
        startGame();
    });
    
    restartBtn.addEventListener('click', () => {
        initializeGame();
        startGame();
    });
    
    playAgainBtn.addEventListener('click', () => {
        initializeGame();
        startGame();
    });
    
    speedSlider.addEventListener('change', () => {
        if (isGameRunning) {
            clearInterval(gameInterval);
            speed = parseInt(speedSlider.value);
            gameInterval = setInterval(gameLoop, 1000 / (speed + 5));
        } else {
            speed = parseInt(speedSlider.value);
        }
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ': // Space key to start/pause
                if (!isGameRunning) {
                    startGame();
                }
                break;
        }
    });
    
    // Mobile controls
    upBtn.addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    
    downBtn.addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    
    leftBtn.addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    
    rightBtn.addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });
    
    // Initialize game on load
    initializeGame();
}; 