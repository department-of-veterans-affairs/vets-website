const puppeteer = require('puppeteer');

const fullScreen = { width: 1024, height: 800 };
const tabletScreen = { width: 768, height: 1024 };
const mobileScreen = { width: 375, height: 667 };
const smallMobileScreen = { width: 318, height: 500 };

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

    await compareScreenshots(FOOTER);
    await compareScreenshots(HEADER);

    // banner
    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });

    // menu
    page.click('button.vetnav-level1');
    await page.waitForSelector('#vetnav-va-benefits-and-health-care', {
      visible: true,
    });
  });
  it('renders tablet screen size', async () => {
    page.setViewport(tabletScreen);

    await compareScreenshots(FOOTER);
    await compareScreenshots(HEADER);

    // banner
    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });

    // menu
    page.click('button.vetnav-level1');
    await page.waitForSelector('#vetnav-va-benefits-and-health-care', {
      visible: true,
    });
  });
  it('renders mobile screen size', async () => {
    page.setViewport(mobileScreen);

    await compareScreenshots(FOOTER);
    await compareScreenshots(HEADER);

    // banner
    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });

    // menu
    page.click('.vetnav-controller-open');
    await page.waitForSelector('#vetnav', {
      visible: true,
    });

    // footer
    page.click('.va-footer-button');
    await page.waitForSelector('#veteran-contact', {
      visible: true,
    });
  });
  it('renders small mobile screen size', async () => {
    page.setViewport(smallMobileScreen);

    await compareScreenshots(FOOTER);
    await compareScreenshots(HEADER);

    // banner
    page.click('#usa-banner-toggle');
    await page.waitForSelector('#gov-banner', {
      visible: true,
    });

    // menu
    page.click('.vetnav-controller-open');
    await page.waitForSelector('#vetnav', {
      visible: true,
    });

    // footer
    page.click('.va-footer-button');
    await page.waitForSelector('#veteran-contact', {
      visible: true,
    });
  });
  afterAll(async () => {
    await browser.close();
  });
});
