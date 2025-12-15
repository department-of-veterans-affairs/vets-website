import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';
import NotesListPage from './pages/NotesListPage';
import notes from './fixtures/notes/notes-discharge-summaries.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';

describe('Medical Records Care Summary Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // Given Navigate to Notes Page
    NotesListPage.gotoNotesList(notes, false);
  });

  it('Discharge Summary Details, contains admitted date', () => {
    NotesDetailsPage.clickDischargeSummaryLink(5);

    NotesDetailsPage.verifyDischargeSummaryTitle(
      notes.entry[0].resource.content[0].attachment.title,
    );

    NotesDetailsPage.verifyDischargeSummaryHeadingDate(
      formatDateMonthDayCommaYear(notes.entry[0].resource.context.period.start),
    );

    // Verify Discharge Summary Note Location
    NotesDetailsPage.verifyDischargeSummaryLocation(
      notes.entry[0].resource.contained[1].name,
    );

    // Verify Admitted Date
    NotesDetailsPage.verifyDischargeSummaryDischargeDate('None recorded');

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy(
      // notes.entry[0].resource.contained[0].name[0].text,
      `${notes.entry[1].resource.contained[0].name[0].given[0]} ${
        notes.entry[1].resource.contained[0].name[0].family
      }`,
    );

    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      `LOCAL TITLE: ${notes.entry[0].resource.content[0].attachment.title}`,
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('Discharge Summary Details, contains Discharge Date  ', () => {
    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(3);

    NotesDetailsPage.verifyDischargeSummaryTitle(
      notes.entry[2].resource.content[0].attachment.title,
    );

    NotesDetailsPage.verifyDischargeSummaryHeadingDate(
      formatDateMonthDayCommaYear(notes.entry[2].resource.context.period.end),
    );

    // Verify Discharge Summary Note Location
    NotesDetailsPage.verifyDischargeSummaryLocation(
      notes.entry[2].resource.contained[1].name,
    );

    // Verify Admitted Date
    NotesDetailsPage.verifyDischargeSummaryAdmissionDate('None recorded');

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy(
      // notes.entry[2].resource.contained[0].name[0].text,
      `${notes.entry[2].resource.contained[0].name[0].given[0]} ${
        notes.entry[2].resource.contained[0].name[0].family
      }`,
    );
    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      `LOCAL TITLE: ${notes.entry[2].resource.content[0].attachment.title}`,
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('Discharge Summary Details, does not contain admitted/discharge date', () => {
    NotesDetailsPage.clickDischargeSummaryLink(1);

    NotesDetailsPage.verifyDischargeSummaryTitle(
      notes.entry[4].resource.content[0].attachment.title,
    );

    NotesDetailsPage.verifyDischargeSummaryHeadingDate(
      formatDateMonthDayCommaYear(notes.entry[4].resource.date),
    );

    // Verify Discharge Summary Note Location
    NotesDetailsPage.verifyDischargeSummaryLocation(
      notes.entry[4].resource.contained[1].name,
    );

    NotesDetailsPage.verifyDischargeSummaryAdmissionDate('None recorded');
    NotesDetailsPage.verifyDischargeSummaryDischargeDate('None recorded');

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy(
      // notes.entry[4].resource.contained[0].name[0].text,
      `${notes.entry[4].resource.contained[0].name[0].given[0]} ${
        notes.entry[4].resource.contained[0].name[0].family
      }`,
    );

    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      `LOCAL TITLE: ${notes.entry[4].resource.content[0].attachment.title}`,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
