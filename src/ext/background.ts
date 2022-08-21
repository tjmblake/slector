import * as Injector from './_injector.js';
import * as Query from './_query.js';

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
      if (this.state.slectorTypes.length === 0) {
        const res = await Injector.getLocalStorage();

        if (res?.body) {
          this.state.slectorTypes = res.body;
          this.state.slectorType = this.state.slectorTypes[0];
        }
      }
      return { head: 'init', data: 'Init' };
    }

    if (request.head === 'done') {
      await Injector.setLocalStorage(this.state);
    }

    // Req from popup to inject select script
    if (request.head === 'select') {
      await Injector.injectSelectScript();
      return { head: 'select', data: 'Injected!' };
    }

    // Message from CS with selection data to store
    if (request.head === 'newSelection') {
      if (typeof request.body === 'object') {
        const slector = {
          key: this.activeSlectorKey,
          type: this.state.slectorType,
          data: request.body,
          query: '',
        };
        this.activeSlectorKey = this.activeSlectorKey + 1;

        slector.query = Query.createQuery(slector);
        this.state.slectors.push(slector);
      }

      await Injector.injectHighlightScript(this.state);

      return { head: 'newSelection', body: this.state };
    }

    if (request.head === 'deleteSelector') {
      this.state.slectors = this.state.slectors.filter((slector) => slector.key != Number(request.body));
      await Injector.injectHighlightScript(this.state);

      return { head: 'deletedSelector', body: this.state };
    }

    if (request.head === 'editSelector') {
      // Find Correct Value
      const [slectorKey, layer, key] = request.body as number[];

      const slectorIndex = this.state.slectors.findIndex((el) => el.key === slectorKey);

      this.state.slectors[slectorIndex].data[layer].content[key].active = this.state.slectors[slectorIndex].data[layer]
        .content[key].active
        ? false
        : true;

      this.state.slectors[slectorIndex].query = Query.createQuery(this.state.slectors[slectorIndex]);

      await Injector.injectHighlightScript(this.state);

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
