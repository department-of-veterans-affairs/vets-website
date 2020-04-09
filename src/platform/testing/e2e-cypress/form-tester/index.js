/* eslint-disable */
const { get } = require('lodash/fp');
const { formData } = require('./formData');

const getTestData = (contents, pathPrefix) => get(pathPrefix, contents, {});

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
const testForm = (filePath, pathRules, testConfig) => {
  describe('Form Tests', async () => {
    const token = 'token-7658765-0';
    const baseUrl = 'http://localhost:3001';

    before(() => {
      if (testConfig.setup) {
        testConfig.setup(token);
      }

      // Initialize mock user
      cy.initUserMock(token, 3);

      cy.initItfMock(token);

      // cy.task('getTestDataSets', {
      //   path: filePath,
      //   rules: pathRules,
      // }).then(testData => {
      //   // Cypress.env('formData', testData);
      // });
    });

    beforeEach(() => {
      if (testConfig.logIn) {
        cy.setCookie('token', token, { httpOnly: true });
        cy.visit(`${baseUrl}${testConfig.url}`, {
          onBeforeLoad(win) {
            win.localStorage.setItem('hasSession', true);
          },
        });
      }
    });

    formData.forEach(({ fileName, contents }) => {
      it(fileName, async () => {
        const testData = getTestData(contents, testConfig.testDataPathPrefix);
        // cy.runTest(testData, testConfig, token, fileName);
      });
    });
  });
};

module.exports = testForm;
