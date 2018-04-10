const E2eHelpers = require('../../../src/platform/testing/e2e/helpers');
const Timeouts = require('../../../src/platform/testing/e2e/timeouts.js');
const LoginHelpers = require('../../e2e/login-helpers');

const { formLinks } = require('../../../src/js/user-profile/helpers.jsx');

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
    .waitForElementVisible('.section-header', Timeouts.slow)
    .axeCheck('document');

  client
    .expect.element('.card.information').to.be.present;

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['21P-527EZ']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['21P-530']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['1010ez']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['22-1990']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['22-1990E']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['22-1990N']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['22-1995']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['22-5490']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client
    .url(`${E2eHelpers.baseUrl}${formLinks['22-5495']}`)
    .waitForElementVisible('.schemaform-intro', Timeouts.normal);

  client.end();
});
