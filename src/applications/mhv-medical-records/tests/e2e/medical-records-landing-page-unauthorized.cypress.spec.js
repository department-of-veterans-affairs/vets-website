import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

import mockNonMhvUser from './fixtures/user-mhv-account-state-none.json';
import mockNonMrUser from './fixtures/non_mr_user.json';

let site;

describe('Medical Records Landing Page', () => {
  beforeEach(() => {
    cy.intercept('/health-care/get-medical-records', cy.spy().as('staticPage'));
    cy.intercept('/my-health', cy.spy().as('myHealthPath')).as('redirect');
    site = new MedicalRecordsSite();
  });

  describe('as a user without an associated MHV account', () => {
    it('redirects to /my-health to render an alert', () => {
      site.login(mockNonMhvUser);
      site.loadPage();
      cy.get('@myHealthPath').should('have.been.called');
      cy.get('@staticPage').should('not.have.been.called');
    });
  });

  describe('as an unauthorized user', () => {
    it('redirects to the /health-care/get-medical-records static page', () => {
      site.login(mockNonMrUser);
      site.loadPage();
      cy.get('@myHealthPath').should('not.have.been.called');
      cy.get('@staticPage').should('have.been.called');
    });
  });
});
