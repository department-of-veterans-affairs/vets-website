import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import { BASE_URL, FORM_URL } from '../constants';

import cypressSetup from '../../shared/tests/cypress.setup';

describe('996 subtask', () => {
  beforeEach(() => {
    cypressSetup();
    window.dataLayer = [];

    resetStoredSubTask();
    cy.visit(`${BASE_URL}/start`);
    cy.location('pathname').should('eq', `${BASE_URL}/start`);
  });

  const checkOpt = {
    waitForAnimations: true,
  };

  it('should show error when nothing selected', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains('Request a Higher-Level Review');
    cy.findByText(/continue/i, { selector: 'va-button' }).click();
    cy.get('va-radio')
      .shadow()
      .find('.usa-error-message')
      .contains('You must choose a claim type');

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
  });

  it('should go to intro page when compensation is selected', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains('Request a Higher-Level Review');
    cy.get('va-radio-option[value="compensation"] label').click(checkOpt);
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
  });

  it('should go to non-compensation type page when another type is selected', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains('Request a Higher-Level Review');
    cy.get('va-radio-option[value="other"] label').click(checkOpt);
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.get('h2').contains('isn’t for a disability');
    cy.findByText('Find the address for mailing your form', { selector: 'a' })
      .should('have.attr', 'href')
      .and(
        'contain',
        '/decision-reviews/higher-level-review/#file-by-mail-in-person-or-with',
      );
    cy.contains('Download VA Form 20-0996')
      .should('have.attr', 'href')
      .and('contain', FORM_URL);

    cy.axeCheck();
  });
});
