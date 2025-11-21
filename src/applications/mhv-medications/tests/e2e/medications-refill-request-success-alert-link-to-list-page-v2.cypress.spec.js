import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.v2.json';
import mockToggles from './fixtures/toggles-response.json';

describe('Medications Refill Success Alert Message Link (v2)', () => {
  beforeEach(() => {
    const site = new MedicationsSite();
    // Mock feature flag for v2 endpoint
    const baseFeatures = mockToggles.data.features.filter(
      f => f.name !== 'mhv_medications_cerner_pilot',
    );
    const mockTogglesV2 = {
      data: {
        type: 'feature_toggles',
        features: [
          ...baseFeatures,
          { name: 'mhv_medications_cerner_pilot', value: true },
        ],
      },
    };

    cy.intercept('GET', `my_health/v1/prescriptions/*`, () => {
      // fail the test if v1 endpoint is called
      throw new Error(
        'v1 endpoint should not be called when Cerner pilot flag is enabled',
      );
    });
    site.login();
    cy.intercept('GET', '/v0/feature_toggles?*', mockTogglesV2).as(
      'featureToggles',
    );
  });

  it('visits Medications List Link on Success Alert with v2 endpoint', () => {
    const refillPage = new MedicationsRefillPage();
    refillPage.loadRefillPage(prescriptions, 'my_health/v2');
    cy.injectAxeThenAxeCheck();
    refillPage.verifyRefillPageTitle();

    refillPage.clickPrescriptionRefillCheckboxForSuccessfulRequestV2();

    refillPage.clickRequestRefillButtonForSuccessfulRequestsV2(successRequest);

    refillPage.verifyRefillRequestSuccessConfirmationMessage();
  });
});
