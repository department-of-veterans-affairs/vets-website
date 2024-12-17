import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/blood-oxygen.json';

describe('Medical Records View Blood Oxygen', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital list', () => {
    site.loadPage();

    // check for MY Va Health links
    Vitals.checkLandingPageLinks();

    Vitals.goToVitalPage();

    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });

    // check for latest id
    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-measurement"]',
    ).should('be.visible');
    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-measurement"]',
    ).contains('84 %');

    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-date-timestamp"]',
    ).should('be.visible');
    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-date-timestamp"]',
    ).contains('August 8, 2013');

    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-review-over-time"]',
    ).should('be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
