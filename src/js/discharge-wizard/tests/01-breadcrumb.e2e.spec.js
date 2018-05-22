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
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
      .expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.be.present;

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    // questions page
    client
      .click('.usa-button-primary')
      .waitForElementVisible('.dw-questions', Timeouts.normal);

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal);

    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]').to.be.present;
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]').to.have.css('pointer-events').which.equal('none');

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    E2eHelpers.overrideScrolling(client);

    client
      .setValue('input[name="1_branchOfService"]', '1')
      .click('input[name="1_branchOfService"]')
      .selectDropdown('2_dischargeYear', '2016')
      .waitForElementPresent('input[name="4_reason"]', Timeouts.normal)
      .setValue('input[name="4_reason"]', '1')
      .click('input[name="4_reason"]')
      .waitForElementPresent('input[name="6_intention"]', Timeouts.normal)
      .setValue('input[name="6_intention"]', '1')
      .click('input[name="6_intention"]')
      .waitForElementPresent('input[name="7_courtMartial"]', Timeouts.normal)
      .setValue('input[name="7_courtMartial"]', '1')
      .click('input[name="7_courtMartial"]')
      .waitForElementPresent('input[name="8_prevApplication"]', Timeouts.normal)
      .setValue('input[name="8_prevApplication"]', '1')
      .click('input[name="8_prevApplication"]')
      .waitForElementPresent('input[name="9_prevApplicationYear"]', Timeouts.normal)
      .setValue('input[name="9_prevApplicationYear"]', '1')
      .click('input[name="9_prevApplicationYear"]')
      .waitForElementPresent('input[name="12_priorService"]', Timeouts.normal)
      .setValue('input[name="12_priorService"]', '1')
      .click('input[name="12_priorService"]');

    client
      .waitForElementVisible('.review-answers', Timeouts.slow)
      .axeCheck('.main')
      .click('a.usa-button-primary');

    // results page
    client
      .waitForElementVisible('.dw-guidance', Timeouts.slow);

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
      .expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.be.present;

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    client.end();
  });
