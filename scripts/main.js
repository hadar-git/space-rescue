/**
 * @fileoverview scripts/main.js - ניהול דף הבית ואימות משתמש
 * @author Hadar
 */
import { getPlayerData, updatePlayerProgress } from './data.js';
import { initMusic,  playDefaultTheme } from './audio.js';


// משתנה בוליאני שעוזר לנו לדעת אם כבר זיהינו את המשתמש במערכת
let isUserVerified = false;
//משתנה לשמירת השלב המקסימלי שהשחקן הגיע אליו, כדי שנוכל להציע לו להמשיך ממנו
let savedLevel = 1;


/**
 * פונקציית האתחול של דף הבית - מגדירה מאזינים לאירועים וטוענת הגדרות ראשוניות
 */

const initMainPage = () => {

     playDefaultTheme();

    const form = document.getElementById('loginForm');
    const userInput = document.getElementById('username');
    const returningArea = document.getElementById('returningUserArea');
    const welcomeMsg = document.getElementById('welcomeBackMsg');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    /**
     * מאזין לאירוע שליחת הטופס - מנהל את כל תהליך הכניסה למשחק
     */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = userInput.value.trim();
        if (!name) return;

        const player = getPlayerData(name);


          if(!player) {
          const newP=  updatePlayerProgress(name, 0);
            sessionStorage.setItem('playerData',JSON.stringify(newP))

            window.location.href = `./pages/script.html?level=1`;
        }
// אם המשתמש שלי קיים אבל עדיין לא זוהה
        else if(!isUserVerified) {
              savedLevel = player.level;   
              // קשור לעיצוב
            const nextEl = userInput.nextElementSibling;
        if (nextEl) {
            nextEl.style.transition = "all 0.5s";
        }
   
            welcomeMsg.textContent = `שלום ${name}, המערכת זיהתה שהגעת לשלב ${savedLevel}.`;
            returningArea.classList.remove('hidden');
            submitBtn.textContent = "אשר בחירה וצא לדרך";
            isUserVerified = true;
            userInput.readOnly = true;// חסימת השם לשינוי כדי למנוע בלבול בזיהוי
        } 
      
        else {
           
            const selectedMode = document.querySelector('input[name="gameMode"]:checked')?.value;

            const targetLevel = (selectedMode === 'new') ? 1 : savedLevel;
            const PD={name: name, highScore: savedLevel}
           sessionStorage.setItem('playerData', JSON.stringify(PD))
    
            // מעבר לדף המשחק עם שליחת הפרמטרים ב-URL (שימוש ב-encodeURIComponent לטיפול בעברית/תווים מיוחדים)
            window.location.href = `./pages/script.html?level=${targetLevel}`;
        }
     
     
    });

    /**
     * כניסה כאורח
     */
    document.getElementById('guestBtn')?.addEventListener('click', (e) => {
        e.preventDefault()
        sessionStorage.removeItem('playerData');
        console.log("ניקוי נתונים ומעבר כאורח...");
        window.location.href = `./pages/script.html?level=1`;
    });
};
document.addEventListener('DOMContentLoaded', initMainPage);