import BrowserInstance from './browser.js';

export interface options {
  /** Should the Chrome Console open for the extension? */
  showExtConsole?: boolean;
  collectionTypes: string[];
  /**The URL the browser will open. */
  startUrl: string;
}

export default class Slector {
  options: options;

  constructor(options: options) {
    console.log('New Slector');
    this.options = options;
  }

  async slect(): Promise<object> {
    const data = await new BrowserInstance(this.options).collectData();

    return data;
  }
}
