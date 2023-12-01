import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ImmunizationDetailsPage from './pages/ImmunizationDetailsPage';
import ImmunizationsListPage from './pages/ImmunizationsListPage';
import defaultImmunizations from './fixtures/vaccines/vaccines.json';
import immunizationsDetails from './fixtures/vaccines/vaccine-8261.json';

describe('Medical Records View Immunizations', () => {
  it('Visits Medical Records View Immunizations Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/');
    ImmunizationsListPage.clickGotoImmunizationsLink(defaultImmunizations);
    ImmunizationsListPage.clickImmunizationsDetailsLink(
      0,
      immunizationsDetails,
    );
    ImmunizationDetailsPage.verifyImmunizationName(immunizationsDetails);
    ImmunizationDetailsPage.verifyImmunizationDate(immunizationsDetails);
    ImmunizationDetailsPage.verifyImmunizationLocation(immunizationsDetails);
    ImmunizationDetailsPage.verifyImmunizationNotes(immunizationsDetails);
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
