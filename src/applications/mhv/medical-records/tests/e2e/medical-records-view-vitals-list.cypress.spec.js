import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Vitals', () => {
  it('Visits Medical Records View Vitals List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/vitals');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
