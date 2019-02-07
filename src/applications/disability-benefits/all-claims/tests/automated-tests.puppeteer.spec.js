const join = require('path').join;

const testForm = require('../../../../platform/testing/e2e/form-tester');
const getTestDataSets = require('../../../../platform/testing/e2e/form-tester/util')
  .getTestDataSets;
const PageHelpers = require('./disability-benefits-helpers');

const testData = getTestDataSets(join(__dirname, 'schema'), {
  extension: 'json',
  ignore: ['minimal-ptsd-form-upload-test.json'],
});

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
  // TODO: Remove this in favor of importing the formConfig and finding them all
  arrayPages: [
    {
      path: 'new-disabilities/follow-up/:index',
      arrayPath: 'newDisabilities',
    },
  ],
};

describe('526 all-claims e2e tests', async () => {
  testForm(testData, testConfig);
});
