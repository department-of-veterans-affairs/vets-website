const puppeteer = require('puppeteer');

const { baseUrl } = require('../../../../platform/testing/e2e/helpers');
const {
  getUserToken,
  logIn,
} = require('../../../../platform/testing/e2e-puppeteer/auth');
const fillForm = require('./form-filler');

const runTest = async (page, testData, testConfig, userToken) => {
  // Go to the starting page either by logging in or going there directly
  if (testConfig.logIn) {
    await logIn(userToken, page, testConfig.url, 3);
  } else {
    await page.goto(`${baseUrl}${testConfig.url}`);
  }

  await fillForm(page, testData, testConfig);

  // TODO: Check for unused data
  // TODO: Submit
  //   - Configurable; we may not always want to submit
};

/**
 * Runs through the form one time for each item in testDataSets.
 *
 * @typedef {TestConfig}
 * @type {object}
 * @property {function} setup - Function called before the browser navigates to the initial URL.
 *                              Useful for setting up api mocks.
 * @property {string} url - The url where the form can be found.
 * @property {boolean} logIn - Whether to log in at LoA 3 or not
 * @property {object.<function>} pageHooks - Functions used to bypass the automatic form filling
 *                                           for a single page. The property name corresponds to
 *                                           the url for the page.
 * @property {number} timeoutPerTest - The maximum time in milliseconds that a single run can take
 * ---
 * @typedef {TestDataSets}
 * @type {object}
 * @description A set of test data pulled from json files. Each property name corresponds to
 *  the file name that the data is pulled from. The values are the parsed JSON objects contained
 *  in the files.
 * ---
 * @param {TestConfig} testConfig
 * @param {TestData} testDataSets
 */
const testForm = (testDataSets, testConfig) => {
  let browser;
  const token = getUserToken();

  beforeAll(() => {
    if (testConfig.setup) {
      testConfig.setup(token);
    }
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false });
  });

  afterEach(async () => {
    await browser.close();
  });

  Object.keys(testDataSets).forEach(testName =>
    test(
      testName,
      async () => {
        const pageList = await browser.pages();
        const page = pageList[0] || (await browser.newPage());
        await runTest(page, testDataSets[testName], testConfig, token);
        await browser.close();
      },
      // TODO: Make the timeout based on the number of inputs by default
      testConfig.timeoutPerTest || 50000,
    ),
  );
};

module.exports = testForm;
