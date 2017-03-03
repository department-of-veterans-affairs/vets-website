const _ = require('lodash');

const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const HcaHelpers = require('../util/hca-helpers.js');

function editSection(client) {
  client.pause(50).useXpath().click('(//button[text()="Edit"])[last()]').useCss();
  client.waitForElementVisible('.usa-accordion-content', Timeouts.normal);
}

function nextSection(client) {
  client.pause(50).useXpath().click('//button[text()="Next"]').useCss();
  client.waitForElementVisible('.usa-accordion-content', Timeouts.normal);
}

function verifyEdit(client, expectedValue) {
  const selector = '.review tr:nth-child(1) td:nth-child(2)';
  client.click('.usa-button-outline');
  client.waitForElementVisible(selector, Timeouts.normal);
  client.expect.element(selector).text.to.equal(expectedValue);
  nextSection(client);
}

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    HcaHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/apply/application/`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', Timeouts.slow)  // First render of React may be slow.
      .click('.form-panel .usa-button-primary');
    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);

    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    HcaHelpers.completePersonalInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    HcaHelpers.completeBirthInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    HcaHelpers.completeDemographicInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    HcaHelpers.completeVeteranAddress(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    HcaHelpers.completeMilitaryService(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    HcaHelpers.completeVaBenefits(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    HcaHelpers.completeFinancialDisclosure(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Selecting "no" for financial disclosures here causes the application to skip the next several sections:
    // Spouse information Page
    // Child Information Page
    // Annual Income Page
    // Deductible Expenses Page

    // Medicare and Medicaid Page.
    HcaHelpers.completeMedicareAndMedicaid(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    HcaHelpers.completeInsuranceInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    HcaHelpers.completeVaInsuranceInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.

    // create copy obj so that all defaults remain except what we explicitly change
    const vetInfoCopy = _.cloneDeep(HcaHelpers.testValues);

    // TODO: investigate issue with clearing/setting year fields
    // currently, setting a year after clearing removing the second number, eg. 1980 becomes 180
    // setting it to blank clears it and fills in with the original value
    // leaving for now as may be a bug, this test gets us the desired e2e test (can edit in final step and save)


    // Edit personal info
    vetInfoCopy.veteranFullName = {
      first: 'John',
      last: 'Doe'
    };
    editSection(client);
    HcaHelpers.completePersonalInformation(client, vetInfoCopy, true);
    verifyEdit(client, 'John Doe');

    // Edit birth info
    vetInfoCopy.veteranDateOfBirth = {
      month: '1',
      day: '20',
      year: ''
    };
    editSection(client);
    client
      .waitForElementVisible('input[name="veteranBirthYear"]', Timeouts.normal)
      .clearValue('input[name="veteranBirthYear"]');
    HcaHelpers.completeBirthInformation(client, vetInfoCopy, true);
    verifyEdit(client, '1/20/1980');

    // Edit demographic info
    vetInfoCopy.gender = 'F';
    editSection(client);
    HcaHelpers.completeDemographicInformation(client, vetInfoCopy, true);
    verifyEdit(client, 'F');

    // Edit address
    vetInfoCopy.veteranAddress.street = '123 Foo St.';
    editSection(client);
    client
      .waitForElementVisible('input[name="address"]', Timeouts.normal)
      .clearValue('input[name="address"]');
    HcaHelpers.completeVeteranAddress(client, vetInfoCopy, true);
    verifyEdit(client, '123 Foo St.');

    nextSection(client);

    // Edit service branch
    vetInfoCopy.lastServiceBranch = 'coast guard';
    vetInfoCopy.lastDischargeDate.year = '';
    vetInfoCopy.lastEntryDate.year = '';
    editSection(client);
    HcaHelpers.completeMilitaryService(client, vetInfoCopy, true);
    verifyEdit(client, 'Coast Guard');

    nextSection(client);

    nextSection(client);

    nextSection(client);

    // Edit spouse information
    vetInfoCopy.spouseFullName.first = 'Anne';
    editSection(client);
    HcaHelpers.completeSpouseInformation(client, vetInfoCopy, true);
    verifyEdit(client, 'Anne Hathaway');

    client
      .pause(500)
      .execute((selector) => {
        document.querySelector(selector).scrollIntoView();
      }, ['input[name="privacyAgreement"]'])
      .click('input[name="privacyAgreement"]')
      .click('.form-panel .usa-button-primary');

    client.getLog('browser', (result) => {
      // eslint-disable-next-line no-console
      console.log(result);
    });

    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;


    client.end();
  });
