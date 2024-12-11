import Timeouts from 'platform/testing/e2e/timeouts';
import {
  letters,
  benefitSummaryOptions,
  address,
  newAddress,
  countries,
  states,
  mockUserData,
} from './e2e/fixtures/mocks/letters';
import featureToggleDisabled from './e2e/fixtures/mocks/featureToggleDisabled.json';

describe('Authed Letter Test', () => {
  it('confirms authed letter functionality', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggleDisabled);
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

    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should(
      'contain',
      'Download VA Letters and Documents | Veterans Affairs',
    );
    cy.get('.letters', { timeout: Timeouts.slow }).should('be.visible');

    cy.axeCheck();

    cy.get('[data-cy="view-letters-button"]')
      .shadow()
      .find('button.usa-button')
      .should('not.have.attr', 'aria-disabled'); // Check for MS Voice Access usability

    cy.get('[data-cy="view-letters-button"]')
      .click()
      .then(() => {
        cy.get('va-accordion-item').should('exist');
        cy.get('va-accordion-item').should('have.length', 5);
      });

    /* Remove `cy.wait(100)` once expandAccordions uses the expand all button
     * https://github.com/department-of-veterans-affairs/vets-website/pull/20605
     */
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.expandAccordions();
    cy.axeCheck();

    // -- Go to letters list -- //

    cy.get('div.step-content > p:nth-child(4) > a')
      .click() // link to go back to confirm-address
      .then(() => {
        cy.get('[data-cy="view-letters-button"]').click();
        cy.url().should('contain', '/letters/letter-list');
        // open bsl accordion
        cy.get('.step-content va-accordion-item:nth-of-type(4)')
          .shadow()
          .find('button[aria-expanded=false]')
          .click()
          .then(() => {
            cy.get('label[name="militaryService-label"]').should('be.visible');
          });
      });

    // poke all the checkboxes and expect them to all be unselected
    cy.get('label[name="militaryService-label"]').should('be.visible');
    cy.get('#militaryService').should('be.checked');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.get('#militaryService').click({
      force: true,
    });
    cy.get('#militaryService').should('not.be.checked');
    cy.get('#benefitInfoList input[type="checkbox"]').then(checkboxes => {
      cy.wrap(Array.from(checkboxes).map(checkbox => checkbox.id)).each(id => {
        cy.get(`label[for="${id}"]`).should('be.visible');
        cy.get(`#${id}`).should('be.checked');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200);
        cy.get(`#${id}`).click('center');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200);
        cy.get(`#${id}`).should('not.be.checked');
      });
    });
    // collapse the bsl accordion
    cy.get('.step-content va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button[aria-expanded=true]')
      .click();
    cy.get('label[name="militaryService-label"]').should('not.be.visible');

    // poke the back button
    cy.get('.step-content p:nth-of-type(4) a').click();
    cy.url().should('contain', '/letters/confirm-address');
  });
});
