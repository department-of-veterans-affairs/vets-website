import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
