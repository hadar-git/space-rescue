
/**
 * @fileoverview 
 * @author Hadar
 */

import { randomSecretCode, checkGuess } from './logic.js';
import {getPlayerData, updatePlayerProgress } from './data.js';
import { initMusic, playDefaultTheme } from './audio.js';

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
    playDefaultTheme();
   
    setupGameStateFromURLANDST ()

    updateDisplay()
    
    setupEventListeners  ()

    document.getElementById('startModal').style.display = 'flex';
};

/**
 * שולפת נתוני שחקן ושלב מהכתובת (URL) ומחשבת את רמת הקושי ההתחלתית.
 * הפונקציה מעדכנת את אובייקט ה-gameState הגלובלי.
 * 
 * @example
 * // במידה וה-URL הוא ?user=Dan&level=3
 * setupGameStateFromURL(); // gameState.playerName יהיה "Dan"
 */
const setupGameStateFromURLANDST = () => {
    const rawData = sessionStorage.getItem('playerData');
    const params = new URLSearchParams(window.location.search);
   if (rawData) {
    const pd = JSON.parse(rawData);
    gameState.playerName = pd.name || "אורח";
    gameState.highScore = pd.highScore || 0;
    } else {
     // const nameFromURL = params.get('user');
        gameState.playerName =  "אורח";
        gameState.highScore = 0;
        }


const levelFromURL = params.get('level');
    gameState.currentLevel = parseInt(levelFromURL) || 1;
 gameState.difficulty = Math.min(3 + Math.floor((gameState.currentLevel - 1) / 2), 6);
   
};


/**
 * מעדכנת את כל רכיבי הממשק (DOM) בדף לפי הנתונים הנוכחיים ב-gameState.
 * כולל שם שחקן, ניסיונות, שלב נוכחי ושליפת שיא אישי מהזיכרון המקומי.
 * 
 * @returns {void}
 */
  const  updateDisplay=()=>{
             document.getElementById('displayPlayerName').textContent = gameState.playerName;
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;

    
  const savedData = getPlayerData(gameState.playerName);

const highScore = savedData ? savedData.level : 1;

const highScoreElement = document.getElementById('highScoreDisplay');

if (highScoreElement) {
    highScoreElement.textContent = highScore; 

    };
}
/**
 * מחברת מאזיני אירועים (Event Listeners) לכפתורי התפריט, למודלים ולמקלדת.
 * כולל טיפול בכפתורי ניווט, התחלת משחק והזנת ניחושים מהמקלדת.
 * 
 * @listens window#keydown - מאזין להקשות מספרים במקלדת לצורך הזנת ניחוש.
 * @listens click - מאזין ללחיצות על כפתורי התחלה, חזרה וניסיון חוזר.
 */
    const setupEventListeners = () => {

    document.getElementById('startGameBtn')?.addEventListener('click', startGame);
    document.getElementById('nextLevelBtn')?.addEventListener('click', nextLevel);
    document.getElementById('retryBtn')?.addEventListener('click', restartCurrentLevel);

    document.querySelectorAll('.backToMenuBtn').forEach(btn => {
    btn.addEventListener('click', () => window.location.href = '../index.html');
});


    window.addEventListener('keydown', (e) => {
        if (!gameState.isGameActive) return;
        if (e.key >= '0' && e.key <= '9') handleInput(parseInt(e.key));
    });

}

/**
 * התחלת שלב חדש: הגרלת קוד, הפעלת טיימר ומוזיקה.
 */
const startGame = () => {

    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    gameState.isGameActive = true;

    gameState.secretCode = randomSecretCode(gameState.difficulty);
    
    
    console.log("Secret Code:", gameState.secretCode); // הדפסת הקוד

    renderButtons();
    startTimer();
};

/**
 * מנהל את הספירה לאחור של השלב.
 * משתמש ב-setInterval לעדכון ה-DOM בכל שנייה.
 */
const startTimer = () => {

  

    if (gameState.timerInterval)  clearInterval(gameState.timerInterval);

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
 * טיפול במצב ניצחון: עדכון שיא אישי ושמירה ב-Data.
 */
const winGame = () => {
    stopGameEngine(); 
     gameState.currentLevel++
    if (gameState.playerName !== "אורח") {
        updatePlayerProgress(gameState.playerName, gameState.currentLevel-1);
    }
const highScoreElement = document.getElementById('highScoreDisplay');
if (highScoreElement) {

    highScoreElement.textContent = gameState.currentLevel-1
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
 * עצירת מנוע המשחק (טיימר).
 */
const stopGameEngine = () => {
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
};


/**
 * מאפסת את משתני המצב של המשחק ואת רכיבי התצוגה (DOM) לערכי ברירת המחדל של תחילת שלב.
 * הפונקציה מאפסת ניסיונות, זמן, ניחוש נוכחי ומנקה את היסטוריית הניחושים על המסך.
 */
const resetGameState = () => {
    stopGameEngine();
       
    gameState.attemptsLeft = 20;
    gameState.timeLeft = 60;
    currentGuess = [];

    document.getElementById('attempts').textContent = gameState.attemptsLeft;
  
    document.getElementById('historyList').textContent = "";
    document.getElementById('timer').textContent = "01:00";
};


/**
 * מעבירה את המשחק לשלב הבא.
 * מעדכנת את מספר השלב, מחשבת מחדש את רמת הקושי (אורך הקוד),
 * מאפסת את נתוני השלב ומתחילה משחק חדש.
 */
const nextLevel = () => {
    stopGameEngine();

    gameState.difficulty = Math.min(3 + Math.floor((gameState.currentLevel - 1) / 2), 6);
    
    resetGameState(); 
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;
    
    startGame(); 
};

/**
 * מאתחלת מחדש את השלב הנוכחי מבלי לשנות את רמת הקושי.
 * משמשת למצבים של "נסה שוב" לאחר הפסד או איפוס ידני.
 */
const restartCurrentLevel = () => {
    resetGameState();
    startGame();
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
         btn.setAttribute('data-value', i)
        btn.addEventListener('click', (e) => {   
        handleInput(i)
      
          });
         area.appendChild(btn);
    }
};
        document.addEventListener('DOMContentLoaded', initPage);

