import defaultNotes from '../fixtures/notes/notes.json';
import BaseListPage from './BaseListPage';

class NotesListPage extends BaseListPage {
  gotoNotesList = (notes = defaultNotes) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/clinical_notes',
      notes,
    ).as('notesList');
    cy.visit('my-health/medical-records/summaries-and-notes');
    cy.wait([
      '@notesList',
      '@vamcEhr',
      '@mockUser',
      '@featureToggles',
      '@maintenanceWindow',
      '@status',
    ]);
  };

  verifyCareSummariesAndNotesPageTitle = () => {
    // Very Care Summary Page title Text
    cy.get('[data-testid="care-summaries-and-notes"]').should('be.visible');
  };

  clickNotesDetailsLink = (_NotesIndex = 0) => {
    cy.findAllByTestId('record-list-item')
      .find('a')
      .eq(_NotesIndex)
      .click();
  };
}

export default new NotesListPage();
