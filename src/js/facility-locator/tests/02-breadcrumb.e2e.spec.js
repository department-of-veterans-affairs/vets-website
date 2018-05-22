const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const FacilityHelpers = require('./facility-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    FacilityHelpers.initApplicationMock();

    client
      .url(`${E2eHelpers.baseUrl}/facilities/`);

    E2eHelpers.overrideSmoothScrolling(client);
    FacilityHelpers.initApplicationMock();

    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.facility-locator', Timeouts.slow);

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

    // check detail pages
    client
      .clearValue('input[name="streetCityStateZip"]')
      .setValue('input[name="streetCityStateZip"]', 'Seattle, WA');

    client
      .click('input[type="submit"]')
      .waitForElementVisible('.facility-result', Timeouts.normal);

    client
      .waitForElementVisible('.facility-result a h5', Timeouts.normal)
      .click('.facility-result a h5')
      .waitForElementVisible('.facility-detail', Timeouts.slow)
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
  }
);
