import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records Landing Page', () => {
  beforeEach(() => {
    cy.intercept('/?next=*', cy.spy().as('rootPath')).as('redirect');
  });

  describe('as an unauthenticated user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects the user to /?next=* to prompt to sign in', () => {
      const site = new MedicalRecordsSite();
      site.mockFeatureToggles();
      site.mockVamcEhr();
      cy.visit('/my-health/medical-records/');
      cy.wait(['@featureToggles', '@vamcEhr', '@redirect']);
      cy.get('@rootPath').should('have.been.called');
      // cy.findByRole('heading', { level: 1, name: 'Sign in' });
    });
  });
});
