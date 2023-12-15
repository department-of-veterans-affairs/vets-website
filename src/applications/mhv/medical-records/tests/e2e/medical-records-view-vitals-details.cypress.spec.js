import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records View Vitals', () => {
  it('Visits Medical Records View Vitals Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/vitals');

    // Verify "Vitals" Page title Text
    VitalsDetailsPage.verifyVitalsPageText('Vitals');

    // Click Vitals Page Blood Pressure Link
    VitalsDetailsPage.clickBloodPressureLink(0);

    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('September 24, 2004');

    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('126/70');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('None noted');

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
