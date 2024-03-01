import moment from 'moment';
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

    // Verify Discharge Summary Note Location
    NotesDetailsPage.verifyDischargeSummaryLocation(
      notes.entry[1].resource.contained[1].name,
    );
    // Verify Discharged Date
    NotesDetailsPage.verifyDischargeSummaryDischargeDate(
      moment(notes.entry[1].resource.date).format('MMMM D, YYYY'),
    );
    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy(
      notes.entry[1].resource.contained[0].name[0].text,
    );
    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      `LOCAL TITLE: ${notes.entry[1].resource.content[0].attachment.title}`,
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
