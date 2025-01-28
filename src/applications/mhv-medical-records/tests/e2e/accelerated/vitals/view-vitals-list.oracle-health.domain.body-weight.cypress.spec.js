import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/body-weight.json';

describe('Medical Records View Body Weight', () => {
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
    // switch to march 2024
    Vitals.selectMonthAndYear({ month: '3', year: 2024 });
    Vitals.verifySelectedDate({ dateString: 'March 2024' });
    // check for latest id
    cy.get('[data-testid="vital-body-weight-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-body-weight-measurement"]').contains('88.6 kg');

    cy.get('[data-testid="vital-body-weight-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-body-weight-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.get('[data-testid="vital-body-weight-review-over-time"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
