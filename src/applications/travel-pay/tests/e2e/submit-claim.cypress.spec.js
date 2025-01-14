/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe('Submit Mileage Only Claims', () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit(`${rootUrl}/file-new-claim/12345`);
    cy.injectAxeThenAxeCheck();
  });

  it('defaults to the Introduction page', () => {
    cy.get('h1').should('include.text', 'File a travel reimbursement claim');
  });

  it('should navigate through the flow', () => {
    cy.get('va-link-action[text="File a mileage only claim"]')
      .first()
      .click();

    // Mileage question should be first
    cy.get('h1').should('include.text', 'Mileage page');

    // Click the "Continue" button
    cy.selectVaButtonPairPrimary();

    // Then navigate to the Vehicle question
    cy.get('h1').should('include.text', 'Vehicle page');

    // Click the "Continue" button
    cy.selectVaButtonPairPrimary();

    // Then navigate to the Address question
    cy.get('h1').should('include.text', 'Address page');

    // Click the "Continue" button
    cy.selectVaButtonPairPrimary();

    // Then navigate to the Review page
    cy.get('h1').should('include.text', 'Review your travel claim');

    // Click the "Submit" button
    cy.get('va-button[text="Submit"]')
      .first()
      .click();

    // Submission Error page is currently the hard-coded default behavior
    cy.get('h1').should('include.text', 'We couldn’t file your claim');
  });
});
