import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies-empty.json';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies List No Allergies', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);

    AllergiesListPage.clickGotoAllergiesLink(allergies);

    cy.get('[data-testid="no-records-message"]').should('be.visible');

    cy.get('[data-testid="print-records-button"]').should('not.exist');
    // .click({ force: true });

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
