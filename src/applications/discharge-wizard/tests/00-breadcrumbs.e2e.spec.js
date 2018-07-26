const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    client
      .url(`${E2eHelpers.baseUrl}/discharge-upgrade-instructions/`);

    E2eHelpers.overrideSmoothScrolling(client);

    // landing page
    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.discharge-wizard', Timeouts.slow);

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"]', Timeouts.normal);

    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]').to.be.present;
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]').text.to.equal('Apply for a Discharge Upgrade');
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]').to.have.css('pointer-events').which.equal('none');

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))').to.have.css('display').which.equal('none');
    client.expect.element('.va-nav-breadcrumbs-list li:nth-last-child(2)').text.to.equal('Home');
    client.expect.element('.va-nav-breadcrumbs-list li:nth-last-child(2)').to.have.css('display').which.equal('inline-block');

    // Reset default size
    client.resizeWindow(1024, 768);

    client.end();
  });
