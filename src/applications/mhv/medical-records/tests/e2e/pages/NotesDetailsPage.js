// import defaultNotes from '../fixtures/Notes.json';

class NotesDetailsPage {
  /*
    clickGotoNotesLink = (
     /* Notes = defaultNotes,
      waitForNotes = false,
    ) => {
      cy.intercept(
        'GET',
        '/my_health/v1/medical_records/notes',
        Notes,
      ).as('NotesList');
      cy.get('[href="/my-health/medical-records/notes"]').click();
      if (waitForNotes) {
        cy.wait('@NotesList');
      }
    });
  }
  */
  verifyCareSummaryPageText = () => {
    // Very Care Summary Page title Text
    cy.get('[data-testid="care-summaries-and-notes"]').should('be.visible');
  };

  clickProgressNoteLink = (_ProgressNote = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_ProgressNote)
      .click();
  };

  clickDischargeSummaryLink = (_DischargeSummary = 1) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_DischargeSummary)
      .click();
  };

  clickBreadCrumbsLink = (_breadcrumb = 0) => {
    // Click Back to Care summaries and notes
    cy.get('[data-testid="breadcrumbs"]')
      .find('a')
      .eq(_breadcrumb)
      .click();
  };

  verifyProgressNoteLocation = () => {
    // Verify Progress Note Details Location
    cy.get('[data-testid="note-record-location"]').should('be.visible');
  };

  verifyProgressNoteSignedBy = () => {
    // Progress Note Details Signed by
    cy.get('[data-testid="note-record-signed-by"]').should('be.visible');
  };

  verifyProgressNoteSignedDate = () => {
    cy.get('[data-testid="note-record-signed-date"]').should('be.visible');
  };

  verifyProgressNoteRecord = () => {
    cy.get('[data-testid="note-record"]').should('be.visible');
  };

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  verifyDischargeSummaryLocation = () => {
    // Discharge Summary Note Details Location
    cy.get('[data-testid="note-record-location"]').should('be.visible');
  };

  verifyDischargeSummaryAdmissionDate = () => {
    // Discharge Summary Details Admission Date
    cy.get('[data-testid="note-admission-date"]').should('be.visible');
  };

  verifyDischargeSummaryDischargeDate = () => {
    // Discharge Summary Details DischargeDate
    cy.get('[data-testid="note-discharge-date"]').should('be.visible');
  };

  verifyDischargeSummaryAdmittedBy = () => {
    // Discharge Summary Admitted By
    cy.get('[data-testid="note-admitted-by"]').should('be.visible');
  };

  verifyDischargeSummaryDischargedBy = () => {
    // Discharge Summary discharged By
    cy.get('[data-testid="note-discharged-by"]').should('be.visible');
  };

  verifyDischargeSummaryNote = () => {
    // Discharge Summary Note
    cy.get('[data-testid="note-summary"]').should('be.visible');
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

export default new NotesDetailsPage();
