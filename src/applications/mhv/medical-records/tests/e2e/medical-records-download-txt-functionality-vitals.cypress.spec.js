import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals Print or download ', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/vitals');
  });

  it('Vitals Page Toggle Menu button Print or download ', () => {
    // Click Vitals Page Blood Pressure Link
    VitalsDetailsPage.clickBloodPressureLink(0);
    // Verify Details Page PrintDownload button
    VitalsDetailsPage.verifyPrintOrDownload('Print or download');
    // Click Details Page PrintDownload button
    VitalsDetailsPage.clickPrintOrDownload();
    // Details Page should display print button for a list "Print this list"
    VitalsDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    VitalsDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download a text file (.txt) of this list"
    VitalsDetailsPage.verifyDownloadTextFile();

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
