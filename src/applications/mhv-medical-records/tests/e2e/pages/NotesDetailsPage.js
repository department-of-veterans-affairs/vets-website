// import defaultNotes from '../fixtures/Notes.json';
import BaseDetailsPage from './BaseDetailsPage';

class NotesDetailsPage extends BaseDetailsPage {
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

  clickProgressNoteLink = (ProgressNote = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(ProgressNote)
      .click();
  };

  clickDischargeSummaryLink = (DischargeSummary = 1) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(DischargeSummary)
      .click();
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
    cy.get('[data-testid="breadcrumbs"]')
      .find('a')
      .eq(breadcrumb)
      .click();
  };

  verifyProgressNoteLocation = progressLocation => {
    // Verify Progress Note Details Location
    cy.get('[data-testid="progress-location"]').should('be.visible');
    cy.get('[data-testid="progress-location"]').contains(progressLocation);
  };

  verifyProgressNoteSignedBy = progressSignedBy => {
    // Progress Note Details Signed by
    cy.get('[data-testid="note-record-signed-by"]').should('be.visible');
    cy.get('[data-testid="note-record-signed-by"]').contains(progressSignedBy);
  };

  verifyProgressNoteSignedDate = progressSignedDate => {
    cy.get('[data-testid="progress-signed-date"]').should('be.visible');
    cy.get('[data-testid="progress-signed-date"]').contains(progressSignedDate);
  };

  verifyProgressNoteCoSignedBy = progressCoSignedBy => {
    cy.get('[data-testid="note-record-cosigned-by"]').should('be.visible');
    cy.get('[data-testid="note-record-cosigned-by"]').contains(
      progressCoSignedBy,
    );
  };

  verifyProgressNoteRecord = progressNote => {
    cy.get('[data-testid="note-record"]').should('be.visible');
    cy.get('[data-testid="note-record"]').contains(progressNote);
  };

  // ..........Discharge Summary

  verifyDischargeSummaryLocation = summaryLocation => {
    // Discharge Summary Note Details Location
    cy.get('[data-testid="note-record-location"]').should('be.visible');
    cy.get('[data-testid="note-record-location"]').contains(summaryLocation);
  };

  // There may no longer be Addmission date on discharge page
  /*
  verifyDischargeSummaryAdmissionDate = addmissionDate => {
    // Discharge Summary Details Admission Date
    cy.get('[data-testid="note-admission-date"]').should('be.visible');
    cy.get('[data-testid="note-admission-date"]').contains(addmissionDate);
  };
  */
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
