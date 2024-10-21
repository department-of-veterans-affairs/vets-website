import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';
import notes from './fixtures/notes/notes.json';

describe('Medical Records Care Summary Page ', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    NotesListPage.clickGotoNotesLink();
  });

  it('Progress Note Details', () => {
    NotesDetailsPage.clickProgressNoteLink(0);

    NotesDetailsPage.verifyProgressNoteTitle(
      notes.entry[4].resource.content[0].attachment.title,
    );

    // NOTE: consult result notes use the progress note component
    // Verify Progress Note Details Location
    NotesDetailsPage.verifyProgressNoteLocation(
      notes.entry[4].resource.contained[0].name,
    );
    // Verify Progress Note Details Written by
    NotesDetailsPage.verifyProgressNoteWrittenBy(
      // notes.entry[4].resource.contained[1].name[0].text,
      'JOHN TESTER',
    );
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy(
      // notes.entry[4].resource.contained[2].name[0].text,
      'JOHN TESTER',
    );
    // Verify Progress Note Details Signed Date
    NotesDetailsPage.verifyProgressNoteSignedDate(
      moment(
        notes.entry[4].resource.authenticator.extension[0].valueDateTime,
      ).format('MMMM D, YYYY'),
    );
    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord(
      `LOCAL TITLE: ${notes.entry[4].resource.content[0].attachment.title}`, // ADHC CONSULT RESULTS
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
