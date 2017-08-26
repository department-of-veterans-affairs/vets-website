const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const LoginHelpers = require('../../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  let token = LoginHelpers.getUserToken();

  LoginHelpers.logIn(token, client, '/profile', 1)
    // The loading indicator tests seem to be problematic because the thing goes away fairly quickly
    // it seems to have already disappeared by the time the test starts looking for it.
    // .waitForElementVisible('.loading-indicator-container', Timeouts.normal)
    // .waitForElementNotPresent('.loading-indicator-container', Timeouts.slow)
    // .waitForElementVisible('.usa-button-big', Timeouts.normal)
    .axeCheck('document');

  token = LoginHelpers.getUserToken();

  LoginHelpers.logIn(token, client, '/profile', 3)
    .waitForElementVisible('.react-container', Timeouts.slow)
    .axeCheck('document');

  client
    .url(`${E2eHelpers.baseUrl}/pension/application/527EZ/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/burials-and-memorials/application/530/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/health-care/apply/application/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1990/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1990e/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1990n/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1995/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/5490/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/5495/introduction`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client.end();
});
