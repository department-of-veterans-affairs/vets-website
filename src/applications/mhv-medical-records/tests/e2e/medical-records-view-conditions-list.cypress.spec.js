import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Conditions', () => {
  it('Visits Medical Records View Conditions List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/conditions');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
