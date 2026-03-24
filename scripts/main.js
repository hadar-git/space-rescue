/**
 * @fileoverview scripts/main.js - ניהול דף הבית ואימות משתמש
 * @author Hadar
 */
import { getPlayerData, updatePlayerProgress } from './data.js';

const form = document.getElementById('loginForm');
const userInput = document.getElementById('username');
const returningArea = document.getElementById('returningUserArea');
const welcomeMsg = document.getElementById('welcomeBackMsg');
const submitBtn = document.getElementById('submitBtn');
const bgMusic = document.getElementById('indexMusic');

let isUserVerified = false;
let savedLevel = 1;

/**
 * ניהול מוזיקת רקע - הפעלה באינטראקציה ראשונה או טעינה
 */
const handleMusic = () => {
    if (!bgMusic) return;
    
    bgMusic.play().catch(() => {
        // אם נחסם, נמתין ללחיצה ראשונה של המשתמש
        window.addEventListener('click', () => {
            bgMusic.play();
        }, { once: true });
    });
};

/**
 * טיפול בשליחת הטופס - זיהוי משתמש קיים או יצירת חדש
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userInput.value.trim();
    if (!name) return;

    const player = getPlayerData(name);

    // מקרה 1: משתמש קיים - מציגים אפשרות לבחור שלב
    if (player && !isUserVerified) {
        savedLevel = player.level;
        welcomeMsg.textContent = `שלום ${name}, המערכת זיהתה שהגעת לשלב ${savedLevel}.`;
        returningArea.classList.remove('hidden');
        submitBtn.textContent = "אשר בחירה וצא לדרך";
        isUserVerified = true;
        userInput.readOnly = true;
    } 
    // מקרה 2: המשתמש כבר זוהה ואישר את הבחירה
    else if (player && isUserVerified) {
        const mode = document.querySelector('input[name="gameMode"]:checked').value;
        const targetLevel = (mode === 'new') ? 1 : savedLevel;
        
        if (mode === 'new') updatePlayerProgress(name, 1);
        window.location.href = `./pages/game.html?user=${encodeURIComponent(name)}&level=${targetLevel}`;
    }
    // מקרה 3: משתמש חדש לגמרי
    else {
        updatePlayerProgress(name, 1);
        window.location.href = `./pages/game.html?user=${encodeURIComponent(name)}&level=1`;
    }
});

/**
 * כניסה כאורח (ללא שמירת נתונים)
 */
document.getElementById('guestBtn').addEventListener('click', () => {
    window.location.href = `./pages/game.html?user=אורח&level=1`;
});

// אתחול מוזיקה בטעינה
handleMusic();