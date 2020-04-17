const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const LettersHelpers = require('./letters-helpers.js');
const Auth = require('../../../platform/testing/e2e/auth');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  LettersHelpers.initApplicationMock(token);

  // Ensure main status page renders.
  Auth.logIn(token, client, '/records/download-va-letters/letters', 3)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main')
    .assert.title('Download VA Letters and Documents | Veterans Affairs')
    .waitForElementVisible('.letters', Timeouts.slow); // First render of React may be slow.

  client.axeCheck('.main');

  client
    .click('.view-letters-button')
    .expect.element('.usa-accordion-bordered')
    .to.be.present.before(Timeouts.normal);

  client.elements('css selector', '.usa-accordion-bordered', result => {
    client.assert.equal(result.value.length, 5);
  });

  client
    .click(`.usa-accordion-bordered:nth-of-type(1)`)
    .expect.element('.va-button-primary')
    .to.be.present.before(Timeouts.normal);

  client
    .click(`.usa-accordion-bordered:nth-of-type(2)`)
    .click(`.usa-accordion-bordered:nth-of-type(3)`)
    .click(`.usa-accordion-bordered:nth-of-type(4)`)
    .click(`.usa-accordion-bordered:nth-of-type(5)`)
    .waitForElementVisible(
      `.usa-accordion-bordered:nth-of-type(5) .usa-accordion-content`,
      Timeouts.normal,
    )
    .axeCheck('.main');

  // -- Go to letters list -- //

  client
    .click('div.step-content > p:nth-child(3) > a') // link to go back to confirm-address
    .click('.view-letters-button')
    .assert.urlContains('/letters/letter-list')
    .waitForElementVisible('.step-content', Timeouts.normal)
    .click('.step-content div.form-review-panel:nth-of-type(4) button') // open the bsl accordion
    .waitForElementPresent('#militaryService', Timeouts.normal);

  // poke all the checkboxes and expect them to all be unselected
  client.expect
    .element('#militaryService')
    .to.have.attribute('checked')
    .equals('true');
  client
    .click('#militaryService')
    .expect.element('#militaryService')
    .to.not.have.attribute('checked');
  client.execute(
    () =>
      Array.from(
        document.querySelectorAll('#benefitInfoTable input[type="checkbox"]'),
      ).map(e => e.getAttribute('id')),
    [],
    obj => {
      const ids = obj.value;
      ids.forEach(id => {
        client.expect
          .element(`#${id}`)
          .to.have.attribute('checked')
          .equals('true');
        client.click(`#${id}`);
        client.expect.element(`#${id}`).to.not.have.attribute('checked');
      });
    },
  );

  // collapse the bsl accordion
  client
    .click('.step-content div.form-review-panel:nth-of-type(4) button') // open the bsl accordion
    .waitForElementNotPresent('#militaryService', Timeouts.normal);

  // poke the back button
  client
    .click('.step-content p:nth-of-type(3) a')
    .assert.urlContains('/letters/confirm-address');

  client.end();
});
