import V from '../../view.js';

class PageScraper {
  constructor(browserInstance) {
    this.url = 'https://stripe.com/docs/api/accounts/create';
    this.browserInstance = browserInstance;
    this.scraper();
  }

  async scraper() {
    this.browser = await this.browserInstance;
    await this.devSetup();

    let page = await this.browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    await V.askYesNo('Ready to crawl?');
    const selection = JSON.parse(
      await page.evaluate(() => localStorage.getItem('state'))
    );
    console.log(selection);

    const parents = await page.$$(selection.ParentMethod[0].savedQuery);

    const methods = await Promise.all(
      parents.map(async (parent) => {
        const name = await parent.$eval(
          selection.MethodName[0].savedQuery,
          (el) => el.innerText
        );
        return name;
      })
    );

    console.log('methods');
    console.log(methods);
    // Pull selected fields.

    // Parse into ConnectorFormat
  }

  async;

  async devSetup() {
    let extPage = await this.browser.newPage();
    await extPage.goto('chrome://extensions', { waituntil: 'load' });
    await extPage.waitForTimeout(2000);
    const devBtn = await extPage.evaluateHandle(
      'document.querySelector("body > extensions-manager").shadowRoot.querySelector("extensions-toolbar").shadowRoot.querySelector("#devMode")'
    );
    await devBtn.click();

    const workerBtn = await extPage.waitForSelector(
      'pierce/a.clippable-flex-text',
      {
        visible: true,
      }
    );
    await workerBtn.click();
  }

  async harvestPage() {}
}

export default PageScraper;
