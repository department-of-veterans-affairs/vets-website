import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import CareSummaryAndNotes from '../pages/CareSummaryAndNotes';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import careSummaryAndNotesData from '../fixtures/care-summary-and-notes/uhd.json';

describe('Medical Records View Care Summary and Notes - Oracle Health Note Detail', () => {
  const site = new MedicalRecordsSite();
  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingCareNotes: true,
    });
    CareSummaryAndNotes.setIntercepts({ careSummaryAndNotesData });
  });

  it('Fetches oracle-health note details via API and displays them', () => {
    site.loadPage();

    CareSummaryAndNotes.checkLandingPageLinks();
    CareSummaryAndNotes.goToCareSummaryAndNotesPage();

    cy.injectAxeThenAxeCheck();

    // Index 2 in the sorted list is an oracle-health note
    const OH_NOTE_INDEX = 2;
    CareSummaryAndNotes.checkNoteListItem({
      index: OH_NOTE_INDEX,
      title: 'Inpatient Discharge Instructions - VA',
    });
    CareSummaryAndNotes.selectCareSummaryOrNote({ index: OH_NOTE_INDEX });

    // Oracle-health notes require a separate API call for full details
    cy.wait('@clinical_note-detail');

    CareSummaryAndNotes.validateNoteDetailPage({
      title: 'Inpatient Discharge Instructions - VA',
      headerDate: 'July 29, 2025',
      location: '668 Mann-Grandstaff WA VA Medical Center',
      writtenBy: 'Victoria A Borland',
      signedBy: 'Victoria A Borland',
      dateSigned: 'None recorded',
      summaryText: 'Inpatient Discharge Instructions - VA * Final Report *',
    });
  });

  it('Fetches oracle-health discharge summary details via API and displays them', () => {
    site.loadPage();

    CareSummaryAndNotes.checkLandingPageLinks();
    CareSummaryAndNotes.goToCareSummaryAndNotesPage();

    // Index 1 in the sorted list is an oracle-health discharge summary
    const OH_DISCHARGE_INDEX = 1;
    CareSummaryAndNotes.checkDischargeListItem({
      index: OH_DISCHARGE_INDEX,
      title: 'Clinical Summary',
    });
    CareSummaryAndNotes.selectCareSummaryOrNote({ index: OH_DISCHARGE_INDEX });
    cy.injectAxeThenAxeCheck();

    // Oracle-health notes require a separate API call for full details
    cy.wait('@clinical_note-detail');

    CareSummaryAndNotes.validateDischargeDetailPage({
      title: 'Clinical Summary',
      headerDate: 'July 29, 2025',
      location: '668 Mann-Grandstaff WA VA Medical Center',
      dateAdmitted: 'July 29, 2025',
      dateDischarged: 'N/A',
      dischargedBy: 'Victoria A Borland',
      summaryText: 'Clinical Summary * Final Report * Name:SILVA, ALEXANDER',
    });
  });
});
