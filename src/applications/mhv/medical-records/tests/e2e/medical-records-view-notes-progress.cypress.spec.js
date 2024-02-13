import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';

describe('Medical Records Care Summary Page ', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    NotesListPage.clickGotoNotesLink();
  });

  it('Progress Note Details', () => {
    // Very Care Summary Page title Text
    NotesDetailsPage.verifyCareSummaryPageText();
    // should display Progress Note
    NotesDetailsPage.clickProgressNoteLink(0);

    // Verify Progress Note Details Location
    NotesDetailsPage.verifyProgressNoteLocation('DAYTSHR TEST LAB');
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy('AHMED,MARUF');
    // Verify Progress Note Details Signed Date
    NotesDetailsPage.verifyProgressNoteSignedDate('August 5, 2022');
    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord(
      'LOCAL TITLE: Adverse React/Allergy',
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
