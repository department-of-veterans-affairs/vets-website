// import defaultNotes from '../fixtures/Notes.json';
import BaseDetailsPage from './BaseDetailsPage';

class NotesDetailsPage extends BaseDetailsPage {
  clickProgressNoteLink = (progressNoteHeading, index = 0) => {
    const query = () =>
      cy.findAllByTestId('note-name', { includeShadowDom: true });

    // Wait until at least one match exists (retried)
    query()
      .filter(`:contains("${progressNoteHeading}")`)
      .should('have.length.greaterThan', 0);

    // Capture the specific target
    query()
      .filter(`:contains("${progressNoteHeading}")`)
      .eq(index)
      .as('noteToClick');

    cy.get('@noteToClick').scrollIntoView();
    cy.get('@noteToClick').should('be.visible');
    cy.get('@noteToClick').click();
  };

  clickDischargeSummaryLink = (index = 0) => {
    this.clickProgressNoteLink('Discharge Summary', index);
  };

  verifyProgressNoteTitle = expectedTitle => {
    cy.get('[data-testid="progress-note-name"]').should(
      'contain',
      expectedTitle,
    );
  };

  verifyDischargeSummaryTitle = expectedTitle => {
    cy.get('[data-testid="admission-discharge-name"]').should(
      'contain',
      expectedTitle,
    );
  };

  clickBreadCrumbsLink = breadcrumb => {
    // Click Back to Care summaries and notes
    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .eq(breadcrumb)
      .click();
  };

  verifyProgressNoteLocation = progressLocation => {
    // Verify Progress Note Details Location
    cy.get('[data-testid="progress-location"]').should('be.visible');
    cy.get('[data-testid="progress-location"]').contains(progressLocation);
  };

  verifyProgressNoteWrittenBy = progressWrittenBy => {
    // Progress Note Details Written by
    cy.get('[data-testid="note-record-written-by"]').should('be.visible');
    cy.get('[data-testid="note-record-written-by"]').contains(
      progressWrittenBy,
    );
  };

  verifyProgressNoteSignedDate = progressSignedDate => {
    cy.get('[data-testid="progress-signed-date"]').should('be.visible');
    cy.get('[data-testid="progress-signed-date"]').contains(progressSignedDate);
  };

  verifyProgressNoteSignedBy = progressSignedBy => {
    cy.get('[data-testid="note-record-signed-by"]').should('be.visible');
    cy.get('[data-testid="note-record-signed-by"]').contains(progressSignedBy);
  };

  verifyProgressNoteRecord = progressNote => {
    cy.get('[data-testid="note-record"]').should('be.visible');
    cy.get('[data-testid="note-record"]').contains(progressNote);
  };

  // ..........Discharge Summary
  verifyDischargeSummaryHeadingDate = date => {
    cy.get('[data-testid="header-time"]').should('be.visible');
    cy.get('[data-testid="header-time"]').contains(date);
  };

  verifyDischargeSummaryLocation = summaryLocation => {
    // Discharge Summary Note Details Location
    cy.get('[data-testid="note-record-location"]').should('be.visible');
    cy.get('[data-testid="note-record-location"]').contains(summaryLocation);
  };

  verifyDischargeSummaryAdmissionDate = admissionDate => {
    // Discharge Summary Details Admission Date
    cy.get('[data-testid="note-admission-date"]').should('be.visible');
    cy.get('[data-testid="note-admission-date"]').contains(admissionDate);
  };

  verifyDischargeSummaryDischargeDate = dischargeDate => {
    // Discharge Summary Details DischargeDate
    cy.get('[data-testid="note-discharge-date"]').should('be.visible');
    cy.get('[data-testid="note-discharge-date"]').contains(dischargeDate);
  };

  verifyDischargeSummaryAdmittedBy = admittedBy => {
    // Discharge Summary Admitted By
    cy.get('[data-testid="note-admitted-by"]').should('be.visible');
    cy.get('[data-testid="note-admitted-by"]').contains(admittedBy);
  };

  verifyDischargeSummaryDischargedBy = dischargedBy => {
    // Discharge Summary discharged By
    cy.get('[data-testid="note-discharged-by"]').should('be.visible');
    cy.get('[data-testid="note-discharged-by"]').contains(dischargedBy);
  };

  verifyDischargeSummaryNote = summaryNote => {
    // Discharge Summary Note
    cy.get('[data-testid="note-summary"]').should('be.visible');
    cy.get('[data-testid="note-summary"]').contains(summaryNote);
  };
}

export default new NotesDetailsPage();
