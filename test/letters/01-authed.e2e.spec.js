const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const LettersHelpers = require('../e2e/letters-helpers.js');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    LettersHelpers.initApplicationMock(token);

    // Ensure main status page renders.
    LoginHelpers.logIn(token, client, '/letters', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main')
      .assert.title('Download VA Letters: Vets.gov')
      .waitForElementVisible('.letters', Timeouts.slow);  // First render of React may be slow.

    // Checking if full name has rendered
    client.expect.element('h5.letters-address').text.to.contain('William Shakespeare');

    // Checking if address has rendered correctly
    client.expect.element('.street').text.to.contain('57 Columbus Strassa, Ben Franklin Village');
    client.expect.element('.city-state').text.to.contain('APO, AE 09028');

    // Update address and cancel
    client
      .click('.usa-button-outline')
      .expect.element('select').to.be.present;

    client
      .setValue('select[name="country"]', 'United Kingdom')
      .clearValue('input[name="city"]')
      .fill('input[name="city"]', 'Stratford-upon-Avon')
      .click('.usa-button-outline')
      .expect.element('.city-state').text.to.contain('APO, AE 09028');

    // Update address and save
    client
      .click('.usa-button-outline')
      .expect.element('select').to.be.present;

    client
      .clearValue('input[name="city"]')
      .fill('input[name="city"]', LettersHelpers.newAddress.city)
      .setValue('select[name="state"]', LettersHelpers.newAddress.state)
      .clearValue('input[name="postalCode"]')
      .fill('input[name="postalCode"]', LettersHelpers.newAddress.zipCode)
      .click('.usa-button-primary')
      .expect.element('.city-state').text.to.contain('Chicago, Illinois 60602');

    client.end();
  }
);
