import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records Landing Page', () => {
  describe('as an unauthenticated user', () => {
    it('prompts the user to sign in', () => {
      const site = new MedicalRecordsSite();
      site.mockFeatureToggles();
      site.mockVamcEhr();
      cy.visit('/my-health/medical-records');
      cy.findByRole('heading', { level: 1, name: 'Sign in' });
      cy.injectAxeThenAxeCheck();
    });
  });
});
