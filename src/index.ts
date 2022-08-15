import BrowserInstance from './browser.js';

export interface options {
  /** Should the Chrome Console open for the extension? */
  showExtConsole?: boolean;
  collectionTypes: string[];
}

export default class Slector {
  options: options;

  constructor(options: options) {
    console.log('New Slector');
    this.options = options;
  }

  async slect(): Promise<void> {
    new BrowserInstance(this.options);
  }
}
