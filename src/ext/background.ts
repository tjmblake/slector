import * as Injector from './_injector.js';

class Background {
  state: State;
  activeSlectorKey = 0;

  constructor() {
    this.state = {
      slectors: [],
      slectorTypes: [],
      slectorType: '',
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
      const res = await Injector.getLocalStorage();
      if (res?.body) {
        this.state.slectorTypes = res.body;
        this.state.slectorType = this.state.slectorTypes[0];

        return { head: 'init', data: 'Stored Collection Schema!' };
      }
      return { head: 'error', body: 'No data found to init from.' };
    }

    // Req from popup to inject select script
    if (request.head === 'select') {
      await Injector.injectSelectScript();
      return { head: 'select', data: 'Injected!' };
    }

    // Message from CS with selection data to store
    if (request.head === 'newSelection') {
      if (typeof request.body === 'object') {
        this.state.slectors.push({
          key: this.activeSlectorKey,
          type: this.state.slectorType,
          data: request.body,
        });
        this.activeSlectorKey = this.activeSlectorKey++;
      }

      return { head: 'newSelection', body: this.state };
    }

    if (request.head === 'deleteSelector') {
      this.state.slectors = this.state.slectors.filter((slector) => slector.key != Number(request.body));
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
    if (request.head === 'setSlectorType' && typeof request.body === 'string') {
      this.state.slectorType = request.body;
      return { head: 'setSlectorType', body: this.state };
    }

    if (request.head === 'getState') {
      return { head: 'getState', body: this.state };
    }

    return { head: 'error', body: 'Request not handled' };
  }
}

new Background();
