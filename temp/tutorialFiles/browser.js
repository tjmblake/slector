import puppeteer from 'puppeteer';
import path from 'path';

export async function startBrowser() {
  let browser;
  const extPath = path.join(
    path.resolve(path.dirname('')),
    './bundles/crawl/ext'
  );

  console.log(extPath);
  try {
    console.log('Opening the browser...');
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: [
        '--disable-setuid-sandbox',
        `--load-extension=${extPath}`,
        `--disable-extensions-except=${extPath}`,
      ],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log('Could not create a browser instance => : ', err);
  }
  return browser;
}
