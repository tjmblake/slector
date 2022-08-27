import BrowserInstance from './browser.js';

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
