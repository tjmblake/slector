class Popup {
  state: State;
  selectionTypeMenu: HTMLElement | null;
  selectBtn: HTMLButtonElement | null;
  slectorsMenu: HTMLButtonElement | null;

  constructor() {
    this.state = {
      slectors: [],
      selectionTypes: [],
      selectionType: '',
    };

    this.selectionTypeMenu = document.querySelector('#selector-dropdown');
    this.selectBtn = document.querySelector('#select');

    this.slectorsMenu = document.querySelector('#slectorsMenu');

    this.setSelectListener();
    this.setselectionTypeMenuListener();
    this.sendInitMessage();
  }

  setSelectListener() {
    this.selectBtn?.addEventListener('click', this.sendSelectMessage.bind(this));
  }

  setselectionTypeMenuListener() {
    this.selectionTypeMenu?.addEventListener('change', this.sendSelectionTypeMessage.bind(this));
  }

  async sendInitMessage() {
    const res = await chrome.runtime.sendMessage({ head: 'init' });
    console.log('Init Response Recieved:');
    console.log(res);

    this.refresh();
  }

  async sendSelectMessage() {
    const res = await chrome.runtime.sendMessage({ head: 'select' });
    console.log('Select Script Launched');
    console.log(res);
  }

  async sendSelectionTypeMessage(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    const res = await chrome.runtime.sendMessage({ head: 'setSelectionType', body: value });

    this.refresh();
  }

  async sendDeleteSelectorMessage(e: Event) {
    const target = e.target as HTMLElement;

    const selectionKey = target.parentElement?.dataset.selectionKey;

    const res = await chrome.runtime.sendMessage({ head: 'deleteSelector', body: selectionKey });

    this.refresh();
  }

  async getState() {
    const res = await chrome.runtime.sendMessage({ head: 'getState' });
    this.state = res.body;
    return;
  }

  /** get the current state and refreshes the Popup UI */
  async refresh() {
    await this.getState();
    this.populateselectionTypeMenu();

    this.listSelectorQueries();
  }

  populateselectionTypeMenu() {
    if (this.selectionTypeMenu && this.state.selectionTypes)
      this.selectionTypeMenu.innerHTML = this.state.selectionTypes
        .map(
          (el) =>
            `<option value="${el}" ${this.state.selectionType === el ? 'selected="selected"' : ''}>${el}</option>`,
        )
        .join('');
  }

  /** Used to show queries for each selector.
   * Each query has 1 menu, containing an edit and delete btn.
   */
  listSelectorQueries() {
    const slectorsMenuMarkup = this.state.slectors
      .filter((slector) => slector.selectionType === this.state.selectionType)
      .map((slector, i) => {
        return `<div class='' data-selection-key='${slector.selectionKey}'>${slector.data[0].localName}<button class='editSelector'>Edit</button><button class='deleteSelector'>Delete</button></div>`;
      });

    if (this.slectorsMenu) this.slectorsMenu.innerHTML = slectorsMenuMarkup.join('');

    this.addSelectorQueryListeners();
  }

  addSelectorQueryListeners() {
    const deleteBtns = document.querySelectorAll('.deleteSelector') as unknown as HTMLButtonElement[];

    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', this.sendDeleteSelectorMessage.bind(this));
    });
  }
}

new Popup();
