import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records/vitals');
  });

  it('Vitals Details Heart Rate', () => {
    // Click Vitals Page Heart Rate  Link
    VitalsDetailsPage.clickHeartRateLink(1);
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('December 25, 2004 12:00 a.m.');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('185 /min');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('a bit fast');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  // afterEach(() => {
  //   VitalsDetailsPage.clickBreadCrumbsLink(0);
  // });
});
