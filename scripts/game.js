
/**
 * @fileoverview 
 * @author Hadar
 */

import { randomSecretCode, checkGuess } from './logic.js';
import { updatePlayerProgress } from './data.js';
import { initMusic } from './audio.js';

/**
 * @typedef {Object} GameState
 * @property {string} playerName - שם השחקן
 * @property {number} difficulty - אורך הקוד הסודי (נקבע לפי השלב)
 * @property {number} currentLevel - השלב הנוכחי במשחק
 * @property {number[]} secretCode - הקוד הסודי שהוגרל
 * @property {number} attemptsLeft - מספר הניסיונות שנותרו
 * @property {number} timeLeft - מספר השניות שנותרו לסיום השלב
 * @property {number|null} timerInterval - מזהה האינטרוול של הטיימר
 * @property {boolean} isGameActive - האם המשחק רץ כרגע
 */

const gameState = {
    playerName: "",
    difficulty: 3, 
    currentLevel: 1,
    secretCode: [],
    attemptsLeft: 20, 
    timeLeft: 60,
    timerInterval: null,
    isGameActive: false 
};


let currentGuess = [];


/**
 * אתחול העמוד: טעינת נתוני שחקן מה-URL, הגדרת מאזינים והכנת התצוגה.
 * משתמש ב-BOM (URLSearchParams) כדי לדלות נתונים שהועברו מדף הבית.
 */
const initPage = () => {
    initMusic('gamesM') || initMusic('indexBackgroundM');

    const params = new URLSearchParams(window.location.search);
    gameState.playerName = params.get('user') || "אורח";
    gameState.currentLevel = parseInt(params.get('level')) || 1;
    
   // חישוב קושי התחלתי: כל 2 שלבים אורך הקוד עולה ב-1 (מקסימום 6)
    gameState.difficulty = Math.min(3 + Math.floor((gameState.currentLevel - 1) / 2), 6);

    // עדכון תצוגה
    document.getElementById('displayPlayerName').textContent = gameState.playerName;
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;

    // טעינת שיא אישי מהדפדפן
    const savedData = JSON.parse(localStorage.getItem(`stats_${gameState.playerName}`));
    const highScore = savedData ? savedData.highScore : 1;
    const highScoreElement = document.getElementById('highScoreDisplay');
    if (highScoreElement) highScoreElement.textContent = highScore;


    // חיבור אירועים לכפתורי התפריט והמודלים
    document.getElementById('startGameBtn')?.addEventListener('click', startGame);
    document.getElementById('nextLevelBtn')?.addEventListener('click', nextLevel);
    document.getElementById('retryBtn')?.addEventListener('click', restartCurrentLevel);
    
document.querySelectorAll('.backToMenuBtn').forEach(btn => {
    btn.addEventListener('click', () => window.location.href = '../index.html');
});

    // האזנה למקלדת להזנת מספרים
    window.addEventListener('keydown', (e) => {
        if (!gameState.isGameActive) return;
        if (e.key >= '0' && e.key <= '9') handleInput(parseInt(e.key));
    });


    document.getElementById('startModal').style.display = 'flex';
};

/**
 * התחלת שלב חדש: הגרלת קוד, הפעלת טיימר ומוזיקה.
 */



const startGame = () => {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    gameState.isGameActive = true;
    gameState.secretCode = randomSecretCode(gameState.difficulty);
    
    console.log("Secret Code:", gameState.secretCode); // לצורכי ניפוי שגיאות

    renderButtons();
    startTimer();
};



/**
 * מעבר לשלב הבא ועדכון רמת הקושי.
 */
const nextLevel = () => {
    gameState.currentLevel++;
    // עדכון אורך הקוד: כל 2 שלבים עולה ספרה אחת
    gameState.difficulty = Math.min(3 + Math.floor((gameState.currentLevel - 1) / 2), 6);
    
    // איפוס נתונים (זמן וניסיונות נשארים קבועים לפי בקשתך)
    gameState.attemptsLeft = 20;
    gameState.timeLeft = 60;
    currentGuess = [];
    
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    document.getElementById('historyList').textContent = "";
    
    startGame(); 
};


/**
 * איפוס השלב הנוכחי ללא שינוי ברמת הקושי.
 */
const restartCurrentLevel = () => {
    gameState.attemptsLeft = 20;
    gameState.timeLeft = 60;
    currentGuess = [];
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    document.getElementById('timer').textContent = "01:00";
    document.getElementById('historyList').textContent = "";
    startGame(); // יגריל קוד חדש באותו אורך
};


/**
 * עצירת מנוע המשחק (טיימר ומוזיקה).
 */
const stopGameEngine = () => {
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
};
/**
 * טיפול במצב ניצחון: עדכון שיא אישי ושמירה ב-Data.
 */
const winGame = () => {
    stopGameEngine();
    
    const reachedLevel = gameState.currentLevel + 1;

    if (gameState.playerName !== "אורח") {
        // במקום לכתוב פה לוגיקה של localStorage - משתמשים בפונקציה הקיימת מ-data.js!
        updatePlayerProgress(gameState.playerName, reachedLevel);
        
        // עדכון התצוגה על המסך מהנתונים המעודכנים
        const highScoreElement = document.getElementById('highScoreDisplay');
        if (highScoreElement) highScoreElement.textContent = reachedLevel;
    }

    document.getElementById('winModal').style.display = 'flex';
};

/**
 * טיפול במצב הפסד (נגמר הזמן או הניסיונות).
 */

const loseGame = () => {
    stopGameEngine();
    document.getElementById('loseModal').style.display = 'flex';
};


/**
 * מנהל את הספירה לאחור של השלב.
 * משתמש ב-setInterval לעדכון ה-DOM בכל שנייה.
 */
const startTimer = () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isGameActive) return;
        gameState.timeLeft--;
        const timerDisplay = document.getElementById('timer');
        const sec = gameState.timeLeft < 10 ? `0${Math.max(0, gameState.timeLeft)}` : gameState.timeLeft;
        timerDisplay.textContent = `00:${sec}`;
        if (gameState.timeLeft <= 0) loseGame();
    }, 1000);
};

/**
 * עיבוד קלט מהשחקן (מקלדת או כפתורים).
 * @param {number} num - הספרה שהוקשה.
 */
const handleInput = (num) => {
    if (!gameState.isGameActive) return;
    currentGuess.push(num);
    if (currentGuess.length === gameState.difficulty) {
        processGuess([...currentGuess]);
        currentGuess = [];
    }
};


/**
 * שליחת הניחוש לבדיקה ועדכון ההיסטוריה על המסך.
 * @param {number[]} guess - מערך הניחוש המלא.
 */
const processGuess = (guess) => {
    if (!gameState.isGameActive) return;
    gameState.attemptsLeft--;
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    const result = checkGuess(gameState.secretCode, guess);
    const history = document.getElementById('historyList');
    const li = document.createElement('li');
    li.textContent = `ניחוש: ${guess.join('')} | בול: ${result.bulls}, פגיעה: ${result.cows}`;
    history.prepend(li);
    if (result.bulls === gameState.difficulty) winGame();
    else if (gameState.attemptsLeft <= 0) loseGame();
};

/**
 *יצירה דינמית של כפתורי המספרים  
 */
const renderButtons = () => {
    const area = document.getElementById('inputArea');
    area.textContent = "";
    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('num-btn');
        btn.addEventListener('click', () => handleInput(i));
        area.appendChild(btn);
    }
};

window.onload = initPage;