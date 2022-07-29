class Popup {
  state: State;
  initBtn: HTMLButtonElement | null;
  collectionTypeMenu: HTMLElement | null;
  selectBtn: HTMLButtonElement | null;
  slectorsMenu: HTMLButtonElement | null;

  constructor() {
    this.state = {
      slectors: [],
      collectionTypes: [],
      activeCollection: 0,
    };

    this.initBtn = document.querySelector('#init');
    this.collectionTypeMenu = document.querySelector('#selector-dropdown');
    this.selectBtn = document.querySelector('#select');

    this.slectorsMenu = document.querySelector('#slectorsMenu');
    this.setInitListener();
    this.setSelectListener();
    this.setCollectionTypeMenuListener();
  }

  setInitListener() {
    this.initBtn?.addEventListener('click', this.sendInitMessage.bind(this));
  }

  setSelectListener() {
    this.selectBtn?.addEventListener('click', this.sendSelectMessage.bind(this));
  }

  setCollectionTypeMenuListener() {
    this.collectionTypeMenu?.addEventListener('change', this.sendCollectionTypeMessage.bind(this));
  }

  async sendInitMessage() {
    const res = await chrome.runtime.sendMessage({ head: 'init' });
    console.log('Init Response Recieved:');
    console.log(res);

    // Begin UI Refresh with Data
    this.refresh();
  }

  async sendSelectMessage() {
    const res = await chrome.runtime.sendMessage({ head: 'select' });
    console.log('Select Script Launched');
    console.log(res);
  }

  async sendCollectionTypeMessage(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    const res = await chrome.runtime.sendMessage({ head: 'setCollectionType', body: value });
    console.log('Collection Type Updated');
    console.log(res);
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
    this.populateCollectionTypeMenu();

    this.listSelectorQueries();
  }

  populateCollectionTypeMenu() {
    if (this.collectionTypeMenu && this.state.collectionTypes)
      this.collectionTypeMenu.innerHTML = this.state.collectionTypes
        .map((el) => `<option value="${el}">${el}</option>`)
        .join('');
  }

  /** Used to show queries for each selector.
   * Each query has 1 menu, containing an edit and delete btn.
   */
  listSelectorQueries() {
    const slectorsMenuMarkup = this.state.slectors
      .filter((slector) => slector.collection === this.state.activeCollection)
      .map((slector, i) => {
        return `<div class='' data-query-index='${i}'>${slector.data[0].localName}<button class='editQuery'>Edit</button><button class='deleteQuery'>Delete</button></div>`;
      });

    this.slectorsMenu?.insertAdjacentHTML('beforeend', slectorsMenuMarkup.join(''));
  }
}

new Popup();
