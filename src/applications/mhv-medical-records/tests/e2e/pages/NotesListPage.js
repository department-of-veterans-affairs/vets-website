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
    // Wait for page to load
    cy.get('h1')
      .should('be.visible')
      .and('be.focused');
  };

  verifyCareSummariesAndNotesPageTitle = () => {
    // Very Care Summary Page title Text
    cy.get('[data-testid="care-summaries-and-notes"]').should('be.visible');
  };

  clickNotesDetailsLink = (_NotesIndex = 0) => {
    cy.findAllByTestId('record-list-item')
      .should('be.visible')
      .find('a')
      .eq(_NotesIndex)
      .should('be.visible')
      .click();
    // Wait for detail page to load - check for print menu as indicator
    cy.get('[data-testid="print-download-menu"]', { timeout: 10000 }).should(
      'be.visible',
    );
  };
}

export default new NotesListPage();
