class Popup {
  state: State;
  initBtn: HTMLButtonElement | null;
  selectorDropdown: HTMLElement | null;
  constructor() {
    this.state = {};
    this.initBtn = document.querySelector('#init');
    this.selectorDropdown = document.querySelector('#selector-dropdown');

    this.setInitListener();
  }

  setInitListener() {
    this.initBtn?.addEventListener('click', this.sendInitMessage.bind(this));
  }

  async sendInitMessage() {
    const res = await chrome.runtime.sendMessage({ head: 'init' });
    console.log('Init Response Recieved:');
    console.log(res);

    // Begin UI Refresh with Data
    this.refresh();
  }

  async getState() {
    const res = await chrome.runtime.sendMessage({ head: 'getState' });
    console.log('Got State:');
    console.log(res.body);
    this.state = res.body;
    return;
  }

  /** get the current state and refreshes the Popup UI */
  async refresh() {
    await this.getState();
    this.populateSelectorDropdown();
  }

  populateSelectorDropdown() {
    if (this.selectorDropdown && this.state.collectionSchema)
      this.selectorDropdown.innerHTML = this.state.collectionSchema
        .map((el) => `<option value="${el}">${el}</option>`)
        .join('');
  }
}

new Popup();
