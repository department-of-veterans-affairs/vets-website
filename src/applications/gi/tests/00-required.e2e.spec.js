const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

const firstResult =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';
const firstResultRate =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div.small-12.usa-width-five-twelfths.medium-5.columns.estimated-benefits > div:nth-child(3) > div > h4 > div';
const secondResult =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';
const secondResultRate =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div.small-12.usa-width-five-twelfths.medium-5.columns.estimated-benefits > div:nth-child(3) > div > h4 > div';
const thirdResult =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';
const onlineOnlyRadio = '#radio-buttons-2-0';
const inPersonOnlyRadio = '#radio-buttons-2-1';
const inPersonAndOnlineRadio = '#radio-buttons-2-2';
const vaRateRadio = '#radio-buttons-15-0';
const dodRateRadio = '#radio-buttons-15-1';
const vaRateRadioUS = '#radio-buttons-16-0';
const dodRateRadioUS = '#radio-buttons-16-1';

module.exports = E2eHelpers.createE2eTest(client => {
  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.slow)
    .axeCheck('.main');

  GiHelpers.searchAsDEA(
    client,
    firstResult,
    firstResultRate,
    GiHelpers.formatCurrency(GiHelpers.calculatorConstantsList.DEARATEOJT),
  );

  GiHelpers.verifyAllDEAojt(client);

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  GiHelpers.searchAsDEA(
    client,
    secondResult,
    secondResultRate,
    GiHelpers.formatCurrency(GiHelpers.calculatorConstantsList.DEARATEFULLTIME),
  );

  GiHelpers.verifyDEA(
    client,
    'full',
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.DEARATEFULLTIME,
    )}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'three quarters',
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.DEARATETHREEQUARTERS,
    )}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'half',
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.DEARATEONEHALF,
    )}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'less than half',
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.DEARATEUPTOONEHALF,
    )}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'quarter',
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.DEARATEUPTOONEQUARTER,
    )}/mo`,
  );

  // check Foreign DOD and VA rate for online only
  GiHelpers.searchCh33(
    client,
    onlineOnlyRadio,
    'DUBLIN CITY UNIVERSITY',
    thirdResult,
  );
  GiHelpers.verifyCh33(
    client,
    dodRateRadio,
    `${GiHelpers.formatCurrencyHalf(
      GiHelpers.calculatorConstantsList.AVGDODBAH,
    )}/mo`,
  );
  GiHelpers.verifyCh33(
    client,
    vaRateRadio,
    `${GiHelpers.formatCurrencyHalf(
      GiHelpers.calculatorConstantsList.AVGVABAH,
    )}/mo`,
  );

  // check Foreign DOD and VA rate for in person only
  GiHelpers.searchCh33(
    client,
    inPersonOnlyRadio,
    'DUBLIN CITY UNIVERSITY',
    thirdResult,
  );
  GiHelpers.verifyCh33(
    client,
    dodRateRadio,
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.AVGDODBAH,
    )}/mo`,
  );
  GiHelpers.verifyCh33(
    client,
    vaRateRadio,
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.AVGVABAH,
    )}/mo`,
  );

  // check Foreign DOD and VA rate for In person and online
  GiHelpers.searchCh33(
    client,
    inPersonAndOnlineRadio,
    'DUBLIN CITY UNIVERSITY',
    thirdResult,
  );
  GiHelpers.verifyCh33(
    client,
    dodRateRadio,
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.AVGDODBAH,
    )}/mo`,
  );
  GiHelpers.verifyCh33(
    client,
    vaRateRadio,
    `${GiHelpers.formatCurrency(
      GiHelpers.calculatorConstantsList.AVGVABAH,
    )}/mo`,
  );

  // check US DOD and VA rate for online only
  GiHelpers.searchCh33(
    client,
    onlineOnlyRadio,
    'AMERICAN UNIVERSITY',
    secondResult,
  );
  GiHelpers.verifyCh33(
    client,
    dodRateRadioUS,
    `${GiHelpers.formatCurrencyHalf(
      GiHelpers.calculatorConstantsList.AVGDODBAH,
    )}/mo`,
  );
  GiHelpers.verifyCh33(
    client,
    vaRateRadioUS,
    `${GiHelpers.formatCurrencyHalf(
      GiHelpers.calculatorConstantsList.AVGVABAH,
    )}/mo`,
  );

  // check US DOD and VA rate for in person only
  GiHelpers.searchCh33(
    client,
    inPersonOnlyRadio,
    'AMERICAN UNIVERSITY',
    secondResult,
  );
  GiHelpers.verifyCh33(
    client,
    dodRateRadioUS,
    `${GiHelpers.formatCurrency(
      GiHelpers.schools.data[1].attributes.dodBah,
    )}/mo`,
  );
  GiHelpers.verifyCh33(
    client,
    vaRateRadioUS,
    `${GiHelpers.formatCurrency(GiHelpers.schools.data[1].attributes.bah)}/mo`,
  );

  // check US DOD and VA rate for in person and online
  GiHelpers.searchCh33(
    client,
    inPersonAndOnlineRadio,
    'AMERICAN UNIVERSITY',
    secondResult,
  );
  GiHelpers.verifyCh33(
    client,
    dodRateRadioUS,
    `${GiHelpers.formatCurrency(
      GiHelpers.schools.data[1].attributes.dodBah,
    )}/mo`,
  );
  GiHelpers.verifyCh33(
    client,
    vaRateRadioUS,
    `${GiHelpers.formatCurrency(GiHelpers.schools.data[1].attributes.bah)}/mo`,
  );

  client.end();
});
