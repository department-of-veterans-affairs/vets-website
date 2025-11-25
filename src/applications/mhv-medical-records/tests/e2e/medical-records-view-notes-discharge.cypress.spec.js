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

  it('Discharge Summary Details, DS with discharged date', () => {
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
      formatDateMonthDayCommaYear(notes.entry[1].resource.date),
    );
    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy(
      // notes.entry[1].resource.contained[0].name[0].text,
      `${notes.entry[1].resource.contained[0].name[0].given[0]} ${
        notes.entry[1].resource.contained[0].name[0].family
      }`,
    );
    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      `LOCAL TITLE: ${notes.entry[1].resource.content[0].attachment.title}`,
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
