import defaultNotes from '../fixtures/notes/notes.json';
import BaseListPage from './BaseListPage';

class NotesListPage extends BaseListPage {
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
}

export default new NotesListPage();
