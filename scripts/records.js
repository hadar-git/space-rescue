/**
 * @fileoverview ניהול דף השיאים - יצירה דינמית של טבלת המצטיינים ומוזיקת רקע
 * @author Hadar
 */

import { initMusic,  playDefaultTheme } from './audio.js';
import { getAllPlayers } from './data.js';


/**
 * מייצרת אלמנט שורה (tr) עבור שחקן בודד
 */
        const createRow=(player, index)=>{

             const row = document.createElement('tr');
             row.className = "record-row";
             const rankTd = document.createElement('td');
             const nameTd = document.createElement('td');
             const scoreTd = document.createElement('td');

                if (index === 0) rankTd.classList.add('gold');
                else if (index === 1) rankTd.classList.add('silver');
                else if (index === 2) rankTd.classList.add('bronze');

                rankTd.textContent = index + 1;
                rankTd.classList.add('rank-cell');
                nameTd.textContent = player.name;
                scoreTd.textContent = "שלב : " + player.highScore;

        row.append(rankTd, nameTd, scoreTd);
        return row;
        }


/**
 * פונקציה המופעלת בטעינת העמוד: מושכת נתונים מה-LocalStorage ובונה את הטבלה
 */
const initLeaderboard = () => {

    playDefaultTheme();
    const list = document.getElementById('leaderboardBody') || document.getElementById('recordsList');
    const noScoresMessage = document.getElementById('noScoresMessage');
    const table = document.getElementById('highScoresTable');
    
    const players = getAllPlayers();
    
    if (players.length === 0) {
        if (table) table.style.display = 'none';
        if (noScoresMessage) noScoresMessage.style.display = 'block';
        return;
    }

        players.sort((a, b) => b.highScore - a.highScore);

    const fragment = document.createDocumentFragment();
     if (list) {

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }


    players.forEach((player, index) => {
        fragment.appendChild(createRow(player, index));
    });

    list.appendChild(fragment);
}

}
document.addEventListener('DOMContentLoaded', initLeaderboard)