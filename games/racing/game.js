// Cyber Racing Game
window.initGame = function() {
    // Game elements
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const finalScoreDisplay = document.getElementById('final-score');
    const newRecordDisplay = document.querySelector('.new-record');
    
    // Game settings
    const GAME_WIDTH = canvas.width = 600;
    const GAME_HEIGHT = canvas.height = 600;
    const LANE_COUNT = 3;
    const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;
    const ROAD_SPEED = 5;
    const OBSTACLE_SPEED = 5;
    const OBSTACLE_SPAWN_RATE = 0.02; // Chance of spawn per frame (reduced for less frequent obstacles)
    const OBSTACLE_WIDTH = 80;
    const OBSTACLE_HEIGHT = 15;
    
    // Game state
    let isGameRunning = false;
    let score = 0;
    let highScore = window.getHighScore('racing') || 0;
    let animationFrameId = null;
    let roadOffset = 0;
    
    // Player car
    const playerCar = {
        x: GAME_WIDTH / 2 - 50 / 2,
        y: GAME_HEIGHT - 100 - 20,
        width: 50,
        height: 100,
        lane: 1, // 0: left, 1: center, 2: right
        speed: 8,
        color: '#0ff'
    };
    
    // Obstacles array
    let obstacles = [];
    
    // Controls
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        KeyA: false,
        KeyD: false
    };
    
    // Init high score display
    highScoreDisplay.textContent = highScore;
    
    // Resize canvas on window resize
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Maintain aspect ratio
        const aspectRatio = GAME_WIDTH / GAME_HEIGHT;
        let newWidth = containerWidth;
        let newHeight = containerWidth / aspectRatio;
        
        if (newHeight > containerHeight) {
            newHeight = containerHeight;
            newWidth = containerHeight * aspectRatio;
        }
        
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }
    
    // Initialize game
    function initGame() {
        obstacles = [];
        score = 0;
        scoreDisplay.textContent = score;
        playerCar.lane = 1;
        updatePlayerCarPosition();
        resizeCanvas();
    }
    
    // Start game
    function startGame() {
        if (isGameRunning) return;
        
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        isGameRunning = true;
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
        
        // Start game loop
        gameLoop();
    }
    
    // End game
    function endGame() {
        isGameRunning = false;
        cancelAnimationFrame(animationFrameId);
        
        // Set final score
        finalScoreDisplay.textContent = score;
        
        // Check if high score
        if (score > highScore) {
            const isNewHighScore = window.saveHighScore('racing', score);
            highScore = score;
            highScoreDisplay.textContent = highScore;
            
            if (isNewHighScore) {
                newRecordDisplay.classList.remove('hidden');
                // Play success sound
                if (window.soundEffects) {
                    window.soundEffects.play('success');
                }
            } else {
                newRecordDisplay.classList.add('hidden');
            }
        } else {
            newRecordDisplay.classList.add('hidden');
            // Play game over sound
            if (window.soundEffects) {
                window.soundEffects.play('gameOver');
            }
        }
        
        // Show game over screen
        gameOverScreen.classList.remove('hidden');
    }
    
    // Update player car position based on current lane
    function updatePlayerCarPosition() {
        playerCar.x = playerCar.lane * LANE_WIDTH + (LANE_WIDTH - playerCar.width) / 2;
    }
    
    // Handle player movement
    function handlePlayerMovement() {
        if ((keys.ArrowLeft || keys.KeyA) && playerCar.lane > 0) {
            playerCar.lane--;
            updatePlayerCarPosition();
            // Reset keys to prevent continuous movement
            keys.ArrowLeft = false;
            keys.KeyA = false;
        }
        if ((keys.ArrowRight || keys.KeyD) && playerCar.lane < LANE_COUNT - 1) {
            playerCar.lane++;
            updatePlayerCarPosition();
            // Reset keys to prevent continuous movement
            keys.ArrowRight = false;
            keys.KeyD = false;
        }
    }
    
    // Create a new obstacle
    function spawnObstacle() {
        if (Math.random() < OBSTACLE_SPAWN_RATE) {
            const lane = Math.floor(Math.random() * LANE_COUNT);
            
            obstacles.push({
                x: lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2,
                y: -OBSTACLE_HEIGHT,
                width: OBSTACLE_WIDTH,
                height: OBSTACLE_HEIGHT,
                speed: OBSTACLE_SPEED + Math.random() * 2,
                color: getRandomNeonColor()
            });
        }
    }
    
    // Update obstacles
    function updateObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].y += obstacles[i].speed;
            
            // Remove obstacles that are off-screen
            if (obstacles[i].y > GAME_HEIGHT) {
                obstacles.splice(i, 1);
                score++;
                scoreDisplay.textContent = score;
            }
        }
    }
    
    // Check collisions
    function checkCollisions() {
        for (let i = 0; i < obstacles.length; i++) {
            if (isColliding(playerCar, obstacles[i])) {
                endGame();
                return;
            }
        }
    }
    
    // Check if two rectangles are colliding
    function isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Draw the road
    function drawRoad() {
        ctx.fillStyle = '#0a0a18';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Road surface
        ctx.fillStyle = '#111122';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Road lanes
        const lineWidth = 5;
        const dashLength = 30;
        const gapLength = 20;
        
        for (let i = 1; i < LANE_COUNT; i++) {
            const x = i * LANE_WIDTH;
            
            // Draw dashed line
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            
            for (let y = (roadOffset % (dashLength + gapLength)) - dashLength - gapLength; 
                 y < GAME_HEIGHT; 
                 y += dashLength + gapLength) {
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + dashLength);
            }
            
            ctx.stroke();
        }
        
        // Road edges
        ctx.strokeStyle = '#fe53bb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, GAME_HEIGHT);
        ctx.moveTo(GAME_WIDTH, 0);
        ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
        ctx.stroke();
        
        // Update road movement
        roadOffset += ROAD_SPEED;
    }
    
    // Draw player car
    function drawPlayerCar() {
        // Car body
        ctx.fillStyle = playerCar.color;
        ctx.fillRect(playerCar.x, playerCar.y, playerCar.width, playerCar.height);
        
        // Car details
        ctx.fillStyle = '#080820';
        ctx.fillRect(playerCar.x + 5, playerCar.y + 10, playerCar.width - 10, playerCar.height - 40);
        
        // Car windows
        ctx.fillStyle = '#89f7fe';
        ctx.fillRect(playerCar.x + 8, playerCar.y + 15, playerCar.width - 16, playerCar.height - 60);
        
        // Glow effect
        ctx.shadowColor = playerCar.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = playerCar.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(playerCar.x, playerCar.y, playerCar.width, playerCar.height);
        ctx.shadowBlur = 0;
    }
    
    // Draw obstacles
    function drawObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            
            // Neon barrier
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Add sparkle effect
            ctx.fillStyle = "#fff";
            const sparkleSize = 2;
            const sparkleCount = 3;
            for (let s = 0; s < sparkleCount; s++) {
                const sparkleX = obstacle.x + Math.random() * obstacle.width;
                const sparkleY = obstacle.y + Math.random() * obstacle.height;
                ctx.fillRect(sparkleX, sparkleY, sparkleSize, sparkleSize);
            }
            
            // Glow effect
            ctx.shadowColor = obstacle.color;
            ctx.shadowBlur = 10;
            ctx.strokeStyle = obstacle.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            ctx.shadowBlur = 0;
        }
    }
    
    // Random neon color generator
    function getRandomNeonColor() {
        const neonColors = [
            '#fe53bb', // pink
            '#09fbd3', // teal
            '#f5d300', // yellow
            '#7122fa', // purple
            '#ff073a'  // red
        ];
        return neonColors[Math.floor(Math.random() * neonColors.length)];
    }
    
    // Game loop
    function gameLoop() {
        if (!isGameRunning) return;
        
        // Handle player movement
        handlePlayerMovement();
        
        // Spawn obstacles
        spawnObstacle();
        
        // Update obstacles
        updateObstacles();
        
        // Check collisions
        checkCollisions();
        
        // Draw everything
        drawRoad();
        drawPlayerCar();
        drawObstacles();
        
        // Continue loop
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    
    // Key controls
    window.addEventListener('keydown', function(e) {
        if (e.key in keys) {
            keys[e.key] = true;
            
            // Prevent scrolling with arrow keys
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
            }
        } else if (e.code in keys) {
            keys[e.code] = true;
        }
    });
    
    window.addEventListener('keyup', function(e) {
        if (e.key in keys) {
            keys[e.key] = false;
        } else if (e.code in keys) {
            keys[e.code] = false;
        }
    });
    
    // Button click events
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', function() {
        initGame();
        startGame();
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    
    canvas.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartX;
        
        if (diffX > 50 && playerCar.lane < LANE_COUNT - 1) {
            // Swipe right
            keys.ArrowRight = true;
        } else if (diffX < -50 && playerCar.lane > 0) {
            // Swipe left
            keys.ArrowLeft = true;
        }
        
        e.preventDefault();
    }, { passive: false });
    
    // Initialize game
    initGame();
};
