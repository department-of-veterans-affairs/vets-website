import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';

describe('Medical Records View Notes', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    cy.visit('my-health/medical-records/summaries-and-notes');
  });

  it('Care summaries and notes Page  ', () => {
    // should display ProgressNote
    NotesDetailsPage.clickProgressNoteLink(0);
    // should display a toggle menu button
    NotesDetailsPage.clickPrintOrDownload();
    NotesDetailsPage.verifyPrintOrDownload();
    // should display print button for a Details "Print this Details"
    NotesDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    NotesDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download Details as a text file"
    NotesDetailsPage.verifyDownloadTextFile();

    // Click Back to Care summaries and notes
    NotesDetailsPage.clickBreadCrumbsLink(0);

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(1);
    // should display a toggle menu button
    NotesDetailsPage.clickPrintOrDownload();
    NotesDetailsPage.verifyPrintOrDownload();
    // should display print button for a Details "Print this Details"
    NotesDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    NotesDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download Details as a text file"
    NotesDetailsPage.verifyDownloadTextFile();

    // Click Back to Care summaries and notes
    NotesDetailsPage.clickBreadCrumbsLink(0);

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
