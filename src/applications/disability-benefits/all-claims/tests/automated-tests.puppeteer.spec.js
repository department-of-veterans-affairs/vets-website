const join = require('path').join;
const _ = require('lodash/fp');

const testForm = require('platform/testing/e2e/form-tester');
const formFiller = require('platform/testing/e2e/form-tester/form-filler');
const getTestDataSets = require('platform/testing/e2e/form-tester/util')
  .getTestDataSets;
const PageHelpers = require('./disability-benefits-helpers');

const testData = getTestDataSets(join(__dirname, 'data'), {
  extension: 'json',
  ignore: ['minimal-ptsd-form-upload-test.json'],
  // only: ['minimal-test.json'],
});

const testConfig = {
  debug: true,
  setup: userToken => {
    PageHelpers.initDocumentUploadMock(userToken);
    PageHelpers.initApplicationSubmitMock(userToken);
    PageHelpers.initItfMock(userToken);
    PageHelpers.initPaymentInformationMock(userToken);
  },
  setupPerTest: ({ testData: data, userToken }) => {
    // Pre-fill with the expected ratedDisabilities, but nix view:selected since that's not pre-filled
    const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(d =>
      _.omit('view:selected', d),
    );
    const sanitizedData =
      sanitizedRatedDisabilities === []
        ? data
        : { ...data, ratedDisabilities: sanitizedRatedDisabilities };
    PageHelpers.initInProgressMock(userToken, sanitizedData);
  },
  url: '/disability/file-disability-claim-form-21-526ez/introduction',
  logIn: true,
  testDataPathPrefix: 'data',
  pageHooks: {
    '/disability/file-disability-claim-form-21-526ez/introduction': async page => {
      // Hit the start button
      await page.click('.usa-button-primary.schemaform-start-button');

      // Click past the ITF message
      await page.waitFor('.usa-button-primary:not(.schemaform-start-button)');
      await page.click('.usa-button-primary');
    },
    '/disability/file-disability-claim-form-21-526ez/disabilities/rated-disabilities': async (
      page,
      data,
      config,
      log,
    ) => {
      await Promise.all(
        data.ratedDisabilities.map(async (disability, index) => {
          if (disability['view:selected']) {
            log(`Selecting ${disability.name} (index ${index})`);
            await page.click(`input[name="root_ratedDisabilities_${index}"]`);
          }
        }),
      );
      await page.click('.form-progress-buttons .usa-button-primary');
    },
    '/disability/file-disability-claim-form-21-526ez/payment-information': async (
      page,
      data,
      config,
      log,
    ) => {
      if (data['view:bankAccount']) {
        if (await page.$('.usa-button-primary.edit-button')) {
          // Only click edit if new bank info is in the data file
          await page.click('.usa-button-primary.edit-button');
        }
        await formFiller.fillPage(page, data, config, log);
        await page.click('.usa-button-primary.update-button');
      }
      await page.click('button[type=submit].usa-button-primary');
    },
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
