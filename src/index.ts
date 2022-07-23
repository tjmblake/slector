import BrowserInstance from './browser.js';

export interface options {
  /** Should the Chrome Console open for the extension? */
  showExtConsole?: boolean;
}

export default class Slector {
  options: options;

  constructor(options: options) {
    console.log('New Slector');
    this.options = options;
    this.init();
  }

  async init(): Promise<void> {
    await new BrowserInstance(this.options);
  }
}
