// Relative imports.
import E2eHelpers from 'platform/testing/e2e/helpers.js';
import Timeouts from 'platform/testing/e2e/timeouts';

const SELECTORS = {
  HOMEPAGE_BANNER: '[data-e2e-id="homepage-banner"]',
  MAINTENANCE_BANNER_DOWNTIME: '[data-e2e-id="maintenance-banner-downtime"]',
  MAINTENANCE_BANNER_PRE_DOWNTIME:
    '[data-e2e-id="maintenance-banner-pre-downtime"]',
};

const runTests = browser => {
  browser.openUrl(E2eHelpers.baseUrl);
  E2eHelpers.overrideSmoothScrolling(browser);

  // A11y check the homepage banner.
  browser
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible(SELECTORS.HOMEPAGE_BANNER, Timeouts.slow)
    .axeCheck(SELECTORS.HOMEPAGE_BANNER);

  // A11y check the maintenance banner pre-downtime.
  browser
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible(
      SELECTORS.MAINTENANCE_BANNER_PRE_DOWNTIME,
      Timeouts.slow,
    )
    .axeCheck(SELECTORS.MAINTENANCE_BANNER_PRE_DOWNTIME);

  // A11y check the maintenance banner downtime.
  browser
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible(SELECTORS.MAINTENANCE_BANNER_DOWNTIME, Timeouts.slow)
    .axeCheck(SELECTORS.MAINTENANCE_BANNER_DOWNTIME);

  browser.end();
};

module.exports = E2eHelpers.createE2eTest(browser => {
  browser.perform(done => {
    setup().then(() => {
      runTests(browser);
      done();
    });
  });
});

module.exports['@disabled'] = true;
