import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

import mockNonMhvUser from './fixtures/user-mhv-account-state-none.json';
import mockNonMrUser from './fixtures/non_mr_user.json';

let site;

describe('Medical Records Landing Page', () => {
  site = new MedicalRecordsSite();

  beforeEach(() => {
    cy.intercept('/health-care/get-medical-records', cy.spy().as('staticPage'));
    cy.intercept('/my-health', cy.spy().as('myHealthPath'));
  });

  describe('as a user without an associated MHV account', () => {
    beforeEach(() => {
      site.login(mockNonMhvUser);
      // For non MHV/MR user we have less API calls.
      cy.visit('my-health/medical-records');
      cy.wait(['@vamcEhr', '@mockUser', '@featureToggles']);
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to /my-health to render an alert', () => {
      cy.get('@myHealthPath').should('have.been.called');
      cy.get('@staticPage').should('not.have.been.called');
    });
  });

  describe('as an unauthorized user', () => {
    beforeEach(() => {
      site.login(mockNonMrUser);
      // For non MHV/MR user we have less API calls.
      cy.visit('my-health/medical-records');
      cy.wait(['@vamcEhr', '@mockUser', '@featureToggles']);
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to the /my-health page', () => {
      cy.get('@myHealthPath').should('have.been.called');
      cy.get('@staticPage').should('not.have.been.called');
    });
  });
});
