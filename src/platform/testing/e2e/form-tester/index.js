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

const getTestData = (contents, pathPrefix) => get(pathPrefix, contents, {});

const getLogger = (debugMode, testName) => (...params) => {
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(`${testName}:`, ...params);
  }
};

/**
 * Function to start the test. This logs in if necessary, navigates to the starting
 *  URL, sets up CSS injection to hide the Foresee overlay, and starts filling out
 *  the form.
 */
const runTest = async (page, testData, testConfig, userToken, testName) => {
  // Go to the starting page either by logging in or going there directly
  if (testConfig.logIn) {
    await logIn(userToken, page, testConfig.url, 3);
  } else {
    await page.goto(`${baseUrl}${testConfig.url}`);
  }

  // Hide Foresee
  await page.addStyleTag({ content: '.__acs { display: none !important; }' });

  await fillForm(
    page,
    testData,
    testConfig,
    getLogger(testConfig.debug, testName),
  );
};

/**
 * Runs through the form one time for each item in testDataSets.
 *
 * @typedef {object} TestConfig
 * @property {function} setup - Function called before the browser navigates to the initial URL.
 *                              Useful for setting up api mocks.
 * @property {function} setupPerTest - Function that's called before each test.
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
 * @property {array<ArrayPage>} arrayPaths
 * ---
 * @typedef {object} ArrayPage
 * @property {string} url - The url for the array page
 * @property {string} arrayPath - The arrayPath as it is in the formConfig
 * ---
 * @typedef {Object} DataSet
 * @property {String} fileName - The file name
 * @property {Object} contents - The parsed contents
 * ---
 * @param {TestConfig} testConfig
 * @param {Array<DataSet>} testDataSets
 */
const testForm = (testDataSets, testConfig) => {
  let browser;
  const token = getUserToken();
  const headlessMode = !testConfig.debug || process.env.IN_DOCKER;

  beforeAll(() => {
    if (testConfig.setup) {
      testConfig.setup(token);
    }
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({
      // slowMo: testConfig.debug ? 100 : 0,
      args: [
        '--window-size=1400,750',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      devtools: !headlessMode,
    });
  });

  afterEach(async () => {
    // The assumption here is that debug mode is turned on to see what's causing a failure,
    //  so keep the window open.
    // When running in docker, it will always be in headless mode, so always close it.
    if (headlessMode) {
      await browser.close();
    }
  });

  testDataSets.forEach(({ fileName, contents }) =>
    test(
      fileName,
      async () => {
        const testData = getTestData(contents, testConfig.testDataPathPrefix);
        if (testConfig.setupPerTest) {
          testConfig.setupPerTest({ userToken: token, testData });
        }
        const pageList = await browser.pages();
        const page = pageList[0] || (await browser.newPage());
        await fastForwardAnimations(page);
        await runTest(page, testData, testConfig, token, fileName);
      },
      // TODO: Make the timeout based on the number of inputs by default
      testConfig.timeoutPerTest || 120000,
    ),
  );
};

module.exports = testForm;
