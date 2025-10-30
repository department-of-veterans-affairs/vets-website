import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';

describe('Medical Records Care summaries and notes', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // cy.visit('my-health/medical-records');
    NotesListPage.gotoNotesList();
  });

  it('Care summaries and notes Page Toggle Menu button Print or download ', () => {
    // Given Navigate to Notes Page
    NotesListPage.clickNotesDetailsLink(0);
    // should display a toggle menu button
    NotesDetailsPage.clickPrintOrDownload();
    NotesDetailsPage.verifyPrintOrDownload();

    // should display print button for a Details "Print this Details"
    NotesDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    NotesDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    NotesDetailsPage.verifyDownloadTextFile();

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
