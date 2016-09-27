const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const HcaHelpers = require('../util/hca-helpers.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    HcaHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/apply/application/`)
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.form-panel', Timeouts.slow)  // First render of React may be slow.
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Personal Information page.
    HcaHelpers.completePersonalInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Birth information page.
    HcaHelpers.completeBirthInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Demographic information page.
    HcaHelpers.completeDemographicInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Veteran Address page.
    HcaHelpers.completeVeteranAddress(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Contact Information Page.
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Military Service Information Page.
    HcaHelpers.completeMilitaryService(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Military Service Additional Information Page.
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // VA Benefits Basic Info page.
    HcaHelpers.completeVaBenefits(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Financial disclosure page.
    HcaHelpers.completeFinancialDisclosure(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Spouse information Page.
    HcaHelpers.completeSpouseInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Child Information Page.
    HcaHelpers.completeChildInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Annual Income Page.
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Deductible Expenses Page.
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Medicare and Medicaid Page.
    HcaHelpers.completeMedicareAndMedicaid(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Insurance Information Page.
    HcaHelpers.completeInsuranceInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Additional VA Insurance Information Page.
    HcaHelpers.completeVaInsuranceInformation(client, HcaHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Review and Submit Page.
    client
      .axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // Submit message
    client
      .axeCheck('.main');

    client.end();
  });
