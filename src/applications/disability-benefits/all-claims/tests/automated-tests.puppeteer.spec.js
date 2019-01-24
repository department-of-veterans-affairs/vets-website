const testForm = require('../../../../platform/testing/e2e/form-tester');
const PageHelpers = require('./disability-benefits-helpers');

// TODO: Replace this with all the test data sets
const testData = require('./schema/maximal-test.json');

const testConfig = {
  debug: true,
  setup: userToken => {
    PageHelpers.initInProgressMock(userToken);
    PageHelpers.initDocumentUploadMock();
    PageHelpers.initApplicationSubmitMock();
    PageHelpers.initItfMock(userToken);
    PageHelpers.initPaymentInformationMock(userToken);
  },
  url: '/disability-benefits/apply/form-526-all-claims/introduction',
  logIn: true,
  testDataPathPrefix: 'data',
  pageHooks: {
    '/disability-benefits/apply/form-526-all-claims/introduction': async page => {
      // Hit the start button
      await page.click('.usa-button-primary.schemaform-start-button');

      // Click past the ITF message
      await page.waitFor('.usa-button-primary:not(.schemaform-start-button)');
      await page.click('.usa-button-primary');
    },
    // TODO: Add a hook for the rated disabilities page
    // TODO: Add a hook for the bank info page
  },
};

describe('526 all-claims e2e tests', async () => {
  testForm({ 'maximal-test.json': testData }, testConfig);
});
