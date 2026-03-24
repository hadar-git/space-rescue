/**
 * @fileoverview ניהול זיכרון המשחק ושמירת שיאים ב-LocalStorage
 * @author Hadar
 */

/**
 * שליפת נתוני שחקן ספציפי מתוך רשימת השחקנים ב-LocalStorage
 * @param {string} playerName - שם השחקן לחיפוש
 * @returns {Object|null} אובייקט נתוני השחקן או null אם לא נמצא
 */
 const getPlayerData = (playerName) => {
    // שליפת רשימת כל השחקנים והמרת הטקסט חזרה למערך
    const allPlayers = JSON.parse(localStorage.getItem('allPlayers')) || [];
    // חיפוש השחקן הספציפי בתוך המערך
    const player = allPlayers.find(p => p.name === playerName);
    if (player) return { name: player.name, level: player.highScore };
    return null;
};



/**
 * עדכון התקדמות השחקן ושמירה בזיכרון המקומי
 * הפונקציה בודקת אם השלב הנוכחי גבוה מהשיא הקיים ומעדכנת בהתאם.
 * @param {string} playerName - שם השחקן
 * @param {number} newLevel - השלב אליו השחקן הגיע כעת
 */
 const updatePlayerProgress = (playerName, newLevel) => {
    // ניסיון לשלוף נתונים קיימים או יצירת אובייקט חדש אם זה שחקן חדש
    const statsKey = `stats_${playerName}`;
    let userStats = JSON.parse(localStorage.getItem(statsKey)) || { 
        name: playerName, 
        highScore: 1, 
        lastPlayed: new Date().toLocaleDateString() 
    };
// עדכון השיא רק אם השלב החדש גבוה יותר מהשיא הישן
    if (newLevel > userStats.highScore) {
        userStats.highScore = newLevel;
    }
// שמירת הנתונים המעודכנים כטקסט (JSON.stringify) בתוך המפתח של השחקן
    localStorage.setItem(statsKey, JSON.stringify(userStats));
    
// עדכון הרשימה הכללית של כל השחקנים (לטובת לוח תוצאות עתידי)
    updateAllUsersList(userStats);
};


/**
 * עדכון הרשימה הכללית של כל השחקנים ב-LocalStorage לצורך הצגה בטבלת שיאים
 * @param {Object} userStats - אובייקט הנתונים המעודכן של השחקן
 */
const updateAllUsersList = (userStats) => {
    
// שליפת הרשימה הקיימת
    let allPlayers = JSON.parse(localStorage.getItem('allPlayers')) || [];
    // בדיקה אם השחקן כבר קיים ברשימה הכללית
    const existingIndex = allPlayers.findIndex(p => p.name === userStats.name);
    
    if (existingIndex !== -1) {
        
// אם קיים - נעדכן את הנתונים שלו במיקום שנמצא
        allPlayers[existingIndex] = userStats;
    } else {
    // אם חדש - נוסיף אותו לסוף המערך
        allPlayers.push(userStats);
    }
    // שמירת הרשימה המעודכנת כולה חזרה ל-LocalStorage
    localStorage.setItem('allPlayers', JSON.stringify(allPlayers));
};

export{getPlayerData,updatePlayerProgress};




    










