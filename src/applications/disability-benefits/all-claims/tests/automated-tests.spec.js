const _ = require('lodash/fp');
const testForm = require('../../../../platform/testing/e2e-cypress/form-tester');
const PageHelpers = require('./disability-benefits-helpers');

// const join = require('path').join;
// const getTestDataSets = require('../../../../platform/testing/e2e-cypress/form-tester/util')
//   .getTestDataSets;

// const testData = getTestDataSets(join(__dirname, 'data'), {
//   extension: 'json',
//   ignore: ['minimal-ptsd-form-upload-test.json'],
//   // only: ['minimal-test.json'],
// });

const testConfig = {
  debug: true,
  setup: userToken => {
    PageHelpers.initDocumentUploadMock();
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
};

describe('526 all-claims e2e tests', () => {
  testForm([1, 2, 3], testConfig);
});
