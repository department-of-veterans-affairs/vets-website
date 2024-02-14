import defaultNotes from '../fixtures/notes/notes.json';

class NotesListPage {
  clickGotoNotesLink = (notes = defaultNotes, waitForNotes = false) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/clinical_notes',
      notes,
    ).as('notesList');
    cy.visit('my-health/medical-records/summaries-and-notes');
    // cy.get('[href="/my-health/medical-records/notes"]').click();
    if (waitForNotes) {
      cy.wait('@notesList');
    }
  };

  verifyCareSummariesAndNotesPageTitle = () => {
    // Very Care Summary Page title Text
    cy.get('[data-testid="care-summaries-and-notes"]').should('be.visible');
  };

  clickNotesDetailsLink = (_NotesIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_NotesIndex)
      .click();
  };

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyDownloadPDF = () => {
    // should display a download pdf file button "Download PDF of this page"
    cy.get('[data-testid="printButton-1"]').should('be.visible');
  };

  verifyDownloadTextFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-2"]').should('be.visible');
    // cy.get('[data-testid="printButton-2').click();
  };

  clickDownloadPDFFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new NotesListPage();
