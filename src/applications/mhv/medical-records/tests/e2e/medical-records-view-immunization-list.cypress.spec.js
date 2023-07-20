// import { cy } from 'date-fns/locale';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Immunizations', () => {
  it('Visits Medical Records View Immunization List', () => {
    const site = new MedicalRecordsSite();
    cy.visit('my-health/medical-records');
    site.login();

    // click on the vaccines link
    cy.get('[href="/my-health/medical-records/health-history/vaccines"]')
      .first()
      .click();
    // cy.get('[data-testid="vaccines-link"]').click();

    // // click on the first vaccine listed
    // cy.contains('Details').click();
    // // cy.get('[data-testid="record-list-item"] a').first().click();

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
