class Background {
  state: State;

  constructor() {
    this.state = {};
    this.initMessageHandler();
  }

  initMessageHandler() {
    console.log('Initialising Message Handler...');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleRequest(message).then(sendResponse);
      return true;
    });
  }

  async handleRequest(request: { head: string; body: string }) {
    if (request.head === 'init') {
      const res = await this.getLocalStorage();
      if (res?.body) {
        this.state.collectionSchema = res.body;
        return { head: 'init', data: 'Stored Collection Schema!' };
      }
      return { head: 'error', body: 'No data found to init from.' };
    }

    if (request.head === 'getState') {
      return { head: 'getState', body: this.state };
    }

    return { head: 'error', body: 'Request not handled' };
  }

  async getLocalStorage() {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab && typeof tab.id === 'number') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['getLocalStorage.js'],
      });

      const res = (await chrome.tabs.sendMessage(tab.id, {
        head: 'getLocalStorage',
      })) as unknown as { head: string; body: string[] };

      return res;
    }
  }
}

new Background();
