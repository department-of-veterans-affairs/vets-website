import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/blood-pressure.json';

describe('Medical Records View Blood Pressure', () => {
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

    Vitals.goToVitalPage();
    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });
    // check for latest id
    cy.get('[data-testid="vital-blood-pressure-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-pressure-measurement"]').contains(
      '130/81',
    );

    cy.get('[data-testid="vital-blood-pressure-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-pressure-date-timestamp"]').contains(
      'March 26, 2024',
    );

    cy.get('[data-testid="vital-blood-pressure-review-over-time"]').should(
      'be.visible',
    );

    // Axe check
    cy.injectAxeThenAxeCheck();
  });
});
