import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2025, 9, 15); // October 15, 2025

  beforeEach(() => {
    cy.clock(mockDate, ['Date']);

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

    const today = mockDate;
    const timeFrame = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    Vitals.checkUrl({ timeFrame });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 14; // 7 per page * 2 for printing
    cy.get('va-card').should('have.length', CARDS_PER_PAGE);
    cy.get('va-card').should('not.contain', 'Pain severity');

    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").should('not.be.empty');
  });
});
