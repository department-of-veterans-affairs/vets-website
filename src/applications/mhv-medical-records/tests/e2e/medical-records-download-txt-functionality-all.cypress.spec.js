import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records Download All TXT Functionality', () => {
  it('Medical Records Download All TXTX Functionality', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // Given Navigate to Radiology Page
    cy.visit('my-health/medical-records/download-all');

    cy.get('[data-testid="download-blue-button-txt"]').click();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);
    site.verifyDownloadedTxtFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      moment(),
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
