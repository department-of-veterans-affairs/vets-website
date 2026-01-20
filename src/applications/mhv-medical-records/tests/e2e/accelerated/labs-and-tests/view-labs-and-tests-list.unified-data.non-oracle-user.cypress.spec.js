import { format, subMonths } from 'date-fns';
import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import testUser from '../fixtures/user/non-oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/uhd.json';

describe('Medical Records View Lab and Tests', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2024, 0, 25); // January 25, 2024
  beforeEach(() => {
    cy.clock(mockDate, ['Date']);

    site.login(testUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingLabsAndTests: true,
    });
    LabsAndTests.setIntercepts({ labsAndTestData });
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('Visits View Labs And Test Page List', () => {
    site.loadPage();

    // // check for MY Va Health links
    LabsAndTests.checkLandingPageLinks();

    LabsAndTests.goToLabAndTestPage();

    const today = mockDate;
    const fromDisplay = format(subMonths(today, 3), 'MMMM d, yyyy');
    const toDisplay = format(today, 'MMMM d, yyyy');
    LabsAndTests.checkTimeFrameDisplay({
      fromDate: fromDisplay,
      toDate: toDisplay,
    });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 3;
    cy.get(
      'ul.record-list-items.no-print [data-testid="record-list-item"]',
    ).should('have.length', CARDS_PER_PAGE);
    cy.get("[data-testid='filter-display-message']").should('be.visible');
    cy.get("[data-testid='filter-display-message']").should('not.be.empty');
  });
});
