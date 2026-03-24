/**
 * @fileoverview scripts/instructions.js - ניהול דף ההוראות
 * @author Hadar
 */

import { initMusic } from './audio.js';

const initInstructionsPage = () => {
    // הפעלת מוזיקה (מנסה את מוזיקת התפריט קודם בדף זה)
    initMusic('indexMusic') || initMusic('bgMusic');

    // הגדרת הכפתור וחיבור אירוע חזרה
    const backBtn = document.getElementById('backBtn'); // או .backToMenuBtn לפי ה-ID ב-HTML שלך
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
};

// הפעלה בטעינת הדף
window.onload = initInstructionsPage;