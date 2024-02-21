import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';
import notes from './fixtures/notes/notes.json';

describe('Medical Records Care Summary Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    NotesListPage.clickGotoNotesLink();
  });

  it('Discharge Summary Details  ', () => {
    // Verify Care Summary Page title
    NotesListPage.verifyCareSummariesAndNotesPageTitle();

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(1);

    NotesDetailsPage.verifyDischargeSummaryTitle(
      notes.entry[1].resource.content[0].attachment.title,
    );

    // Verify Discharge Summary Note Details Location
    NotesDetailsPage.verifyDischargeSummaryLocation('DAYTON');

    // Verify Discharge Summary Details DischargeDate
    NotesDetailsPage.verifyDischargeSummaryDischargeDate('August 9, 2022');
    // Verify Discharge Summary Admitted By --this is currently removed
    // NotesDetailsPage.verifyDischargeSummaryAdmittedBy('AHMED,NAJEEB');

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy('AHMED,MARUF');

    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      'LOCAL TITLE: Discharge Summary',
    );

    // Click Back to Care summaries and notes
    // NotesDetailsPage.clickBreadCrumbsLink(0);

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
