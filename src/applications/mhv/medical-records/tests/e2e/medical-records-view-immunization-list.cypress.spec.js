import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Immunizations', () => {
  it('Visits Medical Records View Immunization List', () => {
    const site = new MedicalRecordsSite();
    cy.visit('my-health/medical-records');
    site.login();
    // Add clicks to navigate to .../health-history/vaccines
    cy.get('[data-testid="health-history-link"]').click();
    // cy.get('[href="/my-health/medical-records/health-history/vaccines"]').first().click();
    cy.get('[data-testid="vaccines-link"]').click();
    cy.get('[data-testid="record-list-item"] a')
      .first()
      .click();
    cy.injectAxe();
    // cy.axeCheck();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
