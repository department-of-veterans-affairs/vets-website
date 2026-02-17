import { format, subMonths } from 'date-fns';
import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import CareSummaryAndNotes from '../pages/CareSummaryAndNotes';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import careSummaryAndNotesData from '../fixtures/care-summary-and-notes/uhd.json';

describe('Medical Records View Lab and Tests', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2024, 0, 25); // January 25, 2024
  beforeEach(() => {
    cy.clock(mockDate, ['Date']);

    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingCareNotes: true,
    });
    CareSummaryAndNotes.setIntercepts({ careSummaryAndNotesData });
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
    CareSummaryAndNotes.checkTimeFrameDisplay({
      fromDate: fromDisplay,
      toDate: toDisplay,
    });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 6;
    cy.get(
      'ul.record-list-items.no-print [data-testid="record-list-item"]',
    ).should('have.length', CARDS_PER_PAGE);
    cy.get("[data-testid='filter-display-message']").should('be.visible');
    cy.get("[data-testid='filter-display-message']").should('not.be.empty');

    CareSummaryAndNotes.selectDateRange({
      option: '2023',
    });
    CareSummaryAndNotes.checkTimeFrameDisplayForYear({ year: '2023' });

    const DISCHARGE_INDEX = 1;
    CareSummaryAndNotes.checkDischargeListItem({ index: DISCHARGE_INDEX });
    CareSummaryAndNotes.selectCareSummaryOrNote({ index: DISCHARGE_INDEX });

    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .should('have.attr', 'href');

    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .contains('Back')
      .click();

    // Maintaining the same timeFrame across page clicks
    CareSummaryAndNotes.checkTimeFrameDisplayForYear({ year: '2023' });
  });
});
