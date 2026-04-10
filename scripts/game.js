
/**
 * @fileoverview 
 * @author Hadar
 */

import { randomSecretCode, checkGuess } from './logic.js';
import {getPlayerData, updatePlayerProgress } from './data.js';
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
// אובייקט מרכזי השומר את כל הנתונים המשתנים של המשחק לצורך סנכרון התצוגה והלוגיקה
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

// מערך זמני ששומר את הניחושים
let currentGuess = [];


/**
 * אתחול העמוד: טעינת נתוני שחקן מה-URL, הגדרת מאזינים והכנת התצוגה.
 * משתמש ב-BOM (URLSearchParams) כדי לדלות נתונים שהועברו מדף הבית.
 */
const initPage = () => {
    initMusic('bgMusic') || initMusic('indexMusic');

    const params = new URLSearchParams(window.location.search);
    gameState.playerName = params.get('user') || "אורח";
    // מקבל בצורה של סטרינג ולכן הופכים את זה לאינט - parseInt
    gameState.currentLevel = parseInt(params.get('level')) || 1;
    
   // חישוב קושי התחלתי: כל 2 שלבים אורך הקוד עולה ב-1 (מקסימום 6)
    gameState.difficulty = Math.min(3 + Math.floor((gameState.currentLevel - 1) / 2), 6);

    // עדכון תצוגה מעדכנים את השם את השלב את כמות הנסיונות
    document.getElementById('displayPlayerName').textContent = gameState.playerName;
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;


// קריאה לפונקציה מ-data.js שמחפשת את נתוני השחקן הנוכחי בזיכרון המקומי
const savedData = getPlayerData(gameState.playerName);

// שימוש באופרטור טרנרי (תנאי מקוצר): אם נמצאו נתונים (savedData אינו null)
// נשמור את השלב (level), אחרת נקבע ברירת מחדל של שלב 1
const highScore = savedData ? savedData.level : 1;

// מציאת האלמנט ב-HTML שבו נרצה להציג את השיא האישי
const highScoreElement = document.getElementById('highScoreDisplay');

// בדיקת הגנה: מוודאים שהאלמנט אכן קיים בדף לפני שמנסים לעדכן את התוכן שלו
if (highScoreElement) {
    highScoreElement.textContent = highScore; // הצגת השיא על גבי המסך
}

    // חיבור אירועים לכפתורי התפריט והמודלים
    // אם הוא לא מוצא הוא פשוט לא עושה כלום
    document.getElementById('startGameBtn')?.addEventListener('click', startGame);
    document.getElementById('nextLevelBtn')?.addEventListener('click', nextLevel);
    document.getElementById('retryBtn')?.addEventListener('click', restartCurrentLevel);

    // בגלל שיש את האופציה של חזרה לתפריט ראשי גם בהפסד וגם בניצחון אז צריך לולאה 
    // אלא אם כן נותנים שם שונה לכל אחד ואז כל אחד בנפרד
    document.querySelectorAll('.backToMenuBtn').forEach(btn => {
    btn.addEventListener('click', () => window.location.href = '../index.html');
});

    // האזנה למקלדת להזנת מספרים
    window.addEventListener('keydown', (e) => {
        if (!gameState.isGameActive) return;
        // אם מה שלחצו עליו זה אכן מספר אז מכניסים את זה למערך הניחושים
        if (e.key >= '0' && e.key <= '9') handleInput(parseInt(e.key));
    });

// לפני שמתחיל המשחק קופץ חלון של התחלה
    document.getElementById('startModal').style.display = 'flex';
};


/**
 * התחלת שלב חדש: הגרלת קוד, הפעלת טיימר ומוזיקה.
 */
const startGame = () => {
    // סגירת כל החלונות הקופצים לפני תחילת המשחק
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    gameState.isGameActive = true;
    // הגרלת קוד סודי חדש בעזרת הפונקציה מהקובץ logic.js
    gameState.secretCode = randomSecretCode(gameState.difficulty);
    
    
    console.log("Secret Code:", gameState.secretCode); // הדפסת הקוד

    renderButtons(); //יוצר כפתורים
    startTimer();
};

/**
 * מנהל את הספירה לאחור של השלב.
 * משתמש ב-setInterval לעדכון ה-DOM בכל שנייה.
 */
const startTimer = () => {
    // במידה ויש טיימר כלשהו שעובד אז הוא מנקה אותו כדי שלא יהיה כמה ביחד
    if (gameState.timerInterval)  clearInterval(gameState.timerInterval);
    //מתחיל טיימר
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isGameActive) return;
        gameState.timeLeft--;
        //תופסים את האלמנט כדי שהשחקן יוכל לראות שהזמן יורד 
        const timerDisplay = document.getElementById('timer');
        //עיצוב הזמן שיוצג תמיד עם שתי ספרות
        const sec = gameState.timeLeft < 10 ? `0${Math.max(0, gameState.timeLeft)}` : gameState.timeLeft;
        timerDisplay.textContent = `00:${sec}`;
        //אם הזמן נגמר אז יש הפסד
        if (gameState.timeLeft <= 0) loseGame();
        // פקודה למחשב לעשות את הפעולה הזו כל שניה
    }, 1000);
};


/**
 * עיבוד קלט מהשחקן (מקלדת או כפתורים).
 * @param {number} num - הספרה שהוקשה.
 */
