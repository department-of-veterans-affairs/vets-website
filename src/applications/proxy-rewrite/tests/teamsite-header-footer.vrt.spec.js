// see jest-setup.js for additional config

const puppeteer = require('puppeteer');

const SCREEN_SIZES = [
  ['full screen', { width: 1024, height: 800 }],
  ['tablet screen', { width: 768, height: 1024 }],
  ['mobile screen', { width: 375, height: 667 }],
  ['small mobile screen', { width: 318, height: 500 }],
];

const HEADER = 'header';
const FOOTER = '#footerNav';

const TEAMSITES = [
  ['Benefits', 'https://benefits.va.gov'],
  ['Benefitswww', 'https://www.benefits.va.gov'],
  ['CEM', 'https://www.cem.va.gov'],
  ['Choose', 'https://www.choose.va.gov'],
];

describe.each(TEAMSITES)('%s', (sitename, url) => {
  let browser;
  let page;
  jest.setTimeout(20000);

  const compareScreenshots = async selector => {
    const element = await page.$(selector);
    await page.waitFor(1000);
    const image = await element.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.001,
      failureThresholdType: 'percent',
    });
  };

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(FOOTER);
    // hide foresee
    await page.addStyleTag({ content: '.__acs { display: none !important; }' });
  });

  it.each(SCREEN_SIZES)('renders %s size', async (sreensizeName, viewport) => {
    await page.setViewport(viewport);

    await compareScreenshots(FOOTER);
    await compareScreenshots(HEADER);
  });

  afterAll(async () => {
    await browser.close();
  });
});
