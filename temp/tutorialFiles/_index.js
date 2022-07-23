import browserObject from './browser.js';
import scraperController from './_pageController.js';

// Start browser instance
let browserInstance = browserObject.startBrowser();

scraperController(browserInstance);
