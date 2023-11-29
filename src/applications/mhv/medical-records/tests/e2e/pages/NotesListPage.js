// import defaultNotes from '../fixtures/Notes.json';

class NotesListPage {
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

  clickNotesDetailsLink = (_NotesIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_NotesIndex)
      .click();
  };
}

export default new NotesListPage();
