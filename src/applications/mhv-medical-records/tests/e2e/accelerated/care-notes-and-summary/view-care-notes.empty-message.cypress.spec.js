import { format, subMonths } from 'date-fns';
import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import CareSummaryAndNotes from '../pages/CareSummaryAndNotes';
import oracleHealthUser from '../fixtures/user/oracle-health.json';

describe('Medical Records View Care Summary and Notes', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2024, 0, 25);
  beforeEach(() => {
    cy.clock(mockDate, ['Date']);

    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingCareNotes: true,
    });
    CareSummaryAndNotes.setIntercepts({ careSummaryAndNotesData: [] });
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('Visits View Care Summary and Notes Page List', () => {
    site.loadPage();

    CareSummaryAndNotes.checkLandingPageLinks();

    CareSummaryAndNotes.goToCareSummaryAndNotesPage();

    const today = mockDate;
    const fromDisplay = format(subMonths(today, 3), 'MMMM d, yyyy');
    const toDisplay = format(today, 'MMMM d, yyyy');
    CareSummaryAndNotes.checkNoRecordsTimeFrameDisplay({
      fromDate: fromDisplay,
      toDate: toDisplay,
    });

    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="no-records-message"]').should('be.visible');
    cy.get('[data-testid="no-records-message"]').should(
      'contain.text',
      `There are no care summaries and notes in your VA medical records for`,
    );
  });
});
