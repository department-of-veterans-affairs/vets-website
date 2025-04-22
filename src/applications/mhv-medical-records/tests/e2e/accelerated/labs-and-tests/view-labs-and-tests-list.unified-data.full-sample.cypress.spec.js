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

    LabsAndTests.goToVitalPage();

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
    cy.contains('CH - FULL SAMPLE').click();

    cy.get('[data-testid="lab-name"]').should('be.visible');
    cy.get('[data-testid="lab-name"]').contains('CH - FULL SAMPLE');

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
