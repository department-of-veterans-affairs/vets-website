const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const Auth = require('platform/testing/e2e/auth');
const Mock = require('platform/testing/e2e/mock-helpers');

// Test data for api call.
const payload = {
  path: '/v0/disability_compensation_form/rated_disabilities',
  verb: 'get',
  value: {
    data: {
      attributes: {
        ratedDisabilities: [
          {
            decisionCode: 'SVCCONNECTED',
            decisionText: 'Service Connected',
            diagnosticCode: 5238,
            effectiveDate: '2008-10-01T05:00:00.000+00:00',
            name: 'Diabetes mellitus0',
            ratedDisabilityId: '0',
            ratingDecisionId: '63655',
            ratingPercentage: 100,
            relatedDisabilityDate: '2012-03-09T21:22:09.000+00:00',
            specialIssues: [
              {
                code: 'TRM',
                name: 'Personal Trauma PTSD',
              },
            ],
          },
          {
            decisionCode: 'SVCCONNECTED',
            decisionText: 'Service Connected',
            diagnosticCode: 5238,
            effectiveDate: '2008-10-01T05:00:00.000+00:00',
            name: 'Diabetes mellitus0',
            ratedDisabilityId: '0',
            ratingDecisionId: '63655',
            ratingPercentage: 100,
            relatedDisabilityDate: '2012-03-09T21:22:09.000+00:00',
            specialIssues: [
              {
                code: 'TRM',
                name: 'Personal Trauma PTSD',
              },
            ],
          },
        ],
      },
    },
  },
};

function runRatedDisabilitiesTest(browser) {
  browser.pause(Timeouts.slow);
  browser.assert.containsText(
    '.vads-u-font-size--h3',
    'Your rated disabilities',
  );
  browser.assert.visible('.va-sortable-table');
  browser.assert.containsText('td:nth-of-type(1)', 'Diabetes mellitus0');
}

function generateTableData(token) {
  return Mock(token, payload);
}

function begin(browser) {
  browser.perform(done => {
    const token = Auth.getUserToken();
    generateTableData(token).then(() => {
      Auth.logIn(
        token,
        browser,
        '/disability/my-rated-disabilities',
        3,
      ).waitForElementVisible('.vads-u-font-size--h3', Timeouts.slow);
    });
    browser.pause(Timeouts.slow);
    runRatedDisabilitiesTest(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
