/**
 * @fileoverview 
 * @author Hadar
 */


/**
 * יצירת מערך רנדומלי של ספרות 0 עד 9 של הקוד הסודי באורך שהתקבל
 * * @example
 * // returns [4, 0, 9, 2]
 * randomSecretCode(4);
 * * @param {number} length האורך המבוקש של הקוד
 * @returns {number[]}  (מערך רנדומלי של ספרות (שיכולות לחזור על עצמן
 */
 const randomSecretCode = (length) => {
    //מערך ריק של הקוד הרנדומלי שנבחר
    const code = [];
    for (let i = 0; i < length; i++) {
        code.push(Math.floor(Math.random() * 10)); // מספרים 0-9
    }
    return code;
};

/**
 *משווה את הקוד של המשחקן לקוד המקורי ויש בול ופגיעה 
 * * בול= ספרה נכונה במקום הנכון
 * - פגיעה = ספרה נכונה אבל לא במקום הנכון
 * * @example
 * // If secret is [1, 2, 3, 4] and guess is [1, 4, 8, 9]
 * // returns { bulls: 1, cows: 1 }
 * checkGuess([1, 2, 3, 4], [1, 4, 8, 9]);
 * * @param {number[]} secretCode - הקוד הסודי
 * @param {number[]} userGuess - מערך הניחושים של השחקן
 * @returns {bulls: number, cows: number} "אובייקט שמכיל את כמות ה"פגיעות" וה"בולים
 */


 const checkGuess = (secretCode, userGuess) => {
    let bulls = 0; // מונה לספרות נכונות במקום הנכון
    let cows = 0; // מונה לספרות נכונות במקום הלא נכון

   // יצירת עותקים כדי לא לדרוס את המערכים המקוריים בזמן הבדיקה
    let tempSecret = [...secretCode];
    let tempGuess = [...userGuess];

    //לופ ראשון: זיהוי בולים
    tempGuess.forEach((num, i) => {
        if (num === tempSecret[i]) {
            bulls++;
            tempSecret[i] = null; // סימון כ"תפוס" כדי שלא ייספר כפגיעה
            tempGuess[i] = "used";
            
        }
    });

// לופ שני: זיהוי פגיעות
    tempGuess.forEach((num, i) => {
        if (num !== "used") {
            // בודקים על כל אחת מהספרות שנשארה במערך הניחושים אם היא נמצאת איפשהו בקוד 
            const foundIndex = tempSecret.indexOf(num);
            if (foundIndex !== -1) { // חוזר האינדקס אם נמצא
                cows++;
                tempSecret[foundIndex] = null; 
                tempGuess[i] = "used"
            }
        }
    });
//חוזר אוביקט עם התוצאות הסופיות
    return { bulls, cows };
};

export{ randomSecretCode,checkGuess, }
