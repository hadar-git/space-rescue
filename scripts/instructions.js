/**
 * @fileoverview scripts/instructions.js - ניהול דף ההוראות
 * @author Hadar
 */

window.onload = () => {
    const bgMusic = document.getElementById('indexMusic');
    const backBtn = document.getElementById('backBtn');

    /**
     * ניהול מוזיקה בדף ההוראות
     */
    if (bgMusic) {
        bgMusic.play().catch(() => {
            // האזנה ללחיצה ראשונה אם האוטופליי נחסם
            window.addEventListener('mousedown', () => {
                bgMusic.play();
            }, { once: true });
        });
    }

    /**
     * חזרה לתפריט הראשי
     */
    backBtn?.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
};