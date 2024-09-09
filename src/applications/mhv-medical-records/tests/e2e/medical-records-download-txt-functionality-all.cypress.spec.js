import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadAllPage from './pages/DownloadAllPage';
import MedicalRecordsLandingPage from './pages/MedicalRecordsLandingPage';
// SKIPPING this test as of 06/07/2024 for phase 0 because of MHV-58512 (https://jira.devops.va.gov/browse/MHV-58512)
describe.skip('Medical Records Download All TXT Functionality', () => {
  it('Medical Records Download All TXT Functionality', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/download-all');

    cy.get('[data-testid="download-blue-button-txt"]').click();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);
    site.verifyDownloadedTxtFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      moment(),
      '',
    );

    DownloadAllPage.verifyBreadcrumbs('Back to Medical Records');

    DownloadAllPage.clickBreadcrumbs();

    MedicalRecordsLandingPage.verifyPageTitle();
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
