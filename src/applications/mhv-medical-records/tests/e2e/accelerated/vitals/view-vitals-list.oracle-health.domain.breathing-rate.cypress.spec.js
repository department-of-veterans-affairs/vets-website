import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/breathing-rate.json';

describe('Medical Records View Breathing Rate', () => {
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

    Vitals.goToVitalPage();

    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });

    // check for latest id
    cy.get('[data-testid="vital-respiratory-rate-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-respiratory-rate-measurement"]').contains(
      '13 breaths per minute',
    );

    cy.get('[data-testid="vital-respiratory-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-respiratory-rate-date-timestamp"]').contains(
      'January 18, 2017',
    );

    cy.get('[data-testid="vital-respiratory-rate-review-over-time"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
