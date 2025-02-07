import MedicalRecordsSite from '../mr_site/MedicalRecordsSite';
import Vitals from './pages/Vitals';
import oracleHealthUser from './fixtures/user/oracle-health.json';
import vitalsData from './fixtures/vitals/blood-oxygen.json';

describe('Medical Records Loading screen', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
    cy.visit('my-health/medical-records');
  });

  it('Loading Visits View Vitals List', () => {
    // There was a bug that only happen when the redux state was in a loading state, but the page was still shown.
    // This caused the experience to be wonky and cause the page to jump and display wrong information.
    Vitals.goToVitalPage();

    cy.injectAxeThenAxeCheck();
  });
});
