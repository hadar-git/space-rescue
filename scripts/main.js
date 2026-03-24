/**
 * @fileoverview scripts/main.js - ניהול דף הבית ואימות משתמש
 * @author Hadar
 */
import { getPlayerData, updatePlayerProgress } from './data.js';
import { initMusic } from './audio.js';


// משתנים גלובליים לניהול מצב התחברות
let isUserVerified = false;
let savedLevel = 1;




const initMainPage = () => {
    // הפעלת מוזיקה (מנסה indexMusic קודם כי זה דף הבית)
    initMusic('indexBackgroundM') || initMusic('gamesM');

    const form = document.getElementById('loginForm');
    const userInput = document.getElementById('username');
    const returningArea = document.getElementById('returningUserArea');
    const welcomeMsg = document.getElementById('welcomeBackMsg');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return; // הגנה למקרה שהאלמנט לא קיים

    /**
     * מאזין לשליחת הטופס (אימות משתמש ובחירת שלב)
     */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = userInput.value.trim();
        if (!name) return;

        const player = getPlayerData(name);

        // מקרה 1: משתמש קיים - מציגים בחירת שלב
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
            const selectedMode = document.querySelector('input[name="gameMode"]:checked')?.value;
            const targetLevel = (selectedMode === 'new') ? 1 : savedLevel;
            
            if (selectedMode === 'new') updatePlayerProgress(name, 1);
            window.location.href = `./pages/game.html?user=${encodeURIComponent(name)}&level=${targetLevel}`;
        }
        // מקרה 3: משתמש חדש
        else {
            updatePlayerProgress(name, 1);
            window.location.href = `./pages/game.html?user=${encodeURIComponent(name)}&level=1`;
        }
    });

    /**
     * כניסה כאורח
     */
    document.getElementById('guestBtn')?.addEventListener('click', () => {
        window.location.href = `./pages/game.html?user=${encodeURIComponent('אורח')}&level=1`;
    });
};

// הפעלה בטעינה
window.onload = initMainPage;
