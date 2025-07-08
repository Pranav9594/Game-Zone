// General Knowledge Quiz Game Logic
window.initGame = function() {
    // Elements
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const categorySelection = document.getElementById('category-selection');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers');
    const timerProgress = document.getElementById('timer-progress');
    const startButton = document.getElementById('start-btn');
    const nextButton = document.getElementById('next-btn');
    const resultModal = document.getElementById('result-modal');
    const finalScoreElement = document.getElementById('final-score');
    const maxScoreElement = document.getElementById('max-score');
    const feedbackElement = document.getElementById('feedback');
    const newHighScoreElement = document.querySelector('.new-high-score');
    const retryButton = document.getElementById('retry-btn');
    
    // Game variables
    let currentCategory = '';
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let highScore = window.getHighScore('quiz') || 0;
    let timerInterval;
    let timeLeft;
    let hasAnswered = false;
    
    // Constants
    const QUESTIONS_PER_QUIZ = 10;
    const TIME_PER_QUESTION = 15; // seconds
    
    // Set high score
    highScoreElement.textContent = highScore;
    totalQuestionsElement.textContent = QUESTIONS_PER_QUIZ;
    
    // Quiz questions by category
    const quizQuestions = {
        general: [
            {
                question: "What is the capital of Australia?",
                answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
                correct: 2
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correct: 1
            },
            {
                question: "Which planet is known as the Red Planet?",
                answers: ["Venus", "Jupiter", "Saturn", "Mars"],
                correct: 3
            },
            {
                question: "What is the chemical symbol for gold?",
                answers: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            },
            {
                question: "Who painted the Mona Lisa?",
                answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correct: 2
            },
            {
                question: "Which country is home to the kangaroo?",
                answers: ["New Zealand", "South Africa", "Australia", "Brazil"],
                correct: 2
            },
            {
                question: "What is the largest ocean on Earth?",
                answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                correct: 3
            },
            {
                question: "Who was the first person to step on the moon?",
                answers: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"],
                correct: 1
            },
            {
                question: "Which is the tallest mountain in the world?",
                answers: ["K2", "Mount Kilimanjaro", "Mount Everest", "Makalu"],
                correct: 2
            },
            {
                question: "What is the currency of Japan?",
                answers: ["Yuan", "Won", "Yen", "Ringgit"],
                correct: 2
            },
            {
                question: "How many sides does a hexagon have?",
                answers: ["5", "6", "7", "8"],
                correct: 1
            },
            {
                question: "What is the main ingredient in guacamole?",
                answers: ["Avocado", "Tomato", "Onion", "Lime"],
                correct: 0
            }
        ],
        science: [
            {
                question: "What is the chemical formula for water?",
                answers: ["H2O", "CO2", "O2", "H2O2"],
                correct: 0
            },
            {
                question: "What is the hardest natural substance on Earth?",
                answers: ["Platinum", "Steel", "Diamond", "Titanium"],
                correct: 2
            },
            {
                question: "Which scientist proposed the theory of relativity?",
                answers: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"],
                correct: 1
            },
            {
                question: "What is the closest star to Earth?",
                answers: ["Proxima Centauri", "Alpha Centauri", "Polaris", "The Sun"],
                correct: 3
            },
            {
                question: "What is the study of fossils called?",
                answers: ["Archaeology", "Anthropology", "Paleontology", "Geology"],
                correct: 2
            },
            {
                question: "Which part of the human body contains the most bones?",
                answers: ["Spine", "Hands and Feet", "Skull", "Ribcage"],
                correct: 1
            },
            {
                question: "What gas do plants primarily absorb from the atmosphere?",
                answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                correct: 2
            },
            {
                question: "What is the speed of light in a vacuum?",
                answers: ["300,000 km/s", "150,000 km/s", "200,000 km/s", "250,000 km/s"],
                correct: 0
            },
            {
                question: "Which element has the chemical symbol 'Fe'?",
                answers: ["Fluorine", "Ferrum (Iron)", "Feldspar", "Fermium"],
                correct: 1
            },
            {
                question: "What is the largest organ in the human body?",
                answers: ["Brain", "Liver", "Skin", "Heart"],
                correct: 2
            },
            {
                question: "What type of energy is stored in food?",
                answers: ["Kinetic", "Potential", "Chemical", "Nuclear"],
                correct: 2
            },
            {
                question: "What is the unit of electrical resistance?",
                answers: ["Volt", "Watt", "Ampere", "Ohm"],
                correct: 3
            }
        ],
        history: [
            {
                question: "In which year did World War I begin?",
                answers: ["1912", "1914", "1916", "1918"],
                correct: 1
            },
            {
                question: "Who was the first President of the United States?",
                answers: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
                correct: 2
            },
            {
                question: "Which ancient civilization built the pyramids at Giza?",
                answers: ["Mayans", "Romans", "Greeks", "Egyptians"],
                correct: 3
            },
            {
                question: "When did the Berlin Wall fall?",
                answers: ["1987", "1989", "1991", "1993"],
                correct: 1
            },
            {
                question: "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
                answers: ["Joseph Stalin", "Nikita Khrushchev", "Leonid Brezhnev", "Vladimir Lenin"],
                correct: 1
            },
            {
                question: "Which empire was ruled by Genghis Khan?",
                answers: ["Ottoman Empire", "Roman Empire", "Mongol Empire", "Byzantine Empire"],
                correct: 2
            },
            {
                question: "What year was the Declaration of Independence signed?",
                answers: ["1772", "1774", "1776", "1778"],
                correct: 2
            },
            {
                question: "Who discovered penicillin?",
                answers: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Joseph Lister"],
                correct: 1
            },
            {
                question: "Which country was the first to reach the South Pole?",
                answers: ["United States", "Norway", "United Kingdom", "Russia"],
                correct: 1
            },
            {
                question: "Who was the first woman to win a Nobel Prize?",
                answers: ["Marie Curie", "Rosalind Franklin", "Dorothy Hodgkin", "Irène Joliot-Curie"],
                correct: 0
            },
            {
                question: "Which civilization developed the first known writing system?",
                answers: ["Egyptian", "Chinese", "Sumerian", "Indus Valley"],
                correct: 2
            },
            {
                question: "Who painted the ceiling of the Sistine Chapel?",
                answers: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
                correct: 2
            }
        ],
        geography: [
            {
                question: "Which river is the longest in the world?",
                answers: ["Amazon", "Nile", "Mississippi", "Yangtze"],
                correct: 1
            },
            {
                question: "What is the capital of Canada?",
                answers: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
                correct: 3
            },
            {
                question: "Which country has the largest population?",
                answers: ["India", "United States", "China", "Russia"],
                correct: 2
            },
            {
                question: "What is the largest desert in the world?",
                answers: ["Gobi", "Kalahari", "Sahara", "Antarctic"],
                correct: 3
            },
            {
                question: "Which mountain range is the longest in the world?",
                answers: ["Rockies", "Himalayas", "Andes", "Alps"],
                correct: 2
            },
            {
                question: "Which continent is the least populated?",
                answers: ["Australia", "Antarctica", "South America", "Africa"],
                correct: 1
            },
            {
                question: "What is the capital of Brazil?",
                answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
                correct: 2
            },
            {
                question: "Which body of water separates Europe and Africa?",
                answers: ["Black Sea", "Red Sea", "Mediterranean Sea", "Baltic Sea"],
                correct: 2
            },
            {
                question: "What is the smallest country in the world by land area?",
                answers: ["Monaco", "Liechtenstein", "San Marino", "Vatican City"],
                correct: 3
            },
            {
                question: "On which continent would you find the Sahel region?",
                answers: ["Africa", "Asia", "Europe", "South America"],
                correct: 0
            },
            {
                question: "Which country has the most natural lakes?",
                answers: ["United States", "Russia", "Canada", "Finland"],
                correct: 2
            },
            {
                question: "What is the capital of New Zealand?",
                answers: ["Auckland", "Christchurch", "Wellington", "Queenstown"],
                correct: 2
            }
        ],
        entertainment: [
            {
                question: "Which actor played Iron Man in the Marvel Cinematic Universe?",
                answers: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
                correct: 2
            },
            {
                question: "Who directed the movie 'Jurassic Park'?",
                answers: ["James Cameron", "Steven Spielberg", "George Lucas", "Christopher Nolan"],
                correct: 1
            },
            {
                question: "What was the highest-grossing film of all time before adjusting for inflation?",
                answers: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
                correct: 2
            },
            {
                question: "Which band released the album 'Abbey Road'?",
                answers: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "The Who"],
                correct: 1
            },
            {
                question: "Who is the author of the Harry Potter book series?",
                answers: ["J.R.R. Tolkien", "J.K. Rowling", "Stephen King", "George R.R. Martin"],
                correct: 1
            },
            {
                question: "Which TV show featured characters named Ross, Rachel, Monica, Chandler, Joey, and Phoebe?",
                answers: ["How I Met Your Mother", "The Big Bang Theory", "Friends", "Seinfeld"],
                correct: 2
            },
            {
                question: "Who played Jack in the movie 'Titanic'?",
                answers: ["Brad Pitt", "Leonardo DiCaprio", "Johnny Depp", "Tom Cruise"],
                correct: 1
            },
            {
                question: "Which video game franchise features a character named Master Chief?",
                answers: ["Call of Duty", "Halo", "Gears of War", "Destiny"],
                correct: 1
            },
            {
                question: "Who is often referred to as the 'King of Pop'?",
                answers: ["Elvis Presley", "Michael Jackson", "Prince", "David Bowie"],
                correct: 1
            },
            {
                question: "Which animated movie features a character named Simba?",
                answers: ["Aladdin", "The Lion King", "Tarzan", "The Jungle Book"],
                correct: 1
            },
            {
                question: "Who directed the movie 'Pulp Fiction'?",
                answers: ["Martin Scorsese", "Quentin Tarantino", "David Fincher", "Francis Ford Coppola"],
                correct: 1
            },
            {
                question: "Which actress played Katniss Everdeen in 'The Hunger Games' movie series?",
                answers: ["Emma Watson", "Jennifer Lawrence", "Shailene Woodley", "Kristen Stewart"],
                correct: 1
            }
        ]
    };
    
    // Initialize game
    function initializeGame() {
        // Reset game state
        currentQuestions = [];
        currentQuestionIndex = 0;
        score = 0;
        hasAnswered = false;
        
        // Update UI
        scoreElement.textContent = score;
        currentQuestionElement.textContent = 0;
        
        // Show category selection
        categorySelection.classList.remove('hidden');
        questionContainer.classList.add('hidden');
        nextButton.classList.add('hidden');
        startButton.classList.remove('hidden');
        startButton.disabled = true;
        
        // Hide result modal
        resultModal.style.display = 'none';
        
        // Reset category selection
        categoryButtons.forEach(button => {
            button.classList.remove('selected');
        });
    }
    
    // Select random questions from the category
    function selectQuestions(category, count) {
        const allQuestions = [...quizQuestions[category]];
        const selectedQuestions = [];
        
        // Shuffle array
        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }
        
        // Select first 'count' questions
        for (let i = 0; i < Math.min(count, allQuestions.length); i++) {
            selectedQuestions.push(allQuestions[i]);
        }
        
        return selectedQuestions;
    }
    
    // Start quiz
    function startQuiz() {
        // Select questions for the chosen category
        currentQuestions = selectQuestions(currentCategory, QUESTIONS_PER_QUIZ);
        
        // Hide category selection, show question
        categorySelection.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        startButton.classList.add('hidden');
        
        // Set total questions
        maxScoreElement.textContent = currentQuestions.length;
        
        // Display first question
        displayQuestion(0);
    }
    
    // Display question
    function displayQuestion(index) {
        // Update question number
        currentQuestionIndex = index;
        currentQuestionElement.textContent = index + 1;
        
        // Get current question
        const question = currentQuestions[index];
        
        // Display question text
        questionText.textContent = question.question;
        
        // Create answer buttons
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, ansIndex) => {
            const button = document.createElement('button');
            button.classList.add('answer-btn');
            button.textContent = answer;
            button.dataset.index = ansIndex;
            button.addEventListener('click', () => selectAnswer(ansIndex));
            answersContainer.appendChild(button);
        });
        
        // Reset answer state
        hasAnswered = false;
        
        // Reset timer
        timeLeft = TIME_PER_QUESTION;
        timerProgress.style.width = '100%';
        
        // Start timer
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        
        // Hide next button initially
        nextButton.classList.add('hidden');
    }
    
    // Update timer
    function updateTimer() {
        timeLeft--;
        
        // Update timer bar
        const percentage = (timeLeft / TIME_PER_QUESTION) * 100;
        timerProgress.style.width = `${percentage}%`;
        
        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // If no answer selected, show correct answer
            if (!hasAnswered) {
                revealAnswer();
            }
        }
    }
    
    // Select answer
    function selectAnswer(answerIndex) {
        if (hasAnswered) return;
        
        // Mark as answered
        hasAnswered = true;
        
        // Stop timer
        clearInterval(timerInterval);
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
        
        // Get correct answer
        const correctIndex = currentQuestions[currentQuestionIndex].correct;
        
        // Update score if correct
        if (answerIndex === correctIndex) {
            score++;
            scoreElement.textContent = score;
            
            // Play success sound
            if (window.soundEffects) {
                window.soundEffects.play('success');
            }
        }
        
        // Show result
        revealAnswer();
    }
    
    // Reveal correct answer
    function revealAnswer() {
        // Get buttons
        const answerButtons = answersContainer.querySelectorAll('.answer-btn');
        const correctIndex = currentQuestions[currentQuestionIndex].correct;
        
        // Highlight correct and incorrect answers
        answerButtons.forEach((button, index) => {
            if (index === correctIndex) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });
        
        // Show next button or end quiz
        if (currentQuestionIndex < currentQuestions.length - 1) {
            nextButton.classList.remove('hidden');
        } else {
            // Last question, end quiz after a delay
            setTimeout(() => {
                endQuiz();
            }, 1500);
        }
    }
    
    // Move to next question
    function nextQuestion() {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            displayQuestion(currentQuestionIndex + 1);
        }
    }
    
    // End quiz
    function endQuiz() {
        // Update result details
        finalScoreElement.textContent = score;
        
        // Determine feedback based on score percentage
        const percentage = (score / currentQuestions.length) * 100;
        let feedback;
        
        if (percentage >= 90) {
            feedback = "Excellent! You're a true knowledge master!";
        } else if (percentage >= 70) {
            feedback = "Great job! You know your stuff!";
        } else if (percentage >= 50) {
            feedback = "Good effort! Keep learning and you'll improve.";
        } else {
            feedback = "Keep practicing! There's always room to grow.";
        }
        
        feedbackElement.textContent = feedback;
        
        // Check for high score
        let isNewHighScore = false;
        if (score > highScore) {
            isNewHighScore = window.saveHighScore('quiz', score);
            highScore = score;
            highScoreElement.textContent = highScore;
        }
        
        // Show/hide new high score message
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
        
        // Show result modal
        resultModal.style.display = 'flex';
    }
    
    // Event Listeners
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update selected category
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            
            // Store selected category
            currentCategory = button.dataset.category;
            
            // Enable start button
            startButton.disabled = false;
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
        });
    });
    
    startButton.addEventListener('click', () => {
        if (currentCategory) {
            startQuiz();
            
            // Play sound
            if (window.soundEffects) {
                window.soundEffects.play('click');
            }
        }
    });
    
    nextButton.addEventListener('click', () => {
        nextQuestion();
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    retryButton.addEventListener('click', () => {
        initializeGame();
        
        // Play sound
        if (window.soundEffects) {
            window.soundEffects.play('click');
        }
    });
    
    // Initialize game
    initializeGame();
}; 