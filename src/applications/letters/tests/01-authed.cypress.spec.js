import Timeouts from 'platform/testing/e2e/timeouts';
import {
  letters,
  benefitSummaryOptions,
  address,
  newAddress,
  countries,
  states,
  mockUserData,
} from './e2e/fixtures/mocks/letters.js';

describe('Authed Letter Test', () => {
  it('confirms authed letter functionality', () => {
    cy.intercept('GET', '/v0/letters/beneficiary', benefitSummaryOptions).as(
      'benefitSummaryOptions',
    );
    cy.intercept('GET', '/v0/letters', letters).as('letters');
    cy.intercept('GET', '/v0/address', address).as('address');
    cy.intercept('GET', '/v0/address/countries', countries).as('countries');
    cy.intercept('GET', '/v0/address/states', states).as('states');
    cy.intercept('PUT', '/v0/address', newAddress).as('newAddress');

    cy.login(mockUserData);
    cy.visit('/records/download-va-letters/letters');

    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should(
      'contain',
      'Download VA Letters and Documents | Veterans Affairs',
    );
    cy.get('.letters', { timeout: Timeouts.slow }).should('be.visible');

    cy.axeCheck();

    cy.get('.view-letters-button')
      .click()
      .then(() => {
        cy.get('.usa-accordion-bordered', { timeout: Timeouts.normal }).should(
          'exist',
        );
        cy.get('.usa-accordion-bordered').should('have.length', 5);
      });

    cy.get(`.usa-accordion-bordered:nth-of-type(1)`)
      .click()
      .then(() => {
        cy.get('.va-button-primary', { timeout: Timeouts.normal }).should(
          'exist',
        );
      });

    cy.get(`.usa-accordion-bordered:nth-of-type(2)`).click();
    cy.get(`.usa-accordion-bordered:nth-of-type(3)`).click();
    cy.get(`.usa-accordion-bordered:nth-of-type(4)`).click();
    cy.get(`.usa-accordion-bordered:nth-of-type(5)`).click();

    cy.get(
      `.usa-accordion-bordered:nth-of-type(5) .usa-accordion-content`,
    ).should('be.visible');

    cy.axeCheck();

    // -- Go to letters list -- //

    cy.get('div.step-content > p:nth-child(4) > a')
      .click() // link to go back to confirm-address
      .then(() => {
        cy.get('.view-letters-button').click();
        cy.url().should('contain', '/letters/letter-list');
        cy.get('.step-content', { timeout: Timeouts.normal });
        cy.get('.step-content div.form-review-panel:nth-of-type(4) button')
          .click() // open the bsl accordion
          .then(() => {
            cy.get('#militaryService', { timeout: Timeouts.normal });
          })
          .should('exist');
      });

    // poke all the checkboxes and expect them to all be unselected
    cy.get('#militaryService', { timeout: Timeouts.normal }).should('exist');
    cy.get('#militaryService', { timeout: Timeouts.normal }).should(
      'be.checked',
    );
    cy.get('#militaryService', { timeout: Timeouts.normal }).click({
      force: true,
    });
    cy.get('#militaryService', { timeout: Timeouts.normal }).should(
      'not.be.checked',
    );
    cy.get('#benefitInfoTable input[type="checkbox"]').then(checkboxes => {
      cy.wrap(Array.from(checkboxes).map(checkbox => checkbox.id)).each(id => {
        cy.get(`#${id}`, { timeout: Timeouts.normal }).should('exist');
        cy.get(`#${id}`, { timeout: Timeouts.normal }).should('be.checked');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(`#${id}`, { timeout: Timeouts.normal }).click('center');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(`#${id}`, { timeout: Timeouts.normal }).should('not.be.checked');
      });
    });
    // collapse the bsl accordion
    cy.get(
      '.step-content div.form-review-panel:nth-of-type(4) .usa-accordion-button',
    ).click();
    cy.get('#militaryService', { timeout: Timeouts.normal }).should(
      'not.exist',
    );

    // poke the back button
    cy.get('.step-content p:nth-of-type(4) a').click();
    cy.url().should('contain', '/letters/confirm-address');
  });
});
