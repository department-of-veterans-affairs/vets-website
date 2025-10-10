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

describe('Authed Letter Test', () => {
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

    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should(
      'contain',
      'Your VA benefit letters and documents | Veterans Affairs',
    );
    cy.get('.letters', { timeout: Timeouts.slow }).should('be.visible');

    cy.axeCheck();

    /* Remove `cy.wait(100)` once expandAccordions uses the expand all button
     * https://github.com/department-of-veterans-affairs/vets-website/pull/20605
     */
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.expandAccordions();
    cy.axeCheck();

    // poke all the checkboxes and expect them to all be unselected

    cy.get('#va-bsl-options va-checkbox').each($checkbox => {
      const id = $checkbox.attr('id');
      cy.get(`va-checkbox#${id}`)
        .shadow()
        .find('input[type="checkbox"]')
        .should('be.checked');
      cy.get(`va-checkbox#${id}`)
        .shadow()
        .find('input[type="checkbox"]')
        .click({
          force: true,
        });
      cy.get(`va-checkbox#${id}`)
        .shadow()
        .find('input[type="checkbox"]')
        .should('not.be.checked');
    });

    // collapse the bsl accordion
    cy.get('.step-content va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button[aria-expanded=true]')
      .click({
        force: true,
      });
    cy.contains('label', 'Military service').should('not.be.visible');
  });
});
