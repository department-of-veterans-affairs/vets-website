const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const HealthRecordsHelpers = require('./health-records-helpers');
const Auth = require('../../../platform/testing/e2e/auth');
const AccountCreationHelpers = require('../../../platform/testing/e2e/account-creation-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  HealthRecordsHelpers.initApplicationMock(token);
  AccountCreationHelpers.initMHVTermsMocks(token);

  // Ensure index page renders.
  Auth.logIn(token, client, '/health-care/health-records', 3)
    .assert.title('Get Your VA Health Records: Vets.gov')
    .waitForElementVisible('.blue-button-logo', Timeouts.normal)
    .axeCheck('.main');

  // Ensure that date choices render.
  client.elements('css selector', '.form-radio-buttons', result => {
    client.expect(result.value.length).to.equal(4);
  });

  // Ensure that types of information render.
  client.elements('css selector', '.form-checkbox', result => {
    client.expect(result.value.length).to.equal(33);
  });

  // Select all types of information to be included in report.
  client.click('.form-radio-buttons').click('.form-checkbox');

  client
    .click('.form-actions > button[type="submit"]')
    .waitForElementVisible('.update-page', Timeouts.normal)
    .axeCheck('.main');

  client
    .click('.update-page a')
    .waitForElementVisible('.download-page', Timeouts.normal)
    .axeCheck('.main');

  client
    .click('.download-page > p > a')
    .click('.va-modal-actions > a')
    .waitForElementVisible('.blue-button-logo', Timeouts.normal);

  client.end();
});
