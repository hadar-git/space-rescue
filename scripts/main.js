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
// שליפת אלמנטים מה-DOM לצורך עדכון ויזואלי וניהול הטופס
    const form = document.getElementById('loginForm');
    const userInput = document.getElementById('username');
    const returningArea = document.getElementById('returningUserArea');
    const welcomeMsg = document.getElementById('welcomeBackMsg');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return; // הגנה למקרה שהאלמנט לא קיים

    /**
     * מאזין לאירוע שליחת הטופס - מנהל את כל תהליך הכניסה למשחק
     */
    form.addEventListener('submit', (e) => {
        e.preventDefault();//מניעת רענון הדף האוטומטי
        const name = userInput.value.trim();// קבלת השם וניקוי רווחים מיותרים מהצדדים
        if (!name) return; // אם המשתמש לא הזין שםם
// שימוש בפונקציה מ-data.js כדי לבדוק אם השם הזה כבר קיים ב-LocalStorage
        const player = getPlayerData(name);

        // מקרה 1: משתמש קיים - מציגים בחירת שלב
        if (player && !isUserVerified) {

              savedLevel = player.level;// שמירת השלב השמור מהזיכרון
              
              // קשור לעיצוב
            const nextEl = userInput.nextElementSibling;
        if (nextEl) {
            nextEl.style.transition = "all 0.5s";
        }

          
            welcomeMsg.textContent = `שלום ${name}, המערכת זיהתה שהגעת לשלב ${savedLevel}.`;
            // הצגה של איזור נסתר שמאפשר בחירת שלב
            returningArea.classList.remove('hidden');
            // שינוי הטקסט בכפתור כדי להבהיר שהלחיצה הבאה תתחיל את המשחק
            submitBtn.textContent = "אשר בחירה וצא לדרך";
            isUserVerified = true;// מעבר למצב "מאומת" - הלחיצה הבאה תעבור לדף המשחק
            userInput.readOnly = true;// חסימת השם לשינוי כדי למנוע בלבול בזיהוי
        } 
        // מקרה 2: המשתמש כבר זוהה ואישר את הבחירה
        else if (player && isUserVerified) {
            // בודקים מה השחקן בחר
            const selectedMode = document.querySelector('input[name="gameMode"]:checked')?.value;
            // קביעת שלב לפי מה שנבחר
            const targetLevel = (selectedMode === 'new') ? 1 : savedLevel;
          
            // מעבר לדף המשחק עם שליחת הפרמטרים ב-URL (שימוש ב-encodeURIComponent לטיפול בעברית/תווים מיוחדים)
            window.location.href = `./pages/game.html?user=${encodeURIComponent(name)}&level=${targetLevel}`;
        }
        // מקרה 3: משתמש חדש (כלומר לא נמצא בלוקאל סוטרג' )
        else {
            // יצירת רשומה חדשה עבורו בזיכרון עם שלב 1
            updatePlayerProgress(name, 1);
            // מעבר ישיר למשחק בשלב 1
            window.location.href = `./pages/game.html?user=${encodeURIComponent(name)}&level=1`;
        }
    });

    /**
     * כניסה כאורח
     */
    document.getElementById('guestBtn')?.addEventListener('click', () => {
        // שליחה לדף המשחק עם השם "אורח" ושלב התחלתי 1
        window.location.href = `./pages/game.html?user=${encodeURIComponent('אורח')}&level=1`;
    });
};

// הפעלה בטעינה
document.addEventListener('DOMContentLoaded', initMainPage);
//window.onload = initMainPage;