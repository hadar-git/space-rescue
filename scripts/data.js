/**
 * @fileoverview ניהול זיכרון המשחק ושמירת שיאים ב-LocalStorage
 * @author Hadar
 */

/**
 * פונקציית עזר פרטית לשליפת רשימת כל השחקנים מה-LocalStorage.
 * @returns {Array} מערך של אובייקטי שחקנים.
 */
const getAllPlayers = () => JSON.parse(localStorage.getItem('allPlayers')) || [];

/**
 * שליפת נתוני שחקן ספציפי מתוך רשימת השחקנים ב-LocalStorage
 * @param {string} playerName - שם השחקן לחיפוש
 * @returns {Object|null} אובייקט נתוני השחקן או null אם לא נמצא
 */

 const getPlayerData = (playerName) => {
 // שליפת רשימת כל השחקנים בעזרת פונקציית העזר
    const allPlayers = getAllPlayers();
// חיפוש השחקן הספציפי במערך לפי השם
    const player = allPlayers.find(p => p.name === playerName);
    // אם נמצא שחקן מחזירים את האוביקט שלו 
    if (player) return { name: player.name, level: player.highScore };
    return null;
};


/**
 * עדכון התקדמות השחקן ושמירה בזיכרון המקומי.
 * הפונקציה בודקת אם השחקן קיים: אם כן, היא מעדכנת את שיאו במידת הצורך.
 * אם לא, היא יוצרת עבורו רשומה חדשה.
 * @param {string} playerName - שם השחקן לעדכון.
 * @param {number} newLevel - השלב החדש אליו הגיע השחקן.
 */
 const updatePlayerProgress = (playerName, newLevel) => {
    
    let allPlayers=getAllPlayers();
    let player =allPlayers.find(p => p.name === playerName);
    if (player) {
        // אם השחקן קיים: נעדכן את השיא רק אם השלב החדש גבוה יותר מהקיים
        if (newLevel > player.highScore) {
            player.highScore = newLevel;
        }
        // עדכון תאריך משחק אחרון
        player.lastPlayed = new Date().toLocaleDateString();
    } else {
        // אם זה שחקן חדש: ניצור אובייקט חדש ונוסיף אותו למערך
        allPlayers.push({
            name: playerName,
            highScore: newLevel,
            lastPlayed: new Date().toLocaleDateString()
        });
    }

    // שמירה של כל המערך המעודכן חזרה ל-LocalStorage תחת מפתח יחיד
    //וגם ממירים לסטרינג 
      // המרת הנתונים מסטרינג למערך אובייקטים. אם אין נתונים, נשתמש במערך ריק.
    localStorage.setItem('allPlayers', JSON.stringify(allPlayers));
};

// חשיפת פונקציית ניקוי לחלונית הקונסול בלבד
// פשוט כותבים את שם הפונקציה עם () בקונסול וזה מוחק הכל 
window.resetGameData = () => {
    localStorage.clear();
    console.log("הנתונים נמחקו! מרענן את הדף...");
    location.reload();
};

export{getPlayerData, updatePlayerProgress, getAllPlayers};




    










