import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/heart-rate.json';

describe('Medical Records View Heart Rate', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    cy.visit('my-health/medical-records');
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital List', () => {
    site.loadPage();

    // check for MY Va Health links
    Vitals.checkLandingPageLinks();

    Vitals.goToVitalPage();

    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });
    // check for latest id
    cy.get('[data-testid="vital-heart-rate-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-heart-rate-measurement"]').contains(
      '98 beats per minute',
    );

    cy.get('[data-testid="vital-heart-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-heart-rate-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.get('[data-testid="vital-heart-rate-review-over-time"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
