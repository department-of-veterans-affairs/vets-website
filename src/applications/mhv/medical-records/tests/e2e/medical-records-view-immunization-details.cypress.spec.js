import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ImmunizationsListPage from './pages/ImmunizationsListPage';

describe('Medical Records View Immunizations', () => {
  it('Visits Medical Records View Immunizations Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/vaccines');

    ImmunizationsListPage.clickImmunizationsDetailsLink(0);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
