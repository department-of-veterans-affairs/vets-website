const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    // Ensure education apply-wizard page renders.
    // Open education apply wizard
    client
      .url(`${E2eHelpers.baseUrl}/education/apply/`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Education Benefits Application Process: Vets.gov')
      .waitForElementVisible('.wizard-container', Timeouts.normal)
      .click('.wizard-button')
      .waitForElementVisible('[data-question="create-or-update"]', Timeouts.normal)
      .expect.element('[data-question="create-or-update"]').to.have.css('display').equals('block');

    // Create a new application
    client
      .click('#new-application')
      .waitForElementVisible('[data-question="create"]', Timeouts.normal)
      .expect.element('[data-question="create"]').to.have.css('display').equals('block');

    // Select veteran
    client
      .click('#is-veteran')
      .waitForElementVisible('[data-question="national-call-to-service"]', Timeouts.normal)
      .expect.element('[data-question="national-call-to-service"]').to.have.css('display').equals('block');

    // Select national call to service
    client
      .click('#is-ncts')
      .waitForElementVisible('#apply-now-button', Timeouts.normal)
      .expect.element('#apply-now-button').to.have.css('display').equals('block');

    client
      .expect.element('#apply-now-button').to.have.attribute('href').which.contains('/education/apply-for-education-benefits/application/1990n/introduction');

    client
      .expect.element('#ncts-warning').to.have.css('display').equals('block');

    // Select non-veteran
    client
      .click('#is-not-veteran')
      .expect.element('#apply-now-button').to.have.css('display').equals('none');

    client
      .expect.element('#ncts-warning').to.have.css('display').equals('none');

    client
      .waitForElementVisible('[data-question="create-dependent"]', Timeouts.normal)
      .expect.element('[data-question="create-dependent"]').to.have.css('display').equals('block');

    // Select dependent
    client
      .click('#create-dependent')
      .waitForElementVisible('#apply-now-button', Timeouts.normal)
      .expect.element('#apply-now-button').to.have.css('display').equals('block');

    client
      .expect.element('#apply-now-button').to.have.attribute('href').which.contains('/education/apply-for-education-benefits/application/5490/introduction');

    // Select non-dependent
    client
      .click('#create-non-dependent')
      .expect.element('#apply-now-button').to.have.css('display').equals('none');

    client
      .waitForElementVisible('[data-question="create-transfer"]', Timeouts.normal)
      .expect.element('[data-question="create-transfer"]').to.have.css('display').equals('block');

    // Select transfer
    client
      .click('#create-transfer')
      .waitForElementVisible('#apply-now-button', Timeouts.normal)
      .expect.element('#apply-now-button').to.have.css('display').equals('block');

    client
      .expect.element('#apply-now-button').to.have.attribute('href').which.contains('/education/apply-for-education-benefits/application/1990e/introduction');

    // Select non-transfer
    client
      .click('#create-non-transfer')
      .waitForElementVisible('a#apply-now-button', Timeouts.normal)
      .expect.element('#apply-now-button').to.have.css('display').equals('block');

    client
      .expect.element('#transfer-warning').to.have.css('display').equals('block');

    client
      .expect.element('#apply-now-button').to.have.attribute('href').which.contains('/education/apply-for-education-benefits/application/1990e/introduction');

    // Update an existing application
    client
      .click('#existing-application')
      .expect.element('#apply-now-button').to.have.css('display').equals('none');

    client
      .waitForElementVisible('div[data-question="update"]', Timeouts.normal)
      .expect.element('div[data-question="update"]').to.have.css('display').equals('block');

    // Select dependent
    client
      .click('#update-dependent')
      .waitForElementVisible('#apply-now-button', Timeouts.normal)
      .expect.element('#apply-now-button').to.have.css('display').equals('block');

    client
      .expect.element('#transfer-warning').to.have.css('display').equals('none');

    client
      .expect.element('#apply-now-button').to.have.attribute('href').which.contains('/education/apply-for-education-benefits/application/5495/introduction');

    // Select non-dependent
    client
      .click('#update-non-dependent')
      .waitForElementVisible('#apply-now-button', Timeouts.normal)
      .expect.element('#apply-now-button').to.have.css('display').equals('block');

    client
      .expect.element('#apply-now-button').to.have.attribute('href').which.contains('/education/apply-for-education-benefits/application/1995/introduction');

    // Navigate to application
    client
      .click('#apply-now-button')
      .pause(1000)
      .assert.urlContains('/education/apply-for-education-benefits/application/1995/introduction');

    client
      .end();
  }
);
