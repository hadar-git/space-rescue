

/**
 * @fileoverview ניהול השמעת מוזיקת רקע במשחק
 * @author Hadar
 */

/**
 * מפעיל מוזיקת רקע לפי מזהה אלמנט, עם טיפול בחסימות דפדפן
 * @param {string} audioId - ה-ID של אלמנט ה-audio ב-HTML
 */
 const initMusic = (audioId) => {

    const music = document.getElementById(audioId);
   
    if (!music) return false;

    const startPlaying = () => {
        //מפעילים את המוזיקה אבל לא תמיד הדפדפן נותן את האפשרות הזו לכן יש את CATCH שתפעיל אותו
        music.play().catch(() => {
            // אם הדפדפן חוסם אוטופליי אז המוזיקה מתחילה  כשלוחצים על משהו במסך לאו דווקא כפתור ואז המוזיקה תפעל 
            //המאזין פועל רק פעם אחת ולא בכל לחיצה על המסך רק בראשונה
            window.addEventListener('click', () => music.play(), { once: true });
        });

    };
    startPlaying();
        return true;
};

 const playDefaultTheme = () => {
    return initMusic('bgMusic') || initMusic('indexMusic');
};

export {playDefaultTheme, initMusic}