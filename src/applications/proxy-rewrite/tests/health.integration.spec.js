const puppeteer = require('puppeteer');

const fullScreen = { width: 1024, height: 800 };
const mobileScreen = { width: 400, height: 700 };

const VAGOV_HEALTH_URL = 'https://staging.va.gov/health/';

const HEADER = 'header';
const FOOTER = 'footer';

describe('jest-image-snapshot usage with an image received from puppeteer', () => {
  let browser;
  let page;
  jest.setTimeout(20000);

  const compareScreenshots = async selector => {
    const element = await page.$(selector);
    await page.waitFor(1000);
    const image = await element.screenshot();

    expect(image).toMatchImageSnapshot();
  };
  beforeAll(async () => {
    browser = await puppeteer.launch();
  });
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(VAGOV_HEALTH_URL);
  });

  it('compares screenshots of elements', async () => {
    page.setViewport(fullScreen);
    compareScreenshots(FOOTER);
  });
  it('compares small width screenshots', async () => {
    page.setViewport(mobileScreen);
    compareScreenshots(HEADER);
  });
  it('checks for expanded content', async () => {
    page.setViewport(fullScreen);
    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
