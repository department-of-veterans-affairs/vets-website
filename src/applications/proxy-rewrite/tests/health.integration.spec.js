const puppeteer = require('puppeteer');

const fullScreen = { width: 1024, height: 800 };
const mobileScreen = { width: 400, height: 700 };

const VAGOV_HEALTH_URL = 'https://staging.va.gov/health/';

const HEADER = 'header';
const FOOTER = 'footer';

describe('Veterans Health Administration page', () => {
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

  it('renders full screen size', async () => {
    page.setViewport(fullScreen);

    compareScreenshots(FOOTER);
    compareScreenshots(HEADER);

    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });
  });
  it('renders mobile screen size', async () => {
    page.setViewport(mobileScreen);

    compareScreenshots(FOOTER);
    compareScreenshots(HEADER);

    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
