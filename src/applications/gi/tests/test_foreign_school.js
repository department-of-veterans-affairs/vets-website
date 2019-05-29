const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

const Onlinecheck =
  '#accordion-item-26 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > div.total-paid-to-you > div:nth-child(1) > div.small-6.columns.value > h5';
const Inpersoncheck =
  '#accordion-item-26 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > div.total-paid-to-you > div:nth-child(1) > div.small-6.columns.value > h5';
const Inpersonandonlinecheck =
  '#accordion-item-26 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > div.total-paid-to-you > div:nth-child(1) > div.small-6.columns.value > h5';

module.exports = E2eHelpers.createE2eTest(client => {
  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  GiHelpers.ForeignOnlineOnly(client, Onlinecheck);
  client
    .waitForElementVisible('body', 1000)
    .moveToElement(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      10,
      10,
    )
    .waitForElementVisible(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      500,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-16-0')
    .moveToElement(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      10,
      10,
    )
    .waitForElementVisible(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      500,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  GiHelpers.ForeignInPersonOnly(client, Inpersoncheck);
  client
    .waitForElementVisible('body', 1000)
    .moveToElement(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      10,
      10,
    )
    .waitForElementVisible(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      500,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-16-0')
    .moveToElement(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      10,
      10,
    )
    .waitForElementVisible(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      500,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  GiHelpers.ForeignInPersonAndOnline(client, Inpersonandonlinecheck);
  client
    .waitForElementVisible('body', 1000)
    .moveToElement(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      10,
      10,
    )
    .waitForElementVisible(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      500,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-16-0')
    .moveToElement(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      10,
      10,
    )
    .waitForElementVisible(
      '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > h3',
      500,
    );

  client.end();
});
