class Background {
  collectionSchema: string[] | undefined;

  constructor() {
    console.log('Constructing Background...');
    this.initMessageHandler();
  }

  initMessageHandler() {
    console.log('Initialising Message Handler...');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message);
      this.handleRequest(message).then(sendResponse);
      return true;
    });
  }

  async handleRequest(message: { head: string; message: string }) {
    if (message.head === 'init') {
      console.log('Initialising...');
      const res = await this.getLocalStorage();
      return { head: 'init', message: res };
    }
  }

  async getLocalStorage() {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab && typeof tab.id === 'number') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['getLocalStorage.js'],
      });

      const res = await chrome.tabs.sendMessage(tab.id, {
        head: 'getLocalStorage',
      });
      console.log(res);
      return res;
    }
  }
}

new Background();
