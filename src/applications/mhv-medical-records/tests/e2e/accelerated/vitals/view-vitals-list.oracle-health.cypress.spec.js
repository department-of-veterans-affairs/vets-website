import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    // Freeze time to stabilize timeframe-dependent URL assertions (UTC to local differences on CI)
    // Use a fixed date in October 2025 to align with CI expectation logic
    const fixedDate = new Date('2025-10-15T12:00:00Z');
    cy.clock(fixedDate.getTime(), ['Date']);
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: false,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital List', () => {
    site.loadPage();

    Vitals.goToVitalPage();

    const timeFrame = '2025-10';
    Vitals.checkUrl({ timeFrame });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 14; // 7 per page * 2 for printing
    cy.get('va-card').should('have.length', CARDS_PER_PAGE);
    cy.get('va-card').should('not.contain', 'Pain severity');

    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").should('not.be.empty');
  });
});
