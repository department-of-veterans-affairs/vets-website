import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import { currentDateAddSecondsForFileDownload } from '../../util/dateHelpers';
// SKIPPING this test as of 06/07/2024 for phase 0 because of MHV-58512 (https://jira.devops.va.gov/browse/MHV-58512)
describe.skip('Medical Records Download All PDF Functionality', () => {
  it('Visits Medical Records Download All PDF Page', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/download-all');

    cy.get('[data-testid="download-blue-button-pdf"]').click();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);
    site.verifyDownloadedPdfFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      currentDateAddSecondsForFileDownload(1),
      '',
    );
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
