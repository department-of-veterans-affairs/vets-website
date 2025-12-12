import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import Vitals from './pages/VitalsLighthouse';
import oracleHealthUser from './fixtures/user-oracle-health.json';
import vitalsData from './fixtures/vitals-sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();
  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: false, // Testing the isCerner LH implementation
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital List', () => {
    site.loadPage();
    Vitals.goToVitalPage();
    cy.injectAxeThenAxeCheck();

    const CARDS_PER_PAGE = 14; // 7 per page * 2 for printing
    cy.get('va-card').should('have.length', CARDS_PER_PAGE);
    cy.get('va-card').should('not.contain', 'Pain severity');

    Vitals.checkPulseOx();
    Vitals.checkBloodPressure();
    Vitals.checkHeight();
    Vitals.checkWeight();
    Vitals.checkRespiration();
    Vitals.checkHeartRate();
    Vitals.checkTemperature();
  });
});
