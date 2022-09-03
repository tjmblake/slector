function init() {
  class Selector {
    boundSelect: (e: MouseEvent) => void;
    constructor() {
      console.log('Selector Injected!');

      // Required to remove event listener
      this.boundSelect = this.select.bind(this);

      this.init();
    }

    init() {
      document.addEventListener('click', this.boundSelect);
    }

    async select(e: MouseEvent) {
      e.preventDefault();

      const paths = e.composedPath() as Array<Element>;

      const assembledSelection = await Promise.all(
        paths
          .filter((el) => el.localName)
          .map(async (el, i) => {
            const data: pathLayer = { content: [], layer: i };

            let key = 0;

            if (el.localName) {
              data.content.push({ type: 'localName', value: el.localName, key: key, active: true });
              key++;
            }

            if (el.id) {
              data.content.push({ type: 'id', value: el.id, key: key, active: true });
              key++;
            }

            if (el.className) {
              el.className
                .split(' ')
                .filter((str) => str.trim() !== '')
                .map((str) => (str.includes(':') ? str.replaceAll(':', '\\:') : str))
                .forEach((str) => {
                  data.content.push({ type: 'class', value: str, key: key, active: true });
                  key++;
                });
            }
            return data;
          }),
      );

      console.log(assembledSelection);
      this.sendSelection(assembledSelection);
    }

    async sendSelection(assembledSelection: pathLayer[]) {
      const message: NewSlectorMessage = { head: 'NEW_SLECTOR', body: assembledSelection };
      const res = await chrome.runtime.sendMessage(message);
      console.log(res);
      document.removeEventListener('click', this.boundSelect);
    }
  }

  new Selector();
}

init();
