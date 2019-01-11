const testForm = require('../../../../platform/testing/e2e/form-tester');

// TODO: Replace this with all the test data sets
const testData = require('./schema/minimal-test.json');

const testConfig = {
  url: '/disability-benefits/apply/form-526-all-claims/introduction',
  logIn: true,
  pageHooks: {
    '/disability-benefits/apply/form-526-all-claims/introduction': async page => {
      // await page.waitForNavigation();
      await page.click('.usa-button-primary.schemaform-start-button');
    },
  },
};

// TODO: Figure out why I have to manually set the WEB_PORT env variable

describe('526 all-claims e2e tests', async () => {
  testForm({ 'minimal-test.json': testData }, testConfig);
});
