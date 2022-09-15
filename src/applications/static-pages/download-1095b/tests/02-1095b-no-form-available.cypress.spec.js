import Timeouts from 'platform/testing/e2e/timeouts';
import { formUnavailable, featureToggles } from './e2e/fixtures/mocks/mocks';

describe('No 1095-B Form Available for Download', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v0/feature_toggles?*', featureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/form1095_bs/available_forms', formUnavailable).as(
      'formUnavailable',
    );
    cy.login();
    cy.visit('/health-care/download-1095b/');
    cy.wait(['@featureToggles', '@formUnavailable']);
  });

  it('correctly displays that no form is available for downloading', () => {
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should('contain', '1095B Download | Veterans Affairs');
    cy.get('.usa-content', {
      timeout: Timeouts.slow,
    }).should('be.visible');

    cy.axeCheck();

    cy.get('.usa-content div va-alert h2').should(
      'have.text',
      'You don’t have a 1095-B tax form available right now',
    );

    cy.axeCheck();
  });
});
