/**
 * @fileoverview ניהול דף השיאים - יצירה דינמית של טבלת המצטיינים ומוזיקת רקע
 * @author Hadar
 */

import { initMusic } from './audio.js';

/**
 * פונקציה המופעלת בטעינת העמוד: מושכת נתונים מה-LocalStorage ובונה את הטבלה
 */
const initLeaderboard = () => {
    // --- 1. טיפול במוזיקת רקע (שימוש בפונקציה האחידה מהפרויקט) ---
    // תחליפי את 'indexMusic' בשם ה-ID האמיתי שיש לך ב-HTML אם הוא שונה
    initMusic('indexMusic') || initMusic('bgMusic');

    // --- 2. הגדרת אלמנטים מה-HTML ---
    const list = document.getElementById('leaderboardBody') || document.getElementById('recordsList');
    const noScoresMessage = document.getElementById('noScoresMessage');
    const table = document.getElementById('highScoresTable');
    
    // --- 3. שליפת רשימת כל השחקנים מהזיכרון המקומי ---
    const players = JSON.parse(localStorage.getItem('allPlayers')) || [];
    
    // --- 4. בדיקה: אם אין שחקנים בזיכרון ---
    if (players.length === 0) {
        if (table) table.style.display = 'none';
        if (noScoresMessage) noScoresMessage.style.display = 'block';
    } else {
        // --- 5. מיון השחקנים מהגבוה לנמוך ---
        players.sort((a, b) => b.highScore - a.highScore);

        if (list) {
            list.innerHTML = ""; 

            // --- 6. בניית שורות הטבלה ---
            players.forEach((player, index) => {
                const row = document.createElement('tr');
                row.className = "record-row"; 

                const rankTd = document.createElement('td');
                const nameTd = document.createElement('td');
                const scoreTd = document.createElement('td');

                rankTd.className = "rank-cell";
                nameTd.className = "name-cell";
                scoreTd.className = "score-cell";

                // עיצוב שלושת המקומות הראשונים
                if (index === 0) rankTd.classList.add('gold');
                else if (index === 1) rankTd.classList.add('silver');
                else if (index === 2) rankTd.classList.add('bronze');

                rankTd.textContent = index + 1;
                nameTd.textContent = player.name;
                scoreTd.textContent = "שלב : " + player.highScore;

                row.appendChild(rankTd);
                row.appendChild(nameTd);
                row.appendChild(scoreTd);
                list.appendChild(row);
            });
        }
    }

    // --- 7. הגדרת כפתור חזרה לתפריט הראשי ---
    document.getElementById('backBtn')?.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
};

// הפעלת האתחול ברגע שהחלון מסיים להיטען
window.onload = initLeaderboard;