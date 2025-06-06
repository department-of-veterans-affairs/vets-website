import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import { BASE_URL, BENEFIT_OFFICES_URL } from '../constants';

import cypressSetup from '../../shared/tests/cypress.setup';
import { title995 } from '../content/title';

describe('995 subtask', () => {
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

  it('should show error when nothing selected - C30850', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains(title995);
    cy.findByText(/continue/i, { selector: 'va-button' }).click();
    cy.get('va-radio')
      .shadow()
      .find('.usa-error-message')
      .contains('You must choose a claim type');

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
  });

  it('should go to intro page when compensation is selected - C30851', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains(title995);
    cy.get('va-radio-option[value="compensation"] label').click(checkOpt);
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
  });

  it('should go to non-compensation type page when another type is selected - C30852', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains(title995);
    cy.get('va-radio-option[value="other"] label').click(checkOpt);
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.get('h2').contains('Claim isn’t for a disability');
    cy.get('[text="Find the address for mailing your form"]')
      .shadow()
      .find('a')
      .should('have.attr', 'href')
      .and('contain', BENEFIT_OFFICES_URL);
    cy.contains('Download VA Form 20-0995')
      .should('have.attr', 'href')
      .and('contain', 'https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf');

    cy.axeCheck();
  });
});
