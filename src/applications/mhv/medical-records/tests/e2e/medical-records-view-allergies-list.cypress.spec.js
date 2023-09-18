import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';
// import { cy } from 'date-fns/locale';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies List', () => {
    const site = new MedicalRecordsSite();

    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergies');

    cy.visit('my-health/medical-records/allergies');
    site.login();

    cy.get('[data-testid="print-records-button"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('[data-testid="print-allergies-list-1"').should('be.visible');

    cy.get('[data-testid="download-allergies-list-2"]').should('be.visible');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
