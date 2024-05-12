import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';
import notes from './fixtures/notes/notes-discharge-summaries.json';

describe('Medical Records Care Summary Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    // NotesListPage.clickGotoNotesLink();
  });

  it('Discharge Summary Details, contains Discharge Date  ', () => {
    NotesListPage.clickGotoNotesLink(notes, false);

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(3);

    NotesDetailsPage.verifyDischargeSummaryTitle(
      notes.entry[2].resource.content[0].attachment.title,
    );

    NotesDetailsPage.verifyDischargeSummaryHeadingDate(
      moment(notes.entry[2].resource.context.period.end).format('MMMM D, YYYY'),
    );

    // Verify Discharge Summary Note Location
    NotesDetailsPage.verifyDischargeSummaryLocation(
      notes.entry[2].resource.contained[1].name,
    );

    // Verify Admitted Date
    NotesDetailsPage.verifyDischargeSummaryAdmissionDate('None noted');

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy(
      notes.entry[2].resource.contained[0].name[0].text,
    );
    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      `LOCAL TITLE: ${notes.entry[2].resource.content[0].attachment.title}`,
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
