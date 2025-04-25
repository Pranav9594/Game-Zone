// Tic Tac Toe Game Logic
window.initGame = function() {
    // Elements
    const cells = document.querySelectorAll('.cell');
    const playerX = document.getElementById('player-x');
    const playerO = document.getElementById('player-o');
    const playerOName = document.getElementById('player-o-name');
    const highScoreElement = document.getElementById('high-score');
    const vsPlayerBtn = document.getElementById('vs-player-btn');
    const vsAIBtn = document.getElementById('vs-ai-btn');
    const restartBtn = document.getElementById('restart-btn');
    const gameResult = document.getElementById('game-result');
    const resultText = document.getElementById('result-text');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // Game variables
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let againstAI = false;
    let winCount = window.getHighScore('tictactoe') || 0;
    
    // Winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Display high score
    highScoreElement.innerText = winCount;
    
    // Initialize game
    function initializeGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        
        // Clear board
        cells.forEach(cell => {
            cell.textContent = '';
            cell.removeAttribute('data-value');
            cell.classList.remove('winning');
        });
        
        // Update player indicators
        updatePlayerTurn();
        
        // Hide result
        gameResult.style.display = 'none';
    }
    
    // Update player turn indicators
    function updatePlayerTurn() {
        if (currentPlayer === 'X') {
            playerX.classList.add('active');
            playerO.classList.remove('active');
        } else {
            playerX.classList.remove('active');
            playerO.classList.add('active');
        }
    }
    
    // Handle cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        // Check if cell already played or game inactive
        if (board[clickedCellIndex] !== '' || !gameActive) return;
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
        
        // Update the board
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.setAttribute('data-value', currentPlayer);
        
        // Check for win or draw
        checkResult();
        
        // Switch player if game still active
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updatePlayerTurn();
            
            // AI turn
            if (againstAI && currentPlayer === 'O' && gameActive) {
                setTimeout(() => {
                    aiMove();
                }, 500);
            }
        }
    }
    
    // AI move
    function aiMove() {
        // Find best move
        const bestMove = findBestMove();
        
        // Play the move
        if (bestMove !== -1) {
            board[bestMove] = 'O';
            cells[bestMove].textContent = 'O';
            cells[bestMove].setAttribute('data-value', 'O');
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
            
            // Check for win or draw
            checkResult();
            
            // Switch back to player if game still active
            if (gameActive) {
                currentPlayer = 'X';
                updatePlayerTurn();
            }
        }
    }
    
    // Find best move for AI
    function findBestMove() {
        // Try to win
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            // Check if AI can win
            if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
            if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
            if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
        }
        
        // Block player from winning
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            // Check if player can win
            if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
            if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
            if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
        }
        
        // Take center if available
        if (board[4] === '') return 4;
        
        // Take a corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available spot
        const availableMoves = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        
        return -1; // No moves available
    }
    
    // Check for win or draw
    function checkResult() {
        let gameWon = false;
        
        // Check for win
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameWon = true;
                highlightWinningCells(a, b, c);
                break;
            }
        }
        
        if (gameWon) {
            gameActive = false;
            
            // Increment win count for player X
            if (currentPlayer === 'X') {
                winCount++;
                window.saveHighScore('tictactoe', winCount);
                highScoreElement.innerText = winCount;
            }
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('success');
            }
            
            // Display result
            resultText.innerText = `${currentPlayer === 'X' ? 'Player 1' : (againstAI ? 'AI' : 'Player 2')} Wins!`;
            
            // Show result after a short delay
            setTimeout(() => {
                gameResult.style.display = 'flex';
            }, 800);
            
            return;
        }
        
        // Check for draw
        if (!board.includes('')) {
            gameActive = false;
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('gameOver');
            }
            
            // Display result
            resultText.innerText = 'Game Draw!';
            
            // Show result
            setTimeout(() => {
                gameResult.style.display = 'flex';
            }, 500);
        }
    }
    
    // Highlight winning cells
    function highlightWinningCells(a, b, c) {
        cells[a].classList.add('winning');
        cells[b].classList.add('winning');
        cells[c].classList.add('winning');
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    vsPlayerBtn.addEventListener('click', () => {
        againstAI = false;
        playerOName.innerText = 'Player 2';
        vsPlayerBtn.classList.add('active');
        vsAIBtn.classList.remove('active');
        initializeGame();
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    vsAIBtn.addEventListener('click', () => {
        againstAI = true;
        playerOName.innerText = 'AI';
        vsAIBtn.classList.add('active');
        vsPlayerBtn.classList.remove('active');
        initializeGame();
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    restartBtn.addEventListener('click', () => {
        initializeGame();
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    playAgainBtn.addEventListener('click', () => {
        initializeGame();
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    // Initialize game
    initializeGame();
}; 