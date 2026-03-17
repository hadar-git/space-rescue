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