const handleInput = (num) => {
    if (!gameState.isGameActive) return;
    //מכניס את המספר הנוכחי למערך הניחושים 
    currentGuess.push(num);
    // הוא כל פעם מחדש בודק האם הכמות של הספרות מספיקה או שצריך עוד
    if (currentGuess.length === gameState.difficulty) {
        // שולח לפונקציה שתבדוק את הניחוש אבל לא את המערך אלא העתק שלו
        processGuess([...currentGuess]);
        // מאפס לניחוש הבא
        currentGuess = [];
    }
};


/**
 * שליחת הניחוש לבדיקה ועדכון ההיסטוריה על המסך.
 * @param {number[]} guess - מערך הניחוש המלא.
 */
const processGuess = (guess) => {
    if (!gameState.isGameActive) return;
    //מוריד את מספר הניחושים שנשארו
    gameState.attemptsLeft--;
    //
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
    //מקבל את התוצאות כמה פגיעות וכמה בולים היו 
    const result = checkGuess(gameState.secretCode, guess);
    // מכניס את הניחוש הזה להסטורית הניחושים במשחק
    const history = document.getElementById('historyList');
    const li = document.createElement('li');
    li.textContent = `ניחוש: ${guess.join('')} | בול: ${result.bulls}, פגיעה: ${result.cows}`;
    history.prepend(li);
    // בדיקת תנאי ניצחון: מספר הבולים שווה לאורך הקוד
    if (result.bulls === gameState.difficulty) winGame();
    // בדיקת תנאי הפסד: נגמרו הניסיונות
    else if (gameState.attemptsLeft <= 0) loseGame();
};


/**
 * טיפול במצב ניצחון: עדכון שיא אישי ושמירה ב-Data.
 */
const winGame = () => {
    stopGameEngine(); // עוצר את השעון ואת האפשרות להקיש מספרים
    // מחשב את השלב הבא 
    const reachedLevel = gameState.currentLevel + 1;
// אם זה לא אורח אז שומרים את ההשיג שלו בזיכרון המקומי
    if (gameState.playerName !== "אורח") {
        updatePlayerProgress(gameState.playerName, reachedLevel);
// לאחר שעדכנו את הזיכרון (updatePlayerProgress), אנחנו מושכים את הנתונים המעודכנים
// זה מבטיח שאנחנו מציגים את ה"מקור האמיתי" מה-LocalStorage
const updatedData = getPlayerData(gameState.playerName);

// תפיסת האלמנט של השיא האישי לצורך עדכון ויזואלי
const highScoreElement = document.getElementById('highScoreDisplay');

// בדיקה כפולה: מוודאים שגם האלמנט קיים וגם שהצלחנו לשלוף נתונים תקינים
if (highScoreElement && updatedData) {
    // עדכון המספר על המסך לשלב החדש (או השלב הגבוה ביותר שנשמר)
    highScoreElement.textContent = updatedData.level;
}
    }
//מציג את החלון הקופץ של הניצחון 
    document.getElementById('winModal').style.display = 'flex';
};

/**
 * טיפול במצב הפסד (נגמר הזמן או הניסיונות).
 */

const loseGame = () => {
    stopGameEngine(); // עוצר את השעון ואת האפשרות להקיש מספרים
    document.getElementById('loseModal').style.display = 'flex';
};

/**
 * עצירת מנוע המשחק (טיימר ומוזיקה).
 */
const stopGameEngine = () => {
    gameState.isGameActive = false;
    // עצירת ה setInterval כלומר עצירת השעון
    clearInterval(gameState.timerInterval);
};


/**
 * מאפסת את משתני המצב של המשחק ואת רכיבי התצוגה (DOM) לערכי ברירת המחדל של תחילת שלב.
 * הפונקציה מאפסת ניסיונות, זמן, ניחוש נוכחי ומנקה את היסטוריית הניחושים על המסך.
 */
const resetGameState = () => {
        // איפוס נתונים 
    gameState.attemptsLeft = 20;
    gameState.timeLeft = 60;
    currentGuess = [];
        // עדכון ה-DOM: הצגת מספר השלב והניסיונות החדשים על המסך
    document.getElementById('attempts').textContent = gameState.attemptsLeft;
        // ניקוי רשימת ההיסטוריה של הניחושים מהשלב הקודם
    document.getElementById('historyList').textContent = "";
    document.getElementById('timer').textContent = "01:00";
};


/**
 * מעבירה את המשחק לשלב הבא.
 * מעדכנת את מספר השלב, מחשבת מחדש את רמת הקושי (אורך הקוד),
 * מאפסת את נתוני השלב ומתחילה משחק חדש.
 */
const nextLevel = () => {
    gameState.currentLevel++;
    // נוסחה לעליית קושי: כל 2 שלבים נוספת ספרה אחת לקוד (מינימום 3, מקסימום 6)
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
    const area = document.getElementById('inputArea'); // מציאת האזור שבו יוצבו הכפתורים
    area.textContent = ""; // ניקוי תוכן קודם כדי למנוע כפילויות של כפתורים
    // לולאה ליצירת הכפתורים
    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('num-btn');// זה כבר קשור לעיצוב הוספה של CLASS 
        // הצמדת מאזין אירועים: לחיצה על הכפתור תשלח את המספר שלו לפונקציית handleInput
        btn.addEventListener('click', () => handleInput(i));
        // כשהכפתור מוכן נוסף ללוח
        area.appendChild(btn);
    }
};
// הגדרת אירוע : ברגע שהחלון סיים להיטען, מפעילים את פונקציית האתחול initPage
//window.onload = initPage;
        document.addEventListener('DOMContentLoaded', initPage);

