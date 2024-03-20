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
    // Verify Care Summary Page title
    NotesListPage.verifyCareSummariesAndNotesPageTitle();

    NotesDetailsPage.clickProgressNoteLink(0);

    NotesDetailsPage.verifyProgressNoteTitle(
      notes.entry[0].resource.content[0].attachment.title,
    );

    // Verify Progress Note Details Location
    NotesDetailsPage.verifyProgressNoteLocation(
      notes.entry[0].resource.contained[1].name,
    );
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy(
      notes.entry[0].resource.contained[0].name[0].text,
    );
    // Verify Progress Note Details Cosigned by
    NotesDetailsPage.verifyProgressNoteCoSignedBy(
      notes.entry[0].resource.contained[2].name[0].text,
    );
    // Verify Progress Note Details Signed Date
    NotesDetailsPage.verifyProgressNoteSignedDate(
      moment(
        notes.entry[0].resource.authenticator.extension[0].valueDateTime,
      ).format('MMMM D, YYYY'),
    );
    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord(
      `LOCAL TITLE: ${notes.entry[0].resource.content[0].attachment.title}`,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
