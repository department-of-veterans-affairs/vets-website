import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LandingPage from './pages/MedicalRecordsLandingPage';

describe('Medical Records Authenticated Users', () => {
  it('Visits Medical Records Authenticated Users', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();
    LandingPage.handleSession();
    cy.visit('my-health/medical-records');
    // LandingPage.verifyDownloadOnMhvLink(
    //   'Go back to the previous version of My HealtheVet to download your records',
    // );
    LandingPage.verifyLabsAndTestsLink();
    LandingPage.verifyNotesLink();
    LandingPage.verifyVaccinesLink();
    LandingPage.verifyAllergiesLink();
    LandingPage.verifyConditionsLink();
    LandingPage.verifyVitalsLink();
    LandingPage.verifyGpsLink();
    LandingPage.verifySettingsLink();
    LandingPage.verifyDownloadReportsLink();
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
