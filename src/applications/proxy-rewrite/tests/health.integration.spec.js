const puppeteer = require('puppeteer');

describe('jest-image-snapshot usage with an image received from puppeteer', () => {
  let browser;
  jest.setTimeout(20000);
  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  it('compares screenshots of elements', async () => {
    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 800 });
    await page.goto('https://preview.va.gov/health/');
    const TESTELEMENT = 'footer';
    const element = await page.$(TESTELEMENT);
    await page.waitFor(1000);
    const image = await element.screenshot();

    expect(image).toMatchImageSnapshot();
  });
  it('compares small width screenshots', async () => {
    const page = await browser.newPage();
    page.setViewport({ width: 400, height: 700 });
    await page.goto('https://preview.va.gov/health/');
    const TESTELEMENT = 'header';
    const element = await page.$(TESTELEMENT);
    await page.waitFor(1000);
    const image = await element.screenshot();
    expect(image).toMatchImageSnapshot();
  });
  it('checks for expanded content', async () => {
    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 800 });
    await page.goto('https://preview.va.gov/health/');
    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
