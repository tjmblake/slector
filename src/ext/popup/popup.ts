import * as Message from './_messages.js';
import * as Markup from './_markup.js';

class Popup {
  state: State;
  /** Key of Slector curently being edited. */
  activeKey: number | null;
  selectionTypeMenu: HTMLElement | null;
  selectBtn: HTMLButtonElement | null;
  slectorsMenu: HTMLButtonElement | null;
  editMenu: HTMLElement | null;
  doneBtn: HTMLButtonElement | null;

  constructor() {
    this.state = {
      slectors: [],
      slectorTypes: [],
      slectorType: '',
    };

    this.activeKey = null;

    this.selectionTypeMenu = document.querySelector('#nav__types');
    this.selectBtn = document.querySelector('#select');
    this.doneBtn = document.querySelector('#done');
    this.slectorsMenu = document.querySelector('#slectorsMenu');
    this.editMenu = document.querySelector('#edit-slector');

    // Adding Listeners
    this.selectBtn?.addEventListener('click', Message.sendSelectMessage);
    this.selectionTypeMenu?.addEventListener('change', this.changeSelectionTypeHandler.bind(this));
    this.doneBtn?.addEventListener('click', Message.sendDoneMessage);

    this.init();
  }

  async init() {
    await Message.sendInitMessage();
    this.refresh();
  }

  async changeSelectionTypeHandler(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    await Message.sendSelectionTypeMessage(value);
    this.activeKey = null;
    this.refresh();
  }

  async deleteBtnHandler(e: Event) {
    let target = e.target as HTMLElement;

    if (target.classList.contains('btn__icon') && target.parentElement) target = target.parentElement;

    const selectionKey = target.parentElement?.dataset.selectionKey;
    if (selectionKey) await Message.sendDeleteSelectorMessage(selectionKey);
    this.refresh();
  }

  async getState() {
    const res = await chrome.runtime.sendMessage({ head: 'getState' });
    this.state = res.body;
  }

  /** Get the current state and refreshes the Popup UI */
  async refresh() {
    await this.getState();
    console.log(this.state);
    // Render Selection Type Menu
    if (this.selectionTypeMenu && this.state.slectorTypes)
      this.selectionTypeMenu.innerHTML = Markup.selectionTypes(this.state.slectorTypes, this.state.slectorType);

    // Render Selections List of Active Selection Type
    if (this.slectorsMenu)
      this.slectorsMenu.innerHTML = Markup.listSelectors(this.state.slectors, this.state.slectorType);

    this.addSelectorListeners();

    this.renderEditMenu();
    this.addEditListeners();
  }

  addSelectorListeners() {
    const deleteBtns = document.querySelectorAll('.slector__delete') as unknown as HTMLButtonElement[];
    const editBtns = document.querySelectorAll('.slector__edit') as unknown as HTMLButtonElement[];

    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', this.deleteBtnHandler.bind(this));
    });

    editBtns.forEach((btn) => {
      btn.addEventListener('click', this.setActiveKey.bind(this));
    });
  }

  setActiveKey(e: Event) {
    let target = e.target as HTMLElement;

    if (target.classList.contains('btn__icon') && target.parentElement) target = target.parentElement;

    const key = target.parentElement?.dataset.selectionKey;
    this.activeKey = Number(key);
    this.refresh();
  }

  renderEditMenu() {
    const activeEdit = this.state.slectors.find((el) => el.key === this.activeKey);

    if (!this.editMenu) return;

    if (activeEdit) this.editMenu.innerHTML = Markup.editTableMarkup(activeEdit);
    else this.editMenu.innerHTML = '';
  }

  addEditListeners() {
    const tdata = document.querySelectorAll('.cell') as unknown as HTMLElement[];

    tdata.forEach((el) => el.addEventListener('click', this.handleEditClick.bind(this)));
  }

  async handleEditClick(e: Event) {
    const target = e.target as HTMLElement;
    const key = target.dataset.key;
    const layer = target.dataset.layer;

    // Send signal flipping 'active'
    await chrome.runtime.sendMessage({ head: 'editSelector', body: [this.activeKey, layer, key] });
    this.refresh();
  }
}

new Popup();
