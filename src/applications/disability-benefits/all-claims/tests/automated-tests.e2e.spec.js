const testForm = require('../../../../platform/testing/e2e/form-tester');
const PageHelpers = require('./disability-benefits-helpers');

// TODO: Replace this with all the test data sets
const testData = require('./schema/minimal-test.json');

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
  },
};

// TODO: Figure out why I have to manually set the WEB_PORT env variable

describe('526 all-claims e2e tests', async () => {
  testForm({ 'minimal-test.json': testData }, testConfig);
});
