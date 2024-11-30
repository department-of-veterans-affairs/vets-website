import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LandingPage from './pages/MedicalRecordsLandingPage';
import sessionStatus from './fixtures/session-status.json';

// import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Authenticated Users', () => {
  it('Visits Medical Records Authenticated Users', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();
    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');
    cy.visit('my-health/medical-records');
    LandingPage.verifyDownloadOnMhvLink(
      'Go back to the previous version of My HealtheVet to download your records',
    );
    LandingPage.verifyLabsAndTestsLink();
    LandingPage.verifyNotesLink();
    LandingPage.verifyVaccinesLink();
    LandingPage.verifyAllergiesLink();
    LandingPage.verifyConditionsLink();
    LandingPage.verifyVitalsLink();
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
