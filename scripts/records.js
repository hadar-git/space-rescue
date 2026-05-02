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

   // עיצוב שלושת המקומות הראשונים
                // הוספת מחלקות עיצוב לפי המיקום (index): 0 הוא מקום ראשון, 1 שני וכו'.
                // זה מאפשר לך לצבוע ב-CSS את המקומות הראשונים בצבעי זהב, כסף וברונזה.
                if (index === 0) rankTd.classList.add('gold');
                else if (index === 1) rankTd.classList.add('silver');
                else if (index === 2) rankTd.classList.add('bronze');
// אבטחה: שימוש ב-textContent מבטיח שהטקסט יוצג כטקסט נקי בלבד.
                // זה מונע מצב שבו שחקן יקרא לעצמו בשם הכולל קוד זדוני שירוץ בדף.
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
 // שליפת אלמנטים: שימוש ב-|| מאפשר גמישות במידה ושם ה-ID ב-HTML ישתנה בעתיד.
    const list = document.getElementById('leaderboardBody') || document.getElementById('recordsList');
    const noScoresMessage = document.getElementById('noScoresMessage');
    const table = document.getElementById('highScoresTable');
    
    //  שליפת רשימת כל השחקנים מהזיכרון המקומי 
  //מדף DATA 
    const players = getAllPlayers();
    

// אם המערך ריק מסתירים את הטבלה ומציגים הודעה לשחקן
    if (players.length === 0) {
        if (table) table.style.display = 'none';
        if (noScoresMessage) noScoresMessage.style.display = 'block';
        return;
    }
   
        // מיון השחקנים מהגבוה לנמוך 
     
        players.sort((a, b) => b.highScore - a.highScore);


        // ייעול: שימוש ב-Fragment (בנייה בזיכרון במקום ב-DOM)
    const fragment = document.createDocumentFragment();
     if (list) {
        // ניקוי בטוח: כל עוד יש לטבלה ילד (שורה), אנחנו מסירים אותו
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    // הזרקת הנתונים החדשים
    players.forEach((player, index) => {
        fragment.appendChild(createRow(player, index));
    });

    list.appendChild(fragment);
}
}

// הפעלת האתחול: שימוש ב-DOMContentLoaded מבטיח שהקוד ירוץ רק אחרי שה-HTML נטען במלואו.

document.addEventListener('DOMContentLoaded', initLeaderboard)