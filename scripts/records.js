/**
 * @fileoverview ניהול דף השיאים - יצירה דינמית
 * @author Hadar
 */

const initLeaderboard = () => {
    const list = document.getElementById('leaderboardBody') || document.getElementById('recordsList');
    const noScoresMessage = document.getElementById('noScoresMessage');
    const table = document.getElementById('highScoresTable');
    
    // שליפת נתונים
    const players = JSON.parse(localStorage.getItem('allPlayers')) || [];

    if (players.length === 0) {
        if (table) table.style.display = 'none';
        if (noScoresMessage) noScoresMessage.style.display = 'block';
        return;
    }

    // מיון מהגבוה לנמוך
    players.sort((a, b) => b.highScore - a.highScore);

    if (list) {
        list.innerHTML = ""; 

        players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.className = "record-row"; // קלאס למרווחים ב-CSS

            const rankTd = document.createElement('td');
            const nameTd = document.createElement('td');
            const scoreTd = document.createElement('td');

            // הוספת קלאסים לעיצוב
            rankTd.className = "rank-cell";
            nameTd.className = "name-cell";
            scoreTd.className = "score-cell";

            if (index === 0) rankTd.classList.add('gold');
            else if (index === 1) rankTd.classList.add('silver');
            else if (index === 2) rankTd.classList.add('bronze');

            // הכנסת הטקסט עם רווחים מובנים
            rankTd.textContent = index + 1;
            nameTd.textContent = player.name;
            // שימי לב לרווחים כאן בתוך המחרוזת:
            scoreTd.textContent = "שלב : " + player.highScore; 

            row.appendChild(rankTd);
            row.appendChild(nameTd);
            row.appendChild(scoreTd);
            list.appendChild(row);
        });
    }

    // כפתור חזרה
    document.getElementById('backBtn')?.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
};

window.onload = initLeaderboard;