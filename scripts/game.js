import { randomSecretCode, checkGuess } from './logic.js';

const gameState = {
    playerName: "",
    difficulty: 3, 
    currentLevel: 1,
    secretCode: [],
    attempts: 0,
    timeLeft: 60,
    timerInterval: null,
    isGameActive: false 
};

let currentGuess = [];

const initPage = () => {
    const params = new URLSearchParams(window.location.search);
    gameState.playerName = params.get('user') || "אסטרונאוט/ית";
    gameState.difficulty = parseInt(params.get('level')) || 3;

    document.getElementById('displayPlayerName').textContent = gameState.playerName;
    
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);
    
    const restartBtn = document.getElementById('restartBtn');
    if(restartBtn) restartBtn.addEventListener('click', () => location.reload());

    const backBtn = document.getElementById('backToMenuBtn');
    if(backBtn) backBtn.addEventListener('click', () => window.location.href = '../index.html');
    
    // הצגת מודאל התחלה
    document.getElementById('startModal').style.display = 'flex';
};


const startGame = () => {
    // הסתרת כל המודאלים בצורה נקייה
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    
    gameState.isGameActive = true;
    gameState.secretCode = randomSecretCode(gameState.difficulty);
    console.log("Secret Code (Dev):", gameState.secretCode);
    
    renderButtons();
    startTimer();
};

const renderButtons = () => {
    const inputArea = document.getElementById('inputArea');
    
   
    while (inputArea.firstChild) {
        inputArea.removeChild(inputArea.firstChild);
    }

    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = i; 
        btn.classList.add('num-btn');
        btn.addEventListener('click', () => handleInput(i));
        inputArea.appendChild(btn);
    }
};


const handleInput = (num) => {
    if (!gameState.isGameActive) return;

    currentGuess.push(num);
    
    if (currentGuess.length === gameState.difficulty) {
        processGuess([...currentGuess]);
        currentGuess = [];
    }
};

const processGuess = (guess) => {
    gameState.attempts++;
    const result = checkGuess(gameState.secretCode, guess);
    
    // בונוס/עונש זמן (הטוויסט המלחיץ!)
    if (result.bulls > 0) {
        gameState.timeLeft += (result.bulls * 2); 
    } else {
        gameState.timeLeft -= 3;
    }

    const history = document.getElementById('historyList');
    const li = document.createElement('li');
    
    // שימוש ב-textContent במקום innerHTML - הכי בטוח שיש
    li.textContent = `ניחוש: ${guess.join('')} | בול: ${result.bulls}, פגיעה: ${result.cows}`;
    
    // הוספה לראש הרשימה
    history.prepend(li);
    
    document.getElementById('attempts').textContent = gameState.attempts;

    if (result.bulls === gameState.difficulty) {
        winGame();
    }
};

const winGame = () => {
    gameState.isGameActive = false; 
    clearInterval(gameState.timerInterval);
    document.getElementById('winModal').style.display = 'flex';
};

const nextLevel = () => {
    gameState.currentLevel++;
    gameState.difficulty++; 
    gameState.attempts = 0;
    gameState.timeLeft = 60;
    
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;
    document.getElementById('attempts').textContent = "0";
    
    // ניקוי היסטוריה בטוח
    const history = document.getElementById('historyList');
    while (history.firstChild) {
        history.removeChild(history.firstChild);
    }
    
    startGame(); 
};

const startTimer = () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);

    const timerDisplay = document.getElementById('timer');
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        
        // הצגה יפה של הזמן
        const displaySeconds = gameState.timeLeft < 10 ? `0${gameState.timeLeft}` : gameState.timeLeft;
        timerDisplay.textContent = `00:${displaySeconds}`;
        
        if (gameState.timeLeft <= 0) {
            loseGame();
        }
    }, 1000);
};

const loseGame = () => {
    gameState.isGameActive = false; 
    clearInterval(gameState.timerInterval);
    document.getElementById('loseModal').style.display = 'flex';
};

window.onload = initPage;