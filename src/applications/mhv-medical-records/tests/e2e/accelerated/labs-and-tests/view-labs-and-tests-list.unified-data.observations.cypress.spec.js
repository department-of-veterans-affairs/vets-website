import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/uhd.json';

describe('Medical Records View Lab and Tests', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
      isAcceleratingLabsAndTests: true,
    });
    LabsAndTests.setIntercepts({ labsAndTestData });
  });

  it('Visits View Labs And Test Page List', () => {
    site.loadPage();

    // // check for MY Va Health links
    LabsAndTests.checkLandingPageLinks();

    LabsAndTests.goToLabAndTestPage();

    const today = new Date();
    const timeFrame = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    LabsAndTests.checkUrl({ timeFrame });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 6; // 3 per page * 2 for printing
    cy.get('va-card').should('have.length', CARDS_PER_PAGE);
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
