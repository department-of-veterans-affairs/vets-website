import {
  letters,
  benefitSummaryOptions,
  address,
  newAddress,
  countries,
  states,
  mockUserData,
} from './e2e/fixtures/mocks/letters';

describe('Authed Letter Test', () => {
  it('confirms authed letter functionality', () => {
    cy.intercept('GET', '/v0/letters/beneficiary', benefitSummaryOptions).as(
      'benefitSummaryOptions',
    );
    cy.intercept('GET', '/v0/letters', letters);
    cy.intercept('GET', '/v0/address', address);
    cy.intercept('GET', '/v0/address/countries', countries);
    cy.intercept('GET', '/v0/address/states', states);
    cy.intercept('PUT', '/v0/address', newAddress);

    cy.login(mockUserData);
    cy.visit('/records/download-va-letters/letters');
    cy.injectAxe();

    // Update address
    cy.tabToElement('#mailingAddress-edit-link');
    cy.realPress('Space');
    cy.tabToElement('va-button[text="Cancel"]'); // just cancel
    cy.realPress('Space');

    // go to letters page
    cy.tabToElement('[data-cy="view-letters-button"]');
    cy.realPress('Space');

    cy.location('pathname').should(
      'equal',
      '/records/download-va-letters/letters/letter-list',
    );

    cy.get('va-accordion-item').should('exist');
    cy.get('va-accordion-item').should('have.length', 5);

    // -- Go to letters list -- //
    cy.tabToElement('va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button')
      .realPress('Enter');
    cy.axeCheck();

    cy.tabToElement('#militaryService');
    cy.realPress('Space');
    cy.get('#militaryService').should('not.be.checked');
  });
});
