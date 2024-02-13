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
    NotesDetailsPage.verifyProgressNoteLocation('DAYTSHR TEST LAB');
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy('AHMED,MARUF');
    // Verify Progress Note Details Signed Date
    NotesDetailsPage.verifyProgressNoteSignedDate('August 8, 2022');
    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord(
      'LOCAL TITLE: Adverse React/Allergy',
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
