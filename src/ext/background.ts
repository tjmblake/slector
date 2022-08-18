class Background {
  state: State;
  selectionKey = 0;

  constructor() {
    this.state = {
      slectors: [],
      selectionTypes: [],
      selectionType: '',
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
        this.state.selectionTypes = res.body;
        this.state.selectionType = this.state.selectionTypes[0];

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
      if (typeof request.body === 'object') {
        this.state.slectors.push({
          selectionKey: this.selectionKey,
          selectionType: this.state.selectionType,
          data: request.body,
        });
        this.selectionKey = this.selectionKey++;
      }

      return { head: 'newSelection', body: this.state };
    }

    if (request.head === 'deleteSelector') {
      this.state.slectors = this.state.slectors.filter((slector) => slector.selectionKey != Number(request.body));
      return { head: 'deletedSelector', body: this.state };
    }

    if (request.head === 'editSelector') {
      // Find Correct Value
      const [slector, layer, key] = request.body as number[];

      this.state.slectors[slector].data[layer].content[key].active = this.state.slectors[slector].data[layer].content[
        key
      ].active
        ? false
        : true;

      return { head: 'editedSelector', body: this.state };
    }

    // Message from Popup to set current selection type from dropdown.
    if (request.head === 'setSelectionType' && typeof request.body === 'string') {
      this.state.selectionType = request.body;
      return { head: 'setSelectionType', body: this.state };
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
