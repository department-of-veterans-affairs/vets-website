import Timeouts from 'platform/testing/e2e/timeouts';
import {
  letters,
  benefitSummaryOptions,
  address,
  newAddress,
  countries,
  states,
  mockUserData,
} from './e2e/fixtures/mocks/lh_letters';

describe('Keyboard Only Letter Test', () => {
  it('confirms authed letter functionality', () => {
    cy.intercept(
      'GET',
      '/v0/letters_generator/beneficiary',
      benefitSummaryOptions,
    ).as('benefitSummaryOptions');
    cy.intercept('GET', '/v0/letters_generator', letters).as('letters');
    cy.intercept('GET', '/v0/address', address).as('address');
    cy.intercept('GET', '/v0/address/countries', countries).as('countries');
    cy.intercept('GET', '/v0/address/states', states).as('states');
    cy.intercept('PUT', '/v0/address', newAddress).as('newAddress');

    cy.login(mockUserData);
    cy.visit('/records/download-va-letters/letters');
    cy.injectAxe();
    cy.get('.letters', { timeout: Timeouts.slow }).should('be.visible');

    // Update address
    cy.tabToElement('#edit-mailing-address');
    cy.realPress('Space');
    cy.tabToElement('button:contains("Cancel")'); // just cancel
    cy.realPress('Space');

    cy.get('va-accordion-item').should('exist');
    cy.get('va-accordion-item').should('have.length', 5);

    // -- Go to letters list -- //
    cy.tabToElement('va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button')
      .realPress('Enter');
    cy.axeCheck();

    cy.get('va-checkbox#militaryService')
      .shadow()
      .find('input[type="checkbox"]')
      .focus();
    cy.realPress('Space');
    cy.get('va-checkbox#militaryService')
      .shadow()
      .find('input[type="checkbox"]')
      .should('not.be.checked');
  });
});
