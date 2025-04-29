import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/temperature.json';

describe('Medical Records View Temperature', () => {
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

    Vitals.goToVitalPage();

    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });

    // check for latest id
    cy.get('[data-testid="vital-body-temperature-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-body-temperature-measurement"]').contains(
      '39.134 Cel',
    );

    cy.get('[data-testid="vital-body-temperature-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-body-temperature-date-timestamp"]').contains(
      'December 29, 2004',
    );

    cy.get('[data-testid="vital-body-temperature-review-over-time"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
