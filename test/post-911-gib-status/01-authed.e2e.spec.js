const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const GibsHelpers = require('../e2e/post-911-gib-status-helpers.js');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    GibsHelpers.initApplicationMock(token);

    // Ensure main status page renders.
    LoginHelpers.logIn(token, client, '/education/gi-bill/post-9-11/ch-33-benefit', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main')
      .assert.title('Check Benefit: Vets.gov')
      .waitForElementVisible('.schemaform-title', Timeouts.slow);  // First render of React may be slow.

    // User information section
    client.expect.element('[name="fullName"]').text.to.contain('First Last');
    client.expect.element('[name="dateOfBirth"]').text.to.contain('11/27/1995');
    client.expect.element('[name="vaFileNumber"]').text.to.contain('xxxx-5678');
    client.expect.element('[name="regionalProcessingOffice"]').text.to.contain('Central Office Washington, DC');

    client.expect.element('[name="originalEntitlement"]').text.to.contain('100');
    client.expect.element('[name="usedEntitlement"]').text.to.contain('75');
    client.expect.element('[name="remainingEntitlement"]').text.to.contain('25');

    client.expect.element('[name="percentageBenefit"]').text.to.contain('25%');
    client.expect.element('[name="delimitingDate"]').text.to.contain('12/07/2017');

    // Print page
    client
      .click('#print-button')
      .windowHandles((result) => {
        const newWindow = result.value[1];
        client.switchWindow(newWindow);
      });

    // Ensure main status page renders.
    LoginHelpers.logIn(token, client, '/education/gi-bill/post-9-11/ch-33-benefit/print', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main')
      .assert.title('Check Benefit: Vets.gov')
      .waitForElementVisible('.print-status', Timeouts.slow);  // First render of React may be slow.

    client.expect.element('.section-header').text.to.contain('Post-9/11 GI Bill Benefit Information');

    client.axeCheck('.main');

    client.end();
  }
);
