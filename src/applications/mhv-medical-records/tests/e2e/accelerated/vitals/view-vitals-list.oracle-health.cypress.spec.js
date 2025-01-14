import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital List', () => {
    site.loadPage();

    // check for MY Va Health links
    Vitals.checkLandingPageLinks();

    Vitals.goToVitalPage();

    const today = new Date();
    const timeFrame = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    Vitals.checkUrl({ timeFrame });

    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 16; // 8 per page * 2 for printing
    cy.get('va-card').should('have.length', CARDS_PER_PAGE);

    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").should('not.be.empty');
  });
});
