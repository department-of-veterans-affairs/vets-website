import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LandingPage from './pages/MedicalRecordsLandingPage';
// import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Authenticated Users', () => {
  it('Visits Medical Records Authenticated Users', () => {
    const site = new MedicalRecordsSite();
    site.login(true);
    site.loadPageAuthenticated();
    cy.visit('my-health/medical-records');
    LandingPage.verifyDownloadOnMhvLink(
      'Go back to the previous version of My HealtheVet to download your records',
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
