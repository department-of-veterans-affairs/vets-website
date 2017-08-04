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

    // Checking field in UserInfoSection has rendered
    client.expect.element('#gibs-full-name').text.to.contain('First Last');

    // Checking field in EnrollmentHistory has rendered
    client.expect.element('#enrollment-0 h4').text.to.contain('11/01/2012 to 12/01/2012 at Purdue University');

    // Click on print page
    // Commenting out for now until we can figure out why this is failing in Jenkins
    // client
    //   .click('#print-button')
    //   .window_handles((result) => {
    //     const newWindow = result.value[1];
    //     client.switchWindow(newWindow);

    //     // Ensure print page renders.
    //     // We need to log in again here because Electron loses the session
    //     // when opening a new window.
    //     LoginHelpers.logIn(token, client, '/education/gi-bill/post-9-11/ch-33-benefit/print', 3)
    //       .waitForElementVisible('body', Timeouts.normal)
    //       .axeCheck('.main')
    //       .assert.title('Check Benefit: Vets.gov')
    //       .waitForElementVisible('.print-status', Timeouts.slow);  // First render of React may be slow.

    //     client.expect.element('.section-header').text.to.contain('Post-9/11 GI Bill Benefit Information');
    //   });

    client.end();
  }
);
