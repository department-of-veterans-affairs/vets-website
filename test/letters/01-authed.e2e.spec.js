import startCase from 'lodash/startCase';

const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const LettersHelpers = require('../e2e/letters-helpers.js');
const LoginHelpers = require('../e2e/login-helpers');

const oldAddress = LettersHelpers.address.data.attributes.address;
const oldAddressOne = startCase(oldAddress.addressOne.toLowerCase());
const oldAddressTwo = oldAddress.addressTwo ? `, ${startCase(oldAddress.addressTwo.toLowerCase())}` : '';
const oldAddressThree = oldAddress.addressThree ? `, ${startCase(oldAddress.addressThree.toLowerCase())}` : '';
const oldStreetAddress = oldAddressOne + oldAddressTwo + oldAddressThree;
const oldCityStateZIP = `${oldAddress.militaryPostOfficeTypeCode}, ${oldAddress.militaryStateCode} ${oldAddress.zipCode}`;

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

    client.axeCheck('.main');

    // Checking if full name has rendered
    client.expect.element('h5.letters-address').text.to.contain('William Shakespeare');

    // Checking if address has rendered correctly
    client.expect.element('.street').text.to.contain(oldStreetAddress);
    client.expect.element('.city-state').text.to.contain(oldCityStateZIP);

    // Update address and cancel
    client
      .click('.usa-button-secondary')
      .expect.element('select').to.be.present.before(Timeouts.normal);

    client
      .setValue('select[name="country"]', 'United Kingdom')
      .clearValue('input[name="city"]')
      .fill('input[name="city"]', 'Stratford-upon-Avon')
      .click('.usa-button-secondary')
      .waitForElementVisible('.city-state', Timeouts.normal)
      .expect.element('.city-state').text.to.contain(oldCityStateZIP);

    // Update address and save
    client
      .click('.usa-button-secondary')
      .expect.element('select').to.be.present.before(Timeouts.normal);

    client
      .clearValue('input[name="city"]')
      .fill('input[name="city"]', LettersHelpers.newAddress.city)
      .setValue('select[name="state"]', LettersHelpers.newAddress.state)
      .clearValue('input[name="postalCode"]')
      .fill('input[name="postalCode"]', LettersHelpers.newAddress.zipCode)
      .click('.usa-button-primary')
      .waitForElementVisible('.city-state', Timeouts.normal)
      .expect.element('.city-state').text.to.contain('Chicago, Illinois 60602');


    client
      .click('.view-letters-button')
      .expect.element('.usa-accordion-bordered').to.be.present.before(Timeouts.normal);

    client
      .click('.usa-accordion-bordered')
      .expect.element('.va-button-primary').to.be.present.before(Timeouts.normal);

    client
      .click('div.step-content > p:nth-child(3) > a') // link to go back to confirm-address
      .expect.element('.city-state').to.be.present.before(Timeouts.normal);

    client.end();
  }
);
