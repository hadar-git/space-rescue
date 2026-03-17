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

