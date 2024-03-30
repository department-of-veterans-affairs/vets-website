import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Notes', () => {
  it('Visits Medical Records View Notes List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/summaries-and-notes');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
