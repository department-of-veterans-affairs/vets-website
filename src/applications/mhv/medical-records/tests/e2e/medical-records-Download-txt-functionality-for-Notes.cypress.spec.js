import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesListPage from './pages/NotesListPage';

describe('Medical Records Care summaries and notes', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/summaries-and-notes');
  });

  it('Care summaries and notes Page Toggle Menu button Print or download ', () => {
    // Given Navigate to Notes Page

    NotesListPage.clickNotesDetailsLink(0);
    // should display a toggle menu button

    NotesListPage.verifyPrintOrDownload();

    // should display print button for a list "Print this list"
    NotesListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    NotesListPage.verifyDownloadPDF();

    // should display a download text file button "Download list as a text file"
    NotesListPage.verifyDownloadTextFile();

    // PathologyListPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/Pathology_report.pdf`);

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
