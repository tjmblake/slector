import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import url from 'url';

import { options } from './index';

const __filename = url.fileURLToPath(import.meta.url);

export default class BrowserInstance {
  browser: puppeteer.Browser | undefined;
  options: options;

  constructor(options: options) {
    this.options = options;
    this.init();
  }

  async init() {
    // Create Browser && Loads Extension
    this.browser = await this.createBrowser();
    // Enables extension. Opens Dev Console if required.
    await this.setupDevBrowser();
  }

  async createBrowser(): Promise<puppeteer.Browser> {
    const extPath = path.join(path.dirname(fs.realpathSync(__filename)), '/ext/');

    console.log(`Looking for extension at... \n${extPath}`);

    console.log('Opening the browser...');

    const browser: puppeteer.Browser = await puppeteer.launch({
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

    const extPage: puppeteer.Page = await this.browser.newPage();
    await extPage.goto('chrome://extensions', { waitUntil: 'load' });
    await extPage.waitForTimeout(4000);

    // Turn on Dev Mode
    const devBtn = (
      await extPage.evaluateHandle(
        'document.querySelector("body > extensions-manager").shadowRoot.querySelector("extensions-toolbar").shadowRoot.querySelector("#devMode")',
      )
    ).asElement();

    if (devBtn) devBtn.click();

    // Open Dev Console
    if (this.options.showExtConsole) {
      const workerBtn = await extPage.waitForSelector('pierce/a.clippable-flex-text', {
        visible: true,
      });
      if (workerBtn) await workerBtn.click();
    }
  }
}
