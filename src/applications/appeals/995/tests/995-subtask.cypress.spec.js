import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import { BASE_URL } from '../constants';

describe('995 subtask', () => {
  beforeEach(() => {
    window.dataLayer = [];
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: { features: [{ name: 'supplemental_claim', value: true }] },
    });

    resetStoredSubTask();
    cy.visit(`${BASE_URL}/start`);
    cy.location('pathname').should('eq', `${BASE_URL}/start`);
  });

  it('should show error when nothing selected - C30850', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains('File a Supplemental Claim');
    cy.findByText(/continue/i, { selector: 'va-button' }).click();
    cy.get('va-radio')
      .shadow()
      .find('#error-message')
      .contains('You must choose a claim type');

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
  });

  it('should go to intro page when compensation is selected - C30851', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains('File a Supplemental Claim');
    cy.selectRadio('benefitType', 'compensation');
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
  });

  it('should go to non-compensation type page when another type is selected - C30852', () => {
    cy.injectAxeThenAxeCheck();

    cy.get('h1').contains('File a Supplemental Claim');
    cy.selectRadio('benefitType', 'other');
    cy.findByText(/continue/i, { selector: 'va-button' }).click();

    cy.location('pathname').should('eq', `${BASE_URL}/start`);
    cy.get('h2').contains('Claim isn’t for a disability');
    cy.findByText('Find the address for mailing your form', { selector: 'a' })
      .should('have.attr', 'href')
      .and(
        'contain',
        '/decision-reviews/supplemental-claim#find-addresses-for-other-benef-8804',
      );
    cy.contains('Download VA Form 20-0995');

    cy.axeCheck();
  });
});
