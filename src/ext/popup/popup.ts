import * as Message from './_messages.js';
import * as Markup from './_markup.js';
import * as Listen from './_listen.js';

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

    this.refresh();
  }

  async changeSelectionTypeHandler(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    await Message.sendSetSelectionType(value);
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
    const message: GetStateMessage = { head: 'GET_STATE' };
    const res = await chrome.runtime.sendMessage(message);
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
      this.slectorsMenu.innerHTML = Markup.listSelectors(this.state.slectors, this.state.slectorType, this.activeKey);

    Listen.all('.slector__delete', this.deleteBtnHandler.bind(this));
    Listen.all('.slector__edit', this.setActiveKey.bind(this));

    this.renderEditMenu();
    Listen.all('.cell', this.handleEditClick.bind(this));
  }

  setActiveKey(e: Event) {
    let target = e.target as HTMLElement;

    if (target.classList.contains('btn__icon') && target.parentElement) target = target.parentElement;

    if (target.parentElement?.classList.contains('slector-active')) {
      this.activeKey = null;
      this.refresh();
      return;
    }

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

  async handleEditClick(e: Event) {
    const target = e.target as HTMLElement;
    const key = Number(target.dataset.key);
    const layer = Number(target.dataset.layer);

    if (this.activeKey == null || layer == null || key == null) {
      throw new Error(`
      Popup: handleEditClick \n
      Cannot handle edit click. \n
      this.activeKey: ${this.activeKey} \n
      key: ${key} \n 
      layer: ${layer} \n`);
    }

    const message: EditSlectorMessage = { head: 'EDIT_SLECTOR', body: [this.activeKey, layer, key] };
    // Send signal flipping 'active'
    await chrome.runtime.sendMessage(message);
    this.refresh();
  }
}

new Popup();
