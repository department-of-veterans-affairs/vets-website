import { resetStoredSubTask } from 'platform/forms/sub-task';

import { BASE_URL } from '../constants';

describe('995 subtask', () => {
  beforeEach(() => {
    window.dataLayer = [];
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: { features: [{ name: 'supplemental_claim', value: true }] },
    });

    resetStoredSubTask();
    cy.visit(`${BASE_URL}/start`);
  });

  it('should show error when nothing selected', () => {
    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.injectAxeThenAxeCheck();

    cy.findByText(/continue/i, { selector: 'va-button' }).click();
    cy.get('va-radio')
      .shadow()
      .find('#error-message')
      .contains('You must choose a claim type');

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
  });

  it('should go to intro page when compensation is selected', () => {
    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.injectAxeThenAxeCheck();

    cy.selectRadio('benefitType', 'compensation');
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
  });

  it('should go to non-compensation type page when another type is selected', () => {
    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.injectAxeThenAxeCheck();

    cy.selectRadio('benefitType', 'other');
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.get('h1').contains('Claim isn’t for a disability');
    cy.findByText('Find the address for mailing your form', { selector: 'a' })
      .should('have.attr', 'href')
      .and(
        'contain',
        '/decision-reviews/supplemental-claim#find-addresses-for-other-benef-8804',
      );
    cy.findByText('Download VA Form 20-0995', { selector: 'a' })
      .should('have.attr', 'href')
      .and('contain', 'https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf');
  });
});
