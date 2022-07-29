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
          .map(async (el) => {
            const data: pathData = {};
            if (el.localName) data.localName = el.localName;
            if (el.id) data.id = el.id;
            if (el.className)
              data.classes = el.className
                .split(' ')
                .map((el: string) => el.trim())
                .filter((el: string) => el !== '');

            return data;
          }),
      );

      console.log(assembledSelection);
      this.sendSelection(assembledSelection);
    }

    async sendSelection(assembledSelection: pathData[]) {
      const res = await chrome.runtime.sendMessage({ head: 'newSelection', body: assembledSelection });
      console.log(res);
      document.removeEventListener('click', this.boundSelect);
    }
  }

  new Selector();
}

init();
