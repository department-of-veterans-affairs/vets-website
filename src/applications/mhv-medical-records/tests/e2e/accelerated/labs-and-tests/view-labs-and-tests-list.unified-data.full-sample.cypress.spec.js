import { format, subMonths } from 'date-fns';
import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/uhd.json';

describe('Medical Records View Lab and Tests', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2024, 0, 25); // January 25, 2024
  beforeEach(() => {
    cy.clock(mockDate, ['Date']);

    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: false,
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
    // go to a specific lab
    LabsAndTests.selectLabAndTest({
      labName: 'CH - FULL SAMPLE',
    });

    cy.get('[data-testid="header-time"]').should('be.visible');
    cy.get('[data-testid="header-time"]').contains('January 23, 2025');

    cy.get('[data-testid="lab-and-test-code"]').should('be.visible');
    cy.get('[data-testid="lab-and-test-code"]').contains('CH');

    cy.get('[data-testid="lab-and-test-sample-tested"]').should('be.visible');
    cy.get('[data-testid="lab-and-test-sample-tested"]').contains('SERUM');

    cy.get('[data-testid="lab-and-test-body-site"]').should('be.visible');
    cy.get('[data-testid="lab-and-test-body-site"]').contains('Central Vien');

    cy.get('[data-testid="lab-and-test-ordered-by"]').should('be.visible');
    cy.get('[data-testid="lab-and-test-ordered-by"]').contains(
      'ZZGeorge Washington',
    );

    cy.get('[data-testid="lab-and-test-collecting-location"]').should(
      'be.visible',
    );
    cy.get('[data-testid="lab-and-test-collecting-location"]').contains(
      'CHYSHR TEST LAB',
    );
  });
});
