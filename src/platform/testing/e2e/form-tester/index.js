const puppeteer = require('puppeteer');

const { get } = require('lodash/fp');
const { baseUrl } = require('../../../../platform/testing/e2e/helpers');
const {
  getUserToken,
  logIn,
} = require('../../../../platform/testing/e2e-puppeteer/auth');
const { fillForm } = require('./form-filler');

/**
 * Makes expanding fields and other animations go fast enough to not get in
 *  the way.
 */
const fastForwardAnimations = async page => {
  await page._client.send('Animation.setPlaybackRate', { playbackRate: 10000 });
};

const getTestData = (testDataSets, testName, pathPrefix) =>
  get(pathPrefix, testDataSets[testName], {});

const getLogger = debugMode => (...params) => {
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(...params);
  }
};

const runTest = async (page, testData, testConfig, userToken) => {
  // Go to the starting page either by logging in or going there directly
  if (testConfig.logIn) {
    await logIn(userToken, page, testConfig.url, 3);
  } else {
    await page.goto(`${baseUrl}${testConfig.url}`);
  }

  await fillForm(page, testData, testConfig, getLogger(testConfig.debug));

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
 * @property {boolean} logIn - Whether to log in at LoA 3 or not.
 * @property {object.<function>} pageHooks - Functions used to bypass the automatic form filling
 *                                           for a single page. The property name corresponds to
 *                                           the url for the page.
 * @property {number} timeoutPerTest - The maximum time in milliseconds that a single run can take
 * @property {string} testDataPathPrefix - The path prefix to get to the field data. For example,
 *                                         if the test data looks like { data: { field1: 'value' } },
 *                                         testDataPathPrefix should be set to 'data'.
 * @property {boolean} debug - If true, the test won't run in headless mode, will do some extra
 *                             logging, and won't close the browser on a failed test.
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
    browser = await puppeteer.launch({
      devtools: testConfig.debug,
      // slowMo: testConfig.debug ? 100 : 0,
      args: ['--window-size=1400,750'],
    });
  });

  afterEach(async () => {
    if (!testConfig.debug) {
      await browser.close();
    }
  });

  Object.keys(testDataSets).forEach(testName =>
    test(
      testName,
      async () => {
        const pageList = await browser.pages();
        const page = pageList[0] || (await browser.newPage());
        await fastForwardAnimations(page);
        await runTest(
          page,
          getTestData(testDataSets, testName, testConfig.testDataPathPrefix),
          testConfig,
          token,
        );
      },
      // TODO: Make the timeout based on the number of inputs by default
      testConfig.timeoutPerTest || 120000,
    ),
  );
};

module.exports = testForm;
