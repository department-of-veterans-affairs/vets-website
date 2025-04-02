import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/pain-severity.json';

describe('Medical Records View Pain Severity', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vitals List', () => {
    site.loadPage();

    // check for MY Va Health links
    Vitals.checkLandingPageLinks();

    Vitals.goToVitalPage();

    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });

    // check for latest id
    cy.get(
      '[data-testid="vital-pain-severity-0-10-verbal-numeric-rating-score-reported-measurement"]',
    ).should('be.visible');
    cy.get(
      '[data-testid="vital-pain-severity-0-10-verbal-numeric-rating-score-reported-measurement"]',
    ).contains('1 {score}');

    cy.get(
      '[data-testid="vital-pain-severity-0-10-verbal-numeric-rating-score-reported-date-timestamp"]',
    ).should('be.visible');
    cy.get(
      '[data-testid="vital-pain-severity-0-10-verbal-numeric-rating-score-reported-date-timestamp"]',
    ).contains('January 1, 2014');

    cy.get(
      '[data-testid="vital-pain-severity-0-10-verbal-numeric-rating-score-reported-review-over-time"]',
    ).should('be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
