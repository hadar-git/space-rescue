

/**
 * @fileoverview ניהול השמעת מוזיקת רקע במשחק
 * @author Hadar
 */

/**
 * מפעיל מוזיקת רקע לפי מזהה אלמנט, עם טיפול בחסימות דפדפן
 * @param {string} audioId - ה-ID של אלמנט ה-audio ב-HTML
 */
export const initMusic = (audioId) => {
   // שליפת האודיו המתאים מהdom לפי הID שקיבלתי
    const music = document.getElementById(audioId);
    //אם לא התקבל כלום  בדיקה כדי למנוע שגיאות 
    if (!music) return;
// אם כן 
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