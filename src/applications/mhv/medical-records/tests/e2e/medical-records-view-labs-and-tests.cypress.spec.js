import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Labs and Tests', () => {
  it('Visits Medical Records View Labs and Tests', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');

    cy.injectAxe();
    cy.axeCheck();
  });
});
