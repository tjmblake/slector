class Popup {
  initBtn: HTMLButtonElement | null;
  constructor() {
    this.initBtn = document.querySelector('#init');
    this.setInitListener();
  }
  setInitListener() {
    this.initBtn?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ head: 'init' }, (res) => {
        console.log('Init Response Recieved:');
        console.log(res);
      });
    });
  }
}

new Popup();
