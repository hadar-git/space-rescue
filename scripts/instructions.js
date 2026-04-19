/**
 * @fileoverview scripts/instructions.js - ניהול דף ההוראות
 * @author Hadar
 */

import { initMusic,  playDefaultTheme } from './audio.js';

/**
 * פונקציית האתחול של דף ההוראות
 */
const initInstructionsPage = () => {
    // הפעלת מוזיקה
   playDefaultTheme();
    // הגדרת הכפתור וחיבור אירוע חזרה
    const backBtn = document.getElementById('backBtn'); // כפתור חזרה לתפריט ראשי
    if (backBtn) {
        /**
         * הוספת אירוע לחיצה (Click) על כפתור החזרה
         */
        backBtn.addEventListener('click', () => {
         window.location.href = '/index.html';

        });
    }
};


// הפעלה בטעינת הדף
document.addEventListener('DOMContentLoaded', initInstructionsPage);
//window.onload = initInstructionsPage;