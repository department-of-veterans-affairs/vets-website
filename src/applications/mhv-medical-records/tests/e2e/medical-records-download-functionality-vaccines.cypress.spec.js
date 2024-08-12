import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import defaultVaccines from './fixtures/vaccines/vaccines.json';

describe('Medical Records Labs and Tests List Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/');
  });

  it('Vaccine Details page Toggle Menu button Print or download ', () => {
    VaccinesListPage.goToVaccines(defaultVaccines);
    VaccinesListPage.clickVaccinesDetailsLink(0);
    // should display a toggle menu button
    VaccineDetailsPage.verifyPrintOrDownload();
    VaccineDetailsPage.clickPrintOrDownload();

    // should display print button for a Details "Print this Details"
    VaccineDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    VaccineDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    VaccineDetailsPage.verifyDownloadTextFile();

    VaccineDetailsPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/Pathology_report.pdf`);
    site.verifyDownloadedPdfFile(
      'VA-labs-and-tests-Details-Mhvtp',
      moment(),
      '',
    );

    VaccineDetailsPage.clickPrintOrDownload();
    VaccineDetailsPage.clickDownloadTxtFile();
    site.verifyDownloadedTxtFile(
      'VA-labs-and-tests-details-Safari-Mhvtp',
      moment(),
      '',
    );
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
