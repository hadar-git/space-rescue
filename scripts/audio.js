/**
 * @fileoverview ניהול השמעת מוזיקת רקע במשחק
 * @author Hadar
 */

/**
 * מפעיל מוזיקת רקע לפי מזהה אלמנט, עם טיפול בחסימות דפדפן
 * @param {string} audioId - ה-ID של אלמנט ה-audio ב-HTML
 */
export const initMusic = (audioId) => {
    const music = document.getElementById(audioId);
    if (!music) return;

    const startPlaying = () => {
        music.play().catch(() => {
            // אם הדפדפן חוסם אוטופליי, נמתין לאינטראקציה ראשונה
            window.addEventListener('click', () => music.play(), { once: true });
        });
    };

    startPlaying();
};