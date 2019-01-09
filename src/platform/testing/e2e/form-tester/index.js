const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const runTest = require('./run-test');

/**
 * Returns an object with one test per property in testData per the second example in
 *  http://nightwatchjs.org/guide#writing-tests
 *
 * NOTE: This will run any number of tests in a single browser, which may cause some
 *  weird side-effects. There doesn't seem to be a good way to isolate each run in
 *  nightwatch without creating an actual test source file, however, so this is what
 *  we have to work with right now.
 */
const compileTests = (testData, testConfig) => {
  const testRuns = Object.keys(testData).reduce(
    (e2eTests, testName) =>
      Object.assign({}, e2eTests, {
        [testName]: client => {
          E2eHelpers.overrideSmoothScrolling(client);
          runTest(client, testData[testName], testConfig);
        },
      }),
    {},
  );

  // Only .end() at the _very_ end of _all_ the tests
  testRuns.endTests = client => client.end();
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
  testDataSets.forEach(testData => compileTests(testData, testConfig));
};

module.exports = testForm;
