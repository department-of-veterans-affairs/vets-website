const testForm = require('../../../../platform/testing/e2e/form-tester');
const PageHelpers = require('./disability-benefits-helpers');

// TODO: Replace this with all the test data sets
const testData = require('./schema/maximal-test.json');

// TODO: Remove this in favor of pulling in the formConfig to generate arrayPages
// This currently isn't working because it gets angry with __BUILDTYPE__ in
// platform/utiities/environment/index.js
const PTSD_MATCHES = [
  'ptsd',
  'post traumatic stress disorder',
  'post-traumatic stress disorder',
  'post traumatic stress',
  'post-traumatic stress',
];
const isDisabilityPtsd = disability => {
  if (!disability || typeof disability !== 'string') {
    return false;
  }

  const loweredDisability = disability.toLowerCase();
  return PTSD_MATCHES.some(
    ptsdString =>
      ptsdString.includes(loweredDisability) ||
      loweredDisability.includes(ptsdString),
  );
};

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
      itemFilter: item => !isDisabilityPtsd(item.condition),
    },
  ],
};

describe('526 all-claims e2e tests', async () => {
  testForm({ 'maximal-test.json': testData }, testConfig);
});
