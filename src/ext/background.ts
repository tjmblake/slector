class Background {
  state: State;

  constructor() {
    this.state = {
      slectors: [],
      collectionTypes: [],
      activeCollection: 0,
    };
    this.initMessageHandler();
  }

  initMessageHandler() {
    console.log('Initialising Message Handler...');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleRequest(message).then(sendResponse);
      return true;
    });
  }

  async handleRequest(request: { head: string; body: string | [] }) {
    if (request.head === 'init') {
      const res = await this.getLocalStorage();
      if (res?.body) {
        this.state.collectionTypes = res.body;
        this.state.activeCollection = 0;

        return { head: 'init', data: 'Stored Collection Schema!' };
      }
      return { head: 'error', body: 'No data found to init from.' };
    }

    // Req from popup to inject select script
    if (request.head === 'select') {
      this.injectSelectScript();
      return { head: 'select', data: 'Injected!' };
    }

    // Message from CS with selection data to store
    if (request.head === 'newSelection') {
      console.log(request.body);

      if (typeof request.body === 'object')
        this.state.slectors.push({ collection: this.state.activeCollection, data: request.body });

      return { head: 'newSelection', body: this.state };
    }

    // Message from Popup to set current selection type from dropdown.
    if (request.head === 'setCollectionType') {
      this.state.activeCollection = this.state.collectionTypes.findIndex((el) => el === request.body);
      return { head: 'setCollectionType', body: this.state };
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
        files: ['./content/getLocalStorage.js'],
      });

      const res = (await chrome.tabs.sendMessage(tab.id, {
        head: 'getLocalStorage',
      })) as unknown as { head: string; body: string[] };

      return res;
    }
  }

  async injectSelectScript() {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab && typeof tab.id === 'number') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['./content/select.js'],
      });
    }
  }
}

new Background();
