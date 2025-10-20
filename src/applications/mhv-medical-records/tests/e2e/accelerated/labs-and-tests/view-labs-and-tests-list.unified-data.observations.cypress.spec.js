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

    LabsAndTests.checkUrl({ rangeIndex: '0' });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 3;
    cy.get(':nth-child(4) > [data-testid="record-list-item"]').should(
      'have.length',
      CARDS_PER_PAGE,
    );
    cy.get("[data-testid='filter-display-message']").should('be.visible');
    cy.get("[data-testid='filter-display-message']").should('not.be.empty');
    // go to a specific lab
    LabsAndTests.selectLabAndTest({
      labName: 'CH - FULL SAMPLE',
    });

    cy.get('.test-results-header').should('be.visible');
    cy.get('.test-results-header').contains('Results');
    // cy.get('.result-cards') should have 2 items
    cy.get('.result-cards > li').should('have.length', 2);
  });
});
