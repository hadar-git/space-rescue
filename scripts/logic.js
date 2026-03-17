/**
 * @fileoverview 
 * @author Hadar
 */

// הגרלת מספר (דרישה 7)
 const randomSecretCode = (length = 3) => {
    const code = [];
    for (let i = 0; i < length; i++) {
        code.push(Math.floor(Math.random() * 10)); // מספרים 0-9
    }
    return code;
};

// בדיקת הניחוש מול הקוד (שימוש בפונקציות מערכים - דרישה 9, 11)

 const checkGuess = (secretCode, userGuess) => {
    let bulls = 0;
    let cows = 0;

    // עותקים של המערכים כדי לא להרוס את המקור
    let tempSecret = [...secretCode];
    let tempGuess = [...userGuess];

    // שלב 1: בדיקת בולים (מיקום מדויק)
    tempGuess.forEach((num, i) => {
        if (num === tempSecret[i]) {
            bulls++;
            tempSecret[i] = null; // "שורפים" את המספר מהקוד הסודי
            tempGuess[i] = "used"; // מסמנים שהניחוש הזה כבר טופל
        }
    });

    // שלב 2: בדיקת פגיעות (רק על מה שנשאר)
    tempGuess.forEach((num, i) => {
        if (num !== "used") {
            const foundIndex = tempSecret.indexOf(num);
            if (foundIndex !== -1) {
                cows++;
                tempSecret[foundIndex] = null; // שורפים כדי לא לספור פעמיים
            }
        }
    });

    return { bulls, cows };
};
export{ randomSecretCode,checkGuess, }