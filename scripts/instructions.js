/**
 * @fileoverview scripts/instructions.js - ניהול דף ההוראות
 * @author Hadar
 */

import { initMusic,  playDefaultTheme } from './audio.js';

/**
 * פונקציית האתחול של דף ההוראות
 */
const initInstructionsPage = () => {

   playDefaultTheme();

    // const backBtn = document.getElementById('backBtn'); 
    // if (backBtn) {
    //     /**
    //      * הוספת אירוע לחיצה (Click) על כפתור החזרה
    //      */
    //     backBtn.addEventListener('click', () => {
    //      window.location.href = '/index.html';

    //     });
    // }
};
document.addEventListener('DOMContentLoaded', initInstructionsPage);
