import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import url from 'url';

import { options } from './index';

const __filename = url.fileURLToPath(import.meta.url);

export default class BrowserInstance {
  browser: puppeteer.Browser | undefined;
  options: options;

  /** The 'Extensions' page that is opened on load. */
  extPage: puppeteer.Page | undefined;

  constructor(options: options) {
    this.options = options;
    this.init();
  }

  async init() {
    // Create Browser && Loads Extension
    this.browser = await this.createBrowser();
    // Enables extension. Opens Dev Console if required.
    await this.setupDevBrowser();

    await this.storeCollectionSchema();
  }

  async createBrowser(): Promise<puppeteer.Browser> {
    const extPath = path.join(path.dirname(fs.realpathSync(__filename)), '/ext/');

    console.log(`Looking for extension at... \n${extPath}`);

    console.log('Opening the browser...');

    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--disable-setuid-sandbox', `--load-extension=${extPath}`, `--disable-extensions-except=${extPath}`],
      ignoreHTTPSErrors: true,
    });

    return browser;
  }

  async setupDevBrowser() {
    if (!this.browser) {
      console.error('Browser not available! --setupBrowser');
      return;
    }

    this.extPage = await this.browser.newPage();
    await this.extPage.goto('chrome://extensions', { waitUntil: 'load' });
    await this.extPage.waitForTimeout(3000);

    // Turn on Dev Mode
    const devBtn = (
      await this.extPage.evaluateHandle(
        'document.querySelector("body > extensions-manager").shadowRoot.querySelector("extensions-toolbar").shadowRoot.querySelector("#devMode")',
      )
    ).asElement();

    if (devBtn) await devBtn.click();
    await this.extPage.waitForTimeout(2000);

    // Open Dev Console
    if (this.options.showExtConsole) {
      const workerBtn = await this.extPage.waitForSelector('pierce/a.clippable-flex-text', {
        visible: true,
      });
      if (workerBtn) await workerBtn.click();
      await this.extPage.waitForTimeout(1000);
    }
  }

  /** Stores data in localStorage
   * Note: localStorage is not accessible via chrome.storage.local.get
   * We send a content script from the extension into the page to access localStorage and then store that in chrome.storage.local.set
   */
  async storeCollectionSchema() {
    await this.extPage?.goto('https://www.google.com');

    await this.extPage?.evaluate((data) => {
      localStorage.setItem('collectionSchema', JSON.stringify(data));
    }, this.options.collectionSchema);

    console.log('storeCollectionSchema: Stored!');
  }
}
