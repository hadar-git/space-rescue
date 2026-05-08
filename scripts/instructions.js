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
};
document.addEventListener('DOMContentLoaded', initInstructionsPage);
