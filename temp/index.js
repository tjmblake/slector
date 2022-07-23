import { startBrowser } from "./tutorialFiles/browser.js";
import PageScraper from "../pageScraper.js";

// Start browser instance
let browserInstance = startBrowser();

export default () => PageScraper(browserInstance);
