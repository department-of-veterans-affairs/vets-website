import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import CareSummaryAndNotes from '../pages/CareSummaryAndNotes';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import careSummaryAndNotesData from '../fixtures/care-summary-and-notes/uhd.json';

describe('Medical Records View Care Summary and Notes', () => {
  const site = new MedicalRecordsSite();
  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingCareNotes: true,
    });
    CareSummaryAndNotes.setIntercepts({ careSummaryAndNotesData });
  });

  afterEach(() => {});

  it('Visits View Care Summary and Notes Page List', () => {
    site.loadPage();

    // check for MY Va Health links
    CareSummaryAndNotes.checkLandingPageLinks();

    CareSummaryAndNotes.goToCareSummaryAndNotesPage();

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 6;
    cy.get(
      'ul.record-list-items.no-print [data-testid="record-list-item"]',
    ).should('have.length', CARDS_PER_PAGE);
    const NOTE_INDEX = 2;
    CareSummaryAndNotes.checkNoteListItem({ index: NOTE_INDEX });
    CareSummaryAndNotes.selectCareSummaryOrNote({ index: NOTE_INDEX });
    CareSummaryAndNotes.validateNoteDetailPage();
  });
});
