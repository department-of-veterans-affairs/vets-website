import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ImmunizationsListPage from './pages/ImmunizationsListPage';

describe('Medical Records View Immunizations', () => {
  it('Visits Medical Records View Immunization List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/');
    ImmunizationsListPage.clickGotoImmunizationsLink();
    // click on the vaccines link

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
