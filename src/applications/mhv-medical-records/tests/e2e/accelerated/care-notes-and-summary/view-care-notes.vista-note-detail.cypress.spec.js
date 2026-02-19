import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import CareSummaryAndNotes from '../pages/CareSummaryAndNotes';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import careSummaryAndNotesData from '../fixtures/care-summary-and-notes/uhd.json';

describe('Medical Records View Care Summary and Notes - Vista Note Detail', () => {
  const site = new MedicalRecordsSite();
  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingCareNotes: true,
    });
    CareSummaryAndNotes.setIntercepts({ careSummaryAndNotesData });
  });

  it('Displays vista note details from list without separate API call', () => {
    site.loadPage();

    CareSummaryAndNotes.checkLandingPageLinks();
    CareSummaryAndNotes.goToCareSummaryAndNotesPage();

    cy.injectAxeThenAxeCheck();

    // Index 3 in the sorted list is a vista progress note
    const VISTA_NOTE_INDEX = 3;
    CareSummaryAndNotes.checkNoteListItem({
      index: VISTA_NOTE_INDEX,
      title: 'CARE COORDINATION HOME TELEHEALTH DISCHARGE NOTE',
    });
    CareSummaryAndNotes.selectCareSummaryOrNote({ index: VISTA_NOTE_INDEX });

    // Vista notes load from the list — no single-note API call should be made
    CareSummaryAndNotes.validateNoteDetailPage({
      title: 'CARE COORDINATION HOME TELEHEALTH DISCHARGE NOTE',
      headerDate: 'January 14, 2025',
      location: 'CHYSHR TEST LAB',
      writtenBy: 'MARCI P MCGUIRE',
      signedBy: 'MARCI P MCGUIRE',
      dateSigned: 'January 14, 2025',
      summaryText: 'This is a test telehealth discharge note.',
    });
  });
});
