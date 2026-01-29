import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';
import notes from './fixtures/notes/notes.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';

describe('Medical Records Care Summary Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // Given Navigate to Notes Page
    NotesListPage.gotoNotesList();
  });

  it('Progress Note Details', () => {
    NotesDetailsPage.clickProgressNoteLink('ADHC CONSULT RESULTS');

    NotesDetailsPage.verifyProgressNoteTitle(
      notes.entry[4].resource.content[0].attachment.title,
    );

    // NOTE: consult result notes use the progress note component
    // Verify Progress Note Details Location
    NotesDetailsPage.verifyProgressNoteLocation(
      notes.entry[4].resource.contained[0].name,
    );

    // Verify Progress Note Details Written by
    NotesDetailsPage.verifyProgressNoteWrittenBy('JOHN TESTER');
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy('JOHN TESTER');

    NotesDetailsPage.verifyProgressNoteSignedDate(
      formatDateMonthDayCommaYear(
        notes.entry[4].resource.authenticator.extension[0].valueDateTime,
      ),
    );

    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord(
      `LOCAL TITLE: ${notes.entry[4].resource.content[0].attachment.title}`, // ADHC CONSULT RESULTS
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
